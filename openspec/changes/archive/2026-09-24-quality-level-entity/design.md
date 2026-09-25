# Design

## Context

The application architecture utilizes PostgreSQL with Supabase, standard `BaseEntity` / `BaseEntitySql` audit fields, and pure declarative mapper utilities (`src/lib/db/mappers.ts`) separating domain models from relational database representations. See `proposal.md` and spec deltas for background and capability requirements.

## Goals / Non-Goals

**Goals:**
- Implement `QualityLevel` domain types and `quality_levels` database table inheriting `BaseEntity` audit structure, with `name`, `description`, and `level` (integer).
- Update `Conversation` and `Message` domain models and SQL tables to support nullable scoring references `idQualityLevel` (`quality_level_id` -> `quality_levels.id`) and `idRatingUser` (`rating_user_id` -> `users.id`).
- Implement bidirectional mapping functions for `QualityLevel` and update conversation/message mappers to support the new scoring association fields and entity relations.
- Provide idempotent SQL migration `004_create_quality_level_and_update_conversations_messages.sql` with foreign keys, filtered active indexes, and updated-at triggers.

**Non-Goals:**
- Implementing the scoring business logic or automated evaluation service (deferred to future scoring/evaluation service change).
- Modifying UI components or presentation dashboards.

## Decisions

### 1. Representation of `level` as Integer
- **Choice**: Store `level` as an `INTEGER` (with positive/zero value convention where higher values indicate higher quality).
- **Rationale**: An integer column allows direct SQL sorting (`ORDER BY level DESC`), numerical threshold comparisons, and lightweight index lookups.
- **Alternatives Considered**: String enum (lacks continuous numeric ordering capabilities) or floating-point score (unnecessary complexity for discrete quality tiers).

### 2. Nullable References with `ON DELETE SET NULL`
- **Choice**: Make `quality_level_id` and `rating_user_id` nullable in `conversations` and `messages`, configured with `ON DELETE SET NULL`.
- **Rationale**: Conversations and messages are authored before evaluation takes place. Evaluations and quality levels are assigned asynchronously after creation. Using `ON DELETE SET NULL` guarantees that deleting or archiving a quality tier does not cascade delete critical customer interaction history.
- **Alternatives Considered**: Defaulting to a synthetic "Unrated" quality level record (pollutes domain references and complicates creation payloads).

### 3. Filtered Active Indexes
- **Choice**: Create partial indexes on `quality_levels(id)`, `quality_levels(level)`, and foreign key columns in `conversations` and `messages` with `WHERE deleted_at IS NULL`.
- **Rationale**: In accordance with the project's soft-delete architecture, queries overwhelmingly target active entities. Filtered indexes maximize lookup performance and minimize index storage.

## Risks / Trade-offs

- **[Risk] Schema migration on existing tables**: Adding columns to `conversations` and `messages` could fail if executed concurrently or repeatedly.
  - *Mitigation*: Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` for idempotent execution.
- **[Risk] Nullable field handling in TypeScript**: Nullable FKs can cause runtime null pointer exceptions if unhandled.
  - *Mitigation*: Express `idQualityLevel: string | null` and `idRatingUser: string | null` explicitly in domain and SQL types, ensuring strict TypeScript compiler verification.
