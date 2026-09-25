# Tasks: Conversation and Message Entities

## 1. Domain Types Definition

- [x] 1.1 Create `src/lib/types/conversation.ts` defining `Conversation`, `ConversationSql`, `CreateConversationInput`, and `UpdateConversationInput` extending `BaseEntity` and `BaseEntitySql`, and verify TypeScript compilation.
- [x] 1.2 Create `src/lib/types/message.ts` defining `Message`, `MessageSql`, `CreateMessageInput`, and `UpdateMessageInput` extending `BaseEntity` and `BaseEntitySql`, and verify TypeScript compilation.

## 2. Bidirectional Data Mappers

- [x] 2.1 Implement `toConversation`, `toConversationSql`, and `toCreateConversationSql` in `src/lib/db/mappers.ts` for mapping between SQL rows and domain entities, verifying type safety.
- [x] 2.2 Implement `toMessage`, `toMessageSql`, and `toCreateMessageSql` in `src/lib/db/mappers.ts` for mapping between SQL rows and domain entities, verifying type safety.

## 3. Database Migration

- [x] 3.1 Create `src/lib/db/migrations/003_create_conversation_and_message_entities.sql` with `conversations` and `messages` table definitions, foreign keys referencing `products` and `users`, partial indexes on active records, and `BEFORE UPDATE` triggers.
- [x] 3.2 Verify SQL syntax and relational constraint alignment across all migration scripts.
