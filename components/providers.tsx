"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <NotificationProvider>
            {children}
            <Toaster />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
