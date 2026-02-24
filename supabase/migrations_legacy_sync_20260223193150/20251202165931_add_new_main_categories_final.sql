
-- ============================================
-- COMPREHENSIVE CATEGORY EXPANSION MIGRATION
-- Based on eBay/Amazon marketplace standards
-- ============================================

-- =============================================
-- PART 1: NEW MAIN CATEGORIES
-- =============================================

-- Real Estate (eBay-style property listings)
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, description, description_bg) VALUES
('c2000001-0001-0001-0001-000000000001', 'Real Estate', 'Недвижими имоти', 'real-estate', 'House', NULL, 'Properties, rentals, and land for sale', 'Имоти, наеми и парцели за продажба');

-- Tickets & Experiences
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, description, description_bg) VALUES
('c2000002-0002-0002-0002-000000000001', 'Tickets & Experiences', 'Билети и преживявания', 'tickets-experiences', 'Ticket', NULL, 'Event tickets, travel, and unique experiences', 'Билети за събития, пътувания и уникални преживявания');

-- Gift Cards & Coupons  
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, description, description_bg) VALUES
('c2000003-0003-0003-0003-000000000001', 'Gift Cards & Coupons', 'Подаръчни карти и купони', 'gift-cards', 'Gift', NULL, 'Digital gift cards and store credits', 'Дигитални подаръчни карти и кредити');

-- Cell Phones & Accessories (Elevated from Electronics)
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, description, description_bg) VALUES
('c2000004-0004-0004-0004-000000000001', 'Cell Phones & Accessories', 'Телефони и аксесоари', 'cell-phones', 'Smartphone', NULL, 'Mobile phones, cases, chargers and accessories', 'Мобилни телефони, калъфи, зарядни и аксесоари');

-- Cameras & Photo (Elevated from Electronics)
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, description, description_bg) VALUES
('c2000005-0005-0005-0005-000000000001', 'Cameras & Photo', 'Фотоапарати и фото', 'cameras-photo', 'Camera', NULL, 'Cameras, lenses, and photography equipment', 'Фотоапарати, обективи и фото оборудване');

-- Everything Else / Miscellaneous
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id, description, description_bg) VALUES
('c2000006-0006-0006-0006-000000000001', 'Everything Else', 'Всичко останало', 'everything-else', 'Package', NULL, 'Miscellaneous items and services', 'Разни артикули и услуги');

-- =============================================
-- PART 2: SUBCATEGORIES FOR NEW MAIN CATEGORIES
-- =============================================

-- Real Estate Subcategories
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c2000001-0001-0001-0001-000000000011', 'Apartments for Sale', 'Апартаменти за продажба', 'apartments-sale', NULL, 'c2000001-0001-0001-0001-000000000001'),
('c2000001-0001-0001-0001-000000000012', 'Apartments for Rent', 'Апартаменти под наем', 'apartments-rent', NULL, 'c2000001-0001-0001-0001-000000000001'),
('c2000001-0001-0001-0001-000000000013', 'Houses for Sale', 'Къщи за продажба', 'houses-sale', NULL, 'c2000001-0001-0001-0001-000000000001'),
('c2000001-0001-0001-0001-000000000014', 'Houses for Rent', 'Къщи под наем', 'houses-rent', NULL, 'c2000001-0001-0001-0001-000000000001'),
('c2000001-0001-0001-0001-000000000015', 'Commercial Property', 'Търговски имоти', 'commercial-property', NULL, 'c2000001-0001-0001-0001-000000000001'),
('c2000001-0001-0001-0001-000000000016', 'Land & Lots', 'Парцели и земя', 'land-lots', NULL, 'c2000001-0001-0001-0001-000000000001'),
('c2000001-0001-0001-0001-000000000017', 'Vacation Rentals', 'Ваканционни наеми', 'vacation-rentals', NULL, 'c2000001-0001-0001-0001-000000000001'),
('c2000001-0001-0001-0001-000000000018', 'Roommates', 'Съквартиранти', 'roommates', NULL, 'c2000001-0001-0001-0001-000000000001');

