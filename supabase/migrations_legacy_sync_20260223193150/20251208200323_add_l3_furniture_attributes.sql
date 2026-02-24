
-- Add attributes to ALL Furniture L3 categories
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
    ('Material', 'Материал', 'select', true, '["Solid Wood", "MDF", "Particle Board", "Metal", "Glass", "Rattan", "Upholstered", "Leather"]', '["Масивно дърво", "MDF", "ПДЧ", "Метал", "Стъкло", "Ратан", "Тапициран", "Кожа"]', 1),
    ('Color', 'Цвят', 'select', false, '["White", "Black", "Natural Wood", "Walnut", "Oak", "Grey", "Brown", "Multi-Color"]', '["Бял", "Черен", "Естествено дърво", "Орех", "Дъб", "Сив", "Кафяв", "Многоцветен"]', 2),
    ('Style', 'Стил', 'select', false, '["Modern", "Contemporary", "Mid-Century", "Traditional", "Rustic", "Industrial", "Scandinavian", "Minimalist"]', '["Модерен", "Съвременен", "Средата на века", "Традиционен", "Рустикален", "Индустриален", "Скандинавски", "Минималистичен"]', 3),
    ('Brand', 'Марка', 'select', false, '["IKEA", "Ashley", "Wayfair", "West Elm", "Pottery Barn", "CB2", "Other"]', '["IKEA", "Ashley", "Wayfair", "West Elm", "Pottery Barn", "CB2", "Друга"]', 4),
    ('Assembly Required', 'Изисква сглобяване', 'boolean', false, '[]', '[]', 5),
    ('Dimensions', 'Размери', 'text', false, '[]', '[]', 6),
    ('Weight Capacity', 'Носимост', 'select', false, '["Up to 100 kg", "100-200 kg", "200-300 kg", "300+ kg"]', '["До 100 кг", "100-200 кг", "200-300 кг", "300+ кг"]', 7),
    ('Indoor/Outdoor', 'Вътрешно/Външно', 'select', false, '["Indoor Only", "Outdoor Only", "Indoor/Outdoor"]', '["Само вътрешно", "Само външно", "Вътрешно/Външно"]', 8)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p1.name = 'Furniture' AND p1.parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'
ON CONFLICT DO NOTHING;
;
