import { sql } from "@/lib/db";
import { ConversationSql } from "@/lib/types/conversation";
import { toConversation } from "@/lib/db/mappers";

export async function getAllConversations() {
  const rows = await sql<ConversationSql[]>`
    SELECT * FROM conversations WHERE deleted_at IS NULL ORDER BY created_at ASC
  `;
  return rows.map((row) => toConversation(row));
}
