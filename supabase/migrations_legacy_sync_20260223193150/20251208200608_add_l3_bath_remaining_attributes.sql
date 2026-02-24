
-- Add attributes to remaining Bedding & Bath L3 categories
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
    ('Material', 'Материал', 'select', true, '["Cotton", "Egyptian Cotton", "Turkish Cotton", "Bamboo", "Microfiber", "Polyester", "Linen", "Memory Foam"]', '["Памук", "Египетски памук", "Турски памук", "Бамбук", "Микрофибър", "Полиестер", "Лен", "Мемори пяна"]', 1),
    ('Size', 'Размер', 'select', false, '["Standard", "Large", "Extra Large", "Single", "Queen", "King"]', '["Стандартен", "Голям", "Много голям", "Единичен", "Queen", "King"]', 2),
    ('Color', 'Цвят', 'select', false, '["White", "Ivory", "Grey", "Navy", "Blue", "Sage", "Pink", "Black", "Beige", "Pattern"]', '["Бял", "Слонова кост", "Сив", "Тъмносин", "Син", "Градински зелен", "Розов", "Черен", "Бежов", "Шарен"]', 3),
    ('GSM Weight', 'GSM тегло', 'select', false, '["Light (300-400 GSM)", "Medium (400-600 GSM)", "Heavy (600-900 GSM)", "Luxury (900+ GSM)"]', '["Леко (300-400 GSM)", "Средно (400-600 GSM)", "Тежко (600-900 GSM)", "Луксозно (900+ GSM)"]', 4),
    ('Set Size', 'Комплект', 'select', false, '["Single Item", "2-Piece Set", "4-Piece Set", "6-Piece Set", "8-Piece Set"]', '["Единична", "2 части", "4 части", "6 части", "8 части"]', 5),
    ('Machine Washable', 'Машинно пране', 'boolean', false, '[]', '[]', 6),
    ('Quick Dry', 'Бързосъхнещ', 'boolean', false, '[]', '[]', 7),
    ('Brand', 'Марка', 'select', false, '["Brooklinen", "Parachute", "Pottery Barn", "West Elm", "IKEA", "Other"]', '["Brooklinen", "Parachute", "Pottery Barn", "West Elm", "IKEA", "Друга"]', 8)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p1.name = 'Bedding & Bath' AND p1.parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'
  AND c.id NOT IN (SELECT DISTINCT category_id FROM category_attributes WHERE category_id IS NOT NULL)
ON CONFLICT DO NOTHING;
;
