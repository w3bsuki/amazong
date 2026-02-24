-- ============================================
-- COMPLETE CATEGORY RESTRUCTURE MIGRATION
-- Date: December 3, 2025
-- 
-- This migration:
-- 1. Backs up product-category relationships
-- 2. Deletes ALL existing categories
-- 3. Inserts complete category hierarchy from docs
-- 4. Restores product relationships to root categories
-- ============================================

-- STEP 1: Create backup table of product-category relationships
CREATE TEMP TABLE product_category_backup AS
SELECT 
    p.id as product_id,
    c.slug as category_slug,
    c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.id;

-- STEP 2: Remove foreign key constraint temporarily
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE products ALTER COLUMN category_id DROP NOT NULL;

-- STEP 3: Set all product category_ids to NULL
UPDATE products SET category_id = NULL;

-- STEP 4: Delete ALL existing categories (clean slate)
DELETE FROM categories;

-- ============================================
-- STEP 5: INSERT ROOT CATEGORIES (L0)
-- ============================================

INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order) VALUES
-- Core Categories (1-10)
('Fashion', 'fashion', 'Мода', '👗', 'Clothing, shoes, accessories and jewelry', NULL, 1),
('Electronics', 'electronics', 'Електроника', '📱', 'Phones, computers, audio and smart devices', NULL, 2),
('Automotive', 'automotive', 'Автомобили', '🚗', 'Vehicles, parts, accessories and services', NULL, 3),
('Home & Kitchen', 'home', 'Дом и Кухня', '🏠', 'Furniture, kitchen, bedding and décor', NULL, 4),
('Sports & Outdoors', 'sports', 'Спорт и туризъм', '⚽', 'Sports equipment, fitness and outdoor gear', NULL, 5),
('Beauty', 'beauty', 'Красота', '💄', 'Makeup, skincare, haircare and fragrances', NULL, 6),
('Toys & Hobbies', 'toys', 'Играчки и хобита', '🧸', 'Toys, games, hobbies and collectibles', NULL, 7),
('Gaming', 'gaming', 'Гейминг', '🎮', 'Consoles, video games, PC gaming and accessories', NULL, 8),
('Computers', 'computers', 'Компютри', '💻', 'Laptops, desktops, components and peripherals', NULL, 9),
('Books & Magazines', 'books', 'Книги и списания', '📚', 'Fiction, non-fiction, textbooks and magazines', NULL, 10),

-- More Categories (11-20)
('Pet Supplies', 'pets', 'Зоомагазин', '🐕', 'Food, toys and supplies for all pets', NULL, 11),
('Baby & Kids', 'baby-kids', 'Бебета и деца', '👶', 'Baby gear, kids clothing and toys', NULL, 12),
('Health & Wellness', 'health-wellness', 'Здраве', '💊', 'Vitamins, supplements and health products', NULL, 13),
('Garden & Outdoor', 'garden-outdoor', 'Градина', '🌱', 'Plants, tools and outdoor furniture', NULL, 14),
('Jewelry & Watches', 'jewelry-watches', 'Бижута и часовници', '💎', 'Fine jewelry, watches and accessories', NULL, 15),
('Collectibles & Art', 'collectibles', 'Колекционерски', '🎨', 'Art, antiques, coins and memorabilia', NULL, 16),
('Movies & Music', 'movies-music', 'Филми и музика', '🎬', 'DVDs, vinyl, CDs and streaming', NULL, 17),
('Musical Instruments', 'musical-instruments', 'Музикални инструменти', '🎸', 'Instruments, equipment and accessories', NULL, 18),
('Office & School', 'office-school', 'Офис и училище', '📝', 'Office supplies, furniture and school items', NULL, 19),
('Cameras & Photo', 'cameras-photo', 'Фото и видео', '📷', 'Cameras, lenses and photography equipment', NULL, 20),

-- Even More (21-30)
('Cell Phones', 'cell-phones', 'Телефони', '📱', 'Smartphones, accessories and tablets', NULL, 21),
('Smart Home', 'smart-home', 'Умен дом', '🏠', 'Smart devices, security and automation', NULL, 22),
('Tools & Hardware', 'tools-home', 'Инструменти', '🔧', 'Power tools, hand tools and hardware', NULL, 23),
('Industrial & Scientific', 'industrial', 'Индустриално', '🏭', 'Industrial equipment and scientific supplies', NULL, 24),
('Grocery & Food', 'grocery', 'Храна', '🛒', 'Food, beverages and household items', NULL, 25),
('Handmade & Crafts', 'handmade', 'Ръчна изработка', '🧶', 'Handmade items and craft supplies', NULL, 26),
('Services', 'services', 'Услуги', '🛠️', 'Professional and personal services', NULL, 27),
('Real Estate', 'real-estate', 'Имоти', '🏡', 'Property sales and rentals', NULL, 28),
('Software & Digital', 'software', 'Софтуер', '💿', 'Software, apps and digital products', NULL, 29),
('Gift Cards', 'gift-cards', 'Ваучери', '🎁', 'Gift cards and vouchers', NULL, 30),

