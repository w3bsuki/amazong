-- ================================================================
-- GROCERY L3: Dairy - Milk & Cream
-- ================================================================

-- Get parent ID for Milk & Cream
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Whole Milk', 'Пълномаслено мляко', 'milk-whole', id, '🥛', 1
FROM categories WHERE slug = 'dairy-milk';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Skimmed Milk', 'Обезмаслено мляко', 'milk-skimmed', id, '🥛', 2
FROM categories WHERE slug = 'dairy-milk';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Goat Milk', 'Козе мляко', 'milk-goat', id, '🐐', 3
FROM categories WHERE slug = 'dairy-milk';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sheep Milk', 'Овче мляко', 'milk-sheep', id, '🐑', 4
FROM categories WHERE slug = 'dairy-milk';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Plant-Based Milk', 'Растително мляко', 'milk-plant-based', id, '🌱', 5
FROM categories WHERE slug = 'dairy-milk';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Heavy Cream', 'Сметана за готвене', 'cream-heavy', id, '🍦', 6
FROM categories WHERE slug = 'dairy-milk';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sour Cream', 'Заквасена сметана', 'cream-sour', id, '🥣', 7
FROM categories WHERE slug = 'dairy-milk';

-- ================================================================
-- GROCERY L3: Dairy - Cheese (Very important for Bulgaria!)
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Bulgarian Sirene', 'Българско сирене', 'cheese-sirene', id, '🧀', 1
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Kashkaval', 'Кашкавал', 'cheese-kashkaval', id, '🧀', 2
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Feta Cheese', 'Фета', 'cheese-feta', id, '🧀', 3
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mozzarella', 'Моцарела', 'cheese-mozzarella', id, '🧀', 4
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cheddar', 'Чедър', 'cheese-cheddar', id, '🧀', 5
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Goat Cheese', 'Козе сирене', 'cheese-goat', id, '🐐', 6
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sheep Cheese', 'Овче сирене', 'cheese-sheep', id, '🐑', 7
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cream Cheese', 'Крема сирене', 'cheese-cream', id, '🥯', 8
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Blue Cheese', 'Синьо сирене', 'cheese-blue', id, '🧀', 9
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Brie & Camembert', 'Бри и Камамбер', 'cheese-brie', id, '🧀', 10
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Parmesan & Hard Cheese', 'Пармезан и твърди сирена', 'cheese-parmesan', id, '🧀', 11
FROM categories WHERE slug = 'dairy-cheese';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cottage Cheese', 'Извара', 'cheese-cottage', id, '🥣', 12
FROM categories WHERE slug = 'dairy-cheese';

-- ================================================================
-- GROCERY L3: Dairy - Yogurt (Bulgarian yogurt is world famous!)
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Bulgarian Yogurt', 'Българско кисело мляко', 'yogurt-bulgarian', id, '🥣', 1
FROM categories WHERE slug = 'dairy-yogurt';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Greek Yogurt', 'Гръцко кисело мляко', 'yogurt-greek', id, '🥣', 2
FROM categories WHERE slug = 'dairy-yogurt';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Fruit Yogurt', 'Плодово кисело мляко', 'yogurt-fruit', id, '🍓', 3
FROM categories WHERE slug = 'dairy-yogurt';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Probiotic Yogurt', 'Пробиотично кисело мляко', 'yogurt-probiotic', id, '💪', 4
FROM categories WHERE slug = 'dairy-yogurt';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Goat Yogurt', 'Козе кисело мляко', 'yogurt-goat', id, '🐐', 5
FROM categories WHERE slug = 'dairy-yogurt';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sheep Yogurt', 'Овче кисело мляко', 'yogurt-sheep', id, '🐑', 6
FROM categories WHERE slug = 'dairy-yogurt';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Kids Yogurt', 'Детско кисело мляко', 'yogurt-kids', id, '👶', 7
FROM categories WHERE slug = 'dairy-yogurt';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Dairy-Free Yogurt', 'Безлактозно/Растително', 'yogurt-dairy-free', id, '🌱', 8
FROM categories WHERE slug = 'dairy-yogurt';

-- ================================================================
-- GROCERY L3: Dairy - Eggs
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Chicken Eggs', 'Кокоши яйца', 'eggs-chicken', id, '🥚', 1
FROM categories WHERE slug = 'dairy-eggs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Free-Range Eggs', 'Яйца от свободно отглеждане', 'eggs-free-range', id, '🐔', 2
FROM categories WHERE slug = 'dairy-eggs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Organic Eggs', 'Био яйца', 'eggs-organic', id, '🌿', 3
FROM categories WHERE slug = 'dairy-eggs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Quail Eggs', 'Пъдпъдъчи яйца', 'eggs-quail', id, '🐦', 4
FROM categories WHERE slug = 'dairy-eggs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Duck Eggs', 'Патешки яйца', 'eggs-duck', id, '🦆', 5
FROM categories WHERE slug = 'dairy-eggs';

-- ================================================================
-- GROCERY L3: Honey & Bee Products
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Acacia Honey', 'Акациев мед', 'honey-acacia', id, '🍯', 1
FROM categories WHERE slug = 'dairy-honey';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Wildflower Honey', 'Полифлорен мед', 'honey-wildflower', id, '🌸', 2
FROM categories WHERE slug = 'dairy-honey';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mountain Honey', 'Планински мед', 'honey-mountain', id, '⛰️', 3
FROM categories WHERE slug = 'dairy-honey';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Linden Honey', 'Липов мед', 'honey-linden', id, '🌳', 4
FROM categories WHERE slug = 'dairy-honey';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Raw Honeycomb', 'Пчелна пита', 'honey-honeycomb', id, '🍯', 5
FROM categories WHERE slug = 'dairy-honey';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Propolis', 'Прополис', 'honey-propolis', id, '🐝', 6
FROM categories WHERE slug = 'dairy-honey';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Royal Jelly', 'Пчелно млечице', 'honey-royal-jelly', id, '👑', 7
FROM categories WHERE slug = 'dairy-honey';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Bee Pollen', 'Пчелен прашец', 'honey-pollen', id, '🌻', 8
FROM categories WHERE slug = 'dairy-honey';;
