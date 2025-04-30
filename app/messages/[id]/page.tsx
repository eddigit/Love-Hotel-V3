"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageIcon, Mic, Send, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function ConversationPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("")

  // Simuler des données de conversation
  const conversation = {
    id: Number.parseInt(params.id),
    name: "Sophie",
    avatar: "/amethyst-portrait.png",
    online: true,
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Bonjour, comment vas-tu ?",
        time: "10:30",
      },
      {
        id: 2,
        sender: "me",
        text: "Salut ! Je vais bien, merci. Et toi ?",
        time: "10:32",
      },
      {
        id: 3,
        sender: "them",
        text: "Très bien ! Je me demandais si tu serais intéressé(e) par l'événement de speed dating ce weekend ?",
        time: "10:35",
      },
      {
        id: 4,
        sender: "me",
        text: "Oui, ça a l'air sympa ! C'est à quelle heure ?",
        time: "10:40",
      },
      {
        id: 5,
        sender: "them",
        text: "C'est vendredi à 20h au Love Hotel. Il y aura aussi un accès au jacuzzi après l'événement !",
        time: "10:42",
      },
    ],
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // Ici, vous ajouteriez la logique pour envoyer le message
      setMessage("")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]">
      {/* Header de conversation */}
      <div className="sticky top-0 z-10 bg-[#1a0d2e]/95 backdrop-blur-md border-b border-purple-800/30">
        <div className="container py-3 flex items-center gap-3">
          <Link href="/messages" className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src={conversation.avatar || "/placeholder.svg"}
                alt={conversation.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              {conversation.online && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#1a0d2e]"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold">{conversation.name}</h2>
              {conversation.online && <p className="text-xs text-muted-foreground">En ligne</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 ${
                msg.sender === "me"
                  ? "bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] text-white rounded-br-none"
                  : "bg-[#2d1155]/70 backdrop-blur-sm rounded-bl-none"
              }`}
            >
              <div className="mb-1 break-words">{msg.text}</div>
              <div className={`text-xs ${msg.sender === "me" ? "text-white/70" : "text-muted-foreground"} text-right`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-purple-800/30 p-3 md:p-4 sticky bottom-0 bg-[#1a0d2e]/95 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="rounded-full flex-shrink-0">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez un message..."
            className="flex-1 rounded-full bg-[#2d1155]/50 border-purple-800/30 focus:border-[#ff3b8b]"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full flex-shrink-0 bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] border-0 hover:opacity-90"
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="rounded-full flex-shrink-0 hidden sm:flex">
            <Mic className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
