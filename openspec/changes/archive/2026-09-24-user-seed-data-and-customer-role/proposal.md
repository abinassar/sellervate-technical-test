# Proposal

## Why

The Sellervate application requires initial domain seed data for users across different organizational roles (Administrator, Quality Specialist, and Customers) to support local development, automated testing, and evaluation flows immediately upon starting the database container. In addition, the domain role types must officially support the `CUSTOMER` role code.

## What Changes

- Add `CUSTOMER` role code constant to `RoleCode` and role guards.
- Add initial seed migration or initialization script mounted to `/docker-entrypoint-initdb.d/` in `docker-compose.yml` to automatically seed the `CUSTOMER` role and the 5 required canonical users upon container startup:
  1. Alfonso Gutierrez (ADMIN)
  2. Gianfranco Abinassar (SPECIALIST)
  3. Maria Alastre (CUSTOMER)
  4. Alejandra Rodriguez (CUSTOMER)
  5. Jose Abinassar (CUSTOMER)
- Ensure all seed records conform to `BaseEntity` requirements with deterministic UUIDs and idempotency (`ON CONFLICT DO NOTHING` or `DO UPDATE`).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `user-role-domain`: Extend `RoleCode` enumeration with `CUSTOMER` role, add corresponding authorization helper predicates, and mandate automated database user seeding upon container initialization.

## Impact

- `src/lib/types/role.ts`: Adds `CUSTOMER: "CUSTOMER"` to `RoleCode`.
- `src/lib/auth/role-guards.ts`: Adds `isCustomer` predicate.
- `docker-compose.yml`: Mounts database migration/init scripts to `/docker-entrypoint-initdb.d` or executes seed scripts during startup.
- `src/lib/db/migrations/`: Adds seed migration for `CUSTOMER` role and the 5 canonical users.
- Database tables: `roles` and `users` populated with deterministic seed data.