-- Niche Categories (31-35)
('Bulgarian Traditional', 'bulgarian-traditional', 'Българско', '🇧🇬', 'Traditional Bulgarian products', NULL, 31),
('E-Mobility', 'e-mobility', 'Електромобилност', '⚡', 'Electric vehicles, scooters and bikes', NULL, 32),
('Agriculture', 'agriculture', 'Земеделие', '🚜', 'Farming equipment and supplies', NULL, 33),
('Tickets & Events', 'tickets', 'Билети', '🎟️', 'Event tickets and experiences', NULL, 34),
('Wholesale', 'wholesale', 'Търговия на едро', '📦', 'Bulk and wholesale products', NULL, 35);

-- ============================================
-- STEP 6: FASHION L1 & L2 Categories
-- ============================================

-- Fashion L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT 
    name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'fashion'),
    display_order
FROM (VALUES
    ('Women''s Clothing', 'womens-clothing', 'Дамско облекло', '👩', 'Women''s fashion and apparel', 1),
    ('Men''s Clothing', 'mens-clothing', 'Мъжко облекло', '👨', 'Men''s fashion and apparel', 2),
    ('Shoes', 'fashion-shoes', 'Обувки', '👟', 'Footwear for all', 3),
    ('Bags & Accessories', 'bags-accessories', 'Чанти и аксесоари', '👜', 'Bags, belts, hats and more', 4),
    ('Jewelry & Watches', 'fashion-jewelry', 'Бижута и часовници', '💍', 'Fashion jewelry and watches', 5),
    ('Kids & Baby Fashion', 'kids-baby-fashion', 'Детска мода', '👶', 'Children''s clothing', 6)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Fashion > Women's Clothing L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'womens-clothing'),
    display_order
FROM (VALUES
    ('Dresses', 'womens-dresses', 'Рокли', 'All types of dresses', 1),
    ('Tops & Blouses', 'womens-tops', 'Топове и блузи', 'Tops, blouses, t-shirts', 2),
    ('Pants & Jeans', 'womens-pants', 'Панталони и дънки', 'Pants, jeans, leggings', 3),
    ('Skirts', 'womens-skirts', 'Поли', 'All types of skirts', 4),
    ('Jackets & Coats', 'womens-jackets', 'Якета и палта', 'Outerwear', 5),
    ('Sweaters & Cardigans', 'womens-sweaters', 'Пуловери и жилетки', 'Knitwear', 6),
    ('Activewear', 'womens-activewear', 'Спортно облекло', 'Sports and workout wear', 7),
    ('Swimwear', 'womens-swimwear', 'Бански', 'Swimsuits and beachwear', 8),
    ('Lingerie & Sleepwear', 'womens-lingerie', 'Бельо и пижами', 'Underwear and sleepwear', 9)
) AS t(name, slug, name_bg, description, display_order);

-- Fashion > Men's Clothing L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'mens-clothing'),
    display_order
FROM (VALUES
    ('T-Shirts & Polos', 'mens-tshirts', 'Тениски и поло', 'Casual tops', 1),
    ('Shirts', 'mens-shirts', 'Ризи', 'Dress and casual shirts', 2),
    ('Pants & Jeans', 'mens-pants', 'Панталони и дънки', 'Pants and jeans', 3),
    ('Shorts', 'mens-shorts', 'Къси панталони', 'Shorts for all occasions', 4),
    ('Jackets & Coats', 'mens-jackets', 'Якета и палта', 'Outerwear', 5),
    ('Sweaters & Hoodies', 'mens-sweaters', 'Пуловери и суитшъри', 'Knitwear and hoodies', 6),
    ('Suits & Blazers', 'mens-suits', 'Костюми и сака', 'Formal wear', 7),
    ('Activewear', 'mens-activewear', 'Спортно облекло', 'Sports and workout wear', 8),
    ('Underwear & Sleepwear', 'mens-underwear', 'Бельо и пижами', 'Underwear and sleepwear', 9)
) AS t(name, slug, name_bg, description, display_order);

-- Fashion > Shoes L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'fashion-shoes'),
    display_order
FROM (VALUES
    ('Women''s Shoes', 'shoes-womens', 'Дамски обувки', 'Women''s footwear', 1),
    ('Men''s Shoes', 'shoes-mens', 'Мъжки обувки', 'Men''s footwear', 2),
    ('Sports Shoes', 'shoes-sports', 'Спортни обувки', 'Athletic footwear', 3),
    ('Kids'' Shoes', 'shoes-kids', 'Детски обувки', 'Children''s footwear', 4),
    ('Shoe Care', 'shoes-care', 'Грижа за обувки', 'Shoe care products', 5)
) AS t(name, slug, name_bg, description, display_order);

-- Fashion > Bags & Accessories L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'bags-accessories'),
    display_order
FROM (VALUES
    ('Handbags', 'handbags', 'Дамски чанти', 'Women''s handbags', 1),
    ('Backpacks', 'backpacks', 'Раници', 'Backpacks for all', 2),
    ('Wallets', 'wallets', 'Портфейли', 'Wallets and cardholders', 3),
    ('Belts', 'fashion-belts', 'Колани', 'Belts', 4),
    ('Hats & Caps', 'hats-caps', 'Шапки и кепета', 'Headwear', 5),
    ('Scarves & Wraps', 'scarves-wraps', 'Шалове и шалчета', 'Scarves and wraps', 6),
    ('Sunglasses', 'sunglasses', 'Слънчеви очила', 'Sunglasses', 7),
    ('Gloves', 'gloves', 'Ръкавици', 'Gloves', 8)
) AS t(name, slug, name_bg, description, display_order);

