
-- KIDS CATEGORY IMPROVEMENT - PHASE 2F: Kids Clothing L3 Categories
-- ================================================================

-- L3 for Baby Clothing (6ca7fe8e-7ac0-4f8a-8ba1-b2b60f5e114e)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Bodysuits & Onesies', 'Бодита', 'babycloth-bodysuits', '6ca7fe8e-7ac0-4f8a-8ba1-b2b60f5e114e', 1),
('Sleepwear & Pajamas', 'Пижами', 'babycloth-sleepwear', '6ca7fe8e-7ac0-4f8a-8ba1-b2b60f5e114e', 2),
('Baby Outfits & Sets', 'Комплекти', 'babycloth-outfits', '6ca7fe8e-7ac0-4f8a-8ba1-b2b60f5e114e', 3),
('Rompers', 'Гащеризони', 'babycloth-rompers', '6ca7fe8e-7ac0-4f8a-8ba1-b2b60f5e114e', 4),
('Baby Tops', 'Блузки', 'babycloth-tops', '6ca7fe8e-7ac0-4f8a-8ba1-b2b60f5e114e', 5),
('Baby Bottoms', 'Панталони', 'babycloth-bottoms', '6ca7fe8e-7ac0-4f8a-8ba1-b2b60f5e114e', 6),
('Baby Outerwear', 'Горно облекло', 'babycloth-outerwear', '6ca7fe8e-7ac0-4f8a-8ba1-b2b60f5e114e', 7),
('Baby Swimwear', 'Бански', 'babycloth-swimwear', '6ca7fe8e-7ac0-4f8a-8ba1-b2b60f5e114e', 8);

-- L3 for Toddler Clothing (adb21062-c5c8-43ab-b6d2-c741e5c92ce3)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Toddler Tops', 'Блузки за малки деца', 'toddlercloth-tops', 'adb21062-c5c8-43ab-b6d2-c741e5c92ce3', 1),
('Toddler Bottoms', 'Панталони за малки деца', 'toddlercloth-bottoms', 'adb21062-c5c8-43ab-b6d2-c741e5c92ce3', 2),
('Toddler Dresses', 'Рокли за малки деца', 'toddlercloth-dresses', 'adb21062-c5c8-43ab-b6d2-c741e5c92ce3', 3),
('Toddler Outerwear', 'Якета за малки деца', 'toddlercloth-outerwear', 'adb21062-c5c8-43ab-b6d2-c741e5c92ce3', 4),
('Toddler Sleepwear', 'Пижами за малки деца', 'toddlercloth-sleepwear', 'adb21062-c5c8-43ab-b6d2-c741e5c92ce3', 5),
('Toddler Swimwear', 'Бански за малки деца', 'toddlercloth-swimwear', 'adb21062-c5c8-43ab-b6d2-c741e5c92ce3', 6);

-- L3 for Kids Clothing 5-12Y (67864706-ca48-423e-a6cb-3cc1f8fc3ec5)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Boys Clothing', 'Облекло за момчета', 'kidscloth-boys', '67864706-ca48-423e-a6cb-3cc1f8fc3ec5', 1),
('Girls Clothing', 'Облекло за момичета', 'kidscloth-girls', '67864706-ca48-423e-a6cb-3cc1f8fc3ec5', 2),
('Unisex Kids Clothing', 'Унисекс детско облекло', 'kidscloth-unisex', '67864706-ca48-423e-a6cb-3cc1f8fc3ec5', 3),
('Kids Outerwear', 'Детски якета', 'kidscloth-outerwear', '67864706-ca48-423e-a6cb-3cc1f8fc3ec5', 4),
('Kids Activewear', 'Спортно облекло', 'kidscloth-activewear', '67864706-ca48-423e-a6cb-3cc1f8fc3ec5', 5),
('School Uniforms', 'Училищни униформи', 'kidscloth-uniforms', '67864706-ca48-423e-a6cb-3cc1f8fc3ec5', 6);

-- L3 for Baby Shoes (52fed7f5-95c7-4254-bf1f-a8f31317d238)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('First Walkers', 'Първи стъпки', 'babyshoe-firstwalk', '52fed7f5-95c7-4254-bf1f-a8f31317d238', 1),
('Soft Sole Shoes', 'Меки обувки', 'babyshoe-softsolee', '52fed7f5-95c7-4254-bf1f-a8f31317d238', 2),
('Baby Booties', 'Терлички', 'babyshoe-booties', '52fed7f5-95c7-4254-bf1f-a8f31317d238', 3),
('Baby Sandals', 'Бебешки сандали', 'babyshoe-sandals', '52fed7f5-95c7-4254-bf1f-a8f31317d238', 4);

-- L3 for Kids Shoes (a5111c0a-c15d-4623-adef-386377024966)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Kids Sneakers', 'Детски маратонки', 'kidshoe-sneakers', 'a5111c0a-c15d-4623-adef-386377024966', 1),
('Kids Sandals', 'Детски сандали', 'kidshoe-sandals', 'a5111c0a-c15d-4623-adef-386377024966', 2),
('Kids Boots', 'Детски ботуши', 'kidshoe-boots', 'a5111c0a-c15d-4623-adef-386377024966', 3),
('Kids Dress Shoes', 'Официални обувки', 'kidshoe-dress', 'a5111c0a-c15d-4623-adef-386377024966', 4),
('School Shoes', 'Училищни обувки', 'kidshoe-school', 'a5111c0a-c15d-4623-adef-386377024966', 5),
('Kids Sports Shoes', 'Спортни обувки', 'kidshoe-sports', 'a5111c0a-c15d-4623-adef-386377024966', 6);

-- L3 for Kids Accessories (41b6f24f-acf5-4f62-b0d8-b7e624f63bb1)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Hats & Caps', 'Шапки', 'kidsacc-hats', '41b6f24f-acf5-4f62-b0d8-b7e624f63bb1', 1),
('Kids Socks', 'Детски чорапи', 'kidsacc-socks', '41b6f24f-acf5-4f62-b0d8-b7e624f63bb1', 2),
('Hair Accessories', 'Аксесоари за коса', 'kidsacc-hair', '41b6f24f-acf5-4f62-b0d8-b7e624f63bb1', 3),
('Kids Backpacks', 'Детски раници', 'kidsacc-backpacks', '41b6f24f-acf5-4f62-b0d8-b7e624f63bb1', 4),
('Gloves & Mittens', 'Ръкавици', 'kidsacc-gloves', '41b6f24f-acf5-4f62-b0d8-b7e624f63bb1', 5),
('Belts & Suspenders', 'Колани и тиранти', 'kidsacc-belts', '41b6f24f-acf5-4f62-b0d8-b7e624f63bb1', 6);
;