-- Tickets & Experiences Subcategories
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c2000002-0002-0002-0002-000000000011', 'Concert Tickets', 'Билети за концерти', 'concert-tickets', NULL, 'c2000002-0002-0002-0002-000000000001'),
('c2000002-0002-0002-0002-000000000012', 'Sports Tickets', 'Спортни билети', 'sports-tickets', NULL, 'c2000002-0002-0002-0002-000000000001'),
('c2000002-0002-0002-0002-000000000013', 'Theater Tickets', 'Театрални билети', 'theater-tickets', NULL, 'c2000002-0002-0002-0002-000000000001'),
('c2000002-0002-0002-0002-000000000014', 'Travel Packages', 'Туристически пакети', 'travel-packages', NULL, 'c2000002-0002-0002-0002-000000000001'),
('c2000002-0002-0002-0002-000000000015', 'Adventure Experiences', 'Приключенски преживявания', 'adventure-experiences', NULL, 'c2000002-0002-0002-0002-000000000001'),
('c2000002-0002-0002-0002-000000000016', 'Spa & Wellness Experiences', 'СПА и уелнес изживявания', 'spa-wellness-experiences', NULL, 'c2000002-0002-0002-0002-000000000001'),
('c2000002-0002-0002-0002-000000000017', 'Classes & Workshops', 'Курсове и уъркшопи', 'classes-workshops', NULL, 'c2000002-0002-0002-0002-000000000001'),
('c2000002-0002-0002-0002-000000000018', 'Airline Tickets', 'Самолетни билети', 'airline-tickets', NULL, 'c2000002-0002-0002-0002-000000000001');

-- Gift Cards Subcategories (avoiding duplicate names)
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c2000003-0003-0003-0003-000000000011', 'Retail Store Gift Cards', 'Подаръчни карти за магазини', 'retail-gift-cards', NULL, 'c2000003-0003-0003-0003-000000000001'),
('c2000003-0003-0003-0003-000000000012', 'Restaurant & Food Gift Cards', 'Подаръчни карти за ресторанти', 'restaurant-gift-cards', NULL, 'c2000003-0003-0003-0003-000000000001'),
('c2000003-0003-0003-0003-000000000013', 'Gaming Platform Gift Cards', 'Гейминг карти', 'gaming-platform-gift-cards', NULL, 'c2000003-0003-0003-0003-000000000001'),
('c2000003-0003-0003-0003-000000000014', 'Entertainment & Streaming', 'Развлечения и стрийминг', 'entertainment-streaming-cards', NULL, 'c2000003-0003-0003-0003-000000000001'),
('c2000003-0003-0003-0003-000000000015', 'Travel & Airline Gift Cards', 'Туристически и авиокарти', 'travel-airline-gift-cards', NULL, 'c2000003-0003-0003-0003-000000000001'),
('c2000003-0003-0003-0003-000000000016', 'Discount Vouchers', 'Ваучери за намаление', 'discount-vouchers', NULL, 'c2000003-0003-0003-0003-000000000001');

-- Cell Phones Subcategories
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c2000004-0004-0004-0004-000000000011', 'Smartphones', 'Смартфони', 'smartphones', NULL, 'c2000004-0004-0004-0004-000000000001'),
('c2000004-0004-0004-0004-000000000012', 'iPhone', 'iPhone', 'iphones', NULL, 'c2000004-0004-0004-0004-000000000001'),
('c2000004-0004-0004-0004-000000000013', 'Samsung Galaxy', 'Samsung Galaxy', 'samsung-galaxy', NULL, 'c2000004-0004-0004-0004-000000000001'),
('c2000004-0004-0004-0004-000000000014', 'Phone Cases & Covers', 'Калъфи за телефони', 'phone-cases', NULL, 'c2000004-0004-0004-0004-000000000001'),
('c2000004-0004-0004-0004-000000000015', 'Screen Protectors', 'Протектори за екран', 'screen-protectors', NULL, 'c2000004-0004-0004-0004-000000000001'),
('c2000004-0004-0004-0004-000000000016', 'Phone Chargers & Cables', 'Зарядни и кабели за телефони', 'phone-chargers', NULL, 'c2000004-0004-0004-0004-000000000001'),
('c2000004-0004-0004-0004-000000000017', 'Headsets & Earphones', 'Слушалки', 'headsets-earphones', NULL, 'c2000004-0004-0004-0004-000000000001'),
('c2000004-0004-0004-0004-000000000018', 'Phone Parts & Repair', 'Части и ремонт на телефони', 'phone-parts', NULL, 'c2000004-0004-0004-0004-000000000001'),
('c2000004-0004-0004-0004-000000000019', 'Tablets & iPads', 'Таблети и iPad', 'tablets-ipads', NULL, 'c2000004-0004-0004-0004-000000000001'),
('c2000004-0004-0004-0004-000000000020', 'Mobile Smartwatches', 'Мобилни смарт часовници', 'mobile-smartwatches', NULL, 'c2000004-0004-0004-0004-000000000001');

