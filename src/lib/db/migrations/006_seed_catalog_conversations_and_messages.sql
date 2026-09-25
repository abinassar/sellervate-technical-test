-- Migration: 006_seed_catalog_conversations_and_messages.sql
-- Description: Seed brands, product categories, products, conversations, and messages for development and testing (Spanish content)

-- ============================================================================
-- 1. SEED SPECIALIST USER — Jorge Escobar
-- ============================================================================

INSERT INTO users (id, name, lastname, role_id)
VALUES
  ('00000000-0000-0000-0001-000000000006', 'Jorge', 'Escobar', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  lastname = EXCLUDED.lastname,
  role_id = EXCLUDED.role_id,
  updated_at = NOW();

-- ============================================================================
-- 2. SEED BRANDS
-- ============================================================================

INSERT INTO brands (id, code, name, description)
VALUES
  ('00000000-0000-0000-0002-000000000001', 'NIKE', 'Nike', 'Marca global de calzado, indumentaria y equipamiento deportivo'),
  ('00000000-0000-0000-0002-000000000002', 'SAMSUNG', 'Samsung', 'Corporación multinacional líder en tecnología, electrónica y telefonía móvil'),
  ('00000000-0000-0000-0002-000000000003', 'IKEA', 'IKEA', 'Cadena internacional de muebles, diseño de interiores y accesorios para el hogar')
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ============================================================================
-- 3. SEED PRODUCT CATEGORIES
-- ============================================================================

INSERT INTO product_categories (id, code, name, description, brand_id)
VALUES
  ('00000000-0000-0000-0003-000000000001', 'RUNNING-SHOES', 'Calzado de Running', 'Calzado deportivo de alto rendimiento diseñado para correr y entrenamiento', '00000000-0000-0000-0002-000000000001'),
  ('00000000-0000-0000-0003-000000000002', 'SMARTPHONES', 'Teléfonos Inteligentes', 'Dispositivos móviles de última generación con conectividad y procesamiento avanzado', '00000000-0000-0000-0002-000000000002'),
  ('00000000-0000-0000-0003-000000000003', 'LIVING-ROOM', 'Muebles de Sala', 'Mobiliario modular y soluciones funcionales de almacenamiento para el hogar', '00000000-0000-0000-0002-000000000003')
ON CONFLICT (brand_id, code) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ============================================================================
-- 4. SEED PRODUCTS
-- ============================================================================

INSERT INTO products (id, code, name, description, category_id)
VALUES
  ('00000000-0000-0000-0004-000000000001', 'AIR-MAX-90', 'Nike Air Max 90', 'Zapatilla urbana icónica con amortiguación Air visible en el talón y diseño clásico', '00000000-0000-0000-0003-000000000001'),
  ('00000000-0000-0000-0004-000000000002', 'PEGASUS-41', 'Nike Pegasus 41', 'Zapatilla versátil para correr a diario con espuma reactiva ZoomX y retorno de energía', '00000000-0000-0000-0003-000000000001'),
  ('00000000-0000-0000-0004-000000000003', 'GALAXY-S25', 'Samsung Galaxy S25', 'Teléfono insignia con inteligencia artificial integrada y sistema de cámaras profesional', '00000000-0000-0000-0003-000000000002'),
  ('00000000-0000-0000-0004-000000000004', 'GALAXY-A16', 'Samsung Galaxy A16', 'Teléfono inteligente accesible con batería de larga duración y pantalla Super AMOLED', '00000000-0000-0000-0003-000000000002'),
  ('00000000-0000-0000-0004-000000000005', 'KALLAX-SHELF', 'Estantería IKEA KALLAX', 'Módulo de estantería abierta personalizable para almacenamiento y división de ambientes', '00000000-0000-0000-0003-000000000003')
ON CONFLICT (category_id, code) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ============================================================================
-- 5. SEED CONVERSATIONS
-- ============================================================================

INSERT INTO conversations (id, code, name, description, title, product_id, user_id, customer_id)
VALUES
  (
    '00000000-0000-0000-0005-000000000001',
    'CONV-001',
    'Consulta sobre tallas de Air Max 90',
    'Cliente consulta sobre la talla adecuada para las zapatillas Nike Air Max 90 antes de realizar su compra',
    '¿Qué talla debería elegir para las Air Max 90?',
    '00000000-0000-0000-0004-000000000001',
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0001-000000000003'
  ),
  (
    '00000000-0000-0000-0005-000000000002',
    'CONV-002',
    'Solicitud de devolución de Pegasus 41',
    'Cliente solicita información sobre políticas de devolución y opciones de cambio para las Nike Pegasus 41',
    'Política de devolución para Pegasus 41 — la amortiguación se siente muy suave',
    '00000000-0000-0000-0004-000000000002',
    '00000000-0000-0000-0001-000000000006',
    '00000000-0000-0000-0001-000000000004'
  ),
  (
    '00000000-0000-0000-0005-000000000003',
    'CONV-003',
    'Problema de consumo de batería en Galaxy S25',
    'Cliente reporta un drenaje excesivo de batería en el Samsung Galaxy S25 tras una actualización del sistema',
    'La batería del Galaxy S25 apenas dura medio día',
    '00000000-0000-0000-0004-000000000003',
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0001-000000000005'
  ),
  (
    '00000000-0000-0000-0005-000000000004',
    'CONV-004',
    'Pregunta sobre garantía de Galaxy A16',
    'Cliente consulta sobre la cobertura de garantía por un puerto de carga flojo en el Samsung Galaxy A16',
    '¿El puerto de carga de mi Galaxy A16 está cubierto por la garantía?',
    '00000000-0000-0000-0004-000000000004',
    '00000000-0000-0000-0001-000000000006',
    '00000000-0000-0000-0001-000000000003'
  ),
  (
    '00000000-0000-0000-0005-000000000005',
    'CONV-005',
    'Asistencia con ensamblaje de KALLAX',
    'Cliente tiene dificultades con las instrucciones de armado de la estantería KALLAX y escala a una queja formal',
    'Ayuda con el armado de estantería KALLAX — instrucciones poco claras',
    '00000000-0000-0000-0004-000000000005',
    '00000000-0000-0000-0001-000000000006',
    '00000000-0000-0000-0001-000000000004'
  )
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  title = EXCLUDED.title,
  product_id = EXCLUDED.product_id,
  user_id = EXCLUDED.user_id,
  customer_id = EXCLUDED.customer_id,
  updated_at = NOW();

-- ============================================================================
-- 6. SEED MESSAGES
-- ============================================================================

-- --------------------------------------------------------------------------
-- CONVERSACIÓN 1: Consulta de Talla Air Max 90 (✅ RESUELTA) — 10 mensajes
-- Especialista: Gianfranco Abinassar | Cliente: María Alastre
-- --------------------------------------------------------------------------

INSERT INTO messages (id, name, message, conversation_id, user_author_id, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0006-000000000001', 'MSG-001',
    'Hola, estoy interesada en comprar las Nike Air Max 90 pero tengo dudas sobre la talla. Normalmente uso talla 38 europea. ¿Sería esa la talla correcta?',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003',
    '2026-09-10 10:00:00-04', '2026-09-10 10:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000002', 'MSG-002',
    '¡Hola María! Excelente elección con las Air Max 90. Por lo general vienen en la talla exacta. Una 38 europea equivale a una 7 US de mujer. ¿Conoces el ancho de tu pie? Suelen ser ligeramente estrechas.',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000002',
    '2026-09-10 10:03:00-04', '2026-09-10 10:03:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000003', 'MSG-003',
    'Creo que tengo el pie de ancho normal. Nunca he tenido problemas antes con otras zapatillas Nike. ¿Me conviene mantener la 38?',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003',
    '2026-09-10 10:05:00-04', '2026-09-10 10:05:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000004', 'MSG-004',
    'Si has usado otros modelos de Nike en talla 38 sin problemas, te recomiendo mantener esa misma talla. La horma de las Air Max 90 es muy similar a la de la mayoría de zapatillas urbanas de Nike.',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000002',
    '2026-09-10 10:07:00-04', '2026-09-10 10:07:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000005', 'MSG-005',
    'Perfecto. ¿Y qué opciones de colores tienen? Vi en el sitio web una versión en blanco con rosa. ¿Está disponible en mi talla?',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003',
    '2026-09-10 10:09:00-04', '2026-09-10 10:09:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000006', 'MSG-006',
    '¡Sí! El color Blanco/Rosa está disponible en stock en talla 38. También contamos con el clásico Blanco/Rojo y Negro/Blanco en tu talla.',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000002',
    '2026-09-10 10:11:00-04', '2026-09-10 10:11:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000007', 'MSG-007',
    'Genial, me quedo con la versión Blanco/Rosa. Una última consulta, ¿estas zapatillas necesitan algún tiempo de adaptación o ablande?',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003',
    '2026-09-10 10:13:00-04', '2026-09-10 10:13:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000008', 'MSG-008',
    'Las Air Max 90 son bastante cómodas desde el primer uso gracias a la unidad Air visible en el talón. La gran mayoría de clientes no requiere ningún período de adaptación. Podrás usarlas con total comodidad desde el primer día.',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000002',
    '2026-09-10 10:15:00-04', '2026-09-10 10:15:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000009', 'MSG-009',
    '¡Eso era justo lo que necesitaba saber! Muchísimas gracias por toda tu ayuda, Gianfranco.',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003',
    '2026-09-10 10:17:00-04', '2026-09-10 10:17:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000010', 'MSG-010',
    '¡De nada, María! Que disfrutes mucho tus nuevas Air Max 90. No dudes en escribirnos si necesitas cualquier otra cosa.',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000002',
    '2026-09-10 10:19:00-04', '2026-09-10 10:19:00-04'
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  conversation_id = EXCLUDED.conversation_id,
  user_author_id = EXCLUDED.user_author_id,
  updated_at = NOW();

-- --------------------------------------------------------------------------
-- CONVERSACIÓN 2: Devolución de Pegasus 41 (✅ RESUELTA) — 9 mensajes
-- Especialista: Jorge Escobar | Cliente: Alejandra Rodríguez
-- --------------------------------------------------------------------------

INSERT INTO messages (id, name, message, conversation_id, user_author_id, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0006-000000000011', 'MSG-011',
    'Hola, compré recientemente unas Nike Pegasus 41 y me gustaría consultar sobre la política de devoluciones. No las siento del todo cómodas al correr.',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000004',
    '2026-09-12 14:00:00-04', '2026-09-12 14:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000012', 'MSG-012',
    '¡Hola Alejandra! Lamento escuchar que las Pegasus 41 no hayan cumplido tus expectativas. ¿Podrías indicarme cuándo las compraste y si aún conservas el comprobante de compra?',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000006',
    '2026-09-12 14:04:00-04', '2026-09-12 14:04:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000013', 'MSG-013',
    'Las compré hace unas dos semanas y sí, tengo la factura. Solo las he usado en dos salidas a correr.',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000004',
    '2026-09-12 14:07:00-04', '2026-09-12 14:07:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000014', 'MSG-014',
    'Dado que la compra fue dentro de los últimos 30 días y conservas tu comprobante, cumples con todos los requisitos para devolución o cambio. ¿Preferirías un reembolso o te interesaría probar otro modelo?',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000006',
    '2026-09-12 14:10:00-04', '2026-09-12 14:10:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000015', 'MSG-015',
    'La talla me quedó perfecta, pero la amortiguación me resulta demasiado blanda para mi estilo de carrera. ¿Podría cambiarlas por un modelo con un soporte más firme?',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000004',
    '2026-09-12 14:13:00-04', '2026-09-12 14:13:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000016', 'MSG-016',
    'Por supuesto. Si buscas una amortiguación más firme y estructurada, te recomiendo las Nike Vomero o las Nike Structure. Ambas brindan mayor estabilidad en comparación con las Pegasus. ¿Deseas que verifique la disponibilidad?',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000006',
    '2026-09-12 14:16:00-04', '2026-09-12 14:16:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000017', 'MSG-017',
    'Las Vomero suenan bastante bien. ¿Puedo llevar las Pegasus a una tienda física y medirme las Vomero allí mismo?',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000004',
    '2026-09-12 14:19:00-04', '2026-09-12 14:19:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000018', 'MSG-018',
    '¡Claro que sí! Solo lleva tus Pegasus 41 en su caja original junto con el comprobante a cualquiera de nuestras sucursales. El equipo en tienda gestionará el cambio y te permitirá probarte las Vomero. Aún tienes 16 días dentro del plazo de devolución, así que no hay apuro.',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000006',
    '2026-09-12 14:22:00-04', '2026-09-12 14:22:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000019', 'MSG-019',
    '¡Excelente, muchas gracias Jorge! Me acercaré a la tienda este fin de semana. Agradezco mucho tu clara explicación.',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000004',
    '2026-09-12 14:24:00-04', '2026-09-12 14:24:00-04'
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  conversation_id = EXCLUDED.conversation_id,
  user_author_id = EXCLUDED.user_author_id,
  updated_at = NOW();

-- --------------------------------------------------------------------------
-- CONVERSACIÓN 3: Consumo de Batería en Galaxy S25 (❌ NO RESUELTA) — 12 mensajes
-- Especialista: Gianfranco Abinassar | Cliente: José Abinassar
-- --------------------------------------------------------------------------

INSERT INTO messages (id, name, message, conversation_id, user_author_id, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0006-000000000020', 'MSG-020',
    'Hola, estoy teniendo problemas serios con la batería de mi Samsung Galaxy S25. Apenas me dura medio día con un uso normal.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:00:00-04', '2026-09-15 09:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000021', 'MSG-021',
    'Hola José. Lamento los inconvenientes con el rendimiento de la batería. Vamos a revisarlo juntos. ¿Podrías decirme qué versión de Android tienes y cuándo comenzó el problema?',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:05:00-04', '2026-09-15 09:05:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000022', 'MSG-022',
    'Tengo la última actualización de Android 16. El problema empezó hace como una semana, justo después de instalar una actualización del sistema.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:08:00-04', '2026-09-15 09:08:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000023', 'MSG-023',
    'Entiendo. A veces, tras una actualización del sistema, ocurre un consumo temporal mientras el dispositivo reoptimiza procesos en segundo plano. ¿Has probado reiniciar el equipo tras actualizar?',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:12:00-04', '2026-09-15 09:12:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000024', 'MSG-024',
    'Sí, ya lo he reiniciado varias veces. No ha habido ninguna mejora.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:14:00-04', '2026-09-15 09:14:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000025', 'MSG-025',
    'Ya veo. ¿Podrías revisar las estadísticas de uso de batería? Ve a Ajustes > Batería > Uso de batería e indícame qué aplicaciones o servicios están consumiendo más energía.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:17:00-04', '2026-09-15 09:17:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000026', 'MSG-026',
    'Los consumos más altos son la Pantalla con 35%, Sistema con 28% y WhatsApp con 10%. Ese porcentaje del sistema me parece excesivamente alto.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:21:00-04', '2026-09-15 09:21:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000027', 'MSG-027',
    'Tienes razón, un 28% para procesos del sistema es superior a lo habitual. Te recomiendo limpiar la partición de memoria caché. Apaga el teléfono, mantén presionados Subir Volumen y Encendido hasta entrar al menú de recuperación, y selecciona "Wipe cache partition".',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:25:00-04', '2026-09-15 09:25:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000028', 'MSG-028',
    'Acabo de hacerlo — limpié la memoria caché y reinicié. Lo voy a monitorear, pero honestamente es el mismo consejo que encontré en foros y no me sirvió antes.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:32:00-04', '2026-09-15 09:32:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000029', 'MSG-029',
    'Comprendo tu frustración. Otra alternativa es encender el equipo en Modo Seguro para verificar si el drenaje continúa sin apps de terceros. Mantén presionado el botón de encendido y luego mantén pulsado el icono "Apagar" para entrar a Modo Seguro.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:36:00-04', '2026-09-15 09:36:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000030', 'MSG-030',
    'Ayer probé el Modo Seguro durante varias horas y la batería se seguía descargando rápido. Perdió cerca del 15% en dos horas con la pantalla apagada. Creo que a estas alturas podría ser una falla de hardware.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:40:00-04', '2026-09-15 09:40:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000031', 'MSG-031',
    'Agradezco que hayas seguido todos los pasos de diagnóstico, José. Si la falla persiste incluso en Modo Seguro, podría tratarse de un problema interno de hardware. Te sugiero acudir a un centro de servicio técnico autorizado de Samsung para una revisión física. Por vía remota no disponemos de más herramientas para este caso.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:45:00-04', '2026-09-15 09:45:00-04'
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  conversation_id = EXCLUDED.conversation_id,
  user_author_id = EXCLUDED.user_author_id,
  updated_at = NOW();

-- --------------------------------------------------------------------------
-- CONVERSACIÓN 4: Garantía de Galaxy A16 (❌ NO RESUELTA) — 8 mensajes
-- Especialista: Jorge Escobar | Cliente: María Alastre
-- --------------------------------------------------------------------------

INSERT INTO messages (id, name, message, conversation_id, user_author_id, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0006-000000000032', 'MSG-032',
    'Hola, necesito ayuda para entender la garantía de mi Samsung Galaxy A16. El puerto de carga parece estar flojo y cada vez cuesta más que cargue el teléfono.',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000003',
    '2026-09-18 11:00:00-04', '2026-09-18 11:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000033', 'MSG-033',
    'Hola María. Lamento el inconveniente con la carga. ¿Cuánto tiempo hace que adquiriste el Galaxy A16?',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000006',
    '2026-09-18 11:06:00-04', '2026-09-18 11:06:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000034', 'MSG-034',
    'Lo compré hace aproximadamente 10 meses. Todavía debería estar dentro del período de garantía, ¿verdad?',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000003',
    '2026-09-18 11:09:00-04', '2026-09-18 11:09:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000035', 'MSG-035',
    'Samsung ofrece por lo general un año de garantía de fábrica, por lo que sí debería aplicar. Sin embargo, el daño físico en los puertos puede clasificarse de manera distinta según la evaluación técnica.',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000006',
    '2026-09-18 11:13:00-04', '2026-09-18 11:13:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000036', 'MSG-036',
    '¿A qué te refieres con "clasificarse de manera distinta"? El teléfono nunca se me ha caído ni ha sufrido golpes. El conector simplemente se aflojó con el uso.',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000003',
    '2026-09-18 11:16:00-04', '2026-09-18 11:16:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000037', 'MSG-037',
    'Te entiendo. El centro de servicio técnico debe inspeccionar el puerto para determinar si se trata de un defecto de fabricación o de desgaste por uso cotidiano. La validez de la garantía dependerá de ese dictamen.',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000006',
    '2026-09-18 11:20:00-04', '2026-09-18 11:20:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000038', 'MSG-038',
    '¿O sea que no hay certeza de que lo reparen sin costo a pesar de tener garantía vigente? No me parece muy claro. ¿Podrías detallarme con exactitud qué cubre y qué no?',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000003',
    '2026-09-18 11:24:00-04', '2026-09-18 11:24:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000039', 'MSG-039',
    'Las condiciones de cobertura específicas pueden variar según la región y las cláusulas del distribuidor. Te aconsejo consultar la póliza de garantía adjunta en la caja de tu teléfono o contactar directamente a la línea de soporte oficial de Samsung para conocer los detalles de tu caso.',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000006',
    '2026-09-18 11:28:00-04', '2026-09-18 11:28:00-04'
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  conversation_id = EXCLUDED.conversation_id,
  user_author_id = EXCLUDED.user_author_id,
  updated_at = NOW();

-- --------------------------------------------------------------------------
-- CONVERSACIÓN 5: Armado de KALLAX (😡 QUEJA) — 13 mensajes
-- Especialista: Jorge Escobar | Cliente: Alejandra Rodríguez
-- --------------------------------------------------------------------------

INSERT INTO messages (id, name, message, conversation_id, user_author_id, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0006-000000000040', 'MSG-040',
    'Hola, acabo de recibir mi estantería IKEA KALLAX y estoy teniendo muchos problemas con el ensamblaje. Las instrucciones impresas son muy confusas.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:00:00-04', '2026-09-20 16:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000041', 'MSG-041',
    '¡Hola Alejandra! Lamento que estés teniendo dificultades. ¿En qué paso específico del manual te has trabado?',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 16:05:00-04', '2026-09-20 16:05:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000042', 'MSG-042',
    'Estoy en el paso 3, donde se colocan los paneles divisorios. El diagrama muestra unas clavijas de madera pero no logro entender en cuáles orificios van. Pareciera que hay más agujeros que clavijas.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:09:00-04', '2026-09-20 16:09:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000043', 'MSG-043',
    'La línea KALLAX utiliza un sistema estándar de espigas y pernos excéntricos. Las clavijas de madera deben insertarse en los agujeros pretaladrados de los bordes. Intenta hacer coincidir el grosor de la clavija con el tamaño del orificio.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 16:14:00-04', '2026-09-20 16:14:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000044', 'MSG-044',
    'Veo que hay orificios de distintos tamaños. Unos son más pequeños y otros más grandes. Las clavijas entran en los pequeños, pero entonces ¿qué va en los agujeros más grandes?',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:18:00-04', '2026-09-20 16:18:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000045', 'MSG-045',
    'Los agujeros más grandes corresponden a los herrajes circulares de bloqueo. En la bolsa de tornillería deberías tener unas piezas metálicas redondas. Esas van en los orificios más anchos.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 16:22:00-04', '2026-09-20 16:22:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000046', 'MSG-046',
    'De acuerdo, pero el manual muestra que la pieza circular debe colocarse en una orientación específica. ¿Hacia dónde debe apuntar la flecha que tiene marcada?',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:26:00-04', '2026-09-20 16:26:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000047', 'MSG-047',
    'La flecha generalmente debe apuntar hacia donde entra la pieza de conexión. Solo asegúrate de que quede firme al girarla.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 16:30:00-04', '2026-09-20 16:30:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000048', 'MSG-048',
    '¿"Generalmente debe apuntar"? Necesito saber con exactitud hacia qué lado. Si las coloco mal, la estantería completa no va a resistir el peso ni quedar firme. ¿Podrías ser más específico?',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:33:00-04', '2026-09-20 16:33:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000049', 'MSG-049',
    'La flecha del herraje debe apuntar hacia el borde exterior del panel, por donde ingresa el perno conector. Una vez colocado el perno, gira el herraje en sentido horario para ajustar.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 16:37:00-04', '2026-09-20 16:37:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000050', 'MSG-050',
    'Llevo 20 minutos intentando eso y los paneles se siguen desprendiendo en cuanto intento levantar el mueble. Creo que los herrajes o las piezas vinieron defectuosas. ¿Hay alguna forma de solicitar piezas de repuesto?',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:55:00-04', '2026-09-20 16:55:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000051', 'MSG-051',
    'Es factible que alguna pieza presente desperfectos. Puedes solicitar repuestos ingresando a la sección de piezas de repuesto en el sitio web de IKEA, o acudir al módulo de cambios y devoluciones de tu tienda IKEA más cercana.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 17:00:00-04', '2026-09-20 17:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000052', 'MSG-052',
    'Ya perdí toda la tarde con esto y cada respuesta que me dan es imprecisa o me manda a consultar a otro lado. Pedí asistencia paso a paso y solo recibí respuestas genéricas que no resolvieron nada. Ha sido una experiencia sumamente frustrante y quiero presentar una queja formal sobre la calidad de atención recibida hoy.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 17:08:00-04', '2026-09-20 17:08:00-04'
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  conversation_id = EXCLUDED.conversation_id,
  user_author_id = EXCLUDED.user_author_id,
  updated_at = NOW();
