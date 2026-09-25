# Proposal: Conversation and Message Domain Entities

## Why

The Sellervate evaluation platform requires simulating and analyzing customer support interactions to conduct QA evaluations. Introducing structured `Conversation` and `Message` domain models and relational database tables enables tracking multi-turn dialogs between customers and support specialists linked to specific catalog products, forming the foundation for specialist scoring and quality audits.

## What Changes

- Add domain entity interfaces (`Conversation`, `Message`) extending `BaseEntity` and SQL row representations (`ConversationSql`, `MessageSql`) extending `BaseEntitySql`.
- Define input DTO types (`CreateConversationInput`, `UpdateConversationInput`, `CreateMessageInput`, `UpdateMessageInput`).
- Implement bidirectional mapping functions in `src/lib/db/mappers.ts` between snake_case SQL tables and camelCase domain models.
- Create database migration script `003_create_conversation_and_message_entities.sql` defining `conversations` and `messages` tables with soft deletion indexes, foreign keys referencing `products` and `users`, and automatic `updated_at` triggers.

## Capabilities

### New Capabilities
- `conversation-message-domain`: Defines domain contracts, relational database schemas, foreign key relationships, audit columns, and bidirectional data mappers for `Conversation` and `Message` entities.

### Modified Capabilities
<!-- No requirement changes to existing capabilities -->

## Impact

- **Database**: Adds `conversations` and `messages` tables with foreign keys referencing `products(id)` and `users(id)` (`user_id`, `customer_id`, `user_author_id`).
- **Domain Layer**: Adds `src/lib/types/conversation.ts` and `src/lib/types/message.ts`.
- **Mappers**: Extends `src/lib/db/mappers.ts` with transformation functions for `Conversation` and `Message`.
- **Migrations**: Adds `src/lib/db/migrations/003_create_conversation_and_message_entities.sql`.
