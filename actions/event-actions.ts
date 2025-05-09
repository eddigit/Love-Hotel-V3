"use server"

import { sql } from "@/lib/db"

export async function getUpcomingEvents(userId: string) {
  const events = await sql`
    SELECT 
      e.*,
      CASE WHEN ep.id IS NOT NULL THEN true ELSE false END as is_participating
    FROM events e
    LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.user_id = ${userId}
    WHERE e.event_date > NOW()
    ORDER BY e.event_date ASC
  `

  return events || []
}

export async function getEventParticipants(eventId: string) {
  const participants = await sql`
    SELECT 
      u.id,
      u.name,
      u.avatar,
      up.location
    FROM event_participants ep
    JOIN users u ON ep.user_id = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE ep.event_id = ${eventId}
  `

  return participants || []
}
