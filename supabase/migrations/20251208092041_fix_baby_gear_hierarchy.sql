
-- Fix baby-gear hierarchy (L1 under baby-kids)
-- Problem: 54 direct children when it should have ~5-10 L2 categories
-- Solution: Move L3-type categories under their proper L2 parents

-- First, get the IDs we need
DO $$
DECLARE
  v_baby_gear_id UUID := '199c6ea7-63f6-44d7-998a-ec9455e24cf8';  -- baby-gear L1
  v_baby_strollers_id UUID := 'e4594e0f-103f-46ea-bc23-3a59bd14cd89';  -- proper L2 with children
  v_baby_car_seats_id UUID := 'e2ff28d7-d8dc-457e-8057-f648b46eb1ea';  -- proper L2 with children
  v_baby_carriers_id UUID;
  v_baby_monitors_id UUID;
  v_baby_high_chairs_id UUID;
  v_baby_swings_id UUID;
  v_baby_cribs_id UUID;
BEGIN
  -- Get or create proper L2 categories (using existing ones that have proper naming)
  SELECT id INTO v_baby_carriers_id FROM categories WHERE slug = 'baby-carriers' AND parent_id = v_baby_gear_id;
  SELECT id INTO v_baby_monitors_id FROM categories WHERE slug = 'baby-monitors' AND parent_id = v_baby_gear_id;
  SELECT id INTO v_baby_high_chairs_id FROM categories WHERE slug = 'baby-high-chairs' AND parent_id = v_baby_gear_id;
  SELECT id INTO v_baby_swings_id FROM categories WHERE slug = 'baby-swings' AND parent_id = v_baby_gear_id;
  SELECT id INTO v_baby_cribs_id FROM categories WHERE slug = 'baby-cribs' AND parent_id = v_baby_gear_id;

  -- 1. STROLLERS: Move stroller-type categories under baby-strollers
  UPDATE categories 
  SET parent_id = v_baby_strollers_id
  WHERE parent_id = v_baby_gear_id
    AND slug IN (
      'standard-strollers', 'jogging-strollers', 'double-strollers', 'umbrella-strollers',
      'strollers',  -- Generic stroller category
      'gear-strollers', 'babygear-strollers'  -- Duplicates
    );

  -- 2. CAR SEATS: Move car seat types under baby-car-seats
  UPDATE categories 
  SET parent_id = v_baby_car_seats_id
  WHERE parent_id = v_baby_gear_id
    AND slug IN (
      'booster-seats', 'convertible-car-seats', 'infant-car-seats',
      'car-seats',  -- Generic
      'gear-carseats', 'babygear-carseats'  -- Duplicates
    );

  -- 3. CARRIERS: Move carrier types under baby-carriers (if exists)
  IF v_baby_carriers_id IS NOT NULL THEN
    UPDATE categories 
    SET parent_id = v_baby_carriers_id
    WHERE parent_id = v_baby_gear_id
      AND slug IN (
        'baby-wraps', 'baby-carriers-gear', 'baby-carriers-soft', 'baby-carriers-structured',
        'gear-carriers', 'babygear-carriers'
      );
  END IF;

  -- 4. HIGH CHAIRS: Move high chair types under baby-high-chairs (if exists)
  IF v_baby_high_chairs_id IS NOT NULL THEN
    UPDATE categories 
    SET parent_id = v_baby_high_chairs_id
    WHERE parent_id = v_baby_gear_id
      AND slug IN (
        'high-chairs', 'baby-high-chairs-portable',
        'gear-highchairs', 'babygear-highchairs'
      );
  END IF;

  -- 5. MONITORS: Move monitor types under baby-monitors (if exists)
  IF v_baby_monitors_id IS NOT NULL THEN
    UPDATE categories 
    SET parent_id = v_baby_monitors_id
    WHERE parent_id = v_baby_gear_id
      AND slug IN (
        'baby-monitors-video',
        'babygear-monitors'
      );
  END IF;

  -- 6. SWINGS/BOUNCERS: Group these under baby-swings
  IF v_baby_swings_id IS NOT NULL THEN
    UPDATE categories 
    SET parent_id = v_baby_swings_id
    WHERE parent_id = v_baby_gear_id
      AND slug IN (
        'bouncers', 'baby-bouncers',
        'gear-bouncers', 'babygear-swings'
      );
  END IF;

  -- 7. CRIBS: Move crib types under baby-cribs
  IF v_baby_cribs_id IS NOT NULL THEN
    UPDATE categories 
    SET parent_id = v_baby_cribs_id
    WHERE parent_id = v_baby_gear_id
      AND slug IN (
        'baby-bassinets', 'baby-cribs-portable', 'cribs-bassinets',
        'gear-cribs'
      );
  END IF;

  -- 8. Delete orphan duplicates that have no meaningful content 
  -- (categories with null name_bg that are just duplicates)
  DELETE FROM categories 
  WHERE parent_id IN (v_baby_strollers_id, v_baby_car_seats_id, v_baby_carriers_id, v_baby_monitors_id, v_baby_high_chairs_id, v_baby_swings_id, v_baby_cribs_id)
    AND name_bg IS NULL
    AND NOT EXISTS (SELECT 1 FROM categories child WHERE child.parent_id = categories.id);

END $$;

-- Verify the result
SELECT 'baby-gear L2 count:' as info, COUNT(*) as count
FROM categories 
WHERE parent_id = '199c6ea7-63f6-44d7-998a-ec9455e24cf8';
;
