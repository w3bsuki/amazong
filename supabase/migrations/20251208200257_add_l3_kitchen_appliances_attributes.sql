
-- Add attributes to Kitchen Appliances L3 categories (Coffee & Tea, Small Appliances)
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
    ('Brand', 'Марка', 'select', true, '["De''Longhi", "Breville", "KitchenAid", "Cuisinart", "Nespresso", "Keurig", "Mr. Coffee", "Ninja", "Other"]', '["De''Longhi", "Breville", "KitchenAid", "Cuisinart", "Nespresso", "Keurig", "Mr. Coffee", "Ninja", "Друга"]', 1),
    ('Capacity', 'Капацитет', 'select', false, '["Single Serve", "4 Cups", "8 Cups", "10 Cups", "12+ Cups"]', '["Една чаша", "4 чаши", "8 чаши", "10 чаши", "12+ чаши"]', 2),
    ('Type', 'Тип', 'select', false, '["Drip", "Espresso", "French Press", "Pour Over", "Single Serve Pod", "Cold Brew"]', '["Капков", "Еспресо", "Френска преса", "Pour Over", "На капсули", "Студено заваряване"]', 3),
    ('Color', 'Цвят', 'select', false, '["Black", "Silver", "White", "Red", "Stainless Steel"]', '["Черен", "Сребърен", "Бял", "Червен", "Неръждаема стомана"]', 4),
    ('Programmable', 'Програмируем', 'boolean', false, '[]', '[]', 5),
    ('Built-in Grinder', 'Вградена мелачка', 'boolean', false, '[]', '[]', 6),
    ('Milk Frother', 'Пенообразувател', 'boolean', false, '[]', '[]', 7),
    ('Power', 'Мощност', 'select', false, '["Low (< 800W)", "Medium (800-1200W)", "High (1200-1500W)", "Very High (1500W+)"]', '["Ниска (< 800W)", "Средна (800-1200W)", "Висока (1200-1500W)", "Много висока (1500W+)"]', 8)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p2.name IN ('Coffee & Tea', 'Small Appliances')
  AND c.parent_id IN (SELECT id FROM categories WHERE parent_id IN (SELECT id FROM categories WHERE name = 'Kitchen & Dining' AND parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'))
ON CONFLICT DO NOTHING;
;
