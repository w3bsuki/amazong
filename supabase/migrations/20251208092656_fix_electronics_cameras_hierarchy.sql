
-- Fix electronics-cameras hierarchy: Move L3-type categories under their proper L2 parents
-- L2s with children: mirrorless-cameras (10), dslr-cameras (9), action-cameras (7), 
-- camera-lenses (6), drone-accessories (5), memory-cards (5), tripods-monopods (5)

-- 1. Move DSLR related items under 'dslr-cameras' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dslr-cameras')
WHERE slug IN (
  'cameras-dslr', 'canon-cameras', 'nikon-cameras'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-cameras');

-- 2. Move mirrorless related items under 'mirrorless-cameras' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'mirrorless-cameras')
WHERE slug IN (
  'cameras-mirrorless', 'fujifilm-cameras', 'sony-cameras', 'panasonic-cameras'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-cameras');

-- 3. Move action camera related items under 'action-cameras' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'action-cameras')
WHERE slug IN (
  'cameras-action', 'gopro', '360-cameras', 'vlogging-cameras'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-cameras');

-- 4. Move lens related items under 'camera-lenses' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'camera-lenses')
WHERE slug IN (
  'cameras-lenses', 'elec-camera-lenses', 'lens-filters',
  'macro-lenses', 'prime-lenses', 'telephoto-lenses', 
  'wide-angle-lenses', 'zoom-lenses'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-cameras');

-- 5. Move drone related items under 'drone-accessories' L2 or create drones L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'drone-accessories')
WHERE slug IN (
  'cameras-drones', 'elec-drones', 'consumer-drones',
  'dji-products', 'fpv-drones', 'mini-drones', 'professional-drones'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-cameras');

-- 6. Move tripod related items under 'tripods-monopods' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tripods-monopods')
WHERE slug IN (
  'cameras-tripods', 'tripods-stabilizers', 'gimbals-stabilizers'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-cameras');

-- 7. Move accessory items - camera-accessories as L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'camera-accessories')
WHERE slug IN (
  'cameras-accessories', 'elec-camera-accessories', 'photo-accessories',
  'camera-bags', 'camera-batteries'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-cameras');

-- Keep as L2: compact-cameras, instant-cameras, video-cameras, cinema-cameras,
-- film-photography, studio-equip, lighting-equipment, memory-cards
;
