import { BaseEntity, BaseEntitySql, CreateEntityInput, UpdateEntityInput } from "./base-entity";
import { ProductCategory } from "./product-category";

export interface Product extends BaseEntity {
  code: string;
  name: string;
  description: string;
  idCategory: string;
  category?: ProductCategory;
}

export interface ProductSql extends BaseEntitySql {
  code: string;
  name: string;
  description: string;
  category_id: string;
}

export type CreateProductInput = CreateEntityInput<Product>;
export type UpdateProductInput = UpdateEntityInput<Product>;
