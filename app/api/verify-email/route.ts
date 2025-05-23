import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/user-service";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ success: false, error: "Token manquant." }, { status: 400 });
  }
  const result = await verifyEmailToken(token);
  if (result.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }
}
