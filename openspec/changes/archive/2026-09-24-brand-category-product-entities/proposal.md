# Proposal: Brand, ProductCategory, and Product Domain Entities

## Why

To support catalog-driven quality assurance, evaluation, and conversation routing, the system requires strongly typed core catalog entities representing Brands, Product Categories, and Products. Introducing these entities with relational integrity, BaseEntity audit compliance, and bidirectional mappings establishes the structural catalog foundation needed for conversation-to-brand scoring and analytics.

## What Changes

- Create TypeScript domain interfaces and database representations for `Brand`, `ProductCategory`, and `Product` extending `BaseEntity` and `BaseEntitySql`.
- Establish hierarchical 1-to-many relationships:
  - 1 `Brand` to N `ProductCategory` (`brand_id` foreign key referencing `brands.id`, domain field `idBrand`).
  - 1 `ProductCategory` to N `Product` (`category_id` foreign key referencing `product_categories.id`, domain field `idCategory`).
- Create SQL migration `002_create_catalog_entities.sql` with tables `brands`, `product_categories`, and `products`, incorporating soft delete indexes and automatic `updated_at` triggers.
- Extend `src/lib/db/mappers.ts` with bidirectional mapping utilities between SQL rows and domain models (`toBrand`, `toProductCategory`, `toProduct`, and SQL creation mappers).

## Capabilities

### New Capabilities
- `catalog-domain`: Defines contracts, database schemas, relational integrity rules, and bidirectional mappings for Brand, ProductCategory, and Product entities.

### Modified Capabilities
<!-- None -->

## Impact

- **Database**: Adds `brands`, `product_categories`, and `products` tables with foreign keys and indexes in PostgreSQL.
- **Domain Layer**: Adds `src/lib/types/brand.ts`, `src/lib/types/product-category.ts`, and `src/lib/types/product.ts`.
- **Data Access & Mappers**: Extends `src/lib/db/mappers.ts` to support conversion between camelCase domain interfaces and snake_case SQL schemas.
