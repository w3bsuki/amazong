
-- Fix toys-games hierarchy: Move L3-type categories under their proper L2 parents
-- L2s with children: arts-crafts (9), educational-toys (9), building-toys (8), toys-outdoor (7),
-- outdoor-play (6), ride-on-toys (6), toys-building (6), toys-educational (6), action-figures (5), toys-puzzles (5)

-- 1. Move arts/crafts items under 'arts-crafts' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'arts-crafts')
WHERE slug IN ('toys-arts', 'toys-arts-crafts')
AND parent_id = (SELECT id FROM categories WHERE slug = 'toys-games');

-- 2. Move educational/STEM items under 'educational-toys' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'educational-toys')
WHERE slug IN ('toys-educational', 'toys-stem')
AND parent_id = (SELECT id FROM categories WHERE slug = 'toys-games');

-- 3. Move building items under 'building-toys' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'building-toys')
WHERE slug IN ('toys-building', 'toys-blocks', 'toys-trains')
AND parent_id = (SELECT id FROM categories WHERE slug = 'toys-games');

-- 4. Move outdoor play items under 'toys-outdoor' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'toys-outdoor')
WHERE slug IN ('outdoor-play', 'toys-water')
AND parent_id = (SELECT id FROM categories WHERE slug = 'toys-games');

-- 5. Move ride-on items under 'ride-on-toys' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'ride-on-toys')
WHERE slug IN ('toys-ride-on', 'toys-rideon', 'toys-vehicles', 'toys-cars')
AND parent_id = (SELECT id FROM categories WHERE slug = 'toys-games');

-- 6. Move action figures under 'action-figures' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'action-figures')
WHERE slug IN ('toys-action', 'toys-figures-superhero')
AND parent_id = (SELECT id FROM categories WHERE slug = 'toys-games');

-- 7. Move puzzle items under 'toys-puzzles' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'toys-puzzles')
WHERE slug IN ('puzzles-games', 'toys-games-puzzles', 'toys-puzzles-3d', 'toys-puzzles-jigsaw')
AND parent_id = (SELECT id FROM categories WHERE slug = 'toys-games');

-- 8. Move RC toys items together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'toys-rc')
WHERE slug = 'toys-rc-cars'
AND parent_id = (SELECT id FROM categories WHERE slug = 'toys-games');

-- 9. Move board games together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'toys-board-games')
WHERE slug IN (
  'games-card', 'games-classic', 'games-cooperative', 'games-family', 
  'games-party', 'games-trivia', 'toys-card-games', 'toys-games-strategy'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'toys-games');

-- 10. Move doll items together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dolls-playsets')
WHERE slug IN ('toys-dolls-baby', 'toys-dolls-fashion', 'toys-doll-houses')
AND parent_id = (SELECT id FROM categories WHERE slug = 'toys-games');

-- Keep as L2: toys-baby, toys-stuffed, plush-toys, toys-electronic, toys-pretend
;
