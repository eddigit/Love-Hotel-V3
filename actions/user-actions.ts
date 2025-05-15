"use server"

import { sql } from "@/lib/db"
import { calculateMatchScore } from "@/utils/matching-algorithm"
import { createNotification } from "@/actions/notification-actions"

export async function getUserProfile(userId: string) {
  const user = await sql`
    SELECT u.id as user_id, u.*, up.id as profile_id, up.*
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE u.id = ${userId}
  `

  const photos = await sql`
    SELECT * FROM photos
    WHERE user_id = ${userId}
    ORDER BY is_primary DESC
  `

  const preferences = await sql`
    SELECT * FROM user_preferences
    WHERE user_id = ${userId}
  `

  const meetingTypes = await sql`
    SELECT * FROM user_meeting_types
    WHERE user_id = ${userId}
  `

  return {
    user: user[0] || null,
    photos: photos || [],
    preferences: preferences[0] || null,
    meetingTypes: meetingTypes[0] || null,
  }
}

export async function getUserMatches(userId: string) {
  const matches = await sql`
    SELECT
      um.*,
      u1.name as user1_name,
      u1.avatar as user1_avatar,
      u2.name as user2_name,
      u2.avatar as user2_avatar
    FROM user_matches um
    JOIN users u1 ON um.user_id_1 = u1.id
    JOIN users u2 ON um.user_id_2 = u2.id
    WHERE um.user_id_1 = ${userId} OR um.user_id_2 = ${userId}
    ORDER BY um.match_score DESC
  `

  return matches || []
}

export async function getDiscoverProfiles(currentUserId: string) {
  const profiles = await sql`
    SELECT
      u.id,
      u.name,
      u.avatar as image, -- Alias avatar to image to match UserProfile interface
      up.age,
      up.location,
      up.orientation,
      up.status,
      up.gender,
      up.birthday,
      up.bio,
      up.interests, -- This is a JSON string
      -- Add a simple way to determine online status (e.g., last_active within X minutes)
      -- For now, we'll mock it or leave it out until a proper presence system is built
      true as online, -- Placeholder for online status
      false as featured -- Placeholder for featured status
      -- We will need to fetch preferences separately or join them if needed for the UserProfile structure
    FROM users u
    JOIN user_profiles up ON u.id = up.user_id
    WHERE u.id != ${currentUserId}
    -- Add any other initial filtering if necessary (e.g., only show completed profiles)
    -- ORDER BY RANDOM() -- Or some other logic for discovery, e.g., last active, new users
    LIMIT 50; -- Limit the number of profiles for now
  `
  // The UserProfile interface in matching-algorithm.ts expects a nested 'preferences' object.
  // We'll need to map the fetched data to this structure.
  // For now, this action will return a simpler structure, and the page component will adapt or we'll refine this.
  return profiles.map(profile => ({
    ...profile,
    // Attempt to parse interests if it's a JSON string, otherwise default to empty array
    interests: profile.interests ? JSON.parse(profile.interests) : [],
    // Mocking preferences for now as it's a complex object
    // In a real scenario, you'd fetch and structure this properly
    preferences: {
      status: profile.status,
      age: profile.age,
      orientation: profile.orientation,
      interestedInRestaurant: false, // Mock
      interestedInEvents: false, // Mock
      interestedInDating: true, // Mock
      preferCurtainOpen: false, // Mock
      interestedInLolib: false, // Mock
      suggestions: "", // Mock
      meetingTypes: { friendly: false, romantic: false, playful: false, openCurtains: false, libertine: false }, // Mock
      openToOtherCouples: false, // Mock
      specificPreferences: "", // Mock
      joinExclusiveEvents: false, // Mock
      premiumAccess: false, // Mock
    }
  }));
}

