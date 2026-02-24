
-- Consolidate similar categories in pc-laptops
DO $$
DECLARE
  v_pc_laptops_id UUID;
  v_pc_storage_id UUID;
BEGIN
  SELECT id INTO v_pc_laptops_id FROM categories WHERE slug = 'pc-laptops';
  SELECT id INTO v_pc_storage_id FROM categories WHERE slug = 'pc-storage';
  
  -- Merge storage-devices children into pc-storage and delete
  UPDATE categories SET parent_id = v_pc_storage_id
  WHERE parent_id = (SELECT id FROM categories WHERE slug = 'storage-devices');
  DELETE FROM categories WHERE slug = 'storage-devices' AND parent_id = v_pc_laptops_id;
  
  -- Merge printers-scanners into pc-printers if both exist
  UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'pc-printers')
  WHERE parent_id = (SELECT id FROM categories WHERE slug = 'printers-scanners');
  DELETE FROM categories WHERE slug = 'printers-scanners' AND parent_id = v_pc_laptops_id;
  
  RAISE NOTICE 'Similar categories consolidated';
END $$;
;
