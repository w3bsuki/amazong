-- Phase 2.1.4: Fashion Attributes - Batch 2: Bags, Watches, Accessories
-- Add comprehensive attributes to Fashion accessory categories

-- =====================================================
-- BAGS ATTRIBUTES
-- =====================================================

-- Handbags (generic bags attributes applied to all bag categories)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'handbags'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Bag Size', 'Размер чанта', 'select', true, '["Mini","Small","Medium","Large","Oversized"]', '["Мини","Малка","Средна","Голяма","Много голяма"]', 10),
  ('Material', 'Материал', 'select', true, '["Leather","Faux Leather","Canvas","Nylon","Suede","Straw","Fabric","PVC"]', '["Кожа","Еко кожа","Платно","Найлон","Велур","Слама","Плат","PVC"]', 11),
  ('Closure', 'Закопчаване', 'select', false, '["Zipper","Magnetic Snap","Turn Lock","Drawstring","Flap","Open Top","Buckle"]', '["Цип","Магнит","Завъртане","Връзки","Капак","Отворен","Катарама"]', 12),
  ('Strap Type', 'Вид дръжка', 'select', false, '["Top Handle","Shoulder Strap","Crossbody Strap","Chain Strap","Detachable Strap","No Strap"]', '["Горна дръжка","Презрамка за рамо","Кросбоди","Верижка","Сменяема","Без дръжка"]', 13),
  ('Hardware Color', 'Цвят обков', 'select', false, '["Gold","Silver","Rose Gold","Gunmetal","Black","Brass"]', '["Златен","Сребърен","Розово злато","Тъмен метал","Черен","Месинг"]', 14),
  ('Interior', 'Вътрешност', 'select', false, '["Lined","Unlined","Multiple Pockets","Card Slots","Zippered Pocket"]', '["С подплата","Без подплата","Много джобове","Слотове за карти","Джоб с цип"]', 15),
  ('Designer Brand', 'Дизайнерска марка', 'select', false, '["Gucci","Louis Vuitton","Chanel","Prada","Hermes","Coach","Michael Kors","Kate Spade","Other","No Brand"]', '["Gucci","Louis Vuitton","Chanel","Prada","Hermes","Coach","Michael Kors","Kate Spade","Друга","Без марка"]', 16)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Backpacks
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'backpacks'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Capacity', 'Обем', 'select', true, '["Under 20L","20-30L","30-40L","40-50L","50L+"]', '["Под 20L","20-30L","30-40L","40-50L","50L+"]', 10),
  ('Laptop Compartment', 'Отделение за лаптоп', 'select', false, '["No","Up to 13\"","Up to 15\"","Up to 17\""]', '["Не","До 13\"","До 15\"","До 17\""]', 11),
  ('Material', 'Материал', 'select', true, '["Nylon","Polyester","Canvas","Leather","Recycled Materials","Cordura"]', '["Найлон","Полиестер","Платно","Кожа","Рециклирани материали","Кордура"]', 12),
  ('Water Resistant', 'Водоустойчив', 'select', false, '["Yes","No","Water Repellent","Waterproof"]', '["Да","Не","Водоотблъскващ","Водоустойчив"]', 13),
  ('Use Case', 'Предназначение', 'select', false, '["Everyday","Travel","School","Work","Hiking","Gym"]', '["Ежедневие","Пътуване","Училище","Работа","Туризъм","Фитнес"]', 14),
  ('Anti-Theft Features', 'Анти-кражба', 'select', false, '["Yes","No"]', '["Да","Не"]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Wallets
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'wallets'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Wallet Style', 'Стил портфейл', 'select', true, '["Bifold","Trifold","Card Holder","Money Clip","Zip Around","Clutch Wallet","Slim Wallet"]', '["Двугънащ","Трикратно сгъваем","Калъф за карти","Щипка за пари","С цип","Клъч портфейл","Тънък портфейл"]', 10),
  ('Material', 'Материал', 'select', true, '["Leather","Faux Leather","Canvas","Nylon","Metal","Carbon Fiber"]', '["Кожа","Еко кожа","Платно","Найлон","Метал","Карбон"]', 11),
  ('Card Slots', 'Слотове за карти', 'select', false, '["1-4","5-8","9-12","13+"]', '["1-4","5-8","9-12","13+"]', 12),
  ('Coin Pocket', 'Джоб за монети', 'select', false, '["Yes","No"]', '["Да","Не"]', 13),
  ('RFID Blocking', 'RFID защита', 'select', false, '["Yes","No"]', '["Да","Не"]', 14),
  ('ID Window', 'Прозорец за ID', 'select', false, '["Yes","No"]', '["Да","Не"]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- =====================================================
-- WATCHES ATTRIBUTES
-- =====================================================

-- Apply to all watch categories via L1 parent
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  cat.id,
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM categories cat
CROSS JOIN (VALUES
  ('Watch Movement', 'Механизъм', 'select', true, '["Automatic","Quartz","Manual","Solar","Kinetic","Smartwatch"]', '["Автоматичен","Кварцов","Ръчен","Соларен","Кинетичен","Смарт"]', 10),
  ('Case Diameter', 'Диаметър корпус', 'select', true, '["Under 36mm","36-38mm","38-40mm","40-42mm","42-44mm","44-46mm","46mm+"]', '["Под 36мм","36-38мм","38-40мм","40-42мм","42-44мм","44-46мм","46мм+"]', 11),
  ('Case Material', 'Материал корпус', 'select', false, '["Stainless Steel","Gold","Rose Gold","Titanium","Ceramic","Plastic","Carbon"]', '["Неръждаема стомана","Злато","Розово злато","Титан","Керамика","Пластмаса","Карбон"]', 12),
  ('Band Material', 'Материал каишка', 'select', false, '["Leather","Metal","Silicone","Rubber","NATO Strap","Mesh","Ceramic"]', '["Кожа","Метал","Силикон","Гума","NATO каишка","Мрежа","Керамика"]', 13),
  ('Water Resistance', 'Водоустойчивост', 'select', false, '["Not Water Resistant","30m/3ATM","50m/5ATM","100m/10ATM","200m/20ATM","300m+"]', '["Не е водоустойчив","30м/3ATM","50м/5ATM","100м/10ATM","200м/20ATM","300м+"]', 14),
  ('Display Type', 'Тип дисплей', 'select', false, '["Analog","Digital","Analog-Digital","Touchscreen"]', '["Аналогов","Дигитален","Аналогово-дигитален","Тъчскрийн"]', 15),
  ('Functions', 'Функции', 'multiselect', false, '["Date","Chronograph","GMT","Moon Phase","Alarm","Timer","Heart Rate","GPS"]', '["Дата","Хронограф","GMT","Лунни фази","Аларма","Таймер","Пулс","GPS"]', 16),
  ('Crystal Type', 'Тип стъкло', 'select', false, '["Sapphire","Mineral","Hesalite","Acrylic"]', '["Сапфир","Минерално","Хезалит","Акрил"]', 17)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
WHERE cat.slug IN ('men-watches', 'women-watches', 'kids-watches', 'unisex-watches', 'watches-casual', 'watches-vintage', 'watches-smart')
ON CONFLICT DO NOTHING;

-- =====================================================
-- ACCESSORIES ATTRIBUTES
-- =====================================================

-- Sunglasses
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'acc-sunglasses'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Frame Shape', 'Форма рамка', 'select', true, '["Aviator","Wayfarer","Round","Cat Eye","Square","Rectangular","Oval","Shield","Wrap"]', '["Авиатор","Уейфарър","Кръгли","Котешко око","Квадратни","Правоъгълни","Овални","Щит","Обвиващи"]', 10),
  ('Frame Material', 'Материал рамка', 'select', false, '["Plastic","Metal","Acetate","Titanium","Wood","Mixed"]', '["Пластмаса","Метал","Ацетат","Титан","Дърво","Смесен"]', 11),
  ('Lens Type', 'Тип лещи', 'select', false, '["Polarized","Non-Polarized","Mirrored","Gradient","Photochromic"]', '["Поляризирани","Обикновени","Огледални","Градиентни","Фотохромни"]', 12),
  ('Lens Color', 'Цвят лещи', 'select', false, '["Black","Brown","Gray","Green","Blue","Pink","Yellow","Mirrored"]', '["Черни","Кафяви","Сиви","Зелени","Сини","Розови","Жълти","Огледални"]', 13),
  ('UV Protection', 'UV защита', 'select', false, '["100% UV400","UV380","No Info"]', '["100% UV400","UV380","Без информация"]', 14),
  ('Designer', 'Дизайнер', 'select', false, '["Ray-Ban","Oakley","Gucci","Prada","Versace","Tom Ford","Maui Jim","Other"]', '["Ray-Ban","Oakley","Gucci","Prada","Versace","Tom Ford","Maui Jim","Друг"]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Belts
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'acc-belts'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Belt Size', 'Размер колан', 'select', true, '["XS (28-30)","S (30-32)","M (32-34)","L (34-36)","XL (36-38)","XXL (38-40)","XXXL (40+)"]', '["XS (28-30)","S (30-32)","M (32-34)","L (34-36)","XL (36-38)","XXL (38-40)","XXXL (40+)"]', 10),
  ('Belt Width', 'Ширина', 'select', false, '["Narrow (Under 1\")","Standard (1-1.5\")","Wide (1.5-2\")","Extra Wide (2\"+)"]', '["Тесен (под 2.5см)","Стандартен (2.5-4см)","Широк (4-5см)","Много широк (5см+)"]', 11),
  ('Material', 'Материал', 'select', true, '["Leather","Faux Leather","Canvas","Webbing","Elastic","Braided"]', '["Кожа","Еко кожа","Платно","Текстил","Еластичен","Плетен"]', 12),
  ('Buckle Type', 'Тип катарама', 'select', false, '["Pin Buckle","Plate Buckle","D-Ring","Automatic","No Buckle","Magnetic"]', '["С игла","Плоча","D-пръстен","Автоматична","Без катарама","Магнитна"]', 13),
  ('Buckle Finish', 'Цвят катарама', 'select', false, '["Silver","Gold","Gunmetal","Brass","Black","Bronze"]', '["Сребърен","Златен","Тъмен метал","Месинг","Черен","Бронз"]', 14)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Hats & Caps
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'acc-hats'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Hat Size', 'Размер шапка', 'select', true, '["S (54-55cm)","M (56-57cm)","L (58-59cm)","XL (60-61cm)","One Size","Adjustable"]', '["S (54-55см)","M (56-57см)","L (58-59см)","XL (60-61см)","Един размер","Регулируем"]', 10),
  ('Hat Style', 'Стил', 'select', true, '["Baseball Cap","Beanie","Fedora","Bucket Hat","Sun Hat","Trucker","Flat Cap","Panama","Visor"]', '["Бейзболна шапка","Бийни","Федора","Кофа","Слънчева шапка","Тракер","Каскет","Панама","Козирка"]', 11),
  ('Material', 'Материал', 'select', false, '["Cotton","Wool","Polyester","Straw","Felt","Fleece","Acrylic","Leather"]', '["Памук","Вълна","Полиестер","Слама","Филц","Полар","Акрил","Кожа"]', 12),
  ('Brim Type', 'Тип периферия', 'select', false, '["Flat Brim","Curved Brim","Wide Brim","No Brim","Floppy"]', '["Плоска периферия","Извита периферия","Широка периферия","Без периферия","Отпусната"]', 13),
  ('Closure', 'Закопчаване', 'select', false, '["Snapback","Adjustable Strap","Fitted","Elastic","Drawstring"]', '["Snapback","Регулируема каишка","Фиксиран размер","Ластик","Връзки"]', 14)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;;
