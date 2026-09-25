import { BaseEntity, BaseEntitySql, CreateEntityInput, UpdateEntityInput } from "./base-entity";
import { Brand } from "./brand";

export interface ProductCategory extends BaseEntity {
  code: string;
  name: string;
  description: string;
  idBrand: string;
  brand?: Brand;
}

export interface ProductCategorySql extends BaseEntitySql {
  code: string;
  name: string;
  description: string;
  brand_id: string;
}

export type CreateProductCategoryInput = CreateEntityInput<ProductCategory>;
export type UpdateProductCategoryInput = UpdateEntityInput<ProductCategory>;
