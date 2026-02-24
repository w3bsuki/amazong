
-- ============================================
-- PHASE 5: MERGE HEALTH INTO BEAUTY (Красота и Здраве)
-- ============================================
-- Beauty L0 ID: 69a1114f-6e23-4f73-8883-0ef5eebdb916
-- Health L0 ID: d1cdc34b-dc6d-42fc-bab4-47e3cbd3a673

-- Rename Beauty to "Beauty & Health"
UPDATE categories 
SET name = 'Beauty & Health',
    name_bg = 'Красота и здраве',
    slug = 'beauty-health'
WHERE id = '69a1114f-6e23-4f73-8883-0ef5eebdb916';

-- Create L1 "Health" under the combined category
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order)
VALUES ('a0000000-0000-0000-0000-000000000011', 'Health & Wellness', 'Здраве и уелнес', 'health-wellness-sub', '69a1114f-6e23-4f73-8883-0ef5eebdb916', 10);

-- Move Health L0 children under new subcategory
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000011'
WHERE parent_id = 'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673';

-- Mark Health L0 as deprecated
UPDATE categories 
SET name = '[DEPRECATED] Health',
    name_bg = '[СКРИТО] Здраве',
    display_order = 9995
WHERE id = 'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673';

-- ============================================
-- PHASE 6: MERGE TOYS INTO BABY & KIDS
-- ============================================
-- Baby & Kids L0 ID: a6583270-7d99-4414-b522-c5cbee4d1f04
-- Toys L0 ID: 5de3e3bc-a538-4f9a-b6f5-b6d076220061

-- Rename Baby & Kids to include Toys
UPDATE categories 
SET name = 'Baby, Kids & Toys',
    name_bg = 'Бебета, деца и играчки'
WHERE id = 'a6583270-7d99-4414-b522-c5cbee4d1f04';

-- Create L1 "Toys" under Baby & Kids
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order)
VALUES ('a0000000-0000-0000-0000-000000000012', 'Toys & Games', 'Играчки и игри', 'toys-games-sub', 'a6583270-7d99-4414-b522-c5cbee4d1f04', 10);

-- Move Toys L0 children under new subcategory
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000012'
WHERE parent_id = '5de3e3bc-a538-4f9a-b6f5-b6d076220061';

-- Mark Toys L0 as deprecated
UPDATE categories 
SET name = '[DEPRECATED] Toys',
    name_bg = '[СКРИТО] Играчки',
    display_order = 9994
WHERE id = '5de3e3bc-a538-4f9a-b6f5-b6d076220061';

-- ============================================
-- PHASE 7: MERGE OFFICE INTO HOME
-- ============================================
-- Home L0 ID: e1a9ee96-632b-4939-babe-6923034fde2e
-- Office L0 ID: 3cb4f8af-dc3e-4e30-8c4f-299a067cff36

-- Create L1 "Office" under Home
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order)
VALUES ('a0000000-0000-0000-0000-000000000013', 'Office & School', 'Офис и училище', 'home-office', 'e1a9ee96-632b-4939-babe-6923034fde2e', 10);

-- Move Office L0 children under new subcategory
UPDATE categories 
SET parent_id = 'a0000000-0000-0000-0000-000000000013'
WHERE parent_id = '3cb4f8af-dc3e-4e30-8c4f-299a067cff36';

-- Mark Office L0 as deprecated
UPDATE categories 
SET name = '[DEPRECATED] Office',
    name_bg = '[СКРИТО] Офис',
    display_order = 9993
WHERE id = '3cb4f8af-dc3e-4e30-8c4f-299a067cff36';

-- ============================================
-- PHASE 8: MERGE GARDEN INTO HOME
-- ============================================
-- Garden L0 ID: 575c6e46-23ab-40b6-b948-f4215c61972b

-- Move Garden as L1 under Home (don't merge children, keep structure)
UPDATE categories 
SET parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e',
    display_order = 11
WHERE id = '575c6e46-23ab-40b6-b948-f4215c61972b';

-- Rename Home to include Garden
UPDATE categories 
SET name = 'Home, Garden & Kitchen',
    name_bg = 'Дом, градина и кухня'
WHERE id = 'e1a9ee96-632b-4939-babe-6923034fde2e';
;
