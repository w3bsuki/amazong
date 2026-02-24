
-- Fix furniture hierarchy: Move L3-type categories under their proper L2 parents
-- L2 candidates: living-room-furniture (9), dining-room-furniture (8), furn-beds (7), 
-- furn-chairs (7), furn-sofas (7), furn-tables (7), kids-furniture (7), bedroom-furniture (6), mattresses (5)

-- 1. Move living room related items under 'living-room-furniture' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'living-room-furniture')
WHERE slug IN (
  'furniture-living-room', 'furniture-coffee-tables', 'furniture-end-tables',
  'furniture-entertainment-centers', 'furniture-tv-stands', 'tv-stands'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

-- 2. Move dining room related items under 'dining-room-furniture' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dining-room-furniture')
WHERE slug IN (
  'dining-furniture', 'furniture-dining', 'furniture-dining-room',
  'furniture-dining-chairs', 'furniture-dining-tables', 'furniture-buffets',
  'furniture-bar-stools'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

-- 3. Move bed related items under 'furn-beds' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'furn-beds')
WHERE slug IN (
  'furniture-beds', 'furniture-beds-platform', 'furniture-beds-storage',
  'furniture-bunk-beds'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

-- 4. Move chair related items under 'furn-chairs' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'furn-chairs')
WHERE slug IN (
  'furniture-chairs', 'furniture-recliners'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

-- 5. Move sofa related items under 'furn-sofas' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'furn-sofas')
WHERE slug IN (
  'furniture-sofas', 'furniture-sofas-sectional', 'furniture-sofas-sleeper',
  'furniture-loveseats'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

-- 6. Move table related items under 'furn-tables' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'furn-tables')
WHERE slug IN (
  'furniture-tables', 'desks'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

-- 7. Move kids furniture related items under 'kids-furniture' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'kids-furniture')
WHERE slug IN ('furniture-kids')
AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

-- 8. Move bedroom related items under 'bedroom-furniture' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'bedroom-furniture')
WHERE slug IN (
  'furniture-bedroom', 'furniture-dressers', 'furniture-nightstands',
  'furniture-wardrobes', 'wardrobes'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

-- 9. Move mattress related items under 'mattresses' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'mattresses')
WHERE slug IN (
  'furniture-mattresses', 'furniture-mattresses-hybrid', 'furniture-mattresses-memory'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

-- 10. Move storage related items - create or use furn-storage
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'furn-storage')
WHERE slug IN (
  'storage-furniture', 'furniture-shelving', 'furniture-bookcases', 'shelves'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

-- 11. Keep as L2: furn-office, furn-outdoor, furniture-bathroom, furniture-entryway, office-furniture-home, furniture-outdoor
;
