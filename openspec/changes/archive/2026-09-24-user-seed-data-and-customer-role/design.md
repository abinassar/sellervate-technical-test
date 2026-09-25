# Design

## Context

The PostgreSQL container defined in `docker-compose.yml` does not currently mount migration files to `/docker-entrypoint-initdb.d/`. Furthermore, while initial canonical roles (`ADMIN`, `TEAM_LEAD`, `SPECIALIST`) were defined in migration `001_create_roles_and_users.sql`, the `CUSTOMER` role is missing from TypeScript constants and database seeds, and no default domain users are seeded.

## Goals / Non-Goals

**Goals:**
- Add `CUSTOMER` to `RoleCode` constant and export `isCustomer` predicate in `src/lib/auth/role-guards.ts`.
- Mount migrations into PostgreSQL's standard `/docker-entrypoint-initdb.d/` directory in `docker-compose.yml` so that all schemas and seeds are automatically executed upon container creation.
- Create migration `005_seed_users_and_customer_role.sql` providing deterministic, idempotent seed data for the `CUSTOMER` role and the 5 required users.

**Non-Goals:**
- Creating an external seeding CLI runner (Docker native `/docker-entrypoint-initdb.d/` handles this seamlessly).
- Changing existing BaseEntity table structures or foreign key constraints.

## Decisions

### Decision: Docker Entrypoint Init Script Mounting
- Mount `./src/lib/db/migrations:/docker-entrypoint-initdb.d:ro` in `docker-compose.yml`.
- *Rationale*: PostgreSQL official image runs all `.sql` files found in `/docker-entrypoint-initdb.d/` in alphabetical order on first database initialization.
- *Alternatives considered*: Writing a separate node script with `npm run seed`. While a separate script is useful for running on demand, mounting migrations ensures zero-setup initialization for any developer starting docker compose.

### Decision: Deterministic UUID Allocation for Seed Users and Roles
- Seed users and roles will use well-defined deterministic UUIDs:
  - Role `CUSTOMER`: `00000000-0000-0000-0000-000000000004`
  - User 1 (Alfonso Gutierrez - ADMIN): `00000000-0000-0000-0001-000000000001`
  - User 2 (Gianfranco Abinassar - SPECIALIST): `00000000-0000-0000-0001-000000000002`
  - User 3 (Maria Alastre - CUSTOMER): `00000000-0000-0000-0001-000000000003`
  - User 4 (Alejandra Rodriguez - CUSTOMER): `00000000-0000-0000-0001-000000000004`
  - User 5 (Jose Abinassar - CUSTOMER): `00000000-0000-0000-0001-000000000005`
- *Rationale*: Deterministic IDs enable consistent testing, fixture linking, and idempotent re-execution (`ON CONFLICT (id) DO UPDATE`).

## Risks / Trade-offs

- [Existing Postgres Volume] If a developer already has an existing `postgres_data` volume initialized without `/docker-entrypoint-initdb.d/`, PostgreSQL skips re-running init scripts → Document that restarting with `docker compose down -v` or manually executing migration `005` applies the seed.
