"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { Users, Calendar, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { AdminTabs } from "@/components/admin-tabs"
import { AdminHeader } from "@/components/admin-header"
import { getAllUsers } from "@/actions/user-actions"
import { getUpcomingEvents } from "@/actions/event-actions"
import { useEffect, useState } from "react"
import { AdminStats } from "@/components/admin-stats"

export default function AdminPage() {
  const { user } = useAuth()
  const [userCount, setUserCount] = useState(0)
  const [eventCount, setEventCount] = useState(0)

  useEffect(() => {
    async function fetchDashboardData() {
      const users = await getAllUsers()
      setUserCount(users.length)
      const events = await getUpcomingEvents()
      setEventCount(events.length)
    }
    fetchDashboardData()
  }, [])

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout user={user}>
        <div className="container py-10">
          <AdminHeader user={user} />
          <AdminTabs />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Gestion des utilisateurs
                </CardTitle>
                <CardDescription>Gérer les comptes utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {userCount} utilisateurs enregistrés{/* , X actifs aujourd'hui */}
                </p>
                <Button className="w-full" asChild>
                  <Link href="/admin/users">Voir les utilisateurs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Événements
                </CardTitle>
                <CardDescription>Gérer les événements à venir</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{eventCount} événements à venir{/* , X nécessitent votre attention */}</p>
                <Button className="w-full" asChild>
                  <Link href="/admin/events">Gérer les événements</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Paramètres du site
                </CardTitle>
                <CardDescription>Configuration générale</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Dernière mise à jour: (à implémenter)</p>
                <Button className="w-full" asChild>
                <Link href="/admin/options">Modifier les paramètres</Link></Button>
              </CardContent>
            </Card>
          </div>
          <AdminStats />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
