# Tasks

## 1. Domain Types and Contracts

- [x] 1.1 Create `src/lib/types/role.ts` defining `Role`, `RoleSql`, `RoleCode` constant enum/union, and DTO types inheriting `BaseEntity` and `BaseEntitySql`. Verify TypeScript type compilation succeeds.
- [x] 1.2 Create `src/lib/types/user.ts` defining `User`, `UserSql`, and DTO types (`idRole`, `name`, `lastname`) inheriting `BaseEntity` and `BaseEntitySql`. Verify TypeScript type compilation succeeds.

## 2. Database Schema and Migrations

- [x] 2.1 Create SQL migration `src/lib/db/migrations/001_create_roles_and_users.sql` establishing `roles` and `users` tables with UUID PKs, foreign keys, unique code constraint, soft-delete indexes, and `set_updated_at` triggers. Verify SQL syntax consistency against foundation script.
- [x] 2.2 Include foundational seed data for standard system roles (`SPECIALIST`, `TEAM_LEAD`, `ADMIN`) within the migration script. Verify seeded codes align with domain constants.

## 3. Data Mappers and Role Discrimination

- [x] 3.1 Implement bidirectional mappers (`toRole`, `toRoleSql`, `toUser`, `toUserSql`, and create/update payload converters) in `src/lib/db/mappers.ts`. Verify field mapping between `role_id` and `idRole` alongside audit metadata.
- [x] 3.2 Implement role discrimination helpers and access predicates (`isSpecialist`, `isTeamLead`, `isAdmin`, `hasRole`) in `src/lib/auth/role-guards.ts`. Verify authorization evaluation logic for UI rendering and backend action gating.

## 4. Verification and Documentation

- [x] 4.1 Run TypeScript type check (`tsc --noEmit` / `npm run build` or lint) to verify full type safety across domain types and mappers.
- [x] 4.2 Update decisions and architecture documentation in `docs/en/DECISIONS.md` and `docs/es/DECISIONS.md` reflecting the new User and Role models.

