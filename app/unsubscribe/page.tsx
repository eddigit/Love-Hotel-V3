import MainLayout from '@/components/layout/main-layout'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { neon } from '@neondatabase/serverless'
import { redirect } from 'next/navigation'

export default async function UnsubscribePage () {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user) {
    redirect('/login')
  }

  async function handleDeleteAccount () {
    'use server'
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '')
    // Delete user from users table and related tables (cascade or manual)
    await sql`DELETE FROM users WHERE id = ${user.id}`
    // Optionally: sign out user or redirect
    redirect('/goodbye')
  }

  return (
    <MainLayout user={user}>
      <div className='container max-w-screen-md mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold mb-4'>
          Se désinscrire / Supprimer mon compte
        </h1>
        <p className='mb-6'>
          Vous pouvez supprimer définitivement votre compte et toutes vos
          données. Cette action est irréversible.
        </p>
        <form action={handleDeleteAccount}>
          <button
            type='submit'
            className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
          >
            Supprimer mon compte
          </button>
        </form>
      </div>
    </MainLayout>
  )
}
