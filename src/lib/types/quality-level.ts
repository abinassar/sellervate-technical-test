import { BaseEntity, BaseEntitySql, CreateEntityInput, UpdateEntityInput } from "./base-entity";

export interface QualityLevel extends BaseEntity {
  name: string;
  description: string;
  level: number;
}

export interface QualityLevelSql extends BaseEntitySql {
  name: string;
  description: string;
  level: number;
}

export type CreateQualityLevelInput = CreateEntityInput<QualityLevel>;
export type UpdateQualityLevelInput = UpdateEntityInput<QualityLevel>;
