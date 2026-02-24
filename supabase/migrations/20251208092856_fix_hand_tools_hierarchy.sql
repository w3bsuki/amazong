
-- Fix hand-tools hierarchy: Move L3-type categories under their proper L2 parents
-- None have children currently. Need to create proper L2 groupings

-- 1. Move hammer items under 'hammers' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hammers')
WHERE slug IN (
  'handtools-hammers', 'handtools-striking', 'tools-hammers', 
  'tools-hammers-claw', 'tools-mallets'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'hand-tools');

-- 2. Move plier items under 'pliers' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'pliers')
WHERE slug IN (
  'handtools-pliers', 'tools-pliers', 'tools-pliers-locking', 'tools-pliers-needle-nose'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'hand-tools');

-- 3. Move screwdriver items under 'screwdrivers' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'screwdrivers')
WHERE slug IN (
  'handtools-screwdrivers', 'tools-screwdrivers', 
  'tools-screwdrivers-precision', 'tools-screwdrivers-sets'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'hand-tools');

-- 4. Move wrench items under 'wrenches' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'wrenches')
WHERE slug IN (
  'handtools-wrenches', 'handtools-hex-torx', 'tools-wrenches',
  'tools-wrenches-adjustable', 'tools-wrenches-socket'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'hand-tools');

-- 5. Move clamp items under 'clamps' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'clamps')
WHERE slug IN ('handtools-clamps', 'tools-clamps')
AND parent_id = (SELECT id FROM categories WHERE slug = 'hand-tools');

-- 6. Move saw items under 'hand-saws' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hand-saws')
WHERE slug IN ('handtools-saws')
AND parent_id = (SELECT id FROM categories WHERE slug = 'hand-tools');

-- 7. Move level/measuring items under 'levels' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'levels')
WHERE slug IN (
  'handtools-measuring', 'tools-levels', 'tools-measuring', 
  'tools-tape-measures', 'tools-squares'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'hand-tools');

-- 8. Move tool set items under 'tool-sets' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tool-sets')
WHERE slug IN (
  'handtools-sets', 'tools-tool-sets', 'tools-tool-boxes'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'hand-tools');

-- 9. Move socket items under 'socket-sets' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'socket-sets')
WHERE slug = 'handtools-sockets'
AND parent_id = (SELECT id FROM categories WHERE slug = 'hand-tools');

-- 10. Move cutting items under 'cutting-tools' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'cutting-tools')
WHERE slug IN (
  'handtools-cutting', 'utility-knives', 'tools-utility-knives'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'hand-tools');

-- Keep as L2: handtools-chisels, handtools-files, handtools-pry-bars
;
