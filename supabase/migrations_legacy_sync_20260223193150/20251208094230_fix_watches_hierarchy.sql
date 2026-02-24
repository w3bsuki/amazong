
-- Fix watches hierarchy: delete duplicates, keep ~15 distinct types
DO $$
DECLARE
  v_watches UUID;
BEGIN
  SELECT id INTO v_watches FROM categories WHERE slug = 'watches';
  
  -- Sports: keep watches-sport, delete 4 duplicates
  DELETE FROM categories WHERE slug IN (
    'sport-watches', 'sports-watches', 'watch-sports', 'watches-mens-sport'
  ) AND parent_id = v_watches;
  
  -- Smart: keep watches-smartwatches, delete 3 duplicates
  DELETE FROM categories WHERE slug IN (
    'smart-watches-jewelry', 'watch-smart', 'watches-smart-cat'
  ) AND parent_id = v_watches;
  
  -- Luxury: keep watches-luxury, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('luxury-watches', 'watch-luxury') 
    AND parent_id = v_watches;
  
  -- Dive: keep watches-dive, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('dive-watches', 'watches-mens-dive') 
    AND parent_id = v_watches;
  
  -- Dress: keep watches-dress, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('dress-watches', 'watches-mens-dress') 
    AND parent_id = v_watches;
  
  -- Accessories: keep watch-accessories, delete 5 duplicates
  DELETE FROM categories WHERE slug IN (
    'watch-bands', 'watches-accessories-cat', 'watches-bands', 
    'watches-bands-leather', 'watches-bands-metal', 'watches-straps-cat'
  ) AND parent_id = v_watches;
  
  -- Chronograph: keep watches-chronograph, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('chronograph-watches', 'watches-mens-chronograph') 
    AND parent_id = v_watches;
  
  -- Digital: keep watches-digital, delete duplicate
  DELETE FROM categories WHERE slug = 'digital-watches' AND parent_id = v_watches;
  
  -- Automatic: keep watches-automatic, delete duplicate
  DELETE FROM categories WHERE slug = 'automatic-watches' AND parent_id = v_watches;
  
  -- Pocket: keep watches-pocket, delete duplicate
  DELETE FROM categories WHERE slug = 'pocket-watches' AND parent_id = v_watches;
  
  -- Quartz: keep watches-quartz, delete duplicate
  DELETE FROM categories WHERE slug = 'quartz-watches' AND parent_id = v_watches;
  
  -- Vintage: keep watches-vintage-cat, delete duplicate
  DELETE FROM categories WHERE slug = 'watch-vintage' AND parent_id = v_watches;
  
  -- Casual: keep watch-casual, delete duplicate
  DELETE FROM categories WHERE slug = 'casual-watches' AND parent_id = v_watches;
  
  -- Analog: keep analog-watches (unique)
  
  -- Delete gender-specific duplicates that overlap with type
  DELETE FROM categories WHERE slug IN (
    'watches-fashion', 'watches-womens-fashion'
  ) AND parent_id = v_watches;
  
  RAISE NOTICE 'Watches hierarchy fixed';
END $$;
;
