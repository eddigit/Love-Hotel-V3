import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.log("!!! REQUEST-PASSWORD-RESET HANDLER EXECUTED !!!");
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.log("Request Method:", req.method);

  try {
    const body = await req.json();
    console.log("Request Body (parsed by Next.js):", body);
    console.log("Request Headers (Content-Type):", req.headers.get('content-type'));

    const { email } = body;

    if (!email) {
      console.log("Email is missing in POST request body or body not parsed as expected.");
      return NextResponse.json({ message: "Email is required (from request-password-reset handler)" }, { status: 400 });
    }

    console.log(`Email received in request-password-reset handler: ${email}`);
    // Simulate success for now
    return NextResponse.json({ message: "Password reset email sent (simulated by request-password-reset handler)" }, { status: 200 });
  } catch (error) {
    console.error("Error parsing JSON body or in handler:", error);
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}
