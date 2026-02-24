
-- Add attributes to Cookware & Bakeware L3 categories
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
    ('Material', 'Материал', 'select', true, '["Stainless Steel", "Cast Iron", "Non-Stick", "Aluminum", "Copper", "Ceramic", "Carbon Steel", "Glass"]', '["Неръждаема стомана", "Чугун", "Незалепващо", "Алуминий", "Мед", "Керамика", "Въглеродна стомана", "Стъкло"]', 1),
    ('Size', 'Размер', 'select', false, '["Small (< 8 in)", "Medium (8-10 in)", "Large (10-12 in)", "Extra Large (> 12 in)"]', '["Малък (< 20 см)", "Среден (20-25 см)", "Голям (25-30 см)", "Много голям (> 30 см)"]', 2),
    ('Brand', 'Марка', 'select', false, '["All-Clad", "Le Creuset", "Lodge", "T-fal", "Calphalon", "Cuisinart", "KitchenAid", "Other"]', '["All-Clad", "Le Creuset", "Lodge", "T-fal", "Calphalon", "Cuisinart", "KitchenAid", "Друга"]', 3),
    ('Oven Safe', 'Подходящ за фурна', 'boolean', false, '[]', '[]', 4),
    ('Dishwasher Safe', 'Подходящ за съдомиялна', 'boolean', false, '[]', '[]', 5),
    ('Induction Compatible', 'Подходящ за индукция', 'boolean', false, '[]', '[]', 6),
    ('Lid Included', 'Включен капак', 'boolean', false, '[]', '[]', 7),
    ('Handle Type', 'Тип дръжка', 'select', false, '["Stay-Cool", "Riveted", "Welded", "Removable", "Double Handle"]', '["Студена дръжка", "Занитена", "Заварена", "Сменяема", "Двойна дръжка"]', 8)
) AS a(name, name_bg, attribute_type, is_required, options, options_bg, sort_order)
WHERE p2.name IN ('Cookware', 'Bakeware')
  AND c.parent_id IN (SELECT id FROM categories WHERE parent_id IN (SELECT id FROM categories WHERE name = 'Kitchen & Dining' AND parent_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'))
ON CONFLICT DO NOTHING;
;
