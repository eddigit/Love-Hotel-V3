"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/contexts/auth-context"

// This layout wraps all authenticated routes with the necessary providers
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  )
}
