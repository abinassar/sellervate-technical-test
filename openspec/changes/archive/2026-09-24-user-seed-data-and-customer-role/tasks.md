# Tasks

## 1. Domain Types and Role Guards

- [x] 1.1 Update `src/lib/types/role.ts` to include `CUSTOMER: "CUSTOMER"` in `RoleCode` and verify type definitions compile without errors
- [x] 1.2 Update `src/lib/auth/role-guards.ts` with `isCustomer` predicate function and verify role guard exports with type checks

## 2. Database Migrations and Docker Setup

- [x] 2.1 Update `docker-compose.yml` to mount `./src/lib/db/migrations` into `/docker-entrypoint-initdb.d` and verify YAML syntax
- [x] 2.2 Create migration `005_seed_users_and_customer_role.sql` inserting the `CUSTOMER` canonical role and the 5 canonical users (Alfonso Gutierrez, Gianfranco Abinassar, Maria Alastre, Alejandra Rodriguez, Jose Abinassar) with deterministic UUIDs and idempotent conflict handling

## 3. Verification and Integration

- [x] 3.1 Verify database migrations and schema consistency by executing/simulating SQL migration script against PostgreSQL or checking table definitions
- [x] 3.2 Run linting (`npm run lint`) and TypeScript checks to ensure whole codebase integrity
