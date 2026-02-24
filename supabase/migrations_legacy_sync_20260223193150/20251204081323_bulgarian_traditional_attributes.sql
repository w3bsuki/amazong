
-- =====================================================
-- BULGARIAN TRADITIONAL CATEGORY ATTRIBUTES
-- =====================================================

-- L0: bulgarian-traditional = e6a2ce50-625b-4cc5-917f-42517ba57495
-- L1: traditional-foods = c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48
-- L1: rose-products = 55667eea-a74b-4e3c-b68f-bb1b9f178998
-- L1: traditional-crafts = 976a10a1-23e3-443a-9a10-d59a547db04c
-- L1: folk-costumes = 1514ccad-a7f2-4cf5-95c3-1068d13955c1
-- L1: bulgarian-wine = 3cdcb922-4c90-46ed-8a51-1be2c4f12d8e
-- L1: souvenirs = d245c796-4c20-444c-b5c5-f6389adbe891

-- =====================================================
-- GLOBAL BULGARIAN TRADITIONAL ATTRIBUTES (L0)
-- =====================================================
INSERT INTO public.category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('e6a2ce50-625b-4cc5-917f-42517ba57495', 'Region of Origin', 'Регион на произход', 'select', false, true, 
 '["Sofia Region", "Thrace", "Rhodope Mountains", "Pirin", "Rose Valley", "Dobrudzha", "Black Sea Coast", "Danubian Plain", "Shop Region", "Other"]',
 '["Софийски регион", "Тракия", "Родопи", "Пирин", "Розова долина", "Добруджа", "Черноморие", "Дунавска равнина", "Шоплук", "Друг"]', 1),
('e6a2ce50-625b-4cc5-917f-42517ba57495', 'Handmade', 'Ръчна изработка', 'boolean', false, true, '[]', '[]', 2),
('e6a2ce50-625b-4cc5-917f-42517ba57495', 'Authentic Bulgarian', 'Автентично българско', 'boolean', false, true, '[]', '[]', 3);

-- =====================================================
-- TRADITIONAL FOODS ATTRIBUTES
-- =====================================================
INSERT INTO public.category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', 'Food Type', 'Вид храна', 'select', false, true,
 '["Honey", "Dairy", "Meat", "Preserved", "Spices", "Sweets", "Beverages"]',
 '["Мед", "Млечни", "Месни", "Консерви", "Подправки", "Сладкиши", "Напитки"]', 1),
('c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', 'Organic', 'Био продукт', 'boolean', false, true, '[]', '[]', 2),
('c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', 'Shelf Life', 'Срок на годност', 'select', false, true,
 '["Under 1 month", "1-3 months", "3-6 months", "6-12 months", "Over 1 year"]',
 '["Под 1 месец", "1-3 месеца", "3-6 месеца", "6-12 месеца", "Над 1 година"]', 3),
('c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', 'Weight/Volume', 'Тегло/Обем', 'select', false, true,
 '["Under 100g", "100-250g", "250-500g", "500g-1kg", "Over 1kg"]',
 '["Под 100г", "100-250г", "250-500г", "500г-1кг", "Над 1кг"]', 4),
('c30e1a4b-c52a-4ef0-8a30-4b2cdb1f7c48', 'Allergens', 'Алергени', 'multiselect', false, true,
 '["Gluten", "Dairy", "Nuts", "Eggs", "Soy", "None"]',
 '["Глутен", "Млечни", "Ядки", "Яйца", "Соя", "Няма"]', 5);

-- =====================================================
-- ROSE PRODUCTS ATTRIBUTES
-- =====================================================
INSERT INTO public.category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('55667eea-a74b-4e3c-b68f-bb1b9f178998', 'Rose Type', 'Вид роза', 'select', false, true,
 '["Rosa Damascena", "Rosa Alba", "Rosa Centifolia", "Mixed"]',
 '["Роза Дамасцена", "Бяла роза", "Роза Центифолия", "Смес"]', 1),
('55667eea-a74b-4e3c-b68f-bb1b9f178998', 'Product Form', 'Форма на продукта', 'select', false, true,
 '["Oil", "Water", "Cream", "Soap", "Jam", "Tea", "Perfume", "Gift Set"]',
 '["Масло", "Вода", "Крем", "Сапун", "Конфитюр", "Чай", "Парфюм", "Подаръчен комплект"]', 2),
('55667eea-a74b-4e3c-b68f-bb1b9f178998', 'Purity', 'Чистота', 'select', false, true,
 '["100% Pure", "Natural Blend", "With Other Ingredients"]',
 '["100% чисто", "Натурална смес", "С други съставки"]', 3),
