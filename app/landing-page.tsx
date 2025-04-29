"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#120821]">
      {/* Header */}
      <header className="py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#ff3b8b] p-2 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Love Hôtel Rencontres</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-white hover:text-[#ff3b8b] transition-colors">
              Accueil
            </Link>
            <Link href="#" className="text-white hover:text-[#ff3b8b] transition-colors">
              Rencontres
            </Link>
            <Link href="#" className="text-white hover:text-[#ff3b8b] transition-colors">
              En direct
            </Link>
            <Link href="#" className="text-white hover:text-[#ff3b8b] transition-colors">
              Événements
            </Link>
            <Link href="#" className="text-white hover:text-[#ff3b8b] transition-colors">
              Premium
            </Link>
          </nav>

          <Button asChild className="bg-[#ff3b8b] hover:bg-[#ff3b8b]/90 text-white rounded-full px-6">
            <Link href="/dashboard">Se connecter</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-5xl">🔥</span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase text-white leading-tight tracking-tight">
                  LE FRISSON DE <br />
                  LA <span className="text-[#ff3b8b]">RENCONTRE</span>, <br />
                  LE PLAISIR DU <br />
                  <span className="text-[#ff3b8b]">RÉEL</span>
                </h1>
              </div>

              <p className="text-gray-300 text-lg max-w-xl">
                Entrez dans l'univers Love Hôtel : l'unique application qui relie rencontres virtuelles et plaisirs
                réels. Rejoignez une communauté authentique de 40 000 membres, et vivez des expériences exclusives dans
                nos Love Rooms, spas, bars et restaurants. Ici, les vrais désirs prennent vie, sans faux profils, dans
                des lieux où tout devient possible.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-[#ff3b8b] hover:bg-[#ff3b8b]/90 text-white rounded-full px-8 py-6 text-lg">
                <Link href="#">Pourquoi nous rejoindre ?</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="text-white border-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
              >
                <Link href="#">Devenir membre</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/images/luxury-jacuzzi-group-f7nIeUbLIQISpGe5YmIcboYSMPeCeg.png"
                  alt="Espace Spa"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm">
                  <p className="text-lg font-bold text-white">ESPACE SPA</p>
                  <p className="text-sm text-white/80">Expérience privative</p>
                </div>
              </div>

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="/speed-dating-restaurant-chic.png"
                  alt="Speed Dating Restaurant Chic"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm">
                  <p className="text-lg font-bold text-white">SPEED DATING PREMIUM</p>
                  <p className="text-sm text-white/80">Rencontres exclusives</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/amethyst-glow-YU11au0rIIGAWH8iymdMmtFrC6ZFIb.png"
                  alt="Sophia"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm">
                  <p className="text-lg font-bold text-white">SOPHIA</p>
                  <p className="text-sm text-white/80">En ligne maintenant</p>
                </div>
              </div>

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="https://lovehotelaparis.fr/wp-content/uploads/2025/04/image1.jpg"
                  alt="Expérience Rideaux Ouverts"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm">
                  <p className="text-lg font-bold text-white">RIDEAUX OUVERTS</p>
                  <p className="text-sm text-white/80">Expérience unique</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lovehotelaparis.fr/wp-content/uploads/2024/09/chambre-a-lheure-a-love-hotel-paris.webp"
            alt="Love Hotel Paris background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0d2e]/90 to-[#1a0d2e]/80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Pourquoi Choisir <span className="text-[#ff3b8b]">Love Hotel</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#2d1155]/70 backdrop-blur-sm p-8 rounded-2xl">
              <div className="h-16 w-16 bg-[#ff3b8b]/20 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-[#ff3b8b]"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Rencontrez, Vibrez, Vivez</h3>
              <p className="text-gray-300">
                Avec plus de 40 000 membres actifs, Love Hôtel vous connecte à une vraie communauté prête à se
                rencontrer dans des lieux exclusifs : Love Rooms, Spa, Restaurant et Bar.
              </p>
            </div>

            <div className="bg-[#2d1155]/70 backdrop-blur-sm p-8 rounded-2xl">
              <div className="h-16 w-16 bg-[#ff3b8b]/20 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-[#ff3b8b]"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Des Événements Uniques</h3>
              <p className="text-gray-300">
                Participez à nos soirées coquines, speed datings et expériences "Rideaux Ouverts" pour provoquer des
                connexions réelles, dans une ambiance festive et sécurisée.
              </p>
            </div>

            <div className="bg-[#2d1155]/70 backdrop-blur-sm p-8 rounded-2xl">
              <div className="h-16 w-16 bg-[#ff3b8b]/20 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-[#ff3b8b]"
                >
                  <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
                  <circle cx="17" cy="7" r="5"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Vos Fantasmes, Nos Love Rooms</h3>
              <p className="text-gray-300">
                Réservez directement depuis l'application nos Love Rooms thématiques, nos jacuzzis privatifs ou nos
                espaces détente pour transformer chaque rencontre en souvenir inoubliable.
              </p>
            </div>

            <div className="bg-[#2d1155]/70 backdrop-blur-sm p-8 rounded-2xl">
              <div className="h-16 w-16 bg-[#ff3b8b]/20 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-[#ff3b8b]"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Le Virtuel qui se Vit dans le Réel</h3>
              <p className="text-gray-300">
                Fini les faux profils ! Sur Love Hôtel, les échanges se concrétisent dans la vraie vie, dans un cadre
                sûr, élégant et pensé pour les amoureux de liberté et d'authenticité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#4a2282] to-[#ff3b8b] rounded-3xl p-12 flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h2 className="text-4xl font-bold mb-4 text-white">Prêt à Commencer Votre Aventure ?</h2>
              <p className="text-xl text-white/90">
                Rejoignez des milliers d'utilisateurs satisfaits et découvrez un monde de plaisir dès aujourd'hui.
              </p>
            </div>
            <div>
              <Button
                asChild
                size="lg"
                className="bg-white text-[#ff3b8b] hover:bg-white/90 rounded-full text-lg px-8 py-6"
              >
                <Link href="/">Commencer Maintenant</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2d1155] mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Love Hotel</h3>
              <p className="text-gray-400 mb-4">
                La destination première pour des rencontres authentiques et des expériences inoubliables.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Liens Rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                    Rencontres
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                    Événements
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                    Love Rooms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                    Premium
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                    Centre d'Aide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                    Contactez-Nous
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-[#ff3b8b]">
                    Conditions d'Utilisation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Abonnez-vous pour recevoir des mises à jour sur les nouveaux événements et les offres spéciales.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="bg-[#2d1155] px-4 py-2 rounded-l-lg w-full text-white"
                />
                <Button className="bg-[#ff3b8b] hover:bg-[#ff3b8b]/90 rounded-r-lg">S'abonner</Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
