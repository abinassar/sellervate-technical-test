-- Migration: 001_create_roles_and_users.sql
-- Description: Create roles and users tables with BaseEntity audit columns and initial role seeds

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  
  -- Audit and lifecycle fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  created_by UUID NULL,
  updated_by UUID NULL,
  deleted_by UUID NULL,

  CONSTRAINT uq_roles_code UNIQUE (code)
);

CREATE INDEX IF NOT EXISTS idx_roles_active ON roles (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_roles_code_active ON roles (code) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS set_roles_updated_at ON roles;
CREATE TRIGGER set_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  
  -- Audit and lifecycle fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  created_by UUID NULL,
  updated_by UUID NULL,
  deleted_by UUID NULL
);

CREATE INDEX IF NOT EXISTS idx_users_active ON users (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_role_id_active ON users (role_id) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- 3. SEED CANONICAL ROLES
INSERT INTO roles (id, code, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Administrator', 'Full system access and configuration administration'),
  ('00000000-0000-0000-0000-000000000002', 'TEAM_LEAD', 'Team Lead', 'Quality assurance evaluator reviewing conversations and guiding specialists'),
  ('00000000-0000-0000-0000-000000000003', 'SPECIALIST', 'Quality Specialist', 'Frontline specialist reviewing evaluations and tracking performance trends')
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

