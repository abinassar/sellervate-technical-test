-- Sellervate Base Entity Foundation Migration
-- Establishes the reusable trigger function for automatic updated_at timestamp maintenance
-- and provides the reference blueprint for all domain entity tables.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update the updated_at timestamp on record modification
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/*
-- BLUEPRINT FOR DOMAIN TABLES:
-- Every domain table must include the following audit columns and updated_at trigger:

CREATE TABLE IF NOT EXISTS example_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Business domain fields
  name VARCHAR(255) NOT NULL,
  
  -- Audit & Lifecycle columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  created_by UUID NULL,
  updated_by UUID NULL,
  deleted_by UUID NULL
);

-- Partial index for soft delete and active domain lookups
CREATE INDEX IF NOT EXISTS idx_example_entities_active ON example_entities (id) WHERE deleted_at IS NULL;

-- Automatic trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON example_entities;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON example_entities
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();
*/

