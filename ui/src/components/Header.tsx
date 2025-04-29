import Link from "next/link"
import { Heart } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">Love Hotel Rencontres</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/discover" className="text-sm font-medium hover:underline underline-offset-4">
            Découvrir
          </Link>
          <Link href="/events" className="text-sm font-medium hover:underline underline-offset-4">
            Événements
          </Link>
          <Link href="/love-rooms" className="text-sm font-medium hover:underline underline-offset-4">
            Love Room
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            À propos
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Connexion
          </Link>
          <Link
            href="/register"
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
          >
            Inscription
          </Link>
        </div>
      </div>
    </header>
  )
}
