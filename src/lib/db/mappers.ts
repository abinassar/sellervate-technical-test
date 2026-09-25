import { BaseEntity, BaseEntitySql } from "@/lib/types/base-entity";
import { CreateBrandInput, Brand, BrandSql } from "@/lib/types/brand";
import { CreateProductCategoryInput, ProductCategory, ProductCategorySql } from "@/lib/types/product-category";
import { CreateProductInput, Product, ProductSql } from "@/lib/types/product";
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

export function toBrand(row: BrandSql): Brand {
  return toDomainEntity<BrandSql, Brand>(row, (r) => ({
    code: r.code,
    name: r.name,
    description: r.description,
  }));
}

export function toBrandSql(brand: Partial<Brand>): Partial<BrandSql> {
  const audit = mapAuditFieldsToSql(brand);
  const result: Partial<BrandSql> = { ...audit };
  if (brand.code !== undefined) result.code = brand.code;
  if (brand.name !== undefined) result.name = brand.name;
  if (brand.description !== undefined) result.description = brand.description;
  return result;
}

export function toCreateBrandSql(input: CreateBrandInput): Partial<BrandSql> {
  return {
    ...(input.id ? { id: input.id } : {}),
    code: input.code,
    name: input.name,
    description: input.description,
    ...(input.createdBy ? { created_by: input.createdBy } : {}),
  };
}

export function toProductCategory(row: ProductCategorySql, brand?: Brand): ProductCategory {
  return {
    ...toDomainEntity<ProductCategorySql, ProductCategory>(row, (r) => ({
      code: r.code,
      name: r.name,
      description: r.description,
      idBrand: r.brand_id,
    })),
    ...(brand ? { brand } : {}),
  };
}

export function toProductCategorySql(category: Partial<ProductCategory>): Partial<ProductCategorySql> {
  const audit = mapAuditFieldsToSql(category);
  const result: Partial<ProductCategorySql> = { ...audit };
  if (category.code !== undefined) result.code = category.code;
  if (category.name !== undefined) result.name = category.name;
  if (category.description !== undefined) result.description = category.description;
  if (category.idBrand !== undefined) result.brand_id = category.idBrand;
  return result;
}

export function toCreateProductCategorySql(input: CreateProductCategoryInput): Partial<ProductCategorySql> {
  return {
    ...(input.id ? { id: input.id } : {}),
    code: input.code,
    name: input.name,
    description: input.description,
    brand_id: input.idBrand,
    ...(input.createdBy ? { created_by: input.createdBy } : {}),
  };
}

export function toProduct(row: ProductSql, category?: ProductCategory): Product {
  return {
    ...toDomainEntity<ProductSql, Product>(row, (r) => ({
      code: r.code,
      name: r.name,
      description: r.description,
      idCategory: r.category_id,
    })),
    ...(category ? { category } : {}),
  };
}

export function toProductSql(product: Partial<Product>): Partial<ProductSql> {
  const audit = mapAuditFieldsToSql(product);
  const result: Partial<ProductSql> = { ...audit };
  if (product.code !== undefined) result.code = product.code;
  if (product.name !== undefined) result.name = product.name;
  if (product.description !== undefined) result.description = product.description;
  if (product.idCategory !== undefined) result.category_id = product.idCategory;
  return result;
}

export function toCreateProductSql(input: CreateProductInput): Partial<ProductSql> {
  return {
    ...(input.id ? { id: input.id } : {}),
    code: input.code,
    name: input.name,
    description: input.description,
    category_id: input.idCategory,
    ...(input.createdBy ? { created_by: input.createdBy } : {}),
  };
}
