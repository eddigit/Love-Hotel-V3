import { executeQuery } from "./db"
import { hash, compare } from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

// Types
export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  avatar?: string
  onboarding_completed: boolean
  created_at: Date
  updated_at: Date
}

// Créer un nouvel utilisateur
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: "user" | "admin" = "user",
): Promise<User | null> {
  try {
    const hashedPassword = await hash(password, 10)
    const userId = uuidv4()

    const query = `
      INSERT INTO users (id, email, password_hash, name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, name, role, avatar, onboarding_completed, created_at, updated_at
    `

    const result = await executeQuery<User[]>(query, [userId, email, hashedPassword, name, role])
    return result[0] || null
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error)
    return null
  }
}

// Vérifier les identifiants de l'utilisateur
export async function verifyUserCredentials(email: string, password: string): Promise<User | null> {
  try {
    const query = `
      SELECT id, email, password_hash, name, role, avatar, onboarding_completed, created_at, updated_at
      FROM users
      WHERE email = $1
    `

    const users = await executeQuery<Array<User & { password_hash: string }>>(query, [email])

    if (users.length === 0) {
      return null
    }

    const user = users[0]
    const passwordMatch = await compare(password, user.password_hash)

    if (!passwordMatch) {
      return null
    }

    // Ne pas renvoyer le hash du mot de passe
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Erreur lors de la vérification des identifiants:", error)
    return null
  }
}

// Récupérer un utilisateur par son ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const query = `
      SELECT id, email, name, role, avatar, onboarding_completed, created_at, updated_at
      FROM users
      WHERE id = $1
    `

    const users = await executeQuery<User[]>(query, [id])
    return users[0] || null
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    return null
  }
}

// Mettre à jour le statut d'onboarding d'un utilisateur
export async function updateOnboardingStatus(userId: string, completed: boolean): Promise<boolean> {
  try {
    const query = `
      UPDATE users
      SET onboarding_completed = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `

    await executeQuery(query, [completed, userId])
    return true
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut d'onboarding:", error)
    return false
  }
}
