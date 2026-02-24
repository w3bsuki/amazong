
-- 1. Grocery & Gourmet Food
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000001-0001-0001-0001-000000000001', 'Grocery & Gourmet Food', 'Храни и деликатеси', 'grocery', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000001-0001-0001-0001-000000000011', 'Snacks & Sweets', 'Снакс и сладки', 'snacks-sweets', 'c1000001-0001-0001-0001-000000000001', NULL),
('c1000001-0001-0001-0001-000000000012', 'Beverages', 'Напитки', 'beverages', 'c1000001-0001-0001-0001-000000000001', NULL),
('c1000001-0001-0001-0001-000000000013', 'Organic & Natural', 'Био и натурални', 'organic-natural', 'c1000001-0001-0001-0001-000000000001', NULL),
('c1000001-0001-0001-0001-000000000014', 'International Foods', 'Международни храни', 'international-foods', 'c1000001-0001-0001-0001-000000000001', NULL),
('c1000001-0001-0001-0001-000000000015', 'Pantry Staples', 'Основни продукти', 'pantry-staples', 'c1000001-0001-0001-0001-000000000001', NULL),
('c1000001-0001-0001-0001-000000000016', 'Coffee & Tea', 'Кафе и чай', 'coffee-tea', 'c1000001-0001-0001-0001-000000000001', NULL);

-- 2. Pet Supplies (new parent)
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000002-0002-0002-0002-000000000001', 'Pet Supplies', 'Зоо артикули', 'pets', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000002-0002-0002-0002-000000000011', 'Dogs', 'Кучета', 'dogs', 'c1000002-0002-0002-0002-000000000001', NULL),
('c1000002-0002-0002-0002-000000000012', 'Cats', 'Котки', 'cats', 'c1000002-0002-0002-0002-000000000001', NULL),
('c1000002-0002-0002-0002-000000000013', 'Fish & Aquatic', 'Риби и аквариуми', 'fish-aquatic', 'c1000002-0002-0002-0002-000000000001', NULL),
('c1000002-0002-0002-0002-000000000014', 'Birds', 'Птици', 'birds', 'c1000002-0002-0002-0002-000000000001', NULL),
('c1000002-0002-0002-0002-000000000015', 'Small Animals', 'Малки животни', 'small-animals', 'c1000002-0002-0002-0002-000000000001', NULL),
('c1000002-0002-0002-0002-000000000016', 'Pet Food', 'Храна за домашни любимци', 'pet-food', 'c1000002-0002-0002-0002-000000000001', NULL);

-- 3. Garden & Outdoor Living
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000003-0003-0003-0003-000000000001', 'Garden & Outdoor Living', 'Градина и външен живот', 'garden-outdoor', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000003-0003-0003-0003-000000000011', 'Plants & Seeds', 'Растения и семена', 'plants-seeds', 'c1000003-0003-0003-0003-000000000001', NULL),
('c1000003-0003-0003-0003-000000000012', 'Garden Tools', 'Градински инструменти', 'garden-tools', 'c1000003-0003-0003-0003-000000000001', NULL),
('c1000003-0003-0003-0003-000000000013', 'Patio Furniture', 'Градинска мебел', 'patio-furniture', 'c1000003-0003-0003-0003-000000000001', NULL),
('c1000003-0003-0003-0003-000000000014', 'Grills & BBQ', 'Грилове и барбекю', 'grills-bbq', 'c1000003-0003-0003-0003-000000000001', NULL),
('c1000003-0003-0003-0003-000000000015', 'Outdoor Decor', 'Външна декорация', 'outdoor-decor', 'c1000003-0003-0003-0003-000000000001', NULL),
('c1000003-0003-0003-0003-000000000016', 'Pools & Spas', 'Басейни и СПА', 'pools-spas', 'c1000003-0003-0003-0003-000000000001', NULL);

