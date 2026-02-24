
-- Phase 3.2: Sports Attributes for L1 categories
-- Using correct column name: "name" instead of "attribute_name"

-- Sport Type attribute to all L1 categories
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Sport Type',
  'Вид спорт',
  'select',
  false,
  true,
  '["Team Sports", "Individual Sports", "Water Sports", "Winter Sports", "Combat Sports", "Racket Sports", "Cycling", "Fitness", "Outdoor", "Equestrian", "Golf", "Running", "Swimming", "Yoga", "Hunting", "Fishing", "Shooting", "Other"]'::jsonb,
  '["Отборни спортове", "Индивидуални", "Водни спортове", "Зимни спортове", "Бойни изкуства", "Ракетни спортове", "Колоездене", "Фитнес", "Аутдор", "Конен спорт", "Голф", "Бягане", "Плуване", "Йога", "Лов", "Риболов", "Стрелба", "Друго"]'::jsonb,
  1
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'sports')
ON CONFLICT DO NOTHING;

-- Skill Level attribute
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id,
  'Skill Level',
  'Ниво',
  'select',
  false,
  true,
  '["Beginner", "Intermediate", "Advanced", "Professional", "All Levels"]'::jsonb,
  '["Начинаещ", "Среден", "Напреднал", "Професионален", "Всички нива"]'::jsonb,
  2
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'sports')
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
  '["Men", "Women", "Unisex", "Boys", "Girls", "Kids"]'::jsonb,
  '["Мъже", "Жени", "Унисекс", "Момчета", "Момичета", "Деца"]'::jsonb,
  3
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'sports')
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
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'sports')
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
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'sports')
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
  '["Carbon Fiber", "Aluminum", "Steel", "Titanium", "Composite", "Plastic", "Wood", "Rubber", "Neoprene", "Leather", "Synthetic", "Cotton", "Polyester", "Nylon", "Other"]'::jsonb,
  '["Карбон", "Алуминий", "Стомана", "Титан", "Композит", "Пластмаса", "Дърво", "Гума", "Неопрен", "Кожа", "Синтетика", "Памук", "Полиестер", "Найлон", "Друго"]'::jsonb,
  6
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'sports')
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
  '["Black", "White", "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Gray", "Brown", "Multi-Color"]'::jsonb,
  '["Черен", "Бял", "Червен", "Син", "Зелен", "Жълт", "Оранжев", "Лилав", "Розов", "Сив", "Кафяв", "Многоцветен"]'::jsonb,
  7
FROM categories c
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'sports')
ON CONFLICT DO NOTHING;
;
