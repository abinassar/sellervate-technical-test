import { sql } from "@/lib/db";
import { Conversation, ConversationSql } from "@/lib/types/conversation";
import {
  toConversation,
  toProduct,
  toProductCategory,
  toBrand,
  toUser,
  toRole,
  toQualityLevel,
} from "@/lib/db/mappers";
import { getMessagesByConversationId } from "./messages.repository";

export async function getAllConversations(): Promise<Conversation[]> {
  const rows = await sql<ConversationSql[]>`
    SELECT * FROM conversations WHERE deleted_at IS NULL ORDER BY created_at ASC
  `;
  return rows.map((row) => toConversation(row));
}

// Helper to map joined SQL row to full Conversation domain entity
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function mapConversationRowWithDetails(row: any): Promise<Conversation> {
  const brand = row.b_id
    ? toBrand({
        id: row.b_id,
        code: row.b_code,
        name: row.b_name,
        description: row.b_description,
        created_at: row.b_created_at ?? row.created_at,
        updated_at: row.b_updated_at ?? row.updated_at,
        deleted_at: row.b_deleted_at ?? null,
        created_by: row.b_created_by ?? null,
        updated_by: row.b_updated_by ?? null,
        deleted_by: row.b_deleted_by ?? null,
      })
    : undefined;

  const category = row.pc_id
    ? toProductCategory(
        {
          id: row.pc_id,
          code: row.pc_code,
          name: row.pc_name,
          description: row.pc_description,
          brand_id: row.pc_brand_id,
          created_at: row.pc_created_at ?? row.created_at,
          updated_at: row.pc_updated_at ?? row.updated_at,
          deleted_at: row.pc_deleted_at ?? null,
          created_by: row.pc_created_by ?? null,
          updated_by: row.pc_updated_by ?? null,
          deleted_by: row.pc_deleted_by ?? null,
        },
        brand
      )
    : undefined;

  const product = row.p_id
    ? toProduct(
        {
          id: row.p_id,
          code: row.p_code,
          name: row.p_name,
          description: row.p_description,
          category_id: row.p_category_id,
          created_at: row.p_created_at ?? row.created_at,
          updated_at: row.p_updated_at ?? row.updated_at,
          deleted_at: row.p_deleted_at ?? null,
          created_by: row.p_created_by ?? null,
          updated_by: row.p_updated_by ?? null,
          deleted_by: row.p_deleted_by ?? null,
        },
        category
      )
    : undefined;

  const specialistRole = row.ur_id
    ? toRole({
        id: row.ur_id,
        code: row.ur_code,
        name: row.ur_name,
        description: row.ur_description,
        created_at: row.ur_created_at ?? row.created_at,
        updated_at: row.ur_updated_at ?? row.updated_at,
        deleted_at: row.ur_deleted_at ?? null,
        created_by: row.ur_created_by ?? null,
        updated_by: row.ur_updated_by ?? null,
        deleted_by: row.ur_deleted_by ?? null,
      })
    : undefined;

  const specialistUser = row.u_id
    ? toUser(
        {
          id: row.u_id,
          name: row.u_name,
          lastname: row.u_lastname,
          role_id: row.u_role_id,
          created_at: row.u_created_at ?? row.created_at,
          updated_at: row.u_updated_at ?? row.updated_at,
          deleted_at: row.u_deleted_at ?? null,
          created_by: row.u_created_by ?? null,
          updated_by: row.u_updated_by ?? null,
          deleted_by: row.u_deleted_by ?? null,
        },
        specialistRole
      )
    : undefined;

  const customerRole = row.custr_id
    ? toRole({
        id: row.custr_id,
        code: row.custr_code,
        name: row.custr_name,
        description: row.custr_description,
        created_at: row.custr_created_at ?? row.created_at,
        updated_at: row.custr_updated_at ?? row.updated_at,
        deleted_at: row.custr_deleted_at ?? null,
        created_by: row.custr_created_by ?? null,
        updated_by: row.custr_updated_by ?? null,
        deleted_by: row.custr_deleted_by ?? null,
      })
    : undefined;

  const customerUser = row.cust_id
    ? toUser(
        {
          id: row.cust_id,
          name: row.cust_name,
          lastname: row.cust_lastname,
          role_id: row.cust_role_id,
          created_at: row.cust_created_at ?? row.created_at,
          updated_at: row.cust_updated_at ?? row.updated_at,
          deleted_at: row.cust_deleted_at ?? null,
          created_by: row.cust_created_by ?? null,
          updated_by: row.cust_updated_by ?? null,
          deleted_by: row.cust_deleted_by ?? null,
        },
        customerRole
      )
    : undefined;

  const qualityLevel = row.ql_id
    ? toQualityLevel({
        id: row.ql_id,
        name: row.ql_name,
        description: row.ql_description,
        level: row.ql_level,
        created_at: row.ql_created_at ?? row.created_at,
        updated_at: row.ql_updated_at ?? row.updated_at,
        deleted_at: row.ql_deleted_at ?? null,
        created_by: row.ql_created_by ?? null,
        updated_by: row.ql_updated_by ?? null,
        deleted_by: row.ql_deleted_by ?? null,
      })
    : null;

  const ratingUser = row.ru_id
    ? toUser({
        id: row.ru_id,
        name: row.ru_name,
        lastname: row.ru_lastname,
        role_id: row.ru_role_id,
        created_at: row.ru_created_at ?? row.created_at,
        updated_at: row.ru_updated_at ?? row.updated_at,
        deleted_at: row.ru_deleted_at ?? null,
        created_by: row.ru_created_by ?? null,
        updated_by: row.ru_updated_by ?? null,
        deleted_by: row.ru_deleted_by ?? null,
      })
    : null;

  const messages = await getMessagesByConversationId(row.id);

  const conversation = toConversation(
    {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      title: row.title,
      product_id: row.product_id,
      user_id: row.user_id,
      customer_id: row.customer_id,
      quality_level_id: row.quality_level_id,
      rating_user_id: row.rating_user_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      created_by: row.created_by,
      updated_by: row.updated_by,
      deleted_by: row.deleted_by,
    },
    product,
    specialistUser,
    customerUser,
    qualityLevel,
    ratingUser
  );

  conversation.messages = messages;
  conversation.messagesCount = messages.length;

  return conversation;
}

