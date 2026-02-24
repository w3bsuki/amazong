
-- Add attributes to remaining Climate Control L3 categories
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
    ('Brand', 'Марка', 'select', false, '["Honeywell", "Philips", "Dyson", "3M", "Filtrete", "Other"]', '["Honeywell", "Philips", "Dyson", "3M", "Filtrete", "Друга"]', 1),
    ('Size', 'Размер', 'select', false, '["Small", "Medium", "Large", "Custom"]', '["Малък", "Среден", "Голям", "Персонализиран"]', 2),
    ('Compatibility', 'Съвместимост', 'text', false, '[]', '[]', 3),
    ('Filter Type', 'Тип филтър', 'select', false, '["HEPA", "Carbon", "Pre-Filter", "MERV 8", "MERV 11", "MERV 13"]', '["HEPA", "Въглен", "Пред-филтър", "MERV 8", "MERV 11", "MERV 13"]', 4),
    ('Pack Size', 'Опаковка', 'select', false, '["Single", "2-Pack", "3-Pack", "6-Pack"]', '["Единичен", "2 броя", "3 броя", "6 броя"]', 5)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE c.slug IN ('ac-accessories', 'air-filters', 'air-monitors', 'heaters-blankets')
ON CONFLICT DO NOTHING;
;
