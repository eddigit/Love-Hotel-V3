'use server'

import { executeQuery } from '@/lib/db'; // Correctly import executeQuery

// --- Database types (adjust based on your actual schema and where you define types) ---
export type MessageFromDB = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  sender_name: string; // From JOIN with user_profiles
  sender_email: string; // From JOIN with users
};

export type ConversationProtagonist = {
  user_id: string;
  name: string; // From user_profiles
  email: string; // From users
};

export type ModerationMessage = MessageFromDB & {
  protagonists: ConversationProtagonist[];
};

/**
 * Fetches all messages for moderation with pagination.
 * Includes sender information and other protagonists in the conversation.
 */
export async function getAllMessages({ page = 1, limit = 50 }: { page?: number; limit?: number }): Promise<{ messages: ModerationMessage[], total: number }> {
  try {
    const offset = (page - 1) * limit;

    // Query to get messages with sender details
    const messagesQuery = `
      SELECT
        m.id,
        m.conversation_id,
        m.sender_id,
        m.content,
        m.created_at,
        m.updated_at,
        u.name AS sender_name,
        u.email AS sender_email
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      ORDER BY m.created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    // Adjust type and access to results for messagesResult
    const messagesFromDB = await executeQuery<MessageFromDB[]>(messagesQuery, [limit, offset]);

    // Get total count for pagination
    // Adjust type and access to results for totalMessagesResult
    const totalMessagesRows = await executeQuery<{count: string}[]>('SELECT COUNT(*) FROM messages;');
    const total = totalMessagesRows.length > 0 ? parseInt(totalMessagesRows[0].count, 10) : 0;

    // For each message, fetch all protagonists in its conversation
    const messagesWithProtagonists: ModerationMessage[] = [];
    for (const msg of messagesFromDB) {
      const protagonistsQuery = `
        SELECT
          cp.user_id,
          u_p.name,
          u_p.email
        FROM conversation_participants cp
        JOIN users u_p ON cp.user_id = u_p.id
        LEFT JOIN user_profiles up_p ON u_p.id = up_p.user_id
        WHERE cp.conversation_id = $1;
      `;
      // Adjust type and access to results for protagonistsResult
      const protagonists = await executeQuery<ConversationProtagonist[]>(protagonistsQuery, [msg.conversation_id]);
      messagesWithProtagonists.push({
        ...msg,
        protagonists: protagonists, // Assign the array directly
      });
    }

    return { messages: messagesWithProtagonists, total };
  } catch (error) {
    console.error("Error fetching all messages:", error);
    throw new Error("Could not retrieve messages.");
  } // Remove finally block if client.release() is no longer needed
}

/**
 * Deletes a message by replacing its content.
 * (Soft delete: updates content and timestamp)
 */
export async function deleteMessage(messageId: string): Promise<void> {
  try {
    const moderatedContent = "Le contenu de ce message a été supprimé par le modérateur";
    const query = `
      UPDATE messages
      SET content = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2;
    `;
    // Use executeQuery
    await executeQuery(query, [moderatedContent, messageId]);
  } catch (error) {
    console.error('Error deleting message ' + messageId + ':', error);
    throw new Error("Could not delete message.");
  } // Remove finally block if client.release() is no longer needed
}

/**
 * Bans a user.
 */
export async function banUser(userId: string): Promise<void> {
  try {
    const query = 'UPDATE users SET is_banned = TRUE, status = \'banned\', updated_at = CURRENT_TIMESTAMP WHERE id = $1';
    // Use executeQuery
    await executeQuery(query, [userId]);
    console.log('User ' + userId + ' has been banned.');
  } catch (error) {
    console.error('Error banning user ' + userId + ':', error);
    throw new Error("Could not ban user.");
  } // Remove finally block if client.release() is no longer needed
}

/**
 * Unbans a user.
 */
export async function unbanUser(userId: string): Promise<void> {
  try {
    const query = 'UPDATE users SET is_banned = FALSE, status = \'active\', updated_at = CURRENT_TIMESTAMP WHERE id = $1';
    // Use executeQuery
    await executeQuery(query, [userId]);
    console.log('User ' + userId + ' has been unbanned.');
  } catch (error) {
    console.error('Error unbanning user ' + userId + ':', error);
    throw new Error("Could not unban user.");
  } // Remove finally block if client.release() is no longer needed
}
