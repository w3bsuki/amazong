
-- Add attributes to Comforters & Duvets L3 categories
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
CROSS JOIN (
  VALUES 
    ('Size', 'Размер', 'select', true, '["Twin", "Twin XL", "Full", "Queen", "King", "California King", "Oversized King"]', '["Twin", "Twin XL", "Пълен", "Queen", "King", "California King", "Голям King"]', 1),
    ('Fill Type', 'Тип пълнеж', 'select', true, '["Down", "Down Alternative", "Polyester", "Wool", "Silk", "Bamboo"]', '["Пух", "Алтернатива на пух", "Полиестер", "Вълна", "Коприна", "Бамбук"]', 2),
    ('Fill Weight', 'Тегло на пълнежа', 'select', false, '["Lightweight (Summer)", "Medium Weight (All-Season)", "Heavyweight (Winter)"]', '["Леко (Лято)", "Средно тегло (Целогодишно)", "Тежко (Зима)"]', 3),
    ('Fill Power', 'Сила на пълнежа', 'select', false, '["400-500", "550-650", "700-800", "800+"]', '["400-500", "550-650", "700-800", "800+"]', 4),
    ('Shell Material', 'Материал на обвивката', 'select', false, '["Cotton", "Cotton Blend", "Microfiber", "Silk"]', '["Памук", "Памучна смес", "Микрофибър", "Коприна"]', 5),
    ('Color', 'Цвят', 'select', false, '["White", "Ivory", "Grey", "Navy", "Blue", "Beige", "Pattern"]', '["Бял", "Слонова кост", "Сив", "Тъмносин", "Син", "Бежов", "Шарен"]', 6),
    ('Hypoallergenic', 'Хипоалергенен', 'boolean', false, '[]', '[]', 7),
    ('Baffle Box Construction', 'Квадратна конструкция', 'boolean', false, '[]', '[]', 8)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE c.slug IN ('comforters-down', 'comforters-alternative', 'comforters-allseason', 'duvets-summer', 'duvets-winter')
ON CONFLICT DO NOTHING;
;