-- Fashion > Jewelry L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'fashion-jewelry'),
    display_order
FROM (VALUES
    ('Necklaces & Pendants', 'necklaces', 'Колиета и медальони', 'Necklaces and pendants', 1),
    ('Earrings', 'earrings', 'Обеци', 'All types of earrings', 2),
    ('Bracelets', 'bracelets', 'Гривни', 'Bracelets', 3),
    ('Rings', 'rings', 'Пръстени', 'Rings', 4),
    ('Watches', 'fashion-watches-l2', 'Часовници', 'Fashion watches', 5),
    ('Jewelry Sets', 'jewelry-sets', 'Комплекти бижута', 'Jewelry sets', 6)
) AS t(name, slug, name_bg, description, display_order);

-- Fashion > Kids L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'kids-baby-fashion'),
    display_order
FROM (VALUES
    ('Girls'' Clothing', 'girls-clothing', 'Момичешко облекло', 'Girls'' apparel', 1),
    ('Boys'' Clothing', 'boys-clothing', 'Момчешко облекло', 'Boys'' apparel', 2),
    ('Baby Clothing', 'baby-clothing', 'Бебешко облекло', 'Baby apparel 0-24 months', 3),
    ('Kids'' Accessories', 'kids-accessories', 'Детски аксесоари', 'Kids'' accessories', 4)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 7: ELECTRONICS L1 & L2 Categories
-- ============================================

-- Electronics L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'electronics'),
    display_order
FROM (VALUES
    ('Phones & Tablets', 'phones-tablets', 'Телефони и таблети', '📱', 'Smartphones and tablets', 1),
    ('Computers', 'electronics-computers', 'Компютри', '💻', 'Laptops and desktops', 2),
    ('TV & Audio', 'tv-audio', 'Телевизори и аудио', '📺', 'TVs, speakers and audio', 3),
    ('Cameras & Photo', 'electronics-cameras', 'Камери и фото', '📷', 'Digital cameras and accessories', 4),
    ('Gaming', 'electronics-gaming', 'Гейминг', '🎮', 'Gaming consoles and games', 5),
    ('Smart Home', 'electronics-smart-home', 'Умен дом', '🔌', 'Smart devices and appliances', 6)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Electronics > Phones & Tablets L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'phones-tablets'),
    display_order
FROM (VALUES
    ('Smartphones', 'smartphones', 'Смартфони', 'Mobile phones', 1),
    ('Tablets', 'tablets', 'Таблети', 'Tablet computers', 2),
    ('Smartwatches & Wearables', 'smartwatches', 'Смарт часовници', 'Wearable devices', 3),
    ('Phone Accessories', 'phone-accessories', 'Аксесоари за телефони', 'Cases, chargers, etc.', 4),
    ('Tablet Accessories', 'tablet-accessories', 'Аксесоари за таблети', 'Tablet accessories', 5)
) AS t(name, slug, name_bg, description, display_order);

-- Electronics > TV & Audio L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'tv-audio'),
    display_order
FROM (VALUES
    ('Televisions', 'televisions', 'Телевизори', 'TVs of all sizes', 1),
    ('Home Theater', 'home-theater', 'Домашно кино', 'Home theater systems', 2),
    ('Soundbars & Speakers', 'soundbars-speakers', 'Саундбари и тонколони', 'Audio speakers', 3),
    ('Headphones & Earphones', 'headphones', 'Слушалки', 'All types of headphones', 4),
    ('Streaming Devices', 'streaming-devices', 'Стрийминг устройства', 'Streaming players', 5),
    ('Projectors', 'projectors', 'Проектори', 'Home and business projectors', 6)
) AS t(name, slug, name_bg, description, display_order);

-- Electronics > Cameras L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'electronics-cameras'),
    display_order
FROM (VALUES
    ('Digital Cameras', 'digital-cameras', 'Цифрови фотоапарати', 'DSLR, mirrorless, compact', 1),
    ('Camera Lenses', 'camera-lenses', 'Обективи', 'Interchangeable lenses', 2),
    ('Action Cameras', 'action-cameras', 'Екшън камери', 'GoPro and similar', 3),
    ('Drones', 'drones', 'Дронове', 'Camera drones', 4),
    ('Camera Accessories', 'camera-accessories', 'Аксесоари за камери', 'Bags, tripods, etc.', 5),
    ('Studio Equipment', 'studio-equipment', 'Студийно оборудване', 'Lighting and backdrops', 6)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 8: AUTOMOTIVE L1 & L2 Categories
-- ============================================

-- Automotive L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'automotive'),
    display_order
FROM (VALUES
    ('Vehicles', 'vehicles', 'Превозни средства', '🚘', 'Cars, motorcycles, boats', 1),
    ('Parts & Components', 'auto-parts', 'Части и компоненти', '🔧', 'Engine, brakes, body parts', 2),
    ('Accessories', 'auto-accessories', 'Аксесоари', '🎨', 'Interior, exterior, electronics', 3),
    ('Services', 'auto-services', 'Услуги', '🛠️', 'Repair, maintenance, detailing', 4)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Automotive > Vehicles L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'vehicles'),
    display_order
