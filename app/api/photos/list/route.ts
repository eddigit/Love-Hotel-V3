import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '')
  const photos = await sql`SELECT id, url, is_primary FROM photos WHERE user_id = ${userId} ORDER BY created_at ASC`
  return NextResponse.json({ photos })
}
