
-- Add attributes to Household & Cleaning L3 categories
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
    ('Type', 'Тип', 'select', false, '["Manual", "Electric", "Battery-Powered", "Cordless", "Robot"]', '["Ръчен", "Електрически", "На батерии", "Безжичен", "Робот"]', 1),
    ('Surface Type', 'Тип повърхност', 'multiselect', false, '["Hard Floor", "Carpet", "Tile", "Wood", "Glass", "Upholstery", "All Surfaces"]', '["Твърд под", "Килим", "Плочки", "Дърво", "Стъкло", "Тапицерия", "Всички повърхности"]', 2),
    ('Power Source', 'Захранване', 'select', false, '["Corded Electric", "Cordless/Battery", "Manual", "Solar"]', '["Кабел", "Безжичен/Батерия", "Ръчен", "Соларен"]', 3),
    ('Brand', 'Марка', 'select', false, '["Dyson", "iRobot", "Shark", "Bissell", "Swiffer", "Vileda", "Other"]', '["Dyson", "iRobot", "Shark", "Bissell", "Swiffer", "Vileda", "Друга"]', 4),
    ('Eco-Friendly', 'Екологичен', 'boolean', false, '[]', '[]', 5),
    ('Refillable', 'За многократна употреба', 'boolean', false, '[]', '[]', 6),
    ('Scent', 'Аромат', 'select', false, '["Unscented", "Fresh", "Lavender", "Citrus", "Pine", "Other"]', '["Без аромат", "Свеж", "Лавандула", "Цитрус", "Бор", "Друг"]', 7),
    ('Quantity', 'Количество', 'select', false, '["Single", "2-Pack", "Value Pack", "Bulk"]', '["Единичен", "2 броя", "Изгоден пакет", "Едро"]', 8)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p1.name = 'Household & Cleaning' AND p1.parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'
ON CONFLICT DO NOTHING;
;