FROM (VALUES
    ('Cars', 'cars', 'Коли', 'Passenger cars', 1),
    ('SUVs & Crossovers', 'suvs', 'Джипове', 'SUVs and crossovers', 2),
    ('Motorcycles', 'motorcycles', 'Мотоциклети', 'Motorcycles and scooters', 3),
    ('Trucks & Pickups', 'trucks', 'Камиони и пикапи', 'Trucks and pickup trucks', 4),
    ('Vans & Buses', 'vans-buses', 'Ванове и автобуси', 'Vans and buses', 5),
    ('Campers & Caravans', 'campers', 'Кемпери и каравани', 'RVs and campers', 6),
    ('Boats & Watercraft', 'boats', 'Лодки', 'Boats and personal watercraft', 7),
    ('ATVs & Quads', 'atvs', 'АТВ и квадрациклети', 'All-terrain vehicles', 8),
    ('Agricultural & Construction', 'agricultural', 'Селскостопанска техника', 'Tractors and construction', 9),
    ('Trailers', 'trailers', 'Ремаркета', 'Trailers', 10)
) AS t(name, slug, name_bg, description, display_order);

-- Automotive > Parts L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'auto-parts'),
    display_order
FROM (VALUES
    ('Engine & Drivetrain', 'engine-parts', 'Двигател и задвижване', 'Engine components', 1),
    ('Brakes & Suspension', 'brakes-suspension', 'Спирачки и окачване', 'Brakes and suspension', 2),
    ('Body & Exterior', 'body-parts', 'Каросерия', 'Body panels and exterior', 3),
    ('Interior', 'interior-parts', 'Интериор', 'Interior parts', 4),
    ('Electrical & Lighting', 'electrical-parts', 'Електрика и осветление', 'Electrical and lights', 5),
    ('Wheels & Tires', 'wheels-tires', 'Джанти и гуми', 'Wheels, tires, rims', 6),
    ('Exhaust & Emissions', 'exhaust', 'Ауспуси', 'Exhaust systems', 7),
    ('Cooling & Heating', 'cooling-heating', 'Охлаждане и отопление', 'Cooling and HVAC', 8),
    ('Transmission & Clutch', 'transmission', 'Скоростна кутия', 'Transmission parts', 9),
    ('Filters & Maintenance', 'filters-maintenance', 'Филтри и поддръжка', 'Filters and service parts', 10)
) AS t(name, slug, name_bg, description, display_order);

-- Automotive > Accessories L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'auto-accessories'),
    display_order
FROM (VALUES
    ('Car Electronics', 'car-electronics', 'Автоелектроника', 'Car audio, GPS, cameras', 1),
    ('Interior Accessories', 'interior-accessories', 'Интериорни аксесоари', 'Seat covers, mats, etc.', 2),
    ('Exterior Accessories', 'exterior-accessories', 'Екстериорни аксесоари', 'Spoilers, lights, etc.', 3),
    ('Performance & Tuning', 'performance-tuning', 'Тунинг', 'Performance parts', 4),
    ('Car Care & Detailing', 'car-care', 'Грижа за автомобила', 'Cleaning and detailing', 5),
    ('Cargo & Storage', 'cargo-storage', 'Багажници', 'Roof boxes, carriers', 6),
    ('Safety & Security', 'auto-safety', 'Безопасност', 'Alarms, cameras, safety', 7),
    ('Tools & Equipment', 'auto-tools', 'Инструменти', 'Car tools and equipment', 8)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 9: HOME & KITCHEN L1 & L2 Categories
-- ============================================

-- Home L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'home'),
    display_order
FROM (VALUES
    ('Furniture', 'furniture', 'Мебели', '🛋️', 'Home furniture', 1),
    ('Kitchen & Dining', 'kitchen-dining', 'Кухня и хранене', '🍳', 'Kitchen items', 2),
    ('Bedding & Bath', 'bedding-bath', 'Спално бельо и баня', '🛏️', 'Bedding and bathroom', 3),
    ('Lighting', 'lighting', 'Осветление', '💡', 'Lamps and lighting', 4),
    ('Home Décor', 'home-decor', 'Декорация', '🖼️', 'Home decoration', 5),
    ('Household & Cleaning', 'household', 'Домакинство', '🧹', 'Cleaning and household', 6)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Home > Furniture L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'furniture'),
    display_order
FROM (VALUES
    ('Sofas & Couches', 'sofas', 'Дивани и канапета', 'Living room seating', 1),
    ('Chairs & Armchairs', 'chairs', 'Столове и кресла', 'Seating', 2),
    ('Tables', 'tables', 'Маси', 'Dining and coffee tables', 3),
    ('Beds & Mattresses', 'beds-mattresses', 'Легла и матраци', 'Bedroom furniture', 4),
    ('Wardrobes & Storage', 'wardrobes', 'Гардероби и шкафове', 'Storage furniture', 5),
    ('Desks & Office', 'desks', 'Бюра и офис мебели', 'Office furniture', 6),
    ('Shelving & Bookcases', 'shelving', 'Рафтове и етажерки', 'Shelving units', 7),
    ('TV Stands', 'tv-stands', 'ТВ шкафове', 'Media furniture', 8),
    ('Outdoor Furniture', 'outdoor-furniture', 'Градински мебели', 'Patio furniture', 9)
) AS t(name, slug, name_bg, description, display_order);

