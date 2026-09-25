import { sql } from "@/lib/db";
import {
  EvaluatedMessageFeedItem,
  QualityLevelMetric,
  SpecialistStats,
} from "@/lib/types/analytics";
import { RoleCode } from "@/lib/types/role";
import { QualityLevelSql } from "@/lib/types/quality-level";
import { toQualityLevel, toUser, toRole } from "@/lib/db/mappers";

export async function getGlobalQualityLevelDistribution(): Promise<QualityLevelMetric[]> {
  const rows = await sql`
    SELECT 
      ql.id, ql.name, ql.description, ql.level,
      ql.created_at, ql.updated_at, ql.deleted_at,
      ql.created_by, ql.updated_by, ql.deleted_by,
      COUNT(m.id)::int AS count
    FROM quality_levels ql
    LEFT JOIN messages m ON m.quality_level_id = ql.id AND m.deleted_at IS NULL
    WHERE ql.deleted_at IS NULL
    GROUP BY ql.id
    ORDER BY ql.level ASC
  `;

  const totalRated = rows.reduce((acc, row) => acc + Number(row.count), 0);

  return rows.map((row) => {
    const count = Number(row.count);
    const percentage = totalRated > 0 ? Math.round((count / totalRated) * 1000) / 10 : 0;

    return {
      qualityLevel: toQualityLevel({
        id: row.id,
        name: row.name,
        description: row.description,
        level: row.level,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        created_by: row.created_by,
        updated_by: row.updated_by,
        deleted_by: row.deleted_by,
      }),
      count,
      percentage,
    };
  });
}

export async function getSpecialistsPerformanceStats(): Promise<SpecialistStats[]> {
  const specialistsRows = await sql`
    SELECT 
      u.id, u.name, u.lastname, u.role_id,
      u.created_at, u.updated_at, u.deleted_at,
      u.created_by, u.updated_by, u.deleted_by,
      r.id AS r_id, r.code AS r_code, r.name AS r_name, r.description AS r_description,
      r.created_at AS r_created_at, r.updated_at AS r_updated_at, r.deleted_at AS r_deleted_at,
      r.created_by AS r_created_by, r.updated_by AS r_updated_by, r.deleted_by AS r_deleted_by
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id AND r.deleted_at IS NULL
    WHERE u.deleted_at IS NULL
      AND r.code = ${RoleCode.SPECIALIST}
    ORDER BY u.name ASC, u.lastname ASC
  `;

  const qualityLevelsRows = await sql<QualityLevelSql[]>`
    SELECT * FROM quality_levels WHERE deleted_at IS NULL ORDER BY level ASC
  `;
  const canonicalQualityLevels = qualityLevelsRows.map((row) => toQualityLevel(row));

  const conversationsRows = await sql`
    SELECT 
      c.id, c.user_id,
      COUNT(m.id)::int AS messages_count
    FROM conversations c
    LEFT JOIN messages m ON m.conversation_id = c.id AND m.deleted_at IS NULL
    WHERE c.deleted_at IS NULL
    GROUP BY c.id, c.user_id
  `;

  const messagesRows = await sql`
    SELECT 
      user_author_id, quality_level_id
    FROM messages
    WHERE deleted_at IS NULL
  `;

  return specialistsRows.map((specRow) => {
    const specialistRole = toRole({
      id: specRow.r_id,
      code: specRow.r_code,
      name: specRow.r_name,
      description: specRow.r_description,
      created_at: specRow.r_created_at,
      updated_at: specRow.r_updated_at,
      deleted_at: specRow.r_deleted_at,
      created_by: specRow.r_created_by,
      updated_by: specRow.r_updated_by,
      deleted_by: specRow.r_deleted_by,
    });

    const specialistUser = toUser(
      {
        id: specRow.id,
        name: specRow.name,
        lastname: specRow.lastname,
        role_id: specRow.role_id,
        created_at: specRow.created_at,
        updated_at: specRow.updated_at,
        deleted_at: specRow.deleted_at,
        created_by: specRow.created_by,
        updated_by: specRow.updated_by,
        deleted_by: specRow.deleted_by,
      },
      specialistRole
    );

    const specialistConvs = conversationsRows.filter((c) => c.user_id === specRow.id);
    const assignedConversationsCount = specialistConvs.length;
    const totalConversationsMessages = specialistConvs.reduce(
      (acc, c) => acc + Number(c.messages_count),
      0
    );
    const averageMessagesPerConversation =
      assignedConversationsCount > 0
        ? Math.round((totalConversationsMessages / assignedConversationsCount) * 10) / 10
        : 0;

    const specialistMessages = messagesRows.filter((m) => m.user_author_id === specRow.id);
    const totalSpecialistMessages = specialistMessages.length;
    const ratedMessages = specialistMessages.filter((m) => Boolean(m.quality_level_id));
    const totalRatedMessages = ratedMessages.length;

    const qualityBreakdown: QualityLevelMetric[] = canonicalQualityLevels.map((ql) => {
      const count = ratedMessages.filter((m) => m.quality_level_id === ql.id).length;
      const percentage =
        totalRatedMessages > 0 ? Math.round((count / totalRatedMessages) * 1000) / 10 : 0;
      return {
        qualityLevel: ql,
        count,
        percentage,
      };
    });

    return {
      specialist: specialistUser,
      assignedConversationsCount,
      totalConversationsMessages,
      averageMessagesPerConversation,
      totalSpecialistMessages,
      totalRatedMessages,
      qualityBreakdown,
    };
  });
}

