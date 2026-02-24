-- Migration: Move fashion attributes from parent Fashion category to proper subcategories
-- This fixes the duplicate/irrelevant attributes issue (e.g., shoe size showing for hats)

-- Fashion category ID: 9a04f634-c3e5-4b02-9448-7b99584d82e0
-- Shoes category IDs:
--   Men's Shoes: b1000000-0000-0000-0001-000000000002
--   Women's Shoes: b1000000-0000-0000-0002-000000000002
--   Kids Shoes: b1000000-0000-0000-0003-000000000002
--   Unisex Shoes: b1000000-0000-0000-0004-000000000002
-- Clothing category IDs:
--   Men's Clothing: b1000000-0000-0000-0001-000000000001
--   Women's Clothing: b1000000-0000-0000-0002-000000000001
--   Kids Clothing: b1000000-0000-0000-0003-000000000001
--   Unisex Clothing: b1000000-0000-0000-0004-000000000001

-- STEP 1: Delete shoe attributes from Fashion parent
DELETE FROM category_attributes 
WHERE category_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0' 
AND name IN ('Shoe Size EU', 'Heel Height', 'Heel Type', 'Shoe Width', 'Toe Shape', 'Sole Material');

-- STEP 2: Create shoe attributes for Men's Shoes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('b1000000-0000-0000-0001-000000000002', 'Shoe Size EU', 'Размер обувки EU', 'select', false, true, '["35","36","37","38","39","40","41","42","43","44","45","46","47","48"]', '["35","36","37","38","39","40","41","42","43","44","45","46","47","48"]', 1),
('b1000000-0000-0000-0001-000000000002', 'Shoe Width', 'Ширина', 'select', false, true, '["Narrow","Standard","Wide","Extra Wide"]', '["Тясна","Стандартна","Широка","Много широка"]', 2),
('b1000000-0000-0000-0001-000000000002', 'Sole Material', 'Материал на подметката', 'select', false, true, '["Rubber","Leather","Synthetic","EVA","Cork","Crepe"]', '["Гума","Кожа","Синтетика","EVA","Корк","Креп"]', 3),
('b1000000-0000-0000-0001-000000000002', 'Toe Shape', 'Форма на пръстите', 'select', false, false, '["Round","Pointed","Square","Almond","Open"]', '["Кръгла","Заострена","Квадратна","Бадемовидна","Отворена"]', 4);

-- STEP 3: Create shoe attributes for Women's Shoes (with heel options)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('b1000000-0000-0000-0002-000000000002', 'Shoe Size EU', 'Размер обувки EU', 'select', false, true, '["35","36","37","38","39","40","41","42","43","44"]', '["35","36","37","38","39","40","41","42","43","44"]', 1),
('b1000000-0000-0000-0002-000000000002', 'Heel Height', 'Височина на токата', 'select', false, true, '["Flat (0-1cm)","Low (1-3cm)","Medium (3-7cm)","High (7-10cm)","Very High (10cm+)"]', '["Равна (0-1см)","Ниска (1-3см)","Средна (3-7см)","Висока (7-10см)","Много висока (10см+)"]', 2),
('b1000000-0000-0000-0002-000000000002', 'Heel Type', 'Вид тока', 'select', false, true, '["Stiletto","Block","Wedge","Kitten","Platform","Cone","Flat"]', '["Стилето","Широка","Платформа","Котешка","Платформа","Конусовидна","Равна"]', 3),
('b1000000-0000-0000-0002-000000000002', 'Shoe Width', 'Ширина', 'select', false, true, '["Narrow","Standard","Wide","Extra Wide"]', '["Тясна","Стандартна","Широка","Много широка"]', 4),
('b1000000-0000-0000-0002-000000000002', 'Sole Material', 'Материал на подметката', 'select', false, true, '["Rubber","Leather","Synthetic","EVA","Cork","Crepe"]', '["Гума","Кожа","Синтетика","EVA","Корк","Креп"]', 5),
('b1000000-0000-0000-0002-000000000002', 'Toe Shape', 'Форма на пръстите', 'select', false, false, '["Round","Pointed","Square","Almond","Open","Peep Toe"]', '["Кръгла","Заострена","Квадратна","Бадемовидна","Отворена","Peep Toe"]', 6);

