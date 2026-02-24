
-- Add Bedding & Bath specific attributes
-- L1 ID: 4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
-- Material
('4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Material', 'Материал', 'select', false, true,
 '["Cotton", "Egyptian Cotton", "Organic Cotton", "Linen", "Silk", "Bamboo", "Microfiber", "Polyester", "Flannel", "Satin", "Tencel/Lyocell", "Blend"]'::jsonb,
 '["Памук", "Египетски памук", "Органичен памук", "Лен", "Коприна", "Бамбук", "Микрофибър", "Полиестер", "Фланела", "Сатен", "Тенсел/Лиосел", "Смес"]'::jsonb, 10),

-- Thread Count
('4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Thread Count', 'Брой нишки', 'select', false, true,
 '["Under 200", "200-300", "300-400", "400-600", "600-800", "800-1000", "1000+"]'::jsonb,
 '["Под 200", "200-300", "300-400", "400-600", "600-800", "800-1000", "1000+"]'::jsonb, 11),

-- Bed Size
('4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Bed Size', 'Размер на легло', 'select', false, true,
 '["Single (90x190)", "Single XL (90x200)", "Double (140x200)", "Queen (160x200)", "King (180x200)", "Super King (200x200)", "Universal"]'::jsonb,
 '["Единичен (90x190)", "Единичен XL (90x200)", "Двоен (140x200)", "Queen (160x200)", "King (180x200)", "Супер King (200x200)", "Универсален"]'::jsonb, 12),

-- GSM (Towel Weight)
('4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Towel GSM', 'GSM на кърпите', 'select', false, true,
 '["Light (Under 400g/m²)", "Medium (400-600g/m²)", "Heavy/Plush (600-800g/m²)", "Luxury (800g/m²+)"]'::jsonb,
 '["Леки (под 400г/м²)", "Средни (400-600г/м²)", "Тежки/Плюшени (600-800г/м²)", "Луксозни (800г/м²+)"]'::jsonb, 13),

-- Hypoallergenic
('4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Hypoallergenic', 'Хипоалергичен', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 14),

-- Machine Washable
('4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Machine Washable', 'Може да се пере в машина', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 15),

-- Weave Type
('4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Weave Type', 'Тип тъкане', 'select', false, true,
 '["Percale", "Sateen", "Jersey", "Twill", "Flannel", "Jacquard", "Plain/Basic"]'::jsonb,
 '["Перкал", "Сатен", "Трико", "Кепър", "Фланела", "Жакард", "Обикновено"]'::jsonb, 16),

-- Fill Type (for duvets/pillows)
('4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Fill Type', 'Тип пълнеж', 'select', false, true,
 '["Down", "Down Alternative", "Feather", "Memory Foam", "Polyester Fiberfill", "Cotton", "Wool", "Latex"]'::jsonb,
 '["Пух", "Алтернатива на пух", "Пера", "Мемори пяна", "Полиестерен пълнеж", "Памук", "Вълна", "Латекс"]'::jsonb, 17),

-- Warmth Level
('4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Warmth Level', 'Ниво на топлина', 'select', false, true,
 '["Lightweight (Summer)", "Medium (All Season)", "Warm (Winter)", "Extra Warm (Cold Climate)"]'::jsonb,
 '["Леко (лятно)", "Средно (целогодишно)", "Топло (зимно)", "Много топло (студен климат)"]'::jsonb, 18),

-- Set Includes
('4abbc6bc-3a9c-4fb3-b45d-ecda12a2d425', 'Set Includes', 'Комплектът включва', 'multiselect', false, true,
 '["Fitted Sheet", "Flat Sheet", "Pillowcases", "Duvet Cover", "Shams", "Bed Skirt", "Decorative Pillows"]'::jsonb,
 '["Чаршаф с ластик", "Плосък чаршаф", "Калъфки за възглавници", "Калъф за завивка", "Шамове", "Пола за легло", "Декоративни възглавници"]'::jsonb, 19);
;
