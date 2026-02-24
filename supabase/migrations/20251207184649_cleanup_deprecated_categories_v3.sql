
-- STEP 1: Un-deprecate valid subcategories (they're useful for filtering)
-- These were incorrectly marked with high display_order

-- TV types - set proper display order
UPDATE categories SET display_order = 1 WHERE slug = 'tv-oled';
UPDATE categories SET display_order = 2 WHERE slug = 'tv-qled';
UPDATE categories SET display_order = 3 WHERE slug = 'tv-led';
UPDATE categories SET display_order = 4 WHERE slug = 'tv-smart';
UPDATE categories SET display_order = 5 WHERE slug = 'tv-4k8k';

-- Headphone types
UPDATE categories SET display_order = 1 WHERE slug = 'headphones-wireless';
UPDATE categories SET display_order = 2 WHERE slug = 'headphones-anc';
UPDATE categories SET display_order = 3 WHERE slug = 'headphones-gaming';
UPDATE categories SET display_order = 4 WHERE slug = 'headphones-sports';
UPDATE categories SET display_order = 5 WHERE slug = 'headphones-overear';
UPDATE categories SET display_order = 6 WHERE slug = 'headphones-earbuds';

-- Smartphone brands
UPDATE categories SET display_order = 1 WHERE slug = 'smartphones-xiaomi';
UPDATE categories SET display_order = 2 WHERE slug = 'smartphones-pixel';
UPDATE categories SET display_order = 3 WHERE slug = 'smartphones-oneplus';
UPDATE categories SET display_order = 4 WHERE slug = 'smartphones-huawei';
UPDATE categories SET display_order = 99 WHERE slug = 'smartphones-other';

-- Tablet types
UPDATE categories SET display_order = 1 WHERE slug = 'tablets-ipad';
UPDATE categories SET display_order = 2 WHERE slug = 'tablets-samsung';
UPDATE categories SET display_order = 3 WHERE slug = 'tablets-android';

-- STEP 2: Delete truly deprecated/duplicate categories (no products, no children)
DELETE FROM categories WHERE id IN (
  '8ce6de3a-843e-47be-9d97-b207193485e1',  -- [DEPRECATED] Loose Diamonds & Gems
  '13f33f56-9cd3-449b-95ee-1e6d8e464019',  -- [DEPRECATED] Jewelry Boxes & Care
  '6d98fd96-0b10-4d79-aff0-f217229df1e1',  -- [DEPRECATED] Gaming Merchandise
  'a0000000-0000-0000-0000-000000000011',  -- [MOVED] Health & Wellness Sub
  '99bb0e3c-a127-4d11-97e6-254a62f5c8da',  -- [DEPRECATED] Engagement & Wedding
  'a0000000-0000-0000-0000-000000000010',  -- [DUPLICATE] Software & Apps
  '78cc5292-90f5-43e4-bc94-a48cd7c231b4',  -- [DEPRECATED] Kids Toys
  '8de3c7b1-4870-49cd-86ae-17ca452612b3',  -- [DUPLICATE] Beds
  '12b338f8-14e3-4893-b504-2b4ab5f220e9',  -- [DUPLICATE] Tables
  '53ea6b63-6f19-47be-91c7-10b52284516d',  -- [DUPLICATE] Chairs
  '739b2549-73ee-4589-bc9e-b59ce8962027'   -- [DUPLICATE] Sofas
);

-- STEP 3: Handle [MOVED] EV categories - un-deprecate them (they have children)
UPDATE categories SET display_order = 1, name = 'EV Chargers', name_bg = 'Зарядни станции' WHERE slug = 'ev-chargers';
UPDATE categories SET display_order = 2, name = 'E-Bikes', name_bg = 'Електрически велосипеди' WHERE slug = 'e-bikes-cat';
UPDATE categories SET display_order = 3, name = 'E-Scooters', name_bg = 'Електрически тротинетки' WHERE slug = 'e-scooters';
UPDATE categories SET display_order = 4, name = 'EV Parts & Accessories', name_bg = 'Части и аксесоари за EV' WHERE slug = 'ev-parts';

-- STEP 4: Handle [DEPRECATED] Scale Models - check if it has children
-- If child exists, un-deprecate; otherwise delete
UPDATE categories SET display_order = 10, name = 'Scale Models', name_bg = 'Мащабни модели' 
WHERE slug = 'hobby-scale-models';
;
