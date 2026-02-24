
-- WHOLESALE ATTRIBUTES - Extra Attributes (Part 11)

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 61. Supplier Verification Level
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Verification Level', 'Ниво на верификация', 'select', false, true,
'["Verified Premium", "Verified Standard", "Basic Verified", "Pending Verification", "Self-Reported"]',
'["Верифициран Премиум", "Верифициран Стандарт", "Базова верификация", "В процес", "Самодоклад"]', 61),

-- 62. Sample Lead Time
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Sample Lead Time', 'Срок за мостри', 'select', false, true,
'["1-3 Days", "3-7 Days", "1-2 Weeks", "2-4 Weeks", "Upon Request"]',
'["1-3 дни", "3-7 дни", "1-2 седмици", "2-4 седмици", "При запитване"]', 62),

-- 63. Labeling Options
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Labeling Options', 'Опции за етикетиране', 'multiselect', false, true,
'["No Label", "Seller Label", "Custom Label", "Multi-Language Label", "CE/FCC Marking", "Country-Specific Labels"]',
'["Без етикет", "Етикет на продавача", "Персонализиран етикет", "Многоезичен етикет", "CE/FCC маркировка", "Етикети за конкретна държава"]', 63),

-- 64. Color Options
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Color Options', 'Цветови опции', 'select', false, true,
'["Single Color", "2-5 Colors", "5-10 Colors", "10+ Colors", "Custom Colors Available", "Pantone Matching"]',
'["Един цвят", "2-5 цвята", "5-10 цвята", "10+ цвята", "Персонализирани цветове", "Pantone съвпадение"]', 64),

-- 65. Size Range
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Size Range', 'Размерна гама', 'select', false, true,
'["One Size", "S-XL", "XS-3XL", "Kids Sizes", "Plus Sizes", "Custom Sizes", "Standard Industrial"]',
'["Един размер", "S-XL", "XS-3XL", "Детски размери", "Макси размери", "По поръчка", "Стандарт индустриален"]', 65),

-- 66. Reorder Frequency
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Reorder Frequency', 'Честота на повторни поръчки', 'select', false, false,
'["High - Weekly", "Medium - Monthly", "Low - Quarterly", "Seasonal", "One-Time/Bulk"]',
'["Висока - Седмично", "Средна - Месечно", "Ниска - Тримесечно", "Сезонна", "Еднократна/Едра"]', 66),

-- 67. Profit Margin Potential
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Profit Margin', 'Марж на печалба', 'select', false, false,
'["High (50%+)", "Good (30-50%)", "Standard (15-30%)", "Low (<15%)", "Variable"]',
'["Висок (50%+)", "Добър (30-50%)", "Стандартен (15-30%)", "Нисък (<15%)", "Променлив"]', 67),

-- 68. Age Restriction
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Age Restriction', 'Възрастови ограничения', 'select', false, true,
'["No Restriction", "18+ Only", "21+ Only", "Children Safe", "Professional Use Only"]',
'["Без ограничения", "Само 18+", "Само 21+", "Безопасно за деца", "Само професионална употреба"]', 68),

-- 69. Shelf Life
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Shelf Life', 'Срок на годност', 'select', false, true,
'["No Expiry", "3 Months", "6 Months", "1 Year", "2 Years", "3+ Years", "Check Product"]',
'["Без срок", "3 месеца", "6 месеца", "1 година", "2 години", "3+ години", "Проверете продукта"]', 69),

-- 70. Storage Requirements
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Storage Requirements', 'Изисквания за съхранение', 'select', false, true,
'["No Special Requirements", "Cool & Dry", "Refrigerated", "Frozen", "Climate Controlled", "Away from Sunlight"]',
'["Без специални изисквания", "Хладно и сухо", "Охладено", "Замразено", "Климатизирано", "Далеч от слънцето"]', 70);
;
