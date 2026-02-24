
-- ============================================
-- EXPAND EXISTING CATEGORIES WITH MORE SUBCATEGORIES
-- Based on eBay/Amazon marketplace standards
-- ============================================

-- =============================================
-- FASHION - Expand from 5 to 20+ subcategories
-- =============================================
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
-- Fashion Accessories
('c3000001-0001-0001-0001-000000000001', 'Watches', 'Часовници', 'fashion-watches', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000002', 'Sunglasses & Eyewear', 'Слънчеви очила', 'sunglasses-eyewear', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000003', 'Jewelry & Accessories', 'Бижута и аксесоари', 'fashion-jewelry-accessories', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000004', 'Belts', 'Колани', 'belts', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000005', 'Hats & Caps', 'Шапки и кепета', 'hats-caps', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000006', 'Scarves & Wraps', 'Шалове', 'scarves-wraps', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
-- Fashion Clothing Types
('c3000001-0001-0001-0001-000000000007', 'Activewear', 'Спортни дрехи', 'activewear', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000008', 'Swimwear', 'Бански костюми', 'swimwear', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000009', 'Sleepwear & Loungewear', 'Пижами и домашни дрехи', 'sleepwear-loungewear', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000010', 'Uniforms & Work Clothing', 'Униформи и работно облекло', 'uniforms-workwear', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000011', 'Costumes & Cosplay', 'Костюми и косплей', 'costumes-cosplay', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000012', 'Vintage & Retro', 'Винтидж мода', 'vintage-fashion', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000013', 'Plus Size', 'Големи размери', 'plus-size', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000014', 'Maternity', 'За бременни', 'maternity', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd'),
('c3000001-0001-0001-0001-000000000015', 'Wedding & Formal', 'Сватбени и официални', 'wedding-formal', NULL, '5ede0067-9d66-4a2b-b1ed-682c557a98dd');

-- =============================================
-- SPORTS & OUTDOORS - Expand from 4 to 15+ subcategories
-- =============================================
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c3000002-0002-0002-0002-000000000001', 'Team Sports', 'Отборни спортове', 'team-sports', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b'),
('c3000002-0002-0002-0002-000000000002', 'Water Sports', 'Водни спортове', 'water-sports', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b'),
('c3000002-0002-0002-0002-000000000003', 'Winter Sports', 'Зимни спортове', 'winter-sports', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b'),
('c3000002-0002-0002-0002-000000000004', 'Golf', 'Голф', 'golf', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b'),
('c3000002-0002-0002-0002-000000000005', 'Fishing', 'Риболов', 'fishing', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b'),
('c3000002-0002-0002-0002-000000000006', 'Hunting', 'Лов', 'hunting', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b'),
('c3000002-0002-0002-0002-000000000007', 'Camping & Hiking', 'Къмпинг и туризъм', 'camping-hiking', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b'),
('c3000002-0002-0002-0002-000000000008', 'Running & Jogging', 'Бягане', 'running-jogging', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b'),
('c3000002-0002-0002-0002-000000000009', 'Yoga & Pilates', 'Йога и пилатес', 'yoga-pilates', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b'),
('c3000002-0002-0002-0002-000000000010', 'Martial Arts & Combat', 'Бойни изкуства', 'martial-arts', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b'),
('c3000002-0002-0002-0002-000000000011', 'Tennis & Racquet Sports', 'Тенис и ракетни спортове', 'tennis-racquet', NULL, '331b9482-cf32-4153-a45f-7f610d54c85b');

-- =============================================
-- BOOKS - Expand from 4 to 12+ subcategories
-- =============================================
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c3000003-0003-0003-0003-000000000001', 'Textbooks', 'Учебници', 'textbooks', NULL, '592fa037-5088-4122-a9d3-e5b9fae5d72b'),
('c3000003-0003-0003-0003-000000000002', 'Magazines & Periodicals', 'Списания и периодика', 'magazines-periodicals', NULL, '592fa037-5088-4122-a9d3-e5b9fae5d72b'),
('c3000003-0003-0003-0003-000000000003', 'Audiobooks', 'Аудио книги', 'audiobooks', NULL, '592fa037-5088-4122-a9d3-e5b9fae5d72b'),
('c3000003-0003-0003-0003-000000000004', 'Comics & Manga', 'Комикси и манга', 'comics-manga', NULL, '592fa037-5088-4122-a9d3-e5b9fae5d72b'),
('c3000003-0003-0003-0003-000000000005', 'Rare & Collectible Books', 'Редки и колекционерски книги', 'rare-collectible-books', NULL, '592fa037-5088-4122-a9d3-e5b9fae5d72b'),
('c3000003-0003-0003-0003-000000000006', 'Cookbooks', 'Готварски книги', 'cookbooks', NULL, '592fa037-5088-4122-a9d3-e5b9fae5d72b'),
('c3000003-0003-0003-0003-000000000007', 'Self-Help & Motivation', 'Самопомощ и мотивация', 'self-help-motivation', NULL, '592fa037-5088-4122-a9d3-e5b9fae5d72b'),
('c3000003-0003-0003-0003-000000000008', 'Biography & Memoir', 'Биографии и мемоари', 'biography-memoir', NULL, '592fa037-5088-4122-a9d3-e5b9fae5d72b');

-- =============================================
-- TOYS & GAMES - Expand from 4 to 15+ subcategories
-- =============================================
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c3000004-0004-0004-0004-000000000001', 'Outdoor Toys', 'Играчки за навън', 'outdoor-toys', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210'),
('c3000004-0004-0004-0004-000000000002', 'Building Sets & Blocks', 'Конструктори и блокове', 'building-sets', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210'),
('c3000004-0004-0004-0004-000000000003', 'Puzzles', 'Пъзели', 'puzzles', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210'),
('c3000004-0004-0004-0004-000000000004', 'RC Vehicles & Drones', 'RC коли и дронове', 'rc-vehicles-drones', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210'),
('c3000004-0004-0004-0004-000000000005', 'Collectible Toys', 'Колекционерски играчки', 'collectible-toys', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210'),
('c3000004-0004-0004-0004-000000000006', 'Pretend Play', 'Игра на преструване', 'pretend-play', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210'),
('c3000004-0004-0004-0004-000000000007', 'Arts & Crafts for Kids', 'Изкуство и занаяти за деца', 'arts-crafts-kids', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210'),
('c3000004-0004-0004-0004-000000000008', 'LEGO & Compatible', 'LEGO и съвместими', 'lego-compatible', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210'),
('c3000004-0004-0004-0004-000000000009', 'Card Games', 'Карти за игра', 'card-games', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210'),
('c3000004-0004-0004-0004-000000000010', 'Baby Toys', 'Бебешки играчки', 'baby-toys', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210'),
('c3000004-0004-0004-0004-000000000011', 'Party Supplies', 'Парти консумативи', 'party-supplies', NULL, '4c44039f-7aa8-4e03-b9a5-6a18af23e210');

-- =============================================
-- GAMING - Expand from 4 to 12+ subcategories
-- =============================================
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c3000005-0005-0005-0005-000000000001', 'Retro Gaming', 'Ретро гейминг', 'retro-gaming', NULL, '83d6f171-02af-4dba-9621-94c9d30e45da'),
('c3000005-0005-0005-0005-000000000002', 'Gaming Furniture', 'Геймърски мебели', 'gaming-furniture', NULL, '83d6f171-02af-4dba-9621-94c9d30e45da'),
('c3000005-0005-0005-0005-000000000003', 'VR Gaming', 'VR гейминг', 'vr-gaming', NULL, '83d6f171-02af-4dba-9621-94c9d30e45da'),
('c3000005-0005-0005-0005-000000000004', 'Game Cards & Currency', 'Игрови карти и валута', 'game-cards-currency', NULL, '83d6f171-02af-4dba-9621-94c9d30e45da'),
('c3000005-0005-0005-0005-000000000005', 'Gaming Merchandise', 'Геймърски стоки', 'gaming-merchandise', NULL, '83d6f171-02af-4dba-9621-94c9d30e45da'),
('c3000005-0005-0005-0005-000000000006', 'Nintendo', 'Nintendo', 'nintendo', NULL, '83d6f171-02af-4dba-9621-94c9d30e45da'),
('c3000005-0005-0005-0005-000000000007', 'PlayStation', 'PlayStation', 'playstation', NULL, '83d6f171-02af-4dba-9621-94c9d30e45da'),
('c3000005-0005-0005-0005-000000000008', 'Xbox', 'Xbox', 'xbox', NULL, '83d6f171-02af-4dba-9621-94c9d30e45da');

-- =============================================
-- HOME & KITCHEN - Expand from 5 to 18+ subcategories
-- =============================================
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c3000006-0006-0006-0006-000000000001', 'Cookware & Bakeware', 'Съдове за готвене и печене', 'cookware-bakeware', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000002', 'Kitchen Utensils & Gadgets', 'Кухненски прибори', 'kitchen-utensils', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000003', 'Cleaning Supplies', 'Почистващи препарати', 'cleaning-supplies', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000004', 'Bathroom', 'Баня', 'bathroom', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000005', 'Lighting & Lamps', 'Осветление и лампи', 'lighting-lamps', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000006', 'Rugs & Carpets', 'Килими', 'rugs-carpets', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000007', 'Wall Art & Decor', 'Стенно изкуство и декор', 'wall-art-decor', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000008', 'Candles & Fragrances', 'Свещи и ароматизатори', 'candles-fragrances', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000009', 'Dinnerware & Tableware', 'Прибори за хранене', 'dinnerware-tableware', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000010', 'Small Appliances', 'Малки уреди', 'small-appliances', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000011', 'Curtains & Window Treatments', 'Завеси и щори', 'curtains-window', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000012', 'Pillows & Throws', 'Възглавници и одеала', 'pillows-throws', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc'),
('c3000006-0006-0006-0006-000000000013', 'Clocks', 'Часовници', 'home-clocks', NULL, 'ccd844a0-1bfa-4d1d-a6f1-ea7eb97c53cc');

-- =============================================
-- COMPUTERS - Expand from 5 to 14+ subcategories
-- =============================================
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c3000007-0007-0007-0007-000000000001', 'Servers & Networking', 'Сървъри и мрежи', 'servers-networking', NULL, '8964ffa9-c87c-4f3c-ab61-d7604b0486a0'),
('c3000007-0007-0007-0007-000000000002', 'External Storage', 'Външна памет', 'external-storage', NULL, '8964ffa9-c87c-4f3c-ab61-d7604b0486a0'),
('c3000007-0007-0007-0007-000000000003', 'Keyboards & Mice', 'Клавиатури и мишки', 'keyboards-mice', NULL, '8964ffa9-c87c-4f3c-ab61-d7604b0486a0'),
('c3000007-0007-0007-0007-000000000004', 'Webcams & Video', 'Уебкамери и видео', 'webcams-video', NULL, '8964ffa9-c87c-4f3c-ab61-d7604b0486a0'),
('c3000007-0007-0007-0007-000000000005', 'Tablet Accessories', 'Аксесоари за таблети', 'tablet-accessories', NULL, '8964ffa9-c87c-4f3c-ab61-d7604b0486a0'),
('c3000007-0007-0007-0007-000000000006', 'Computer Cables', 'Компютърни кабели', 'computer-cables', NULL, '8964ffa9-c87c-4f3c-ab61-d7604b0486a0'),
('c3000007-0007-0007-0007-000000000007', 'Graphics Cards', 'Видеокарти', 'graphics-cards', NULL, '8964ffa9-c87c-4f3c-ab61-d7604b0486a0'),
('c3000007-0007-0007-0007-000000000008', 'Processors & CPUs', 'Процесори', 'processors-cpus', NULL, '8964ffa9-c87c-4f3c-ab61-d7604b0486a0'),
('c3000007-0007-0007-0007-000000000009', 'RAM & Memory', 'RAM памет', 'ram-memory', NULL, '8964ffa9-c87c-4f3c-ab61-d7604b0486a0');
;
