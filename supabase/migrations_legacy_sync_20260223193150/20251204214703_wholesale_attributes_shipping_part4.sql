
-- WHOLESALE ATTRIBUTES - Shipping & Logistics (Part 4)

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 18. Shipping Method
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Shipping Method', 'Метод на доставка', 'multiselect', false, true,
'["Air Freight", "Sea Freight", "Express (DHL/FedEx/UPS/TNT)", "Rail Freight", "Land Transport", "Courier (Bulgaria)", "Self Pickup"]',
'["Въздушен транспорт", "Морски транспорт", "Експрес (DHL/FedEx/UPS/TNT)", "Жп транспорт", "Сухопътен транспорт", "Куриер (България)", "Самостоятелно вземане"]', 18),

-- 19. Shipping Port
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Shipping Port', 'Пристанище за изпращане', 'select', false, true,
'["Shanghai", "Shenzhen", "Ningbo", "Guangzhou", "Yiwu", "Qingdao", "Rotterdam", "Hamburg", "Varna", "Burgas", "Any China Port", "Any EU Port"]',
'["Шанхай", "Шънджън", "Нинбо", "Гуанджоу", "Иу", "Циндао", "Ротердам", "Хамбург", "Варна", "Бургас", "Всяко китайско пристанище", "Всяко ЕС пристанище"]', 19),

-- 20. Packaging Type
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Packaging Type', 'Тип опаковка', 'multiselect', false, true,
'["OPP Bag", "Polybag", "Blister Pack", "Color Box", "White Box", "Gift Box", "Kraft Box", "Bulk/No Box", "Custom Packaging", "Display Box", "Pallet"]',
'["OPP плик", "Полиетиленов плик", "Блистер", "Цветна кутия", "Бяла кутия", "Подаръчна кутия", "Крафт кутия", "Насипно/Без кутия", "Персонализирана опаковка", "Дисплей кутия", "Палет"]', 20),

-- 21. HS Code Category
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'HS Code Category', 'Категория HS код', 'text', false, false, '[]', '[]', 21),

-- 22. Weight per Unit
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Weight per Unit', 'Тегло на единица', 'select', false, true,
'["<50g", "50-100g", "100-250g", "250-500g", "500g-1kg", "1-2kg", "2-5kg", "5-10kg", "10-25kg", "25-50kg", "50kg+"]',
'["<50г", "50-100г", "100-250г", "250-500г", "500г-1кг", "1-2кг", "2-5кг", "5-10кг", "10-25кг", "25-50кг", "50кг+"]', 22),

-- 23. Carton Dimensions
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Carton Dimensions', 'Размери на кашон', 'select', false, false,
'["Small (30x20x15cm)", "Medium (40x30x25cm)", "Large (50x40x30cm)", "X-Large (60x50x40cm)", "Standard Export (60x40x40cm)", "Custom Size"]',
'["Малък (30x20x15см)", "Среден (40x30x25см)", "Голям (50x40x30см)", "X-Голям (60x50x40см)", "Стандарт износ (60x40x40см)", "По поръчка"]', 23);
;
