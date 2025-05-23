import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId, token } = await req.json();
  if (!userId || !token) {
    return NextResponse.json({ success: false, error: "Paramètres manquants." }, { status: 400 });
  }
  await executeQuery(
    `UPDATE users SET email_verification_token = $1 WHERE id = $2`,
    [token, userId]
  );
  return NextResponse.json({ success: true });
}
