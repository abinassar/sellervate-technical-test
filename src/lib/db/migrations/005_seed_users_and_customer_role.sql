-- Migration: 005_seed_users_and_customer_role.sql
-- Description: Seed CUSTOMER role and initial canonical users for development and testing

-- 1. SEED CUSTOMER ROLE
INSERT INTO roles (id, code, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000004', 'CUSTOMER', 'Customer', 'End customer interacting in support conversations and reviewing service satisfaction')
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2. SEED CANONICAL USERS
INSERT INTO users (id, name, lastname, role_id)
VALUES
  ('00000000-0000-0000-0001-000000000001', 'Alfonso', 'Gutierrez', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0001-000000000002', 'Gianfranco', 'Abinassar', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0001-000000000003', 'Maria', 'Alastre', '00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0001-000000000004', 'Alejandra', 'Rodriguez', '00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0001-000000000005', 'Jose', 'Abinassar', '00000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  lastname = EXCLUDED.lastname,
  role_id = EXCLUDED.role_id,
  updated_at = NOW();