('55667eea-a74b-4e3c-b68f-bb1b9f178998', 'Volume/Weight', 'Обем/Тегло', 'select', false, true,
 '["1ml", "2ml", "5ml", "10ml", "30ml", "50ml", "100ml", "200ml+"]',
 '["1мл", "2мл", "5мл", "10мл", "30мл", "50мл", "100мл", "200мл+"]', 4),
('55667eea-a74b-4e3c-b68f-bb1b9f178998', 'Certificate', 'Сертификат', 'boolean', false, true, '[]', '[]', 5);

-- =====================================================
-- TRADITIONAL CRAFTS ATTRIBUTES
-- =====================================================
INSERT INTO public.category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('976a10a1-23e3-443a-9a10-d59a547db04c', 'Craft Type', 'Вид занаят', 'select', false, true,
 '["Pottery", "Woodworking", "Textiles", "Metalwork", "Icons", "Musical Instruments"]',
 '["Грънчарство", "Дърворезба", "Текстил", "Метал", "Икони", "Музикални инструменти"]', 1),
('976a10a1-23e3-443a-9a10-d59a547db04c', 'Material', 'Материал', 'select', false, true,
 '["Ceramic", "Wood", "Cotton", "Wool", "Copper", "Iron", "Gold", "Silver", "Mixed"]',
 '["Керамика", "Дърво", "Памук", "Вълна", "Мед", "Желязо", "Злато", "Сребро", "Смесен"]', 2),
('976a10a1-23e3-443a-9a10-d59a547db04c', 'Age/Era', 'Възраст/Ера', 'select', false, true,
 '["New/Contemporary", "Vintage (20-50 years)", "Antique (50-100 years)", "Historical (100+ years)"]',
 '["Ново/Съвременно", "Винтидж (20-50 г.)", "Антика (50-100 г.)", "Историческо (100+ г.)"]', 3),
('976a10a1-23e3-443a-9a10-d59a547db04c', 'Decorative/Functional', 'Декоративно/Функционално', 'select', false, true,
 '["Decorative Only", "Functional", "Both"]',
 '["Само декоративно", "Функционално", "И двете"]', 4),
('976a10a1-23e3-443a-9a10-d59a547db04c', 'Artisan Signed', 'Подписано от майстор', 'boolean', false, true, '[]', '[]', 5);

-- =====================================================
-- FOLK COSTUMES ATTRIBUTES
-- =====================================================
INSERT INTO public.category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('1514ccad-a7f2-4cf5-95c3-1068d13955c1', 'Gender', 'Пол', 'select', true, true,
 '["Women", "Men", "Girls", "Boys", "Unisex"]',
 '["Дамски", "Мъжки", "Момичета", "Момчета", "Унисекс"]', 1),
('1514ccad-a7f2-4cf5-95c3-1068d13955c1', 'Region Style', 'Регионален стил', 'select', false, true,
 '["Thracian", "Shop", "Rhodope", "Pirin", "Dobrudzha", "Northern", "Other"]',
 '["Тракийски", "Шопски", "Родопски", "Пирински", "Добруджански", "Северняшки", "Друг"]', 2),
('1514ccad-a7f2-4cf5-95c3-1068d13955c1', 'Size', 'Размер', 'select', false, true,
 '["XS", "S", "M", "L", "XL", "XXL", "Custom", "Kids 2-4", "Kids 4-6", "Kids 6-8", "Kids 8-10", "Kids 10-12"]',
 '["XS", "S", "M", "L", "XL", "XXL", "По поръчка", "Деца 2-4", "Деца 4-6", "Деца 6-8", "Деца 8-10", "Деца 10-12"]', 3),
('1514ccad-a7f2-4cf5-95c3-1068d13955c1', 'Costume Completeness', 'Пълнота на носията', 'select', false, true,
 '["Full Set", "Single Piece", "Accessory Only"]',
 '["Пълен комплект", "Единична част", "Само аксесоар"]', 4),
('1514ccad-a7f2-4cf5-95c3-1068d13955c1', 'Purpose', 'Предназначение', 'select', false, true,
 '["Performance/Dance", "Display/Collection", "Daily Wear", "Wedding", "Festival"]',
 '["За изпълнение/танци", "За изложба/колекция", "За ежедневие", "Сватба", "Фестивал"]', 5),
