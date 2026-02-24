
-- WHOLESALE ATTRIBUTES - Listing & Display (Part 8)

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 40. Stock Status
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Stock Status', 'Наличност', 'select', true, true,
'["In Stock", "Pre-Order", "Made to Order", "Limited Stock", "Out of Stock", "Continuous Production", "Seasonal"]',
'["В наличност", "Предварителна поръчка", "Производство по поръчка", "Ограничено количество", "Не е в наличност", "Постоянно производство", "Сезонен"]', 40),

-- 41. Listing Type
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Listing Type', 'Тип обява', 'select', false, true,
'["Single Product", "Product Line", "Product Catalog", "Assortment/Mix", "Clearance Lot", "Sample Pack", "Starter Kit"]',
'["Единичен продукт", "Продуктова линия", "Каталог", "Асортимент/Микс", "Партида разпродажба", "Пакет мостри", "Стартов комплект"]', 41),

-- 42. Images Available
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Images Available', 'Налични изображения', 'multiselect', false, false,
'["Product Only", "Lifestyle Images", "360° View", "Video", "Customizable Mockups", "High Resolution", "Packaging Photos", "Factory Photos"]',
'["Само продукт", "Лайфстайл снимки", "360° изглед", "Видео", "Редактируеми макети", "Висока резолюция", "Снимки на опаковка", "Снимки от завода"]', 42),

-- 43. Data Sheet
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Data Sheet', 'Техническа спецификация', 'select', false, false,
'["Available PDF", "Available Online", "Upon Request", "Not Available", "Multiple Languages"]',
'["Наличен PDF", "Наличен онлайн", "При запитване", "Не е наличен", "На няколко езика"]', 43),

-- 44. Product Warranty
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Product Warranty', 'Гаранция', 'select', false, true,
'["No Warranty", "30 Days", "90 Days", "6 Months", "1 Year", "2 Years", "Extended Available", "Manufacturer Warranty"]',
'["Без гаранция", "30 дни", "90 дни", "6 месеца", "1 година", "2 години", "Удължена гаранция", "Гаранция от производител"]', 44),

-- 45. Return Policy
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Return Policy', 'Политика за връщане', 'select', false, true,
'["No Returns", "Defective Only", "7 Day Returns", "14 Day Returns", "30 Day Returns", "Exchange Only", "Store Credit"]',
'["Без връщане", "Само дефектни", "7 дни за връщане", "14 дни за връщане", "30 дни за връщане", "Само замяна", "Кредит в магазина"]', 45);
;
