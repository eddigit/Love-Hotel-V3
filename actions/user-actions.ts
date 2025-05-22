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

export async function getDiscoverProfiles(currentUserId: string, page: number = 1, pageSize: number = 50) {
  // Vérifier que l'ID utilisateur est un UUID valide
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUserId)
  if (!isValidUUID) {
    return {
      profiles: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      hasMore: false
    }
  }
  const offset = (page - 1) * pageSize;

  // First get total count
  const totalCountResult = await sql`
    SELECT COUNT(*) as total
    FROM users u
    JOIN user_profiles up ON u.id = up.user_id
    WHERE u.id != ${currentUserId}
  `;

  const totalCount = parseInt(totalCountResult[0].total);

  // Then get paginated profiles with improved sorting:
  // 1. Prioritize profiles with avatar images
  // 2. Then by popularity (number of matches)
  // 3. Then by recent creation date
  const profiles = await sql`
    SELECT
      u.id,
      u.name,
      u.avatar as image,
      up.age,
      up.location,
      up.orientation,
      up.status,
      up.gender,
      up.birthday,
      up.bio,
      up.interests,
      true as online,
      false as featured,
      (SELECT COUNT(*) FROM user_matches WHERE (user_id_1 = u.id OR user_id_2 = u.id) AND status = 'accepted') as match_count
    FROM users u
    JOIN user_profiles up ON u.id = up.user_id
    WHERE u.id != ${currentUserId}
    ORDER BY
      (CASE WHEN u.avatar IS NOT NULL AND u.avatar != '' THEN 1 ELSE 0 END) DESC,
      match_count DESC,
      u.created_at DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  const mappedProfiles = profiles.map(profile => ({
    ...profile,
    interests: profile.interests ? JSON.parse(profile.interests) : [],
    preferences: {
      status: profile.status,
      age: profile.age,
      orientation: profile.orientation,
      interestedInRestaurant: false,
      interestedInEvents: false,
      interestedInDating: true,
      preferCurtainOpen: false,
      interestedInLolib: false,
      suggestions: "",
      meetingTypes: { friendly: false, romantic: false, playful: false, openCurtains: false, libertine: false },
      openToOtherCouples: false,
      specificPreferences: "",
      joinExclusiveEvents: false,
      premiumAccess: false,
    },
    // Add popularity metric for frontend use
    popularity: profile.match_count || 0
  }));

  return {
    profiles: mappedProfiles,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize),
    hasMore: offset + profiles.length < totalCount
  };
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
