-- Migration: 003_create_conversation_and_message_entities.sql
-- Description: Create conversations and messages tables with BaseEntity audit columns and foreign key relations

-- 1. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  title VARCHAR(200) NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  created_by UUID NULL,
  updated_by UUID NULL,
  deleted_by UUID NULL,

  CONSTRAINT uq_conversations_code UNIQUE (code)
);

CREATE INDEX IF NOT EXISTS idx_conversations_active ON conversations (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_product_id_active ON conversations (product_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_user_id_active ON conversations (user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_customer_id_active ON conversations (customer_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_code_active ON conversations (code) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS set_conversations_updated_at ON conversations;
CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- 2. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE RESTRICT,
  user_author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  created_by UUID NULL,
  updated_by UUID NULL,
  deleted_by UUID NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_active ON messages (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_active ON messages (conversation_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_messages_user_author_id_active ON messages (user_author_id) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS set_messages_updated_at ON messages;
CREATE TRIGGER set_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();
