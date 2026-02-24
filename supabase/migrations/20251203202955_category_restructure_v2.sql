
-- ============================================
-- CATEGORY RESTRUCTURE MIGRATION V2
-- December 3, 2025
-- ============================================

-- STEP 1: Rename existing L0 categories
UPDATE categories 
SET 
    name = 'Toys & Games',
    name_bg = 'Играчки',
    description = 'Toys, games and playthings for children'
WHERE slug = 'toys';

UPDATE categories 
SET 
    name = 'Books',
    name_bg = 'Книги',
    description = 'Fiction, non-fiction, textbooks and e-books'
WHERE slug = 'books';

UPDATE categories 
SET 
    name = 'Computers & Laptops',
    name_bg = 'Компютри и лаптопи',
    description = 'Laptops, desktops, components and peripherals'
WHERE slug = 'computers';

-- STEP 2: Create new Hobbies L0 category
UPDATE categories 
SET display_order = display_order + 1 
WHERE parent_id IS NULL AND display_order >= 8;

INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
VALUES ('Hobbies', 'hobbies', 'Хоби', '🎯', 'RC vehicles, model building, drones and adult hobbies', NULL, 8);

-- STEP 3: Create L1 subcategories for Hobbies (with unique slugs)
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT name, slug, name_bg, icon, description, 
       (SELECT id FROM categories WHERE slug = 'hobbies'),
       display_order
FROM (VALUES
    ('RC & Drones', 'hobby-rc-drones', 'RC и дронове', '🚁', 'Remote controlled vehicles and drones', 1),
    ('Model Building', 'hobby-model-building', 'Моделизъм', '🔧', 'Plastic models, ships, aircraft and trains', 2),
    ('Scale Models & Diecast', 'hobby-scale-models', 'Мащабни модели', '🚗', 'Diecast vehicles and scale replicas', 3),
    ('Tabletop & Board Games', 'hobby-tabletop', 'Настолни игри', '🎲', 'Board games, Warhammer, D&D and miniatures', 4),
    ('Trading Card Games', 'hobby-tcg', 'Колекционерски карти', '🃏', 'Pokemon, Magic: The Gathering, sports cards', 5),
    ('Collecting', 'hobby-collecting', 'Колекциониране', '📦', 'Coins, stamps, vintage items', 6)
) AS t(name, slug, name_bg, icon, description, display_order);

-- STEP 4: Create L2 for RC & Drones
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'hobby-rc-drones'),
    display_order
FROM (VALUES
    ('RC Cars & Trucks', 'hobby-rc-cars', 'RC коли и камиони', 'Remote controlled cars and trucks', 1),
    ('RC Helicopters', 'hobby-rc-helicopters', 'RC хеликоптери', 'Remote controlled helicopters', 2),
    ('FPV Drones', 'hobby-fpv-drones', 'FPV дронове', 'First-person view racing and camera drones', 3),
    ('RC Boats', 'hobby-rc-boats', 'RC лодки', 'Remote controlled boats and watercraft', 4),
    ('RC Planes', 'hobby-rc-planes', 'RC самолети', 'Remote controlled airplanes', 5),
    ('RC Parts & Accessories', 'hobby-rc-parts', 'RC части', 'Batteries, motors, controllers', 6)
) AS t(name, slug, name_bg, description, display_order);

-- STEP 5: Create L2 for Model Building
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'hobby-model-building'),
    display_order
FROM (VALUES
    ('Plastic Model Kits', 'hobby-plastic-models', 'Пластмасови модели', 'Car, plane, ship plastic kits', 1),
    ('Model Trains', 'hobby-model-trains', 'Модели влакове', 'Model railways and trains', 2),
    ('Model Ships', 'hobby-model-ships', 'Модели кораби', 'Ship and boat models', 3),
    ('Model Aircraft', 'hobby-model-aircraft', 'Модели самолети', 'Airplane and helicopter models', 4),
    ('Model Tools & Paints', 'hobby-model-tools', 'Инструменти и бои', 'Brushes, paints, glues', 5)
) AS t(name, slug, name_bg, description, display_order);

-- STEP 6: Create L2 for Trading Card Games
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    (SELECT id FROM categories WHERE slug = 'hobby-tcg'),
    display_order
