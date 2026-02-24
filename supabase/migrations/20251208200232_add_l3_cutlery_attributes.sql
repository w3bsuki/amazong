
-- Add attributes to Cutlery L3 categories
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
    ('Blade Material', 'Материал на острието', 'select', true, '["Stainless Steel", "Carbon Steel", "Damascus Steel", "Ceramic", "High-Carbon Stainless"]', '["Неръждаема стомана", "Въглеродна стомана", "Дамаска стомана", "Керамика", "Високовъглеродна"]', 1),
    ('Handle Material', 'Материал на дръжката', 'select', false, '["Wood", "Plastic", "Stainless Steel", "Pakkawood", "G10", "Micarta"]', '["Дърво", "Пластмаса", "Неръждаема стомана", "Pakkawood", "G10", "Micarta"]', 2),
    ('Blade Length', 'Дължина на острието', 'select', false, '["3-4 in", "5-6 in", "7-8 in", "9-10 in", "10+ in"]', '["7-10 см", "12-15 см", "17-20 см", "22-25 см", "25+ см"]', 3),
    ('Brand', 'Марка', 'select', false, '["Wusthof", "Zwilling", "Victorinox", "Shun", "Global", "Henckels", "Other"]', '["Wusthof", "Zwilling", "Victorinox", "Shun", "Global", "Henckels", "Друга"]', 4),
    ('Forged', 'Кована', 'boolean', false, '[]', '[]', 5),
    ('Full Tang', 'Пълна опашка', 'boolean', false, '[]', '[]', 6),
    ('Pieces (for sets)', 'Брой части', 'select', false, '["Single", "3-Piece", "5-Piece", "7-Piece", "10+ Piece"]', '["Единичен", "3 части", "5 части", "7 части", "10+ части"]', 7)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p2.name = 'Cutlery'
  AND c.parent_id IN (SELECT id FROM categories WHERE parent_id IN (SELECT id FROM categories WHERE name = 'Kitchen & Dining' AND parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'))
ON CONFLICT DO NOTHING;
;
