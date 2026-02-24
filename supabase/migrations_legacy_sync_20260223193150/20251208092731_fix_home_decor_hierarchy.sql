
-- Fix home-decor hierarchy: Move L3-type categories under their proper L2 parents
-- L2s with children: wall-art (10), decor-wall-art (6), rugs (6), mirrors (4), vases (4)

-- 1. Move wall art related items under 'wall-art' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'wall-art')
WHERE slug IN (
  'decor-wall-art', 'decor-canvas-prints', 'decor-framed-art',
  'decor-wall', 'decor-wall-decals'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'home-decor');

-- 2. Move rug related items under 'rugs' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'rugs')
WHERE slug IN (
  'decor-rugs', 'decor-area-rugs', 'decor-runner-rugs'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'home-decor');

-- 3. Move mirror related items under 'mirrors' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'mirrors')
WHERE slug IN (
  'decor-mirrors', 'decor-floor-mirrors', 'decor-wall-mirrors'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'home-decor');

-- 4. Move vase related items under 'vases' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'vases')
WHERE slug IN (
  'decor-vases', 'decor-vases-ceramic', 'decor-vases-glass'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'home-decor');

-- 5. Create candles L2 grouping
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'candles')
WHERE slug IN (
  'decor-candles', 'decor-candles-scented', 'decor-candle-holders', 'decor-home-fragrance'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'home-decor');

-- 6. Create curtains L2 grouping
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'curtains')
WHERE slug IN (
  'decor-curtains', 'decor-curtains-blackout', 'decor-curtains-sheer', 'decor-window'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'home-decor');

-- 7. Move plant related items together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'artificial-plants')
WHERE slug IN (
  'decor-artificial-plants', 'decor-artificial-flowers', 'decor-plants'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'home-decor');

-- 8. Move frame related items under 'picture-frames' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'picture-frames')
WHERE slug IN (
  'decor-frames', 'decor-picture-frames'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'home-decor');

-- 9. Move clock items together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'home-clocks')
WHERE slug IN (
  'decor-clocks', 'decor-alarm-clocks', 'decor-wall-clocks'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'home-decor');

-- 10. Move pillow/cushion items together under throw-pillows
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'throw-pillows')
WHERE slug IN (
  'decor-cushions', 'decor-decorative-pillows', 'decor-throw-blankets'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'home-decor');

-- Keep as L2: decor-accents, decor-figurines, decor-sculptures, decor-seasonal
;
