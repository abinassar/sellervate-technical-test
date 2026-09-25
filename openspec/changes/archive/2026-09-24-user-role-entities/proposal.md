# Proposal

## Why

To support role-based access control (RBAC), user attribution in audit trails, and differentiated UI/backend workflows (such as distinguishing Team Leads from Quality Specialists), the platform requires standardized `Role` and `User` domain entities and database tables that strictly adhere to the `BaseEntity` contract.

## What Changes

- Create the `Role` domain entity model and database schema (`roles` table) inheriting the canonical `BaseEntity` audit structure, containing `id` (UUID), `code` (unique string identifier), `name` (string), and `description` (string).
- Create the `User` domain entity model and database schema (`users` table) inheriting the canonical `BaseEntity` audit structure, containing `name` (string), `lastname` (string), and `idRole` (foreign key UUID referencing `roles.id`).
- Define TypeScript types, domain interfaces, and bidirectional camelCase/snake_case mappers (`Role`, `RoleSql`, `User`, `UserSql`, DTOs) extending `BaseEntity` and `BaseEntitySql`.
- Establish SQL migration definitions including primary keys, unique constraints on `roles.code`, foreign key integrity between `users.role_id` and `roles.id`, partial soft-delete indexes, and the `trigger_set_updated_at` trigger.
- Provide foundational role code constants and type definitions (`RoleCode`) to support declarative role-based access control and UI/backend action discrimination.

## Capabilities

### New Capabilities
- `user-role-domain`: Specifications and contracts for `Role` and `User` entities, relational database tables, relational integrity, mapping utilities, and role-code discrimination helpers.

### Modified Capabilities
<!-- None -->

## Impact

- **Database**: Adds `roles` and `users` tables, foreign keys, unique constraints, soft-delete indexes, and update triggers.
- **Domain Layer**: Adds `src/lib/types/role.ts` and `src/lib/types/user.ts` extending `BaseEntity`.
- **Data Access**: Extends bidirectional mapper utilities in `src/lib/db/mappers.ts` for role and user entity conversions.
- **Access Control / RBAC**: Provides strongly-typed role codes (`SPECIALIST`, `TEAM_LEAD`, `ADMIN`) enabling future permission guards, server action authorization, and UI conditionals.

