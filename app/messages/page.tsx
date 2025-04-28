"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Edit, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { MobileNavigation } from "@/components/mobile-navigation"
import { useNotifications } from "@/contexts/notification-context"
import { useEffect } from "react"

export default function MessagesPage() {
  const { markAsRead } = useNotifications()

  // Marquer les messages comme lus lorsque l'utilisateur visite la page des messages
  useEffect(() => {
    const messageNotifications = [
      "1", // IDs des notifications de type message
      "5",
      "9",
      "new-1234567890", // ID générique pour les nouvelles notifications
    ]

    messageNotifications.forEach((id) => {
      markAsRead(id)
    })
  }, [markAsRead])

  // Simuler des données de messages
  const conversations = [
    {
      id: 1,
      name: "Sophie",
      lastMessage: "Bonjour, comment vas-tu ?",
      time: "10:30",
      unread: 2,
      avatar: "/amethyst-portrait.png",
      online: true,
    },
    {
      id: 2,
      name: "Thomas",
      lastMessage: "On se voit demain ?",
      time: "Hier",
      unread: 0,
      avatar: "/contemplative-man.png",
      online: false,
    },
    {
      id: 3,
      name: "Julie",
      lastMessage: "J'ai hâte de te rencontrer !",
      time: "Hier",
      unread: 1,
      avatar: "/vibrant-woman.png",
      online: true,
    },
    {
      id: 4,
      name: "Marc",
      lastMessage: "À quelle heure commence l'événement ?",
      time: "Lun",
      unread: 0,
      avatar: "/thoughtful-man-pink.png",
      online: false,
    },
  ]

  return (
    <main className="min-h-screen flex flex-col pb-16 md:pb-0">
      <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <h1 className="font-bold text-xl">Messages</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6 flex-1">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher dans les messages" className="pl-10 bg-muted border-none" />
        </div>

        <div className="space-y-2">
          {conversations.map((conversation) => (
            <Link href={`/messages/${conversation.id}`} key={conversation.id}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={conversation.avatar || "/placeholder.svg"}
                      alt={conversation.name}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <div className="ml-2 flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">{conversation.unread}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <MobileNavigation />
    </main>
  )
}
