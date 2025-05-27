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
  featured?: boolean
  matchScore?: number;
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

  // Vérifier la compatibilité d'orientation et de genre
  const userAGender = userA.preferences.gender;
  const userAAorientation = userA.preferences.orientation;
  const userBGender = userB.preferences.gender;
  const userBOrientation = userB.preferences.orientation;

  let orientationMatch = false;

  if (userAAorientation === "hetero") {
    if (userAGender === "male" && userBGender === "female" && (userBOrientation === "hetero" || userBOrientation === "bi")) {
      orientationMatch = true;
    }
    if (userAGender === "female" && userBGender === "male" && (userBOrientation === "hetero" || userBOrientation === "bi")) {
      orientationMatch = true;
    }
  } else if (userAAorientation === "homo") {
    if (userAGender === "male" && userBGender === "male" && (userBOrientation === "homo" || userBOrientation === "bi")) {
      orientationMatch = true;
    }
    if (userAGender === "female" && userBGender === "female" && (userBOrientation === "homo" || userBOrientation === "bi")) {
      orientationMatch = true;
    }
  } else if (userAAorientation === "bi") {
    if (userAGender === "male") {
      if (userBGender === "female" && (userBOrientation === "hetero" || userBOrientation === "bi")) orientationMatch = true; // Bi male interested in female (hetero or bi)
      if (userBGender === "male" && (userBOrientation === "homo" || userBOrientation === "bi")) orientationMatch = true; // Bi male interested in male (homo or bi)
    }
    if (userAGender === "female") {
      if (userBGender === "male" && (userBOrientation === "hetero" || userBOrientation === "bi")) orientationMatch = true; // Bi female interested in male (hetero or bi)
      if (userBGender === "female" && (userBOrientation === "homo" || userBOrientation === "bi")) orientationMatch = true; // Bi female interested in female (homo or bi)
    }
    // If userB is also bi, it's a potential match regardless of userA's gender, assuming userB's preferences align.
    // The above conditions for userA being bi already cover cases where userB is hetero or homo.
    // If userB is bi, they are generally open, and the specific gender match is handled.
  }

  // Symmetrical check for user B's orientation (if not already covered by user A being bi)
  if (!orientationMatch && userBOrientation === "hetero") {
    if (userBGender === "male" && userAGender === "female" && (userAAorientation === "hetero" || userAAorientation === "bi")) {
      orientationMatch = true;
    }
    if (userBGender === "female" && userAGender === "male" && (userAAorientation === "hetero" || userAAorientation === "bi")) {
      orientationMatch = true;
    }
  } else if (!orientationMatch && userBOrientation === "homo") {
    if (userBGender === "male" && userAGender === "male" && (userAAorientation === "homo" || userAAorientation === "bi")) {
      orientationMatch = true;
    }
    if (userBGender === "female" && userAGender === "female" && (userAAorientation === "homo" || userAAorientation === "bi")) {
      orientationMatch = true;
    }
  }
  // Note: If userA is not bi, and userB is bi, the above symmetrical checks will handle it.
  // If both are bi, the initial checks for userA being bi would have covered it.

  if (orientationMatch) {
    score += 25; // Increased score for better orientation match
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

  // Bonus pour les profils mis en avant
  if (userB.featured) {
    score += 15
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
    .sort((a, b) => {
      // Mettre en avant les profils featured
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      // Ensuite trier par score de compatibilité
      return (b.matchScore || 0) - (a.matchScore || 0)
    })
}

// Remplacer les tableaux d'images actuels par des tableaux avec des photos plus réalistes et diversifiées
const femaleImages = [
  "/glamorous-woman-pink-portrait.png",
  "/elegant-woman-purple-lighting.png",
  "/stylish-woman-nightclub.png",
  "/attractive-woman-colorful-portrait.png",
  "/glamorous-woman-pink-lighting.png",
  "/elegant-woman-purple-glow.png",
  "/stylish-woman-nightlife.png",
  "/colorful-woman-portrait.png",
  "/beautiful-woman-neon.png",
  "/placeholder.svg?height=400&width=300&query=chic+woman+evening+portrait",
]

const maleImages = [
  "/handsome-man-pink-portrait.png",
  "/elegant-man-purple-lighting.png",
  "/stylish-man-nightclub.png",
  "/attractive-man-colorful-portrait.png",
  "/placeholder.svg?height=400&width=300&query=handsome+man+pink+lighting",
  "/placeholder.svg?height=400&width=300&query=elegant+man+purple+glow",
  "/placeholder.svg?height=400&width=300&query=stylish+man+nightlife",
  "/placeholder.svg?height=400&width=300&query=attractive+man+colorful+portrait",
  "/placeholder.svg?height=400&width=300&query=charming+man+neon+lights",
  "/placeholder.svg?height=400&width=300&query=sophisticated+man+evening+portrait",
]

const coupleImages = [
  "/romantic-couple-pink-lighting.png",
  "/elegant-couple-purple-lighting.png",
  "/stylish-couple-nightclub.png",
  "/attractive-couple-colorful-portrait.png",
  "/placeholder.svg?height=400&width=300&query=romantic+couple+pink+lighting",
  "/placeholder.svg?height=400&width=300&query=elegant+couple+purple+glow",
  "/placeholder.svg?height=400&width=300&query=stylish+couple+nightlife",
  "/placeholder.svg?height=400&width=300&query=attractive+couple+colorful+portrait",
  "/placeholder.svg?height=400&width=300&query=charming+couple+neon+lights",
  "/placeholder.svg?height=400&width=300&query=sophisticated+couple+evening+portrait",
]

// Créer les profils spécifiques demandés
export function createFeaturedProfiles(): UserProfile[] {
  return [
    {
      id: "rescatore",
      name: "Rescatore",
      age: 32,
      location: "Paris",
      image:
        "https://cmxmnsgbmhgpgxopmtua.supabase.co/storage/v1/object/public/profile_photos/08ffac12-2312-4c42-84a5-a756c1c6e494.jpg",
      online: true,
      featured: true,
      lastActive: "En ligne",
      preferences: {
        status: "single_male",
        age: 32,
        orientation: "hetero",
        gender: "male", // Added gender
        birthday: "1992-01-01", // Added birthday
        interestedInRestaurant: true,
        interestedInEvents: true,
        interestedInDating: true,
        preferCurtainOpen: false,
        interestedInLolib: true,
        suggestions: "",
        meetingTypes: {
          friendly: true,
          romantic: true,
          playful: true,
          openCurtains: false,
          libertine: true,
        },
        openToOtherCouples: true,
        specificPreferences: "",
        joinExclusiveEvents: true,
        premiumAccess: true,
      },
    },
    {
      id: "xavyeahxxx",
      name: "xavyeahxxx",
      age: 34,
      location: "Lyon",
      image:
        "https://cmxmnsgbmhgpgxopmtua.supabase.co/storage/v1/object/public/profile_photos/78823992-e5be-4a81-aa66-9e7138c9b7e7.jpg",
      online: true,
      featured: true,
      lastActive: "En ligne",
      preferences: {
        status: "single_male",
        age: 34,
        orientation: "bi",
        gender: "male", // Added gender
        birthday: "1990-01-01", // Added birthday
        interestedInRestaurant: true,
        interestedInEvents: true,
        interestedInDating: true,
        preferCurtainOpen: true,
        interestedInLolib: false,
        suggestions: "",
        meetingTypes: {
          friendly: true,
          romantic: true,
          playful: true,
          openCurtains: true,
          libertine: true,
        },
        openToOtherCouples: true,
        specificPreferences: "",
        joinExclusiveEvents: true,
        premiumAccess: true,
      },
    },
    {
      id: "simba",
      name: "Simba",
      age: 29,
      location: "Marseille",
      image:
        "https://cmxmnsgbmhgpgxopmtua.supabase.co/storage/v1/object/public/profile_photos/6e8fc773-bf42-4d4b-bdcf-77a143745c1d.jpg",
      online: true,
      featured: true,
      lastActive: "En ligne",
      preferences: {
        status: "single_male",
        age: 29,
        orientation: "hetero",
        gender: "male", // Added gender
        birthday: "1995-01-01", // Added birthday
        interestedInRestaurant: true,
        interestedInEvents: true,
        interestedInDating: true,
        preferCurtainOpen: false,
        interestedInLolib: true,
        suggestions: "",
        meetingTypes: {
          friendly: true,
          romantic: true,
          playful: true,
          openCurtains: false,
          libertine: false,
        },
        openToOtherCouples: false,
        specificPreferences: "",
        joinExclusiveEvents: false,
        premiumAccess: true,
      },
    },
    {
      id: "bun-vino",
      name: "Bun & Vino",
      age: 31,
      location: "Nice",
      image:
        "https://cmxmnsgbmhgpgxopmtua.supabase.co/storage/v1/object/public/profile_photos/1feb3c8c-a261-4837-9379-efe72ce8d9c0.jpeg",
      online: true,
      featured: true,
      lastActive: "En ligne",
      preferences: {
        status: "couple",
        age: 31,
        orientation: "bi",
        gender: "other", // Added gender (assuming 'other' for couple)
        birthday: "1993-01-01", // Added birthday
        interestedInRestaurant: true,
        interestedInEvents: true,
        interestedInDating: true,
        preferCurtainOpen: true,
        interestedInLolib: true,
        suggestions: "",
        meetingTypes: {
          friendly: true,
          romantic: true,
          playful: true,
          openCurtains: true,
          libertine: true,
        },
        openToOtherCouples: true,
        specificPreferences: "",
        joinExclusiveEvents: true,
        premiumAccess: true,
      },
    },
    {
      id: "bianca-25",
      name: "Bianca.25",
      age: 25,
      location: "Paris",
      image:
        "https://cmxmnsgbmhgpgxopmtua.supabase.co/storage/v1/object/public/profile_photos/f5367f05-fef1-42a7-afc3-dd0109ba1331.webp",
      online: true,
      featured: true,
      lastActive: "En ligne",
      preferences: {
        status: "single_female",
        age: 25,
        orientation: "bi",
        gender: "female", // Added gender
        birthday: "1999-01-01", // Added birthday
        interestedInRestaurant: true,
        interestedInEvents: true,
        interestedInDating: true,
        preferCurtainOpen: false,
        interestedInLolib: false,
        suggestions: "",
        meetingTypes: {
          friendly: true,
          romantic: true,
          playful: true,
          openCurtains: false,
          libertine: true,
        },
        openToOtherCouples: true,
        specificPreferences: "",
        joinExclusiveEvents: true,
        premiumAccess: true,
      },
    },
  ]
}

// Modifier la fonction generateMockProfiles pour utiliser les bonnes images selon le statut
export function generateMockProfiles(count = 20): UserProfile[] {
  const locations = ["Paris", "Lyon", "Marseille", "Bordeaux", "Nice", "Toulouse", "Lille", "Strasbourg"]
  const statuses = ["couple", "single_male", "single_female"]
  const orientations = ["hetero", "homo", "bi"]

  // Commencer avec les profils mis en avant
  const profiles = createFeaturedProfiles()

  // Garder une trace des images déjà utilisées
  const usedFemaleImages = new Set<string>()
  const usedMaleImages = new Set<string>()
  const usedCoupleImages = new Set<string>()

  // Ajouter des profils aléatoires
  for (let i = 0; i < count - profiles.length; i++) {
    const statusIndex = Math.floor(Math.random() * statuses.length)
    const status = statuses[statusIndex] as "couple" | "single_male" | "single_female"
    const age = Math.floor(Math.random() * 30) + 20 // 20-50 ans
    const randomGender = ["male", "female", "other"][Math.floor(Math.random() * 3)] as "male" | "female" | "other";
    const randomYear = 2024 - age;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 28) + 1; // Keep it simple, assume all months have 28 days
    const randomBirthday = `${randomYear}-${String(randomMonth).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`;

    // Sélectionner l'image en fonction du statut
    let image = ""
    let name = ""

    if (status === "couple") {
      // Trouver une image de couple non utilisée
      const availableCoupleImages = coupleImages.filter((img) => !usedCoupleImages.has(img))
      // Si toutes les images sont utilisées, réinitialiser
      if (availableCoupleImages.length === 0) {
        usedCoupleImages.clear()
        image = coupleImages[Math.floor(Math.random() * coupleImages.length)]
      } else {
        image = availableCoupleImages[Math.floor(Math.random() * availableCoupleImages.length)]
      }
      usedCoupleImages.add(image)
      name = [
        "Sophie & Thomas",
        "Julie & Marc",
        "Émilie & Antoine",
        "Chloé & Lucas",
        "Marie & Paul",
        "Laura & Nicolas",
        "Camille & Hugo",
        "Léa & Julien",
      ][Math.floor(Math.random() * 8)]
    } else if (status === "single_female") {
      // Trouver une image de femme non utilisée
      const availableFemaleImages = femaleImages.filter((img) => !usedFemaleImages.has(img))
      // Si toutes les images sont utilisées, réinitialiser
      if (availableFemaleImages.length === 0) {
        usedFemaleImages.clear()
        image = femaleImages[Math.floor(Math.random() * femaleImages.length)]
      } else {
        image = availableFemaleImages[Math.floor(Math.random() * availableFemaleImages.length)]
      }
      usedFemaleImages.add(image)
      name = [
        "Sophie",
        "Julie",
        "Émilie",
        "Chloé",
        "Marie",
        "Laura",
        "Camille",
        "Léa",
        "Aurélie",
        "Céline",
        "Nathalie",
        "Isabelle",
      ][Math.floor(Math.random() * 12)]
    } else {
      // Trouver une image d'homme non utilisée
      const availableMaleImages = maleImages.filter((img) => !usedMaleImages.has(img))
      // Si toutes les images sont utilisées, réinitialiser
      if (availableMaleImages.length === 0) {
        usedMaleImages.clear()
        image = maleImages[Math.floor(Math.random() * maleImages.length)]
      } else {
        image = availableMaleImages[Math.floor(Math.random() * availableMaleImages.length)]
      }
      usedMaleImages.add(image)
      name = [
        "Thomas",
        "Marc",
        "Antoine",
        "Lucas",
        "Hugo",
        "Julien",
        "Nicolas",
        "Maxime",
        "Pierre",
        "David",
        "Alexandre",
        "Sébastien",
      ][Math.floor(Math.random() * 12)]
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
        gender: randomGender, // Added gender
        birthday: randomBirthday, // Added birthday

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
    (profile) => calculateMatchScore(currentUser, profile) >= minScore || profile.featured,
  )
}
