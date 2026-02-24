
-- Add attributes to Sheet L3 categories (Fitted, Flat, Sets, Pillowcases, Silk)
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
    ('Size', 'Размер', 'select', true, '["Single", "Double", "Queen", "King", "Super King", "California King", "Twin", "Twin XL", "Full", "RV/Camper"]', '["Единичен", "Двоен", "Queen", "King", "Супер King", "California King", "Twin", "Twin XL", "Пълен", "Каравана"]', 1),
    ('Material', 'Материал', 'select', true, '["100% Cotton", "Egyptian Cotton", "Bamboo", "Microfiber", "Silk", "Satin", "Flannel", "Jersey", "Linen", "Percale", "Sateen"]', '["100% Памук", "Египетски памук", "Бамбук", "Микрофибър", "Коприна", "Сатен", "Фланела", "Жарсе", "Лен", "Перкал", "Сатенен памук"]', 2),
    ('Thread Count', 'Плътност на тъканта', 'select', false, '["Under 200", "200-400", "400-600", "600-800", "800-1000", "1000+"]', '["Под 200", "200-400", "400-600", "600-800", "800-1000", "1000+"]', 3),
    ('Color', 'Цвят', 'select', false, '["White", "Ivory", "Grey", "Navy", "Blue", "Sage Green", "Blush Pink", "Black", "Beige", "Burgundy", "Lavender", "Pattern"]', '["Бял", "Слонова кост", "Сив", "Тъмносин", "Син", "Градински зелен", "Бледорозов", "Черен", "Бежов", "Бордо", "Лавандула", "Шарен"]', 4),
    ('Pocket Depth', 'Дълбочина на джоба', 'select', false, '["Standard (10-12 in)", "Deep (13-15 in)", "Extra Deep (16-18 in)", "Ultra Deep (18+ in)"]', '["Стандартен (25-30 см)", "Дълбок (33-38 см)", "Много дълбок (40-45 см)", "Ултра дълбок (45+ см)"]', 5),
    ('Weave', 'Тип тъкане', 'select', false, '["Percale", "Sateen", "Twill", "Plain"]', '["Перкал", "Сатен", "Кепер", "Прост"]', 6),
    ('Care Instructions', 'Инструкции за грижа', 'select', false, '["Machine Washable", "Hand Wash Only", "Dry Clean Only"]', '["Машинно пране", "Само ръчно пране", "Само химическо чистене"]', 7)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE c.slug IN ('sheets-fitted', 'sheets-flat', 'sheets-sets', 'sheets-pillowcases', 'sheets-silk')
ON CONFLICT DO NOTHING;
;
