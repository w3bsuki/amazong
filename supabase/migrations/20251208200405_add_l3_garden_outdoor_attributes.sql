
-- Add attributes to ALL Garden & Outdoor L3 categories
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  c.id as category_id,
  a.name,
  a.name_bg,
  a.attribute_type,
  a.is_required,
  true as is_filterable,
  a.options::jsonb,
  a.options_bg::jsonb,
  a.sort_order
FROM categories c
JOIN categories p2 ON c.parent_id = p2.id
JOIN categories p1 ON p2.parent_id = p1.id
CROSS JOIN (
  VALUES 
    ('Material', 'Материал', 'select', false, '["Teak", "Aluminum", "Wicker/Rattan", "Steel", "Plastic/Resin", "Cedar", "Iron", "Recycled"]', '["Тик", "Алуминий", "Ратан/Плетено", "Стомана", "Пластмаса/Смола", "Кедър", "Желязо", "Рециклиран"]', 1),
    ('Weather Resistant', 'Устойчив на времето', 'boolean', false, '[]', '[]', 2),
    ('UV Protected', 'UV защита', 'boolean', false, '[]', '[]', 3),
    ('Color', 'Цвят', 'select', false, '["Natural/Wood", "Black", "White", "Grey", "Brown", "Green", "Blue"]', '["Естествен/Дърво", "Черен", "Бял", "Сив", "Кафяв", "Зелен", "Син"]', 4),
    ('Style', 'Стил', 'select', false, '["Modern", "Traditional", "Rustic", "Coastal", "Tropical", "Mediterranean"]', '["Модерен", "Традиционен", "Рустикален", "Крайбрежен", "Тропически", "Средиземноморски"]', 5),
    ('Seating Capacity', 'Места за сядане', 'select', false, '["1 Person", "2 Person", "4 Person", "6 Person", "8+ Person"]', '["1 човек", "2 човека", "4 човека", "6 човека", "8+ човека"]', 6),
    ('Assembly Required', 'Изисква сглобяване', 'boolean', false, '[]', '[]', 7),
    ('Foldable', 'Сгъваем', 'boolean', false, '[]', '[]', 8),
    ('Cover Included', 'Включен калъф', 'boolean', false, '[]', '[]', 9),
    ('Brand', 'Марка', 'select', false, '["Hampton Bay", "Frontgate", "Pottery Barn", "West Elm", "IKEA", "Other"]', '["Hampton Bay", "Frontgate", "Pottery Barn", "West Elm", "IKEA", "Друга"]', 10)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p1.name = 'Garden & Outdoor' AND p1.parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'
ON CONFLICT DO NOTHING;
;
