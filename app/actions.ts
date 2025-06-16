"use server"

import type { Notification } from "@/components/notifications-dropdown"
import type { OnboardingData } from "@/components/onboarding-form"
import { saveOnboardingData } from "@/lib/onboarding-service"
import { createUser, verifyUserCredentials } from "@/lib/user-service"
import { executeQuery, sql } from "@/lib/db"

export async function getNotifications(userId: string) {
  try {
    // Only query if userId is a valid UUID
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)
    if (!isValidUUID) {
      return { notifications: [] }
    }
    // Fetch notifications for the user from the database
    const rows = await sql`
      SELECT id, user_id, type, title, description, image, link, read, created_at
      FROM notifications
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 50
    `
    // Map DB rows to Notification type expected by the frontend
    const notifications = rows.map((row: any) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      image: row.image,
      link: row.link,
      read: row.read,
      time: new Date(row.created_at).toLocaleString(),
    }))
    return { notifications }
  } catch (error) {
    console.error('Erreur dans getNotifications:', error)
    return { notifications: [] }
  }
}

export async function markNotificationAsRead(id: string) {
  // Check if the ID is a valid UUID (matches UUID format)
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (isValidUUID) {
    await sql`
      UPDATE notifications
      SET read = true
      WHERE id = ${id}
    `;
  }
  return { success: true };
}

export async function markAllNotificationsAsRead(userId: string) {
  await sql`
    UPDATE notifications
    SET read = true
    WHERE user_id = ${userId}
  `
  return { success: true }
}

// Fonction pour sauvegarder les préférences utilisateur (utilise maintenant la base de données)
export async function saveUserPreferences(userId: string, data: OnboardingData) {
  try {
    const success = await saveOnboardingData(userId, data)
    return { success }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des préférences:", error)
    return { success: false, error: "Erreur lors de la sauvegarde des préférences" }
  }
}

// Fonction pour s'inscrire
export async function registerUser(email: string, password: string, name: string) {
  try {
    const user = await createUser(email, password, name)
    return { success: !!user, user }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return { success: false, error: "Erreur lors de l'inscription" }
  }
}

// Fonction pour se connecter
export async function loginUser(email: string, password: string) {
  try {
    const user = await verifyUserCredentials(email, password)
    return { success: !!user, user }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return { success: false, error: "Erreur lors de la connexion" }
  }
}

// Fonction pour accepter un match
export async function acceptMatch(userId: string, matchId: string) {
  try {
    await executeQuery(
      `
      UPDATE user_matches
      SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
      WHERE (user_id_1 = $1 AND user_id_2 = $2) OR (user_id_1 = $2 AND user_id_2 = $1)
    `,
      [userId, matchId],
    )

    return { success: true }
  } catch (error) {
    console.error(`Erreur lors de l'acceptation du match:`, error)
    return { success: false }
  }
}

// Fonction pour refuser un match
export async function rejectMatch(userId: string, matchId: string) {
  try {
    await executeQuery(
      `
      UPDATE user_matches
      SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
      WHERE (user_id_1 = $1 AND user_id_2 = $2) OR (user_id_1 = $2 AND user_id_2 = $1)
    `,
      [userId, matchId],
    )

    return { success: true }
  } catch (error) {
    console.error(`Erreur lors du refus du match:`, error)
    return { success: false }
  }
}

// Fonction pour supprimer un match
export async function removeMatch(userId: string, matchId: string) {
  try {
    await executeQuery(
      `
      DELETE FROM user_matches
      WHERE (user_id_1 = $1 AND user_id_2 = $2) OR (user_id_1 = $2 AND user_id_2 = $1)
    `,
      [userId, matchId],
    )

    return { success: true }
  } catch (error) {
    console.error(`Erreur lors de la suppression du match:`, error)
    return { success: false }
  }
}
