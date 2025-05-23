"use server"

import type { Notification } from "@/components/notifications-dropdown"
import type { OnboardingData } from "@/components/onboarding-form"
import { sql } from "@/lib/db"

// Function to get notifications for a user
export async function getNotifications(userId: string) {
  try {
    // Only query if userId is a valid UUID
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)

    if (!isValidUUID) {
      // Return mock data for development/testing
      return {
        notifications: generateFakeNotifications(),
      }
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
    console.error("Error fetching notifications:", error)
    return { notifications: generateFakeNotifications() }
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    // Check if the ID is a valid UUID
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    if (isValidUUID) {
      await sql`
        UPDATE notifications
        SET read = true
        WHERE id = ${id}
      `
    }
    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false }
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await sql`
      UPDATE notifications
      SET read = true
      WHERE user_id = ${userId}
    `
    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false }
  }
}

// Function to save user preferences
export async function saveUserPreferences(userId: string, data: OnboardingData) {
  try {
    // Simulate a delay for development
    await new Promise((resolve) => setTimeout(resolve, 800))

    // In a real implementation, we would save to the database
    console.log("Saving preferences for user:", userId, data)

    return { success: true }
  } catch (error) {
    console.error("Error saving user preferences:", error)
    return { success: false, error: "Error saving preferences" }
  }
}

// Function to accept a match
export async function acceptMatch(userId: string, matchId: string) {
  try {
    // Simulate a delay for development
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log(`User ${userId} accepted match with ${matchId}`)

    return { success: true }
  } catch (error) {
    console.error(`Error accepting match:`, error)
    return { success: false }
  }
}

// Function to reject a match
export async function rejectMatch(userId: string, matchId: string) {
  try {
    // Simulate a delay for development
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log(`User ${userId} rejected match with ${matchId}`)

    return { success: true }
  } catch (error) {
    console.error(`Error rejecting match:`, error)
    return { success: false }
  }
}

// Function to remove a match
export async function removeMatch(userId: string, matchId: string) {
  try {
    // Simulate a delay for development
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log(`User ${userId} removed match with ${matchId}`)

    return { success: true }
  } catch (error) {
    console.error(`Error removing match:`, error)
    return { success: false }
  }
}

// Function to generate fake notifications for development
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
