"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageIcon, Mic, Send } from "lucide-react"
import { useState } from "react"
import { Header } from "@/components/header"

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
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                msg.sender === "me" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
              }`}
            >
              <div className="mb-1">{msg.text}</div>
              <div
                className={`text-xs ${
                  msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                } text-right`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4 sticky bottom-0 bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="rounded-full">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez un message..."
            className="flex-1 rounded-full bg-muted border-none"
          />
          <Button type="submit" size="icon" className="rounded-full" disabled={!message.trim()}>
            <Send className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="rounded-full">
            <Mic className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </main>
  )
}