-- Home > Kitchen & Dining L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'kitchen-dining'),
    display_order
FROM (VALUES
    ('Cookware', 'cookware', 'Съдове за готвене', 'Pots, pans, etc.', 1),
    ('Bakeware', 'bakeware', 'Форми за печене', 'Baking pans and sheets', 2),
    ('Kitchen Appliances', 'kitchen-appliances', 'Кухненски уреди', 'Small appliances', 3),
    ('Dinnerware', 'dinnerware', 'Прибори за хранене', 'Plates and bowls', 4),
    ('Glassware', 'glassware', 'Стъклария', 'Glasses and drinkware', 5),
    ('Cutlery & Utensils', 'cutlery', 'Прибори', 'Knives and utensils', 6),
    ('Food Storage', 'food-storage', 'Съхранение на храна', 'Containers', 7),
    ('Kitchen Organization', 'kitchen-organization', 'Организация', 'Kitchen storage', 8)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 10: GAMING L1 & L2 Categories
-- ============================================

-- Gaming L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'gaming'),
    display_order
FROM (VALUES
    ('Video Game Consoles', 'consoles', 'Конзоли', '🕹️', 'PlayStation, Xbox, Nintendo', 1),
    ('Video Games', 'video-games', 'Видео игри', '💿', 'Games for all platforms', 2),
    ('PC Gaming', 'pc-gaming', 'PC гейминг', '🖥️', 'Gaming PCs and components', 3),
    ('Gaming Accessories', 'gaming-accessories', 'Гейминг аксесоари', '🎧', 'Controllers, headsets, etc.', 4),
    ('Mobile Gaming', 'mobile-gaming', 'Мобилен гейминг', '📱', 'Mobile gaming devices', 5),
    ('Trading Cards', 'trading-cards', 'Колекционерски карти', '🃏', 'Pokemon, MTG, Yu-Gi-Oh', 6),
    ('Board Games', 'board-games', 'Настолни игри', '🎲', 'Board games and puzzles', 7),
    ('Gaming Merchandise', 'gaming-merch', 'Гейминг стоки', '🎯', 'Figures, apparel, posters', 8)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Gaming > Consoles L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'consoles'),
    display_order
FROM (VALUES
    ('PlayStation', 'playstation', 'PlayStation', 'Sony PlayStation consoles', 1),
    ('Xbox', 'xbox', 'Xbox', 'Microsoft Xbox consoles', 2),
    ('Nintendo', 'nintendo', 'Nintendo', 'Nintendo consoles', 3),
    ('Retro Consoles', 'retro-consoles', 'Ретро конзоли', 'Classic consoles', 4),
    ('Handheld Consoles', 'handheld-consoles', 'Преносими конзоли', 'Portable gaming', 5),
    ('Console Accessories', 'console-accessories', 'Аксесоари за конзоли', 'Controllers, etc.', 6)
) AS t(name, slug, name_bg, description, display_order);

-- Gaming > Video Games L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'video-games'),
    display_order
FROM (VALUES
    ('PlayStation Games', 'ps-games', 'PlayStation игри', 'PS4, PS5 games', 1),
    ('Xbox Games', 'xbox-games', 'Xbox игри', 'Xbox games', 2),
    ('Nintendo Games', 'nintendo-games', 'Nintendo игри', 'Switch, 3DS games', 3),
    ('PC Games', 'pc-games', 'PC игри', 'Computer games', 4),
    ('Retro Games', 'retro-games', 'Ретро игри', 'Classic games', 5)
) AS t(name, slug, name_bg, description, display_order);

-- Gaming > PC Gaming L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'pc-gaming'),
    display_order
FROM (VALUES
    ('Gaming PCs', 'gaming-pcs', 'Геймърски компютри', 'Pre-built gaming PCs', 1),
    ('Gaming Laptops', 'gaming-laptops', 'Геймърски лаптопи', 'Gaming notebooks', 2),
    ('Graphics Cards', 'graphics-cards', 'Видео карти', 'GPU for gaming', 3),
    ('Gaming Monitors', 'gaming-monitors', 'Геймърски монитори', 'High refresh monitors', 4),
    ('Gaming Keyboards', 'gaming-keyboards', 'Геймърски клавиатури', 'Mechanical keyboards', 5),
    ('Gaming Mice', 'gaming-mice', 'Геймърски мишки', 'Gaming mice', 6),
    ('Gaming Headsets', 'gaming-headsets', 'Геймърски слушалки', 'Gaming audio', 7),
    ('Gaming Chairs', 'gaming-chairs', 'Геймърски столове', 'Gaming seating', 8)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 11: BEAUTY L1 & L2 Categories
-- ============================================

-- Beauty L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'beauty'),
    display_order