-- 4. Jewelry & Watches
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000004-0004-0004-0004-000000000001', 'Jewelry & Watches', 'Бижута и часовници', 'jewelry-watches', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000004-0004-0004-0004-000000000011', 'Fine Jewelry', 'Скъпоценни бижута', 'fine-jewelry', 'c1000004-0004-0004-0004-000000000001', NULL),
('c1000004-0004-0004-0004-000000000012', 'Fashion Jewelry', 'Модни бижута', 'fashion-jewelry', 'c1000004-0004-0004-0004-000000000001', NULL),
('c1000004-0004-0004-0004-000000000013', 'Luxury Watches', 'Луксозни часовници', 'luxury-watches', 'c1000004-0004-0004-0004-000000000001', NULL),
('c1000004-0004-0004-0004-000000000014', 'Smart Watches', 'Смарт часовници', 'smart-watches', 'c1000004-0004-0004-0004-000000000001', NULL),
('c1000004-0004-0004-0004-000000000015', 'Engagement & Wedding', 'Годежни и сватбени', 'engagement-wedding', 'c1000004-0004-0004-0004-000000000001', NULL),
('c1000004-0004-0004-0004-000000000016', 'Watch Accessories', 'Аксесоари за часовници', 'watch-accessories', 'c1000004-0004-0004-0004-000000000001', NULL);

-- 5. Handmade & Crafts
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000005-0005-0005-0005-000000000001', 'Handmade & Crafts', 'Ръчна изработка', 'handmade', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000005-0005-0005-0005-000000000011', 'Handmade Jewelry', 'Ръчно изработени бижута', 'handmade-jewelry', 'c1000005-0005-0005-0005-000000000001', NULL),
('c1000005-0005-0005-0005-000000000012', 'Art & Paintings', 'Изкуство и картини', 'art-paintings', 'c1000005-0005-0005-0005-000000000001', NULL),
('c1000005-0005-0005-0005-000000000013', 'Craft Supplies', 'Материали за занаяти', 'craft-supplies', 'c1000005-0005-0005-0005-000000000001', NULL),
('c1000005-0005-0005-0005-000000000014', 'Custom & Personalized', 'Персонализирани изделия', 'custom-personalized', 'c1000005-0005-0005-0005-000000000001', NULL),
('c1000005-0005-0005-0005-000000000015', 'Home Decor Crafts', 'Ръчна декорация за дома', 'home-decor-crafts', 'c1000005-0005-0005-0005-000000000001', NULL),
('c1000005-0005-0005-0005-000000000016', 'Knitting & Crochet', 'Плетене и плетиво', 'knitting-crochet', 'c1000005-0005-0005-0005-000000000001', NULL);

-- 6. Health & Wellness
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000006-0006-0006-0006-000000000001', 'Health & Wellness', 'Здраве и уелнес', 'health-wellness', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000006-0006-0006-0006-000000000011', 'Vitamins & Supplements', 'Витамини и добавки', 'vitamins-supplements', 'c1000006-0006-0006-0006-000000000001', NULL),
('c1000006-0006-0006-0006-000000000012', 'Medical Supplies', 'Медицински консумативи', 'medical-supplies', 'c1000006-0006-0006-0006-000000000001', NULL),
('c1000006-0006-0006-0006-000000000013', 'First Aid', 'Първа помощ', 'first-aid', 'c1000006-0006-0006-0006-000000000001', NULL),
('c1000006-0006-0006-0006-000000000014', 'Fitness Nutrition', 'Фитнес хранене', 'fitness-nutrition', 'c1000006-0006-0006-0006-000000000001', NULL),
('c1000006-0006-0006-0006-000000000015', 'Personal Care', 'Лична хигиена', 'personal-care', 'c1000006-0006-0006-0006-000000000001', NULL),
('c1000006-0006-0006-0006-000000000016', 'Wellness Equipment', 'Уелнес оборудване', 'wellness-equipment', 'c1000006-0006-0006-0006-000000000001', NULL);

-- 7. Office & School Supplies
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000007-0007-0007-0007-000000000001', 'Office & School', 'Офис и училище', 'office-school', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000007-0007-0007-0007-000000000011', 'Office Supplies', 'Офис консумативи', 'office-supplies', 'c1000007-0007-0007-0007-000000000001', NULL),
('c1000007-0007-0007-0007-000000000012', 'School Supplies', 'Ученически пособия', 'school-supplies', 'c1000007-0007-0007-0007-000000000001', NULL),
('c1000007-0007-0007-0007-000000000013', 'Desk Accessories', 'Аксесоари за бюро', 'desk-accessories', 'c1000007-0007-0007-0007-000000000001', NULL),
('c1000007-0007-0007-0007-000000000014', 'Printers & Ink', 'Принтери и мастила', 'printers-ink', 'c1000007-0007-0007-0007-000000000001', NULL),
('c1000007-0007-0007-0007-000000000015', 'Office Furniture', 'Офис мебели', 'office-furniture', 'c1000007-0007-0007-0007-000000000001', NULL),
('c1000007-0007-0007-0007-000000000016', 'Calendars & Planners', 'Календари и планери', 'calendars-planners', 'c1000007-0007-0007-0007-000000000001', NULL);

