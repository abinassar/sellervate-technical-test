# Spec Delta

## Purpose

Defines the domain contracts, database schemas, bidirectional mappings, and role-code discrimination rules for User and Role entities inheriting the BaseEntity audit foundation.

## ADDED Requirements

### Requirement: Role Entity and Relational Schema
The system SHALL provide a `Role` entity and corresponding `roles` database table inheriting all `BaseEntity` primary key and audit columns (`id`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`), with domain attributes: `code` (unique string slug), `name` (string), and `description` (string).

#### Scenario: Role record creation with unique code
- **WHEN** a new role is inserted with code, name, and description
- **THEN** it persists the entity with an auto-generated UUID primary key, standard audit timestamps, and enforces uniqueness on `code`.

#### Scenario: Duplicate role code rejection
- **WHEN** an attempt is made to insert or update a role with an existing `code`
- **THEN** the system rejects the operation due to unique constraint violation.

### Requirement: User Entity and Relational Schema
The system SHALL provide a `User` entity and corresponding `users` database table inheriting all `BaseEntity` primary key and audit columns, with domain attributes: `name` (string), `lastname` (string), and `role_id` (`idRole` in domain model, UUID foreign key referencing `roles.id`).

#### Scenario: User record creation linked to valid role
- **WHEN** a new user is created with valid `name`, `lastname`, and existing `idRole` (UUID)
- **THEN** the user record is persisted referencing the role, populating standard audit columns and setting `created_at` / `updated_at`.

#### Scenario: User creation with invalid role reference
- **WHEN** a user is inserted with a non-existent `idRole`
- **THEN** the relational database constraint rejects the insertion.

### Requirement: Role-Based Code Discrimination
The system SHALL provide strongly typed role code constants (`SPECIALIST`, `TEAM_LEAD`, `ADMIN`) and declarative utility predicates to discriminate permissions and access across UI components and backend server actions.

#### Scenario: Backend action authorization check
- **WHEN** a protected server action executes
- **THEN** it evaluates the user's role code against the required role permissions and grants or denies access accordingly.

#### Scenario: Declarative UI capability gating
- **WHEN** a UI view renders user-specific controls or sections
- **THEN** it uses role code discriminators to conditionally display lead-specific or specialist-specific interfaces.

### Requirement: Domain Model Inheritance and Bidirectional Mappers
The domain layer SHALL expose TypeScript interfaces (`Role`, `User`) extending `BaseEntity`, raw database interfaces (`RoleSql`, `UserSql`) extending `BaseEntitySql`, and bidirectional mapping utilities converting between snake_case SQL rows and camelCase domain objects.

#### Scenario: Mapping SQL rows to domain entities
- **WHEN** a raw user or role query result is processed by the data mapper
- **THEN** all audit columns and business properties (including `role_id` to `idRole`) are mapped to their strongly typed camelCase domain representation.

#### Scenario: Mapping domain input to SQL insert/update payload
- **WHEN** a domain creation DTO is transformed for database insertion
- **THEN** domain properties are translated to corresponding snake_case database columns.

