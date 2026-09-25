import { sql } from "@/lib/db";
import { RoleSql } from "@/lib/types/role";
import { toRole } from "@/lib/db/mappers";

export async function getAllRoles() {
  const rows = await sql<RoleSql[]>`
    SELECT * FROM roles WHERE deleted_at IS NULL ORDER BY created_at ASC
  `;
  return rows.map(toRole);
}
