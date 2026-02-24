
-- Add attributes to Kitchen Utensils, Linens, Bar, and Organization L3 categories
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
CROSS JOIN (
  VALUES 
    ('Material', 'Материал', 'select', false, '["Stainless Steel", "Silicone", "Wood", "Plastic", "Nylon", "Cotton", "Linen", "Bamboo"]', '["Неръждаема стомана", "Силикон", "Дърво", "Пластмаса", "Найлон", "Памук", "Лен", "Бамбук"]', 1),
    ('Color', 'Цвят', 'select', false, '["Black", "White", "Red", "Grey", "Natural", "Multi-Color"]', '["Черен", "Бял", "Червен", "Сив", "Естествен", "Многоцветен"]', 2),
    ('Set Size', 'Брой части', 'select', false, '["Single", "Set of 2", "Set of 4", "Set of 6", "Full Set"]', '["Единичен", "Комплект от 2", "Комплект от 4", "Комплект от 6", "Пълен комплект"]', 3),
    ('Dishwasher Safe', 'Подходящ за съдомиялна', 'boolean', false, '[]', '[]', 4),
    ('Heat Resistant', 'Устойчив на топлина', 'boolean', false, '[]', '[]', 5),
    ('Brand', 'Марка', 'select', false, '["OXO", "KitchenAid", "Joseph Joseph", "Cuisinart", "Williams Sonoma", "Other"]', '["OXO", "KitchenAid", "Joseph Joseph", "Cuisinart", "Williams Sonoma", "Друга"]', 6)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p2.name IN ('Kitchen Utensils', 'Kitchen Linens', 'Bar Accessories', 'Kitchen Organization')
  AND c.parent_id IN (SELECT id FROM categories WHERE parent_id IN (SELECT id FROM categories WHERE name = 'Kitchen & Dining' AND parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'))
ON CONFLICT DO NOTHING;
;