('1514ccad-a7f2-4cf5-95c3-1068d13955c1', 'Embroidery Type', 'Вид бродерия', 'select', false, true,
 '["Hand Embroidered", "Machine Embroidered", "No Embroidery"]',
 '["Ръчна бродерия", "Машинна бродерия", "Без бродерия"]', 6);

-- =====================================================
-- BULGARIAN WINE ATTRIBUTES
-- =====================================================
INSERT INTO public.category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', 'Wine Type', 'Вид вино', 'select', false, true,
 '["Red", "White", "Rosé", "Rakia/Brandy", "Sparkling", "Dessert"]',
 '["Червено", "Бяло", "Розе", "Ракия", "Пенливо", "Десертно"]', 1),
('3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', 'Grape Variety', 'Сорт грозде', 'select', false, true,
 '["Mavrud", "Melnik", "Rubin", "Gamza", "Pamid", "Dimyat", "Misket", "Traminer", "Chardonnay", "Merlot", "Cabernet", "Mixed/Blend", "Other"]',
 '["Мавруд", "Мелник", "Рубин", "Гъмза", "Памид", "Димят", "Мискет", "Траминер", "Шардоне", "Мерло", "Каберне", "Купаж", "Друг"]', 2),
('3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', 'Wine Region', 'Винен регион', 'select', false, true,
 '["Thracian Valley", "Danube Plain", "Struma Valley", "Rose Valley", "Black Sea", "Other"]',
 '["Тракийска низина", "Дунавска равнина", "Струмска долина", "Розова долина", "Черноморие", "Друг"]', 3),
('3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', 'Vintage Year', 'Година на реколта', 'select', false, true,
 '["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "Older", "Non-Vintage"]',
 '["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "По-стара", "Без година"]', 4),
('3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', 'Alcohol Content', 'Алкохолно съдържание', 'select', false, true,
 '["Under 12%", "12-13%", "13-14%", "14-15%", "Over 15%", "40%+ (Rakia)"]',
 '["Под 12%", "12-13%", "13-14%", "14-15%", "Над 15%", "40%+ (Ракия)"]', 5),
('3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', 'Bottle Size', 'Размер на бутилка', 'select', false, true,
 '["187ml (Mini)", "375ml (Half)", "750ml (Standard)", "1L", "1.5L (Magnum)", "3L"]',
 '["187мл (Мини)", "375мл (Половинка)", "750мл (Стандарт)", "1Л", "1.5Л (Магнум)", "3Л"]', 6),
('3cdcb922-4c90-46ed-8a51-1be2c4f12d8e', 'Sweetness', 'Сладост', 'select', false, true,
 '["Dry", "Semi-Dry", "Semi-Sweet", "Sweet"]',
 '["Сухо", "Полусухо", "Полусладко", "Сладко"]', 7);

-- =====================================================
-- SOUVENIRS ATTRIBUTES
-- =====================================================
INSERT INTO public.category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('d245c796-4c20-444c-b5c5-f6389adbe891', 'Souvenir Type', 'Вид сувенир', 'select', false, true,
 '["Martenitsa", "Magnet", "Keychain", "Postcard", "Book", "Figurine", "Flag/Symbol", "Mini Craft", "Other"]',
 '["Мартеница", "Магнит", "Ключодържател", "Картичка", "Книга", "Фигурка", "Знаме/Символ", "Мини занаят", "Друг"]', 1),
('d245c796-4c20-444c-b5c5-f6389adbe891', 'Theme', 'Тема', 'select', false, true,
 '["Cities", "Nature", "History", "Folklore", "Rose Valley", "Orthodox", "Cyrillic", "Patriotic", "Other"]',
 '["Градове", "Природа", "История", "Фолклор", "Розова долина", "Православие", "Кирилица", "Патриотично", "Друго"]', 2),
('d245c796-4c20-444c-b5c5-f6389adbe891', 'Material', 'Материал', 'select', false, true,
 '["Ceramic", "Wood", "Metal", "Textile", "Paper", "Plastic", "Glass", "Mixed"]',
 '["Керамика", "Дърво", "Метал", "Текстил", "Хартия", "Пластмаса", "Стъкло", "Смесен"]', 3),
('d245c796-4c20-444c-b5c5-f6389adbe891', 'Size', 'Размер', 'select', false, true,
 '["Mini", "Small", "Medium", "Large"]',
 '["Мини", "Малък", "Среден", "Голям"]', 4),
('d245c796-4c20-444c-b5c5-f6389adbe891', 'Gift Ready', 'Готово за подарък', 'boolean', false, true, '[]', '[]', 5);
;
