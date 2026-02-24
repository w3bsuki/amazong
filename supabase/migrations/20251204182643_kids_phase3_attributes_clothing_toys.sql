
-- KIDS CATEGORY IMPROVEMENT - PHASE 3D: Clothing & Toys Attributes
-- ================================================================

-- Kids Clothing Attributes (6217abb4-525d-491f-9c80-3f3c5b5e0326)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('6217abb4-525d-491f-9c80-3f3c5b5e0326', 'Kids Size', 'Размер', 'select', false, true,
 '["0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M", "2T", "3T", "4T", "5", "6", "7", "8", "10", "12", "14", "16"]'::jsonb,
 '["0-3М", "3-6М", "6-9М", "9-12М", "12-18М", "18-24М", "2Г", "3Г", "4Г", "5", "6", "7", "8", "10", "12", "14", "16"]'::jsonb, 1),
('6217abb4-525d-491f-9c80-3f3c5b5e0326', 'Kids Shoe Size EU', 'Размер обувки EU', 'select', false, true,
 '["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35"]'::jsonb,
 '["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35"]'::jsonb, 2),
('6217abb4-525d-491f-9c80-3f3c5b5e0326', 'Fabric', 'Материя', 'select', false, true,
 '["Cotton", "Organic Cotton", "Polyester", "Fleece", "Denim", "Wool Blend", "Mixed"]'::jsonb,
 '["Памук", "Органичен памук", "Полиестер", "Полар", "Дънков", "Вълнена смес", "Смес"]'::jsonb, 3),
('6217abb4-525d-491f-9c80-3f3c5b5e0326', 'Season', 'Сезон', 'select', false, true,
 '["Spring/Summer", "Fall/Winter", "All Season"]'::jsonb,
 '["Пролет/Лято", "Есен/Зима", "Всички сезони"]'::jsonb, 4),
('6217abb4-525d-491f-9c80-3f3c5b5e0326', 'Clothing Type', 'Тип облекло', 'select', false, true,
 '["Everyday", "Formal", "Activewear", "Sleepwear", "School Uniform", "Swimwear"]'::jsonb,
 '["Ежедневно", "Официално", "Спортно", "За спане", "Училищна униформа", "Бански"]'::jsonb, 5);

-- Toys & Games Attributes (a0000000-0000-0000-0000-000000000012)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('a0000000-0000-0000-0000-000000000012', 'Toy Type', 'Тип играчка', 'select', false, true,
 '["Building", "Educational", "Dolls", "Outdoor", "Electronic", "Plush", "Board Games", "Arts & Crafts", "Action Figures", "RC"]'::jsonb,
 '["Конструктори", "Образователни", "Кукли", "За навън", "Електронни", "Плюшени", "Настолни игри", "Изкуства", "Фигурки", "RC"]'::jsonb, 1),
('a0000000-0000-0000-0000-000000000012', 'Skill Development', 'Развитие на умения', 'multiselect', false, true,
 '["Motor Skills", "Cognitive", "Creativity", "Social Skills", "Language", "STEM", "Problem Solving"]'::jsonb,
 '["Моторика", "Когнитивни", "Креативност", "Социални", "Език", "STEM", "Логика"]'::jsonb, 2),
('a0000000-0000-0000-0000-000000000012', 'Number of Pieces', 'Брой части', 'select', false, true,
 '["1-50", "50-100", "100-250", "250-500", "500-1000", "1000+"]'::jsonb,
 '["1-50", "50-100", "100-250", "250-500", "500-1000", "1000+"]'::jsonb, 3),
('a0000000-0000-0000-0000-000000000012', 'Battery Required', 'Батерии', 'select', false, true,
 '["No Batteries", "AA", "AAA", "Built-in Rechargeable", "Button Cell"]'::jsonb,
 '["Без батерии", "AA", "AAA", "Вградена зареждаема", "Копче"]'::jsonb, 4),
('a0000000-0000-0000-0000-000000000012', 'LEGO Theme', 'LEGO Тема', 'select', false, true,
 '["City", "Technic", "Creator", "Star Wars", "Marvel", "Friends", "Ninjago", "Duplo", "Ideas", "Architecture", "Harry Potter", "Minecraft", "Other"]'::jsonb,
 '["City", "Technic", "Creator", "Star Wars", "Marvel", "Friends", "Ninjago", "Duplo", "Ideas", "Architecture", "Harry Potter", "Minecraft", "Друга"]'::jsonb, 5),
('a0000000-0000-0000-0000-000000000012', 'Indoor/Outdoor', 'За дома/На открито', 'select', false, true,
 '["Indoor Only", "Outdoor Only", "Both"]'::jsonb,
 '["Само за вкъщи", "Само за навън", "И двете"]'::jsonb, 6),
('a0000000-0000-0000-0000-000000000012', 'Multiplayer', 'Мултиплейър', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 7);
;
