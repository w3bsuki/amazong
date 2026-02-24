
-- Fix sports hierarchy for major L1 categories
-- water-sports (70 children), team-sports (62), cycling (59), winter-sports (55)

DO $$
DECLARE
  v_sports_id UUID;
  v_water_sports_id UUID;
  v_team_sports_id UUID;
  v_cycling_id UUID;
  v_winter_sports_id UUID;
  v_diving_id UUID;
  v_swimming_id UUID;
  v_kayaking_id UUID;
  v_basketball_id UUID;
  v_road_bikes_id UUID;
  v_mountain_bikes_id UUID;
BEGIN
  SELECT id INTO v_sports_id FROM categories WHERE slug = 'sports';
  
  -- Get L1 IDs
  SELECT id INTO v_water_sports_id FROM categories WHERE slug = 'water-sports' AND parent_id = v_sports_id;
  SELECT id INTO v_team_sports_id FROM categories WHERE slug = 'team-sports' AND parent_id = v_sports_id;
  SELECT id INTO v_cycling_id FROM categories WHERE slug = 'cycling' AND parent_id = v_sports_id;
  SELECT id INTO v_winter_sports_id FROM categories WHERE slug = 'winter-sports' AND parent_id = v_sports_id;

  -- Get L2 IDs for water-sports
  SELECT id INTO v_diving_id FROM categories WHERE slug = 'diving' AND parent_id = v_water_sports_id;
  SELECT id INTO v_swimming_id FROM categories WHERE slug = 'swimming' AND parent_id = v_water_sports_id;
  SELECT id INTO v_kayaking_id FROM categories WHERE slug = 'kayaking' AND parent_id = v_water_sports_id;

  -- WATER SPORTS FIXES
  IF v_diving_id IS NOT NULL THEN
    UPDATE categories SET parent_id = v_diving_id
    WHERE parent_id = v_water_sports_id
      AND slug IN ('diving-accessories', 'diving-equipment', 'diving-fins', 'diving-masks', 'diving-snorkeling',
                   'diving-suits', 'diving-wetsuits', 'snorkeling', 'snorkeling-gear', 'snorkeling-masks');
  END IF;

  IF v_swimming_id IS NOT NULL THEN
    UPDATE categories SET parent_id = v_swimming_id
    WHERE parent_id = v_water_sports_id
      AND slug IN ('swim-accessories', 'swim-caps', 'swim-goggles', 'swimming-goggles', 'swimwear', 
                   'pool-accessories', 'training-aids-swimming', 'competitive-swimwear');
  END IF;

  IF v_kayaking_id IS NOT NULL THEN
    UPDATE categories SET parent_id = v_kayaking_id
    WHERE parent_id = v_water_sports_id
      AND slug IN ('kayaking-accessories', 'kayak-accessories', 'canoes', 'kayaks', 
                   'kayaking-canoeing', 'paddleboarding', 'stand-up-paddling', 'sup-boards');
  END IF;

  -- TEAM SPORTS FIXES
  SELECT id INTO v_basketball_id FROM categories WHERE slug IN ('team-basketball', 'basketball') AND parent_id = v_team_sports_id LIMIT 1;
  
  IF v_basketball_id IS NOT NULL THEN
    UPDATE categories SET parent_id = v_basketball_id
    WHERE parent_id = v_team_sports_id
      AND slug IN ('basketball-balls', 'basketball-hoops', 'basketball-shoes', 'basketball-accessories');
  END IF;

  -- Similar fixes for other team sports can be added

  -- CYCLING FIXES
  SELECT id INTO v_road_bikes_id FROM categories WHERE slug = 'road-bikes' AND parent_id = v_cycling_id;
  SELECT id INTO v_mountain_bikes_id FROM categories WHERE slug = 'mountain-bikes' AND parent_id = v_cycling_id;

  IF v_road_bikes_id IS NOT NULL THEN
    UPDATE categories SET parent_id = v_road_bikes_id
    WHERE parent_id = v_cycling_id
      AND slug IN ('road-bike-frames', 'road-bike-wheels', 'gravel-bikes', 'triathlon-bikes');
  END IF;

  IF v_mountain_bikes_id IS NOT NULL THEN
    UPDATE categories SET parent_id = v_mountain_bikes_id
    WHERE parent_id = v_cycling_id
      AND slug IN ('mtb-frames', 'mtb-wheels', 'full-suspension', 'hardtail', 'downhill-bikes', 'cross-country-bikes');
  END IF;

END $$;

-- Verify counts
SELECT l.slug, COUNT(c.id) as l2_count
FROM categories l
JOIN categories c ON c.parent_id = l.id
WHERE l.slug IN ('water-sports', 'team-sports', 'cycling', 'winter-sports')
GROUP BY l.slug
ORDER BY l2_count DESC;
;
