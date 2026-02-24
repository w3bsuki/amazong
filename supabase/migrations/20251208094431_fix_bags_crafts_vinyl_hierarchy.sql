
-- Fix bags-luggage, traditional-crafts, and vinyl-records hierarchies
DO $$
DECLARE
  v_bags_luggage UUID;
  v_traditional_crafts UUID;
  v_vinyl_records UUID;
BEGIN
  SELECT id INTO v_bags_luggage FROM categories WHERE slug = 'bags-luggage';
  SELECT id INTO v_traditional_crafts FROM categories WHERE slug = 'traditional-crafts';
  SELECT id INTO v_vinyl_records FROM categories WHERE slug = 'vinyl-records';
  
  -- === FIX BAGS-LUGGAGE (36 L2s) ===
  DELETE FROM categories WHERE slug IN (
    -- Backpacks: keep bags-backpacks
    'backpacks', 'bags-backpacks-laptop', 'bags-backpacks-travel', 'fashion-backpacks', 'laptop-bags',
    -- Handbags: keep bags-handbags
    'handbags', 'fashion-handbags',
    -- Crossbody: keep bags-crossbody
    'crossbody-bags',
    -- Clutches: keep bags-clutches
    'clutches',
    -- Wallets: keep bags-wallets
    'wallets', 'fashion-wallets', 'bags-card-holders',
    -- Totes: keep bags-tote
    'tote-bags',
    -- Travel: keep bags-travel
    'travel-bags', 'fashion-travel-bags', 'bags-weekender', 'bags-duffel',
    -- Luggage: keep bags-luggage-carry-on, bags-luggage-checked, bags-luggage-sets
    'suitcases', 'fashion-luggage',
    -- Briefcases: keep bags-briefcases
    'fashion-briefcases',
    -- Delete misc
    'bags-messenger', 'bags-satchels', 'bags-shoulder', 'fashion-belt-bags', 'fashion-pouches'
  ) AND parent_id = v_bags_luggage
  AND NOT EXISTS (SELECT 1 FROM categories c2 WHERE c2.parent_id = categories.id);
  
  -- === FIX TRADITIONAL-CRAFTS (37 L2s) ===
  DELETE FROM categories WHERE slug IN (
    -- Icons: keep bg-icons
    'bulgarian-icons', 'icon-painting',
    -- Pottery: keep bg-pottery
    'bulgarian-pottery', 'crafts-pottery', 'crafts-troyan-pottery', 'crafts-handmade-ceramics', 'traditional-pottery',
    -- Woodwork: keep bg-woodwork
    'crafts-wooden-utensils', 'crafts-woodwork', 'crafts-carved', 'wood-carving', 'woodcarving',
    -- Textiles: keep bg-textiles
    'crafts-textiles', 'crafts-rugs', 'crafts-woven-blankets', 'crafts-tablecloths', 'weaving',
    -- Embroidery: keep crafts-embroidery
    'bulgarian-embroidery', 'crafts-embroidery-traditional', 'embroidery',
    -- Instruments: keep bg-folk-instruments
    'crafts-instruments', 'crafts-gadulka', 'crafts-gaida', 'crafts-kaval',
    -- Costumes: keep crafts-costumes
    'crafts-regional-costumes', 'crafts-traditional-dresses',
    -- Metalwork: keep bg-metalwork
    'copper-work', 'filigree',
    -- Jewelry: keep crafts-jewelry (unique)
    -- Delete excess
    'crafts-jewelry'
  ) AND parent_id = v_traditional_crafts
  AND NOT EXISTS (SELECT 1 FROM categories c2 WHERE c2.parent_id = categories.id);
  
  -- === FIX VINYL-RECORDS (30 L2s) ===
  DELETE FROM categories WHERE slug IN (
    -- Colored: keep vinyl-colored
    'colored-vinyl',
    -- Limited: keep vinyl-limited
    'limited-vinyl',
    -- New: keep vinyl-new
    'new-vinyl',
    -- Used: keep vinyl-used
    'used-vinyl'
    -- Keep all genres (blues, classical, etc.) as they're distinct
  ) AND parent_id = v_vinyl_records
  AND NOT EXISTS (SELECT 1 FROM categories c2 WHERE c2.parent_id = categories.id);
  
  RAISE NOTICE 'Bags-luggage, traditional-crafts, and vinyl-records hierarchies fixed';
END $$;
;
