
-- Add attributes to Food Storage L3 categories
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
    ('Material', 'Материал', 'select', true, '["Glass", "Plastic (BPA-Free)", "Stainless Steel", "Silicone", "Bamboo"]', '["Стъкло", "Пластмаса (без BPA)", "Неръждаема стомана", "Силикон", "Бамбук"]', 1),
    ('Size', 'Размер', 'select', false, '["Small (< 500ml)", "Medium (500ml-1L)", "Large (1L-2L)", "Extra Large (2L+)"]', '["Малък (< 500мл)", "Среден (500мл-1Л)", "Голям (1Л-2Л)", "Много голям (2Л+)"]', 2),
    ('Set Size', 'Брой части', 'select', false, '["Single", "3-Piece", "5-Piece", "10-Piece", "20+ Piece"]', '["Единичен", "3 части", "5 части", "10 части", "20+ части"]', 3),
    ('Lid Type', 'Тип капак', 'select', false, '["Snap-Lock", "Screw-On", "Press-Seal", "Vacuum", "Flip-Top"]', '["Клипс", "На резба", "Притискащ", "Вакуумен", "Отвор"]', 4),
    ('Microwave Safe', 'Подходящ за микровълнова', 'boolean', false, '[]', '[]', 5),
    ('Freezer Safe', 'Подходящ за фризер', 'boolean', false, '[]', '[]', 6),
    ('Dishwasher Safe', 'Подходящ за съдомиялна', 'boolean', false, '[]', '[]', 7),
    ('Stackable', 'Стакуеми', 'boolean', false, '[]', '[]', 8),
    ('Airtight', 'Херметичен', 'boolean', false, '[]', '[]', 9)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p2.name = 'Food Storage'
  AND c.parent_id IN (SELECT id FROM categories WHERE parent_id IN (SELECT id FROM categories WHERE name = 'Kitchen & Dining' AND parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'))
ON CONFLICT DO NOTHING;
;
