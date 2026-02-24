-- Step 3 Continued: Add more Electronics and Fashion L3/L4 attributes

-- Helper function to get category ID by slug
CREATE OR REPLACE FUNCTION get_cat_id(cat_slug TEXT) RETURNS UUID AS $$
  SELECT id FROM categories WHERE slug = cat_slug LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- Car Phone Mounts attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('car-phone-mounts'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Mount Type', 'Тип стойка', 'select', '["Vent Mount","Dashboard Mount","Windshield Mount","CD Slot","MagSafe Mount"]', '["За вентилация","За табло","За предно стъкло","За CD слот","MagSafe стойка"]', 1),
  ('Compatible Size', 'Съвместим размер', 'select', '["4-6 inch","5-7 inch","6-7 inch","All Sizes","MagSafe Only"]', '["4-6 инча","5-7 инча","6-7 инча","Всички размери","Само MagSafe"]', 2),
  ('Wireless Charging', 'Безжично зареждане', 'boolean', '[]', '[]', 3),
  ('MagSafe Compatible', 'MagSafe съвместим', 'boolean', '[]', '[]', 4),
  ('Rotation', 'Въртене', 'select', '["Fixed","180°","360°"]', '["Фиксирано","180°","360°"]', 5),
  ('Color', 'Цвят', 'select', '["Black","Silver","Gray"]', '["Черен","Сребрист","Сив"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('car-phone-mounts') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Lightning Cables attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('lightning-cables'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Cable Length', 'Дължина', 'select', '["0.3m","0.5m","1m","2m","3m"]', '["0.3м","0.5м","1м","2м","3м"]', 1),
  ('Connector Type', 'Тип конектор', 'select', '["Lightning to USB-A","Lightning to USB-C"]', '["Lightning към USB-A","Lightning към USB-C"]', 2),
  ('MFi Certified', 'MFi сертифициран', 'boolean', '[]', '[]', 3),
  ('Fast Charging', 'Бързо зареждане', 'boolean', '[]', '[]', 4),
  ('Material', 'Материал', 'select', '["PVC","Braided Nylon","TPE","Silicone"]', '["PVC","Плетен найлон","TPE","Силикон"]', 5),
  ('Color', 'Цвят', 'select', '["White","Black","Gray","Blue","Red","Pink"]', '["Бял","Черен","Сив","Син","Червен","Розов"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('lightning-cables') IS NOT NULL
ON CONFLICT DO NOTHING;

-- MagSafe Chargers attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('magsafe-chargers'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Charging Power', 'Мощност', 'select', '["7.5W","15W","25W"]', '["7.5W","15W","25W"]', 1),
  ('Charger Type', 'Тип', 'select', '["Single Puck","Duo","3-in-1 Stand","Car Mount","Travel"]', '["Единична подложка","Duo","3-в-1 стойка","За кола","За пътуване"]', 2),
  ('Apple Watch Compatible', 'Съвместим с Apple Watch', 'boolean', '[]', '[]', 3),
  ('AirPods Compatible', 'Съвместим с AirPods', 'boolean', '[]', '[]', 4),
  ('Stand Included', 'Включена стойка', 'boolean', '[]', '[]', 5),
  ('Color', 'Цвят', 'select', '["White","Black","Space Gray"]', '["Бял","Черен","Space Gray"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('magsafe-chargers') IS NOT NULL
ON CONFLICT DO NOTHING;

-- MagSafe Cases attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('magsafe-cases'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('iPhone Model', 'Модел iPhone', 'select', '["iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16 Plus","iPhone 16","iPhone 15 Pro Max","iPhone 15 Pro","iPhone 15 Plus","iPhone 15","iPhone 14 Series","iPhone 13 Series"]', '["iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16 Plus","iPhone 16","iPhone 15 Pro Max","iPhone 15 Pro","iPhone 15 Plus","iPhone 15","iPhone 14 серия","iPhone 13 серия"]', 1),
  ('Material', 'Материал', 'select', '["Silicone","Leather","Clear Plastic","TPU","FineWoven"]', '["Силикон","Кожа","Прозрачна пластмаса","TPU","FineWoven"]', 2),
  ('Magnet Strength', 'Сила на магнита', 'select', '["Standard","Enhanced","Strong"]', '["Стандартна","Подобрена","Силна"]', 3),
  ('Case Style', 'Стил', 'select', '["Clear","Solid","Wallet","Battery"]', '["Прозрачен","Плътен","Портфейл","С батерия"]', 4),
  ('Color', 'Цвят', 'select', '["Black","White","Clear","Blue","Red","Pink","Green","Purple","Midnight","Starlight"]', '["Черен","Бял","Прозрачен","Син","Червен","Розов","Зелен","Лилав","Midnight","Starlight"]', 5)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('magsafe-cases') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Rugged Cases attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('rugged-cases'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Phone Model', 'Модел телефон', 'select', '["iPhone 16 Series","iPhone 15 Series","iPhone 14 Series","Samsung S24 Series","Samsung S23 Series","Pixel 9","Pixel 8","Universal"]', '["iPhone 16 серия","iPhone 15 серия","iPhone 14 серия","Samsung S24 серия","Samsung S23 серия","Pixel 9","Pixel 8","Универсален"]', 1),
  ('Protection Rating', 'Рейтинг защита', 'select', '["Drop Tested 4ft","Drop Tested 6ft","Drop Tested 10ft","Military Grade MIL-STD-810G","IP68 Waterproof"]', '["Тест от 1.2м","Тест от 1.8м","Тест от 3м","Военен клас MIL-STD-810G","IP68 водоустойчив"]', 2),
  ('Features', 'Характеристики', 'multiselect', '["Built-in Screen Protector","Kickstand","Belt Clip","MagSafe","Wireless Charging Compatible"]', '["Вграден протектор","Стойка","Клип за колан","MagSafe","Безжично зареждане"]', 3),
  ('Brand', 'Марка', 'select', '["OtterBox","UAG","Spigen","Lifeproof","Mous","Catalyst","Generic"]', '["OtterBox","UAG","Spigen","Lifeproof","Mous","Catalyst","Небрандирано"]', 4),
  ('Color', 'Цвят', 'select', '["Black","Clear","Camo","Navy","Red","Orange"]', '["Черен","Прозрачен","Камуфлаж","Тъмносин","Червен","Оранжев"]', 5)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('rugged-cases') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Wallet Cases attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('wallet-cases'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Phone Model', 'Модел телефон', 'select', '["iPhone 16 Series","iPhone 15 Series","iPhone 14 Series","Samsung S24 Series","Samsung S23 Series","Universal"]', '["iPhone 16 серия","iPhone 15 серия","iPhone 14 серия","Samsung S24 серия","Samsung S23 серия","Универсален"]', 1),
  ('Card Slots', 'Слотове за карти', 'select', '["1","2","3","4","5+"]', '["1","2","3","4","5+"]', 2),
  ('Material', 'Материал', 'select', '["Genuine Leather","PU Leather","Fabric","Synthetic"]', '["Естествена кожа","PU кожа","Плат","Синтетика"]', 3),
  ('Closure Type', 'Тип закопчаване', 'select', '["Magnetic","Snap","None","Zipper"]', '["Магнитно","Капсула","Без","Цип"]', 4),
  ('MagSafe Compatible', 'MagSafe съвместим', 'boolean', '[]', '[]', 5),
  ('Color', 'Цвят', 'select', '["Black","Brown","Tan","Navy","Red","Pink"]', '["Черен","Кафяв","Бежов","Тъмносин","Червен","Розов"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('wallet-cases') IS NOT NULL
ON CONFLICT DO NOTHING;

-- =====================================
-- FASHION L4 ATTRIBUTES
-- =====================================

-- Dress Shirts (L4) attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('dress-shirts'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Neck Size', 'Размер яка', 'select', '["14","14.5","15","15.5","16","16.5","17","17.5","18","18.5"]', '["14","14.5","15","15.5","16","16.5","17","17.5","18","18.5"]', 1),
  ('Sleeve Length', 'Дължина ръкав', 'select', '["Short","32/33","34/35","36/37","Long"]', '["Къс","32/33","34/35","36/37","Дълъг"]', 2),
  ('Fit', 'Кройка', 'select', '["Slim Fit","Regular Fit","Classic Fit","Athletic Fit","Relaxed"]', '["Slim Fit","Regular Fit","Classic Fit","Athletic Fit","Relaxed"]', 3),
  ('Collar Style', 'Стил яка', 'select', '["Spread","Point","Button-Down","Cutaway","Wing","Mandarin"]', '["Spread","Point","Button-Down","Cutaway","Wing","Мандарин"]', 4),
  ('Cuff Style', 'Стил маншет', 'select', '["Button","French Cuff","Convertible"]', '["Копчета","Френски маншет","Конвертируем"]', 5),
  ('Material', 'Материал', 'select', '["100% Cotton","Cotton Blend","Non-Iron Cotton","Linen","Oxford","Poplin","Twill"]', '["100% памук","Памучна смес","Non-Iron памук","Лен","Оксфорд","Поплин","Туил"]', 6),
  ('Pattern', 'Десен', 'select', '["Solid","Stripe","Check","Gingham","Plaid","Herringbone"]', '["Едноцветен","Райе","Карирано","Gingham","Карирано","Рибена кост"]', 7),
  ('Color', 'Цвят', 'select', '["White","Light Blue","Blue","Pink","Lavender","Gray","Black","Navy"]', '["Бял","Светло син","Син","Розов","Лавандула","Сив","Черен","Тъмносин"]', 8)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('dress-shirts') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Also add to mens-dress-shirts if different slug exists
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('mens-dress-shirts'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Neck Size', 'Размер яка', 'select', '["14","14.5","15","15.5","16","16.5","17","17.5","18","18.5"]', '["14","14.5","15","15.5","16","16.5","17","17.5","18","18.5"]', 1),
  ('Sleeve Length', 'Дължина ръкав', 'select', '["Short","32/33","34/35","36/37","Long"]', '["Къс","32/33","34/35","36/37","Дълъг"]', 2),
  ('Fit', 'Кройка', 'select', '["Slim Fit","Regular Fit","Classic Fit","Athletic Fit"]', '["Slim Fit","Regular Fit","Classic Fit","Athletic Fit"]', 3),
  ('Collar Style', 'Стил яка', 'select', '["Spread","Point","Button-Down","Cutaway","Wing"]', '["Spread","Point","Button-Down","Cutaway","Wing"]', 4),
  ('Material', 'Материал', 'select', '["100% Cotton","Cotton Blend","Non-Iron Cotton","Linen","Oxford","Poplin"]', '["100% памук","Памучна смес","Non-Iron памук","Лен","Оксфорд","Поплин"]', 5),
  ('Color', 'Цвят', 'select', '["White","Light Blue","Blue","Pink","Gray","Black","Navy"]', '["Бял","Светло син","Син","Розов","Сив","Черен","Тъмносин"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('mens-dress-shirts') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Skinny Jeans (L4) attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('mens-skinny-jeans'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Waist Size', 'Размер талия', 'select', '["28","29","30","31","32","33","34","36","38","40"]', '["28","29","30","31","32","33","34","36","38","40"]', 1),
  ('Inseam Length', 'Дължина крачол', 'select', '["28","30","32","34","36"]', '["28","30","32","34","36"]', 2),
  ('Rise', 'Височина', 'select', '["Low Rise","Mid Rise","High Rise"]', '["Нисък","Среден","Висок"]', 3),
  ('Wash', 'Изпиране', 'select', '["Dark Wash","Medium Wash","Light Wash","Black","Raw/Unwashed","Distressed"]', '["Тъмно","Средно","Светло","Черно","Необработено","Състарено"]', 4),
  ('Stretch', 'Еластичност', 'select', '["No Stretch","1% Stretch","2% Stretch","Super Stretch"]', '["Без","1% еластан","2% еластан","Супер еластични"]', 5),
  ('Material', 'Материал', 'select', '["100% Cotton Denim","Cotton Blend","Stretch Denim"]', '["100% памучен деним","Памучна смес","Еластичен деним"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('mens-skinny-jeans') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Slim Fit Jeans (L4) attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('slim-fit-jeans'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Waist Size', 'Размер талия', 'select', '["28","29","30","31","32","33","34","36","38","40"]', '["28","29","30","31","32","33","34","36","38","40"]', 1),
  ('Inseam Length', 'Дължина крачол', 'select', '["28","30","32","34","36"]', '["28","30","32","34","36"]', 2),
  ('Rise', 'Височина', 'select', '["Low Rise","Mid Rise","High Rise"]', '["Нисък","Среден","Висок"]', 3),
  ('Wash', 'Изпиране', 'select', '["Dark Wash","Medium Wash","Light Wash","Black","Raw/Unwashed","Distressed"]', '["Тъмно","Средно","Светло","Черно","Необработено","Състарено"]', 4),
  ('Stretch', 'Еластичност', 'select', '["No Stretch","1% Stretch","2% Stretch","Super Stretch"]', '["Без","1% еластан","2% еластан","Супер еластични"]', 5)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('slim-fit-jeans') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Leather Jackets (L4) attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('mens-leather-jackets'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Size', 'Размер', 'select', '["XS","S","M","L","XL","XXL","XXXL"]', '["XS","S","M","L","XL","XXL","XXXL"]', 1),
  ('Leather Type', 'Тип кожа', 'select', '["Genuine Leather","Lambskin","Cowhide","Goatskin","Faux Leather","Suede"]', '["Естествена кожа","Агнешка","Телешка","Козя","Изкуствена кожа","Велур"]', 2),
  ('Jacket Style', 'Стил', 'select', '["Biker","Bomber","Racer","Classic","Trucker","Shearling"]', '["Байкерско","Бомбър","Racer","Класическо","Trucker","С овча вълна"]', 3),
  ('Closure', 'Закопчаване', 'select', '["Zipper","Button","Snap"]', '["Цип","Копчета","Капси"]', 4),
  ('Lining', 'Подплата', 'select', '["Polyester","Cotton","Quilted","Shearling","None"]', '["Полиестер","Памук","Ватирана","Овча вълна","Без"]', 5),
  ('Color', 'Цвят', 'select', '["Black","Brown","Tan","Burgundy","Navy","Cognac"]', '["Черен","Кафяв","Бежов","Бордо","Тъмносин","Коняк"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('mens-leather-jackets') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Bomber Jackets (L4) attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('bomber-jackets'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Size', 'Размер', 'select', '["XS","S","M","L","XL","XXL","XXXL"]', '["XS","S","M","L","XL","XXL","XXXL"]', 1),
  ('Material', 'Материал', 'select', '["Nylon","Polyester","Cotton","Leather","Satin","Wool Blend"]', '["Найлон","Полиестер","Памук","Кожа","Сатен","Вълнена смес"]', 2),
  ('Fill Type', 'Пълнеж', 'select', '["None/Lightweight","Polyester Fill","Down","Synthetic Down"]', '["Без/Лек","Полиестер","Пух","Синтетичен пух"]', 3),
  ('Features', 'Характеристики', 'multiselect', '["Hood","Ribbed Cuffs","Side Pockets","Interior Pockets","Reversible"]', '["Качулка","Ребрести маншети","Странични джобове","Вътрешни джобове","Двулицев"]', 4),
  ('Color', 'Цвят', 'select', '["Black","Navy","Olive","Burgundy","Khaki","Camo"]', '["Черен","Тъмносин","Маслинен","Бордо","Каки","Камуфлаж"]', 5)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('bomber-jackets') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Clean up helper function
DROP FUNCTION IF EXISTS get_cat_id(TEXT);;
