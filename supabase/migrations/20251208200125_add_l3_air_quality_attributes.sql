
-- Add attributes to Air Quality L3 categories
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
    ('Room Coverage', 'Покритие на стая', 'select', true, '["Small (up to 200 sq ft)", "Medium (200-400 sq ft)", "Large (400-800 sq ft)", "Extra Large (800+ sq ft)"]', '["Малка (до 20 кв.м)", "Средна (20-40 кв.м)", "Голяма (40-80 кв.м)", "Много голяма (80+ кв.м)"]', 1),
    ('Filter Type', 'Тип филтър', 'multiselect', false, '["HEPA", "True HEPA", "Carbon/Activated Charcoal", "Pre-Filter", "UV-C", "Ionizer"]', '["HEPA", "Истински HEPA", "Въглен/Активен въглен", "Пред-филтър", "UV-C", "Йонизатор"]', 2),
    ('CADR Rating', 'CADR рейтинг', 'select', false, '["Low (< 100)", "Medium (100-200)", "High (200-350)", "Very High (350+)"]', '["Нисък (< 100)", "Среден (100-200)", "Висок (200-350)", "Много висок (350+)"]', 3),
    ('Brand', 'Марка', 'select', false, '["Dyson", "Philips", "Coway", "Honeywell", "Levoit", "Blueair", "IQAir", "Other"]', '["Dyson", "Philips", "Coway", "Honeywell", "Levoit", "Blueair", "IQAir", "Друга"]', 4),
    ('Smart Features', 'Интелигентни функции', 'multiselect', false, '["WiFi", "App Control", "Voice Assistant", "Air Quality Display", "Auto Mode"]', '["WiFi", "Приложение", "Гласов асистент", "Дисплей за качество", "Авто режим"]', 5),
    ('Noise Level', 'Ниво на шум', 'select', false, '["Silent (< 25 dB)", "Quiet (25-40 dB)", "Normal (40-55 dB)", "Loud (> 55 dB)"]', '["Безшумен (< 25 dB)", "Тих (25-40 dB)", "Нормален (40-55 dB)", "Силен (> 55 dB)"]', 6),
    ('Energy Star', 'Energy Star', 'boolean', false, '[]', '[]', 7),
    ('Night Mode', 'Нощен режим', 'boolean', false, '[]', '[]', 8)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE c.slug IN ('air-purifiers', 'humidifiers', 'dehumidifiers')
ON CONFLICT DO NOTHING;
;
