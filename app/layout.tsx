import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { VersionInfo } from "@/components/VersionInfo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"), // Ajoutez votre URL de production ici à terme
  title: "Love Hotel Rencontres - Rencontres et Événements",
  description:
    "Love Hotel Rencontres vous propose des rencontres exclusives et des événements privés dans nos établissements de luxe. Rejoignez notre communauté de 40 000 membres pour des expériences inoubliables.",
  manifest: "/manifest.json",
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

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <VersionInfo />
        </Providers>
      </body>
    </html>
  )
}
