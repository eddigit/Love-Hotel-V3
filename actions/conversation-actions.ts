"use server"

import { sql } from "@/lib/db"

export async function getUserConversations(userId: string) {
  const conversations = await sql`
    WITH user_conversations AS (
      SELECT 
        c.id,
        c.created_at,
        c.updated_at
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      WHERE cp.user_id = ${userId}
    ),
    last_messages AS (
      SELECT 
        m.conversation_id,
        m.content,
        m.created_at,
        m.sender_id,
        ROW_NUMBER() OVER (PARTITION BY m.conversation_id ORDER BY m.created_at DESC) as rn
      FROM messages m
      JOIN user_conversations uc ON m.conversation_id = uc.id
    ),
    conversation_users AS (
      SELECT 
        cp.conversation_id,
        u.id as user_id,
        u.name,
        u.avatar
      FROM conversation_participants cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.user_id != ${userId}
    )
    SELECT 
      uc.id,
      uc.created_at,
      uc.updated_at,
      lm.content as last_message,
      lm.created_at as last_message_date,
      lm.sender_id as last_message_sender_id,
      cu.user_id as other_user_id,
      cu.name as other_user_name,
      cu.avatar as other_user_avatar
    FROM user_conversations uc
    LEFT JOIN last_messages lm ON uc.id = lm.conversation_id AND lm.rn = 1
    LEFT JOIN conversation_users cu ON uc.id = cu.conversation_id
    ORDER BY lm.created_at DESC NULLS LAST
  `

  return conversations || []
}

export async function getConversationMessages(conversationId: string) {
  const messages = await sql`
    SELECT 
      m.*,
      u.name as sender_name,
      u.avatar as sender_avatar
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = ${conversationId}
    ORDER BY m.created_at ASC
  `

  return messages || []
}
