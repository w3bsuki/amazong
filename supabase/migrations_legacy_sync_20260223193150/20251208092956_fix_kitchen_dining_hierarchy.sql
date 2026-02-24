
-- Fix kitchen-dining hierarchy: Move L3-type categories under their proper L2 parents
-- L2s with children: kitchen-appliances (28), cookware (20), kitchen-utensils (10),
-- kitchen-small-appliances (9), bakeware (8), kitchen-large-appliances (8),
-- cutlery (7), dinnerware (7), food-storage (7), glassware (6)

-- 1. Move cookware items under 'cookware' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'cookware')
WHERE slug IN (
  'kitchen-cookware', 'kitchen-cookware-sets', 'kitchen-cast-iron',
  'kitchen-dutch-ovens', 'kitchen-frying-pans', 'kitchen-pans-nonstick',
  'kitchen-saucepans', 'kitchen-woks'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-dining');

-- 2. Move bakeware items under 'bakeware' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'bakeware')
WHERE slug IN (
  'kitchen-bakeware', 'kitchen-baking-sheets', 'kitchen-cake-pans', 'kitchen-muffin-pans'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-dining');

-- 3. Move utensil items under 'kitchen-utensils' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-utensils')
WHERE slug IN (
  'kitchen-tools', 'kitchen-ladles', 'kitchen-spatulas', 'kitchen-whisks'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-dining');

-- 4. Move cutlery/knife items under 'cutlery' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'cutlery')
WHERE slug IN (
  'kitchen-cutlery', 'kitchen-flatware', 'kitchen-knives',
  'kitchen-knife-sets', 'kitchen-knives-chef', 'kitchen-cutting-boards'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-dining');

-- 5. Move dinnerware items under 'dinnerware' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dinnerware')
WHERE slug IN (
  'kitchen-dinnerware', 'kitchen-plates', 'kitchen-bowls'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-dining');

-- 6. Move glassware items under 'glassware' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'glassware')
WHERE slug IN (
  'kitchen-glassware', 'kitchen-mugs', 'kitchen-wine-glasses', 'kitchen-water-bottles'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-dining');

-- 7. Move food storage items under 'food-storage' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'food-storage')
WHERE slug IN (
  'kitchen-food-storage', 'kitchen-containers'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'kitchen-dining');

-- Keep as L2: kitchen-appliances, kitchen-small-appliances, kitchen-large-appliances,
-- kitchen-bar, kitchen-coffee-tea, kitchen-linens, kitchen-organization
;
