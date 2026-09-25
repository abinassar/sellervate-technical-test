# Proposal

## Why

To support qualitative and quantitative evaluation of specialist customer interactions, the system requires a standardized tiered classification model (`QualityLevel`) representing quality thresholds where higher levels denote superior performance. Additionally, both conversations and individual messages must support nullable references to the assigned quality level and the rating evaluator user so that future scoring services can evaluate and calibrate customer support quality at both the macro (conversation) and micro (message) levels.

## What Changes

- Introduce the `QualityLevel` domain model and `quality_levels` database table extending `BaseEntity` audit contracts, containing `name`, `description`, and integer `level` (where higher values represent higher quality).
- Extend the `Conversation` domain model, database table (`conversations`), input DTOs, and bidirectional mappers with nullable foreign key references `idQualityLevel` (`quality_level_id` -> `quality_levels.id`) and `idRatingUser` (`rating_user_id` -> `users.id`).
- Extend the `Message` domain model, database table (`messages`), input DTOs, and bidirectional mappers with nullable foreign key references `idQualityLevel` (`quality_level_id` -> `quality_levels.id`) and `idRatingUser` (`rating_user_id` -> `users.id`).
- Provide SQL migration `004_create_quality_level_and_update_conversations_messages.sql` defining table structures, foreign key constraints (`ON DELETE SET NULL`), filtered active indexes, and updated timestamp triggers.

## Capabilities

### New Capabilities
- `quality-level-domain`: Defines the `QualityLevel` domain model, SQL schema (`quality_levels`), TypeScript interfaces, audit fields, and bidirectional data mappers.

### Modified Capabilities
- `conversation-message-domain`: Modifies Conversation and Message specifications to incorporate nullable rating associations (`idQualityLevel` / `quality_level_id` and `idRatingUser` / `rating_user_id`) and relational foreign key integrity.

## Impact

- **Database**: Creates `quality_levels` table and alters `conversations` and `messages` tables to add foreign key columns and filtered performance indexes.
- **Types**: Creates `src/lib/types/quality-level.ts` and updates `src/lib/types/conversation.ts` and `src/lib/types/message.ts`.
- **Mappers**: Adds `toQualityLevel`, `toQualityLevelSql`, `toCreateQualityLevelSql` to `src/lib/db/mappers.ts` and updates conversation/message mappers to support the new scoring association fields.