FROM (VALUES
    ('Pokemon TCG', 'hobby-pokemon-tcg', 'Pokemon карти', 'Pokemon trading cards', 1),
    ('Magic: The Gathering', 'hobby-mtg', 'Magic: The Gathering', 'MTG cards and decks', 2),
    ('Yu-Gi-Oh!', 'hobby-yugioh', 'Yu-Gi-Oh!', 'Yu-Gi-Oh! cards', 3),
    ('Sports Cards', 'hobby-sports-cards', 'Спортни карти', 'Football, basketball cards', 4),
    ('Card Accessories', 'hobby-card-accessories', 'Аксесоари за карти', 'Sleeves, binders, cases', 5)
) AS t(name, slug, name_bg, description, display_order);

-- STEP 7: Move Diecast & Vehicles from Toys to Hobbies > Scale Models
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hobby-scale-models'),
    display_order = 1
WHERE slug = 'diecast-vehicles';

-- STEP 8: Add Hobbies attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
    (SELECT id FROM categories WHERE slug = 'hobbies'),
    name, name_bg, attribute_type, is_required, is_filterable, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES
    ('Skill Level', 'Ниво', 'select', false, true, '["Beginner", "Intermediate", "Advanced", "Expert"]', '["Начинаещ", "Средно", "Напреднал", "Експерт"]', 1),
    ('Scale', 'Мащаб', 'select', false, true, '["1:10", "1:12", "1:18", "1:24", "1:32", "1:43", "1:64", "1:72", "1:87", "Other"]', '["1:10", "1:12", "1:18", "1:24", "1:32", "1:43", "1:64", "1:72", "1:87", "Друго"]', 2),
    ('Assembly Required', 'Изисква сглобяване', 'boolean', false, true, '[]', '[]', 3),
    ('Age Recommendation', 'Препоръчителна възраст', 'select', false, true, '["14+", "16+", "18+", "All Ages"]', '["14+", "16+", "18+", "Всички възрасти"]', 4)
) AS t(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order);

-- STEP 9: Add TCG attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
    (SELECT id FROM categories WHERE slug = 'hobby-tcg'),
    name, name_bg, attribute_type, is_required, is_filterable, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES
    ('Card Condition', 'Състояние', 'select', true, true, '["Mint", "Near Mint", "Excellent", "Good", "Played"]', '["Мента", "Почти мента", "Отлично", "Добро", "Играно"]', 1),
    ('Graded', 'Оценено', 'boolean', false, true, '[]', '[]', 2),
    ('Grading Company', 'Компания', 'select', false, true, '["PSA", "BGS", "CGC", "SGC", "None"]', '["PSA", "BGS", "CGC", "SGC", "Няма"]', 3),
    ('Card Type', 'Тип', 'select', false, true, '["Single Card", "Booster Pack", "Booster Box", "Starter Deck", "Bundle"]', '["Единична карта", "Бустер пакет", "Бустер кутия", "Стартово тесте", "Комплект"]', 4),
    ('Rarity', 'Рядкост', 'select', false, true, '["Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare"]', '["Обикновена", "Необикновена", "Рядка", "Ултра рядка", "Секретна рядка"]', 5)
) AS t(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order);

-- STEP 10: Add Toys & Games attributes (if not exist)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
    (SELECT id FROM categories WHERE slug = 'toys'),
    name, name_bg, attribute_type, is_required, is_filterable, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES
    ('Age Range', 'Възраст', 'select', true, true, '["0-2 years", "3-4 years", "5-7 years", "8-11 years", "12+ years"]', '["0-2 години", "3-4 години", "5-7 години", "8-11 години", "12+ години"]', 1),
    ('Safety Certified', 'Сертификат', 'boolean', false, true, '[]', '[]', 2),
    ('Battery Required', 'Батерии', 'boolean', false, true, '[]', '[]', 3),
    ('Educational', 'Образователна', 'boolean', false, true, '[]', '[]', 4)
) AS t(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
WHERE NOT EXISTS (
    SELECT 1 FROM category_attributes 
    WHERE category_id = (SELECT id FROM categories WHERE slug = 'toys') 
    AND name = 'Age Range'
);
;
