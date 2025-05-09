"use server"

import { sql } from "@/lib/db"

export async function getUserProfile(userId: string) {
  const user = await sql`
    SELECT u.*, up.*
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
