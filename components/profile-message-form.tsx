"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { sendMessage, findOrCreateConversation } from "@/actions/conversation-actions"
import { useAuth } from "@/contexts/auth-context"

export function ProfileMessageForm({ recipientId }: { recipientId: string }) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError("")
    setSuccess(false)
    try {
      if (!user?.id) throw new Error("Vous devez être connecté pour envoyer un message.")
      const conversationId = await findOrCreateConversation(user.id, recipientId)
      const result = await sendMessage({ conversationId, senderId: user.id, content: message })
      if (result) {
        setSuccess(true)
        setMessage("")
      } else {
        setError("Erreur lors de l'envoi du message.")
      }
    } catch (err) {
      setError("Erreur lors de l'envoi du message.")
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSend} className="flex flex-col gap-2 mt-6">
      <textarea
        className="border rounded p-2 bg-background text-foreground"
        placeholder="Écrivez un message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={3}
        required
      />
      <div className="flex gap-2 items-center">
        <Button type="submit" disabled={sending || !message.trim()} className="bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] border-0">
          {sending ? "Envoi..." : "Envoyer"}
        </Button>
        {success && <span className="text-green-500 text-sm">Message envoyé !</span>}
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    </form>
  )
}
