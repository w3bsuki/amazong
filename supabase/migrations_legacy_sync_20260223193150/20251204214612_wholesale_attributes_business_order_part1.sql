
-- WHOLESALE ATTRIBUTES - Business & Order Specifications (Part 1)
-- Root category ID: 405303e7-dbab-4a7a-8654-4e1e1ff3074f

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 1. Minimum Order Quantity (MOQ)
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Minimum Order Quantity (MOQ)', 'Минимална поръчка (МОQ)', 'select', true, true, 
'["1 Unit", "5 Units", "10 Units", "25 Units", "50 Units", "100 Units", "250 Units", "500 Units", "1,000 Units", "5,000+ Units", "Negotiable"]',
'["1 брой", "5 броя", "10 броя", "25 броя", "50 броя", "100 броя", "250 броя", "500 броя", "1,000 броя", "5,000+ броя", "Договаряне"]', 1),

-- 2. Unit Type
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Unit Type', 'Единица мярка', 'select', true, true,
'["Piece", "Pair", "Set", "Pack", "Box", "Carton", "Case", "Pallet", "Container", "Roll", "Meter", "Kilogram", "Liter"]',
'["Брой", "Чифт", "Комплект", "Пакет", "Кутия", "Кашон", "Каса", "Палет", "Контейнер", "Ролка", "Метър", "Килограм", "Литър"]', 2),

-- 3. Lead Time
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Lead Time', 'Срок за доставка', 'select', false, true,
'["Same Day", "1-3 Days", "3-7 Days", "1-2 Weeks", "2-4 Weeks", "1-2 Months", "2-3 Months", "Custom Order"]',
'["В същия ден", "1-3 дни", "3-7 дни", "1-2 седмици", "2-4 седмици", "1-2 месеца", "2-3 месеца", "По поръчка"]', 3),

-- 4. Sample Available
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Sample Available', 'Мостри', 'select', false, true,
'["Yes - Free Sample", "Yes - Paid Sample", "Yes - Shipping Cost Only", "No Sample Available", "Upon Request"]',
'["Да - Безплатна мостра", "Да - Платена мостра", "Да - Само доставка", "Не се предлага", "При запитване"]', 4),

-- 5. Customization Available
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Customization Available', 'Персонализация', 'select', false, true,
'["Yes - OEM", "Yes - ODM", "Yes - OEM/ODM", "Logo Printing", "Custom Packaging", "Private Label", "Not Available"]',
'["Да - OEM", "Да - ODM", "Да - OEM/ODM", "Печат на лого", "Персонализирана опаковка", "Частна марка", "Не се предлага"]', 5),

-- 6. Private Label
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Private Label', 'Частна марка', 'select', false, true,
'["Available", "Available (MOQ Required)", "Not Available"]',
'["Налично", "Налично (с минимална поръчка)", "Не се предлага"]', 6);
;
