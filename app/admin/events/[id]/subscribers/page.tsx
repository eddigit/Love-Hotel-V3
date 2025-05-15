"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEventParticipants, removeSubscriberFromEvent } from "@/actions/event-actions"
import { ProtectedRoute } from "@/components/protected-route"
import MainLayout from "@/components/layout/main-layout"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminTabs } from "@/components/admin-tabs"
import { AdminHeader } from "@/components/admin-header"

export default function AdminEventSubscribersPage() {
  const params = useParams()
  const eventId = params?.id as string
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchSubscribers() {
      setLoading(true)
      const result = await getEventParticipants(eventId)
      setSubscribers(result)
      setLoading(false)
    }
    if (eventId) fetchSubscribers()
  }, [eventId])

  const handleRemove = async (userId: string) => {
    await removeSubscriberFromEvent(eventId, userId)
    setSubscribers(subscribers.filter(s => s.id !== userId))
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout user={user}>
        <div className="container py-10 max-w-2xl">
          <AdminHeader user={user} />
          <AdminTabs />
          <Button asChild variant="outline" className="mb-4">
            <Link href="/admin/events">← Retour</Link>
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Liste des inscrits à l'événement</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Chargement...</div>
              ) : (
                <div className="space-y-4">
                  {subscribers.length === 0 ? (
                    <div>Aucun inscrit pour cet événement.</div>
                  ) : (
                    subscribers.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between border-b py-2">
                        <div>
                          <span className="font-medium">{sub.name}</span>
                          {sub.location && <span className="ml-2 text-muted-foreground text-sm">({sub.location})</span>}
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => handleRemove(sub.id)}>
                          Retirer
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