export async function getRecentConversationsWithDetails(limit: number = 3): Promise<Conversation[]> {
  const rows = await sql`
    SELECT 
      c.id, c.code, c.name, c.description, c.title, c.product_id, c.user_id, c.customer_id, 
      c.quality_level_id, c.rating_user_id, c.created_at, c.updated_at, c.deleted_at,
      c.created_by, c.updated_by, c.deleted_by,

      p.id AS p_id, p.code AS p_code, p.name AS p_name, p.description AS p_description, p.category_id AS p_category_id,
      pc.id AS pc_id, pc.code AS pc_code, pc.name AS pc_name, pc.description AS pc_description, pc.brand_id AS pc_brand_id,
      b.id AS b_id, b.code AS b_code, b.name AS b_name, b.description AS b_description,

      u.id AS u_id, u.name AS u_name, u.lastname AS u_lastname, u.role_id AS u_role_id,
      ur.id AS ur_id, ur.code AS ur_code, ur.name AS ur_name, ur.description AS ur_description,

      cust.id AS cust_id, cust.name AS cust_name, cust.lastname AS cust_lastname, cust.role_id AS cust_role_id,
      custr.id AS custr_id, custr.code AS custr_code, custr.name AS custr_name, custr.description AS custr_description,

      ql.id AS ql_id, ql.name AS ql_name, ql.description AS ql_description, ql.level AS ql_level,

      ru.id AS ru_id, ru.name AS ru_name, ru.lastname AS ru_lastname, ru.role_id AS ru_role_id
    FROM conversations c
    LEFT JOIN products p ON c.product_id = p.id AND p.deleted_at IS NULL
    LEFT JOIN product_categories pc ON p.category_id = pc.id AND pc.deleted_at IS NULL
    LEFT JOIN brands b ON pc.brand_id = b.id AND b.deleted_at IS NULL
    LEFT JOIN users u ON c.user_id = u.id AND u.deleted_at IS NULL
    LEFT JOIN roles ur ON u.role_id = ur.id AND ur.deleted_at IS NULL
    LEFT JOIN users cust ON c.customer_id = cust.id AND cust.deleted_at IS NULL
    LEFT JOIN roles custr ON cust.role_id = custr.id AND custr.deleted_at IS NULL
    LEFT JOIN quality_levels ql ON c.quality_level_id = ql.id AND ql.deleted_at IS NULL
    LEFT JOIN users ru ON c.rating_user_id = ru.id AND ru.deleted_at IS NULL
    WHERE c.deleted_at IS NULL
    ORDER BY c.created_at DESC, c.code DESC
    LIMIT ${limit}
  `;

  return Promise.all(rows.map(mapConversationRowWithDetails));
}

