
-- Fix winter-sports hierarchy: Move L3-type categories under their proper L2 parents
-- L2 candidate with children: ice-skating (5)
-- Need to create proper L2 categories: skiing, snowboarding, cross-country

-- 1. First, make skiing-equipment an L2 and move ski-related items under it
-- Or use winter-skiing as L2
UPDATE categories 
SET parent_id = (
  CASE 
    WHEN EXISTS (SELECT 1 FROM categories WHERE slug = 'skiing-equipment') 
    THEN (SELECT id FROM categories WHERE slug = 'skiing-equipment')
    ELSE (SELECT id FROM categories WHERE slug = 'winter-skiing')
  END
)
WHERE slug IN (
  'ski-boots', 'ski-clothing', 'ski-goggles', 'ski-poles', 'ski-snowboard-helmets',
  'skis', 'winter-sports-skiing', 'winter-sports-all-mountain-skis', 
  'winter-sports-alpine-skis', 'winter-sports-carving-skis', 'winter-sports-freeride-skis',
  'winter-sports-ski-bindings', 'winter-sports-ski-boots', 'winter-sports-ski-goggles',
  'winter-sports-ski-helmets', 'winter-sports-ski-jackets', 'winter-sports-ski-pants',
  'winter-sports-ski-poles'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'winter-sports');

-- 2. Move snowboarding related items under a snowboarding L2
UPDATE categories 
SET parent_id = (
  CASE 
    WHEN EXISTS (SELECT 1 FROM categories WHERE slug = 'snowboarding-equipment') 
    THEN (SELECT id FROM categories WHERE slug = 'snowboarding-equipment')
    ELSE (SELECT id FROM categories WHERE slug = 'winter-snowboarding')
  END
)
WHERE slug IN (
  'snowboard-boots', 'snowboards', 'winter-snowboard', 'winter-sports-snowboarding',
  'winter-sports-snowboard-bindings', 'winter-sports-snowboard-boots',
  'winter-sports-snowboard-helmets', 'winter-sports-snowboards',
  'winter-sports-snowboards-all-mountain', 'winter-sports-snowboards-freestyle'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'winter-sports');

-- 3. Move ice skating related items under 'ice-skating' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'ice-skating')
WHERE slug IN (
  'ice-skates', 'ice-skating-equipment', 'winter-skating',
  'winter-sports-ice-skating', 'winter-sports-figure-skates', 'winter-sports-hockey-skates'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'winter-sports');

-- 4. Move cross-country skiing items under 'cross-country-skiing' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'cross-country-skiing')
WHERE slug IN (
  'winter-cross-country', 'winter-sports-cross-country',
  'winter-sports-xc-boots', 'winter-sports-xc-skis'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'winter-sports');

-- 5. Move sled/sledding items under winter-sledding as L2 or keep sleds
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'winter-sledding')
WHERE slug IN ('sleds', 'winter-sports-sledding')
AND parent_id = (SELECT id FROM categories WHERE slug = 'winter-sports');

-- 6. Move snowshoeing items together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'snowshoeing')
WHERE slug = 'snowshoes'
AND parent_id = (SELECT id FROM categories WHERE slug = 'winter-sports');

-- 7. Move clothing/apparel items - create winter-accessories as L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'winter-accessories')
WHERE slug IN (
  'winter-sports-apparel', 'winter-sports-clothing',
  'winter-sports-gloves', 'winter-sports-goggles', 'winter-sports-helmets'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'winter-sports');
;
