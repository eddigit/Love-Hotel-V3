"use client"

import { Bell, Heart, Home, MessageCircle, Search, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/contexts/notification-context"
import { NotificationBadge } from "@/components/notification-badge"

export function MobileNavigation() {
  const pathname = usePathname()
  const { counts } = useNotifications()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-md z-20">
      <div className="flex items-center justify-around h-16">
        <Link
          href="/"
          className={cn("nav-item", {
            active: pathname === "/",
          })}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Accueil</span>
        </Link>
        <Link
          href="/discover"
          className={cn("nav-item", {
            active: pathname === "/discover",
          })}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs">Découvrir</span>
        </Link>
        <Link
          href="/events"
          className={cn("nav-item relative", {
            active: pathname === "/events",
          })}
        >
          <div className="relative">
            <Heart className="h-6 w-6" />
            {counts.events > 0 && <NotificationBadge count={counts.events} variant="secondary" />}
          </div>
          <span className="text-xs">Événements</span>
        </Link>
        <Link
          href="/notifications"
          className={cn("nav-item", {
            active: pathname === "/notifications",
          })}
        >
          <div className="relative">
            <Bell className="h-6 w-6" />
            {counts.total > 0 && <NotificationBadge count={counts.total} />}
          </div>
          <span className="text-xs">Notifications</span>
        </Link>
        <Link
          href="/messages"
          className={cn("nav-item", {
            active: pathname === "/messages",
          })}
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {counts.messages > 0 && <NotificationBadge count={counts.messages} />}
          </div>
          <span className="text-xs">Messages</span>
        </Link>
        <Link
          href="/profile"
          className={cn("nav-item", {
            active: pathname === "/profile",
          })}
        >
          <User className="h-6 w-6" />
          <span className="text-xs">Profil</span>
        </Link>
      </div>
    </div>
  )
}
