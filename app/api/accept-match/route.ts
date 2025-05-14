import { NextRequest, NextResponse } from "next/server"
import { acceptMatchRequest } from "@/actions/user-actions"
import { findOrCreateConversation } from "@/actions/conversation-actions"

export async function POST(req: NextRequest) {
  try {
    const { requesterId, receiverId } = await req.json()
    console.log("[ACCEPT-MATCH] requesterId:", requesterId, "receiverId:", receiverId)
    if (!requesterId || !receiverId) {
      console.error("[ACCEPT-MATCH] Missing user IDs")
      return NextResponse.json({ success: false, error: "Missing user IDs" }, { status: 400 })
    }
    // Accept the match
    const result = await acceptMatchRequest(requesterId, receiverId)
    console.log("[ACCEPT-MATCH] acceptMatchRequest result:", result)
    if (!result.success) {
      console.error("[ACCEPT-MATCH] Failed to accept match:", result.error)
      return NextResponse.json({ success: false, error: result.error || "Failed to accept match" }, { status: 500 })
    }
    // Create/find conversation
    const conversationId = await findOrCreateConversation(receiverId, requesterId)
    console.log("[ACCEPT-MATCH] findOrCreateConversation result:", conversationId)
    if (!conversationId) {
      console.error("[ACCEPT-MATCH] Could not create conversation")
      return NextResponse.json({ success: false, error: "Could not create conversation" }, { status: 500 })
    }
    return NextResponse.json({ success: true, conversationId })
  } catch (err) {
    console.error("[ACCEPT-MATCH] Server error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
