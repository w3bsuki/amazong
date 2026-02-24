
-- ============================================
-- FIXING MY MISTAKES
-- ============================================

-- 1. RESTORE WHOLESALE as L0
UPDATE categories 
SET name = 'Wholesale',
    name_bg = 'На едро',
    display_order = 18
WHERE slug = 'wholesale';

-- 2. RESTORE SOFTWARE as L0
UPDATE categories 
SET name = 'Software & Digital',
    name_bg = 'Софтуер и дигитални продукти',
    display_order = 19,
    parent_id = NULL
WHERE slug = 'software';

-- 3. SEPARATE HEALTH FROM BEAUTY
-- Restore Health as its own L0
UPDATE categories 
SET name = 'Health & Wellness',
    name_bg = 'Здраве и wellness',
    display_order = 5,
    parent_id = NULL
WHERE slug = 'health';

-- Rename Beauty back to just Beauty
UPDATE categories 
SET name = 'Beauty & Personal Care',
    name_bg = 'Красота и грижа',
    display_order = 6
WHERE slug = 'beauty-health';

-- Actually let's check if beauty-health is the right slug or if there's a separate beauty
-- First, restore E-Mobility as L0 (it's big enough)
UPDATE categories 
SET name = 'E-Mobility',
    name_bg = 'Електромобилност',
    display_order = 20,
    parent_id = NULL
WHERE slug = 'e-mobility';

-- 4. COLLECTIBLES & TCG as L0 (Pokemon, Magic, Sports Cards are HUGE)
UPDATE categories 
SET name = 'Collectibles & Trading Cards',
    name_bg = 'Колекции и карти',
    display_order = 21,
    parent_id = NULL
WHERE slug = 'collectibles' OR slug = 'hobbies-collectibles';

-- Remove Software from Electronics (it should be standalone)
UPDATE categories 
SET parent_id = NULL
WHERE slug = 'software' OR slug = 'electronics-software';
;
