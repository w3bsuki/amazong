
-- Add attributes to Pillows L3 categories
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
    ('Size', 'Размер', 'select', true, '["Standard (20x26)", "Queen (20x30)", "King (20x36)", "Euro (26x26)", "Body Pillow (20x54)"]', '["Стандартен (51x66 см)", "Queen (51x76 см)", "King (51x91 см)", "Евро (66x66 см)", "За тяло (51x137 см)"]', 1),
    ('Fill Type', 'Тип пълнеж', 'select', true, '["Memory Foam", "Down", "Down Alternative", "Latex", "Polyester", "Buckwheat", "Gel-Infused"]', '["Мемори пяна", "Пух", "Алтернатива на пух", "Латекс", "Полиестер", "Елда", "С гел"]', 2),
    ('Firmness', 'Твърдост', 'select', true, '["Soft", "Medium", "Firm", "Extra Firm", "Adjustable"]', '["Мек", "Среден", "Твърд", "Много твърд", "Регулируем"]', 3),
    ('Sleep Position', 'Позиция на сън', 'multiselect', false, '["Side Sleeper", "Back Sleeper", "Stomach Sleeper", "All Positions"]', '["Страничен сън", "По гръб", "По корем", "Всички позиции"]', 4),
    ('Loft Height', 'Височина', 'select', false, '["Low (3-4 in)", "Medium (4-6 in)", "High (6+ in)"]', '["Ниска (7-10 см)", "Средна (10-15 см)", "Висока (15+ см)"]', 5),
    ('Cover Material', 'Материал на калъфа', 'select', false, '["Cotton", "Bamboo", "Tencel", "Polyester", "Silk"]', '["Памук", "Бамбук", "Тенсел", "Полиестер", "Коприна"]', 6),
    ('Cooling', 'Охлаждащ', 'boolean', false, '[]', '[]', 7),
    ('Hypoallergenic', 'Хипоалергенен', 'boolean', false, '[]', '[]', 8),
    ('Washable Cover', 'Перящ се калъф', 'boolean', false, '[]', '[]', 9)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE c.slug IN ('pillows-memory', 'pillows-down', 'pillows-cooling', 'pillows-body', 'pillows-orthopedic')
ON CONFLICT DO NOTHING;
;
