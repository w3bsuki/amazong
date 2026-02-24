
-- Fix real-estate L0 hierarchy: consolidate 18 L1s to ~12
DO $$
DECLARE
  v_real_estate_id UUID;
  v_commercial UUID;
  v_residential_sales UUID;
  v_residential_rentals UUID;
  v_land UUID;
  v_parking_storage UUID;
BEGIN
  SELECT id INTO v_real_estate_id FROM categories WHERE slug = 'real-estate';
  SELECT id INTO v_commercial FROM categories WHERE slug = 'commercial';
  SELECT id INTO v_residential_sales FROM categories WHERE slug = 'residential-sales';
  SELECT id INTO v_residential_rentals FROM categories WHERE slug = 'residential-rentals';
  SELECT id INTO v_land FROM categories WHERE slug = 'land';
  SELECT id INTO v_parking_storage FROM categories WHERE slug = 'parking-storage';
  
  -- 1. Move commercial duplicates under commercial
  UPDATE categories SET parent_id = v_commercial
  WHERE slug IN ('commercial-rentals', 'commercial-rent', 'commercial-sale') 
    AND parent_id = v_real_estate_id;
  
  -- 2. Move apartments-sale under residential-sales
  UPDATE categories SET parent_id = v_residential_sales
  WHERE slug = 'apartments-sale' AND parent_id = v_real_estate_id;
  
  -- 3. Move apartments-rent under residential-rentals
  UPDATE categories SET parent_id = v_residential_rentals
  WHERE slug = 'apartments-rent' AND parent_id = v_real_estate_id;
  
  -- 4. Move land-sale under land
  UPDATE categories SET parent_id = v_land
  WHERE slug = 'land-sale' AND parent_id = v_real_estate_id;
  
  -- 5. Move garages-rent under parking-storage
  UPDATE categories SET parent_id = v_parking_storage
  WHERE slug = 'garages-rent' AND parent_id = v_real_estate_id;
  
  RAISE NOTICE 'Real-estate L0 hierarchy fixed';
END $$;
;
