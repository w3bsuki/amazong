
-- Fix antiques and lighting hierarchies
DO $$
DECLARE
  v_antiques UUID;
  v_lighting UUID;
BEGIN
  SELECT id INTO v_antiques FROM categories WHERE slug = 'antiques';
  SELECT id INTO v_lighting FROM categories WHERE slug = 'lighting';
  
  -- === FIX ANTIQUES (40 L2s) ===
  -- Has 3 naming patterns: antique-*, antiques-*, vintage-*
  -- Keep antiques-* as primary, delete duplicates
  DELETE FROM categories WHERE slug IN (
    -- Art: keep antiques-art
    'antique-art', 'vintage-art',
    -- Books: keep antiques-books
    'antique-books', 'vintage-books',
    -- Clocks: keep antiques-clocks
    'antique-clocks', 'vintage-clocks', 'antiques-clocks-grandfather', 'antiques-clocks-wall',
    -- Furniture: keep antiques-furniture
    'antique-furniture', 'vintage-furniture', 'antiques-cabinets', 'antiques-chairs', 'antiques-tables',
    -- Jewelry: keep antiques-jewelry
    'antique-jewelry', 'vintage-jewelry', 'antiques-jewelry-artdeco', 'antiques-jewelry-victorian',
    -- Porcelain/pottery: keep antiques-porcelain
    'antique-porcelain', 'antique-pottery', 'vintage-pottery', 'antiques-china',
    -- Silver: keep antiques-silverware
    'antique-silver', 'antique-silverware',
    -- Maps: keep antique-maps (unique)
    -- Paintings: keep antique-paintings (unique, different from antiques-art)
    -- Delete misc
    'antiques-figurines', 'antiques-rugs', 'antiques-textiles'
  ) AND parent_id = v_antiques
  AND NOT EXISTS (SELECT 1 FROM categories c2 WHERE c2.parent_id = categories.id);
  
  -- === FIX LIGHTING (39 L2s) ===
  -- Has multiple naming patterns: light-*, lighting-*, and short names
  DELETE FROM categories WHERE slug IN (
    -- Ceiling: keep ceiling-lights
    'light-ceiling', 'lighting-ceiling', 'lighting-flush-mounts',
    -- Chandeliers: keep chandeliers
    'lighting-chandeliers',
    -- Floor: keep floor-lamps
    'light-table-floor', 'lighting-floor', 'lighting-floor-lamps', 'lighting-floor-lamps-arc', 'lighting-torchiere',
    -- Table: keep table-lamps
    'lighting-table', 'lighting-table-lamps', 'lighting-bedside-lamps', 'lighting-desk-lamps',
    -- Wall: keep wall-lights
    'light-wall', 'lighting-wall', 'lighting-wall-sconces', 'wall-sconces',
    -- Outdoor: keep light-outdoor
    'lighting-outdoor', 'lighting-path-lights', 'lighting-solar',
    -- Smart: keep light-smart
    'lighting-smart', 'lighting-smart-bulbs',
    -- LED: keep led-bulbs
    'light-bulbs', 'lighting-bulbs', 'lighting-led', 'lighting-led-bulbs', 'lighting-led-strips',
    -- String: keep string-lights
    'lighting-string-lights',
    -- Night: keep lighting-night (unique)
    -- Pendant: keep lighting-pendant (unique)
    -- Delete excess
    'lighting-night'
  ) AND parent_id = v_lighting
  AND NOT EXISTS (SELECT 1 FROM categories c2 WHERE c2.parent_id = categories.id);
  
  RAISE NOTICE 'Antiques and lighting hierarchies fixed';
END $$;
;
