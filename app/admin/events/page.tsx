"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { getUpcomingEvents, deleteEvent } from "@/actions/event-actions"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { AdminTabs } from "@/components/admin-tabs"
import { AdminHeader } from "@/components/admin-header"

export default function AdminEventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      // For admin, fetch all events (userId not needed or use admin id)
      const result = await getUpcomingEvents(user?.id || "")
      setEvents(result)
      setLoading(false)
    }
    if (user?.id) fetchEvents()
  }, [user?.id])

  const handleDelete = async (eventId: string) => {
    if (!window.confirm("Supprimer cet événement ?")) return
    await deleteEvent(eventId)
    setEvents(events.filter(e => e.id !== eventId))
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout user={user}>
        <div className="container py-10">
          <AdminHeader user={user} />
          <AdminTabs />
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Gestion des événements</h1>
            <Button asChild>
              <Link href="/admin/events/new">Créer un événement</Link>
            </Button>
          </div>
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm text-muted-foreground">
                      {event.location} | {event.event_date ? (typeof event.event_date === "string" ? event.event_date : new Date(event.event_date).toLocaleString()) : ""}
                    </div>
                    <div className="mb-2 text-sm text-muted-foreground">
                      Inscriptions : {event.attendees || event.participant_count || 0}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button size="sm" asChild>
                        <Link href={`/admin/events/${event.id}/edit`}>Éditer</Link>
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>
                        Supprimer
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/admin/events/${event.id}/subscribers`}>Voir les inscrits</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/admin/events/${event.id}/notify`}>Notifier</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
