
-- Add basic attributes for L0 categories that have 0 attributes
DO $$
DECLARE
  v_emobility_id UUID;
  v_tools_home_id UUID;
  v_jobs_id UUID;
  v_hobbies_id UUID;
BEGIN
  SELECT id INTO v_emobility_id FROM categories WHERE slug = 'e-mobility';
  SELECT id INTO v_tools_home_id FROM categories WHERE slug = 'tools-home';
  SELECT id INTO v_jobs_id FROM categories WHERE slug = 'jobs';
  SELECT id INTO v_hobbies_id FROM categories WHERE slug = 'hobbies';
  
  -- E-MOBILITY attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, sort_order) VALUES
  (v_emobility_id, 'brand', 'Марка', 'text', true, true, 1),
  (v_emobility_id, 'model', 'Модел', 'text', true, true, 2),
  (v_emobility_id, 'condition', 'Състояние', 'select', true, true, 3),
  (v_emobility_id, 'max_speed', 'Макс. скорост (км/ч)', 'number', false, true, 4),
  (v_emobility_id, 'range', 'Пробег (км)', 'number', false, true, 5),
  (v_emobility_id, 'battery_capacity', 'Капацитет на батерията (Wh)', 'number', false, true, 6),
  (v_emobility_id, 'motor_power', 'Мощност на мотора (W)', 'number', false, true, 7),
  (v_emobility_id, 'weight', 'Тегло (кг)', 'number', false, true, 8);
  
  -- TOOLS-HOME attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, sort_order) VALUES
  (v_tools_home_id, 'brand', 'Марка', 'text', true, true, 1),
  (v_tools_home_id, 'model', 'Модел', 'text', false, false, 2),
  (v_tools_home_id, 'condition', 'Състояние', 'select', true, true, 3),
  (v_tools_home_id, 'power_type', 'Тип захранване', 'select', false, true, 4),
  (v_tools_home_id, 'voltage', 'Напрежение (V)', 'number', false, true, 5),
  (v_tools_home_id, 'wattage', 'Мощност (W)', 'number', false, true, 6);
  
  -- JOBS attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, sort_order) VALUES
  (v_jobs_id, 'job_type', 'Тип работа', 'select', true, true, 1),
  (v_jobs_id, 'experience_level', 'Ниво на опит', 'select', true, true, 2),
  (v_jobs_id, 'salary_range', 'Заплата', 'text', false, true, 3),
  (v_jobs_id, 'location', 'Локация', 'text', true, true, 4),
  (v_jobs_id, 'remote', 'Дистанционна работа', 'boolean', false, true, 5),
  (v_jobs_id, 'company', 'Компания', 'text', false, false, 6);
  
  -- HOBBIES attributes
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, sort_order) VALUES
  (v_hobbies_id, 'condition', 'Състояние', 'select', true, true, 1),
  (v_hobbies_id, 'brand', 'Марка', 'text', false, true, 2),
  (v_hobbies_id, 'skill_level', 'Ниво на умения', 'select', false, true, 3),
  (v_hobbies_id, 'age_group', 'Възрастова група', 'select', false, true, 4);
  
  RAISE NOTICE 'Basic attributes added for missing L0 categories';
END $$;
;
