"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { getAllUsers, deleteUserByAdmin } from "@/actions/user-actions"
import MainLayout from "@/components/layout/main-layout"
import { AdminTabs } from "@/components/admin-tabs"
import { AdminHeader } from "@/components/admin-header"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      const result = await getAllUsers()
      setUsers(result)
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return
    await deleteUserByAdmin(userId)
    setUsers(users.filter(u => u.id !== userId))
  }

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout user={user}>
        <div className="container py-10">
          <AdminHeader user={user} />
          <AdminTabs />
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-6 w-full max-w-md border rounded p-2"
          />
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(u => (
                <Card key={u.id}>
                  <CardHeader>
                    <CardTitle>{u.name} <span className="text-xs text-muted-foreground">({u.role})</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm text-muted-foreground">{u.email}</div>
                    <div className="mb-2 text-sm text-muted-foreground">{u.location || "-"} | {u.age ? `${u.age} ans` : "-"}</div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" asChild>
                        <Link href={`/admin/users/${u.id}/edit`}>Éditer</Link>
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>
                        Supprimer
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
