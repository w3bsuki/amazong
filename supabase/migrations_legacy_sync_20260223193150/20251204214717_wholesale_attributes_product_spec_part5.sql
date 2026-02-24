
-- WHOLESALE ATTRIBUTES - Product Specifications (Part 5)

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 24. Brand Type
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Brand Type', 'Тип марка', 'select', false, true,
'["OEM/Custom Brand", "No Brand/Generic", "Licensed Brand", "In-house Brand", "Original Brand", "White Label"]',
'["OEM/По поръчка", "Без марка/Генерично", "Лицензирана марка", "Собствена марка", "Оригинална марка", "Бяла етикетка"]', 24),

-- 25. Quality Grade
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Quality Grade', 'Клас качество', 'select', false, true,
'["Premium/A+ Grade", "Standard/A Grade", "Economy/B Grade", "Budget/C Grade", "Mixed Grade", "Export Quality"]',
'["Премиум/A+ клас", "Стандарт/A клас", "Икономичен/B клас", "Бюджет/C клас", "Смесен клас", "Експортно качество"]', 25),

-- 26. Product Condition
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Product Condition', 'Състояние на продукта', 'select', true, true,
'["Brand New", "Refurbished", "Overstock", "Closeout/Clearance", "Returns", "B-Stock", "Open Box", "Seconds"]',
'["Чисто нов", "Рефърбиш", "Свръхналичност", "Разпродажба", "Върнати", "B-Сток", "Отворена кутия", "Втори клас"]', 26),

-- 27. Material
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Material', 'Материал', 'multiselect', false, true,
'["Plastic", "Metal", "Wood", "Glass", "Cotton", "Polyester", "Leather", "PU Leather", "Silicone", "Rubber", "Stainless Steel", "Aluminum", "ABS", "PVC", "Nylon", "Ceramic", "Paper", "Bamboo"]',
'["Пластмаса", "Метал", "Дърво", "Стъкло", "Памук", "Полиестер", "Кожа", "PU кожа", "Силикон", "Гума", "Неръждаема стомана", "Алуминий", "ABS", "PVC", "Найлон", "Керамика", "Хартия", "Бамбук"]', 27);
;
