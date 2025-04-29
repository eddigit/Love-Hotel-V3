"use client"

import { Heart, Home, MessageCircle, Search, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/contexts/notification-context"
import { NotificationBadge } from "@/components/notification-badge"

export function MobileNavigation() {
  const pathname = usePathname()
  const { counts } = useNotifications()

  // Vérifier si nous sommes sur la landing page ou une page de présentation
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

  // Ne pas afficher la navigation mobile sur les pages de présentation
  if (isPresentationPage) {
    return null
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md z-50">
      <div className="flex items-center justify-around h-16">
        <Link
          href="/"
          className={cn("nav-item flex-1", {
            active: pathname === "/",
          })}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        <Link
          href="/discover"
          className={cn("nav-item flex-1", {
            active: pathname === "/discover",
          })}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Découvrir</span>
        </Link>
        <Link
          href="/events"
          className={cn("nav-item relative flex-1", {
            active: pathname === "/events",
          })}
        >
          <div className="relative">
            <Heart className="h-5 w-5" />
            {counts.events > 0 && <NotificationBadge count={counts.events} variant="secondary" />}
          </div>
          <span className="text-xs mt-1">Événements</span>
        </Link>
        <Link
          href="/messages"
          className={cn("nav-item flex-1", {
            active: pathname === "/messages",
          })}
        >
          <div className="relative">
            <MessageCircle className="h-5 w-5" />
            {counts.messages > 0 && <NotificationBadge count={counts.messages} />}
          </div>
          <span className="text-xs mt-1">Messages</span>
        </Link>
        <Link
          href="/profile"
          className={cn("nav-item flex-1", {
            active: pathname === "/profile",
          })}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profil</span>
        </Link>
      </div>
    </div>
  )
}
