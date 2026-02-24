
-- WHOLESALE ATTRIBUTES - Additional Business Attributes (Part 9)

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 46. Response Time
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Response Time', 'Време за отговор', 'select', false, true,
'["Within 1 Hour", "Within 24 Hours", "1-2 Business Days", "2-3 Business Days", "Contact for Quote"]',
'["До 1 час", "До 24 часа", "1-2 работни дни", "2-3 работни дни", "Свържете се за оферта"]', 46),

-- 47. Trade Shows
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Trade Shows', 'Търговски изложения', 'multiselect', false, false,
'["Canton Fair", "Global Sources", "Ambiente", "Spielwarenmesse", "Cosmoprof", "ISPO", "CES", "IFA", "Bulgarian Exhibitions"]',
'["Кантонски панаир", "Global Sources", "Ambiente", "Spielwarenmesse", "Cosmoprof", "ISPO", "CES", "IFA", "Български изложения"]', 47),

-- 48. Communication Languages
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Communication Languages', 'Езици за комуникация', 'multiselect', false, true,
'["English", "Bulgarian", "German", "Russian", "Turkish", "Chinese", "Spanish", "French", "Italian"]',
'["Английски", "Български", "Немски", "Руски", "Турски", "Китайски", "Испански", "Френски", "Италиански"]', 48),

-- 49. Business Documents
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Business Documents', 'Бизнес документи', 'multiselect', false, false,
'["Company Profile", "Business License", "Tax Registration", "Quality Certificates", "Product Certifications", "Insurance Certificate", "Bank Reference"]',
'["Фирмен профил", "Бизнес лиценз", "Данъчна регистрация", "Сертификати за качество", "Продуктови сертификати", "Застрахователен сертификат", "Банкова референция"]', 49),

-- 50. Dropshipping Available
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Dropshipping Available', 'Дропшипинг', 'select', false, true,
'["Yes - Full Service", "Yes - Blind Shipping", "Yes - Limited", "No Dropshipping", "Upon Agreement"]',
'["Да - Пълна услуга", "Да - Без марка на изпращач", "Да - Ограничено", "Не се предлага", "По договаряне"]', 50),

-- 51. Order Processing
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Order Processing', 'Обработка на поръчки', 'select', false, true,
'["Same Day Processing", "1-2 Days Processing", "3-5 Days Processing", "Made to Order", "Contact for Timeline"]',
'["Обработка същия ден", "Обработка 1-2 дни", "Обработка 3-5 дни", "Производство по поръчка", "Свържете се за график"]', 51),

-- 52. Warehouse Location
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Warehouse Location', 'Склад', 'multiselect', false, true,
'["China Warehouse", "EU Warehouse", "Bulgaria Warehouse", "US Warehouse", "UK Warehouse", "Factory Direct", "Multiple Locations"]',
'["Склад в Китай", "Склад в ЕС", "Склад в България", "Склад в САЩ", "Склад в UK", "Директно от завод", "Множество локации"]', 52);
;
