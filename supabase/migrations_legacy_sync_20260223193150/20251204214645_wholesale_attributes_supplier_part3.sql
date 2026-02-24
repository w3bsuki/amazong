
-- WHOLESALE ATTRIBUTES - Supplier & Business Information (Part 3)

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 12. Supplier Type
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Supplier Type', 'Тип доставчик', 'select', false, true,
'["Manufacturer", "Trading Company", "Distributor", "Wholesaler", "Agent", "Factory Direct", "Import/Export Company"]',
'["Производител", "Търговска компания", "Дистрибутор", "Търговец на едро", "Агент", "Директно от завод", "Вносител/Износител"]', 12),

-- 13. Business Type
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Business Type', 'Тип бизнес', 'select', false, true,
'["Factory", "Workshop", "Retail + Wholesale", "Wholesale Only", "Import/Export", "Own Production + Trading"]',
'["Завод", "Работилница", "На дребно + Едро", "Само на едро", "Внос/Износ", "Собствено производство + Търговия"]', 13),

-- 14. Verified Supplier
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Verified Supplier', 'Верифициран доставчик', 'select', false, true,
'["Yes - Gold Supplier", "Yes - Verified", "Yes - Assessed", "Yes - Trade Assurance", "Pending Verification", "Not Verified"]',
'["Да - Злато доставчик", "Да - Верифициран", "Да - Оценен", "Да - Търговска гаранция", "В процес на верификация", "Неверифициран"]', 14),

-- 15. Years in Business
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Years in Business', 'Години в бизнеса', 'select', false, true,
'["Less than 1 Year", "1-3 Years", "3-5 Years", "5-10 Years", "10-20 Years", "20+ Years"]',
'["По-малко от 1 година", "1-3 години", "3-5 години", "5-10 години", "10-20 години", "20+ години"]', 15),

-- 16. Export Markets
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Export Markets', 'Експортни пазари', 'multiselect', false, true,
'["Europe", "North America", "Asia", "Middle East", "Africa", "South America", "Australia/Oceania", "Worldwide", "Bulgaria Only", "EU Only"]',
'["Европа", "Северна Америка", "Азия", "Близък изток", "Африка", "Южна Америка", "Австралия/Океания", "Целият свят", "Само България", "Само ЕС"]', 16),

-- 17. Production Capacity
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Production Capacity', 'Производствен капацитет', 'select', false, true,
'["Small (<1,000/month)", "Medium (1,000-10,000/month)", "Large (10,000-100,000/month)", "Industrial (100,000+/month)", "Custom/Variable"]',
'["Малък (<1,000/месец)", "Среден (1,000-10,000/месец)", "Голям (10,000-100,000/месец)", "Индустриален (100,000+/месец)", "По поръчка/Променлив"]', 17);
;
