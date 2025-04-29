"use client"

import { Button } from "@/components/ui/button"
import { Heart, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { NotificationsButton } from "@/components/notifications-button"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  // En phase de développement, nous simulons l'état de connexion
  const pathname = usePathname()

  const { user, logout } = useAuth()
  const isLoggedIn = !!user

  // Modifier la condition isPresentationPage pour inclure les nouvelles pages de présentation

  // Vérifier si nous sommes sur la landing page, une page de présentation, la page de login ou la page d'inscription
  const isPresentationPage =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/features" ||
    pathname === "/pricing" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/rencontres" ||
    pathname === "/en-direct" ||
    pathname === "/premium"

  // Si nous sommes sur une page de présentation ou la page de login, ne pas afficher ce header
  if (isPresentationPage) {
    return null
  }

  return (
    <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">Love Hotel Rencontres</span>
        </Link>

        {isLoggedIn ? (
          // Menu pour utilisateurs connectés
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/discover">
                <Button variant="ghost" size="sm">
                  Découvrir
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="sm">
                  Événements
                </Button>
              </Link>
              <Link href="/love-rooms">
                <Button variant="ghost" size="sm">
                  Love Room
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="ghost" size="sm">
                  Messages
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Search className="h-4 w-4" />
              </Button>
              <NotificationsButton />
              <Link href="/profile">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Image
                    src={user?.avatar || "/mystical-forest-spirit.png"}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Déconnexion
              </Button>
            </div>
          </>
        ) : (
          // Menu pour utilisateurs non connectés
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/about">
                <Button variant="ghost" size="sm">
                  À propos
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="sm">
                  Événements
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Inscription
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
