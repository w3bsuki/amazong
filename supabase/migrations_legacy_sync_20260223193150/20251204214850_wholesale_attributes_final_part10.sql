
-- WHOLESALE ATTRIBUTES - Final Set (Part 10)

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- 53. Target Market
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Target Market', 'Целеви пазар', 'multiselect', false, true,
'["Retailers", "Distributors", "Online Sellers", "Amazon/eBay Sellers", "Brick & Mortar Stores", "Hotels/Restaurants", "Corporate/B2B", "Government", "Schools/Institutions", "Resellers"]',
'["Търговци на дребно", "Дистрибутори", "Онлайн търговци", "Amazon/eBay продавачи", "Физически магазини", "Хотели/Ресторанти", "Корпоративни/B2B", "Държавни", "Училища/Институции", "Препродавачи"]', 53),

-- 54. Sales Channel
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Sales Channel', 'Канал за продажби', 'multiselect', false, true,
'["B2B Website", "Alibaba", "Made-in-China", "Global Sources", "Trade Shows", "Direct Sales", "Agents", "Bulgarian B2B Platforms"]',
'["B2B Уебсайт", "Alibaba", "Made-in-China", "Global Sources", "Търговски изложения", "Директни продажби", "Агенти", "Български B2B платформи"]', 54),

-- 55. Price Negotiation
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Price Negotiation', 'Ценови преговори', 'select', false, true,
'["Fixed Price", "Negotiable", "Volume Based Pricing", "Quote Required", "Auction/Bidding"]',
'["Фиксирана цена", "Договаряне", "Цена според обем", "Изисква се оферта", "Търг/Наддаване"]', 55),

-- 56. Inspection Services
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Inspection Services', 'Инспекционни услуги', 'select', false, false,
'["Pre-Shipment Inspection", "Factory Audit Available", "Third Party Inspection", "Quality Control Photos", "Video Inspection", "Not Available"]',
'["Инспекция преди изпращане", "Фабричен одит", "Инспекция от трета страна", "Снимки за качествен контрол", "Видео инспекция", "Не се предлага"]', 56),

-- 57. Container Load Type
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Container Load Type', 'Тип контейнерен товар', 'select', false, true,
'["LCL (Less than Container)", "FCL 20ft", "FCL 40ft", "FCL 40ft HC", "Air Freight Only", "Mixed LCL/FCL"]',
'["LCL (По-малко от контейнер)", "FCL 20 фута", "FCL 40 фута", "FCL 40 фута HC", "Само въздушен транспорт", "Смесен LCL/FCL"]', 57),

-- 58. Seasonal Availability
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Seasonal Availability', 'Сезонна наличност', 'select', false, true,
'["Year Round", "Spring/Summer", "Fall/Winter", "Holiday Season", "Back to School", "Limited Time"]',
'["Целогодишно", "Пролет/Лято", "Есен/Зима", "Празничен сезон", "Обратно на училище", "Ограничено време"]', 58),

-- 59. Product Customization Level
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Customization Level', 'Ниво на персонализация', 'select', false, true,
'["No Customization", "Color Options", "Logo/Branding Only", "Partial Customization", "Full Custom Design", "From Scratch Manufacturing"]',
'["Без персонализация", "Избор на цвят", "Само лого/брандиране", "Частична персонализация", "Пълен персонализиран дизайн", "Производство от нулата"]', 59),

-- 60. Product Assortment
('405303e7-dbab-4a7a-8654-4e1e1ff3074f', 'Product Assortment', 'Асортимент', 'select', false, true,
'["Single SKU", "Multiple Colors", "Multiple Sizes", "Full Product Range", "Mix & Match Available", "Custom Assortment"]',
'["Единичен артикул", "Няколко цвята", "Няколко размера", "Пълна продуктова гама", "Микс налично", "Персонализиран асортимент"]', 60);
;
