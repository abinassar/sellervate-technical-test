import { BaseEntity, BaseEntitySql, CreateEntityInput, UpdateEntityInput } from "./base-entity";

export interface Brand extends BaseEntity {
  code: string;
  name: string;
  description: string;
}

export interface BrandSql extends BaseEntitySql {
  code: string;
  name: string;
  description: string;
}

export type CreateBrandInput = CreateEntityInput<Brand>;
export type UpdateBrandInput = UpdateEntityInput<Brand>;
