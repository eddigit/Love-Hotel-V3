"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { NotificationProvider } from "@/contexts/notification-context"
import { AuthProvider } from "@/contexts/auth-context"
import { SessionProvider } from "next-auth/react"
import { LoolyyBWidget } from "@/components/loolyyb-widget"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
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
