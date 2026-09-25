# Capability: quality-level-domain

## Purpose

Defines the domain contracts, relational database schemas, audit columns, validation rules, and bidirectional data mappers for QualityLevel entities in the Sellervate QA evaluation platform.

## Requirements

### Requirement: QualityLevel Entity and Relational Schema
The system SHALL provide a `QualityLevel` domain entity and corresponding `quality_levels` database table inheriting all `BaseEntity` primary key and audit columns (`id`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`), with domain attributes: `name` (string), `description` (string), and `level` (integer, where higher numeric values represent superior quality tiers).

#### Scenario: QualityLevel record creation with valid properties
- **WHEN** a new quality level is inserted with valid name, description, and integer level
- **THEN** the record is persisted with an auto-generated UUID primary key, audit timestamps, and standard soft-delete support.

#### Scenario: QualityLevel query ordering by level
- **WHEN** active quality levels are queried
- **THEN** the system returns records supporting ordering by level in ascending or descending order.

### Requirement: QualityLevel Domain Models and Bidirectional Data Mappers
The domain layer SHALL expose TypeScript interfaces (`QualityLevel`, `QualityLevelSql`), input types (`CreateQualityLevelInput`, `UpdateQualityLevelInput`), and bidirectional mapping utilities converting between snake_case SQL rows and camelCase domain objects.

#### Scenario: Mapping SQL rows to QualityLevel domain entity
- **WHEN** raw quality level SQL query results are processed by the data mapper
- **THEN** all audit columns and domain properties (`name`, `description`, `level`) are mapped to strongly typed camelCase domain entities.

#### Scenario: Mapping domain input to SQL insert/update payload
- **WHEN** domain input DTOs (`CreateQualityLevelInput`, `UpdateQualityLevelInput`) are transformed for database operations
- **THEN** domain properties are translated to corresponding snake_case database columns.
