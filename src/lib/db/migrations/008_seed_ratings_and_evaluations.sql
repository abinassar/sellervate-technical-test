-- Migration: 008_seed_ratings_and_evaluations.sql
-- Description: Seed canonical quality ratings for conversations and specialist messages by ADMIN Alfonso Gutierrez

-- ============================================================================
-- 1. PONDERACIÓN GLOBAL DE CONVERSACIONES (rating_user_id = Alfonso Gutierrez)
-- ============================================================================

-- CONV-001 (Air Max 90 - Resuelta): Excelente (100 pts)
UPDATE conversations
SET
  quality_level_id = '00000000-0000-0000-0007-000000000005',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0005-000000000001';

-- CONV-002 (Pegasus 41 - Resuelta): Excelente (100 pts)
UPDATE conversations
SET
  quality_level_id = '00000000-0000-0000-0007-000000000005',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0005-000000000002';

-- CONV-003 (Galaxy S25 - No resuelta): Medianamente Deficiente (25 pts)
UPDATE conversations
SET
  quality_level_id = '00000000-0000-0000-0007-000000000002',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0005-000000000003';

-- CONV-004 (Galaxy A16 - No resuelta): Bueno (50 pts)
UPDATE conversations
SET
  quality_level_id = '00000000-0000-0000-0007-000000000003',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0005-000000000004';

-- CONV-005 (KALLAX - Queja): Pésimo (0 pts)
UPDATE conversations
SET
  quality_level_id = '00000000-0000-0000-0007-000000000001',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0005-000000000005';

-- ============================================================================
-- 2. PONDERACIÓN DE MENSAJES INDIVIDUALES (rating_user_id = Alfonso Gutierrez)
-- ============================================================================

-- --------------------------------------------------------------------------
-- CONV-001 (Air Max 90 | Especialista: Gianfranco Abinassar)
-- --------------------------------------------------------------------------

-- MSG-004: Bastante Bueno (75 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000004',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000004';

-- MSG-008: Excelente (100 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000005',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000008';

-- --------------------------------------------------------------------------
-- CONV-002 (Pegasus 41 | Especialista: Jorge Escobar)
-- --------------------------------------------------------------------------

-- MSG-014: Bastante Bueno (75 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000004',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000014';

-- MSG-016: Excelente (100 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000005',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000016';

-- MSG-018: Excelente (100 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000005',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000018';

-- --------------------------------------------------------------------------
-- CONV-003 (Galaxy S25 | Especialista: Gianfranco Abinassar)
-- --------------------------------------------------------------------------

-- MSG-023: Medianamente Deficiente (25 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000002',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000023';

-- MSG-027: Bueno (50 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000003',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000027';

-- MSG-031: Medianamente Deficiente (25 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000002',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000031';

-- --------------------------------------------------------------------------
-- CONV-004 (Galaxy A16 | Especialista: Jorge Escobar)
-- --------------------------------------------------------------------------

-- MSG-035: Medianamente Deficiente (25 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000002',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000035';

-- MSG-039: Bueno (50 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000003',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000039';

-- --------------------------------------------------------------------------
-- CONV-005 (KALLAX | Especialista: Jorge Escobar)
-- --------------------------------------------------------------------------

-- MSG-043: Medianamente Deficiente (25 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000002',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000043';

-- MSG-047: Pésimo (0 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000001',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000047';

-- MSG-051: Pésimo (0 pts)
UPDATE messages
SET
  quality_level_id = '00000000-0000-0000-0007-000000000001',
  rating_user_id = '00000000-0000-0000-0001-000000000001',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0006-000000000051';
