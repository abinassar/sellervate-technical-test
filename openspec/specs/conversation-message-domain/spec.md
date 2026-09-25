# Capability: conversation-message-domain

## Purpose

Defines the domain contracts, relational database schemas, foreign key relationships, audit columns, and bidirectional data mappers for Conversation and Message entities in the Sellervate QA evaluation platform.

## Requirements

### Requirement: Conversation Entity and Relational Schema
The system SHALL provide a `Conversation` domain entity and corresponding `conversations` database table inheriting all `BaseEntity` primary key and audit columns (`id`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`), with domain attributes: `code` (string), `name` (string), `description` (string), `title` (string), `idProduct` (`product_id` in SQL, UUID referencing `products.id`), `idUser` (`user_id` in SQL, UUID referencing `users.id`), and `idCustomer` (`customer_id` in SQL, UUID referencing `users.id`).

#### Scenario: Conversation record creation with valid relations
- **WHEN** a new conversation is inserted with valid code, name, description, title, idProduct, idUser, and idCustomer
- **THEN** the record is persisted with an auto-generated UUID primary key, audit timestamps, and relational integrity referencing products and users.

#### Scenario: Conversation creation with non-existent foreign keys
- **WHEN** a conversation is inserted with a non-existent `idProduct`, `idUser`, or `idCustomer`
- **THEN** the database foreign key constraint rejects the operation.

### Requirement: Message Entity and Relational Schema
The system SHALL provide a `Message` domain entity and corresponding `messages` database table inheriting all `BaseEntity` primary key and audit columns, with domain attributes: `name` (string), `message` (string), `idConversation` (`conversation_id` in SQL, UUID referencing `conversations.id`), and `idUserAuthor` (`user_author_id` in SQL, UUID referencing `users.id`).

#### Scenario: Message record creation with valid conversation and author
- **WHEN** a new message is inserted with valid name, message content, idConversation, and idUserAuthor
- **THEN** the record is persisted with relational integrity referencing the conversation and the user author, populating standard audit columns.

#### Scenario: Message creation with invalid conversation reference
- **WHEN** a message is inserted with a non-existent `idConversation` or `idUserAuthor`
- **THEN** the database foreign key constraint rejects the operation.

### Requirement: Domain Models and Bidirectional Data Mappers
The domain layer SHALL expose TypeScript interfaces (`Conversation`, `Message`) extending `BaseEntity`, database interfaces (`ConversationSql`, `MessageSql`) extending `BaseEntitySql`, input types (`CreateConversationInput`, `UpdateConversationInput`, `CreateMessageInput`, `UpdateMessageInput`), and bidirectional mapping utilities converting between snake_case SQL rows and camelCase domain objects.

#### Scenario: Mapping SQL rows to Conversation and Message domain entities
- **WHEN** raw conversation or message SQL query results are processed by the data mapper
- **THEN** all audit columns and domain properties (including `product_id` to `idProduct`, `user_id` to `idUser`, `customer_id` to `idCustomer`, `conversation_id` to `idConversation`, `user_author_id` to `idUserAuthor`) are mapped to strongly typed camelCase domain entities.

#### Scenario: Mapping domain input to SQL insert/update payload
- **WHEN** domain input DTOs (`CreateConversationInput`, `CreateMessageInput`) are transformed for database operations
- **THEN** domain properties are translated to corresponding snake_case database columns.
