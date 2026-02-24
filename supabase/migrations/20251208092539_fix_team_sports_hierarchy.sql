
-- Fix team-sports hierarchy: Move L3-type categories under their proper L2 parents
-- L2 candidates with children: baseball-softball (4), hockey (4), team-basketball (4), volleyball (4), basketball (2), baseball (1)

-- 1. Move basketball-related categories under 'team-basketball' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'team-basketball')
WHERE slug IN (
  'basketball', 'basketball-equip', 'basketball-equipment',
  'team-sports-basketball', 'team-sports-basketball-hoops', 
  'team-sports-basketball-shoes', 'team-sports-basketballs'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'team-sports');

-- 2. Move baseball-related categories under 'baseball-softball' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'baseball-softball')
WHERE slug IN (
  'baseball', 'baseball-equipment', 'team-baseball',
  'team-sports-baseball', 'team-sports-baseball-bats', 
  'team-sports-baseball-gloves', 'team-sports-baseballs'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'team-sports');

-- 3. Move hockey-related categories under 'hockey' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hockey')
WHERE slug IN (
  'hockey-equip', 'hockey-equipment', 'team-hockey',
  'team-sports-hockey', 'team-sports-hockey-protective', 
  'team-sports-hockey-pucks', 'team-sports-hockey-sticks'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'team-sports');

-- 4. Move volleyball-related categories under 'volleyball' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'volleyball')
WHERE slug IN (
  'volleyball-equip', 'volleyball-equipment', 'team-volleyball',
  'team-sports-volleyball', 'team-sports-volleyball-nets', 
  'team-sports-volleyballs'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'team-sports');

-- 5. Create/use football (soccer) as L2 and move soccer categories under it
-- First need to check if 'football-soccer' has children or should be L2
UPDATE categories 
SET parent_id = (
  CASE 
    WHEN EXISTS (SELECT 1 FROM categories WHERE slug = 'team-football') 
    THEN (SELECT id FROM categories WHERE slug = 'team-football')
    ELSE (SELECT id FROM categories WHERE slug = 'football-soccer')
  END
)
WHERE slug IN (
  'soccer-equipment', 'team-sports-football',
  'team-sports-soccer-balls', 'team-sports-soccer-cleats', 
  'team-sports-soccer-goals', 'team-sports-soccer-jerseys',
  'team-sports-shin-guards', 'football-soccer-balls',
  'football-soccer-cleats', 'football-soccer-goals', 'football-soccer-jerseys'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'team-sports');

-- 6. Move American football categories - use 'american-football' as L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'american-football')
WHERE slug IN (
  'american-football-equipment', 'football-equipment',
  'team-sports-american-football', 'team-sports-footballs'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'team-sports');

-- 7. Move rugby categories - use 'team-rugby' as L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'team-rugby')
WHERE slug IN (
  'rugby', 'rugby-equip', 'rugby-equipment',
  'team-sports-rugby', 'team-sports-rugby-balls'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'team-sports');

-- 8. Move handball categories - use 'team-handball' as L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'team-handball')
WHERE slug IN (
  'handball-equipment', 'team-sports-handball', 'team-sports-handballs'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'team-sports');

-- 9. Move cricket under a cricket L2 (if exists, or keep at L2)
-- team-sports-cricket and team-sports-cricket-bats should be together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'team-sports-cricket')
WHERE slug = 'team-sports-cricket-bats'
AND parent_id = (SELECT id FROM categories WHERE slug = 'team-sports');

-- 10. Training equipment stays at L2 level
;
