# Tasks: Brand, ProductCategory, and Product Domain Entities

## 1. Database Migration

- [x] 1.1 Create SQL migration `src/lib/db/migrations/002_create_catalog_entities.sql` with `brands`, `product_categories`, and `products` tables, including foreign keys (`ON DELETE RESTRICT`), unique constraints, partial indexes (`WHERE deleted_at IS NULL`), and `trigger_set_updated_at()` triggers. Verify migration structure and SQL syntax.

## 2. Domain TypeScript Types

- [x] 2.1 Create `src/lib/types/brand.ts` defining `Brand`, `BrandSql`, `CreateBrandInput`, and `UpdateBrandInput` extending base entity contracts, and verify type definitions.
- [x] 2.2 Create `src/lib/types/product-category.ts` defining `ProductCategory`, `ProductCategorySql`, `CreateProductCategoryInput`, and `UpdateProductCategoryInput` with `idBrand` foreign key reference, and verify type definitions.
- [x] 2.3 Create `src/lib/types/product.ts` defining `Product`, `ProductSql`, `CreateProductInput`, and `UpdateProductInput` with `idCategory` foreign key reference, and verify type definitions.

## 3. Data Mappers Implementation

- [x] 3.1 Implement bidirectional mapping functions in `src/lib/db/mappers.ts` for Brand, ProductCategory, and Product (`toBrand`, `toBrandSql`, `toCreateBrandSql`, `toProductCategory`, `toProductCategorySql`, `toCreateProductCategorySql`, `toProduct`, `toProductSql`, `toCreateProductSql`).
- [x] 3.2 Run TypeScript compiler check (`npx tsc --noEmit`) to verify strict type correctness and contract conformance across domain and data layers.
