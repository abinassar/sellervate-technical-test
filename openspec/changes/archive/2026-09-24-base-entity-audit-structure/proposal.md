# Proposal

## Why

Every domain entity in the Sellervate review platform requires standardized audit trails and soft-delete capabilities. Establishing a shared base entity contract across both the database schema (SQL tables) and application data mapping layers (TypeScript models) ensures consistency, simplifies query and mutation logic, avoids schema duplication, and guarantees complete traceability of who created, modified, or soft-deleted records and when.

## What Changes

- Introduce a standardized `BaseEntity` domain interface in TypeScript containing audit timestamps (`createdAt`, `updatedAt`, `deletedAt`) and actor GUID references (`createdBy`, `updatedBy`, `deletedBy`).
- Define the canonical SQL base column standard (`id UUID`, `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`, `deleted_at TIMESTAMPTZ`, `created_by UUID`, `updated_by UUID`, `deleted_by UUID`) across all database tables.
- Provide reusable database utility functions/triggers in PostgreSQL for automatic timestamp maintenance (e.g., `updated_at` automatic refresh).
- Establish soft-deletion conventions and query helpers ensuring deleted records (`deletedAt IS NOT NULL`) are omitted from standard operational queries unless explicitly requested.
- Provide bidirectional mapping utilities between database `snake_case` audit columns and domain `camelCase` entity properties.

## Capabilities

### New Capabilities
- `base-entity-contract`: Defines the foundational database schema columns, TypeScript domain types, soft-deletion semantics, and actor tracking metadata required for all system entities.

### Modified Capabilities
<!-- None -->

## Impact

- **Database**: All existing and future database tables (e.g., `brands`, `users`, `products`, `conversations`, `messages`, `evaluations`) inherit the standardized 6 audit columns + primary key GUID.
- **TypeScript Types**: All domain entity interfaces extend the shared `BaseEntity` contract.
- **Data Access Layer**: Query functions and repository helpers standardize on soft-delete filtering (`WHERE deleted_at IS NULL`) and automated population of `created_by`/`updated_by`/`deleted_by` from the active server session.

