
-- Add attributes to Dinnerware & Glassware L3 categories
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
CROSS JOIN (
  VALUES 
    ('Material', 'Материал', 'select', true, '["Porcelain", "Stoneware", "Ceramic", "Bone China", "Melamine", "Glass", "Crystal"]', '["Порцелан", "Керамика", "Керамика", "Костен порцелан", "Меламин", "Стъкло", "Кристал"]', 1),
    ('Set Size', 'Размер на комплекта', 'select', false, '["Single Item", "4-Piece", "8-Piece", "12-Piece", "16-Piece", "20+ Piece"]', '["Единичен артикул", "4 части", "8 части", "12 части", "16 части", "20+ части"]', 2),
    ('Color', 'Цвят', 'select', false, '["White", "Ivory", "Blue", "Grey", "Black", "Multi-Color", "Pattern"]', '["Бял", "Слонова кост", "Син", "Сив", "Черен", "Многоцветен", "Шарен"]', 3),
    ('Style', 'Стил', 'select', false, '["Modern", "Classic", "Rustic", "Minimalist", "Traditional", "Contemporary"]', '["Модерен", "Класически", "Рустикален", "Минималистичен", "Традиционен", "Съвременен"]', 4),
    ('Dishwasher Safe', 'Подходящ за съдомиялна', 'boolean', false, '[]', '[]', 5),
    ('Microwave Safe', 'Подходящ за микровълнова', 'boolean', false, '[]', '[]', 6),
    ('Brand', 'Марка', 'select', false, '["Corelle", "Villeroy & Boch", "Lenox", "Mikasa", "Royal Doulton", "IKEA", "Other"]', '["Corelle", "Villeroy & Boch", "Lenox", "Mikasa", "Royal Doulton", "IKEA", "Друга"]', 7)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p2.name IN ('Dinnerware', 'Glassware')
  AND c.parent_id IN (SELECT id FROM categories WHERE parent_id IN (SELECT id FROM categories WHERE name = 'Kitchen & Dining' AND parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'))
ON CONFLICT DO NOTHING;
;
