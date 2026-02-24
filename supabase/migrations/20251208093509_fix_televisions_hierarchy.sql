
-- Fix televisions-category hierarchy: Consolidate duplicates

-- 1. Delete hidden duplicate
DELETE FROM categories WHERE slug = 'televisions' AND name_bg LIKE '%СКРИТО%';

-- 2. Consolidate 4K TVs under tv-4k8k (as the main 4K/8K category)
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tv-4k8k')
WHERE slug IN ('4k-tvs', 'tv-4k-all', '8k-tvs', 'tv-8k')
AND parent_id = (SELECT id FROM categories WHERE slug = 'televisions-category');

-- 3. Consolidate LED TVs under led-tvs
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'led-tvs')
WHERE slug IN ('led-lcd-tvs', 'tv-led')
AND parent_id = (SELECT id FROM categories WHERE slug = 'televisions-category');

-- 4. Consolidate OLED TVs
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tv-oled')
WHERE slug IN ('oled-tvs', 'tv-oled-all')
AND parent_id = (SELECT id FROM categories WHERE slug = 'televisions-category');

-- 5. Consolidate QLED TVs
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tv-qled')
WHERE slug IN ('qled-tvs', 'tv-qled-all')
AND parent_id = (SELECT id FROM categories WHERE slug = 'televisions-category');

-- 6. Consolidate Smart TVs
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smart-tvs')
WHERE slug = 'tv-smart'
AND parent_id = (SELECT id FROM categories WHERE slug = 'televisions-category');

-- 7. Consolidate streaming devices
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'streaming-devices')
WHERE slug = 'tv-streaming'
AND parent_id = (SELECT id FROM categories WHERE slug = 'televisions-category');

-- 8. Move TV mounts to tv-accessories
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tv-accessories')
WHERE slug = 'tv-mounts'
AND parent_id = (SELECT id FROM categories WHERE slug = 'televisions-category');

-- 9. Mini-LED can stay as its own L2 (new technology)
-- 10. tv-by-brand, tv-by-size, tv-by-technology can be organizing categories

-- Keep as L2: led-tvs, tv-oled, tv-qled, smart-tvs, tv-4k8k, mini-led-tvs,
-- home-theater, streaming-devices, projectors, tv-accessories, budget-tvs,
-- tv-by-brand, tv-by-size, tv-by-technology
;
