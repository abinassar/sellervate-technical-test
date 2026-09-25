# Design

## Context

The repository already defines a standardized `BaseEntity` contract (`src/lib/types/base-entity.ts`), bidirectional database mappers (`src/lib/db/mappers.ts`), soft-delete isolation helpers (`src/lib/db/soft-delete.ts`), and PostgreSQL foundation triggers (`src/lib/db/migrations/000_base_entity_foundation.sql`). See `proposal.md` for motivation and `specs/user-role-domain/spec.md` for behavioral requirements.

## Goals / Non-Goals

**Goals:**
- Provide typed TypeScript interfaces and DTOs for `Role` and `User` extending `BaseEntity` and `BaseEntitySql`.
- Establish SQL migrations for `roles` and `users` tables adhering to `BaseEntity` audit structure, UUID primary keys, foreign key constraints, unique indexes, and updated_at triggers.
- Implement bidirectional mapping functions in `src/lib/db/mappers.ts` for clean serialization between SQL snake_case records and TypeScript camelCase domain entities.
- Introduce strongly-typed role code constants (`SPECIALIST`, `TEAM_LEAD`, `ADMIN`) and declarative authorization helpers to discriminate access in UI and backend Server Actions.

**Non-Goals:**
- Implementing the complete QA review/coaching UI screens in this change (handled in subsequent feature branches).
- External OAuth2 / SSO provider integration (authentication uses session/cookie context as established in architecture decisions).

## Decisions

### 1. Naming and Relational Mapping (`idRole` vs `role_id` / `roleId`)
- **Decision**: In database SQL schema, use canonical PostgreSQL naming `role_id` (UUID foreign key referencing `roles(id)`). In TypeScript domain model, expose `idRole: string` (and alias `roleId: string`) to guarantee exact compliance with user domain requirements while maintaining idiomatic camelCase conventions.
- **Alternatives considered**:
  - Exposing only `roleId`: would deviate from explicit user request of `idRole`.
  - Exposing `idRole` directly in SQL as `id_role`: standard relational convention in PostgreSQL is `role_id`; the mapper layer seamlessly bridges `role_id` -> `idRole`.

### 2. Role Code Discrimination Strategy
- **Decision**: Define a strongly typed const map `RoleCode` with string literal union `RoleCode = 'SPECIALIST' | 'TEAM_LEAD' | 'ADMIN'`. Store `code` in the `roles` table with `VARCHAR(50) NOT NULL UNIQUE`. Provide declarative helper functions:
  ```typescript
  export const RoleCode = {
    SPECIALIST: 'SPECIALIST',
    TEAM_LEAD: 'TEAM_LEAD',
    ADMIN: 'ADMIN',
  } as const;

  export type RoleCode = (typeof RoleCode)[keyof typeof RoleCode];

  export const isSpecialist = (roleCode: string): boolean => roleCode === RoleCode.SPECIALIST;
  export const isTeamLead = (roleCode: string): boolean => roleCode === RoleCode.TEAM_LEAD;
  export const isAdmin = (roleCode: string): boolean => roleCode === RoleCode.ADMIN;
  ```
- **Alternatives considered**:
  - Numeric enum or integer ID checks: Brittle and opaque in code. String slug codes are self-describing, declarative, and easily inspected in database logs and UI conditional rendering.

### 3. Database Schema and Constraints
- **Decision**:
  - `roles`: `id` (UUID PK default gen_random_uuid()), `code` (VARCHAR(50) NOT NULL UNIQUE), `name` (VARCHAR(100) NOT NULL), `description` (TEXT NOT NULL), standard audit columns (`created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`).
  - `users`: `id` (UUID PK default gen_random_uuid()), `name` (VARCHAR(100) NOT NULL), `lastname` (VARCHAR(100) NOT NULL), `role_id` (UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT), standard audit columns.
  - Partial indexes `WHERE deleted_at IS NULL` on `roles(id)`, `roles(code)`, `users(id)`, and `users(role_id)`.
  - Automatic `BEFORE UPDATE` trigger on both tables executing `trigger_set_updated_at()`.

### 4. Seed Data for Foundational Roles
- **Decision**: Include initial migration seed inserting canonical system roles:
  - `ADMIN`: Administrator with full system and user configuration access.
  - `TEAM_LEAD`: Team Leader conducting conversation QA reviews, qualitative evaluations, and coaching.
  - `SPECIALIST`: Customer Support Specialist reviewing feedback, tracking personal scores, and handling conversations.

## Risks / Trade-offs

- [Risk] Deleting a role that has active assigned users → [Mitigation] Foreign key constraint `ON DELETE RESTRICT` combined with soft-delete checks prevents accidental orphan user records.
- [Risk] Direct UI role code string checks leading to typos → [Mitigation] Enforce `RoleCode` typed constants and pure predicate functions (`isSpecialist`, `isTeamLead`, etc.) across client and server code.
- [Risk] Performance on active user queries with role joins → [Mitigation] Create composite partial indexes `ON users (role_id) WHERE deleted_at IS NULL`.

## Migration Plan

1. Create SQL migration `src/lib/db/migrations/001_create_roles_and_users.sql`.
2. Seed initial canonical roles (`SPECIALIST`, `TEAM_LEAD`, `ADMIN`).
3. Create TypeScript domain types `src/lib/types/role.ts` and `src/lib/types/user.ts`.
4. Extend mapper and validation functions in `src/lib/db/mappers.ts`.
5. Provide access guard utilities in `src/lib/auth/role-guards.ts`.

