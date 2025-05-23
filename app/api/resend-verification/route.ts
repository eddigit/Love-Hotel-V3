import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/user-service";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { getOption } from "@/actions/user-actions";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ success: false, error: "Email manquant." }, { status: 400 });
  }
  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ success: false, error: "Utilisateur introuvable." }, { status: 404 });
  }
  if (user.email_verified) {
    return NextResponse.json({ success: false, error: "Email déjà vérifié." }, { status: 400 });
  }
  // Generate a new token
  const token = uuidv4();
  await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/internal-update-verification-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, token }),
  });
  // Send email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false }
  });
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
  // Fetch email template
  const subjectTemplate = (await getOption("verification_email_subject")) || "Vérifiez votre adresse email sur Love Hotel";
  const bodyTemplate = (await getOption("verification_email_body")) ||
    `Bonjour [name],\n\nMerci de vous être inscrit sur Love Hotel !\n\nVeuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :\n\n[verification-link]\n\nSi vous n'avez pas créé de compte, ignorez cet email.\n\nL'équipe Love Hotel`;

  // Replace placeholders
  const subject = subjectTemplate.replace(/\[name\]/g, user.name || "").replace(/\[verification-link\]/g, verifyUrl);
  const body = bodyTemplate.replace(/\[name\]/g, user.name || "").replace(/\[verification-link\]/g, verifyUrl).replace(/\n/g, "<br>");

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@lovehotel.app',
    to: email,
    subject,
    html: body
  });
  return NextResponse.json({ success: true });
}
