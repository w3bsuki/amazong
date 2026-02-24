
-- Fix power-tools hierarchy: Move L3-type categories under their proper L2 parents
-- Only routers has children (4). Need to create L2 categories for common types

-- 1. Move drill items under 'drills' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'drills')
WHERE slug IN (
  'powertools-drills', 'tools-drills', 'tools-drills-cordless', 'tools-drills-hammer'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'power-tools');

-- 2. Move grinder items under 'grinders' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'grinders')
WHERE slug IN (
  'powertools-grinders', 'tools-grinders', 'tools-grinders-angle', 'tools-grinders-bench'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'power-tools');

-- 3. Move sander items under 'sanders' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'sanders')
WHERE slug IN (
  'powertools-sanders', 'tools-sanders', 'tools-sanders-belt', 'tools-sanders-orbital',
  'powertools-polishers'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'power-tools');

-- 4. Move saw items under 'saws' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'saws')
WHERE slug IN (
  'powertools-saws', 'tools-saws', 'tools-saws-circular', 'tools-saws-jigsaw',
  'tools-saws-miter', 'tools-saws-table'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'power-tools');

-- 5. Move router items under 'routers' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'routers')
WHERE slug IN (
  'powertools-routers-planers', 'tools-routers', 'tools-planers'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'power-tools');

-- 6. Move impact driver items under 'impact-drivers' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'impact-drivers')
WHERE slug IN (
  'powertools-drivers', 'powertools-wrenches', 'tools-impact-drivers'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'power-tools');

-- 7. Move nail gun items under 'nail-guns' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'nail-guns')
WHERE slug = 'tools-nail-guns'
AND parent_id = (SELECT id FROM categories WHERE slug = 'power-tools');

-- 8. Move heat gun items under 'heat-guns' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'heat-guns')
WHERE slug = 'powertools-heat-guns'
AND parent_id = (SELECT id FROM categories WHERE slug = 'power-tools');

-- 9. Move welding items under 'welding-equipment' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'welding-equipment')
WHERE slug IN ('tools-welders', 'tools-welders-mig')
AND parent_id = (SELECT id FROM categories WHERE slug = 'power-tools');

-- Keep as L2: air-compressors, rotary-tools, powertools-combos, powertools-demolition,
-- powertools-mixers, powertools-multi-tools, powertools-nibblers-shears, powertools-rotary-hammers
;
