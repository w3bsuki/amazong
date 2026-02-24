
-- Fix e-mobility L0 hierarchy: consolidate 23 L1s to ~9
DO $$
DECLARE
  v_emobility_id UUID;
  v_emob_ebikes UUID;
  v_emob_escooters UUID;
  v_emob_accessories UUID;
  v_emob_parts UUID;
  v_emob_charging UUID;
BEGIN
  SELECT id INTO v_emobility_id FROM categories WHERE slug = 'e-mobility';
  SELECT id INTO v_emob_ebikes FROM categories WHERE slug = 'emob-ebikes';
  SELECT id INTO v_emob_escooters FROM categories WHERE slug = 'emob-escooters';
  SELECT id INTO v_emob_accessories FROM categories WHERE slug = 'emob-accessories';
  SELECT id INTO v_emob_parts FROM categories WHERE slug = 'emob-parts';
  SELECT id INTO v_emob_charging FROM categories WHERE slug = 'emob-charging';
  
  -- 1. Move e-bike types under emob-ebikes
  UPDATE categories SET parent_id = v_emob_ebikes
  WHERE slug IN ('cargo-ebikes', 'city-ebikes', 'folding-ebikes', 'mountain-ebikes', 'road-ebikes') 
    AND parent_id = v_emobility_id;
  
  -- 2. Move ebike-parts under emob-parts
  UPDATE categories SET parent_id = v_emob_parts
  WHERE slug = 'ebike-parts' AND parent_id = v_emobility_id;
  
  -- 3. Move e-scooter types under emob-escooters
  UPDATE categories SET parent_id = v_emob_escooters
  WHERE slug IN ('commuter-scooters', 'kids-electric-scooters', 'offroad-scooters', 'seated-scooters') 
    AND parent_id = v_emobility_id;
  
  -- 4. Move emobility-accessories under emob-accessories
  UPDATE categories SET parent_id = v_emob_accessories
  WHERE slug = 'emobility-accessories' AND parent_id = v_emobility_id;
  
  -- 5. Move charging items under emob-charging
  UPDATE categories SET parent_id = v_emob_charging
  WHERE slug IN ('emobility-batteries', 'emobility-chargers', 'emobility-motors') 
    AND parent_id = v_emobility_id;
  
  RAISE NOTICE 'E-mobility L0 hierarchy fixed';
END $$;
;
