import type { OnboardingData } from "@/components/onboarding-form"

export interface UserProfile {
  id: string
  name: string
  age: number
  location: string
  image: string
  online: boolean
  preferences: OnboardingData
  lastActive?: string
}

// Calcule un score de compatibilité entre deux utilisateurs (0-100)
export function calculateMatchScore(userA: UserProfile, userB: UserProfile): number {
  let score = 0
  const maxScore = 100

  // Vérifier la compatibilité de statut
  if (
    (userA.preferences.status === "couple" && userB.preferences.openToOtherCouples) ||
    (userB.preferences.status === "couple" && userA.preferences.openToOtherCouples) ||
    (userA.preferences.status !== "couple" && userB.preferences.status !== "couple")
  ) {
    score += 15
  }

  // Vérifier la compatibilité d'orientation
  if (
    userA.preferences.orientation === userB.preferences.orientation ||
    userA.preferences.orientation === "bi" ||
    userB.preferences.orientation === "bi"
  ) {
    score += 15
  }

  // Vérifier la compatibilité des types de rencontres recherchées
  const userATypes = Object.entries(userA.preferences.meetingTypes)
    .filter(([_, value]) => value === true)
    .map(([key]) => key)
  const userBTypes = Object.entries(userB.preferences.meetingTypes)
    .filter(([_, value]) => value === true)
    .map(([key]) => key)

  // Calculer l'intersection des types de rencontres
  const commonTypes = userATypes.filter((type) => userBTypes.includes(type))

  // Ajouter des points en fonction du nombre de types communs
  score += (commonTypes.length / Math.max(userATypes.length, userBTypes.length)) * 30

  // Vérifier la compatibilité pour l'option rideau ouvert
  if (userA.preferences.preferCurtainOpen === userB.preferences.preferCurtainOpen) {
    score += 10
  }

  // Vérifier la compatibilité pour les événements
  if (userA.preferences.interestedInEvents && userB.preferences.interestedInEvents) {
    score += 10
  }

  // Vérifier la compatibilité pour les événements exclusifs
  if (userA.preferences.joinExclusiveEvents && userB.preferences.joinExclusiveEvents) {
    score += 10
  }

  // Vérifier la compatibilité d'âge (bonus si l'écart est faible)
  const ageDifference = Math.abs(userA.age - userB.age)
  if (ageDifference <= 5) {
    score += 10
  } else if (ageDifference <= 10) {
    score += 5
  }

  // Limiter le score à 100
  return Math.min(score, maxScore)
}

// Trie les profils par score de compatibilité avec l'utilisateur actuel
export function sortProfilesByCompatibility(currentUser: UserProfile, profiles: UserProfile[]): UserProfile[] {
  return [...profiles]
    .map((profile) => ({
      ...profile,
      matchScore: calculateMatchScore(currentUser, profile),
    }))
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
}

// Remplacer les tableaux d'images actuels par des tableaux avec des photos plus réalistes
const femaleImages = [
  "/glamorous-woman-pink-portrait.png",
  "/elegant-woman-purple-lighting.png",
  "/stylish-woman-nightclub.png",
  "/attractive-woman-colorful-portrait.png",
]
const maleImages = [
  "/handsome-man-pink-portrait.png",
  "/placeholder.svg?height=500&width=400&query=elegant+man+portrait+purple+lighting",
  "/placeholder.svg?height=500&width=400&query=stylish+man+portrait+nightclub+lighting",
  "/placeholder.svg?height=500&width=400&query=attractive+man+portrait+colorful+lighting",
]
const coupleImages = [
  "/placeholder.svg?height=500&width=400&query=attractive+couple+portrait+pink+lighting",
  "/placeholder.svg?height=500&width=400&query=elegant+couple+portrait+purple+lighting",
  "/placeholder.svg?height=500&width=400&query=stylish+couple+portrait+nightclub+lighting",
  "/placeholder.svg?height=500&width=400&query=romantic+couple+portrait+colorful+lighting",
]

// Modifier la fonction generateMockProfiles pour utiliser les bonnes images selon le statut
export function generateMockProfiles(count = 20): UserProfile[] {
  const locations = ["Paris", "Lyon", "Marseille", "Bordeaux", "Nice", "Toulouse", "Lille", "Strasbourg"]
  const statuses = ["couple", "single_male", "single_female"]
  const orientations = ["hetero", "homo", "bi"]

  const profiles: UserProfile[] = []

  for (let i = 0; i < count; i++) {
    const statusIndex = Math.floor(Math.random() * statuses.length)
    const status = statuses[statusIndex] as "couple" | "single_male" | "single_female"
    const age = Math.floor(Math.random() * 30) + 20 // 20-50 ans

    // Sélectionner l'image en fonction du statut
    let image = ""
    let name = ""

    if (status === "couple") {
      image = coupleImages[Math.floor(Math.random() * coupleImages.length)]
      name = ["Sophie & Thomas", "Julie & Marc", "Émilie & Antoine", "Chloé & Lucas"][Math.floor(Math.random() * 4)]
    } else if (status === "single_female") {
      image = femaleImages[Math.floor(Math.random() * femaleImages.length)]
      name = ["Sophie", "Julie", "Émilie", "Chloé", "Marie", "Laura", "Camille", "Léa"][Math.floor(Math.random() * 8)]
    } else {
      // single_male
      image = maleImages[Math.floor(Math.random() * maleImages.length)]
      name = ["Thomas", "Marc", "Antoine", "Lucas", "Hugo", "Julien", "Nicolas", "Maxime"][
        Math.floor(Math.random() * 8)
      ]
    }

    const meetingTypes = {
      friendly: Math.random() > 0.3,
      romantic: Math.random() > 0.4,
      playful: Math.random() > 0.5,
      openCurtains: Math.random() > 0.7,
      libertine: Math.random() > 0.6,
    }

    profiles.push({
      id: `user-${i}`,
      name,
      age,
      location: locations[Math.floor(Math.random() * locations.length)],
      image,
      online: Math.random() > 0.7,
      lastActive: Math.random() > 0.5 ? "Il y a 2h" : "Il y a 1j",
      preferences: {
        status,
        age,
        orientation: orientations[Math.floor(Math.random() * orientations.length)] as "hetero" | "homo" | "bi",

        interestedInRestaurant: Math.random() > 0.5,
        interestedInEvents: Math.random() > 0.4,
        interestedInDating: true,
        preferCurtainOpen: Math.random() > 0.6,
        interestedInLolib: Math.random() > 0.5,
        suggestions: "",

        meetingTypes,
        openToOtherCouples: Math.random() > 0.5,
        specificPreferences: "",

        joinExclusiveEvents: Math.random() > 0.7,
        premiumAccess: Math.random() > 0.8,
      },
    })
  }

  return profiles
}

// Récupère les meilleurs matchs pour un utilisateur
export function getBestMatches(currentUser: UserProfile, profiles: UserProfile[], minScore = 70): UserProfile[] {
  return sortProfilesByCompatibility(currentUser, profiles).filter(
    (profile) => calculateMatchScore(currentUser, profile) >= minScore,
  )
}
