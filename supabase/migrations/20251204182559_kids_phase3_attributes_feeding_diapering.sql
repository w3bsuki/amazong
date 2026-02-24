
-- KIDS CATEGORY IMPROVEMENT - PHASE 3B: Feeding & Diapering Attributes
-- ================================================================

-- Baby Feeding Attributes (eaf2abb5-5395-486b-9b1a-abafeea044f4)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Bottle Material', 'Материал на шишето', 'select', false, true,
 '["Plastic", "Glass", "Silicone", "Stainless Steel"]'::jsonb,
 '["Пластмаса", "Стъкло", "Силикон", "Неръждаема стомана"]'::jsonb, 1),
('eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Bottle Size', 'Размер на шишето', 'select', false, true,
 '["60ml", "125ml", "150ml", "240ml", "260ml", "300ml+"]'::jsonb,
 '["60мл", "125мл", "150мл", "240мл", "260мл", "300мл+"]'::jsonb, 2),
('eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Anti-Colic', 'Антиколик', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 3),
('eaf2abb5-5395-486b-9b1a-abafeea044f4', 'BPA Free', 'Без BPA', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 4),
('eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Breast Pump Type', 'Тип помпа', 'select', false, true,
 '["Manual", "Single Electric", "Double Electric", "Wearable"]'::jsonb,
 '["Ръчна", "Единична електрическа", "Двойна електрическа", "Носима"]'::jsonb, 5),
('eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Dishwasher Safe', 'За съдомиялна', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 6);

-- Diapering Attributes (4e466f5b-7948-4939-87a1-e5febc83c389)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('4e466f5b-7948-4939-87a1-e5febc83c389', 'Diaper Size', 'Размер пелена', 'select', false, true,
 '["Newborn (up to 4kg)", "Size 1 (2-5kg)", "Size 2 (3-6kg)", "Size 3 (4-9kg)", "Size 4 (7-14kg)", "Size 5 (11-25kg)", "Size 6 (16kg+)"]'::jsonb,
 '["Новородено (до 4кг)", "Размер 1 (2-5кг)", "Размер 2 (3-6кг)", "Размер 3 (4-9кг)", "Размер 4 (7-14кг)", "Размер 5 (11-25кг)", "Размер 6 (16кг+)"]'::jsonb, 1),
('4e466f5b-7948-4939-87a1-e5febc83c389', 'Diaper Type', 'Тип пелена', 'select', false, true,
 '["Disposable", "Cloth", "Swim Diapers", "Pull-Ups/Training"]'::jsonb,
 '["Еднократни", "Памучни", "Бански пелени", "Гащички за обучение"]'::jsonb, 2),
('4e466f5b-7948-4939-87a1-e5febc83c389', 'Pack Size', 'Опаковка', 'select', false, true,
 '["Trial Pack (1-20)", "Standard Pack (20-40)", "Mega Pack (40-80)", "Monthly Box (80+)"]'::jsonb,
 '["Пробна (1-20)", "Стандартна (20-40)", "Мега (40-80)", "Месечна кутия (80+)"]'::jsonb, 3),
('4e466f5b-7948-4939-87a1-e5febc83c389', 'Fragrance Free', 'Без аромат', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 4),
('4e466f5b-7948-4939-87a1-e5febc83c389', 'Eco-Friendly', 'Еко', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 5);
;
