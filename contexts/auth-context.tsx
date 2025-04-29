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
}

// Utilisateurs de test prédéfinis
export const TEST_USERS = {
  user: {
    id: "user-123",
    email: "user@test.com",
    name: "Alex Durand",
    role: "user" as UserRole,
    avatar: "/mystical-forest-spirit.png",
  },
  admin: {
    id: "admin-456",
    email: "admin@test.com",
    name: "Admin Système",
    role: "admin" as UserRole,
    avatar: "/contemplative-portrait.png",
  },
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
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

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