-- 8. Musical Instruments
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000008-0008-0008-0008-000000000001', 'Musical Instruments', 'Музикални инструменти', 'musical-instruments', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000008-0008-0008-0008-000000000011', 'Guitars & Basses', 'Китари и бас китари', 'guitars-basses', 'c1000008-0008-0008-0008-000000000001', NULL),
('c1000008-0008-0008-0008-000000000012', 'Keyboards & Pianos', 'Клавишни и пиана', 'keyboards-pianos', 'c1000008-0008-0008-0008-000000000001', NULL),
('c1000008-0008-0008-0008-000000000013', 'Drums & Percussion', 'Барабани и перкусии', 'drums-percussion', 'c1000008-0008-0008-0008-000000000001', NULL),
('c1000008-0008-0008-0008-000000000014', 'DJ Equipment', 'DJ оборудване', 'dj-equipment', 'c1000008-0008-0008-0008-000000000001', NULL),
('c1000008-0008-0008-0008-000000000015', 'Wind Instruments', 'Духови инструменти', 'wind-instruments', 'c1000008-0008-0008-0008-000000000001', NULL),
('c1000008-0008-0008-0008-000000000016', 'Recording Equipment', 'Записващо оборудване', 'recording-equipment', 'c1000008-0008-0008-0008-000000000001', NULL);

-- 9. Movies, Music & Media
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000009-0009-0009-0009-000000000001', 'Movies, Music & Media', 'Филми, музика и медия', 'movies-music', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000009-0009-0009-0009-000000000011', 'Blu-ray & DVD', 'Blu-ray и DVD', 'bluray-dvd', 'c1000009-0009-0009-0009-000000000001', NULL),
('c1000009-0009-0009-0009-000000000012', 'Vinyl Records', 'Грамофонни плочи', 'vinyl-records', 'c1000009-0009-0009-0009-000000000001', NULL),
('c1000009-0009-0009-0009-000000000013', 'CDs & Music', 'CD-та и музика', 'cds-music', 'c1000009-0009-0009-0009-000000000001', NULL),
('c1000009-0009-0009-0009-000000000014', 'Streaming Gift Cards', 'Карти за стрийминг', 'streaming-cards', 'c1000009-0009-0009-0009-000000000001', NULL),
('c1000009-0009-0009-0009-000000000015', 'Posters & Art Prints', 'Постери и арт принтове', 'posters-art-prints', 'c1000009-0009-0009-0009-000000000001', NULL),
('c1000009-0009-0009-0009-000000000016', 'Fan Merchandise', 'Фен артикули', 'fan-merchandise', 'c1000009-0009-0009-0009-000000000001', NULL);

-- 10. Industrial & Scientific
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000010-0010-0010-0010-000000000001', 'Industrial & Scientific', 'Индустриални и научни', 'industrial-scientific', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000010-0010-0010-0010-000000000011', 'Lab Equipment', 'Лабораторно оборудване', 'lab-equipment', 'c1000010-0010-0010-0010-000000000001', NULL),
('c1000010-0010-0010-0010-000000000012', 'Safety Equipment', 'Предпазни средства', 'safety-equipment', 'c1000010-0010-0010-0010-000000000001', NULL),
('c1000010-0010-0010-0010-000000000013', 'Raw Materials', 'Суровини', 'raw-materials', 'c1000010-0010-0010-0010-000000000001', NULL),
('c1000010-0010-0010-0010-000000000014', 'Test & Measurement', 'Измервателни уреди', 'test-measurement', 'c1000010-0010-0010-0010-000000000001', NULL),
('c1000010-0010-0010-0010-000000000015', 'Industrial Hardware', 'Индустриален хардуер', 'industrial-hardware', 'c1000010-0010-0010-0010-000000000001', NULL),
('c1000010-0010-0010-0010-000000000016', '3D Printing', '3D принтиране', '3d-printing', 'c1000010-0010-0010-0010-000000000001', NULL);

