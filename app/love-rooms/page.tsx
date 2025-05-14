"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import MainLayout from "@/components/layout/main-layout"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// Ajouter l'import du widget de réservation en haut du fichier
import { LoveHotelBookingWidget } from "@/components/love-hotel-booking"

export default function LoveRoomsPage() {
  const [activeTab, setActiveTab] = useState("available")
  const { user: authUser } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  if (!authUser?.id) {
    if (typeof window !== "undefined") {
      router.replace("/login")
    }
    return null
  }

  // Simuler des données de Love Rooms
  const loveRooms = [
    {
      id: 1,
      name: "Suite Romantique",
      location: "Love Hotel - Paris",
      price: 120,
      currency: "€",
      timeSlots: ["14:00 - 17:00", "18:00 - 21:00", "22:00 - 01:00"],
      image: "/purple-jacuzzi-retreat.png",
      features: ["Jacuzzi", "Champagne", "Musique d'ambiance"],
      available: true,
    },
    {
      id: 2,
      name: "Love Room Deluxe",
      location: "Love Hotel - Lyon",
      price: 150,
      currency: "€",
      timeSlots: ["15:00 - 18:00", "19:00 - 22:00", "23:00 - 02:00"],
      image: "/pink-jacuzzi-night.png",
      features: ["Lit king-size", "Bar privé", "Système audio"],
      available: true,
    },
    {
      id: 3,
      name: "Suite Passion",
      location: "Love Hotel - Marseille",
      price: 180,
      currency: "€",
      timeSlots: ["14:00 - 17:00", "18:00 - 21:00", "22:00 - 01:00"],
      image: "/twilight-tryst.png",
      features: ["Jacuzzi", "Champagne", "Vue panoramique"],
      available: true,
    },
  ]

  // Simuler des réservations
  const myReservations = [
    {
      id: 101,
      roomName: "Suite Romantique",
      location: "Love Hotel - Paris",
      date: "15 Mai 2025",
      timeSlot: "18:00 - 21:00",
      price: 120,
      currency: "€",
      image: "/purple-jacuzzi-retreat.png",
      status: "confirmed",
    },
    {
      id: 102,
      roomName: "Love Room Deluxe",
      location: "Love Hotel - Lyon",
      date: "22 Mai 2025",
      timeSlot: "19:00 - 22:00",
      price: 150,
      currency: "€",
      image: "/pink-jacuzzi-night.png",
      status: "pending",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <MainLayout user={authUser}>
      <div className="min-h-screen flex flex-col pb-16 md:pb-0">
        <div className="container py-4 md:py-6 flex-1">
          <div className="mb-4 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Escapades Love Hôtel</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Réservez une Love Room pour un moment inoubliable dans l'un de nos établissements.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
              <TabsTrigger value="available" className="text-xs sm:text-sm">
                Disponibles
              </TabsTrigger>
              <TabsTrigger value="reserve" className="text-xs sm:text-sm">
                Réserver
              </TabsTrigger>
              <TabsTrigger value="my-reservations" className="text-xs sm:text-sm">
                Mes réservations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4 md:space-y-6">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {loveRooms.map((room) => (
                  <motion.div key={room.id} variants={item}>
                    <Card className="overflow-hidden h-full flex flex-col card-hover">
                      <div className="relative h-40 md:h-48">
                        <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <div className="text-white">
                            <h3 className="font-bold text-lg line-clamp-1">{room.name}</h3>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span className="line-clamp-1">{room.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-secondary/80 backdrop-blur-sm text-xs">
                            {room.price} {room.currency} / session
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3 md:p-4 flex-grow">
                        <div className="space-y-3 md:space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">Caractéristiques</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {room.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-2">Créneaux horaires</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {room.timeSlots.map((slot, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
                                  <Clock className="h-3 w-3" />
                                  {slot}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-3 md:p-4 pt-0">
                        <Button className="w-full">Réserver maintenant</Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Remplacer le contenu de l'onglet "reserve" par le widget de réservation */}
            <TabsContent value="reserve">
              <div className="p-4 md:p-6 bg-gradient-to-br from-[#2d1155]/70 to-[#3d1155]/50 backdrop-blur-sm rounded-lg shadow-lg shadow-purple-900/20 border border-purple-800/20">
                <h3 className="text-xl font-bold mb-4">Réserver une Love Room</h3>
                <p className="text-muted-foreground mb-6">
                  Utilisez notre système de réservation en ligne pour réserver votre Love Room préférée. Sélectionnez la
                  date, l'heure et la durée de votre séjour.
                </p>
                <div className="bg-[#1a0d2e]/50 rounded-lg shadow-lg overflow-hidden">
                  <LoveHotelBookingWidget />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="my-reservations" className="space-y-4 md:space-y-6">
              {myReservations.length > 0 ? (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {myReservations.map((reservation) => (
                    <motion.div key={reservation.id} variants={item}>
                      <Card className="overflow-hidden card-hover">
                        <div className="relative h-32 md:h-40">
                          <Image
                            src={reservation.image || "/placeholder.svg"}
                            alt={reservation.roomName}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <div className="text-white">
                              <h3 className="font-bold text-lg line-clamp-1">{reservation.roomName}</h3>
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="line-clamp-1">{reservation.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge
                              variant={reservation.status === "confirmed" ? "secondary" : "outline"}
                              className={
                                reservation.status === "confirmed"
                                  ? "bg-secondary/80 backdrop-blur-sm text-xs"
                                  : "bg-yellow-500/80 text-white backdrop-blur-sm text-xs"
                              }
                            >
                              {reservation.status === "confirmed" ? "Confirmé" : "En attente"}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
                          <div className="flex items-center justify-between flex-wrap gap-y-2">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              <span>{reservation.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span>{reservation.timeSlot}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              {reservation.price} {reservation.currency}
                            </div>
                            <Button variant="outline" size="sm">
                              Voir détails
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Aucune réservation</h3>
                  <p className="text-muted-foreground mt-1 mb-4">Vous n&apos;avez pas encore réservé de Love Room.</p>
                  <Button onClick={() => setActiveTab("available")}>Découvrir les Love Rooms</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <MobileNavigation />
      </div>
    </MainLayout>
  )
}
