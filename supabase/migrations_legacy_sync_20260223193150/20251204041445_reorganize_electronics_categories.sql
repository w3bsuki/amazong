
-- ============================================
-- ELECTRONICS CATEGORY REORGANIZATION
-- ============================================

-- Key IDs:
-- Electronics (L0): 8fb2b390-6dc4-42b3-b386-7d5357ece5bc
-- Old "Phones & Tablets" (L1): d8c1b2ca-3c07-48c4-95c4-9e122d82b902
-- Old "TV & Audio" (L1): ea62ae60-2f54-47b8-b370-bda69173783f
-- Smartphones (currently L2): d20450a8-53ce-4d20-9919-439a39e73cda
-- Tablets (currently L2): 1ad60491-3aa6-43ec-8e30-91d7b4c889d9
-- Headphones (currently L2): f21a988c-6440-462a-970f-7d584434a481
-- Smartwatches (currently L2): 66b540e5-a9aa-4d7e-9330-71b65620005b
-- Smart Devices (L1): 19c94316-3774-49b7-bff8-80115941a039

-- ============================================
-- STEP 1: Promote Смартфони to L1 (direct child of Electronics)
-- ============================================
UPDATE categories 
SET parent_id = '8fb2b390-6dc4-42b3-b386-7d5357ece5bc',
    display_order = 1
WHERE id = 'd20450a8-53ce-4d20-9919-439a39e73cda';

-- ============================================
-- STEP 2: Promote Таблети to L1 (direct child of Electronics)
-- ============================================
UPDATE categories 
SET parent_id = '8fb2b390-6dc4-42b3-b386-7d5357ece5bc',
    display_order = 2
WHERE id = '1ad60491-3aa6-43ec-8e30-91d7b4c889d9';

-- ============================================
-- STEP 3: Create new "Аудио" L1 category
-- ============================================
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order, icon)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Audio',
  'Аудио',
  'audio',
  '8fb2b390-6dc4-42b3-b386-7d5357ece5bc',
  4,
  'headphones'
);

-- ============================================
-- STEP 4: Move Слушалки (Headphones) under new Аудио category
-- ============================================
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000001',
    display_order = 1
WHERE id = 'f21a988c-6440-462a-970f-7d584434a481';

-- ============================================
-- STEP 5: Move Саундбари и тонколони under new Аудио category
-- ============================================
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000001',
    display_order = 2
WHERE slug = 'soundbars-speakers';

-- ============================================
-- STEP 6: Create new "Аксесоари" L1 category under Electronics
-- ============================================
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order, icon)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Accessories',
  'Аксесоари',
  'electronics-accessories',
  '8fb2b390-6dc4-42b3-b386-7d5357ece5bc',
  8,
  'cable'
);

-- ============================================
-- STEP 7: Move phone accessories to new Аксесоари category
-- ============================================
-- Phone Cases
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000002',
    display_order = 1
WHERE id = 'e1814f1f-8536-44e5-bd2a-bf11f7cf3da1';

-- Screen Protectors
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000002',
    display_order = 2
WHERE id = 'f9ef86f8-76aa-4613-9013-6f7f5a271b68';

-- Chargers & Cables
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000002',
    display_order = 3
WHERE id = '0c57071d-72b3-421d-a430-fa8fdf50f7cb';

-- Phone Accessories (general)
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000002',
    display_order = 4
WHERE id = 'f3826989-a1c9-4635-8279-36222fa55176';

-- Tablet Accessories
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000002',
    display_order = 5
WHERE id = '04cc50cd-ce50-4c91-9374-ca3ec1107654';

-- Phone Parts
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000002',
    display_order = 6
WHERE id = '55762748-5fc5-4e26-9cf6-a0e3e8811905';

-- ============================================
-- STEP 8: Move Смарт часовници to Умни устройства
-- ============================================
UPDATE categories 
SET parent_id = '19c94316-3774-49b7-bff8-80115941a039',
    display_order = 1
WHERE id = '66b540e5-a9aa-4d7e-9330-71b65620005b';

-- ============================================
-- STEP 9: Rename "Телевизори и аудио" to just "Телевизори"
-- ============================================
UPDATE categories 
SET name = 'Televisions',
    name_bg = 'Телевизори',
    slug = 'televisions-category',
    display_order = 5
WHERE id = 'ea62ae60-2f54-47b8-b370-bda69173783f';

-- ============================================
-- STEP 10: Delete old "Телефони и таблети" category (now empty)
-- We'll keep it but rename to indicate deprecated, or delete if safe
-- ============================================
-- First check if any products reference it
-- For safety, let's just rename it and hide it
UPDATE categories 
SET name = '[DEPRECATED] Phones & Tablets',
    name_bg = '[СКРИТО] Телефони и таблети',
    display_order = 999
WHERE id = 'd8c1b2ca-3c07-48c4-95c4-9e122d82b902';

-- ============================================
-- STEP 11: Remove Gaming Electronics from Electronics (it belongs in Gaming)
-- ============================================
-- Find and update gaming electronics to be under Gaming category
UPDATE categories 
SET parent_id = '54c304d0-4eba-4075-9ef3-8cbcf426d9b0' -- Gaming category ID
WHERE slug = 'electronics-gaming';

-- ============================================
-- STEP 12: Update display_order for all L1 categories under Electronics
-- ============================================
UPDATE categories SET display_order = 1 WHERE id = 'd20450a8-53ce-4d20-9919-439a39e73cda'; -- Смартфони
UPDATE categories SET display_order = 2 WHERE id = '1ad60491-3aa6-43ec-8e30-91d7b4c889d9'; -- Таблети
UPDATE categories SET display_order = 3 WHERE slug = 'pc-laptops'; -- Компютри и лаптопи
UPDATE categories SET display_order = 4 WHERE id = 'a0000000-0000-0000-0000-000000000001'; -- Аудио
UPDATE categories SET display_order = 5 WHERE id = 'ea62ae60-2f54-47b8-b370-bda69173783f'; -- Телевизори
UPDATE categories SET display_order = 6 WHERE slug = 'electronics-cameras'; -- Камери
UPDATE categories SET display_order = 7 WHERE id = '19c94316-3774-49b7-bff8-80115941a039'; -- Умни устройства
UPDATE categories SET display_order = 8 WHERE id = 'a0000000-0000-0000-0000-000000000002'; -- Аксесоари
;
