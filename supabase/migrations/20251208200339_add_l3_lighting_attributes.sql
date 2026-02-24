
-- Add attributes to ALL Lighting L3 categories
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
    ('Light Source', 'Източник на светлина', 'select', true, '["LED", "Incandescent", "Halogen", "Fluorescent", "Solar"]', '["LED", "Лампа с нажежаема жичка", "Халогенна", "Флуоресцентна", "Соларна"]', 1),
    ('Wattage', 'Мощност', 'select', false, '["Under 10W", "10-25W", "25-50W", "50-100W", "100W+"]', '["Под 10W", "10-25W", "25-50W", "50-100W", "100W+"]', 2),
    ('Color Temperature', 'Цветна температура', 'select', false, '["Warm White (2700K)", "Soft White (3000K)", "Neutral (4000K)", "Daylight (5000K+)", "RGB/Color Changing"]', '["Топло бяла (2700K)", "Мека бяла (3000K)", "Неутрална (4000K)", "Дневна (5000K+)", "RGB/Цветна"]', 3),
    ('Style', 'Стил', 'select', false, '["Modern", "Traditional", "Industrial", "Farmhouse", "Mid-Century", "Minimalist", "Art Deco"]', '["Модерен", "Традиционен", "Индустриален", "Ферма", "Средата на века", "Минималистичен", "Арт Деко"]', 4),
    ('Finish', 'Покритие', 'select', false, '["Black", "Brass", "Bronze", "Chrome", "Gold", "Nickel", "White", "Wood"]', '["Черен", "Месинг", "Бронз", "Хром", "Злато", "Никел", "Бял", "Дърво"]', 5),
    ('Dimmable', 'Димируема', 'boolean', false, '[]', '[]', 6),
    ('Smart Enabled', 'Smart съвместима', 'boolean', false, '[]', '[]', 7),
    ('Height Adjustable', 'Регулируема височина', 'boolean', false, '[]', '[]', 8),
    ('Energy Star', 'Energy Star', 'boolean', false, '[]', '[]', 9),
    ('Brand', 'Марка', 'select', false, '["Philips", "IKEA", "West Elm", "Pottery Barn", "CB2", "Target", "Other"]', '["Philips", "IKEA", "West Elm", "Pottery Barn", "CB2", "Target", "Друга"]', 10)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p1.name = 'Lighting' AND p1.parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'
ON CONFLICT DO NOTHING;
;