export async function getConversationWithDetailsById(id: string): Promise<Conversation | null> {
  const rows = await sql`
    SELECT 
      c.id, c.code, c.name, c.description, c.title, c.product_id, c.user_id, c.customer_id, 
      c.quality_level_id, c.rating_user_id, c.created_at, c.updated_at, c.deleted_at,
      c.created_by, c.updated_by, c.deleted_by,

      p.id AS p_id, p.code AS p_code, p.name AS p_name, p.description AS p_description, p.category_id AS p_category_id,
      pc.id AS pc_id, pc.code AS pc_code, pc.name AS pc_name, pc.description AS pc_description, pc.brand_id AS pc_brand_id,
      b.id AS b_id, b.code AS b_code, b.name AS b_name, b.description AS b_description,

      u.id AS u_id, u.name AS u_name, u.lastname AS u_lastname, u.role_id AS u_role_id,
      ur.id AS ur_id, ur.code AS ur_code, ur.name AS ur_name, ur.description AS ur_description,

      cust.id AS cust_id, cust.name AS cust_name, cust.lastname AS cust_lastname, cust.role_id AS cust_role_id,
      custr.id AS custr_id, custr.code AS custr_code, custr.name AS custr_name, custr.description AS custr_description,

      ql.id AS ql_id, ql.name AS ql_name, ql.description AS ql_description, ql.level AS ql_level,

      ru.id AS ru_id, ru.name AS ru_name, ru.lastname AS ru_lastname, ru.role_id AS ru_role_id
    FROM conversations c
    LEFT JOIN products p ON c.product_id = p.id AND p.deleted_at IS NULL
    LEFT JOIN product_categories pc ON p.category_id = pc.id AND pc.deleted_at IS NULL
    LEFT JOIN brands b ON pc.brand_id = b.id AND b.deleted_at IS NULL
    LEFT JOIN users u ON c.user_id = u.id AND u.deleted_at IS NULL
    LEFT JOIN roles ur ON u.role_id = ur.id AND ur.deleted_at IS NULL
    LEFT JOIN users cust ON c.customer_id = cust.id AND cust.deleted_at IS NULL
    LEFT JOIN roles custr ON cust.role_id = custr.id AND custr.deleted_at IS NULL
    LEFT JOIN quality_levels ql ON c.quality_level_id = ql.id AND ql.deleted_at IS NULL
    LEFT JOIN users ru ON c.rating_user_id = ru.id AND ru.deleted_at IS NULL
    WHERE c.id = ${id} AND c.deleted_at IS NULL
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return mapConversationRowWithDetails(rows[0]);
}

export async function getConversationsBySpecialistId(specialistId: string): Promise<Conversation[]> {
  const rows = await sql`
    SELECT 
      c.id, c.code, c.name, c.description, c.title, c.product_id, c.user_id, c.customer_id, 
      c.quality_level_id, c.rating_user_id, c.created_at, c.updated_at, c.deleted_at,
      c.created_by, c.updated_by, c.deleted_by,

      p.id AS p_id, p.code AS p_code, p.name AS p_name, p.description AS p_description, p.category_id AS p_category_id,
      pc.id AS pc_id, pc.code AS pc_code, pc.name AS pc_name, pc.description AS pc_description, pc.brand_id AS pc_brand_id,
      b.id AS b_id, b.code AS b_code, b.name AS b_name, b.description AS b_description,

      u.id AS u_id, u.name AS u_name, u.lastname AS u_lastname, u.role_id AS u_role_id,
      ur.id AS ur_id, ur.code AS ur_code, ur.name AS ur_name, ur.description AS ur_description,

      cust.id AS cust_id, cust.name AS cust_name, cust.lastname AS cust_lastname, cust.role_id AS cust_role_id,
      custr.id AS custr_id, custr.code AS custr_code, custr.name AS custr_name, custr.description AS custr_description,

      ql.id AS ql_id, ql.name AS ql_name, ql.description AS ql_description, ql.level AS ql_level,

      ru.id AS ru_id, ru.name AS ru_name, ru.lastname AS ru_lastname, ru.role_id AS ru_role_id
    FROM conversations c
    LEFT JOIN products p ON c.product_id = p.id AND p.deleted_at IS NULL
    LEFT JOIN product_categories pc ON p.category_id = pc.id AND pc.deleted_at IS NULL
    LEFT JOIN brands b ON pc.brand_id = b.id AND b.deleted_at IS NULL
    LEFT JOIN users u ON c.user_id = u.id AND u.deleted_at IS NULL
    LEFT JOIN roles ur ON u.role_id = ur.id AND ur.deleted_at IS NULL
    LEFT JOIN users cust ON c.customer_id = cust.id AND cust.deleted_at IS NULL
    LEFT JOIN roles custr ON cust.role_id = custr.id AND custr.deleted_at IS NULL
    LEFT JOIN quality_levels ql ON c.quality_level_id = ql.id AND ql.deleted_at IS NULL
    LEFT JOIN users ru ON c.rating_user_id = ru.id AND ru.deleted_at IS NULL
    WHERE c.user_id = ${specialistId} AND c.deleted_at IS NULL
    ORDER BY c.created_at DESC, c.code DESC
  `;

  return Promise.all(rows.map(mapConversationRowWithDetails));
}

