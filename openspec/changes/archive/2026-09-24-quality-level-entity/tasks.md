# Tasks

## 1. Database Schema and Migration

- [x] 1.1 Create SQL migration `src/lib/db/migrations/004_create_quality_level_and_update_conversations_messages.sql` defining `quality_levels` table with audit columns, adding `quality_level_id` and `rating_user_id` nullable foreign keys to `conversations` and `messages`, indexes on active records, and updated-at triggers.

## 2. Domain and SQL Type Definitions

- [x] 2.1 Create `src/lib/types/quality-level.ts` defining `QualityLevel`, `QualityLevelSql`, `CreateQualityLevelInput`, and `UpdateQualityLevelInput` inheriting `BaseEntity` / `BaseEntitySql`, and verify TypeScript compilation.
- [x] 2.2 Update `src/lib/types/conversation.ts` to include nullable `idQualityLevel` and `idRatingUser` in `Conversation`, `quality_level_id` and `rating_user_id` in `ConversationSql`, and optional relation properties `qualityLevel` and `ratingUser`.
- [x] 2.3 Update `src/lib/types/message.ts` to include nullable `idQualityLevel` and `idRatingUser` in `Message`, `quality_level_id` and `rating_user_id` in `MessageSql`, and optional relation properties `qualityLevel` and `ratingUser`.

## 3. Bidirectional Data Mappers

- [x] 3.1 Implement `toQualityLevel`, `toQualityLevelSql`, and `toCreateQualityLevelSql` in `src/lib/db/mappers.ts`.
- [x] 3.2 Update `toConversation`, `toConversationSql`, and `toCreateConversationSql` in `src/lib/db/mappers.ts` to support `idQualityLevel` (`quality_level_id`), `idRatingUser` (`rating_user_id`), and optional relation mappings.
- [x] 3.3 Update `toMessage`, `toMessageSql`, and `toCreateMessageSql` in `src/lib/db/mappers.ts` to support `idQualityLevel` (`quality_level_id`), `idRatingUser` (`rating_user_id`), and optional relation mappings.

## 4. Verification and Linting

- [x] 4.1 Run `npm run lint` and TypeScript checks across the project to verify clean compilation with zero lint or type errors.
