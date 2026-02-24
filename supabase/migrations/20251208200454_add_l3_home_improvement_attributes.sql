
-- Add attributes to Home Improvement L3 categories
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
JOIN categories p1 ON p2.parent_id = p1.id
CROSS JOIN (
  VALUES 
    ('Material', 'Материал', 'select', false, '["Metal", "Plastic", "Wood", "Composite", "Brass", "Chrome", "Stainless Steel"]', '["Метал", "Пластмаса", "Дърво", "Композит", "Месинг", "Хром", "Неръждаема стомана"]', 1),
    ('Finish', 'Покритие', 'select', false, '["Chrome", "Brushed Nickel", "Oil-Rubbed Bronze", "Matte Black", "Polished Brass", "White"]', '["Хром", "Четкован никел", "Маслен бронз", "Матово черно", "Полиран месинг", "Бял"]', 2),
    ('Style', 'Стил', 'select', false, '["Modern", "Traditional", "Transitional", "Industrial", "Farmhouse"]', '["Модерен", "Традиционен", "Преходен", "Индустриален", "Ферма"]', 3),
    ('Installation Type', 'Тип монтаж', 'select', false, '["DIY-Friendly", "Professional Required", "No Installation"]', '["DIY подходящ", "Нужен професионалист", "Без монтаж"]', 4),
    ('Brand', 'Марка', 'select', false, '["Moen", "Delta", "Kohler", "Schlage", "Kwikset", "Defiant", "Other"]', '["Moen", "Delta", "Kohler", "Schlage", "Kwikset", "Defiant", "Друга"]', 5),
    ('Smart Enabled', 'Smart съвместим', 'boolean', false, '[]', '[]', 6),
    ('ADA Compliant', 'ADA съвместим', 'boolean', false, '[]', '[]', 7),
    ('Warranty', 'Гаранция', 'select', false, '["1 Year", "2 Years", "5 Years", "Lifetime"]', '["1 година", "2 години", "5 години", "Доживотна"]', 8)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p1.name = 'Home Improvement' AND p1.parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'
ON CONFLICT DO NOTHING;
;
