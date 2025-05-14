"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileNavigation } from "@/components/mobile-navigation"
import { useNotifications } from "@/contexts/notification-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { EventCard } from "@/components/event-card"
import MainLayout from "@/components/layout/main-layout"

export default function EventsPage(props) {
  const { markAsRead } = useNotifications()
  const { user: authUser } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!authUser?.id) {
      router.replace("/login")
      return
    }

    const eventNotifications = [
      "3", // IDs des notifications de type événement
      "7",
      "toast-1234567890", // ID générique pour les nouvelles notifications toast
    ]

    eventNotifications.forEach((id) => {
      markAsRead(id)
    })
  }, [markAsRead, authUser, router])

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
    <MainLayout user={authUser}>
      <div className="min-h-screen flex flex-col pb-16 md:pb-0">
        <div className="container py-4 md:py-6 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Événements</h1>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4 md:mb-6">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="speed-dating">Speed Dating</TabsTrigger>
              <TabsTrigger value="jacuzzi">Jacuzzi</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    location={event.location}
                    date={event.date}
                    image={event.image}
                    attendees={event.attendees}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="speed-dating" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events
                  .filter((event) => event.category === "speed-dating")
                  .map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      location={event.location}
                      date={event.date}
                      image={event.image}
                      attendees={event.attendees}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="jacuzzi" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events
                  .filter((event) => event.category === "jacuzzi")
                  .map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      location={event.location}
                      date={event.date}
                      image={event.image}
                      attendees={event.attendees}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="restaurant" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events
                  .filter((event) => event.category === "restaurant")
                  .map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      location={event.location}
                      date={event.date}
                      image={event.image}
                      attendees={event.attendees}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <MobileNavigation />
      </div>
    </MainLayout>
  )
}
