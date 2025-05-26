'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProtectedRoute } from '@/components/protected-route'
import { getAllUsers, deleteUserByAdmin } from '@/actions/user-actions'
import { banUser, unbanUser } from '@/actions/message-actions'
import MainLayout from '@/components/layout/main-layout'
import { AdminTabs } from '@/components/admin-tabs'
import { AdminHeader } from '@/components/admin-header'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

// Define a more specific type for user data, including ban status
interface AdminUser {
  id: string
  name?: string
  email?: string
  role?: string
  avatar?: string
  location?: string
  age?: number
  is_banned?: boolean
  status?: string
  // Add any other properties that come from getAllUsers
  [key: string]: any // Keep it flexible for other existing props from Record<string, any>
}

export default function AdminUsersPage () {
  const { user } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([]) // Use AdminUser type
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function fetchUsersData () {
    setLoading(true)
    const result = await getAllUsers()
    setUsers(result as AdminUser[]) // Cast to AdminUser[]
    setLoading(false)
  }

  useEffect(() => {
    fetchUsersData()
  }, [])

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    await deleteUserByAdmin(userId)
    setUsers(users.filter(u => u.id !== userId))
  }

  // Handler for banning/unbanning a user
  const handleToggleBan = async (
    userId: string,
    currentIsBanned: boolean | undefined,
    userName: string | undefined
  ) => {
    const action = currentIsBanned ? 'débannir' : 'bannir'
    const confirmMessage = `Êtes-vous sûr de vouloir ${action} cet utilisateur (${
      userName || userId
    }) ?`
    if (!window.confirm(confirmMessage)) return

    try {
      if (currentIsBanned) {
        await unbanUser(userId)
        alert(`Utilisateur ${userName || userId} débanni.`)
      } else {
        await banUser(userId)
        alert(`Utilisateur ${userName || userId} banni.`)
      }
      // Refresh user list to show updated status
      await fetchUsersData() // Call the new fetch function
    } catch (err) {
      console.error(`Error ${action} user:`, err)
      alert(`Erreur lors de la tentative de ${action} l'utilisateur.`)
    }
  }

  const filteredUsers = users.filter(
    u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <MainLayout user={user}>
        <div className='container py-10'>
          <AdminHeader user={user} />
          <AdminTabs />
          <div className='flex items-center justify-between mb-8'>
            <h1 className='text-2xl font-bold'>Gestion des utilisateurs</h1>
          </div>
          <input
            type='text'
            placeholder='Rechercher par nom ou email...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='mb-6 w-full max-w-md border rounded p-2'
          />
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredUsers.map(u => (
                <Card
                  key={u.id}
                  className={u.is_banned ? 'border-red-500 border-2' : ''}
                >
                  <CardHeader>
                    <CardTitle>
                      {u.name}{' '}
                      <span className='text-xs text-muted-foreground'>
                        ({u.role})
                      </span>{' '}
                      {u.is_banned && (
                        <span className='text-red-500 text-xs'>(BANNI)</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-2 text-sm text-muted-foreground'>
                      {u.email}
                    </div>
                    <div className='mb-2 text-sm text-muted-foreground'>
                      {u.location || '-'} | {u.age ? `${u.age} ans` : '-'}
                    </div>
                    <div className='flex gap-2 mt-4'>
                      <Button size='sm' asChild>
                        <Link href={`/admin/users/${u.id}/edit`}>Éditer</Link>
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => handleDelete(u.id)}
                      >
                        Supprimer
                      </Button>
                      <Button
                        size='sm'
                        variant={u.is_banned ? 'outline' : 'destructive'}
                        onClick={() =>
                          handleToggleBan(u.id, u.is_banned, u.name)
                        }
                      >
                        {u.is_banned ? 'Débannir' : 'Bannir'}
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
