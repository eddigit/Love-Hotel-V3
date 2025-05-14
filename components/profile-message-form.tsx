"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { sendMessageToUser } from "@/actions/conversation-actions"

export function ProfileMessageForm({ recipientId }: { recipientId: string }) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError("")
    setSuccess(false)
    try {
      const result = await sendMessageToUser(recipientId, message)
      if (result.success) {
        setSuccess(true)
        setMessage("")
      } else {
        setError(result.error || "Erreur lors de l'envoi du message.")
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
