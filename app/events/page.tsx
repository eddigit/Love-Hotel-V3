"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Filter, MapPin, Search, Users } from "lucide-react"
import Image from "next/image"
import { MobileNavigation } from "@/components/mobile-navigation"
import { useNotifications } from "@/contexts/notification-context"
import { useEffect } from "react"

export default function EventsPage() {
  const { markAsRead } = useNotifications()

  // Marquer les notifications d'événements comme lues lorsque l'utilisateur visite la page des événements
  useEffect(() => {
    const eventNotifications = [
      "3", // IDs des notifications de type événement
      "7",
      "toast-1234567890", // ID générique pour les nouvelles notifications toast
    ]

    eventNotifications.forEach((id) => {
      markAsRead(id)
    })
  }, [markAsRead])

  // Simuler des données d'événements
  const events = [
    {
      id: 1,
      title: "Speed Dating",
      location: "Love Hotel - Paris",
      date: "Vendredi, 20:00",
      image: "/purple-speed-dates.png",
      attendees: 24,
      category: "speed-dating",
    },
    {
      id: 2,
      title: "Soirée Jacuzzi",
      location: "Love Hotel - Lyon",
      date: "Samedi, 21:00",
      image: "/pink-jacuzzi-night.png",
      attendees: 16,
      category: "jacuzzi",
    },
    {
      id: 3,
      title: "Dîner Romantique",
      location: "Restaurant Love Hotel - Paris",
      date: "Dimanche, 19:30",
      image: "/twilight-tryst.png",
      attendees: 30,
      category: "restaurant",
    },
    {
      id: 4,
      title: "Soirée Dansante",
      location: "Love Hotel - Marseille",
      date: "Samedi, 22:00",
      image: "/pink-dance-vibe.png",
      attendees: 50,
      category: "soiree",
    },
    {
      id: 5,
      title: "Brunch & Rencontres",
      location: "Restaurant Love Hotel - Lyon",
      date: "Dimanche, 11:00",
      image: "/purple-haze-brunch.png",
      attendees: 20,
      category: "restaurant",
    },
    {
      id: 6,
      title: "Speed Dating",
      location: "Love Hotel - Bordeaux",
      date: "Vendredi, 20:30",
      image: "/pink-speed-dates.png",
      attendees: 22,
      category: "speed-dating",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col pb-16 md:pb-0">
      <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <h1 className="font-bold text-xl">Événements</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6 flex-1">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="speed-dating">Speed Dating</TabsTrigger>
            <TabsTrigger value="jacuzzi">Jacuzzi</TabsTrigger>
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-bold text-lg">{event.title}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees} participants</span>
                      </div>
                    </div>
                    <Button className="w-full">Participer</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="speed-dating" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events
                .filter((event) => event.category === "speed-dating")
                .map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div className="text-white">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{event.attendees} participants</span>
                        </div>
                      </div>
                      <Button className="w-full">Participer</Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="jacuzzi" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events
                .filter((event) => event.category === "jacuzzi")
                .map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div className="text-white">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{event.attendees} participants</span>
                        </div>
                      </div>
                      <Button className="w-full">Participer</Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="restaurant" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events
                .filter((event) => event.category === "restaurant")
                .map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div className="text-white">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{event.attendees} participants</span>
                        </div>
                      </div>
                      <Button className="w-full">Participer</Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MobileNavigation />
    </main>
  )
}
