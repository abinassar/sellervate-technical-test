# Design

## Context

The Sellervate platform operates on Next.js 16 (App Router), TypeScript, and PostgreSQL (via `postgres.js` and Supabase). The application requires strict data consistency and auditability across all domain entities (Brands, Products, Procedures, Conversations, Messages, Evaluations, Evaluation Comments).

See `proposal.md` for motivation and `specs/base-entity-contract/spec.md` for functional requirements.

## Goals / Non-Goals

**Goals:**
- Provide a unified TypeScript `BaseEntity` type hierarchy and mapper utilities for all application entities.
- Establish a reusable SQL table blueprint and database migration template with standard audit columns and triggers.
- Implement reusable soft deletion filtering and mutation helpers in the data access layer.
- Ensure seamless mapping between PostgreSQL `snake_case` audit columns and TypeScript `camelCase` domain fields.

**Non-Goals:**
- Creating all future domain tables immediately (they will extend this base pattern in their respective capability changes).
- Hard deletion purge/prune lifecycle or automated archiving pipelines.

## Decisions

### 1. Column Naming and Types in SQL vs TypeScript
- **Decision**: Use `snake_case` with explicit PostgreSQL types for the database layer (`id UUID`, `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`, `deleted_at TIMESTAMPTZ`, `created_by UUID`, `updated_by UUID`, `deleted_by UUID`) and `camelCase` with native `Date` / `string` types in TypeScript.
- **Rationale**: Follows standard SQL / Postgres conventions and idiomatic TypeScript conventions while keeping serialization clean.
- **Alternatives Considered**: Using camelCase column names in Postgres (requires awkward quoted identifiers in raw SQL queries) or snake_case throughout TypeScript (violates project style guidelines).

### 2. Nullability of Actor Tracking Fields (`created_by`, `updated_by`, `deleted_by`)
- **Decision**: Actor fields are defined as nullable `UUID` / `string | null`.
- **Rationale**: Allows system-initiated operations, automated background jobs, migration seeding, or external webhook ingestion to create records without requiring a spoofed user session GUID. When performed by an authenticated user, the server session GUID is strictly enforced.
- **Alternatives Considered**: Requiring a non-null `created_by` referencing a dummy "System User" (adds artificial relational coupling and migration complexity).

### 3. PostgreSQL Trigger for `updated_at` Maintenance
- **Decision**: Implement a reusable PostgreSQL function `trigger_set_updated_at()` applied via a `BEFORE UPDATE` trigger on all entity tables.
- **Rationale**: Guarantees timestamp accuracy even for direct database operations, migrations, or batch updates, eliminating reliance solely on application-level clock synchronization.
- **Alternatives Considered**: Relying solely on application-level `new Date()` in UPDATE statements (risks drift if manual migrations or external queries bypass the app).

### 4. Soft Deletion Query Isolation Strategy
- **Decision**: Centralize soft-delete query predicates in reusable server-side repository utilities (e.g. `withActiveOnly` or `whereNotDeleted`) and partial unique indexes (`CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL`).
- **Rationale**: Standard soft-delete filtering avoids showing inactive records to users, while partial unique indexes prevent unique constraint collisions with previously soft-deleted rows.
- **Alternatives Considered**: Creating separate archive/history tables per entity (adds massive schema overhead and complex bi-temporal query joins).

## Risks / Trade-offs

- **[Risk] Accidental inclusion of soft-deleted records in queries** → **Mitigation**: Standardize repository query functions with default `WHERE deleted_at IS NULL` filters and integration tests.
- **[Risk] Foreign key cascade limitation on soft deletes** → **Mitigation**: Because foreign key `ON DELETE CASCADE` only triggers on physical row deletion, soft-delete operations for aggregate roots will handle dependent entity soft deletion explicitly in transaction blocks.
- **[Risk] Partial index overhead for unique constraints** → **Mitigation**: Use Postgres partial unique indexes conditioned on `deleted_at IS NULL` for domain uniqueness (e.g., brand slug or procedure code).

## Migration Plan

1. Create SQL migration defining `trigger_set_updated_at()` helper function.
2. Define TypeScript types in `src/lib/types/base-entity.ts` and serialization/mapper helpers in `src/lib/db/mappers.ts`.
3. Provide base SQL table template snippet in documentation/architecture guidelines for all subsequent table migrations.