export async function getAllRecentEvaluations(
  limit: number = 30
): Promise<(EvaluatedMessageFeedItem & { specialistId: string })[]> {
  const rows = await sql`
    SELECT 
      m.id, m.message, m.conversation_id, m.user_author_id, m.quality_level_id, m.rating_user_id,
      m.created_at, m.updated_at,
      c.title AS conversation_title, c.code AS conversation_code,
      ql.id AS ql_id, ql.name AS ql_name, ql.description AS ql_description, ql.level AS ql_level,
      ql.created_at AS ql_created_at, ql.updated_at AS ql_updated_at, ql.deleted_at AS ql_deleted_at,
      ql.created_by AS ql_created_by, ql.updated_by AS ql_updated_by, ql.deleted_by AS ql_deleted_by,
      ru.id AS ru_id, ru.name AS ru_name, ru.lastname AS ru_lastname, ru.role_id AS ru_role_id,
      ru.created_at AS ru_created_at, ru.updated_at AS ru_updated_at, ru.deleted_at AS ru_deleted_at,
      ru.created_by AS ru_created_by, ru.updated_by AS ru_updated_by, ru.deleted_by AS ru_deleted_by
    FROM messages m
    INNER JOIN conversations c ON m.conversation_id = c.id AND c.deleted_at IS NULL
    INNER JOIN quality_levels ql ON m.quality_level_id = ql.id AND ql.deleted_at IS NULL
    LEFT JOIN users ru ON m.rating_user_id = ru.id AND ru.deleted_at IS NULL
    WHERE m.deleted_at IS NULL
    ORDER BY m.updated_at DESC, m.created_at DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => {
    const qualityLevel = toQualityLevel({
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
    });

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

    return {
      id: row.id,
      specialistId: row.user_author_id,
      message: row.message,
      conversationId: row.conversation_id,
      conversationTitle: row.conversation_title,
      conversationCode: row.conversation_code,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      qualityLevel,
      ratingUser,
    };
  });
}

export async function getSpecialistRecentEvaluations(
  specialistId: string,
  limit: number = 10
): Promise<EvaluatedMessageFeedItem[]> {
  const rows = await sql`
    SELECT 
      m.id, m.message, m.conversation_id, m.user_author_id, m.quality_level_id, m.rating_user_id,
      m.created_at, m.updated_at,
      c.title AS conversation_title, c.code AS conversation_code,
      ql.id AS ql_id, ql.name AS ql_name, ql.description AS ql_description, ql.level AS ql_level,
      ql.created_at AS ql_created_at, ql.updated_at AS ql_updated_at, ql.deleted_at AS ql_deleted_at,
      ql.created_by AS ql_created_by, ql.updated_by AS ql_updated_by, ql.deleted_by AS ql_deleted_by,
      ru.id AS ru_id, ru.name AS ru_name, ru.lastname AS ru_lastname, ru.role_id AS ru_role_id,
      ru.created_at AS ru_created_at, ru.updated_at AS ru_updated_at, ru.deleted_at AS ru_deleted_at,
      ru.created_by AS ru_created_by, ru.updated_by AS ru_updated_by, ru.deleted_by AS ru_deleted_by
    FROM messages m
    INNER JOIN conversations c ON m.conversation_id = c.id AND c.deleted_at IS NULL
    INNER JOIN quality_levels ql ON m.quality_level_id = ql.id AND ql.deleted_at IS NULL
    LEFT JOIN users ru ON m.rating_user_id = ru.id AND ru.deleted_at IS NULL
    WHERE m.user_author_id = ${specialistId}
      AND m.deleted_at IS NULL
    ORDER BY m.updated_at DESC, m.created_at DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => {
    const qualityLevel = toQualityLevel({
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
    });

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

    return {
      id: row.id,
      message: row.message,
      conversationId: row.conversation_id,
      conversationTitle: row.conversation_title,
      conversationCode: row.conversation_code,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      qualityLevel,
      ratingUser,
    };
  });
}

export async function getSpecialistQualityDistribution(
  specialistId: string
): Promise<QualityLevelMetric[]> {
  const rows = await sql`
    SELECT 
      ql.id, ql.name, ql.description, ql.level,
      ql.created_at, ql.updated_at, ql.deleted_at,
      ql.created_by, ql.updated_by, ql.deleted_by,
      COUNT(m.id)::int AS count
    FROM quality_levels ql
    LEFT JOIN messages m ON m.quality_level_id = ql.id 
      AND m.user_author_id = ${specialistId} 
      AND m.deleted_at IS NULL
    WHERE ql.deleted_at IS NULL
    GROUP BY ql.id
    ORDER BY ql.level ASC
  `;

  const totalRated = rows.reduce((acc, row) => acc + Number(row.count), 0);

  return rows.map((row) => {
    const count = Number(row.count);
    const percentage = totalRated > 0 ? Math.round((count / totalRated) * 1000) / 10 : 0;

    return {
      qualityLevel: toQualityLevel({
        id: row.id,
        name: row.name,
        description: row.description,
        level: row.level,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        created_by: row.created_by,
        updated_by: row.updated_by,
        deleted_by: row.deleted_by,
      }),
      count,
      percentage,
    };
  });
}
