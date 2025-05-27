import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { neon } from '@neondatabase/serverless'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('photo') as File
  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'Aucun fichier sélectionné' }, { status: 400 })
  }

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '')
    const countRes = await sql`SELECT COUNT(*) FROM photos WHERE user_id = ${user.id}`
    if (parseInt(countRes[0].count) >= 10) {
      return NextResponse.json({ error: 'Maximum 10 photos autorisées' }, { status: 400 })
    }
    const blob = await put(
      `user-photos/${user.id}-${Date.now()}.${file.name.split('.').pop()}`,
      file,
      { access: 'public' }
    )
    await sql`
      INSERT INTO photos (user_id, url, is_primary)
      VALUES (${user.id}, ${blob.url}, false)
    `
    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    return NextResponse.json({ error: "Échec du téléchargement de la photo" }, { status: 500 })
  }
}
