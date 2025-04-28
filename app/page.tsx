"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users } from "lucide-react"
import Image from "next/image"
import { MobileNavigation } from "@/components/mobile-navigation"
import { ProfileCard } from "@/components/profile-card"
import { EventCard } from "@/components/event-card"
import { useState, useEffect } from "react"
import { ToastNotification } from "@/components/toast-notification"
import { motion, AnimatePresence } from "framer-motion"
import { useNotifications } from "@/contexts/notification-context"
import { Header } from "@/components/header"

export default function Home() {
  const [activeTab, setActiveTab] = useState("discover")
  const [showToast, setShowToast] = useState(false)
  const [toastNotification, setToastNotification] = useState<any>(null)
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Simuler l'arrivée d'une notification toast après 5 secondes
    const timer = setTimeout(() => {
      const notification = {
        id: `toast-${Date.now()}`,
        type: "event" as const,
        title: "Nouvel événement",
        description: "Un nouvel événement a été ajouté près de chez vous",
        time: "À l'instant",
        read: false,
        link: "/events",
      }

      setToastNotification(notification)
      setShowToast(true)

      // Ajouter la notification au contexte global
      addNotification(notification)
    }, 5000)

    return () => clearTimeout(timer)
  }, [addNotification])

  const handleCloseToast = () => {
    setShowToast(false)
  }

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
    <main className="min-h-screen flex flex-col">
      <Header />

      {showToast && toastNotification && (
        <ToastNotification notification={toastNotification} onClose={handleCloseToast} />
      )}

      <div className="container py-6 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="discover">Découvrir</TabsTrigger>
            <TabsTrigger value="events">Événements</TabsTrigger>
            <TabsTrigger value="rooms">Love Rooms</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent key={activeTab} value="discover" className="space-y-6">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  { name: "Sophie", age: 28, location: "Paris", image: "/serene-woman.png", online: true },
                  { name: "Thomas", age: 32, location: "Lyon", image: "/contemplative-portrait.png", online: false },
                  { name: "Julie", age: 25, location: "Marseille", image: "/serene-woman.png", online: true },
                  { name: "Marc", age: 30, location: "Bordeaux", image: "/contemplative-man.png", online: true },
                  { name: "Émilie", age: 27, location: "Toulouse", image: "/serene-woman.png", online: false },
                  { name: "Lucas", age: 29, location: "Nice", image: "/contemplative-portrait.png", online: true },
                  { name: "Chloé", age: 26, location: "Lille", image: "/serene-woman.png", online: true },
                  { name: "Antoine", age: 31, location: "Strasbourg", image: "/contemplative-man.png", online: false },
                ].map((profile, index) => (
                  <motion.div key={profile.name} variants={item}>
                    <ProfileCard
                      name={profile.name}
                      age={profile.age}
                      location={profile.location}
                      image={profile.image}
                      online={profile.online}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent key={`${activeTab}-events`} value="events" className="space-y-6">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {[
                  {
                    title: "Speed Dating",
                    location: "Love Hotel - Paris",
                    date: "Vendredi, 20:00",
                    image: "/purple-speed-dates.png",
                    attendees: 24,
                  },
                  {
                    title: "Soirée Jacuzzi",
                    location: "Love Hotel - Lyon",
                    date: "Samedi, 21:00",
                    image: "/pink-jacuzzi-night.png",
                    attendees: 16,
                  },
                  {
                    title: "Dîner Romantique",
                    location: "Restaurant Love Hotel - Paris",
                    date: "Dimanche, 19:30",
                    image: "/twilight-tryst.png",
                    attendees: 30,
                  },
                ].map((event, index) => (
                  <motion.div key={event.title} variants={item}>
                    <EventCard
                      title={event.title}
                      location={event.location}
                      date={event.date}
                      image={event.image}
                      attendees={event.attendees}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent key={`${activeTab}-rooms`} value="rooms" className="space-y-6">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {[
                  {
                    title: "Love Room #1",
                    users: 18,
                    description: "Discussions animées",
                    image: "/purple-haze-chat.png",
                  },
                  { title: "Love Room #2", users: 24, description: "Rencontres rapides", image: "/pink-glow-chat.png" },
                  {
                    title: "Jacuzzi Room",
                    users: 12,
                    description: "Détente et rencontres",
                    image: "/purple-jacuzzi-retreat.png",
                  },
                ].map((room, index) => (
                  <motion.div key={room.title} variants={item}>
                    <Card className="overflow-hidden">
                      <div className="relative h-48">
                        <Image src={room.image || "/placeholder.svg"} alt={room.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <div className="text-white">
                            <h3 className="font-bold text-lg">{room.title}</h3>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{room.users} personnes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{room.description}</span>
                          <Button size="sm">Rejoindre</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      <MobileNavigation />
    </main>
  )
}