-- STEP 4: Create shoe attributes for Kids Shoes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('b1000000-0000-0000-0003-000000000002', 'Shoe Size EU', 'Размер обувки EU', 'select', false, true, '["16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39"]', '["16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39"]', 1),
('b1000000-0000-0000-0003-000000000002', 'Shoe Width', 'Ширина', 'select', false, true, '["Narrow","Standard","Wide"]', '["Тясна","Стандартна","Широка"]', 2),
('b1000000-0000-0000-0003-000000000002', 'Sole Material', 'Материал на подметката', 'select', false, true, '["Rubber","Synthetic","EVA"]', '["Гума","Синтетика","EVA"]', 3);

-- STEP 5: Create shoe attributes for Unisex Shoes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('b1000000-0000-0000-0004-000000000002', 'Shoe Size EU', 'Размер обувки EU', 'select', false, true, '["35","36","37","38","39","40","41","42","43","44","45","46","47","48"]', '["35","36","37","38","39","40","41","42","43","44","45","46","47","48"]', 1),
('b1000000-0000-0000-0004-000000000002', 'Shoe Width', 'Ширина', 'select', false, true, '["Narrow","Standard","Wide","Extra Wide"]', '["Тясна","Стандартна","Широка","Много широка"]', 2),
('b1000000-0000-0000-0004-000000000002', 'Sole Material', 'Материал на подметката', 'select', false, true, '["Rubber","Leather","Synthetic","EVA"]', '["Гума","Кожа","Синтетика","EVA"]', 3),
('b1000000-0000-0000-0004-000000000002', 'Toe Shape', 'Форма на пръстите', 'select', false, false, '["Round","Pointed","Square","Almond","Open"]', '["Кръгла","Заострена","Квадратна","Бадемовидна","Отворена"]', 4);

-- STEP 6: Delete clothing attributes from Fashion parent
DELETE FROM category_attributes 
WHERE category_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0' 
AND name IN ('Clothing Size', 'Neckline', 'Sleeve Length', 'Rise', 'Fit', 'Length');

-- STEP 7: Create clothing attributes for Men's Clothing
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('b1000000-0000-0000-0001-000000000001', 'Clothing Size', 'Размер облекло', 'select', false, true, '["XS","S","M","L","XL","XXL","3XL","4XL"]', '["XS","S","M","L","XL","XXL","3XL","4XL"]', 1),
('b1000000-0000-0000-0001-000000000001', 'Fit', 'Кройка', 'select', false, true, '["Slim","Regular","Relaxed","Oversized"]', '["Прилепнала","Обикновена","Свободна","Oversized"]', 2),
('b1000000-0000-0000-0001-000000000001', 'Length', 'Дължина', 'select', false, false, '["Short","Regular","Long","Extra Long"]', '["Къса","Стандартна","Дълга","Много дълга"]', 3),
('b1000000-0000-0000-0001-000000000001', 'Sleeve Length', 'Дължина на ръкава', 'select', false, false, '["Short Sleeve","Long Sleeve","3/4 Sleeve","Sleeveless"]', '["Къс ръкав","Дълъг ръкав","3/4 ръкав","Без ръкави"]', 4),
('b1000000-0000-0000-0001-000000000001', 'Neckline', 'Деколте', 'select', false, false, '["Crew Neck","V-Neck","Polo","Henley","Turtleneck","Hooded"]', '["Кръгло","V-образно","Поло","Хенли","Поло яка","С качулка"]', 5),
('b1000000-0000-0000-0001-000000000001', 'Rise', 'Кройка талия', 'select', false, false, '["Low Rise","Mid Rise","High Rise"]', '["Ниска талия","Средна талия","Висока талия"]', 6);

