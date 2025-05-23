import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Un utilisateur avec cet email existe déjà" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification token
    const verificationToken = uuidv4()

    // Create user
    const userId = uuidv4()
    await sql`
      INSERT INTO users (id, name, email, password, email_verification_token, created_at, updated_at)
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword}, ${verificationToken}, NOW(), NOW())
    `

    // Create welcome notification
    await sql`
      INSERT INTO notifications (id, user_id, type, title, description, created_at)
      VALUES (
        ${uuidv4()},
        ${userId},
        'system',
        'Bienvenue sur Love Hotel Rencontres !',
        'Votre compte a été créé avec succès. Vérifiez votre email pour activer votre compte.',
        NOW()
      )
    `

    return NextResponse.json(
      {
        message: "Compte créé avec succès",
        userId: userId,
        verificationToken: verificationToken,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Erreur lors de la création du compte" }, { status: 500 })
  }
}
