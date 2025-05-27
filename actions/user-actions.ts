"use server"

import { sql } from "@/lib/db"
import { calculateMatchScore } from "@/utils/matching-algorithm"
import { createNotification } from "@/actions/notification-actions"
import { FilterOptions } from "@/components/advanced-filters";

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
    WHERE (um.user_id_1 = ${userId} OR um.user_id_2 = ${userId}) AND um.status = 'accepted'
    ORDER BY um.match_score DESC
  `

  return matches || []
}

export async function getDiscoverProfiles(currentUserId: string, page: number = 1, pageSize: number = 50, filters?: FilterOptions) {
  console.log(`[getDiscoverProfiles] Called for user: ${currentUserId}, page: ${page}, filters:`, JSON.stringify(filters, null, 2));

  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUserId);
  if (!isValidUUID) {
    console.error(`[getDiscoverProfiles] Invalid currentUserId: ${currentUserId}`);
    return {
      profiles: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      hasMore: false
    };
  }

  let currentUserProfileGender: string | undefined;
  let currentUserProfileOrientation: string | undefined;
  // console.log(`[getDiscoverProfiles] Initializing currentUserProfileGender and currentUserProfileOrientation.`);

  try {
    const currentUserProfileResult = await sql`
      SELECT gender, orientation
      FROM user_profiles
      WHERE user_id = ${currentUserId}
      LIMIT 1;
    `;
    // console.log(`[getDiscoverProfiles] Raw currentUserProfileResult from DB:`, currentUserProfileResult);
    if (currentUserProfileResult && currentUserProfileResult.length > 0) {
      currentUserProfileGender = currentUserProfileResult[0].gender?.toLowerCase(); // Ensure lowercase
      currentUserProfileOrientation = currentUserProfileResult[0].orientation?.toLowerCase(); // Ensure lowercase
      console.log(`[getDiscoverProfiles] Current user (${currentUserId}) profile fetched: Gender=${currentUserProfileGender}, Orientation=${currentUserProfileOrientation}`);
    } else {
      console.warn(`[getDiscoverProfiles] User ${currentUserId} has no profile set in user_profiles or gender/orientation is missing.`);
    }
  } catch (error) {
    console.error("[getDiscoverProfiles] Error fetching current user profile:", error);
  }

  const offset = (page - 1) * pageSize;
  // console.log(`[getDiscoverProfiles] Calculated offset: ${offset}`);

  let baseParams: any[] = [currentUserId];
  let whereClauses = [`u.id != $1`];
  // console.log(`[getDiscoverProfiles] Initial baseParams:`, JSON.stringify(baseParams));
  // console.log(`[getDiscoverProfiles] Initial whereClauses:`, JSON.stringify(whereClauses));


  if (currentUserProfileGender && currentUserProfileOrientation) {
    // console.log(`[getDiscoverProfiles] Applying primary gender/orientation compatibility logic for current user: ${currentUserProfileGender}/${currentUserProfileOrientation}.`);
    const genderOrientationMatchingClauses: string[] = [];

    const cUserPGender = currentUserProfileGender; // Already lowercased
    const cUserOrientation = currentUserProfileOrientation; // Already lowercased

    // Define SQL conditions for target profile genders based on user clarification
    const targetMaleEntitiesSQL = `(LOWER(up.gender) IN ('male', 'single_male', 'married_male', 'couple_mm', 'couple_mf'))`;
    const targetFemaleEntitiesSQL = `(LOWER(up.gender) IN ('female', 'single_female', 'married_female', 'couple_ff', 'couple_mf'))`;

    // Define SQL conditions for target profile orientations (reusable parts)
    const targetOrientationHeteroBiCompatibleSQL = `(LOWER(up.orientation) = 'hetero' OR LOWER(up.orientation) = 'straight' OR LOWER(up.orientation) = 'bisexual' OR up.orientation IS NULL OR up.orientation = '')`;
    const targetOrientationGayBiCompatibleSQL = `(LOWER(up.orientation) = 'gay' OR LOWER(up.orientation) = 'homo' OR LOWER(up.orientation) = 'bisexual' OR up.orientation IS NULL OR up.orientation = '')`;

    // Determine current user's effective searching role (male/female)
    const isCurrentUserEffectivelyMale = (cUserPGender === 'male' || cUserPGender === 'single_male' || cUserPGender === 'married_male' || cUserPGender === 'couple_mm');
    const isCurrentUserEffectivelyFemale = (cUserPGender === 'female' || cUserPGender === 'single_female' || cUserPGender === 'married_female' || cUserPGender === 'couple_ff');
    console.log(`[getDiscoverProfiles] Current user effective roles: isMale=${isCurrentUserEffectivelyMale}, isFemale=${isCurrentUserEffectivelyFemale}`);

    if (cUserOrientation === 'hetero' || cUserOrientation === 'straight') {
      if (isCurrentUserEffectivelyMale) {
        genderOrientationMatchingClauses.push(targetFemaleEntitiesSQL); // Male hetero seeks Female entities
        genderOrientationMatchingClauses.push(targetOrientationHeteroBiCompatibleSQL);
      } else if (isCurrentUserEffectivelyFemale) {
        genderOrientationMatchingClauses.push(targetMaleEntitiesSQL); // Female hetero seeks Male entities
        genderOrientationMatchingClauses.push(targetOrientationHeteroBiCompatibleSQL);
      } else if (cUserPGender === 'couple_mf') {
        // Hetero couple_mf: This logic is complex.
        // Placeholder: assume they are open to male or female entities who are hetero/bi.
        genderOrientationMatchingClauses.push(`(${targetMaleEntitiesSQL} OR ${targetFemaleEntitiesSQL})`);
        genderOrientationMatchingClauses.push(targetOrientationHeteroBiCompatibleSQL);
        console.warn(`[getDiscoverProfiles] Logic for current user 'couple_mf' hetero is a broad placeholder.`);
      }
    } else if (cUserOrientation === 'gay' || cUserOrientation === 'homo') {
      if (isCurrentUserEffectivelyMale) {
        genderOrientationMatchingClauses.push(targetMaleEntitiesSQL); // Male gay seeks Male entities
        genderOrientationMatchingClauses.push(targetOrientationGayBiCompatibleSQL);
      } else if (isCurrentUserEffectivelyFemale) {
        genderOrientationMatchingClauses.push(targetFemaleEntitiesSQL); // Female gay seeks Female entities
        genderOrientationMatchingClauses.push(targetOrientationGayBiCompatibleSQL);
      } else if (cUserPGender === 'couple_mf') {
        // Gay/Homo couple_mf: Contradictory for the unit's orientation.
        console.warn(`[getDiscoverProfiles] Logic for current user 'couple_mf' gay/homo is undefined as it's contradictory.`);
      }
    } else if (cUserOrientation === 'bisexual' || cUserOrientation === 'bi') {
      if (isCurrentUserEffectivelyMale) { // Bi Male
        // Seeks (Male Gay/Bi) OR (Female Hetero/Bi)
        genderOrientationMatchingClauses.push(`((${targetMaleEntitiesSQL} AND ${targetOrientationGayBiCompatibleSQL}) OR (${targetFemaleEntitiesSQL} AND ${targetOrientationHeteroBiCompatibleSQL}))`);
      } else if (isCurrentUserEffectivelyFemale) { // Bi Female
        // Seeks (Female Gay/Bi) OR (Male Hetero/Bi)
        genderOrientationMatchingClauses.push(`((${targetFemaleEntitiesSQL} AND ${targetOrientationGayBiCompatibleSQL}) OR (${targetMaleEntitiesSQL} AND ${targetOrientationHeteroBiCompatibleSQL}))`);
      } else if (cUserPGender === 'couple_mf') { // Bi couple_mf
        // Placeholder: Open to (Male Gay/Bi) OR (Female Hetero/Bi) OR (Female Gay/Bi)
        // This covers seeking males for the male part, females for the male part, females for the female part, males for the female part, with compatible orientations.
        genderOrientationMatchingClauses.push(`((${targetMaleEntitiesSQL} AND ${targetOrientationGayBiCompatibleSQL}) OR (${targetFemaleEntitiesSQL} AND ${targetOrientationHeteroBiCompatibleSQL}) OR (${targetFemaleEntitiesSQL} AND ${targetOrientationGayBiCompatibleSQL}))`);
        console.warn(`[getDiscoverProfiles] Logic for current user 'couple_mf' bisexual is a broad placeholder.`);
      }
    }
    // console.log(`[getDiscoverProfiles] Generated genderOrientationMatchingClauses:`, JSON.stringify(genderOrientationMatchingClauses));
    if (genderOrientationMatchingClauses.length > 0) {
      whereClauses.push(`(${genderOrientationMatchingClauses.join(' AND ')})`);
    }
  } else {
    console.log("[getDiscoverProfiles] Skipping primary gender/orientation compatibility clauses as current user data is insufficient.");
  }

  if (filters) {
    // Age Range Filter
    if (filters.ageRange) {
      // console.log(`[getDiscoverProfiles] Applying ageRange filter: ${filters.ageRange[0]} - ${filters.ageRange[1]}`);
      baseParams.push(filters.ageRange[0]);
      const ageMinPlaceholder = `$${baseParams.length}`;
      baseParams.push(filters.ageRange[1]);
      const ageMaxPlaceholder = `$${baseParams.length}`;
      // Profiles with NULL age are included if the filter range [minFilterAge, maxFilterAge]
      // (represented by ageMinPlaceholder and ageMaxPlaceholder respectively)
      // overlaps with the default assumed range for NULLs [18, 99].
      // Overlap condition: minFilterAge <= 99 AND maxFilterAge >= 18.
      whereClauses.push(`((up.age >= ${ageMinPlaceholder} AND up.age <= ${ageMaxPlaceholder}) OR (up.age IS NULL AND ${ageMinPlaceholder} <= 99 AND ${ageMaxPlaceholder} >= 18))`);
    }

    // Status Filter
    if (filters.status && filters.status !== "all") {
      // console.log(`[getDiscoverProfiles] Applying status filter: ${filters.status}`);
      const filterStatus = filters.status.toLowerCase(); // Ensure filter value is lowercase
      if (filterStatus === "single") {
        whereClauses.push(`(LOWER(up.status) LIKE 'single_%' OR up.status IS NULL OR up.status = '')`);
      } else if (filterStatus === "couple") {
        baseParams.push('couple'); // Compare with lowercase 'couple'
        const statusPlaceholder = `$${baseParams.length}`;
        whereClauses.push(`(LOWER(up.status) = ${statusPlaceholder} OR up.status IS NULL OR up.status = '')`);
      }
    }

    // Orientation Filter
    if (filters.orientation && filters.orientation !== "all") {
      // console.log(`[getDiscoverProfiles] Applying explicit orientation filter for others: ${filters.orientation}`);
      baseParams.push(filters.orientation.toLowerCase()); // Ensure filter value is lowercase
      const orientationPlaceholder = `$${baseParams.length}`;
      // Compare with lowercase orientation from filter, and allow for NULL target orientation
      whereClauses.push(`(LOWER(up.orientation) = ${orientationPlaceholder} OR up.orientation IS NULL OR up.orientation = '')`);
    }

    // Meeting Types Filter
    if (filters.meetingTypes) {
      // console.log(`[getDiscoverProfiles] Applying meetingTypes filter for others:`, JSON.stringify(filters.meetingTypes));
      const activeMeetingTypes = Object.entries(filters.meetingTypes)
        .filter(([, isActive]) => isActive)
        .map(([type]) => type);
      if (activeMeetingTypes.length > 0) {
        activeMeetingTypes.forEach(type => {
          if (['friendly', 'romantic', 'playful', 'open_curtains', 'libertine'].includes(type)) {
             whereClauses.push(`umt_filter.${type.toLowerCase()} = TRUE`); // Assuming umt_filter columns are lowercase
             // console.log(`[getDiscoverProfiles] Added meeting type clause for others: umt_filter.${type.toLowerCase()} = TRUE`);
          }
        });
      }
    }

    // Curtain Preference Filter
    if (filters.curtainPreference && filters.curtainPreference !== "all") {
      // console.log(`[getDiscoverProfiles] Applying curtainPreference filter for others: ${filters.curtainPreference}`);
      const curtainPref = filters.curtainPreference.toLowerCase();
      if (curtainPref === "open") {
        whereClauses.push(`(upref_filter.prefer_curtain_open = TRUE OR upref_filter.prefer_curtain_open IS NULL)`);
      } else if (curtainPref === "closed") {
        whereClauses.push(`upref_filter.prefer_curtain_open = FALSE`);
      }
    }
  }

  // console.log("[getDiscoverProfiles] Constructed whereClauses:", JSON.stringify(whereClauses, null, 2));
  const baseFromClause = `
    FROM users u
    JOIN user_profiles up ON u.id = up.user_id
    LEFT JOIN user_meeting_types umt_filter ON u.id = umt_filter.user_id
    LEFT JOIN user_preferences upref_filter ON u.id = upref_filter.user_id
  `;
  const whereCondition = whereClauses.length > 1 ? `WHERE ${whereClauses.join(" AND ")}` : (whereClauses.length === 1 ? `WHERE ${whereClauses[0]}` : "");

  console.log(`[getDiscoverProfiles] Final whereCondition for SQL: ${whereCondition}`);
  console.log("[getDiscoverProfiles] Final baseParams for count query:", JSON.stringify(baseParams, null, 2));

  const totalCountQuery = `SELECT COUNT(DISTINCT u.id) as total ${baseFromClause} ${whereCondition}`;
  console.log(`[getDiscoverProfiles] Total count query SQL: ${totalCountQuery}`);
  const totalCountResult = await sql.query(totalCountQuery, baseParams);
  const totalCount = totalCountResult && totalCountResult.length > 0 ? parseInt(totalCountResult[0].total, 10) : 0;
  console.log(`[getDiscoverProfiles] Total count of profiles found: ${totalCount}`);

  let profilesParams = [...baseParams];
  profilesParams.push(pageSize);
  const limitPlaceholder = `$${profilesParams.length}`;
  profilesParams.push(offset);
  const offsetPlaceholder = `$${profilesParams.length}`;
  // console.log("[getDiscoverProfiles] Final profilesParams for profiles query:", JSON.stringify(profilesParams, null, 2)); // Existing log

  const profilesQuery = `
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
    ${baseFromClause}
    ${whereCondition}
    ORDER BY
      (CASE WHEN u.avatar IS NOT NULL AND u.avatar != '' THEN 1 ELSE 0 END) DESC,
      match_count DESC,
      u.created_at DESC
    LIMIT ${limitPlaceholder}
    OFFSET ${offsetPlaceholder}
  `;
  // console.log("[getDiscoverProfiles] Profiles Query:", profilesQuery); // Existing log

  const profilesResult = await sql.query(profilesQuery, profilesParams);
  const profilesData = profilesResult || [];
  console.log(`[getDiscoverProfiles] Fetched ${profilesData.length} raw profiles from DB.`);

  const mappedProfiles = profilesData.map((profile: any) => ({
    ...profile,
    interests: profile.interests ? JSON.parse(profile.interests) : [],
    // preferences object structure for ProfileCard compatibility, might not reflect all actual user_preferences
    preferences: {
      status: profile.status,
      age: profile.age,
      orientation: profile.orientation,
      meetingTypes: {}, // Placeholder, actual meeting types are filtered in query
      // other preference fields if needed by ProfileCard and available
    },
    popularity: profile.match_count || 0
  }));
  console.log(`[getDiscoverProfiles] Mapped ${mappedProfiles.length} profiles for client.`);

  const result = {
    profiles: mappedProfiles,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize),
    hasMore: (offset + mappedProfiles.length) < totalCount
  };
  console.log("[getDiscoverProfiles] Returning final result object:", JSON.stringify(result, null, 2));
  return result;
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
    // Build UserProfile objects for matching algorithm
    function buildUserProfile(profile: any): import("@/utils/matching-algorithm").UserProfile | null {
      if (!profile.user || !profile.preferences) return null;
      // Merge meetingTypes into preferences
      const preferences = {
        ...profile.preferences,
        meetingTypes: profile.meetingTypes || {}
      };
      return {
        id: profile.user.id,
        name: profile.user.name,
        age: profile.user.age,
        location: profile.user.location,
        image: profile.user.avatar || "",
        online: true,
        preferences,
        lastActive: undefined,
        featured: false
      };
    }
    const requester = buildUserProfile(requesterProfile);
    const receiver = buildUserProfile(receiverProfile);
    if (requester && receiver) {
      matchScore = calculateMatchScore(requester, receiver)
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
    if ((result as any).rowCount === 0) {
      return { success: false, error: "Aucune demande à accepter." }
    }
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
    if ((result as any).rowCount === 0) {
      return { success: false, error: "Aucune demande à refuser." }
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: "Erreur lors du refus." }
  }
}

// Remove an existing match (either user can initiate)
export async function removeMatch(userId1: string, userId2: string) {
  try {
    // It doesn't matter who is userId1 or userId2 in the table, so check both combinations
    const result = await sql`
      DELETE FROM user_matches
      WHERE (user_id_1 = ${userId1} AND user_id_2 = ${userId2} AND status = \'accepted\')
         OR (user_id_1 = ${userId2} AND user_id_2 = ${userId1} AND status = \'accepted\')
    `
    // Assuming 'sql' result for DELETE has a 'rowCount' property.
    // Using 'as any' to bypass potential overly generic typing from the sql tag.
    if ((result as any).rowCount === 0) {
      console.warn(`No accepted match found to remove between ${userId1} and ${userId2}`);
      return { success: true, message: "No active match to remove or already removed." };
    }
    // Optionally, send notifications or perform other cleanup
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du match:", error);
    return { success: false, error: "Erreur lors de la suppression du match." };
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
    SELECT u.id, u.name, u.email, u.role, u.avatar, up.location, up.age, u.is_banned, u.status
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
