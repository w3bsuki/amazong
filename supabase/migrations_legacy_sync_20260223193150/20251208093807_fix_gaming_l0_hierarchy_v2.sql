
-- Fix gaming L0 hierarchy: consolidate 32 L1s to ~11
DO $$
DECLARE
  v_gaming_id UUID;
  v_pc_gaming_main UUID;
  v_console_gaming UUID;
  v_vr_ar_gaming UUID;
  v_retro_gaming UUID;
  v_gaming_accessories UUID;
BEGIN
  SELECT id INTO v_gaming_id FROM categories WHERE slug = 'gaming';
  SELECT id INTO v_pc_gaming_main FROM categories WHERE slug = 'pc-gaming-main';
  SELECT id INTO v_console_gaming FROM categories WHERE slug = 'console-gaming';
  SELECT id INTO v_vr_ar_gaming FROM categories WHERE slug = 'vr-ar-gaming';
  SELECT id INTO v_retro_gaming FROM categories WHERE slug = 'retro-gaming';
  SELECT id INTO v_gaming_accessories FROM categories WHERE slug = 'gaming-accessories';
  
  -- 1. Move PC gaming items under pc-gaming-main as L2s
  UPDATE categories SET parent_id = v_pc_gaming_main
  WHERE slug IN ('gaming-pc', 'gaming-pcs', 'gaming-pc-games') AND parent_id = v_gaming_id;
  
  -- Delete empty pc-gaming duplicate
  DELETE FROM categories WHERE slug = 'pc-gaming' AND parent_id = v_gaming_id;
  
  -- 2. Move PlayStation/Xbox/Nintendo items under console-gaming as L2s
  UPDATE categories SET parent_id = v_console_gaming
  WHERE slug IN (
    'playstation', 'gaming-playstation', 'gaming-ps4-games', 'gaming-ps5-games', 'gaming-ps5-accessories',
    'xbox', 'gaming-xbox', 'gaming-xbox-accessories', 'gaming-xbox-series-games',
    'nintendo', 'gaming-nintendo', 'gaming-switch-accessories', 'gaming-switch-games'
  ) AND parent_id = v_gaming_id;
  
  -- 3. Move VR items under vr-ar-gaming as L2s
  UPDATE categories SET parent_id = v_vr_ar_gaming
  WHERE slug IN ('vr-gaming', 'gaming-vr', 'gaming-vr-headsets') AND parent_id = v_gaming_id;
  
  -- 4. Move retro duplicate under retro-gaming
  UPDATE categories SET parent_id = v_retro_gaming
  WHERE slug = 'gaming-retro' AND parent_id = v_gaming_id;
  
  -- 5. Merge gaming-accessories-main children into gaming-accessories and delete
  UPDATE categories SET parent_id = v_gaming_accessories
  WHERE parent_id = (SELECT id FROM categories WHERE slug = 'gaming-accessories-main');
  DELETE FROM categories WHERE slug = 'gaming-accessories-main';
  
  RAISE NOTICE 'Gaming L0 hierarchy fixed';
END $$;
;
