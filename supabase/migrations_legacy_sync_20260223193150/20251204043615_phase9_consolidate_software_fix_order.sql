
-- ============================================
-- CONSOLIDATE SOFTWARE & FIX L0 ORDER
-- ============================================

-- Move children of electronics-software to the main software category
UPDATE categories 
SET parent_id = '659a9e6a-4034-403c-bc58-6185d1ee991d' -- software L0
WHERE parent_id = 'a0000000-0000-0000-0000-000000000010'; -- electronics-software

-- Deprecate electronics-software (duplicate)
UPDATE categories 
SET name = '[DUPLICATE] Software & Apps',
    name_bg = '[ДУБЛИКАТ] Софтуер',
    display_order = 9997
WHERE id = 'a0000000-0000-0000-0000-000000000010';

-- Fix Software name to be cleaner
UPDATE categories 
SET name = 'Software',
    name_bg = 'Софтуер'
WHERE slug = 'software' AND parent_id IS NULL;

-- Check if hobbies-collectibles also needs to merge into collectibles
-- First move any children of hobbies-collectibles to the new Collectibles L0
UPDATE categories 
SET parent_id = 'e30a518e-ad9e-45be-84d3-0cec45cc239c' -- collectibles L0
WHERE parent_id IN (
    SELECT id FROM categories WHERE slug = 'hobbies-collectibles'
);

-- Now let's reorder L0 categories properly
-- Main shopping categories
UPDATE categories SET display_order = 1 WHERE slug = 'fashion' AND parent_id IS NULL;
UPDATE categories SET display_order = 2 WHERE slug = 'electronics' AND parent_id IS NULL;
UPDATE categories SET display_order = 3 WHERE slug = 'home' AND parent_id IS NULL;
UPDATE categories SET display_order = 4 WHERE slug = 'health-wellness' AND parent_id IS NULL;
UPDATE categories SET display_order = 5 WHERE slug = 'beauty' AND parent_id IS NULL;
UPDATE categories SET display_order = 6 WHERE slug = 'sports' AND parent_id IS NULL;
UPDATE categories SET display_order = 7 WHERE slug = 'baby-kids' AND parent_id IS NULL;
UPDATE categories SET display_order = 8 WHERE slug = 'automotive' AND parent_id IS NULL;
UPDATE categories SET display_order = 9 WHERE slug = 'e-mobility' AND parent_id IS NULL;
UPDATE categories SET display_order = 10 WHERE slug = 'gaming' AND parent_id IS NULL;
UPDATE categories SET display_order = 11 WHERE slug = 'pets' AND parent_id IS NULL;
UPDATE categories SET display_order = 12 WHERE slug = 'grocery' AND parent_id IS NULL;
UPDATE categories SET display_order = 13 WHERE slug = 'jewelry-watches' AND parent_id IS NULL;
UPDATE categories SET display_order = 14 WHERE slug = 'collectibles' AND parent_id IS NULL;
UPDATE categories SET display_order = 15 WHERE slug = 'hobbies' AND parent_id IS NULL;
UPDATE categories SET display_order = 16 WHERE slug = 'tools-home' AND parent_id IS NULL;
UPDATE categories SET display_order = 17 WHERE slug = 'software' AND parent_id IS NULL;
UPDATE categories SET display_order = 18 WHERE slug = 'services' AND parent_id IS NULL;
UPDATE categories SET display_order = 19 WHERE slug = 'real-estate' AND parent_id IS NULL;
UPDATE categories SET display_order = 20 WHERE slug = 'wholesale' AND parent_id IS NULL;
UPDATE categories SET display_order = 21 WHERE slug = 'bulgarian-traditional' AND parent_id IS NULL;
UPDATE categories SET display_order = 22 WHERE slug = 'cbd-wellness' AND parent_id IS NULL;
;
