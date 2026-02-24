
-- KIDS CATEGORY IMPROVEMENT - PHASE 3: Category Attributes
-- ================================================================

-- Update existing global Kids attributes with better options
UPDATE category_attributes 
SET options = '["0-3 months", "3-6 months", "6-12 months", "1-2 years", "2-3 years", "3-5 years", "5-7 years", "7-10 years", "10-12 years", "12+ years"]'::jsonb,
    options_bg = '["0-3 месеца", "3-6 месеца", "6-12 месеца", "1-2 години", "2-3 години", "3-5 години", "5-7 години", "7-10 години", "10-12 години", "12+ години"]'::jsonb
WHERE category_id = 'a6583270-7d99-4414-b522-c5cbee4d1f04' AND name = 'Age Range';

-- Add new global Kids attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('a6583270-7d99-4414-b522-c5cbee4d1f04', 'Brand', 'Марка', 'select', false, true, 
 '["Fisher-Price", "Pampers", "Huggies", "Chicco", "Maxi-Cosi", "Graco", "LEGO", "Hasbro", "Mattel", "VTech", "Baby Bjorn", "Ergobaby", "Britax", "Cybex", "Bugaboo", "Other"]'::jsonb,
 '["Fisher-Price", "Pampers", "Huggies", "Chicco", "Maxi-Cosi", "Graco", "LEGO", "Hasbro", "Mattel", "VTech", "Baby Bjorn", "Ergobaby", "Britax", "Cybex", "Bugaboo", "Друга"]'::jsonb, 5),
('a6583270-7d99-4414-b522-c5cbee4d1f04', 'New or Used', 'Ново или употребявано', 'select', false, true,
 '["New", "New with Tags", "Like New", "Good", "Fair"]'::jsonb,
 '["Ново", "Ново с етикет", "Като ново", "Добро", "Задоволително"]'::jsonb, 6);

-- Baby Gear Attributes (199c6ea7-63f6-44d7-998a-ec9455e24cf8)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Stroller Type', 'Тип количка', 'select', false, true,
 '["Full-Size", "Lightweight", "Jogging", "Double/Twin", "Travel System", "Umbrella", "3-in-1"]'::jsonb,
 '["Пълноразмерна", "Лека", "Джогинг", "Двойна", "Комбинирана", "Чадър", "3-в-1"]'::jsonb, 1),
('199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Car Seat Type', 'Тип столче за кола', 'select', false, true,
 '["Infant (0-13kg)", "Convertible", "Forward-Facing (9-36kg)", "Booster", "All-in-One"]'::jsonb,
 '["Бебешко (0-13кг)", "Конвертируемо", "По посока (9-36кг)", "Бустер", "Всичко в едно"]'::jsonb, 2),
('199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Car Seat Group', 'Група столче', 'select', false, true,
 '["Group 0+ (0-13kg)", "Group 1 (9-18kg)", "Group 2-3 (15-36kg)", "Group 0+/1", "Group 1/2/3", "All Groups"]'::jsonb,
 '["Група 0+ (0-13кг)", "Група 1 (9-18кг)", "Група 2-3 (15-36кг)", "Група 0+/1", "Група 1/2/3", "Всички групи"]'::jsonb, 3),
('199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'ISOFIX', 'ISOFIX', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 4),
('199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Weight Capacity', 'Макс. тегло', 'select', false, true,
 '["Up to 9kg", "Up to 13kg", "Up to 18kg", "Up to 25kg", "Up to 36kg"]'::jsonb,
 '["До 9кг", "До 13кг", "До 18кг", "До 25кг", "До 36кг"]'::jsonb, 5),
('199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Foldable', 'Сгъваема', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 6),
('199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Travel Friendly', 'Подходящо за пътуване', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 7);
;
