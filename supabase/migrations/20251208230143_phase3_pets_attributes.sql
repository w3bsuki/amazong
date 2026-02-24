
-- Phase 3.3: Pets Attributes for L1 categories

-- Pet Type attribute to all L1 categories
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Pet Type',
  'Вид домашен любимец',
  'select',
  false,
  true,
  '["Dog", "Cat", "Bird", "Fish", "Reptile", "Small Animal", "Horse", "Other"]'::jsonb,
  '["Куче", "Котка", "Птица", "Риба", "Влечуго", "Малко животно", "Кон", "Друго"]'::jsonb,
  1
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'pets')
ON CONFLICT DO NOTHING;

-- Pet Size attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Pet Size',
  'Размер',
  'select',
  false,
  true,
  '["Extra Small", "Small", "Medium", "Large", "Extra Large", "All Sizes"]'::jsonb,
  '["Много малък", "Малък", "Среден", "Голям", "Много голям", "Всички размери"]'::jsonb,
  2
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'pets')
ON CONFLICT DO NOTHING;

-- Life Stage attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Life Stage',
  'Възраст',
  'select',
  false,
  true,
  '["Puppy/Kitten", "Junior", "Adult", "Senior", "All Life Stages"]'::jsonb,
  '["Малко", "Младо", "Възрастно", "Старо", "Всички възрасти"]'::jsonb,
  3
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'pets')
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
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'pets')
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
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'pets')
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
  '["Plastic", "Metal", "Wood", "Fabric", "Rubber", "Glass", "Ceramic", "Silicone", "Natural", "Synthetic", "Other"]'::jsonb,
  '["Пластмаса", "Метал", "Дърво", "Плат", "Гума", "Стъкло", "Керамика", "Силикон", "Естествен", "Синтетичен", "Друго"]'::jsonb,
  6
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'pets')
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
  '["Black", "White", "Brown", "Beige", "Gray", "Blue", "Red", "Green", "Pink", "Multi-Color"]'::jsonb,
  '["Черен", "Бял", "Кафяв", "Бежов", "Сив", "Син", "Червен", "Зелен", "Розов", "Многоцветен"]'::jsonb,
  7
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'pets')
ON CONFLICT DO NOTHING;
;
