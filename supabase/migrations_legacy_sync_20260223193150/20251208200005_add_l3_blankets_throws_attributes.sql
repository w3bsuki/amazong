
-- Add attributes to Blankets & Throws L3 categories
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
    ('Size', 'Размер', 'select', true, '["Throw (50x60)", "Twin (66x90)", "Full/Queen (90x90)", "King (108x90)", "Oversized"]', '["Хвърляне (127x152 см)", "Twin (168x229 см)", "Пълен/Queen (229x229 см)", "King (274x229 см)", "Голям"]', 1),
    ('Material', 'Материал', 'select', true, '["Fleece", "Sherpa", "Wool", "Cotton", "Acrylic", "Cashmere", "Velvet", "Chenille"]', '["Полар", "Шерпа", "Вълна", "Памук", "Акрил", "Кашмир", "Кадифе", "Шенил"]', 2),
    ('Weight', 'Тегло', 'select', false, '["Lightweight", "Medium Weight", "Heavyweight", "Weighted (10-25 lbs)"]', '["Леко", "Средно тегло", "Тежко", "С тежест (4-11 кг)"]', 3),
    ('Color', 'Цвят', 'select', false, '["White", "Cream", "Grey", "Charcoal", "Navy", "Burgundy", "Brown", "Taupe", "Pattern"]', '["Бял", "Кремав", "Сив", "Въглен", "Тъмносин", "Бордо", "Кафяв", "Топъл сив", "Шарен"]', 4),
    ('Pattern', 'Шарка', 'select', false, '["Solid", "Plaid", "Striped", "Cable Knit", "Textured", "Printed"]', '["Едноцветен", "Карирано", "На райета", "Плетен", "Текстуриран", "С принт"]', 5),
    ('Reversible', 'Двулицев', 'boolean', false, '[]', '[]', 6),
    ('Care Instructions', 'Инструкции за грижа', 'select', false, '["Machine Washable", "Hand Wash Only", "Dry Clean Only", "Spot Clean"]', '["Машинно пране", "Само ръчно пране", "Само химическо чистене", "Почистване на петна"]', 7)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE c.slug IN ('blankets-fleece', 'blankets-wool', 'blankets-cotton', 'blankets-weighted', 'blankets-throws')
ON CONFLICT DO NOTHING;
;
