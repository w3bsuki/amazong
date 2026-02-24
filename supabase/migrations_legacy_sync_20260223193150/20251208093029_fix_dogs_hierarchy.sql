
-- Fix dogs hierarchy: Move L3-type categories under their proper L2 parents
-- L2s with children: dog-food (34), dog-toys (18), dog-treats (18), dog-beds (12),
-- dog-grooming (10), dog-collars (8), dog-health (7), dogs-beds (7), dogs-collars (7), dogs-grooming (7), dogs-training (6)

-- 1. Move food items under 'dog-food' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-food')
WHERE slug IN (
  'dogs-food', 'dogs-food-dry', 'dogs-food-grain-free', 
  'dogs-food-puppy', 'dogs-food-senior', 'dogs-food-wet'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 2. Move toy items under 'dog-toys' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-toys')
WHERE slug IN (
  'dogs-toys', 'dogs-toys-chew', 'dogs-toys-fetch', 'dogs-toys-interactive'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 3. Move treat items under 'dog-treats' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-treats')
WHERE slug IN (
  'dogs-treats', 'dogs-treats-dental', 'dogs-treats-training'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 4. Move bed items under 'dog-beds' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-beds')
WHERE slug IN (
  'dogs-beds', 'dogs-beds-orthopedic', 'dogs-kennels', 'dog-houses'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 5. Move grooming items under 'dog-grooming' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-grooming')
WHERE slug IN (
  'dogs-grooming', 'dogs-brushes', 'dogs-shampoo'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 6. Move collar items under 'dog-collars' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-collars')
WHERE slug IN (
  'dogs-collars', 'dogs-harnesses', 'dogs-leashes', 'dog-harnesses'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 7. Move health items under 'dog-health' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-health')
WHERE slug IN ('dogs-health')
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 8. Move training items under 'dogs-training' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dogs-training')
WHERE slug IN ('dog-training')
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 9. Move clothing items together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-clothing')
WHERE slug IN ('dogs-clothing', 'dogs-coats')
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 10. Move bowl items together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-bowls')
WHERE slug = 'dogs-bowls'
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 11. Move crate items together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-crates')
WHERE slug = 'dogs-crates'
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- 12. Move door items together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dog-doors')
WHERE slug = 'dogs-doors'
AND parent_id = (SELECT id FROM categories WHERE slug = 'dogs');

-- Keep as L2: dog-carriers, dog-tech, dog-waste
;
