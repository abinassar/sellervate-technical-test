import { BaseEntity, BaseEntitySql } from "@/lib/types/base-entity";
import { CreateRoleInput, Role, RoleSql } from "@/lib/types/role";
import { CreateUserInput, User, UserSql } from "@/lib/types/user";

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

export function toRole(row: RoleSql): Role {
  return toDomainEntity<RoleSql, Role>(row, (r) => ({
    code: r.code,
    name: r.name,
    description: r.description,
  }));
}

export function toRoleSql(role: Partial<Role>): Partial<RoleSql> {
  const audit = mapAuditFieldsToSql(role);
  const result: Partial<RoleSql> = { ...audit };
  if (role.code !== undefined) result.code = role.code;
  if (role.name !== undefined) result.name = role.name;
  if (role.description !== undefined) result.description = role.description;
  return result;
}

export function toCreateRoleSql(input: CreateRoleInput): Partial<RoleSql> {
  return {
    ...(input.id ? { id: input.id } : {}),
    code: input.code,
    name: input.name,
    description: input.description,
    ...(input.createdBy ? { created_by: input.createdBy } : {}),
  };
}

export function toUser(row: UserSql, role?: Role): User {
  return {
    ...toDomainEntity<UserSql, User>(row, (r) => ({
      name: r.name,
      lastname: r.lastname,
      idRole: r.role_id,
    })),
    ...(role ? { role } : {}),
  };
}

export function toUserSql(user: Partial<User>): Partial<UserSql> {
  const audit = mapAuditFieldsToSql(user);
  const result: Partial<UserSql> = { ...audit };
  if (user.name !== undefined) result.name = user.name;
  if (user.lastname !== undefined) result.lastname = user.lastname;
  if (user.idRole !== undefined) result.role_id = user.idRole;
  return result;
}

export function toCreateUserSql(input: CreateUserInput): Partial<UserSql> {
  return {
    ...(input.id ? { id: input.id } : {}),
    name: input.name,
    lastname: input.lastname,
    role_id: input.idRole,
    ...(input.createdBy ? { created_by: input.createdBy } : {}),
  };
}
