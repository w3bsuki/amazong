
-- Add attributes to Fans L3 categories
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
    ('Fan Type', 'Тип вентилатор', 'select', true, '["Ceiling", "Tower", "Desk", "Floor/Pedestal", "Bladeless", "Box", "Exhaust"]', '["Таванен", "Колонен", "Настолен", "Подови/Стоящ", "Без перки", "Кутия", "Изтеглящ"]', 1),
    ('Blade Size', 'Размер на перките', 'select', false, '["Small (< 12 in)", "Medium (12-18 in)", "Large (18-24 in)", "Extra Large (> 24 in)"]', '["Малък (< 30 см)", "Среден (30-45 см)", "Голям (45-60 см)", "Много голям (> 60 см)"]', 2),
    ('Speed Settings', 'Настройки на скоростта', 'select', false, '["3 Speeds", "5 Speeds", "Variable Speed", "10+ Speeds"]', '["3 скорости", "5 скорости", "Плавна регулация", "10+ скорости"]', 3),
    ('Brand', 'Марка', 'select', false, '["Dyson", "Honeywell", "Lasko", "Vornado", "Hunter", "Westinghouse", "Other"]', '["Dyson", "Honeywell", "Lasko", "Vornado", "Hunter", "Westinghouse", "Друга"]', 4),
    ('Remote Control', 'Дистанционно', 'boolean', false, '[]', '[]', 5),
    ('Oscillation', 'Осцилация', 'boolean', false, '[]', '[]', 6),
    ('Timer', 'Таймер', 'boolean', false, '[]', '[]', 7),
    ('Height Adjustable', 'Регулируема височина', 'boolean', false, '[]', '[]', 8),
    ('Noise Level', 'Ниво на шум', 'select', false, '["Whisper Quiet", "Quiet", "Normal", "Powerful"]', '["Шепнещо тих", "Тих", "Нормален", "Мощен"]', 9)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE c.slug IN ('fans-ceiling', 'fans-tower', 'fans-desk', 'fans-floor', 'fans-bladeless')
ON CONFLICT DO NOTHING;
;