FROM (VALUES
    ('Makeup', 'makeup', 'Грим', '💋', 'Face, eye, lip makeup', 1),
    ('Skincare', 'skincare', 'Грижа за кожата', '🧴', 'Cleansers, moisturizers', 2),
    ('Hair Care', 'haircare', 'Грижа за косата', '💇', 'Shampoo, styling, color', 3),
    ('Fragrance', 'fragrance', 'Парфюмерия', '🌸', 'Perfumes and colognes', 4),
    ('Bath & Body', 'bath-body', 'Баня и тяло', '🧼', 'Body care products', 5),
    ('Oral Care', 'oral-care', 'Орална хигиена', '🪥', 'Dental care', 6),
    ('Men''s Grooming', 'mens-grooming', 'Мъжка грижа', '🧔', 'Shaving and grooming', 7),
    ('Tools & Brushes', 'beauty-tools', 'Инструменти', '💅', 'Brushes and beauty tools', 8)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Beauty > Makeup L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'makeup'),
    display_order
FROM (VALUES
    ('Face Makeup', 'face-makeup', 'Грим за лице', 'Foundation, concealer, powder', 1),
    ('Eye Makeup', 'eye-makeup', 'Грим за очи', 'Eyeshadow, mascara, liner', 2),
    ('Lip Makeup', 'lip-makeup', 'Грим за устни', 'Lipstick, gloss, liner', 3),
    ('Nail Care', 'nail-care', 'Грижа за ноктите', 'Polish, treatments', 4),
    ('Makeup Brushes', 'makeup-brushes', 'Четки за грим', 'Brushes and tools', 5),
    ('Makeup Sets', 'makeup-sets', 'Комплекти грим', 'Gift sets', 6)
) AS t(name, slug, name_bg, description, display_order);

-- Beauty > Skincare L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'skincare'),
    display_order
FROM (VALUES
    ('Cleansers', 'cleansers', 'Почистващи продукти', 'Face wash, cleansers', 1),
    ('Moisturizers', 'moisturizers', 'Хидратиращи кремове', 'Face moisturizers', 2),
    ('Serums & Treatments', 'serums', 'Серуми', 'Face serums', 3),
    ('Masks', 'face-masks', 'Маски за лице', 'Sheet and cream masks', 4),
    ('Sun Care', 'sun-care', 'Слънцезащита', 'Sunscreen', 5),
    ('Eye Care', 'eye-care', 'Грижа за очите', 'Eye creams', 6),
    ('Lip Care', 'lip-care', 'Грижа за устните', 'Lip balms', 7)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 12: SPORTS & OUTDOORS L1 & L2
-- ============================================

-- Sports L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'sports'),
    display_order
FROM (VALUES
    ('Exercise & Fitness', 'fitness', 'Фитнес', '🏋️', 'Gym and workout equipment', 1),
    ('Cycling', 'cycling', 'Колоездене', '🚴', 'Bikes and accessories', 2),
    ('Team Sports', 'team-sports', 'Отборни спортове', '⚽', 'Football, basketball, etc.', 3),
    ('Water Sports', 'water-sports', 'Водни спортове', '🏊', 'Swimming, surfing, diving', 4),
    ('Winter Sports', 'winter-sports', 'Зимни спортове', '⛷️', 'Skiing, snowboarding', 5),
    ('Hiking & Camping', 'hiking-camping', 'Туризъм и къмпинг', '🥾', 'Outdoor gear', 6),
    ('Running', 'running', 'Бягане', '🏃', 'Running gear', 7),
    ('Golf', 'golf', 'Голф', '⛳', 'Golf equipment', 8),
    ('Combat Sports', 'combat-sports', 'Бойни спортове', '🥊', 'Boxing, MMA, martial arts', 9)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Sports > Fitness L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'fitness'),
    display_order
FROM (VALUES
    ('Cardio Equipment', 'cardio-equipment', 'Кардио уреди', 'Treadmills, bikes', 1),
    ('Strength Training', 'strength-training', 'Силови тренировки', 'Weights, benches', 2),
    ('Yoga & Pilates', 'yoga-pilates', 'Йога и пилатес', 'Mats, accessories', 3),
    ('Fitness Accessories', 'fitness-accessories', 'Фитнес аксесоари', 'Bands, balls, etc.', 4),
    ('Fitness Trackers', 'fitness-trackers', 'Фитнес тракери', 'Activity trackers', 5),
    ('Home Gym', 'home-gym', 'Домашен фитнес', 'Complete home gyms', 6)
) AS t(name, slug, name_bg, description, display_order);

-- Sports > Cycling L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'cycling'),
    display_order
FROM (VALUES
    ('Bikes', 'bikes', 'Велосипеди', 'All types of bikes', 1),
    ('Bike Parts', 'bike-parts', 'Части за велосипеди', 'Components and parts', 2),
    ('Bike Accessories', 'bike-accessories', 'Аксесоари за велосипеди', 'Lights, locks, bags', 3),
    ('Bike Clothing', 'bike-clothing', 'Облекло за колоездене', 'Jerseys, shorts', 4),
    ('Bike Helmets', 'bike-helmets', 'Каски за велосипеди', 'Cycling helmets', 5),
    ('E-Bikes', 'e-bikes', 'Електрически велосипеди', 'Electric bicycles', 6)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 13: TOYS & HOBBIES L1 & L2
-- ============================================

-- Toys L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'toys'),
    display_order
