
-- Fix fitness hierarchy: Move L3-type categories under their proper L2 parents
-- L2s with children: fitness-weights (7), fitness-cardio (6), yoga-pilates (6), strength-training (4)

-- 1. Move weight items under 'fitness-weights' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'fitness-weights')
WHERE slug IN (
  'barbells-plates', 'dumbbells', 'fit-weights', 'kettlebells', 
  'medicine-balls', 'weights'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'fitness');

-- 2. Move cardio items under 'fitness-cardio' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'fitness-cardio')
WHERE slug IN (
  'cardio-equipment', 'ellipticals', 'exercise-bikes', 'fit-bike',
  'fit-treadmill', 'fitness-bikes', 'fitness-ellipticals', 
  'fitness-treadmills', 'rowing-machines', 'treadmills', 'jump-ropes'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'fitness');

-- 3. Move yoga/pilates items under 'yoga-pilates' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'yoga-pilates')
WHERE slug IN (
  'exercise-mats', 'fit-yoga', 'fitness-yoga', 'foam-rollers',
  'yoga-mats', 'yoga-props'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'fitness');

-- 4. Move strength items under 'strength-training' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'strength-training')
WHERE slug IN (
  'fit-bands', 'fitness-strength', 'gym-machines', 'home-gym',
  'pull-up-bars', 'resistance-bands', 'strength-equipment', 'weight-benches'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'fitness');

-- Keep as L2: boxing-equipment, fit-trackers, fitness-accessories
;
