
-- Add attributes to Storage & Organization L3 categories
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
    ('Material', 'Материал', 'select', false, '["Plastic", "Fabric", "Wood", "Metal", "Wicker", "Cardboard", "Bamboo"]', '["Пластмаса", "Плат", "Дърво", "Метал", "Плетено", "Картон", "Бамбук"]', 1),
    ('Size', 'Размер', 'select', false, '["Small", "Medium", "Large", "Extra Large"]', '["Малък", "Среден", "Голям", "Много голям"]', 2),
    ('Color', 'Цвят', 'select', false, '["Clear", "White", "Black", "Grey", "Natural", "Multi-Color"]', '["Прозрачен", "Бял", "Черен", "Сив", "Естествен", "Многоцветен"]', 3),
    ('Location', 'Местоположение', 'multiselect', false, '["Closet", "Kitchen", "Bathroom", "Garage", "Under Bed", "Desk", "Wall Mounted"]', '["Гардероб", "Кухня", "Баня", "Гараж", "Под легло", "Бюро", "На стена"]', 4),
    ('Stackable', 'Стакуем', 'boolean', false, '[]', '[]', 5),
    ('Foldable', 'Сгъваем', 'boolean', false, '[]', '[]', 6),
    ('Lid Included', 'Включен капак', 'boolean', false, '[]', '[]', 7),
    ('Set Size', 'Брой части', 'select', false, '["Single", "2-Pack", "3-Pack", "4-Pack", "6+ Pack"]', '["Единичен", "2 броя", "3 броя", "4 броя", "6+ броя"]', 8),
    ('Brand', 'Марка', 'select', false, '["IKEA", "Container Store", "Sterilite", "Rubbermaid", "mDesign", "Other"]', '["IKEA", "Container Store", "Sterilite", "Rubbermaid", "mDesign", "Друга"]', 9)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p1.name = 'Storage & Organization' AND p1.parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'
ON CONFLICT DO NOTHING;
;
