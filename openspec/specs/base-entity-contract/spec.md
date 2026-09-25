# Capability: base-entity-contract

## Purpose

Defines the foundational database audit columns, TypeScript domain model contract, soft-deletion lifecycle, and user attribution rules inherited by all system entities.

## Requirements

### Requirement: Standardized Audit Columns in Database Schema
All relational database tables representing domain entities SHALL include canonical primary key and audit columns: `id` (UUID primary key), `created_at` (TIMESTAMPTZ not null default now()), `updated_at` (TIMESTAMPTZ not null default now()), `deleted_at` (TIMESTAMPTZ nullable), `created_by` (UUID nullable), `updated_by` (UUID nullable), and `deleted_by` (UUID nullable).

#### Scenario: Table creation adheres to base column specification
- **WHEN** a new domain table schema is defined and migrated
- **THEN** it contains the standard primary key `id` and all six audit and actor tracking columns with correct data types and nullability constraints.

### Requirement: Shared Base Entity Interface in Domain Layer
All application domain entity models, data transfer objects, and repository mapping types SHALL extend a shared `BaseEntity` contract containing `id: string`, `createdAt: Date`, `updatedAt: Date`, `deletedAt: Date | null`, `createdBy: string | null`, `updatedBy: string | null`, and `deletedBy: string | null`.

#### Scenario: Domain model inheritance and type safety
- **WHEN** a domain entity type is declared
- **THEN** it extends `BaseEntity` ensuring consistent representation of audit timestamps and actor GUID identifiers across the codebase.

#### Scenario: Database snake_case to domain camelCase mapping
- **WHEN** raw database records are retrieved from PostgreSQL
- **THEN** the data access layer maps `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, and `deleted_by` to their respective camelCase domain model properties.

### Requirement: Soft Deletion Lifecycle and Query Isolation
The system SHALL support soft deletion for all domain entities, setting `deleted_at` to the current timestamp and `deleted_by` to the current user GUID without removing the physical record from the database. Default query operations SHALL exclude soft-deleted records.

#### Scenario: Entity soft deletion execution
- **WHEN** a delete operation is performed on an entity
- **THEN** the database record is updated with `deleted_at = now()` and `deleted_by = current_user_id`, retaining the physical row in the table.

#### Scenario: Default queries filter out soft-deleted entities
- **WHEN** standard list or retrieval queries are executed
- **THEN** the system applies a filter condition ensuring only records where `deleted_at IS NULL` are returned.

#### Scenario: Explicit audit or recovery query includes soft-deleted entities
- **WHEN** an administrative or audit query explicitly requests deleted records
- **THEN** the system bypasses the default soft-delete filter and returns both active and soft-deleted records.

### Requirement: Automated Timestamp and Actor Tracking on Mutations
The system SHALL ensure `updated_at` is refreshed whenever an entity is modified, and set `created_by`, `updated_by`, or `deleted_by` based on the authenticated actor session.

#### Scenario: Record insertion populates creation metadata
- **WHEN** a new entity is inserted via the application layer
- **THEN** `created_at` and `updated_at` are set to the current time, and `created_by` is assigned the active user GUID.

#### Scenario: Record update refreshes modification metadata
- **WHEN** an existing entity is updated
- **THEN** `updated_at` is updated to the current time, `updated_by` is assigned the active user GUID, and `created_at`/`created_by` remain immutable.

