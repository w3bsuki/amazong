
-- Fix tools-home L0 hierarchy: move empty L1s
DO $$
DECLARE
  v_tools_home_id UUID;
  v_test_measurement UUID;
  v_tool_storage UUID;
BEGIN
  SELECT id INTO v_tools_home_id FROM categories WHERE slug = 'tools-home';
  SELECT id INTO v_test_measurement FROM categories WHERE slug = 'test-measurement-equipment';
  SELECT id INTO v_tool_storage FROM categories WHERE slug = 'tool-storage';
  
  -- Move measuring-tools under test-measurement-equipment
  UPDATE categories SET parent_id = v_test_measurement
  WHERE slug = 'measuring-tools' AND parent_id = v_tools_home_id;
  
  -- Move workshop-equipment under tool-storage
  UPDATE categories SET parent_id = v_tool_storage
  WHERE slug = 'workshop-equipment' AND parent_id = v_tools_home_id;
  
  RAISE NOTICE 'Tools-home L0 hierarchy fixed';
END $$;
;
