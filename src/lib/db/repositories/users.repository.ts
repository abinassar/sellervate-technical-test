import { sql } from "@/lib/db";
import { User, UserSql } from "@/lib/types/user";
import { toUser } from "@/lib/db/mappers";

export async function getAllUsers(): Promise<User[]> {
  const rows = await sql<UserSql[]>`
    SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at ASC
  `;
  return rows.map((row) => toUser(row));
}

export async function getAllUsersWithRoles(): Promise<User[]> {
  const rows = await sql`
    SELECT 
      u.id, u.name, u.lastname, u.role_id, u.created_at, u.updated_at, u.deleted_at, u.created_by, u.updated_by, u.deleted_by,
      r.id AS r_id, r.code AS r_code, r.name AS r_name, r.description AS r_description,
      r.created_at AS r_created_at, r.updated_at AS r_updated_at, r.deleted_at AS r_deleted_at,
      r.created_by AS r_created_by, r.updated_by AS r_updated_by, r.deleted_by AS r_deleted_by
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id AND r.deleted_at IS NULL
    WHERE u.deleted_at IS NULL
    ORDER BY u.created_at ASC
  `;

  return rows.map((row) => {
    const role = row.r_id
      ? {
          id: row.r_id,
          code: row.r_code,
          name: row.r_name,
          description: row.r_description,
          createdAt: new Date(row.r_created_at),
          updatedAt: new Date(row.r_updated_at),
          deletedAt: row.r_deleted_at ? new Date(row.r_deleted_at) : null,
          createdBy: row.r_created_by,
          updatedBy: row.r_updated_by,
          deletedBy: row.r_deleted_by,
        }
      : undefined;

    return toUser(
      {
        id: row.id,
        name: row.name,
        lastname: row.lastname,
        role_id: row.role_id,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        created_by: row.created_by,
        updated_by: row.updated_by,
        deleted_by: row.deleted_by,
      },
      role
    );
  });
}
