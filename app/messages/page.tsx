"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
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
    <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]">
      <div className="container py-4 md:py-6 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Messages</h1>

        <div className="relative mb-4 md:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les messages"
            className="pl-10 bg-[#2d1155]/50 border-purple-800/30 focus:border-[#ff3b8b]"
          />
        </div>

        <div className="space-y-2">
          {conversations.map((conversation) => (
            <Link href={`/messages/${conversation.id}`} key={conversation.id}>
              <Card className="hover:bg-[#2d1155]/70 transition-colors card-hover border-0 bg-[#2d1155]/50 backdrop-blur-sm shadow-lg shadow-purple-900/20">
                <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={conversation.avatar || "/placeholder.svg"}
                      alt={conversation.name}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1a0d2e]"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <div className="ml-2 flex-shrink-0 h-5 w-5 bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] rounded-full flex items-center justify-center">
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
    </div>
  )
}
