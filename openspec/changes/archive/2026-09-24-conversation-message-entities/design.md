# Design: Conversation and Message Entities

## Context

The system has established a foundational audit pattern in `src/lib/types/base-entity.ts` and relational schemas for users, roles, brands, product categories, and products. To enable conversation tracking and QA evaluations, we now need `Conversation` and `Message` entities that adhere to the same architecture patterns (BaseEntity inheritance, snake_case SQL representations, pure functional mappers, and PostgreSQL migrations with triggers and soft-delete indexes).

See `proposal.md` for background and `specs/conversation-message-domain/spec.md` for behavioral requirements.

## Goals / Non-Goals

**Goals:**
- Provide strongly typed TypeScript definitions for `Conversation` and `Message` domain models and SQL representations.
- Provide declarative, bidirectional data mappers in `src/lib/db/mappers.ts`.
- Create PostgreSQL migration `003_create_conversation_and_message_entities.sql` establishing tables, foreign key constraints (`products`, `users`), partial indexes for active records, and `updated_at` automated triggers.
- Support `idCustomer` referencing `users(id)` to simulate customer entities for testing purposes.

**Non-Goals:**
- UI components, chat interfaces, or real-time WebSocket communication (handled in subsequent changes).
- Evaluation scoring tables (e.g. `evaluations`, `criteria_scores`), which build on top of these conversation/message entities in future changes.

## Decisions

### 1. Customer mapping to User entity
- **Decision**: Map `customer_id` (`idCustomer`) as a UUID foreign key referencing `users(id)`.
- **Rationale**: Meets the explicit requirement to map customers as users for testing purposes while maintaining full referential integrity and standard audit capabilities without creating a separate customer table yet.
- **Alternatives Considered**: Creating a standalone `customers` table; rejected to keep scope focused and follow testing requirements.

### 2. BaseEntity inheritance and audit column parity
- **Decision**: `Conversation` and `Message` extend `BaseEntity`, and `ConversationSql`/`MessageSql` extend `BaseEntitySql`.
- **Rationale**: Consistency with all other entities (`User`, `Role`, `Brand`, `ProductCategory`, `Product`), ensuring consistent soft-deletion, audit tracking (`created_by`, `updated_by`, `deleted_by`), and timestamp management.

### 3. Bidirectional data mappers in `mappers.ts`
- **Decision**: Implement `toConversation`, `toConversationSql`, `toCreateConversationSql`, `toMessage`, `toMessageSql`, and `toCreateMessageSql` using existing generic `toDomainEntity` and `mapAuditFieldsToSql` utilities.
- **Rationale**: Pure functional approach preserving immutability and zero runtime overhead.

### 4. Relational constraints and indexes
- **Decision**: Foreign keys use `ON DELETE RESTRICT` to prevent accidental orphaned chat histories. Add partial indexes on `(deleted_at IS NULL)` for primary keys and foreign key columns (`product_id`, `user_id`, `customer_id`, `conversation_id`, `user_author_id`).

## Risks / Trade-offs

- **[Risk] High message volume in production**: Chat tables grow quickly.
  - **Mitigation**: Foreign key index on `conversation_id` with soft-delete filtering ensures high query performance when fetching conversation message streams.
- **[Risk] Author distinction (Agent vs Customer)**: Both map to `users(id)`.
  - **Mitigation**: `user_author_id` (`idUserAuthor`) explicitly captures the message author, allowing role checks or author verification when rendering the thread.
