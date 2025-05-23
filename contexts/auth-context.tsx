// Update the AuthContext to properly leverage NextAuth.js
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
  email_verified?: boolean
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
  const { data: session, status, update } = useSession()
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
