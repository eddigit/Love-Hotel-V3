"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { Users, Calendar, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Panneau d'administration</h1>
            <p className="text-muted-foreground">Bienvenue, {user?.name}. Gérez votre application depuis ce panneau.</p>
          </div>
          <Button asChild>
            <Link href="/">Retour au site</Link>
          </Button>
        </div>

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
                40,000 utilisateurs enregistrés, 1,250 actifs aujourd'hui
              </p>
              <Button className="w-full">Voir les utilisateurs</Button>
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
              <p className="text-sm text-muted-foreground mb-4">12 événements à venir, 3 nécessitent votre attention</p>
              <Button className="w-full">Gérer les événements</Button>
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
              <p className="text-sm text-muted-foreground mb-4">Dernière mise à jour: il y a 3 jours</p>
              <Button className="w-full">Modifier les paramètres</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
