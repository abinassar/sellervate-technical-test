# Spec Delta: catalog-domain

## Purpose

Defines the domain contracts, relational database schemas, hierarchical foreign key constraints, and bidirectional data mappers for Brand, ProductCategory, and Product entities inheriting the BaseEntity audit foundation.

## ADDED Requirements

### Requirement: Brand Entity and Relational Schema
The system SHALL provide a `Brand` domain entity and corresponding `brands` database table inheriting all `BaseEntity` primary key and audit columns (`id`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`), with domain attributes: `code` (unique string slug), `name` (string), and `description` (string).

#### Scenario: Brand record creation with unique code
- **WHEN** a new brand is inserted with valid code, name, and description
- **THEN** the system persists the entity with an auto-generated UUID primary key, audit timestamps, and enforces uniqueness on `code`.

#### Scenario: Duplicate brand code rejection
- **WHEN** an attempt is made to insert or update a brand with an existing `code`
- **THEN** the database unique constraint rejects the operation.

### Requirement: ProductCategory Entity and Relational Schema
The system SHALL provide a `ProductCategory` domain entity and corresponding `product_categories` database table inheriting all `BaseEntity` primary key and audit columns, with domain attributes: `code` (string), `name` (string), `description` (string), and `brand_id` (`idBrand` in domain model, UUID foreign key referencing `brands.id`).

#### Scenario: ProductCategory creation linked to valid brand
- **WHEN** a new product category is inserted with valid code, name, description, and an existing `idBrand` (UUID)
- **THEN** the category record is persisted with relational integrity referencing the brand, populating standard audit columns.

#### Scenario: ProductCategory creation with invalid brand reference
- **WHEN** a product category is inserted with a non-existent `idBrand`
- **THEN** the relational database foreign key constraint rejects the insertion.

### Requirement: Product Entity and Relational Schema
The system SHALL provide a `Product` domain entity and corresponding `products` database table inheriting all `BaseEntity` primary key and audit columns, with domain attributes: `code` (string), `name` (string), `description` (string), and `category_id` (`idCategory` in domain model, UUID foreign key referencing `product_categories.id`).

#### Scenario: Product creation linked to valid category
- **WHEN** a new product is inserted with valid code, name, description, and an existing `idCategory` (UUID)
- **THEN** the product record is persisted referencing the product category, populating standard audit columns.

#### Scenario: Product creation with invalid category reference
- **WHEN** a product is inserted with a non-existent `idCategory`
- **THEN** the relational database foreign key constraint rejects the insertion.

### Requirement: Catalog Domain Models and Bidirectional Data Mappers
The domain layer SHALL expose TypeScript interfaces (`Brand`, `ProductCategory`, `Product`) extending `BaseEntity`, database interfaces (`BrandSql`, `ProductCategorySql`, `ProductSql`) extending `BaseEntitySql`, and bidirectional mapping utilities converting between snake_case SQL rows and camelCase domain objects.

#### Scenario: Mapping SQL rows to domain entities
- **WHEN** raw brand, product category, or product SQL query results are processed by the data mapper
- **THEN** all audit columns and domain properties (including `brand_id` to `idBrand` and `category_id` to `idCategory`) are mapped to their strongly typed camelCase domain representation.

#### Scenario: Mapping domain input to SQL insert/update payload
- **WHEN** a domain creation DTO (`CreateBrandInput`, `CreateProductCategoryInput`, `CreateProductInput`) is transformed for database insertion
- **THEN** domain properties are translated to corresponding snake_case database columns.
