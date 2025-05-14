"use server"

import type { Notification } from "@/components/notifications-dropdown"
import type { OnboardingData } from "@/components/onboarding-form"
import { saveOnboardingData } from "@/lib/onboarding-service"
import { createUser, verifyUserCredentials } from "@/lib/user-service"
import { executeQuery, sql } from "@/lib/db"

// Fonction pour générer des notifications fictives
function generateFakeNotifications(): Notification[] {
  return [
    {
      id: "1",
      type: "message",
      title: "Sophie vous a envoyé un message",
      description: "Bonjour, comment vas-tu aujourd'hui ?",
      time: "Il y a 5 min",
      read: false,
      image: "/serene-woman.png",
      link: "/messages/1",
    },
    {
      id: "2",
      type: "like",
      title: "Thomas a aimé votre profil",
      description: "Thomas s'intéresse à votre profil",
      time: "Il y a 30 min",
      read: false,
      image: "/contemplative-portrait.png",
      link: "/profile/thomas",
    },
    {
      id: "3",
      type: "event",
      title: "Nouvel événement",
      description: "Speed Dating ce vendredi à 20h",
      time: "Il y a 1h",
      read: true,
      link: "/events",
    },
    {
      id: "4",
      type: "match",
      title: "Julie et vous avez matché !",
      description: "Vous avez un nouveau match avec Julie",
      time: "Il y a 2h",
      read: false,
      image: "/serene-woman.png",
      link: "/matches",
    },
    {
      id: "5",
      type: "message",
      title: "Marc vous a envoyé un message",
      description: "Salut ! On se voit à l'événement ce weekend ?",
      time: "Il y a 3h",
      read: true,
      image: "/contemplative-man.png",
      link: "/messages/2",
    },
    {
      id: "6",
      type: "system",
      title: "Bienvenue sur LoveConnect",
      description: "Complétez votre profil pour augmenter vos chances de rencontres",
      time: "Il y a 1j",
      read: true,
      link: "/profile",
    },
    {
      id: "7",
      type: "event",
      title: "Soirée Jacuzzi",
      description: "Nouvelle soirée Jacuzzi ce samedi à 21h",
      time: "Il y a 1j",
      read: false,
      link: "/events",
    },
    {
      id: "8",
      type: "like",
      title: "Émilie a aimé votre profil",
      description: "Émilie s'intéresse à votre profil",
      time: "Il y a 2j",
      read: true,
      image: "/serene-woman.png",
      link: "/profile/emilie",
    },
    {
      id: "9",
      type: "message",
      title: "Chloé vous a envoyé un message",
      description: "J'ai adoré notre conversation hier !",
      time: "Il y a 2j",
      read: true,
      image: "/serene-woman.png",
      link: "/messages/3",
    },
    {
      id: "10",
      type: "match",
      title: "Antoine et vous avez matché !",
      description: "Vous avez un nouveau match avec Antoine",
      time: "Il y a 3j",
      read: true,
      image: "/contemplative-man.png",
      link: "/matches",
    },
    {
      id: "11",
      type: "match",
      title: "Nouveau match potentiel !",
      description: "Émilie pourrait être compatible avec vous (85%)",
      time: "Il y a 1h",
      read: false,
      image: "/serene-woman-purple.png",
      link: "/matches?tab=pending",
    },
    {
      id: "12",
      type: "match",
      title: "Match exceptionnel !",
      description: "Sophie et vous êtes très compatibles (92%)",
      time: "Il y a 4h",
      read: false,
      image: "/vibrant-woman.png",
      link: "/matches",
    },
  ]
}

export async function getNotifications(userId: string) {
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
}

export async function markNotificationAsRead(id: string) {
  await sql`
    UPDATE notifications
    SET read = true
    WHERE id = ${id}
  `
  return { success: true }
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
