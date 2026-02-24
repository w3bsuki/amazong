
-- Garden & Outdoor - add only missing attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Plant Type (missing)
('575c6e46-23ab-40b6-b948-f4215c61972b', 'Plant Type', 'Тип растение', 'select', false, true,
 '["Annual", "Perennial", "Evergreen", "Deciduous", "Succulent", "Tropical", "Herb", "Vegetable"]'::jsonb,
 '["Едногодишно", "Многогодишно", "Вечнозелено", "Листопадно", "Сукулент", "Тропическо", "Билка", "Зеленчук"]'::jsonb, 15),

-- Seating Capacity (missing)
('575c6e46-23ab-40b6-b948-f4215c61972b', 'Seating Capacity', 'Брой места', 'select', false, true,
 '["1 Person", "2 People", "3-4 People", "5-6 People", "7+ People"]'::jsonb,
 '["1 човек", "2 човека", "3-4 човека", "5-6 човека", "7+ човека"]'::jsonb, 16);

-- Household & Cleaning - all attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Power Type for Cleaning
('c888b54a-6b8c-4931-9546-493ce79d5d70', 'Power Type', 'Тип захранване', 'select', false, true,
 '["Corded Electric", "Cordless/Battery", "Manual", "Rechargeable"]'::jsonb,
 '["Електрическо с кабел", "Безжично/Батерия", "Ръчно", "Акумулаторно"]'::jsonb, 10),

-- Suitable For
('c888b54a-6b8c-4931-9546-493ce79d5d70', 'Suitable For', 'Подходящо за', 'multiselect', false, true,
 '["Hard Floors", "Carpet", "Upholstery", "Windows", "Kitchen", "Bathroom", "Outdoor", "Pet Hair"]'::jsonb,
 '["Твърди подове", "Килими", "Тапицерия", "Прозорци", "Кухня", "Баня", "Двор", "Косми от домашни любимци"]'::jsonb, 11),

-- Scent
('c888b54a-6b8c-4931-9546-493ce79d5d70', 'Scent', 'Аромат', 'select', false, true,
 '["Unscented", "Lavender", "Lemon/Citrus", "Ocean/Fresh", "Pine/Forest", "Floral", "Custom/Other"]'::jsonb,
 '["Без аромат", "Лавандула", "Лимон/Цитрус", "Океан/Свежест", "Бор/Гора", "Цветен", "Друг"]'::jsonb, 12),

-- Eco-Friendly
('c888b54a-6b8c-4931-9546-493ce79d5d70', 'Eco-Friendly', 'Екологичен', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 13),

-- Tank Capacity
('c888b54a-6b8c-4931-9546-493ce79d5d70', 'Tank Capacity', 'Обем на резервоара', 'select', false, true,
 '["Under 1L", "1-2L", "2-4L", "4L+"]'::jsonb,
 '["Под 1L", "1-2L", "2-4L", "4L+"]'::jsonb, 14),

-- Refillable
('c888b54a-6b8c-4931-9546-493ce79d5d70', 'Refillable', 'За многократна употреба', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 15),

-- Material
('c888b54a-6b8c-4931-9546-493ce79d5d70', 'Material', 'Материал', 'select', false, true,
 '["Plastic", "Microfiber", "Metal", "Rubber", "Natural Fibers", "Silicone"]'::jsonb,
 '["Пластмаса", "Микрофибър", "Метал", "Гума", "Естествени влакна", "Силикон"]'::jsonb, 16),

-- Condition
('c888b54a-6b8c-4931-9546-493ce79d5d70', 'Condition', 'Състояние', 'select', true, true,
 '["New", "Like New", "Good", "Used"]'::jsonb,
 '["Ново", "Като ново", "Добро", "Използвано"]'::jsonb, 1);
;
