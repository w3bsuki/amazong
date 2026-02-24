
-- Add attributes to Office & School L3 categories
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
    ('Material', 'Материал', 'select', false, '["Paper", "Plastic", "Metal", "Wood", "Fabric", "Leather"]', '["Хартия", "Пластмаса", "Метал", "Дърво", "Плат", "Кожа"]', 1),
    ('Color', 'Цвят', 'select', false, '["Black", "Blue", "Red", "White", "Multi-Color", "Natural"]', '["Черен", "Син", "Червен", "Бял", "Многоцветен", "Естествен"]', 2),
    ('Size', 'Размер', 'select', false, '["Small", "Medium", "Large", "Letter Size", "Legal Size", "A4", "A5"]', '["Малък", "Среден", "Голям", "Letter", "Legal", "A4", "A5"]', 3),
    ('Quantity', 'Количество', 'select', false, '["Single", "Pack of 2", "Pack of 5", "Pack of 10", "Bulk Pack"]', '["Единичен", "2 броя", "5 броя", "10 броя", "Едро"]', 4),
    ('Brand', 'Марка', 'select', false, '["3M", "Avery", "Staples", "Office Depot", "Pilot", "Sharpie", "Other"]', '["3M", "Avery", "Staples", "Office Depot", "Pilot", "Sharpie", "Друга"]', 5),
    ('Eco-Friendly', 'Екологичен', 'boolean', false, '[]', '[]', 6),
    ('Refillable', 'За презареждане', 'boolean', false, '[]', '[]', 7)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p1.name = 'Office & School' AND p1.parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'
ON CONFLICT DO NOTHING;
;
