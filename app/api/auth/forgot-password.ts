import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: true, // Re-enable Next.js built-in parser for simplicity
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.log("!!! MINIMAL FORGOT PASSWORD HANDLER EXECUTED !!!");
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.log("Request Method:", req.method);

  // Check if body is parsed and what it contains
  console.log("Request Body (parsed by Next.js):", req.body);
  console.log("Request Headers (Content-Type):", req.headers['content-type']);

  if (req.method === "POST") {
    const email = req.body?.email; // Access email safely

    if (!email) {
      console.log("Email is missing in POST request body or body not parsed as expected.");
      return res.status(400).json({ message: "Email is required (from minimal handler)" });
    }

    console.log(`Email received in minimal handler: ${email}`);
    // Simulate success for now to see if we can get a 200
    return res.status(200).json({ message: "Password reset email sent (simulated by minimal handler)" });
  } else {
    console.log(`Method ${req.method} not allowed by minimal handler.`);
    // For non-POST requests, explicitly set Allow header as per HTTP spec for 405
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }
}
