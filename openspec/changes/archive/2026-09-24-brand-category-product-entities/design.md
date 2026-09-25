# Design: Brand, ProductCategory, and Product Domain Entities

## Context

The application architecture establishes a strict separation between database row structures (`*Sql` interfaces in snake_case) and domain model entities (`camelCase` interfaces inheriting `BaseEntity`). The base entity contract (`src/lib/types/base-entity.ts` and `src/lib/db/migrations/000_base_entity_foundation.sql`) standardizes primary key UUID generation, soft-deletion timestamps, and audit actor fields (`created_by`, `updated_by`, `deleted_by`).

This design specifies the catalog domain layer comprising `Brand`, `ProductCategory`, and `Product`, maintaining 1-to-many hierarchical relationships (`Brand` 1:N `ProductCategory` 1:N `Product`).

## Goals / Non-Goals

**Goals:**
- Provide strongly typed domain entities (`Brand`, `ProductCategory`, `Product`) extending `BaseEntity`.
- Provide database row interfaces (`BrandSql`, `ProductCategorySql`, `ProductSql`) extending `BaseEntitySql`.
- Create PostgreSQL migration `002_create_catalog_entities.sql` defining relational tables (`brands`, `product_categories`, `products`) with foreign keys, indexes, and updated_at triggers.
- Implement bidirectional mapping functions in `src/lib/db/mappers.ts` leveraging the generic `toDomainEntity` utility.

**Non-Goals:**
- UI views, administrative CRUD screens, or catalog management forms (scoped to subsequent UI tickets).
- QA evaluation and scoring logic that references products (scoped to QA scoring capabilities).

## Decisions

### 1. Schema Design and Foreign Key Naming
- **Database Schema**:
  - `brands` (table): `id UUID PRIMARY KEY`, `code VARCHAR(50) UNIQUE`, `name VARCHAR(100)`, `description TEXT`.
  - `product_categories` (table): `id UUID PRIMARY KEY`, `code VARCHAR(50)`, `name VARCHAR(100)`, `description TEXT`, `brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT`.
  - `products` (table): `id UUID PRIMARY KEY`, `code VARCHAR(50)`, `name VARCHAR(100)`, `description TEXT`, `category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT`.
- **Domain Property Conventions**:
  - Domain models use `idBrand` and `idCategory` to align with the codebase pattern (`idRole` on `User`).
  - Optional nested relations are supported on domain entities (`brand?: Brand` on `ProductCategory`, `category?: ProductCategory` on `Product`).

*Alternatives considered*:
- Using `brandId` / `categoryId` in domain: Rejected in favor of existing codebase consistency with `idRole` in `src/lib/types/user.ts`.

### 2. Relational Integrity and Uniqueness
- Foreign keys enforce `ON DELETE RESTRICT` to prevent accidental deletion of brands or categories with active children.
- Brand codes are globally unique (`uq_brands_code UNIQUE (code)`).
- Category codes are unique per brand (`uq_product_categories_brand_code UNIQUE (brand_id, code)`).
- Product codes are unique per category (`uq_products_category_code UNIQUE (category_id, code)`).

### 3. TypeScript Domain Types Structure
- Create dedicated files:
  - `src/lib/types/brand.ts`: `Brand`, `BrandSql`, `CreateBrandInput`, `UpdateBrandInput`.
  - `src/lib/types/product-category.ts`: `ProductCategory`, `ProductCategorySql`, `CreateProductCategoryInput`, `UpdateProductCategoryInput`.
  - `src/lib/types/product.ts`: `Product`, `ProductSql`, `CreateProductInput`, `UpdateProductInput`.

### 4. Data Mappers Implementation
- Extend `src/lib/db/mappers.ts`:
  - `toBrand(row: BrandSql): Brand`
  - `toBrandSql(brand: Partial<Brand>): Partial<BrandSql>`
  - `toCreateBrandSql(input: CreateBrandInput): Partial<BrandSql>`
  - `toProductCategory(row: ProductCategorySql, brand?: Brand): ProductCategory`
  - `toProductCategorySql(category: Partial<ProductCategory>): Partial<ProductCategorySql>`
  - `toCreateProductCategorySql(input: CreateProductCategoryInput): Partial<ProductCategorySql>`
  - `toProduct(row: ProductSql, category?: ProductCategory): Product`
  - `toProductSql(product: Partial<Product>): Partial<ProductSql>`
  - `toCreateProductSql(input: CreateProductInput): Partial<ProductSql>`

## Risks / Trade-offs

- **[Risk]** Cascading soft-deletion across hierarchical entities.
  - **Mitigation**: Foreign keys use `ON DELETE RESTRICT`; application-level soft delete handlers manage lifecycle without orphan records.
- **[Risk]** Query overhead when joining nested brand and category structures.
  - **Mitigation**: Standard indexes on foreign keys (`brand_id`, `category_id`) filtered on active records (`WHERE deleted_at IS NULL`).
