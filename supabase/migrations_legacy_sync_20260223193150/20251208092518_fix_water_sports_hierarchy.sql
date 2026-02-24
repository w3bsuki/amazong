
-- Fix water-sports hierarchy: Move L3-type categories under their proper L2 parents
-- water-sports L1 has proper L2s: diving (10), swimming (7), kayaking (4), surfing (2)
-- Many duplicate L3s need to be moved under these L2s

-- Get water-sports ID for reference
-- Then move categories to proper parents

-- 1. Move diving-related categories under 'diving' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'diving')
WHERE slug IN (
  'diving-gear', 'scuba-diving', 'water-diving', 'water-sports-diving',
  'water-sports-bcds', 'water-sports-dive-fins', 'water-sports-dive-masks',
  'water-sports-regulators', 'water-sports-scuba-gear'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'water-sports');

-- 2. Move swimming-related categories under 'swimming' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'swimming')
WHERE slug IN (
  'swimming-equip', 'swimming-gear', 'swimsuits-sport', 'water-swimming',
  'water-sports-goggles', 'water-sports-swim-caps', 'water-sports-swimming',
  'water-sports-swimwear', 'water-sports-training-fins'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'water-sports');

-- 3. Move kayaking-related categories under 'kayaking' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'kayaking')
WHERE slug IN (
  'kayaking-gear', 'water-kayaking', 'water-sports-kayaking',
  'water-sports-kayaks', 'water-sports-kayaks-inflatable', 'water-sports-paddles'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'water-sports');

-- 4. Move surfing-related categories under 'surfing' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'surfing')
WHERE slug IN (
  'surfboards', 'surfing-equip', 'surfing-gear', 'water-surfing',
  'water-sports-surfboards', 'water-sports-surfing', 'water-sports-longboards', 
  'water-sports-shortboards'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'water-sports');

-- 5. Create or use 'paddleboarding' as L2 and move SUP categories under it
-- First check if we need to create paddleboarding L2 or use sup-paddleboarding
UPDATE categories 
SET parent_id = (
  CASE 
    WHEN EXISTS (SELECT 1 FROM categories WHERE slug = 'paddleboarding') 
    THEN (SELECT id FROM categories WHERE slug = 'paddleboarding')
    ELSE (SELECT id FROM categories WHERE slug = 'sup-paddleboarding')
  END
)
WHERE slug IN (
  'paddleboarding-gear', 'paddleboards', 'water-paddleboard',
  'water-sports-sup', 'water-sports-sup-boards', 'water-sports-sup-inflatable'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'water-sports');

-- 6. Create or use 'wakeboarding' as L2 and move wakeboard categories under it
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'wakeboarding')
WHERE slug IN (
  'wakeboarding-gear', 'wakeboarding-waterskiing', 'water-wakeboard',
  'water-sports-wakeboarding', 'water-sports-wakeboards', 'water-skiing-gear',
  'water-skis', 'water-sports-water-skiing'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'water-sports');

-- 7. Move wetsuit categories - create wetsuits as L2 if it has no parent, or move under diving
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'diving')
WHERE slug IN (
  'wetsuits', 'water-sports-wetsuits', 'water-sports-wetsuits-full', 
  'water-sports-wetsuits-shorty'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'water-sports');

-- 8. Move snorkel gear under diving
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'diving')
WHERE slug IN ('snorkel-gear', 'water-sports-snorkels')
AND parent_id = (SELECT id FROM categories WHERE slug = 'water-sports');

-- 9. Move remaining equipment categories under most relevant parents
-- Life jackets -> kayaking (safety equipment for kayaking)
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'kayaking')
WHERE slug IN ('life-jackets', 'water-sports-life-jackets')
AND parent_id = (SELECT id FROM categories WHERE slug = 'water-sports');

-- Water polo can stay at L2 level (it's its own sport)
-- Jetski can stay at L2 level (distinct sport)
-- Fishing can stay at L2 level (distinct activity)
;
