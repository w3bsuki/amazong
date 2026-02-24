
-- Add more attributes for bulgarian-traditional
DO $$
DECLARE
  v_bg_trad_id UUID;
BEGIN
  SELECT id INTO v_bg_trad_id FROM categories WHERE slug = 'bulgarian-traditional';
  
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, sort_order) VALUES
  (v_bg_trad_id, 'region', 'Регион', 'select', false, true, 2),
  (v_bg_trad_id, 'material', 'Материал', 'text', false, true, 3),
  (v_bg_trad_id, 'handmade', 'Ръчна изработка', 'boolean', false, true, 4),
  (v_bg_trad_id, 'age', 'Възраст/Период', 'text', false, true, 5),
  (v_bg_trad_id, 'authenticity', 'Автентичност', 'select', false, true, 6);
  
  RAISE NOTICE 'Bulgarian-traditional attributes added';
END $$;
;
