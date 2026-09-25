import { sql } from "@/lib/db";
import { BaseEntity, BaseEntitySql, SoftDeleteEntityInput } from "@/lib/types/base-entity";

export function isEntityActive(entity: Pick<BaseEntity, "deletedAt"> | Pick<BaseEntitySql, "deleted_at">): boolean {
  if ("deletedAt" in entity) {
    return entity.deletedAt === null;
  }
  return entity.deleted_at === null;
}

export function createSoftDeleteUpdate(deletedBy?: string | null): {
  deleted_at: Date;
  deleted_by: string | null;
} {
  return {
    deleted_at: new Date(),
    deleted_by: deletedBy ?? null,
  };
}

export async function softDeleteRecord(
  tableName: string,
  input: SoftDeleteEntityInput
): Promise<boolean> {
  const result = await sql`
    UPDATE ${sql(tableName)}
    SET
      deleted_at = NOW(),
      deleted_by = ${input.deletedBy ?? null}
    WHERE id = ${input.id} AND deleted_at IS NULL
    RETURNING id
  `;
  return result.length > 0;
}

