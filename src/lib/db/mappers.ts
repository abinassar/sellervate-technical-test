import { BaseEntity, BaseEntitySql } from "@/lib/types/base-entity";

export function mapAuditFieldsFromSql(sqlRow: BaseEntitySql): BaseEntity {
  return {
    id: sqlRow.id,
    createdAt: new Date(sqlRow.created_at),
    updatedAt: new Date(sqlRow.updated_at),
    deletedAt: sqlRow.deleted_at ? new Date(sqlRow.deleted_at) : null,
    createdBy: sqlRow.created_by,
    updatedBy: sqlRow.updated_by,
    deletedBy: sqlRow.deleted_by,
  };
}

export function mapAuditFieldsToSql(entity: Partial<BaseEntity>): Partial<BaseEntitySql> {
  const result: Partial<BaseEntitySql> = {};
  if (entity.id !== undefined) result.id = entity.id;
  if (entity.createdAt !== undefined) result.created_at = entity.createdAt;
  if (entity.updatedAt !== undefined) result.updated_at = entity.updatedAt;
  if (entity.deletedAt !== undefined) result.deleted_at = entity.deletedAt;
  if (entity.createdBy !== undefined) result.created_by = entity.createdBy;
  if (entity.updatedBy !== undefined) result.updated_by = entity.updatedBy;
  if (entity.deletedBy !== undefined) result.deleted_by = entity.deletedBy;
  return result;
}

export function toDomainEntity<TSql extends BaseEntitySql, TDomain extends BaseEntity>(
  row: TSql,
  customFieldMapper?: (row: TSql) => Omit<TDomain, keyof BaseEntity>
): TDomain {
  const audit = mapAuditFieldsFromSql(row);
  const extra = customFieldMapper ? customFieldMapper(row) : ({} as Omit<TDomain, keyof BaseEntity>);
  return {
    ...extra,
    ...audit,
  } as TDomain;
}

