-- Migration: 004_create_quality_level_and_update_conversations_messages.sql
-- Description: Create quality_levels table and extend conversations and messages with quality_level_id and rating_user_id foreign keys

-- 1. QUALITY LEVELS TABLE
CREATE TABLE IF NOT EXISTS quality_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  level INTEGER NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  created_by UUID NULL,
  updated_by UUID NULL,
  deleted_by UUID NULL
);

CREATE INDEX IF NOT EXISTS idx_quality_levels_active ON quality_levels (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_quality_levels_level_active ON quality_levels (level) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS set_quality_levels_updated_at ON quality_levels;
CREATE TRIGGER set_quality_levels_updated_at
  BEFORE UPDATE ON quality_levels
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- 2. ALTER CONVERSATIONS TABLE
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS quality_level_id UUID NULL REFERENCES quality_levels(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rating_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_conversations_quality_level_id_active ON conversations (quality_level_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_rating_user_id_active ON conversations (rating_user_id) WHERE deleted_at IS NULL;

-- 3. ALTER MESSAGES TABLE
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS quality_level_id UUID NULL REFERENCES quality_levels(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rating_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_messages_quality_level_id_active ON messages (quality_level_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_messages_rating_user_id_active ON messages (rating_user_id) WHERE deleted_at IS NULL;
