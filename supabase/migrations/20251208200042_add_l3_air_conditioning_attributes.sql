
-- Add attributes to Air Conditioning L3 categories
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
    ('BTU Rating', 'BTU мощност', 'select', true, '["5,000 BTU", "8,000 BTU", "10,000 BTU", "12,000 BTU", "14,000 BTU", "18,000 BTU", "24,000 BTU"]', '["5,000 BTU", "8,000 BTU", "10,000 BTU", "12,000 BTU", "14,000 BTU", "18,000 BTU", "24,000 BTU"]', 1),
    ('Room Size', 'Размер на стая', 'select', true, '["Up to 150 sq ft", "150-350 sq ft", "350-550 sq ft", "550-700 sq ft", "700+ sq ft"]', '["До 15 кв.м", "15-35 кв.м", "35-55 кв.м", "55-70 кв.м", "70+ кв.м"]', 2),
    ('Energy Rating', 'Енергиен клас', 'select', false, '["A+++", "A++", "A+", "A", "B", "C"]', '["A+++", "A++", "A+", "A", "B", "C"]', 3),
    ('Brand', 'Марка', 'select', false, '["Daikin", "Mitsubishi", "LG", "Samsung", "Gree", "Midea", "Fujitsu", "Panasonic", "Carrier", "Other"]', '["Daikin", "Mitsubishi", "LG", "Samsung", "Gree", "Midea", "Fujitsu", "Panasonic", "Carrier", "Друга"]', 4),
    ('Inverter Technology', 'Инверторна технология', 'boolean', false, '[]', '[]', 5),
    ('WiFi Control', 'WiFi управление', 'boolean', false, '[]', '[]', 6),
    ('Heat Pump', 'Термопомпа', 'boolean', false, '[]', '[]', 7),
    ('Noise Level', 'Ниво на шум', 'select', false, '["Very Quiet (< 25 dB)", "Quiet (25-35 dB)", "Normal (35-45 dB)", "Loud (> 45 dB)"]', '["Много тих (< 25 dB)", "Тих (25-35 dB)", "Нормален (35-45 dB)", "Силен (> 45 dB)"]', 8),
    ('Installation Type', 'Тип монтаж', 'select', false, '["Professional Required", "DIY Possible", "Plug-and-Play"]', '["Нужен професионалист", "Възможен DIY", "Plug-and-Play"]', 9)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE c.slug IN ('ac-split-systems', 'ac-portable', 'ac-window', 'ac-multi-split')
ON CONFLICT DO NOTHING;
;
