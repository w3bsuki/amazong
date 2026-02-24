
-- Fix tablets hierarchy: Consolidate duplicates and move accessories

-- 1. Consolidate iPad items under tablets-ipad
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tablets-ipad')
WHERE slug IN (
  'ipad', 'apple-ipad', 'ipad-tablets',
  'ipad-10th-gen', 'ipad-air', 'ipad-mini', 'ipad-pro',
  'tablets-ipad-air', 'tablets-ipad-mini', 'tablets-ipad-pro'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'tablets');

-- 2. Consolidate Samsung tablets under tablets-samsung
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tablets-samsung')
WHERE slug = 'galaxy-tab'
AND parent_id = (SELECT id FROM categories WHERE slug = 'tablets');

-- 3. Consolidate Android tablets under tablets-android
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tablets-android')
WHERE slug IN ('android-tablets', 'tablets-android-all')
AND parent_id = (SELECT id FROM categories WHERE slug = 'tablets');

-- 4. Consolidate Windows tablets under tablets-windows
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tablets-windows')
WHERE slug IN ('windows-tablets', 'tablets-windows-all')
AND parent_id = (SELECT id FROM categories WHERE slug = 'tablets');

-- 5. Consolidate e-readers under e-readers L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'e-readers')
WHERE slug IN ('tablets-ereaders', 'tablets-kindle')
AND parent_id = (SELECT id FROM categories WHERE slug = 'tablets');

-- 6. Move accessories to electronics-accessories (wrong L1)
-- Move to tablet-accessories under electronics-accessories
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tablet-accessories')
WHERE slug IN (
  'tablets-accessories', 'tablets-cases', 'tablets-cases-ipad',
  'tablets-chargers', 'tablets-keyboards', 'tablets-screen-protectors',
  'tablets-stands', 'tablets-stylus', 'tablets-apple-pencil'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'tablets');

-- 7. Consolidate kids tablets
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tablets-kids')
WHERE slug = 'kids-tablets'
AND parent_id = (SELECT id FROM categories WHERE slug = 'tablets');

-- Keep as L2: tablets-ipad, tablets-samsung, tablets-android, tablets-windows, 
-- tablets-lenovo, tablets-kids, e-readers
;
