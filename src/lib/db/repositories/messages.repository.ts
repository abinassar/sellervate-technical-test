import { sql } from "@/lib/db";
import { Message, MessageSql } from "@/lib/types/message";
import { toMessage, toUser, toRole, toQualityLevel } from "@/lib/db/mappers";

export async function getAllMessages(): Promise<Message[]> {
  const rows = await sql<MessageSql[]>`
    SELECT * FROM messages WHERE deleted_at IS NULL ORDER BY conversation_id ASC, created_at ASC
  `;
  return rows.map((row) => toMessage(row));
}

export async function getMessagesByConversationId(conversationId: string): Promise<Message[]> {
  const rows = await sql`
    SELECT 
      m.id, m.name, m.message, m.conversation_id, m.user_author_id, m.quality_level_id, m.rating_user_id,
      m.created_at, m.updated_at, m.deleted_at, m.created_by, m.updated_by, m.deleted_by,
      
      u.id AS u_id, u.name AS u_name, u.lastname AS u_lastname, u.role_id AS u_role_id,
      u.created_at AS u_created_at, u.updated_at AS u_updated_at, u.deleted_at AS u_deleted_at,
      u.created_by AS u_created_by, u.updated_by AS u_updated_by, u.deleted_by AS u_deleted_by,

      r.id AS r_id, r.code AS r_code, r.name AS r_name, r.description AS r_description,
      r.created_at AS r_created_at, r.updated_at AS r_updated_at, r.deleted_at AS r_deleted_at,
      r.created_by AS r_created_by, r.updated_by AS r_updated_by, r.deleted_by AS r_deleted_by,
      
      ql.id AS ql_id, ql.name AS ql_name, ql.description AS ql_description, ql.level AS ql_level,
      ql.created_at AS ql_created_at, ql.updated_at AS ql_updated_at, ql.deleted_at AS ql_deleted_at,
      ql.created_by AS ql_created_by, ql.updated_by AS ql_updated_by, ql.deleted_by AS ql_deleted_by,
      
      ru.id AS ru_id, ru.name AS ru_name, ru.lastname AS ru_lastname, ru.role_id AS ru_role_id,
      ru.created_at AS ru_created_at, ru.updated_at AS ru_updated_at, ru.deleted_at AS ru_deleted_at,
      ru.created_by AS ru_created_by, ru.updated_by AS ru_updated_by, ru.deleted_by AS ru_deleted_by
    FROM messages m
    LEFT JOIN users u ON m.user_author_id = u.id AND u.deleted_at IS NULL
    LEFT JOIN roles r ON u.role_id = r.id AND r.deleted_at IS NULL
    LEFT JOIN quality_levels ql ON m.quality_level_id = ql.id AND ql.deleted_at IS NULL
    LEFT JOIN users ru ON m.rating_user_id = ru.id AND ru.deleted_at IS NULL
    WHERE m.conversation_id = ${conversationId} AND m.deleted_at IS NULL
    ORDER BY m.created_at ASC
  `;

  return rows.map((row) => {
    const authorRole = row.r_id
      ? toRole({
          id: row.r_id,
          code: row.r_code,
          name: row.r_name,
          description: row.r_description,
          created_at: row.r_created_at,
          updated_at: row.r_updated_at,
          deleted_at: row.r_deleted_at,
          created_by: row.r_created_by,
          updated_by: row.r_updated_by,
          deleted_by: row.r_deleted_by,
        })
      : undefined;

    const userAuthor = row.u_id
      ? toUser(
          {
            id: row.u_id,
            name: row.u_name,
            lastname: row.u_lastname,
            role_id: row.u_role_id,
            created_at: row.u_created_at,
            updated_at: row.u_updated_at,
            deleted_at: row.u_deleted_at,
            created_by: row.u_created_by,
            updated_by: row.u_updated_by,
            deleted_by: row.u_deleted_by,
          },
          authorRole
        )
      : undefined;

    const qualityLevel = row.ql_id
      ? toQualityLevel({
          id: row.ql_id,
          name: row.ql_name,
          description: row.ql_description,
          level: row.ql_level,
          created_at: row.ql_created_at,
          updated_at: row.ql_updated_at,
          deleted_at: row.ql_deleted_at,
          created_by: row.ql_created_by,
          updated_by: row.ql_updated_by,
          deleted_by: row.ql_deleted_by,
        })
      : null;

    const ratingUser = row.ru_id
      ? toUser({
          id: row.ru_id,
          name: row.ru_name,
          lastname: row.ru_lastname,
          role_id: row.ru_role_id,
          created_at: row.ru_created_at,
          updated_at: row.ru_updated_at,
          deleted_at: row.ru_deleted_at,
          created_by: row.ru_created_by,
          updated_by: row.ru_updated_by,
          deleted_by: row.ru_deleted_by,
        })
      : null;

    return toMessage(
      {
        id: row.id,
        name: row.name,
        message: row.message,
        conversation_id: row.conversation_id,
        user_author_id: row.user_author_id,
        quality_level_id: row.quality_level_id,
        rating_user_id: row.rating_user_id,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        created_by: row.created_by,
        updated_by: row.updated_by,
        deleted_by: row.deleted_by,
      },
      undefined,
      userAuthor,
      qualityLevel,
      ratingUser
    );
  });
}

export async function rateMessage(
  messageId: string,
  qualityLevelId: string,
  ratingUserId: string
): Promise<Message | null> {
  const rows = await sql<MessageSql[]>`
    UPDATE messages
    SET
      quality_level_id = ${qualityLevelId},
      rating_user_id = ${ratingUserId},
      updated_at = NOW(),
      updated_by = ${ratingUserId}
    WHERE id = ${messageId} AND deleted_at IS NULL
    RETURNING *
  `;

  if (rows.length === 0) return null;
  return toMessage(rows[0]);
}

