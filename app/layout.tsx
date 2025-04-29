import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NotificationProvider } from "@/contexts/notification-context"
import { MainLayout } from "@/components/layout/main-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Love Hotel Rencontres - Rencontres et Événements",
  description:
    "Love Hotel Rencontres vous propose des rencontres exclusives et des événements privés dans nos établissements de luxe. Rejoignez notre communauté de 40 000 membres pour des expériences inoubliables.",
  manifest: "/manifest.json",
  themeColor: "#8b5cf6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Love Hotel Rencontres",
  },
  openGraph: {
    title: "Love Hotel Rencontres",
    description:
      "Découvrez des rencontres exclusives et des événements privés dans nos Love Hotels. Une expérience unique pour des moments inoubliables.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Love Hotel Rencontres",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Love Hotel Rencontres",
    description:
      "Découvrez des rencontres exclusives et des événements privés dans nos Love Hotels. Une expérience unique pour des moments inoubliables.",
    images: ["/og-image.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <NotificationProvider>
            <MainLayout>{children}</MainLayout>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
