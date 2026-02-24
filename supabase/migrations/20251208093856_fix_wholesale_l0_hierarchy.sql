
-- Fix wholesale L0 hierarchy: consolidate 30 L1s to ~20
DO $$
DECLARE
  v_wholesale_id UUID;
  v_wholesale_clothing UUID;
  v_wholesale_electronics UUID;
  v_wholesale_food UUID;
  v_business_supplies UUID;
  v_wholesale_industrial UUID;
BEGIN
  SELECT id INTO v_wholesale_id FROM categories WHERE slug = 'wholesale';
  SELECT id INTO v_wholesale_clothing FROM categories WHERE slug = 'wholesale-clothing';
  SELECT id INTO v_wholesale_electronics FROM categories WHERE slug = 'wholesale-electronics';
  SELECT id INTO v_wholesale_food FROM categories WHERE slug = 'wholesale-food';
  SELECT id INTO v_business_supplies FROM categories WHERE slug = 'business-supplies';
  SELECT id INTO v_wholesale_industrial FROM categories WHERE slug = 'wholesale-industrial';
  
  -- 1. Move clothing items under wholesale-clothing
  UPDATE categories SET parent_id = v_wholesale_clothing
  WHERE slug IN ('wholesale-bulk-clothing', 'wholesale-jeans', 'wholesale-tshirts') 
    AND parent_id = v_wholesale_id;
  
  -- 2. Move electronics items under wholesale-electronics
  UPDATE categories SET parent_id = v_wholesale_electronics
  WHERE slug IN ('wholesale-bulk-electronics', 'wholesale-chargers') 
    AND parent_id = v_wholesale_id;
  
  -- 3. Move food items under wholesale-food
  UPDATE categories SET parent_id = v_wholesale_food
  WHERE slug = 'wholesale-bulk-food' AND parent_id = v_wholesale_id;
  
  -- 4. Move office under business-supplies
  UPDATE categories SET parent_id = v_business_supplies
  WHERE slug = 'wholesale-office' AND parent_id = v_wholesale_id;
  
  -- 5. Move retail/liquidation/dropshipping under wholesale-industrial
  UPDATE categories SET parent_id = v_wholesale_industrial
  WHERE slug IN ('wholesale-dropshipping', 'wholesale-liquidation', 'wholesale-retail') 
    AND parent_id = v_wholesale_id;
  
  RAISE NOTICE 'Wholesale L0 hierarchy fixed';
END $$;
;
