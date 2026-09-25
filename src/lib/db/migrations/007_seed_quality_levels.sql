-- Migration: 007_seed_quality_levels.sql
-- Description: Seed canonical quality levels for conversation and message quality assessment

INSERT INTO quality_levels (id, name, description, level)
VALUES
  (
    '00000000-0000-0000-0007-000000000001',
    'Pésimo',
    'Mensaje sin sentido o incluso fuera de lugar, no ajustado al estándar técnico y profesional de trabajo.',
    0
  ),
  (
    '00000000-0000-0000-0007-000000000002',
    'Medianamente Deficiente',
    'Mensaje o conversación con contenido vago, reflejando carencia de conocimiento técnico sobre el producto en cuestión.',
    25
  ),
  (
    '00000000-0000-0000-0007-000000000003',
    'Bueno',
    'Mensaje o conversación que refleja la respuesta a la inquietud o duda reflejada por el cliente, sin embargo, deja puntos abiertos a más dudas o no expresa de forma explícita toda la idea necesaria para solventar la duda. De forma que, un cliente con algo de conocimiento podrá entenderlo pero otro sin conocimiento absolute quedará aún con dudas.',
    50
  ),
  (
    '00000000-0000-0000-0007-000000000004',
    'Bastante Bueno',
    'Mensaje o conversación que refleja la respuesta a la inquietud o duda reflejada por el cliente, incluyendo explicación digerible por parte del mismo, dado prioridad y dirección a solventar únicamente la duda, sin dejar espacio a siguientes dudas. Teniendo la única carencia en falta de ejemplos, estructurar pasos para el usuario o entregar recursos que sirvan de apoyo al cliente para terminar la guía.',
    75
  ),
  (
    '00000000-0000-0000-0007-000000000005',
    'Excelente',
    'Mensaje o conversación que solventa por complete la inquietud o duda reflejada por el cliente, incluyendo explicación digerible por parte del mismo, dado prioridad y dirección a solventar únicamente la duda, además reflejando la implementación de ejemplos, pasos estructurados para el usuario o el envío de recursos que sirvieron de apoyo al cliente para terminar la guía.',
    100
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  level = EXCLUDED.level,
  updated_at = NOW();

