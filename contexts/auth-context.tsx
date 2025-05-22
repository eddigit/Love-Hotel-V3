"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: any
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(status === "loading")
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    setIsLoading(false)
    if (session?.user) {
      setUser(session.user)
    } else {
      setUser(null)
    }
  }, [session, status])

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
