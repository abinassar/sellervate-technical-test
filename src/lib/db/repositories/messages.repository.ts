import { sql } from "@/lib/db";
import { MessageSql } from "@/lib/types/message";
import { toMessage } from "@/lib/db/mappers";

export async function getAllMessages() {
  const rows = await sql<MessageSql[]>`
    SELECT * FROM messages WHERE deleted_at IS NULL ORDER BY conversation_id ASC, created_at ASC
  `;
  return rows.map((row) => toMessage(row));
}