-- 11. Collectibles & Art
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000011-0011-0011-0011-000000000001', 'Collectibles & Art', 'Колекционерски и изкуство', 'collectibles', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000011-0011-0011-0011-000000000011', 'Trading Cards', 'Колекционерски карти', 'trading-cards', 'c1000011-0011-0011-0011-000000000001', NULL),
('c1000011-0011-0011-0011-000000000012', 'Coins & Currency', 'Монети и валута', 'coins-currency', 'c1000011-0011-0011-0011-000000000001', NULL),
('c1000011-0011-0011-0011-000000000013', 'Stamps', 'Пощенски марки', 'stamps', 'c1000011-0011-0011-0011-000000000001', NULL),
('c1000011-0011-0011-0011-000000000014', 'Sports Memorabilia', 'Спортни сувенири', 'sports-memorabilia', 'c1000011-0011-0011-0011-000000000001', NULL),
('c1000011-0011-0011-0011-000000000015', 'Vintage & Antiques', 'Винтидж и антики', 'vintage-antiques', 'c1000011-0011-0011-0011-000000000001', NULL),
('c1000011-0011-0011-0011-000000000016', 'Figurines & Models', 'Фигурки и модели', 'figurines-models', 'c1000011-0011-0011-0011-000000000001', NULL),
('c1000011-0011-0011-0011-000000000017', 'Comic Books', 'Комикси', 'comic-books', 'c1000011-0011-0011-0011-000000000001', NULL),
('c1000011-0011-0011-0011-000000000018', 'Autographs', 'Автографи', 'autographs', 'c1000011-0011-0011-0011-000000000001', NULL);

-- 12. Baby & Kids
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000012-0012-0012-0012-000000000001', 'Baby & Kids', 'Бебета и деца', 'baby-kids', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000012-0012-0012-0012-000000000011', 'Baby Gear', 'Бебешки аксесоари', 'baby-gear', 'c1000012-0012-0012-0012-000000000001', NULL),
('c1000012-0012-0012-0012-000000000012', 'Diapers & Wipes', 'Пелени и кърпички', 'diapers-wipes', 'c1000012-0012-0012-0012-000000000001', NULL),
('c1000012-0012-0012-0012-000000000013', 'Baby Feeding', 'Бебешко хранене', 'baby-feeding', 'c1000012-0012-0012-0012-000000000001', NULL),
('c1000012-0012-0012-0012-000000000014', 'Kids Clothing', 'Детски дрехи', 'kids-clothing', 'c1000012-0012-0012-0012-000000000001', NULL),
('c1000012-0012-0012-0012-000000000015', 'Nursery', 'Детска стая', 'nursery', 'c1000012-0012-0012-0012-000000000001', NULL),
('c1000012-0012-0012-0012-000000000016', 'Kids Learning', 'Детско образование', 'kids-learning', 'c1000012-0012-0012-0012-000000000001', NULL);

-- 13. Tools & Home Improvement
INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000013-0013-0013-0013-000000000001', 'Tools & Home Improvement', 'Инструменти и ремонт', 'tools-home', NULL, NULL);

INSERT INTO categories (id, name, name_bg, slug, parent_id, image_url) VALUES
('c1000013-0013-0013-0013-000000000011', 'Power Tools', 'Електроинструменти', 'power-tools', 'c1000013-0013-0013-0013-000000000001', NULL),
('c1000013-0013-0013-0013-000000000012', 'Hand Tools', 'Ръчни инструменти', 'hand-tools', 'c1000013-0013-0013-0013-000000000001', NULL),
('c1000013-0013-0013-0013-000000000013', 'Electrical', 'Електричество', 'electrical', 'c1000013-0013-0013-0013-000000000001', NULL),
('c1000013-0013-0013-0013-000000000014', 'Plumbing', 'ВиК', 'plumbing', 'c1000013-0013-0013-0013-000000000001', NULL),
('c1000013-0013-0013-0013-000000000015', 'Building Materials', 'Строителни материали', 'building-materials', 'c1000013-0013-0013-0013-000000000001', NULL),
('c1000013-0013-0013-0013-000000000016', 'Paint & Wall', 'Бои и стени', 'paint-wall', 'c1000013-0013-0013-0013-000000000001', NULL);
;