-- STEP 8: Create clothing attributes for Women's Clothing
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('b1000000-0000-0000-0002-000000000001', 'Clothing Size', 'Размер облекло', 'select', false, true, '["XXS","XS","S","M","L","XL","XXL","3XL"]', '["XXS","XS","S","M","L","XL","XXL","3XL"]', 1),
('b1000000-0000-0000-0002-000000000001', 'Fit', 'Кройка', 'select', false, true, '["Slim","Regular","Relaxed","Oversized","Bodycon","A-Line"]', '["Прилепнала","Обикновена","Свободна","Oversized","По тялото","А-силует"]', 2),
('b1000000-0000-0000-0002-000000000001', 'Length', 'Дължина', 'select', false, true, '["Mini","Short","Knee Length","Midi","Maxi","Floor Length"]', '["Мини","Къса","До коляното","Миди","Макси","До земята"]', 3),
('b1000000-0000-0000-0002-000000000001', 'Sleeve Length', 'Дължина на ръкава', 'select', false, false, '["Sleeveless","Cap Sleeve","Short Sleeve","3/4 Sleeve","Long Sleeve","Bell Sleeve"]', '["Без ръкави","Калъфче","Къс ръкав","3/4 ръкав","Дълъг ръкав","Камбановиден"]', 4),
('b1000000-0000-0000-0002-000000000001', 'Neckline', 'Деколте', 'select', false, false, '["Crew Neck","V-Neck","Scoop Neck","Square Neck","Sweetheart","Off Shoulder","Halter","Turtleneck","Cowl Neck"]', '["Кръгло","V-образно","Дълбоко кръгло","Квадратно","Сърцевидно","Паднали рамене","Холтер","Поло яка","Водопад"]', 5),
('b1000000-0000-0000-0002-000000000001', 'Rise', 'Кройка талия', 'select', false, false, '["Low Rise","Mid Rise","High Rise","Super High Rise"]', '["Ниска талия","Средна талия","Висока талия","Много висока талия"]', 6);

-- STEP 9: Create clothing attributes for Kids Clothing
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('b1000000-0000-0000-0003-000000000001', 'Clothing Size', 'Размер облекло', 'select', false, true, '["0-3M","3-6M","6-12M","12-18M","18-24M","2T","3T","4T","5","6","7","8","10","12","14","16"]', '["0-3М","3-6М","6-12М","12-18М","18-24М","2Т","3Т","4Т","5","6","7","8","10","12","14","16"]', 1),
('b1000000-0000-0000-0003-000000000001', 'Fit', 'Кройка', 'select', false, true, '["Slim","Regular","Relaxed"]', '["Прилепнала","Обикновена","Свободна"]', 2),
('b1000000-0000-0000-0003-000000000001', 'Sleeve Length', 'Дължина на ръкава', 'select', false, false, '["Short Sleeve","Long Sleeve","Sleeveless"]', '["Къс ръкав","Дълъг ръкав","Без ръкави"]', 3);

-- STEP 10: Create clothing attributes for Unisex Clothing
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
('b1000000-0000-0000-0004-000000000001', 'Clothing Size', 'Размер облекло', 'select', false, true, '["XS","S","M","L","XL","XXL","3XL"]', '["XS","S","M","L","XL","XXL","3XL"]', 1),
('b1000000-0000-0000-0004-000000000001', 'Fit', 'Кройка', 'select', false, true, '["Slim","Regular","Relaxed","Oversized"]', '["Прилепнала","Обикновена","Свободна","Oversized"]', 2),
('b1000000-0000-0000-0004-000000000001', 'Length', 'Дължина', 'select', false, false, '["Short","Regular","Long"]', '["Къса","Стандартна","Дълга"]', 3),
('b1000000-0000-0000-0004-000000000001', 'Sleeve Length', 'Дължина на ръкава', 'select', false, false, '["Short Sleeve","Long Sleeve","3/4 Sleeve","Sleeveless"]', '["Къс ръкав","Дълъг ръкав","3/4 ръкав","Без ръкави"]', 4),
('b1000000-0000-0000-0004-000000000001', 'Neckline', 'Деколте', 'select', false, false, '["Crew Neck","V-Neck","Hooded"]', '["Кръгло","V-образно","С качулка"]', 5);

-- STEP 11: Remove duplicate/redundant attributes from Fashion
DELETE FROM category_attributes 
WHERE category_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0' 
AND name IN ('Fashion Condition', 'Fashion Brand', 'Gender');;
