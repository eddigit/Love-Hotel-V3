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
