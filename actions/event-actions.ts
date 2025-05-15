"use server"

import { sql } from "@/lib/db"

export async function getUpcomingEvents(userId?: string) {
  if (userId) {
    const events = await sql`
      SELECT 
        e.*,
        (SELECT COUNT(*) FROM event_participants ep2 WHERE ep2.event_id = e.id) as participant_count,
        CASE WHEN ep.id IS NOT NULL THEN true ELSE false END as is_participating
      FROM events e
      LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.user_id = ${userId}
      WHERE e.event_date > NOW()
      ORDER BY e.event_date ASC
    `
    return events || []
  } else {
    const events = await sql`
      SELECT 
        e.*,
        (SELECT COUNT(*) FROM event_participants ep2 WHERE ep2.event_id = e.id) as participant_count
      FROM events e
      WHERE e.event_date > NOW()
      ORDER BY event_date ASC
    `
    return events || []
  }
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

export async function createEvent({ title, location, date, image, category, description }: {
  title: string;
  location: string;
  date: string; // ISO string or date
  image?: string;
  category?: string;
  description?: string;
}) {
  const [event] = await sql`
    INSERT INTO events (title, location, event_date, image, category, description)
    VALUES (${title}, ${location}, ${date}, ${image || null}, ${category || null}, ${description || null})
    RETURNING *
  `
  return event
}

export async function updateEvent(eventId: string, { title, location, date, image, category, description }: {
  title?: string;
  location?: string;
  date?: string;
  image?: string;
  category?: string;
  description?: string;
}) {
  const [event] = await sql`
    UPDATE events
    SET
      title = COALESCE(${title}, title),
      location = COALESCE(${location}, location),
      event_date = COALESCE(${date}, event_date),
      image = COALESCE(${image}, image),
      category = COALESCE(${category}, category),
      description = COALESCE(${description}, description)
    WHERE id = ${eventId}
    RETURNING *
  `
  return event
}

export async function deleteEvent(eventId: string) {
  await sql`
    DELETE FROM events WHERE id = ${eventId}
  `
  return { success: true }
}

export async function subscribeToEvent(eventId: string, userId: string) {
  await sql`
    INSERT INTO event_participants (event_id, user_id)
    VALUES (${eventId}, ${userId})
    ON CONFLICT DO NOTHING
  `
  return { success: true }
}

export async function unsubscribeFromEvent(eventId: string, userId: string) {
  await sql`
    DELETE FROM event_participants WHERE event_id = ${eventId} AND user_id = ${userId}
  `
  return { success: true }
}

export async function removeSubscriberFromEvent(eventId: string, userId: string) {
  await sql`
    DELETE FROM event_participants WHERE event_id = ${eventId} AND user_id = ${userId}
  `
  return { success: true }
}

export async function getEventSubscriptionsStats({ startDate, endDate, scale }: { startDate: string, endDate: string, scale: "day"|"week"|"month" }) {
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
    FROM event_participants
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY period
    ORDER BY period ASC
  `;
  const stats = await sql.query(query, [startDate, endDate]);
  return stats;
}
