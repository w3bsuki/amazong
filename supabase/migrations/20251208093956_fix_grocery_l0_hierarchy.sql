
-- Fix grocery L0 hierarchy: consolidate 21 L1s to ~13
DO $$
DECLARE
  v_grocery_id UUID;
  v_grocery_drinks UUID;
  v_grocery_snacks UUID;
  v_grocery_organic UUID;
  v_grocery_pantry UUID;
BEGIN
  SELECT id INTO v_grocery_id FROM categories WHERE slug = 'grocery';
  SELECT id INTO v_grocery_drinks FROM categories WHERE slug = 'grocery-drinks';
  SELECT id INTO v_grocery_snacks FROM categories WHERE slug = 'grocery-snacks';
  SELECT id INTO v_grocery_organic FROM categories WHERE slug = 'grocery-organic';
  SELECT id INTO v_grocery_pantry FROM categories WHERE slug = 'grocery-pantry';
  
  -- 1. Move beverages under grocery-drinks
  UPDATE categories SET parent_id = v_grocery_drinks
  WHERE slug = 'beverages' AND parent_id = v_grocery_id;
  
  -- 2. Move snacks under grocery-snacks
  UPDATE categories SET parent_id = v_grocery_snacks
  WHERE slug = 'snacks' AND parent_id = v_grocery_id;
  
  -- 3. Move organic-foods under grocery-organic
  UPDATE categories SET parent_id = v_grocery_organic
  WHERE slug = 'organic-foods' AND parent_id = v_grocery_id;
  
  -- 4. Move pantry items under grocery-pantry
  UPDATE categories SET parent_id = v_grocery_pantry
  WHERE slug IN ('baking-supplies', 'breakfast-foods', 'canned-goods', 'condiments', 'pasta-rice') 
    AND parent_id = v_grocery_id;
  
  RAISE NOTICE 'Grocery L0 hierarchy fixed';
END $$;
;
