"use server"

import type { Notification } from "@/components/notifications-dropdown"
import type { OnboardingData } from "@/components/onboarding-form"

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

export async function getNotifications() {
  // Simuler un délai de chargement
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Retourner les notifications fictives
  return { notifications: generateFakeNotifications() }
}

export async function markNotificationAsRead(id: string) {
  // Simuler un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 200))
  console.log(`Marking notification ${id} as read`)
  return { success: true }
}

export async function markAllNotificationsAsRead() {
  // Simuler un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 300))
  console.log("Marking all notifications as read")
  return { success: true }
}

// Fonction pour sauvegarder les préférences utilisateur (mock pour le moment)
export async function saveUserPreferences(userId: string, data: OnboardingData) {
  console.log("Sauvegarde des préférences pour l'utilisateur:", userId, data)

  // Simuler un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Dans une implémentation réelle, nous sauvegarderions ces données dans une base de données
  return { success: true }
}

// Fonction pour accepter un match
export async function acceptMatch(userId: string, matchId: string) {
  console.log(`Utilisateur ${userId} a accepté le match avec ${matchId}`)

  // Simuler un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

// Fonction pour refuser un match
export async function rejectMatch(userId: string, matchId: string) {
  console.log(`Utilisateur ${userId} a refusé le match avec ${matchId}`)

  // Simuler un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

// Fonction pour supprimer un match
export async function removeMatch(userId: string, matchId: string) {
  console.log(`Utilisateur ${userId} a supprimé le match avec ${matchId}`)

  // Simuler un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}