// Send a match request (creates a pending match if not already exists)
export async function sendMatchRequest(requesterId: string, receiverId: string) {
  console.log("sendMatchRequest called", { requesterId, receiverId })
  if (requesterId === receiverId) return { success: false, error: "Vous ne pouvez pas vous matcher vous-même." }
  // Check if receiver exists
  const receiverExists = await sql`SELECT 1 FROM users WHERE id = ${receiverId} LIMIT 1`
  if (receiverExists.length === 0) {
    return { success: false, error: "L'utilisateur cible n'existe pas." }
  }
  try {
    // Check if a match already exists (in either direction)
    const existing = await sql`
      SELECT * FROM user_matches
      WHERE (user_id_1 = ${requesterId} AND user_id_2 = ${receiverId})
         OR (user_id_1 = ${receiverId} AND user_id_2 = ${requesterId})
    `
    console.log("Existing match: ", existing)
    if (existing.length > 0) {
      const status = existing[0].status
      if (status === "pending") return { success: false, error: "Demande déjà envoyée." }
      if (status === "accepted") return { success: false, error: "Vous êtes déjà en match." }
      // If previously rejected, allow to send again (optional: you can block this if you want)
    }
    // Fetch both user profiles for score calculation
    const requesterProfile = await getUserProfile(requesterId)
    const receiverProfile = await getUserProfile(receiverId)
    let matchScore = null
    if (requesterProfile.user && receiverProfile.user) {
      matchScore = calculateMatchScore(requesterProfile.user, receiverProfile.user)
    }
    const result = await sql`
      INSERT INTO user_matches (user_id_1, user_id_2, status, match_score)
      VALUES (${requesterId}, ${receiverId}, 'pending', ${matchScore})
      ON CONFLICT (user_id_1, user_id_2) DO UPDATE SET status = 'pending', updated_at = CURRENT_TIMESTAMP, match_score = ${matchScore}
    `
    // Send notification to receiver
    await createNotification({
      userId: receiverId,
      type: 'match_request',
      title: 'Nouvelle demande de match',
      description: 'Vous avez reçu une nouvelle demande de match.',
      link: '/matches',
    })
    console.log("Insert/Update result: ", result)
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande:", error)
    return { success: false, error: "Erreur lors de l'envoi de la demande." }
  }
}

