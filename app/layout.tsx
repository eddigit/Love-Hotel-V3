import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NotificationProvider } from "@/contexts/notification-context"
// Import the Footer component
import { Footer } from "@/components/footer"

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

// Update the RootLayout function to include the Footer component
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
            <div className="flex flex-col min-h-screen">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
