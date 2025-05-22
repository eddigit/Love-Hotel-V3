import Link from "next/link"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/layout/main-layout"

// Static landing page that doesn't use NextAuth at all
export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-900 to-pink-800">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Bienvenue sur Love Hotel Rencontres
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Découvrez une nouvelle façon de faire des rencontres dans un cadre élégant et discret.
                  </p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Link href="/register" passHref>
                      <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                        S'inscrire
                      </Button>
                    </Link>
                    <Link href="/login" passHref>
                      <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                        Se connecter
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative lg:pl-6">
                  <img
                    src="/romantic-couple-pink-lighting.png"
                    alt="Couple romantique"
                    className="mx-auto w-full max-w-[500px] rounded-lg object-cover"
                    style={{ aspectRatio: "4/3" }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Nos services exclusifs
                  </h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Découvrez tout ce que nous avons à vous offrir pour rendre vos rencontres inoubliables.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="p-2 bg-pink-100 rounded-full">
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
                      className="h-6 w-6 text-pink-600"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Rencontres</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Trouvez l'âme sœur grâce à notre algorithme de compatibilité avancé.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="p-2 bg-purple-100 rounded-full">
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
                      className="h-6 w-6 text-purple-600"
                    >
                      <path d="M2 22h20" />
                      <path d="M6.87 2h10.26L22 22H2z" />
                      <path d="M9.5 14.5c1.5 1.5 3.5 1.5 5 0" />
                      <path d="M8 8h.01" />
                      <path d="M16 8h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Événements</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Participez à nos soirées exclusives et rencontrez des personnes partageant vos intérêts.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="p-2 bg-pink-100 rounded-full">
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
                      className="h-6 w-6 text-pink-600"
                    >
                      <path d="M3 7V5c0-1.1.9-2 2-2h2" />
                      <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
                      <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
                      <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
                      <rect width="7" height="7" x="7" y="7" rx="1" />
                      <rect width="7" height="7" x="10" y="10" rx="1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Love Rooms</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Réservez une chambre élégante pour un moment d'intimité dans un cadre luxueux.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </MainLayout>
  )
}
