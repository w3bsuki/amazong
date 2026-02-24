-- ================================================================
-- GROCERY L3: Drinks - Bulgarian Wine
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Red Wine', 'Червено вино', 'wine-red', id, '🍷', 1
FROM categories WHERE slug = 'drinks-wine';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'White Wine', 'Бяло вино', 'wine-white', id, '🍾', 2
FROM categories WHERE slug = 'drinks-wine';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Rosé Wine', 'Розе', 'wine-rose', id, '🍷', 3
FROM categories WHERE slug = 'drinks-wine';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mavrud Wine', 'Мавруд', 'wine-mavrud', id, '🍷', 4
FROM categories WHERE slug = 'drinks-wine';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Melnik Wine', 'Мелник', 'wine-melnik', id, '🍷', 5
FROM categories WHERE slug = 'drinks-wine';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Gamza Wine', 'Гъмза', 'wine-gamza', id, '🍷', 6
FROM categories WHERE slug = 'drinks-wine';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sparkling Wine', 'Пенливо вино', 'wine-sparkling', id, '🍾', 7
FROM categories WHERE slug = 'drinks-wine';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Dessert Wine', 'Десертно вино', 'wine-dessert', id, '🍷', 8
FROM categories WHERE slug = 'drinks-wine';

-- ================================================================
-- GROCERY L3: Drinks - Bulgarian Rakia
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Grape Rakia', 'Гроздова ракия', 'rakia-grape', id, '🍇', 1
FROM categories WHERE slug = 'drinks-rakia';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Plum Rakia (Slivova)', 'Сливова ракия', 'rakia-plum', id, '🍑', 2
FROM categories WHERE slug = 'drinks-rakia';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Apricot Rakia (Kaisiyeva)', 'Кайсиева ракия', 'rakia-apricot', id, '🍑', 3
FROM categories WHERE slug = 'drinks-rakia';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Quince Rakia (Dunyova)', 'Дюлева ракия', 'rakia-quince', id, '🍐', 4
FROM categories WHERE slug = 'drinks-rakia';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Muscat Rakia', 'Мускатова ракия', 'rakia-muscat', id, '🍇', 5
FROM categories WHERE slug = 'drinks-rakia';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Anise Rakia (Mastika)', 'Мастика', 'rakia-mastika', id, '🥃', 6
FROM categories WHERE slug = 'drinks-rakia';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Homemade Rakia', 'Домашна ракия', 'rakia-homemade', id, '🥃', 7
FROM categories WHERE slug = 'drinks-rakia';

-- ================================================================
-- GROCERY L3: Drinks - Beer
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Lager Beer', 'Светла бира', 'beer-lager', id, '🍺', 1
FROM categories WHERE slug = 'drinks-beer';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Dark Beer', 'Тъмна бира', 'beer-dark', id, '🍺', 2
FROM categories WHERE slug = 'drinks-beer';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Wheat Beer', 'Пшенична бира', 'beer-wheat', id, '🍺', 3
FROM categories WHERE slug = 'drinks-beer';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Craft Beer', 'Крафт бира', 'beer-craft', id, '🍺', 4
FROM categories WHERE slug = 'drinks-beer';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Non-Alcoholic Beer', 'Безалкохолна бира', 'beer-nonalcoholic', id, '🍺', 5
FROM categories WHERE slug = 'drinks-beer';

-- ================================================================
-- GROCERY L3: Drinks - Coffee
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Ground Coffee', 'Мляно кафе', 'coffee-ground', id, '☕', 1
FROM categories WHERE slug = 'drinks-coffee';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Coffee Beans', 'Кафе на зърна', 'coffee-beans', id, '☕', 2
FROM categories WHERE slug = 'drinks-coffee';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Instant Coffee', 'Инстантно кафе', 'coffee-instant', id, '☕', 3
FROM categories WHERE slug = 'drinks-coffee';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Coffee Capsules', 'Кафе капсули', 'coffee-capsules', id, '☕', 4
FROM categories WHERE slug = 'drinks-coffee';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Turkish Coffee', 'Турско кафе', 'coffee-turkish', id, '☕', 5
FROM categories WHERE slug = 'drinks-coffee';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Decaf Coffee', 'Безкофеиново кафе', 'coffee-decaf', id, '☕', 6
FROM categories WHERE slug = 'drinks-coffee';

-- ================================================================
-- GROCERY L3: Drinks - Tea
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Black Tea', 'Черен чай', 'tea-black', id, '🍵', 1
FROM categories WHERE slug = 'drinks-tea';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Green Tea', 'Зелен чай', 'tea-green', id, '🍵', 2
FROM categories WHERE slug = 'drinks-tea';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Herbal Tea', 'Билков чай', 'tea-herbal', id, '🍵', 3
FROM categories WHERE slug = 'drinks-tea';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Fruit Tea', 'Плодов чай', 'tea-fruit', id, '🍵', 4
FROM categories WHERE slug = 'drinks-tea';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mountain Tea (Mursalski)', 'Мурсалски чай', 'tea-mountain', id, '🍵', 5
FROM categories WHERE slug = 'drinks-tea';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Chamomile Tea', 'Лайка', 'tea-chamomile', id, '🍵', 6
FROM categories WHERE slug = 'drinks-tea';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mint Tea', 'Ментов чай', 'tea-mint', id, '🍵', 7
FROM categories WHERE slug = 'drinks-tea';

-- ================================================================
-- GROCERY L3: Drinks - Soft Drinks
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mineral Water', 'Минерална вода', 'soft-water-mineral', id, '💧', 1
FROM categories WHERE slug = 'drinks-soft';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Spring Water', 'Изворна вода', 'soft-water-spring', id, '💧', 2
FROM categories WHERE slug = 'drinks-soft';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Carbonated Drinks', 'Газирани напитки', 'soft-carbonated', id, '🥤', 3
FROM categories WHERE slug = 'drinks-soft';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Energy Drinks', 'Енергийни напитки', 'soft-energy', id, '🥤', 4
FROM categories WHERE slug = 'drinks-soft';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Ice Tea', 'Студен чай', 'soft-icetea', id, '🧋', 5
FROM categories WHERE slug = 'drinks-soft';

-- ================================================================
-- GROCERY L3: Drinks - Natural Juices
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Orange Juice', 'Портокалов сок', 'juice-orange', id, '🍊', 1
FROM categories WHERE slug = 'drinks-juices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Apple Juice', 'Ябълков сок', 'juice-apple', id, '🍎', 2
FROM categories WHERE slug = 'drinks-juices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Grape Juice', 'Гроздов сок', 'juice-grape', id, '🍇', 3
FROM categories WHERE slug = 'drinks-juices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Tomato Juice', 'Доматен сок', 'juice-tomato', id, '🍅', 4
FROM categories WHERE slug = 'drinks-juices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Peach Nectar', 'Прасковен нектар', 'juice-peach', id, '🍑', 5
FROM categories WHERE slug = 'drinks-juices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mixed Fruit Juice', 'Мултивитамин', 'juice-multi', id, '🧃', 6
FROM categories WHERE slug = 'drinks-juices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Fresh Pressed Juice', 'Пресен сок', 'juice-fresh', id, '🧃', 7
FROM categories WHERE slug = 'drinks-juices';;