FROM (VALUES
    ('Action Figures', 'action-figures', 'Екшън фигурки', '🦸', 'Superhero and movie figures', 1),
    ('Building Toys', 'building-toys', 'Конструктори', '🧱', 'LEGO and building sets', 2),
    ('Diecast & Vehicles', 'diecast-vehicles', 'Модели и коли', '🚗', 'Model cars and trains', 3),
    ('Dolls & Accessories', 'dolls', 'Кукли', '🎀', 'Dolls and dollhouses', 4),
    ('Puzzles & Games', 'puzzles-games', 'Пъзели и игри', '🧩', 'Puzzles and classic games', 5),
    ('Arts & Crafts', 'arts-crafts', 'Изкуства и занаяти', '🎨', 'Creative toys', 6),
    ('Educational Toys', 'educational-toys', 'Образователни играчки', '🎓', 'STEM and learning', 7),
    ('Outdoor Play', 'outdoor-play', 'Игри на открито', '🪁', 'Outdoor toys', 8),
    ('Plush & Stuffed', 'plush-toys', 'Плюшени играчки', '🧸', 'Stuffed animals', 9)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Toys > Building Toys L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'building-toys'),
    display_order
FROM (VALUES
    ('LEGO', 'lego', 'LEGO', 'Official LEGO sets', 1),
    ('LEGO Alternatives', 'lego-alternatives', 'Алтернативи на LEGO', 'Compatible building blocks', 2),
    ('Magnetic Building', 'magnetic-building', 'Магнитни конструктори', 'Magnetic tiles', 3),
    ('Wooden Blocks', 'wooden-blocks', 'Дървени кубчета', 'Classic wooden blocks', 4),
    ('Model Kits', 'model-kits', 'Модели за сглобяване', 'Plastic and metal models', 5)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 14: COMPUTERS L1 & L2
-- ============================================

-- Computers L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'computers'),
    display_order
FROM (VALUES
    ('Laptops', 'laptops', 'Лаптопи', '💻', 'Notebook computers', 1),
    ('Desktops', 'desktops', 'Настолни компютри', '🖥️', 'Desktop computers', 2),
    ('Components', 'components', 'Компоненти', '🔧', 'PC parts', 3),
    ('Monitors', 'monitors', 'Монитори', '🖥️', 'Computer displays', 4),
    ('Peripherals', 'peripherals', 'Периферия', '⌨️', 'Keyboards, mice, etc.', 5),
    ('Networking', 'networking', 'Мрежово оборудване', '📡', 'Routers, switches', 6),
    ('Storage Devices', 'storage-devices', 'Устройства за съхранение', '🗄️', 'External drives, NAS', 7),
    ('Printers & Scanners', 'printers-scanners', 'Принтери и скенери', '🖨️', 'Printing devices', 8),
    ('Computer Accessories', 'computer-accessories', 'Компютърни аксесоари', '🖱️', 'Bags, stands, hubs', 9)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Computers > Laptops L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'laptops'),
    display_order
FROM (VALUES
    ('Gaming Laptops', 'laptops-gaming', 'Геймърски лаптопи', 'High-performance gaming', 1),
    ('Business Laptops', 'laptops-business', 'Бизнес лаптопи', 'Professional laptops', 2),
    ('Ultrabooks', 'ultrabooks', 'Ултрабуци', 'Thin and light', 3),
    ('2-in-1 Laptops', 'laptops-2in1', '2-в-1 лаптопи', 'Convertible laptops', 4),
    ('Chromebooks', 'chromebooks', 'Chromebook', 'Chrome OS laptops', 5),
    ('MacBooks', 'macbooks', 'MacBook', 'Apple laptops', 6)
) AS t(name, slug, name_bg, description, display_order);

-- Computers > Components L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'components'),
    display_order
FROM (VALUES
    ('CPUs', 'cpus', 'Процесори', 'Processors', 1),
    ('Graphics Cards', 'gpus', 'Видео карти', 'GPUs', 2),
    ('Motherboards', 'motherboards', 'Дънни платки', 'Mainboards', 3),
    ('RAM', 'ram', 'RAM памет', 'Memory modules', 4),
    ('Storage', 'storage', 'Съхранение', 'SSDs and HDDs', 5),
    ('Power Supplies', 'power-supplies', 'Захранвания', 'PSUs', 6),
    ('Cases', 'cases', 'Кутии', 'PC cases', 7),
    ('Cooling', 'cooling', 'Охлаждане', 'Coolers and fans', 8)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 15: BOOKS L1 & L2
-- ============================================

-- Books L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'books'),
    display_order
FROM (VALUES
    ('Fiction', 'fiction', 'Художествена литература', '📖', 'Novels and stories', 1),
    ('Non-Fiction', 'non-fiction', 'Нехудожествена литература', '📘', 'Factual books', 2),
    ('Textbooks & Education', 'textbooks', 'Учебници', '📕', 'Educational materials', 3),
    ('Children''s Books', 'childrens-books', 'Детски книги', '👶', 'Books for kids', 4),
    ('Arts & Photography', 'arts-photography', 'Изкуство и фотография', '🎨', 'Visual arts books', 5),
    ('Lifestyle', 'lifestyle-books', 'Начин на живот', '🍳', 'Cookbooks, hobbies', 6),
    ('Comics & Manga', 'comics-manga', 'Комикси и манга', '📚', 'Graphic novels', 7),
    ('Magazines', 'magazines', 'Списания', '📰', 'Periodicals', 8),
    ('E-Books & Audiobooks', 'ebooks-audiobooks', 'Е-книги и аудиокниги', '🎧', 'Digital books', 9)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Books > Fiction L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'fiction'),
    display_order
