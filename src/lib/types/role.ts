import { BaseEntity, BaseEntitySql, CreateEntityInput, UpdateEntityInput } from "./base-entity";

export const RoleCode = {
  ADMIN: "ADMIN",
  TEAM_LEAD: "TEAM_LEAD",
  SPECIALIST: "SPECIALIST",
} as const;

export type RoleCode = (typeof RoleCode)[keyof typeof RoleCode];

export interface Role extends BaseEntity {
  code: string;
  name: string;
  description: string;
}

export interface RoleSql extends BaseEntitySql {
  code: string;
  name: string;
  description: string;
}

export type CreateRoleInput = CreateEntityInput<Role>;
export type UpdateRoleInput = UpdateEntityInput<Role>;

