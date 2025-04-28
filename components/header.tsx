"use client"

import { Button } from "@/components/ui/button"
import { Heart, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { NotificationsButton } from "@/components/notifications-button"

export function Header() {
  return (
    <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Love Hotel Rencontres</span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Découvrir
          </Button>
          <Link href="/events">
            <Button variant="ghost" size="sm">
              Événements
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            Love Hotel
          </Button>
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
              <Image src="/mystical-forest-spirit.png" alt="Avatar" width={32} height={32} className="rounded-full" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
