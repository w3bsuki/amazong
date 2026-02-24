
-- Add attributes to Kitchen Appliances L3 categories (including Large Appliances)
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
    ('Brand', 'Марка', 'select', true, '["Samsung", "LG", "Bosch", "KitchenAid", "Cuisinart", "Ninja", "Instant Pot", "Breville", "Whirlpool", "Other"]', '["Samsung", "LG", "Bosch", "KitchenAid", "Cuisinart", "Ninja", "Instant Pot", "Breville", "Whirlpool", "Друга"]', 1),
    ('Color', 'Цвят', 'select', false, '["Black", "White", "Stainless Steel", "Red", "Silver", "Custom Panel"]', '["Черен", "Бял", "Неръждаема стомана", "Червен", "Сребърен", "Персонализиран панел"]', 2),
    ('Capacity', 'Капацитет', 'select', false, '["Compact", "Small", "Medium", "Large", "Extra Large"]', '["Компактен", "Малък", "Среден", "Голям", "Много голям"]', 3),
    ('Power', 'Мощност', 'select', false, '["Low (< 500W)", "Medium (500-1000W)", "High (1000-1500W)", "Very High (1500W+)"]', '["Ниска (< 500W)", "Средна (500-1000W)", "Висока (1000-1500W)", "Много висока (1500W+)"]', 4),
    ('Energy Rating', 'Енергиен клас', 'select', false, '["A+++", "A++", "A+", "A", "B", "C"]', '["A+++", "A++", "A+", "A", "B", "C"]', 5),
    ('Smart Features', 'Интелигентни функции', 'boolean', false, '[]', '[]', 6),
    ('Warranty', 'Гаранция', 'select', false, '["1 Year", "2 Years", "5 Years", "10 Years"]', '["1 година", "2 години", "5 години", "10 години"]', 7)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p2.name IN ('Kitchen Appliances', 'Large Appliances')
  AND c.parent_id IN (SELECT id FROM categories WHERE parent_id IN (SELECT id FROM categories WHERE name = 'Kitchen & Dining' AND parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'))
ON CONFLICT DO NOTHING;
;
