
-- Fix cycling hierarchy: Move L3-type categories under their proper L2 parents
-- L2 candidates with children: cycling-accessories (6), mountain-bikes (4), road-bikes (4)

-- 1. Move mountain bike related categories under 'mountain-bikes' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'mountain-bikes')
WHERE slug IN (
  'bike-mountain', 'cycling-mountain', 'cycling-mountain-bikes',
  'cycling-mtb-full-suspension', 'cycling-mtb-hardtail'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'cycling');

-- 2. Move road bike related categories under 'road-bikes' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'road-bikes')
WHERE slug IN (
  'bike-road', 'cycling-road', 'cycling-road-bikes',
  'cycling-road-bikes-aluminum', 'cycling-road-bikes-carbon'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'cycling');

-- 3. Move accessories under 'cycling-accessories' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'cycling-accessories')
WHERE slug IN (
  'bike-accessories', 'bike-accessories-cycling', 'bike-bags', 
  'bike-gear', 'bike-helmets', 'bike-lights', 'bike-locks', 
  'bike-pumps', 'bike-racks', 'bike-parts',
  'cycling-helmets', 'cycling-helmets-mtb', 'cycling-helmets-road',
  'cycling-lights-front', 'cycling-lights-rear',
  'cycling-locks-chain', 'cycling-locks-u',
  'cycling-pumps-floor', 'cycling-pumps-mini',
  'cycling-repair-kits', 'cycling-tools'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'cycling');

-- 4. Create electric-bikes as L2 with e-bike variants
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'electric-bikes')
WHERE slug IN (
  'bike-electric', 'cycling-electric-bikes', 
  'cycling-e-city', 'cycling-e-mtb', 'e-bikes'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'cycling');

-- 5. Create city-bikes as L2 with city bike variants
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'city-bikes')
WHERE slug IN (
  'bike-city', 'cycling-city-bikes'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'cycling');

-- 6. Create kids-bikes as L2 with kids bike variants
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'kids-bikes')
WHERE slug IN (
  'bike-kids-cycle', 'cycling-kids-bikes'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'cycling');

-- 7. Move clothing under a cycling-apparel L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'cycling-apparel')
WHERE slug IN (
  'cycling-clothing', 'cycling-gloves', 'cycling-jerseys', 'cycling-shorts'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'cycling');

-- 8. Move parts under cycling-components or create parts L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'cycling-components')
WHERE slug IN ('cycling-parts')
AND parent_id = (SELECT id FROM categories WHERE slug = 'cycling');

-- Keep as L2: bicycles, bikes, bmx-bikes, cycling-bmx, folding-bikes, hybrid-bikes
;
