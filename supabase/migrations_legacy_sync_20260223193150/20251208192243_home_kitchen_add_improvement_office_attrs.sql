
-- Home Improvement attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Condition
('788aa565-b002-4925-b1d6-94062d831510', 'Condition', 'Състояние', 'select', true, true,
 '["New", "Like New", "Good", "Used"]'::jsonb,
 '["Ново", "Като ново", "Добро", "Използвано"]'::jsonb, 1),

-- DIY/Professional
('788aa565-b002-4925-b1d6-94062d831510', 'DIY Level', 'Ниво на направи си сам', 'select', false, true,
 '["Beginner/DIY Friendly", "Intermediate", "Professional/Expert Required"]'::jsonb,
 '["Начинаещ/Лесен за сам", "Среден", "Професионален/Изисква експерт"]'::jsonb, 10),

-- Material
('788aa565-b002-4925-b1d6-94062d831510', 'Material', 'Материал', 'select', false, true,
 '["Wood", "Metal", "Plastic", "PVC", "Ceramic", "Glass", "Concrete", "Composite"]'::jsonb,
 '["Дърво", "Метал", "Пластмаса", "PVC", "Керамика", "Стъкло", "Бетон", "Композит"]'::jsonb, 11),

-- Finish
('788aa565-b002-4925-b1d6-94062d831510', 'Finish', 'Покритие', 'select', false, true,
 '["Chrome", "Brushed Nickel", "Matte Black", "Brass", "White", "Stainless Steel", "Bronze", "Unfinished"]'::jsonb,
 '["Хром", "Матиран никел", "Матово черно", "Месинг", "Бяло", "Неръждаема стомана", "Бронз", "Без покритие"]'::jsonb, 12),

-- Indoor/Outdoor
('788aa565-b002-4925-b1d6-94062d831510', 'Indoor/Outdoor', 'Вътрешен/Външен', 'select', false, true,
 '["Indoor Only", "Outdoor Safe", "Indoor/Outdoor"]'::jsonb,
 '["Само вътрешен", "Подходящ за двор", "Вътрешен/Външен"]'::jsonb, 13),

-- Coverage Area
('788aa565-b002-4925-b1d6-94062d831510', 'Coverage', 'Покритие', 'select', false, true,
 '["Under 5m²", "5-10m²", "10-20m²", "20-50m²", "50m²+"]'::jsonb,
 '["Под 5м²", "5-10м²", "10-20м²", "20-50м²", "50м²+"]'::jsonb, 14),

-- Power Source
('788aa565-b002-4925-b1d6-94062d831510', 'Power Source', 'Захранване', 'select', false, true,
 '["Manual", "Electric (Corded)", "Battery/Cordless", "Pneumatic"]'::jsonb,
 '["Ръчно", "Електрическо (кабел)", "Батерия/Безжично", "Пневматично"]'::jsonb, 15),

-- Size/Dimension
('788aa565-b002-4925-b1d6-94062d831510', 'Standard Size', 'Стандартен размер', 'select', false, true,
 '["Standard", "Metric", "Custom", "Universal"]'::jsonb,
 '["Стандартен", "Метричен", "По поръчка", "Универсален"]'::jsonb, 16);

-- Office & School attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Condition
('a0000000-0000-0000-0000-000000000013', 'Condition', 'Състояние', 'select', true, true,
 '["New", "Like New", "Good", "Used"]'::jsonb,
 '["Ново", "Като ново", "Добро", "Използвано"]'::jsonb, 1),

-- Paper Size
('a0000000-0000-0000-0000-000000000013', 'Paper Size', 'Размер хартия', 'select', false, true,
 '["A4", "A5", "A3", "Letter", "Legal", "Universal"]'::jsonb,
 '["A4", "A5", "A3", "Letter", "Legal", "Универсален"]'::jsonb, 10),

-- Capacity
('a0000000-0000-0000-0000-000000000013', 'Capacity', 'Капацитет', 'select', false, true,
 '["Small (Under 50 sheets)", "Medium (50-200 sheets)", "Large (200-500 sheets)", "Extra Large (500+ sheets)"]'::jsonb,
 '["Малък (под 50 листа)", "Среден (50-200 листа)", "Голям (200-500 листа)", "Много голям (500+ листа)"]'::jsonb, 11),

-- Ergonomic
('a0000000-0000-0000-0000-000000000013', 'Ergonomic', 'Ергономичен', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 12),

-- Material
('a0000000-0000-0000-0000-000000000013', 'Material', 'Материал', 'select', false, true,
 '["Plastic", "Metal", "Wood", "Leather/PU", "Fabric", "Paper/Cardboard"]'::jsonb,
 '["Пластмаса", "Метал", "Дърво", "Кожа/PU", "Плат", "Хартия/Картон"]'::jsonb, 13),

-- Color
('a0000000-0000-0000-0000-000000000013', 'Color', 'Цвят', 'select', false, true,
 '["Black", "White", "Blue", "Red", "Green", "Multi-Color", "Brown", "Grey"]'::jsonb,
 '["Черен", "Бял", "Син", "Червен", "Зелен", "Многоцветен", "Кафяв", "Сив"]'::jsonb, 14),

-- Adjustable Height (for chairs/desks)
('a0000000-0000-0000-0000-000000000013', 'Height Adjustable', 'Регулируема височина', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 15),

-- Set/Pack Size
('a0000000-0000-0000-0000-000000000013', 'Pack Size', 'Брой в опаковка', 'select', false, true,
 '["Single", "2-5 Pack", "6-10 Pack", "12+ Pack", "Bulk"]'::jsonb,
 '["Единичен", "2-5 броя", "6-10 броя", "12+ броя", "На едро"]'::jsonb, 16);
;
