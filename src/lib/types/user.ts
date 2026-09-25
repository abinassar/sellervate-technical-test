import { BaseEntity, BaseEntitySql, CreateEntityInput, UpdateEntityInput } from "./base-entity";
import { Role } from "./role";

export interface User extends BaseEntity {
  name: string;
  lastname: string;
  idRole: string;
  role?: Role;
}

export interface UserSql extends BaseEntitySql {
  name: string;
  lastname: string;
  role_id: string;
}

export type CreateUserInput = CreateEntityInput<User>;
export type UpdateUserInput = UpdateEntityInput<User>;

