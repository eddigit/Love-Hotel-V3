"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { motion } from "framer-motion"

export default function LoveRoomsPage() {
  const [activeTab, setActiveTab] = useState("available")

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
    <main className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />

      <div className="container py-6 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Love Rooms</h1>
          <p className="text-muted-foreground">
            Réservez une Love Room pour un moment inoubliable dans l'un de nos établissements.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="available">Disponibles</TabsTrigger>
            <TabsTrigger value="reserve">Réserver</TabsTrigger>
            <TabsTrigger value="my-reservations">Mes réservations</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loveRooms.map((room) => (
                <motion.div key={room.id} variants={item}>
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48">
                      <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div className="text-white">
                          <h3 className="font-bold text-lg">{room.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>{room.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-secondary/80 backdrop-blur-sm">
                          {room.price} {room.currency} / session
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Caractéristiques</h4>
                          <div className="flex flex-wrap gap-2">
                            {room.features.map((feature, index) => (
                              <Badge key={index} variant="outline">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Créneaux horaires</h4>
                          <div className="flex flex-wrap gap-2">
                            {room.timeSlots.map((slot, index) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {slot}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full">Réserver maintenant</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="reserve">
            <div className="text-center p-6">
              <h3 className="text-xl font-bold mb-2">Réserver une Love Room</h3>
              <p className="text-muted-foreground mb-4">Formulaire de réservation à venir prochainement.</p>
            </div>
          </TabsContent>

          <TabsContent value="reserve" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Réserver une Love Room</h3>
                <p className="text-muted-foreground mb-4">
                  Sélectionnez une date et un créneau horaire pour votre réservation.
                </p>
                <Button className="w-full">Confirmer la réservation</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-reservations" className="space-y-6">
            {myReservations.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {myReservations.map((reservation) => (
                  <motion.div key={reservation.id} variants={item}>
                    <Card className="overflow-hidden">
                      <div className="relative h-40">
                        <Image
                          src={reservation.image || "/placeholder.svg"}
                          alt={reservation.roomName}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <div className="text-white">
                            <h3 className="font-bold text-lg">{reservation.roomName}</h3>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              <span>{reservation.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={reservation.status === "confirmed" ? "secondary" : "outline"}
                            className={
                              reservation.status === "confirmed"
                                ? "bg-secondary/80 backdrop-blur-sm"
                                : "bg-yellow-500/80 text-white backdrop-blur-sm"
                            }
                          >
                            {reservation.status === "confirmed" ? "Confirmé" : "En attente"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{reservation.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4" />
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
              <div className="text-center py-12">
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
    </main>
  )
}
