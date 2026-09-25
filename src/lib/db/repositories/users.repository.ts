import { sql } from "@/lib/db";
import { UserSql } from "@/lib/types/user";
import { toUser } from "@/lib/db/mappers";

export async function getAllUsers() {
  const rows = await sql<UserSql[]>`
    SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at ASC
  `;
  return rows.map((row) => toUser(row));
}
