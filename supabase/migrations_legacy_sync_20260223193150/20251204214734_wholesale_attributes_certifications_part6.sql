
-- WHOLESALE ATTRIBUTES - Certifications & Compliance (Part 6)

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 28. Certifications
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Certifications', 'Сертификати', 'multiselect', false, true,
'["CE", "FCC", "RoHS", "REACH", "FDA", "ISO 9001", "ISO 14001", "BSCI", "SEDEX", "SGS", "TUV", "UL", "GS", "CB", "CCC", "EMC", "LFGB", "EN71", "CPSIA", "Oeko-Tex"]',
'["CE", "FCC", "RoHS", "REACH", "FDA", "ISO 9001", "ISO 14001", "BSCI", "SEDEX", "SGS", "TUV", "UL", "GS", "CB", "CCC", "EMC", "LFGB", "EN71", "CPSIA", "Oeko-Tex"]', 28),

-- 29. Country of Origin
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Country of Origin', 'Страна на произход', 'select', false, true,
'["China", "India", "Turkey", "Vietnam", "Bangladesh", "Pakistan", "Thailand", "Indonesia", "Bulgaria", "Romania", "Poland", "Germany", "Italy", "Spain", "USA", "South Korea", "Taiwan", "Japan", "EU"]',
'["Китай", "Индия", "Турция", "Виетнам", "Бангладеш", "Пакистан", "Тайланд", "Индонезия", "България", "Румъния", "Полша", "Германия", "Италия", "Испания", "САЩ", "Южна Корея", "Тайван", "Япония", "ЕС"]', 29),

-- 30. Import License Required
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Import License Required', 'Изисква се лиценз за внос', 'select', false, true,
'["No License Required", "Yes - Standard Import", "Yes - Special Permit", "Product Specific", "Check Local Regulations"]',
'["Не се изисква лиценз", "Да - Стандартен внос", "Да - Специално разрешително", "Специфично за продукта", "Проверете местните регулации"]', 30),

-- 31. Customs Clearance
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Customs Clearance', 'Митническо освобождаване', 'select', false, true,
'["Included in Price", "Buyer Responsibility", "DDP - Seller Handles", "Assistance Provided", "Customs Broker Recommended"]',
'["Включено в цената", "Отговорност на купувача", "DDP - Продавачът обработва", "Предоставена помощ", "Препоръчва се митнически агент"]', 31),

-- 32. Environmental Compliance
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Environmental Compliance', 'Екологично съответствие', 'multiselect', false, true,
'["Eco-Friendly", "Recyclable", "Biodegradable", "BPA-Free", "Phthalate-Free", "Lead-Free", "FSC Certified", "Organic", "Vegan", "Cruelty-Free"]',
'["Екологично чист", "Рециклируем", "Биоразградим", "Без BPA", "Без фталати", "Без олово", "FSC сертифициран", "Органичен", "Веган", "Без жестокост"]', 32);
;
