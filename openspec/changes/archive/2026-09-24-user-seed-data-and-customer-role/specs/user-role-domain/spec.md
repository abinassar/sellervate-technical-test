# Spec Delta

## MODIFIED Requirements

### Requirement: Role-Based Code Discrimination
The system SHALL provide strongly typed role code constants (`SPECIALIST`, `TEAM_LEAD`, `ADMIN`, `CUSTOMER`) and declarative utility predicates to discriminate permissions and access across UI components, domain workflows, and backend server actions.

#### Scenario: Backend action authorization check
- **WHEN** a protected server action executes
- **THEN** it evaluates the user's role code against the required role permissions and grants or denies access accordingly.

#### Scenario: Declarative UI capability gating
- **WHEN** a UI view renders user-specific controls or sections
- **THEN** it uses role code discriminators to conditionally display lead-specific, specialist-specific, customer-specific, or admin-specific interfaces.

#### Scenario: Customer role discrimination
- **WHEN** evaluating a user with role code `CUSTOMER`
- **THEN** the role predicate `isCustomer` returns true and specialist/admin predicates return false.

## ADDED Requirements

### Requirement: Automated Canonical User and Role Seeding
The system SHALL provision canonical roles (ADMIN, TEAM_LEAD, SPECIALIST, CUSTOMER) and 5 predefined users in the database upon Docker container initialization.

#### Scenario: Docker container startup initial user provisioning
- **WHEN** the PostgreSQL container initializes its database storage
- **THEN** it seeds the `CUSTOMER` role and the 5 canonical user records:
  - Alfonso Gutierrez (`ADMIN`)
  - Gianfranco Abinassar (`SPECIALIST`)
  - Maria Alastre (`CUSTOMER`)
  - Alejandra Rodriguez (`CUSTOMER`)
  - Jose Abinassar (`CUSTOMER`)

#### Scenario: Idempotent seed execution
- **WHEN** database initialization scripts run against an existing database containing seed users and roles
- **THEN** the operation executes idempotently without duplicate key collisions or data corruption.