-- Cameras & Photo Subcategories
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c2000005-0005-0005-0005-000000000011', 'Digital Cameras', 'Дигитални фотоапарати', 'digital-cameras', NULL, 'c2000005-0005-0005-0005-000000000001'),
('c2000005-0005-0005-0005-000000000012', 'DSLR Cameras', 'DSLR фотоапарати', 'dslr-cameras', NULL, 'c2000005-0005-0005-0005-000000000001'),
('c2000005-0005-0005-0005-000000000013', 'Mirrorless Cameras', 'Безогледални фотоапарати', 'mirrorless-cameras', NULL, 'c2000005-0005-0005-0005-000000000001'),
('c2000005-0005-0005-0005-000000000014', 'Camera Lenses', 'Обективи', 'camera-lenses', NULL, 'c2000005-0005-0005-0005-000000000001'),
('c2000005-0005-0005-0005-000000000015', 'Camera Accessories', 'Аксесоари за фотоапарати', 'camera-accessories', NULL, 'c2000005-0005-0005-0005-000000000001'),
('c2000005-0005-0005-0005-000000000016', 'Tripods & Stands', 'Стативи', 'tripods-stands', NULL, 'c2000005-0005-0005-0005-000000000001'),
('c2000005-0005-0005-0005-000000000017', 'Photo Lighting Equipment', 'Фото осветление', 'photo-lighting', NULL, 'c2000005-0005-0005-0005-000000000001'),
('c2000005-0005-0005-0005-000000000018', 'Film Cameras', 'Филмови фотоапарати', 'film-cameras', NULL, 'c2000005-0005-0005-0005-000000000001'),
('c2000005-0005-0005-0005-000000000019', 'Video Cameras', 'Видеокамери', 'video-cameras', NULL, 'c2000005-0005-0005-0005-000000000001'),
('c2000005-0005-0005-0005-000000000020', 'Camera Memory Cards', 'Карти памет за фотоапарати', 'camera-memory-cards', NULL, 'c2000005-0005-0005-0005-000000000001');

-- Everything Else Subcategories (avoiding duplicate names)
INSERT INTO categories (id, name, name_bg, slug, icon, parent_id) VALUES
('c2000006-0006-0006-0006-000000000011', 'Local Services', 'Местни услуги', 'local-services', NULL, 'c2000006-0006-0006-0006-000000000001'),
('c2000006-0006-0006-0006-000000000012', 'Wholesale Lots', 'Търговия на едро', 'wholesale-lots', NULL, 'c2000006-0006-0006-0006-000000000001'),
('c2000006-0006-0006-0006-000000000013', 'Charity Auctions', 'Благотворителни търгове', 'charity-auctions', NULL, 'c2000006-0006-0006-0006-000000000001'),
('c2000006-0006-0006-0006-000000000014', 'Unusual Items', 'Необичайни артикули', 'unusual-items', NULL, 'c2000006-0006-0006-0006-000000000001'),
('c2000006-0006-0006-0006-000000000015', 'Metaphysical Items', 'Метафизични артикули', 'metaphysical-items', NULL, 'c2000006-0006-0006-0006-000000000001'),
('c2000006-0006-0006-0006-000000000016', 'Other Items', 'Други артикули', 'other-items', NULL, 'c2000006-0006-0006-0006-000000000001');
;
