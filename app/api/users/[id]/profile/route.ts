import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Validation de l'ID utilisateur
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'ID utilisateur invalide' }, { status: 400 })
    }

    // Récupérer le profil utilisateur (informations publiques uniquement)
    const [userProfile] = await sql`
      SELECT 
        up.user_id,
        u.name,
        u.avatar,
        up.bio,
        up.age,
        up.location,
        up.orientation,
        up.gender,
        up.interests,
        up.display_profile
      FROM user_profiles up
      JOIN users u ON up.user_id = u.id
      WHERE up.user_id = ${userId}
      AND up.display_profile = true
    `

    if (!userProfile) {
      return NextResponse.json({ error: 'Profil non trouvé ou privé' }, { status: 404 })
    }

    // Nettoyer les données sensibles et formater la réponse
    const publicProfile = {
      user_id: userProfile.user_id,
      name: userProfile.name,
      avatar: userProfile.avatar,
      bio: userProfile.bio,
      age: userProfile.age,
      location: userProfile.location,
      orientation: userProfile.orientation,
      gender: userProfile.gender,
      interests: userProfile.interests
    }

    return NextResponse.json(publicProfile)
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
