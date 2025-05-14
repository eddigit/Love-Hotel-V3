"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"

// Types d'utilisateurs
export type UserRole = "user" | "admin"

export type User = {
  id: string
  email: string
  name: string
  role: UserRole
  avatar: string
  onboardingCompleted?: boolean
}

// Utilisateurs de test prédéfinis
export const TEST_USERS = {
  user: {
    id: "user-123",
    email: "user@test.com",
    name: "Alex Durand",
    role: "user" as UserRole,
    avatar: "/mystical-forest-spirit.png",
    onboardingCompleted: false,
  },
  admin: {
    id: "admin-456",
    email: "admin@test.com",
    name: "Admin Système",
    role: "admin" as UserRole,
    avatar: "/contemplative-portrait.png",
    onboardingCompleted: true,
  },
  demo: {
    id: "demo-789",
    email: "demo@test.com",
    name: "Sophie Martin",
    role: "user" as UserRole,
    avatar: "/serene-woman.png",
    onboardingCompleted: true,
  },
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
  completeOnboarding: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession() // Added update from useSession
  const router = useRouter()
  const isLoading = status === "loading"
  const user = session?.user ?? null

  // Login with NextAuth.js
  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    if (result && result.ok) {
      return { success: true, message: "Connexion réussie" }
    }
    return { success: false, message: "Email ou mot de passe incorrect" }
  }

  // Logout with NextAuth.js
  const logout = () => {
    signOut({ callbackUrl: "/login" })
  }

  // Onboarding completion (optional, can be handled via API)
  const completeOnboarding = async () => {
    // Implement onboarding status update if needed
    await update() // Call update to refresh the session
    router.push("/discover")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
