-- Migration: 006_seed_catalog_conversations_and_messages.sql
-- Description: Seed brands, product categories, products, conversations, and messages for development and testing

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
  ('00000000-0000-0000-0002-000000000001', 'NIKE', 'Nike', 'Global athletic footwear and apparel brand'),
  ('00000000-0000-0000-0002-000000000002', 'SAMSUNG', 'Samsung', 'South Korean multinational electronics corporation'),
  ('00000000-0000-0000-0002-000000000003', 'IKEA', 'IKEA', 'Swedish furniture and home accessories retailer')
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
  ('00000000-0000-0000-0003-000000000001', 'RUNNING-SHOES', 'Running Shoes', 'High-performance athletic running footwear', '00000000-0000-0000-0002-000000000001'),
  ('00000000-0000-0000-0003-000000000002', 'SMARTPHONES', 'Smartphones', 'Mobile phone devices with advanced computing capabilities', '00000000-0000-0000-0002-000000000002'),
  ('00000000-0000-0000-0003-000000000003', 'LIVING-ROOM', 'Living Room Furniture', 'Furniture and storage solutions for living spaces', '00000000-0000-0000-0002-000000000003')
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
  ('00000000-0000-0000-0004-000000000001', 'AIR-MAX-90', 'Nike Air Max 90', 'Iconic lifestyle sneaker with visible Air cushioning and retro design', '00000000-0000-0000-0003-000000000001'),
  ('00000000-0000-0000-0004-000000000002', 'PEGASUS-41', 'Nike Pegasus 41', 'Versatile daily running shoe with responsive ZoomX foam cushioning', '00000000-0000-0000-0003-000000000001'),
  ('00000000-0000-0000-0004-000000000003', 'GALAXY-S25', 'Samsung Galaxy S25', 'Flagship smartphone with advanced AI features and pro-grade camera system', '00000000-0000-0000-0003-000000000002'),
  ('00000000-0000-0000-0004-000000000004', 'GALAXY-A16', 'Samsung Galaxy A16', 'Budget-friendly smartphone with long battery life and vibrant display', '00000000-0000-0000-0003-000000000002'),
  ('00000000-0000-0000-0004-000000000005', 'KALLAX-SHELF', 'IKEA KALLAX Shelf Unit', 'Modular open shelf unit for storage and room division', '00000000-0000-0000-0003-000000000003')
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
    'Air Max 90 Sizing Inquiry',
    'Customer inquires about correct sizing for the Nike Air Max 90 before purchase',
    'What size should I get for the Air Max 90?',
    '00000000-0000-0000-0004-000000000001',
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0001-000000000003'
  ),
  (
    '00000000-0000-0000-0005-000000000002',
    'CONV-002',
    'Pegasus 41 Return Request',
    'Customer seeks return policy details and exchange options for the Nike Pegasus 41',
    'Return policy for Pegasus 41 — cushioning feels too soft',
    '00000000-0000-0000-0004-000000000002',
    '00000000-0000-0000-0001-000000000006',
    '00000000-0000-0000-0001-000000000004'
  ),
  (
    '00000000-0000-0000-0005-000000000003',
    'CONV-003',
    'Galaxy S25 Battery Drain Issue',
    'Customer reports severe battery drain on Samsung Galaxy S25 after a system update',
    'Galaxy S25 battery barely lasts half a day',
    '00000000-0000-0000-0004-000000000003',
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0001-000000000005'
  ),
  (
    '00000000-0000-0000-0005-000000000004',
    'CONV-004',
    'Galaxy A16 Warranty Question',
    'Customer asks about warranty coverage for a loose charging port on the Samsung Galaxy A16',
    'Is my Galaxy A16 charging port covered under warranty?',
    '00000000-0000-0000-0004-000000000004',
    '00000000-0000-0000-0001-000000000006',
    '00000000-0000-0000-0001-000000000003'
  ),
  (
    '00000000-0000-0000-0005-000000000005',
    'CONV-005',
    'KALLAX Assembly Assistance',
    'Customer struggles with KALLAX shelf assembly instructions and escalates to a formal complaint',
    'Help with KALLAX shelf assembly — instructions unclear',
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
-- CONVERSATION 1: Air Max 90 Sizing (✅ RESOLVED) — 10 messages
-- Specialist: Gianfranco Abinassar | Customer: Maria Alastre
-- --------------------------------------------------------------------------

INSERT INTO messages (id, name, message, conversation_id, user_author_id, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0006-000000000001', 'MSG-001',
    'Hi, I''m interested in buying the Nike Air Max 90 but I''m not sure about the sizing. I usually wear a size 38 in European sizing. Would that be the right fit?',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003',
    '2026-09-10 10:00:00-04', '2026-09-10 10:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000002', 'MSG-002',
    'Hello Maria! Great choice with the Air Max 90. Generally, they run true to size. A European 38 corresponds to a US Women''s 7. Do you know your foot width? They tend to run slightly narrow.',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000002',
    '2026-09-10 10:03:00-04', '2026-09-10 10:03:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000003', 'MSG-003',
    'I think I have a normal width foot. I''ve never had issues with other Nike shoes before. Should I stick with the 38?',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003',
    '2026-09-10 10:05:00-04', '2026-09-10 10:05:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000004', 'MSG-004',
    'If you''ve worn other Nike models in a 38 without issues, I''d recommend sticking with that size. The Air Max 90 has a similar last to most Nike lifestyle shoes.',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000002',
    '2026-09-10 10:07:00-04', '2026-09-10 10:07:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000005', 'MSG-005',
    'Perfect. And what about the color options? I saw there''s a white and pink version on the website. Is it available in my size?',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003',
    '2026-09-10 10:09:00-04', '2026-09-10 10:09:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000006', 'MSG-006',
    'Yes! The White/Pink colorway is currently in stock in size 38. We also have the classic White/Red and the Black/White available in your size.',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000002',
    '2026-09-10 10:11:00-04', '2026-09-10 10:11:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000007', 'MSG-007',
    'Great, I''ll go with the White/Pink. One more thing — is there a break-in period for these shoes?',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003',
    '2026-09-10 10:13:00-04', '2026-09-10 10:13:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000008', 'MSG-008',
    'The Air Max 90 is very comfortable right out of the box thanks to the visible Air unit in the heel. Most customers don''t experience any break-in period. You should be good to go from day one.',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000002',
    '2026-09-10 10:15:00-04', '2026-09-10 10:15:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000009', 'MSG-009',
    'That''s exactly what I needed to hear. Thank you so much for all the help, Gianfranco!',
    '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003',
    '2026-09-10 10:17:00-04', '2026-09-10 10:17:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000010', 'MSG-010',
    'You''re welcome, Maria! Enjoy your new Air Max 90s. Don''t hesitate to reach out if you need anything else.',
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
-- CONVERSATION 2: Pegasus 41 Return (✅ RESOLVED) — 9 messages
-- Specialist: Jorge Escobar | Customer: Alejandra Rodriguez
-- --------------------------------------------------------------------------

INSERT INTO messages (id, name, message, conversation_id, user_author_id, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0006-000000000011', 'MSG-011',
    'Hello, I recently purchased a pair of Nike Pegasus 41 and I''d like to know about the return policy. They don''t feel right when I run.',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000004',
    '2026-09-12 14:00:00-04', '2026-09-12 14:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000012', 'MSG-012',
    'Hi Alejandra! I''m sorry to hear the Pegasus 41 isn''t working out for you. Could you tell me when you purchased them and if you still have the receipt?',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000006',
    '2026-09-12 14:04:00-04', '2026-09-12 14:04:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000013', 'MSG-013',
    'I bought them about two weeks ago, and yes, I have the receipt. I''ve only used them for two runs so far.',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000004',
    '2026-09-12 14:07:00-04', '2026-09-12 14:07:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000014', 'MSG-014',
    'Since the purchase was within the last 30 days and you have your receipt, you''re fully eligible for a return or exchange. Would you prefer a refund or would you like to try a different model?',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000006',
    '2026-09-12 14:10:00-04', '2026-09-12 14:10:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000015', 'MSG-015',
    'I think the size is fine, but the cushioning feels too soft for my running style. Could I exchange them for a different model with firmer support?',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000004',
    '2026-09-12 14:13:00-04', '2026-09-12 14:13:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000016', 'MSG-016',
    'Absolutely. If you prefer firmer cushioning, I''d recommend looking at the Nike Vomero or the Nike Structure. Both offer more stability and a firmer ride compared to the Pegasus. Would you like me to check availability?',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000006',
    '2026-09-12 14:16:00-04', '2026-09-12 14:16:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000017', 'MSG-017',
    'The Vomero sounds interesting. Can I bring the Pegasus back to the store and try the Vomero on at the same time?',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000004',
    '2026-09-12 14:19:00-04', '2026-09-12 14:19:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000018', 'MSG-018',
    'Of course! Just bring your Pegasus 41 with the original box and receipt to any of our stores. The team there will process the exchange and let you try the Vomero before committing. You still have 16 days left on the return window, so no rush.',
    '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000006',
    '2026-09-12 14:22:00-04', '2026-09-12 14:22:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000019', 'MSG-019',
    'That''s wonderful, thank you Jorge! I''ll head to the store this weekend. Really appreciate the clear explanation.',
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
-- CONVERSATION 3: Galaxy S25 Battery Drain (❌ UNRESOLVED) — 12 messages
-- Specialist: Gianfranco Abinassar | Customer: Jose Abinassar
-- --------------------------------------------------------------------------

INSERT INTO messages (id, name, message, conversation_id, user_author_id, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0006-000000000020', 'MSG-020',
    'Hi, I''ve been having serious battery drain issues with my Samsung Galaxy S25. It barely lasts half a day with normal use.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:00:00-04', '2026-09-15 09:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000021', 'MSG-021',
    'Hello Jose. I''m sorry to hear about the battery issues. Let''s try to figure this out. Can you tell me what Android version you''re running and when the problem started?',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:05:00-04', '2026-09-15 09:05:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000022', 'MSG-022',
    'I''m on the latest Android 16 update. The problem started about a week ago right after I installed a system update.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:08:00-04', '2026-09-15 09:08:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000023', 'MSG-023',
    'That''s helpful. Sometimes system updates can cause temporary battery drain as the system re-optimizes. Have you tried restarting your device after the update?',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:12:00-04', '2026-09-15 09:12:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000024', 'MSG-024',
    'Yes, I''ve restarted it multiple times already. No improvement at all.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:14:00-04', '2026-09-15 09:14:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000025', 'MSG-025',
    'I see. Could you check your battery usage stats? Go to Settings > Battery > Battery Usage and let me know which apps are consuming the most power.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:17:00-04', '2026-09-15 09:17:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000026', 'MSG-026',
    'The top consumers are Screen at 35%, System at 28%, and WhatsApp at 10%. That system percentage seems really high to me.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:21:00-04', '2026-09-15 09:21:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000027', 'MSG-027',
    'You''re right, 28% for system processes is above normal. I''d recommend clearing the system cache partition. Turn off the phone, hold Volume Up and Power until you see the recovery menu, then select "Wipe cache partition."',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:25:00-04', '2026-09-15 09:25:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000028', 'MSG-028',
    'I just tried that — cleared the cache partition and restarted. I''ll monitor it, but honestly this is the same advice I found on forums and it didn''t help before.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:32:00-04', '2026-09-15 09:32:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000029', 'MSG-029',
    'I understand the frustration. Another option would be to boot into Safe Mode to see if the drain persists without third-party apps. Hold the power button, then long-press "Power off" to enter Safe Mode.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000002',
    '2026-09-15 09:36:00-04', '2026-09-15 09:36:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000030', 'MSG-030',
    'I actually tried Safe Mode for a few hours yesterday and the battery still drained faster than expected. It lost about 15% in two hours with the screen off. I think this might be a hardware issue at this point.',
    '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000005',
    '2026-09-15 09:40:00-04', '2026-09-15 09:40:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000031', 'MSG-031',
    'I appreciate you going through all those troubleshooting steps, Jose. If the issue persists in Safe Mode, it could indeed point to something deeper. I''d recommend visiting a Samsung authorized service center for a hardware diagnostic. Unfortunately, there isn''t much more I can help with remotely.',
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
-- CONVERSATION 4: Galaxy A16 Warranty (❌ UNRESOLVED) — 8 messages
-- Specialist: Jorge Escobar | Customer: Maria Alastre
-- --------------------------------------------------------------------------

INSERT INTO messages (id, name, message, conversation_id, user_author_id, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0006-000000000032', 'MSG-032',
    'Hi, I need help understanding the warranty on my Samsung Galaxy A16. The charging port seems to be loose and it''s getting really hard to charge the phone.',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000003',
    '2026-09-18 11:00:00-04', '2026-09-18 11:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000033', 'MSG-033',
    'Hello Maria. Sorry to hear about the charging issue. How long have you had the Galaxy A16?',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000006',
    '2026-09-18 11:06:00-04', '2026-09-18 11:06:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000034', 'MSG-034',
    'I bought it about 10 months ago. It should still be under warranty, right?',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000003',
    '2026-09-18 11:09:00-04', '2026-09-18 11:09:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000035', 'MSG-035',
    'Samsung typically offers a one-year manufacturer warranty, so yes, you should be covered. However, physical damage to ports can sometimes be classified differently depending on the assessment.',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000006',
    '2026-09-18 11:13:00-04', '2026-09-18 11:13:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000036', 'MSG-036',
    'What do you mean by "classified differently"? I haven''t dropped the phone or anything. The port just started getting loose on its own.',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000003',
    '2026-09-18 11:16:00-04', '2026-09-18 11:16:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000037', 'MSG-037',
    'I understand. The service center will need to inspect the port to determine if it''s a manufacturing defect or normal wear-and-tear. The outcome of the warranty claim depends on their assessment.',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000006',
    '2026-09-18 11:20:00-04', '2026-09-18 11:20:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000038', 'MSG-038',
    'So there''s no guarantee they''ll fix it for free even though it''s under warranty? That doesn''t seem very clear. Can you tell me exactly what is and what isn''t covered?',
    '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000003',
    '2026-09-18 11:24:00-04', '2026-09-18 11:24:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000039', 'MSG-039',
    'The specific coverage details can vary by region and purchase conditions. I''d recommend reviewing the warranty documentation that came with your phone or contacting Samsung''s official support line for the most accurate information regarding your case.',
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
-- CONVERSATION 5: KALLAX Assembly (😡 COMPLAINT) — 13 messages
-- Specialist: Jorge Escobar | Customer: Alejandra Rodriguez
-- --------------------------------------------------------------------------

INSERT INTO messages (id, name, message, conversation_id, user_author_id, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0006-000000000040', 'MSG-040',
    'Hello, I just received my IKEA KALLAX shelf unit and I''m having trouble with the assembly. The printed instructions aren''t very clear to me.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:00:00-04', '2026-09-20 16:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000041', 'MSG-041',
    'Hi Alejandra! Sorry to hear you''re having difficulty. Which specific step are you stuck on?',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 16:05:00-04', '2026-09-20 16:05:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000042', 'MSG-042',
    'I''m on step 3 where you need to attach the divider panels. The diagram shows some wooden dowels but I can''t figure out which holes they go into. There seem to be more holes than dowels.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:09:00-04', '2026-09-20 16:09:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000043', 'MSG-043',
    'The KALLAX uses a standard dowel and cam lock system. The dowels should go into the pre-drilled holes on the edges of the panels. Try matching the dowel diameter to the hole size.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 16:14:00-04', '2026-09-20 16:14:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000044', 'MSG-044',
    'I can see there are different sized holes. Some are smaller and some are larger. The dowels fit into the smaller ones, but then what goes into the larger holes?',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:18:00-04', '2026-09-20 16:18:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000045', 'MSG-045',
    'The larger holes are for the cam locks. You should have some circular metal pieces in your hardware bag. Those go into the larger holes.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 16:22:00-04', '2026-09-20 16:22:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000046', 'MSG-046',
    'Okay, but the instructions show the cam lock going in a specific orientation. Which way should the arrow on the cam lock face?',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:26:00-04', '2026-09-20 16:26:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000047', 'MSG-047',
    'The arrow should generally face toward the direction of the connecting piece. Just make sure it''s snug when you turn it.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 16:30:00-04', '2026-09-20 16:30:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000048', 'MSG-048',
    '"Generally face toward"? I need to know exactly which direction. If I install them wrong the whole shelf won''t hold together properly. Can you be more specific?',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:33:00-04', '2026-09-20 16:33:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000049', 'MSG-049',
    'The arrow on the cam lock should point toward the edge of the panel where the connecting bolt enters. Once the bolt is inserted, turn the cam lock clockwise to tighten it.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 16:37:00-04', '2026-09-20 16:37:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000050', 'MSG-050',
    'I''ve been trying that for the last 20 minutes and the panels keep coming apart when I stand the shelf upright. I think something is wrong with the hardware itself. Is there a way to request replacement parts?',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000004',
    '2026-09-20 16:55:00-04', '2026-09-20 16:55:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000051', 'MSG-051',
    'It''s possible that some hardware might be defective. You can request replacement parts through the IKEA website under the spare parts section, or visit your nearest IKEA store''s returns and exchanges counter.',
    '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000006',
    '2026-09-20 17:00:00-04', '2026-09-20 17:00:00-04'
  ),
  (
    '00000000-0000-0000-0006-000000000052', 'MSG-052',
    'I''ve already spent an entire afternoon on this and every answer I get is either vague or tells me to go somewhere else. I asked for specific step-by-step help and instead got generic advice that didn''t solve anything. This has been a really frustrating experience and I want to file a formal complaint about the quality of support I received today.',
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
