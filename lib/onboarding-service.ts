import { executeQuery } from "./db"
import { v4 as uuidv4 } from "uuid"
import type { OnboardingData } from "@/components/onboarding-form"

// Sauvegarder les données d'onboarding
export async function saveOnboardingData(userId: string, data: OnboardingData): Promise<boolean> {
  try {
    // 1. Mettre à jour le profil utilisateur
    await executeQuery(
      `
      INSERT INTO user_profiles (id, user_id, status, age, orientation)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE
      SET status = $3, age = $4, orientation = $5, updated_at = CURRENT_TIMESTAMP
    `,
      [uuidv4(), userId, data.status, data.age, data.orientation],
    )

    // 2. Mettre à jour les préférences utilisateur
    await executeQuery(
      `
      INSERT INTO user_preferences (
        id, user_id, interested_in_restaurant, interested_in_events, 
        interested_in_dating, prefer_curtain_open, interested_in_lolib, suggestions
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id) DO UPDATE
      SET interested_in_restaurant = $3, interested_in_events = $4,
          interested_in_dating = $5, prefer_curtain_open = $6,
          interested_in_lolib = $7, suggestions = $8,
          updated_at = CURRENT_TIMESTAMP
    `,
      [
        uuidv4(),
        userId,
        data.interestedInRestaurant,
        data.interestedInEvents,
        data.interestedInDating,
        data.preferCurtainOpen,
        data.interestedInLolib,
        data.suggestions || null,
      ],
    )

    // 3. Mettre à jour les types de rencontres
    await executeQuery(
      `
      INSERT INTO user_meeting_types (
        id, user_id, friendly, romantic, playful, open_curtains,
        libertine, open_to_other_couples, specific_preferences
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id) DO UPDATE
      SET friendly = $3, romantic = $4, playful = $5, open_curtains = $6,
          libertine = $7, open_to_other_couples = $8, specific_preferences = $9,
          updated_at = CURRENT_TIMESTAMP
    `,
      [
        uuidv4(),
        userId,
        data.friendly,
        data.romantic,
        data.playful,
        data.openCurtains,
        data.libertine,
        data.openToOtherCouples,
        data.specificPreferences || null,
      ],
    )

    // 4. Mettre à jour les options supplémentaires
    await executeQuery(
      `
      INSERT INTO user_additional_options (
        id, user_id, join_exclusive_events, premium_access
      )
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO UPDATE
      SET join_exclusive_events = $3, premium_access = $4,
          updated_at = CURRENT_TIMESTAMP
    `,
      [uuidv4(), userId, data.joinExclusiveEvents, data.premiumAccess],
    )

    // 5. Mettre à jour le statut d'onboarding de l'utilisateur
    await executeQuery(
      `
      UPDATE users
      SET onboarding_completed = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
      [userId],
    )

    return true
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données d'onboarding:", error)
    return false
  }
}
