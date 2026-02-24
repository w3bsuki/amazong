
-- Fix baby-gear hierarchy - Part 2
-- Move remaining L3-type categories under their proper parents

DO $$
DECLARE
  v_baby_gear_id UUID := '199c6ea7-63f6-44d7-998a-ec9455e24cf8';
  v_baby_strollers_id UUID := 'e4594e0f-103f-46ea-bc23-3a59bd14cd89';
  v_baby_car_seats_id UUID := 'e2ff28d7-d8dc-457e-8057-f648b46eb1ea';
  v_baby_cribs_id UUID;
  v_baby_walkers_id UUID;
BEGIN
  SELECT id INTO v_baby_cribs_id FROM categories WHERE slug = 'baby-cribs' AND parent_id = v_baby_gear_id;
  SELECT id INTO v_baby_walkers_id FROM categories WHERE slug = 'baby-walkers' AND parent_id = v_baby_gear_id;

  -- Move stroller subtypes under baby-strollers
  UPDATE categories 
  SET parent_id = v_baby_strollers_id
  WHERE parent_id = v_baby_gear_id
    AND slug IN ('baby-strollers-double', 'baby-strollers-jogging', 'baby-strollers-travel');

  -- Move car seat subtypes under baby-car-seats  
  UPDATE categories 
  SET parent_id = v_baby_car_seats_id
  WHERE parent_id = v_baby_gear_id
    AND slug IN ('baby-car-seats-booster', 'baby-car-seats-convertible', 'baby-car-seats-infant');

  -- Move playpens/play-yards under baby-cribs (they're similar)
  IF v_baby_cribs_id IS NOT NULL THEN
    UPDATE categories 
    SET parent_id = v_baby_cribs_id
    WHERE parent_id = v_baby_gear_id
      AND slug IN ('baby-playpens', 'playpens', 'play-yards', 'gear-playyards');
  END IF;

  -- Move walkers under baby-walkers (create hierarchy)
  IF v_baby_walkers_id IS NOT NULL THEN
    UPDATE categories 
    SET parent_id = v_baby_walkers_id
    WHERE parent_id = v_baby_gear_id
      AND slug = 'gear-walkers';
  END IF;

END $$;

-- Verify
SELECT 'baby-gear L2 count after cleanup:' as info, COUNT(*) as count
FROM categories 
WHERE parent_id = '199c6ea7-63f6-44d7-998a-ec9455e24cf8';
;
