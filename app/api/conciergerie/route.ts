import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { nom, email, besoin, budget } = await request.json()

    // Assurer que la table existe
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

    // Stockage en base
    await sql`
      INSERT INTO conciergerie_requests (nom, email, besoin, budget, created_at)
      VALUES (${nom}, ${email}, ${besoin}, ${budget}, NOW())
    `

    // Envoi email via SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false }
    })

    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@lovehotel.app',
      to: 'lovehotelaparis@gmail.com',
      subject: 'Nouvelle demande de conciergerie sur-mesure',
      html: `<p><strong>Nom :</strong> ${nom}</p>
             <p><strong>Email :</strong> ${email}</p>
             <p><strong>Besoin :</strong><br/>${besoin.replace(/\n/g, '<br/>')}</p>
             <p><strong>Budget :</strong> ${budget || 'Non spécifié'}</p>`
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('API conciergerie error:', error)
    return NextResponse.json({ ok: false, error: 'Erreur interne' }, { status: 500 })
  }
}
