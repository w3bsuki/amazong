
-- Add attributes to ALL Home Décor L3 categories
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
    ('Material', 'Материал', 'select', false, '["Wood", "Metal", "Ceramic", "Glass", "Fabric", "Rattan", "Resin", "Paper"]', '["Дърво", "Метал", "Керамика", "Стъкло", "Плат", "Ратан", "Смола", "Хартия"]', 1),
    ('Color', 'Цвят', 'select', false, '["White", "Black", "Natural", "Gold", "Silver", "Blue", "Green", "Multi-Color"]', '["Бял", "Черен", "Естествен", "Злато", "Сребро", "Син", "Зелен", "Многоцветен"]', 2),
    ('Style', 'Стил', 'select', false, '["Modern", "Bohemian", "Coastal", "Farmhouse", "Minimalist", "Traditional", "Eclectic"]', '["Модерен", "Бохемски", "Крайбрежен", "Ферма", "Минималистичен", "Традиционен", "Еклектичен"]', 3),
    ('Size', 'Размер', 'select', false, '["Small", "Medium", "Large", "Extra Large", "Set of Multiple"]', '["Малък", "Среден", "Голям", "Много голям", "Комплект"]', 4),
    ('Room', 'Стая', 'multiselect', false, '["Living Room", "Bedroom", "Bathroom", "Kitchen", "Dining Room", "Office", "Entryway"]', '["Хол", "Спалня", "Баня", "Кухня", "Трапезария", "Офис", "Антре"]', 5),
    ('Handmade', 'Ръчна изработка', 'boolean', false, '[]', '[]', 6),
    ('Brand', 'Марка', 'select', false, '["West Elm", "Pottery Barn", "CB2", "H&M Home", "Zara Home", "IKEA", "Other"]', '["West Elm", "Pottery Barn", "CB2", "H&M Home", "Zara Home", "IKEA", "Друга"]', 7)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p1.name = 'Home Décor' AND p1.parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'
ON CONFLICT DO NOTHING;
;
