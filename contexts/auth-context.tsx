"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

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
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Vérifier si l'utilisateur est déjà connecté (localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error)
        localStorage.removeItem("currentUser")
      }
    }
    setIsLoading(false)
  }, [])

  // Rediriger vers l'onboarding si nécessaire après la connexion
  useEffect(() => {
    if (user && !user.onboardingCompleted && router && !isLoading) {
      const currentPath = window.location.pathname
      if (currentPath !== "/onboarding") {
        router.push("/onboarding")
      }
    }
  }, [user, router, isLoading])

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    // Simuler un délai de traitement
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Vérifier les identifiants (simplifiés pour le test)
    if (email === TEST_USERS.user.email && password === "password") {
      setUser(TEST_USERS.user)
      localStorage.setItem("currentUser", JSON.stringify(TEST_USERS.user))
      setIsLoading(false)
      return { success: true, message: "Connexion réussie en tant qu'utilisateur" }
    } else if (email === TEST_USERS.admin.email && password === "admin123") {
      setUser(TEST_USERS.admin)
      localStorage.setItem("currentUser", JSON.stringify(TEST_USERS.admin))
      setIsLoading(false)
      return { success: true, message: "Connexion réussie en tant qu'administrateur" }
    } else if (email === TEST_USERS.demo.email && password === "demo123") {
      setUser(TEST_USERS.demo)
      localStorage.setItem("currentUser", JSON.stringify(TEST_USERS.demo))
      setIsLoading(false)
      return { success: true, message: "Connexion réussie en tant qu'utilisateur de démonstration" }
    }

    setIsLoading(false)
    return { success: false, message: "Email ou mot de passe incorrect" }
  }

  // Fonction de déconnexion
  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  // Fonction pour marquer l'onboarding comme complété
  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, onboardingCompleted: true }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
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
