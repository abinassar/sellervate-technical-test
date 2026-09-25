# Tasks

## 1. TypeScript Base Entity Models & Mappers

- [x] 1.1 Create `src/lib/types/base-entity.ts` defining `BaseEntity`, `BaseEntitySql`, `CreateEntityInput<T>`, `UpdateEntityInput<T>`, and `SoftDeleteEntityInput`, and verify with TypeScript compilation (`npx tsc --noEmit`).
- [x] 1.2 Implement bidirectional snake_case/camelCase audit field mapper functions in `src/lib/db/mappers.ts` and verify mapping correctness across all 6 audit fields and primary key GUID.

## 2. PostgreSQL Schema Foundation & Soft Delete Utilities

- [x] 2.1 Create PostgreSQL foundation migration `src/lib/db/migrations/000_base_entity_foundation.sql` containing `trigger_set_updated_at()` trigger function and reusable table definition snippet, and verify SQL syntax validity.
- [x] 2.2 Implement soft-deletion repository helpers in `src/lib/db/soft-delete.ts` ensuring default queries isolate active records (`deleted_at IS NULL`) and soft-delete operations set `deleted_at` and `deleted_by`.

## 3. Documentation & Architecture Guidelines

- [x] 3.1 Update bilingual architectural decisions in `docs/en/DECISIONS.md` and `docs/es/DECISIONS.md` with the Base Entity audit and soft-delete contracts, and verify consistency across both documents.
