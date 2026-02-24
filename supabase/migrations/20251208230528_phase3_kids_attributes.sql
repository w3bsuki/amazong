
-- Phase 3.4: Kids Attributes for L1 categories

-- Age Range attribute to all L1 categories
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Age Range',
  'Възрастова група',
  'select',
  false,
  true,
  '["0-3 months", "3-6 months", "6-12 months", "12-24 months", "2-3 years", "3-5 years", "5-7 years", "7-10 years", "10-12 years", "12+ years"]'::jsonb,
  '["0-3 месеца", "3-6 месеца", "6-12 месеца", "12-24 месеца", "2-3 години", "3-5 години", "5-7 години", "7-10 години", "10-12 години", "12+ години"]'::jsonb,
  1
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'baby-kids')
ON CONFLICT DO NOTHING;

-- Gender attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Gender',
  'Пол',
  'select',
  false,
  true,
  '["Boys", "Girls", "Unisex"]'::jsonb,
  '["Момчета", "Момичета", "Унисекс"]'::jsonb,
  2
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'baby-kids')
ON CONFLICT DO NOTHING;

-- Size attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Size',
  'Размер',
  'select',
  false,
  true,
  '["Newborn", "0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M", "2T", "3T", "4T", "5", "6", "7", "8", "10", "12", "14", "One Size"]'::jsonb,
  '["Новородено", "0-3М", "3-6М", "6-9М", "9-12М", "12-18М", "18-24М", "2T", "3T", "4T", "5", "6", "7", "8", "10", "12", "14", "Един размер"]'::jsonb,
  3
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'baby-kids')
ON CONFLICT DO NOTHING;

-- Condition attribute (required)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Condition',
  'Състояние',
  'select',
  true,
  true,
  '["New", "Like New", "Good", "Fair", "For Parts"]'::jsonb,
  '["Ново", "Като ново", "Добро", "Задоволително", "За части"]'::jsonb,
  4
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'baby-kids')
ON CONFLICT DO NOTHING;

-- Brand attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, sort_order)
SELECT 
  c.id,
  'Brand',
  'Марка',
  'text',
  false,
  true,
  NULL,
  5
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'baby-kids')
ON CONFLICT DO NOTHING;

-- Material attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Material',
  'Материал',
  'select',
  false,
  true,
  '["Cotton", "Organic Cotton", "Polyester", "Bamboo", "Wool", "Plastic", "Wood", "Metal", "Silicone", "BPA-Free", "Other"]'::jsonb,
  '["Памук", "Органичен памук", "Полиестер", "Бамбук", "Вълна", "Пластмаса", "Дърво", "Метал", "Силикон", "Без BPA", "Друго"]'::jsonb,
  6
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'baby-kids')
ON CONFLICT DO NOTHING;

-- Color attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Color',
  'Цвят',
  'select',
  false,
  true,
  '["White", "Pink", "Blue", "Yellow", "Green", "Gray", "Beige", "Red", "Purple", "Multi-Color"]'::jsonb,
  '["Бял", "Розов", "Син", "Жълт", "Зелен", "Сив", "Бежов", "Червен", "Лилав", "Многоцветен"]'::jsonb,
  7
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'baby-kids')
ON CONFLICT DO NOTHING;

-- Safety Standards attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Safety Certified',
  'Сертифицирано',
  'select',
  false,
  true,
  '["CE", "ASTM", "CPSC", "EN", "JPMA", "Not Certified"]'::jsonb,
  '["CE", "ASTM", "CPSC", "EN", "JPMA", "Без сертификат"]'::jsonb,
  8
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'baby-kids')
ON CONFLICT DO NOTHING;
;
