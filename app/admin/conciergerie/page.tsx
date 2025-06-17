import React from 'react'
import { sql } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'
import { AdminHeader } from '@/components/admin-header'
import { AdminTabs } from '@/components/admin-tabs'

interface RequestRecord {
  id: string
  nom: string
  email: string
  besoin: string
  budget: string | null
  created_at: string
}

export default async function AdminConciergeriePage() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user || user.role !== 'admin') {
    redirect('/unauthorized')
  }

  // Créer la table si elle n'existe pas
  await sql`
    CREATE TABLE IF NOT EXISTS conciergerie_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nom VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      besoin TEXT NOT NULL,
      budget VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `

  let demandes: RequestRecord[] = []
  try {
    demandes = (await sql`
      SELECT id, nom, email, besoin, budget, created_at
      FROM conciergerie_requests
      ORDER BY created_at DESC
    `) as RequestRecord[]
  } catch (error) {
    console.error('Erreur récupération demandes conciergerie:', error)
    return (
      <MainLayout user={user}>
        <div className="container py-8">
          <AdminHeader user={user} />
          <AdminTabs />
          <div className="text-red-500">
            Erreur serveur lors de la récupération des demandes : {String(error)}
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout user={user}>
      <div className="container py-8">
        <AdminHeader user={user} />
        <AdminTabs />
        <h1 className="text-3xl font-bold mb-6">Demandes de Conciergerie</h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#3d1155]/80 text-white">
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Besoin</th>
                <th className="px-4 py-2">Budget</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map(d => (
                <tr key={d.id} className="border-b border-gray-700">
                  <td className="px-4 py-3 text-white">{d.nom}</td>
                  <td className="px-4 py-3 text-white">{d.email}</td>
                  <td className="px-4 py-3 text-white max-w-xs truncate">{d.besoin}</td>
                  <td className="px-4 py-3 text-white">{d.budget || '–'}</td>
                  <td className="px-4 py-3 text-white">{new Date(d.created_at).toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  )
}
