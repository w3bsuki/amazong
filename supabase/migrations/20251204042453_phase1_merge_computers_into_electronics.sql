
-- ============================================
-- PHASE 1: MERGE COMPUTERS L0 INTO ELECTRONICS
-- ============================================

-- First, get all children of the L0 Computers category and move them under Electronics > Компютри и лаптопи (L1)
-- L0 Computers ID: 12fa95c3-1b3f-4bf5-bbe5-36bd69d8bc77
-- Electronics ID: 8fb2b390-6dc4-42b3-b386-7d5357ece5bc
-- Electronics > PC & Laptops (L1) ID: 5c4a4eba-4ee9-44b9-95e2-7955ec4912d8

-- Move all L1 children from duplicate L0 Computers to Electronics > PC & Laptops
UPDATE categories 
SET parent_id = '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8'
WHERE parent_id = '12fa95c3-1b3f-4bf5-bbe5-36bd69d8bc77';

-- Mark the duplicate L0 Computers as deprecated
UPDATE categories 
SET name = '[DEPRECATED] Computers',
    name_bg = '[СКРИТО] Компютри',
    display_order = 9999
WHERE id = '12fa95c3-1b3f-4bf5-bbe5-36bd69d8bc77';

-- ============================================
-- PHASE 2: MERGE SMART HOME INTO ELECTRONICS
-- ============================================
-- Smart Home L0 ID: 7c967ea1-1639-4ec4-afb7-c75b8b7313b3
-- Electronics > Smart Devices (L1) ID: 19c94316-3774-49b7-bff8-80115941a039

-- Move all Smart Home children under Electronics > Умни устройства
UPDATE categories 
SET parent_id = '19c94316-3774-49b7-bff8-80115941a039'
WHERE parent_id = '7c967ea1-1639-4ec4-afb7-c75b8b7313b3';

-- Mark Smart Home L0 as deprecated
UPDATE categories 
SET name = '[DEPRECATED] Smart Home',
    name_bg = '[СКРИТО] Умен дом',
    display_order = 9998
WHERE id = '7c967ea1-1639-4ec4-afb7-c75b8b7313b3';

-- ============================================
-- PHASE 3: MERGE E-MOBILITY INTO AUTOMOTIVE
-- ============================================
-- E-Mobility L0 ID: 2ab6ebd1-f22d-4088-af7e-60b61a372903
-- Automotive ID: ae1c527f-1293-4032-a108-ec2a0252f2e0

-- Move E-Mobility children under Automotive
UPDATE categories 
SET parent_id = 'ae1c527f-1293-4032-a108-ec2a0252f2e0'
WHERE parent_id = '2ab6ebd1-f22d-4088-af7e-60b61a372903';

-- Mark E-Mobility L0 as deprecated
UPDATE categories 
SET name = '[DEPRECATED] E-Mobility',
    name_bg = '[СКРИТО] Електромобилност',
    display_order = 9997
WHERE id = '2ab6ebd1-f22d-4088-af7e-60b61a372903';

-- ============================================
-- PHASE 4: MERGE SOFTWARE INTO ELECTRONICS
-- ============================================
-- Software L0 ID: 659a9e6a-4034-403c-bc58-6185d1ee991d

-- Create a new L1 "Software" under Electronics
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order)
VALUES ('a0000000-0000-0000-0000-000000000010', 'Software & Apps', 'Софтуер и приложения', 'electronics-software', '8fb2b390-6dc4-42b3-b386-7d5357ece5bc', 9);

-- Move Software children under new Electronics > Software
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000010'
WHERE parent_id = '659a9e6a-4034-403c-bc58-6185d1ee991d';

-- Mark Software L0 as deprecated
UPDATE categories 
SET name = '[DEPRECATED] Software',
    name_bg = '[СКРИТО] Софтуер',
    display_order = 9996
WHERE id = '659a9e6a-4034-403c-bc58-6185d1ee991d';
;