// Accept a match request (receiver accepts request from requester)
export async function acceptMatchRequest(requesterId: string, receiverId: string) {
  try {
    const result = await sql`
      UPDATE user_matches
      SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
      WHERE user_id_1 = ${requesterId} AND user_id_2 = ${receiverId} AND status = 'pending'
    `
    if (result.count === 0) return { success: false, error: "Aucune demande à accepter." }
    // Send notification to requester
    await createNotification({
      userId: requesterId,
      type: 'match_accepted',
      title: 'Votre demande de match a été acceptée',
      description: 'Votre demande de match a été acceptée !',
      link: '/matches',
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: "Erreur lors de l'acceptation." }
  }
}

// Decline a match request (receiver declines request from requester)
export async function declineMatchRequest(requesterId: string, receiverId: string) {
  try {
    const result = await sql`
      UPDATE user_matches
      SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
      WHERE user_id_1 = ${requesterId} AND user_id_2 = ${receiverId} AND status = 'pending'
    `
    if (result.count === 0) return { success: false, error: "Aucune demande à refuser." }
    return { success: true }
  } catch (error) {
    return { success: false, error: "Erreur lors du refus." }
  }
}

// Get the match status between two users (returns 'pending', 'accepted', 'rejected', or null)
export async function getMatchStatus(userA: string, userB: string) {
  const match = await sql`
    SELECT status, user_id_1, user_id_2 FROM user_matches
    WHERE (user_id_1 = ${userA} AND user_id_2 = ${userB})
       OR (user_id_1 = ${userB} AND user_id_2 = ${userA})
    LIMIT 1
  `
  if (match.length === 0) return null
  return match[0]
}

// Get all incoming match requests for a user (where they are the receiver and status is pending)
export async function getIncomingMatchRequests(userId: string) {
  return await sql`
    SELECT * FROM user_matches
    WHERE user_id_2 = ${userId} AND status = 'pending'
    ORDER BY created_at DESC
  `
}

// Get all outgoing match requests for a user (where they are the requester and status is pending)
export async function getOutgoingMatchRequests(userId: string) {
  return await sql`
    SELECT * FROM user_matches
    WHERE user_id_1 = ${userId} AND status = 'pending'
    ORDER BY created_at DESC
  `
}

export async function getAllUsers() {
  const users = await sql`
    SELECT u.id, u.name, u.email, u.role, u.avatar, up.location, up.age
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    ORDER BY u.created_at DESC
  `
  return users || []
}

export async function updateUserByAdmin(userId: string, { name, email, role, avatar }: { name?: string, email?: string, role?: string, avatar?: string }) {
  const [user] = await sql`
    UPDATE users
    SET
      name = COALESCE(${name}, name),
      email = COALESCE(${email}, email),
      role = COALESCE(${role}, role),
      avatar = COALESCE(${avatar}, avatar)
    WHERE id = ${userId}
    RETURNING *
  `
  return user
}

export async function deleteUserByAdmin(userId: string) {
  await sql`
    DELETE FROM users WHERE id = ${userId}
  `
  return { success: true }
}

// Get new users count grouped by day/week/month
export async function getNewUsersStats({ startDate, endDate, scale }: { startDate: string, endDate: string, scale: "day"|"week"|"month" }) {
  let dateTrunc;
  if (scale === "day") {
    dateTrunc = "TO_CHAR(DATE(created_at), 'YYYY-MM-DD')";
  } else if (scale === "week") {
    dateTrunc = "TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD')";
  } else {
    dateTrunc = "TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM-DD')";
  }
  const query = `
    SELECT ${dateTrunc} as period, COUNT(*) as count
    FROM users
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY period
    ORDER BY period ASC
  `;
  const stats = await sql.query(query, [startDate, endDate]);
  return stats;
}

// Get active users (users who sent a message) grouped by day/week/month
export async function getActiveUsersStats({ startDate, endDate, scale }: { startDate: string, endDate: string, scale: "day"|"week"|"month" }) {
  let dateTrunc;
  if (scale === "day") {
    dateTrunc = "TO_CHAR(DATE(created_at), 'YYYY-MM-DD')";
  } else if (scale === "week") {
    dateTrunc = "TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD')";
  } else {
    dateTrunc = "TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM-DD')";
  }
  const query = `
    SELECT ${dateTrunc} as period, COUNT(DISTINCT sender_id) as count
    FROM messages
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY period
    ORDER BY period ASC
  `;
  const stats = await sql.query(query, [startDate, endDate]);
  return stats;
}

// Get new matches grouped by day/week/month
export async function getMatchesStats({ startDate, endDate, scale }: { startDate: string, endDate: string, scale: "day"|"week"|"month" }) {
  let dateTrunc;
  if (scale === "day") {
    dateTrunc = "TO_CHAR(DATE(created_at), 'YYYY-MM-DD')";
  } else if (scale === "week") {
    dateTrunc = "TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD')";
  } else {
    dateTrunc = "TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM-DD')";
  }
  const query = `
    SELECT ${dateTrunc} as period, COUNT(*) as count
    FROM user_matches
    WHERE status = 'accepted' AND created_at BETWEEN $1 AND $2
    GROUP BY period
    ORDER BY period ASC
  `;
  const stats = await sql.query(query, [startDate, endDate]);
  return stats;
}

// Get an option by name
export async function getOption(name: string) {
  const [option] = await sql`SELECT value FROM options WHERE name = ${name}`
  return option?.value || null
}

// Set an option by name
export async function setOption(name: string, value: string) {
  await sql`
    INSERT INTO options (name, value)
    VALUES (${name}, ${value})
    ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value
  `
  return { success: true }
}
