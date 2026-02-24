
-- Add attributes to Heaters L3 categories
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
    ('Wattage', 'Мощност', 'select', true, '["500W", "750W", "1000W", "1500W", "2000W", "2500W", "3000W"]', '["500W", "750W", "1000W", "1500W", "2000W", "2500W", "3000W"]', 1),
    ('Heating Type', 'Тип отопление', 'select', true, '["Convection", "Radiant", "Infrared", "Ceramic", "Oil-Filled", "Fan-Forced"]', '["Конвекционен", "Лъчист", "Инфрачервен", "Керамичен", "Маслен", "С вентилатор"]', 2),
    ('Room Size', 'Размер на стая', 'select', false, '["Small (up to 150 sq ft)", "Medium (150-400 sq ft)", "Large (400+ sq ft)"]', '["Малка (до 15 кв.м)", "Средна (15-40 кв.м)", "Голяма (40+ кв.м)"]', 3),
    ('Brand', 'Марка', 'select', false, '["DeLonghi", "Dyson", "Honeywell", "Lasko", "Vornado", "Rowenta", "Other"]', '["DeLonghi", "Dyson", "Honeywell", "Lasko", "Vornado", "Rowenta", "Друга"]', 4),
    ('Thermostat', 'Термостат', 'boolean', false, '[]', '[]', 5),
    ('Timer', 'Таймер', 'boolean', false, '[]', '[]', 6),
    ('Remote Control', 'Дистанционно', 'boolean', false, '[]', '[]', 7),
    ('Oscillation', 'Осцилация', 'boolean', false, '[]', '[]', 8),
    ('Portable', 'Преносим', 'boolean', false, '[]', '[]', 9),
    ('Safety Features', 'Функции за безопасност', 'multiselect', false, '["Tip-Over Protection", "Overheat Protection", "Cool-Touch Exterior", "Child Lock"]', '["Защита при падане", "Защита от прегряване", "Хладен корпус", "Детска защита"]', 10)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE c.slug IN ('heaters-space', 'heaters-radiators', 'heaters-convector', 'heaters-infrared', 'heaters-fireplace')
ON CONFLICT DO NOTHING;
;
