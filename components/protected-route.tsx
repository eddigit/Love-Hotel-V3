"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import type { UserRole } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Si le chargement est terminé et qu'aucun utilisateur n'est connecté
    if (!isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }

    // Si un utilisateur est connecté mais n'a pas le rôle requis
    if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized")
    }
  }, [user, isLoading, router, pathname, allowedRoles])

  // Afficher un écran de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-2">Chargement...</p>
      </div>
    )
  }

  // Si l'utilisateur n'est pas connecté ou n'a pas le rôle requis, ne rien afficher
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null
  }

  // Sinon, afficher le contenu protégé
  return <>{children}</>
}
