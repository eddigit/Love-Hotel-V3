"use server"

import { sql } from "@/lib/db"

export async function getUserNotifications(userId: string) {
  const notifications = await sql`
    SELECT * FROM notifications
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `

  return notifications || []
}

export async function markNotificationAsRead(notificationId: string) {
  await sql`
    UPDATE notifications
    SET read = true
    WHERE id = ${notificationId}
  `

  return { success: true }
}

export async function createNotification({ userId, type, title, description, link }: {
  userId: string;
  type: string;
  title: string;
  description?: string;
  link?: string;
}) {
  await sql`
    INSERT INTO notifications (user_id, type, title, description, link, read)
    VALUES (${userId}, ${type}, ${title}, ${description || ""}, ${link || ""}, false)
  `
  return { success: true }
}