FROM (VALUES
    ('Science Fiction', 'science-fiction', 'Научна фантастика', 'Sci-fi novels', 1),
    ('Fantasy', 'fantasy', 'Фентъзи', 'Fantasy novels', 2),
    ('Mystery & Thriller', 'mystery-thriller', 'Мистерия и трилър', 'Crime and suspense', 3),
    ('Romance', 'romance', 'Романтика', 'Love stories', 4),
    ('Horror', 'horror', 'Ужаси', 'Horror fiction', 5),
    ('Historical Fiction', 'historical-fiction', 'Исторически романи', 'Period novels', 6),
    ('Literary Fiction', 'literary-fiction', 'Литературна проза', 'Literary works', 7)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 16: PET SUPPLIES L1 & L2
-- ============================================

-- Pets L1
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description,
    (SELECT id FROM categories WHERE slug = 'pets'),
    display_order
FROM (VALUES
    ('Dogs', 'dogs', 'Кучета', '🐶', 'Dog supplies', 1),
    ('Cats', 'cats', 'Котки', '🐱', 'Cat supplies', 2),
    ('Birds', 'birds', 'Птици', '🐦', 'Bird supplies', 3),
    ('Fish & Aquatic', 'fish-aquatic', 'Риби и аквариуми', '🐠', 'Aquarium supplies', 4),
    ('Small Animals', 'small-animals', 'Малки животни', '🐹', 'Hamsters, rabbits, etc.', 5),
    ('Reptiles', 'reptiles', 'Влечуги', '🦎', 'Reptile supplies', 6),
    ('Horses', 'horses', 'Коне', '🐴', 'Equestrian supplies', 7)
) AS t(name, slug, name_bg, icon, description, display_order);

-- Pets > Dogs L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'dogs'),
    display_order
FROM (VALUES
    ('Dog Food', 'dog-food', 'Храна за кучета', 'Dry and wet food', 1),
    ('Dog Treats', 'dog-treats', 'Лакомства за кучета', 'Treats and chews', 2),
    ('Dog Toys', 'dog-toys', 'Играчки за кучета', 'Toys for dogs', 3),
    ('Dog Beds', 'dog-beds', 'Легла за кучета', 'Beds and furniture', 4),
    ('Dog Collars & Leashes', 'dog-collars', 'Каишки и нашийници', 'Collars and leashes', 5),
    ('Dog Clothing', 'dog-clothing', 'Дрехи за кучета', 'Dog apparel', 6),
    ('Dog Grooming', 'dog-grooming', 'Грижа за кучета', 'Grooming supplies', 7),
    ('Dog Health', 'dog-health', 'Здраве за кучета', 'Health products', 8)
) AS t(name, slug, name_bg, description, display_order);

-- Pets > Cats L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'cats'),
    display_order
FROM (VALUES
    ('Cat Food', 'cat-food', 'Храна за котки', 'Dry and wet food', 1),
    ('Cat Treats', 'cat-treats', 'Лакомства за котки', 'Cat treats', 2),
    ('Cat Toys', 'cat-toys', 'Играчки за котки', 'Cat toys', 3),
    ('Cat Furniture', 'cat-furniture', 'Мебели за котки', 'Trees and scratchers', 4),
    ('Cat Litter', 'cat-litter', 'Тоалетна за котки', 'Litter and boxes', 5),
    ('Cat Grooming', 'cat-grooming', 'Грижа за котки', 'Grooming supplies', 6),
    ('Cat Health', 'cat-health', 'Здраве за котки', 'Health products', 7)
) AS t(name, slug, name_bg, description, display_order);

-- ============================================
-- STEP 17: RESTORE PRODUCT RELATIONSHIPS
-- ============================================

-- Restore products to their ROOT categories (matching by slug)
UPDATE products p
SET category_id = c.id
FROM product_category_backup pcb
JOIN categories c ON c.slug = pcb.category_slug
WHERE p.id = pcb.product_id
  AND c.parent_id IS NULL;

-- For products that were in L2 categories, assign to root
UPDATE products p
SET category_id = (
    SELECT id FROM categories 
    WHERE slug IN ('electronics', 'automotive', 'fashion', 'home', 'gaming', 'computers', 'beauty', 'books', 'sports', 'toys', 'pets')
    ORDER BY RANDOM()
    LIMIT 1
)
WHERE p.category_id IS NULL;

-- Re-add foreign key constraint
ALTER TABLE products 
ADD CONSTRAINT products_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES categories(id);

-- ============================================
-- FINAL STATS
-- ============================================

-- Show what we created
SELECT 
    CASE 
        WHEN parent_id IS NULL THEN 'L0 (Root)'
        WHEN parent_id IN (SELECT id FROM categories WHERE parent_id IS NULL) THEN 'L1'
        ELSE 'L2'
    END as level,
    COUNT(*) as count
FROM categories
GROUP BY 
    CASE 
        WHEN parent_id IS NULL THEN 'L0 (Root)'
        WHEN parent_id IN (SELECT id FROM categories WHERE parent_id IS NULL) THEN 'L1'
        ELSE 'L2'
    END
ORDER BY level;
