"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { NotificationProvider } from "@/contexts/notification-context"
import { AuthProvider } from "@/contexts/auth-context"
import { LoolyyBWidget } from "@/components/loolyyb-widget"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <AuthProvider>
          <NotificationProvider>
            {children}
            <LoolyyBWidget />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
