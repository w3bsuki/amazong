-- ================================================================
-- GROCERY L3: Fruits - Berries
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Strawberries', 'Ягоди', 'berries-strawberry', id, '🍓', 1
FROM categories WHERE slug = 'fruits-berries';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Blueberries', 'Боровинки', 'berries-blueberry', id, '🫐', 2
FROM categories WHERE slug = 'fruits-berries';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Raspberries', 'Малини', 'berries-raspberry', id, '🍇', 3
FROM categories WHERE slug = 'fruits-berries';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Blackberries', 'Къпини', 'berries-blackberry', id, '🫐', 4
FROM categories WHERE slug = 'fruits-berries';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mulberries', 'Черници', 'berries-mulberry', id, '🫐', 5
FROM categories WHERE slug = 'fruits-berries';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Currants', 'Касис/Френско грозде', 'berries-currants', id, '🍇', 6
FROM categories WHERE slug = 'fruits-berries';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Gooseberries', 'Цариградско грозде', 'berries-gooseberry', id, '🍇', 7
FROM categories WHERE slug = 'fruits-berries';

-- ================================================================
-- GROCERY L3: Fruits - Stone Fruits
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Peaches', 'Праскови', 'stone-peach', id, '🍑', 1
FROM categories WHERE slug = 'fruits-stone';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Plums', 'Сливи', 'stone-plum', id, '🍑', 2
FROM categories WHERE slug = 'fruits-stone';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cherries', 'Череши', 'stone-cherry', id, '🍒', 3
FROM categories WHERE slug = 'fruits-stone';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sour Cherries', 'Вишни', 'stone-sour-cherry', id, '🍒', 4
FROM categories WHERE slug = 'fruits-stone';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Apricots', 'Кайсии', 'stone-apricot', id, '🍑', 5
FROM categories WHERE slug = 'fruits-stone';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Nectarines', 'Нектарини', 'stone-nectarine', id, '🍑', 6
FROM categories WHERE slug = 'fruits-stone';

-- ================================================================
-- GROCERY L3: Vegetables - Leafy Greens
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Lettuce', 'Салата маруля', 'leafy-lettuce', id, '🥬', 1
FROM categories WHERE slug = 'veg-leafy';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Spinach', 'Спанак', 'leafy-spinach', id, '🥬', 2
FROM categories WHERE slug = 'veg-leafy';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cabbage', 'Зеле', 'leafy-cabbage', id, '🥬', 3
FROM categories WHERE slug = 'veg-leafy';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Kale', 'Кейл', 'leafy-kale', id, '🥬', 4
FROM categories WHERE slug = 'veg-leafy';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Arugula', 'Рукола', 'leafy-arugula', id, '🌿', 5
FROM categories WHERE slug = 'veg-leafy';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Swiss Chard', 'Манголд', 'leafy-chard', id, '🥬', 6
FROM categories WHERE slug = 'veg-leafy';

-- ================================================================
-- GROCERY L3: Vegetables - Tomatoes & Peppers
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Tomatoes', 'Домати', 'tomatoes-regular', id, '🍅', 1
FROM categories WHERE slug = 'veg-tomatoes';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cherry Tomatoes', 'Чери домати', 'tomatoes-cherry', id, '🍅', 2
FROM categories WHERE slug = 'veg-tomatoes';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Bell Peppers', 'Сладки чушки', 'peppers-bell', id, '🫑', 3
FROM categories WHERE slug = 'veg-tomatoes';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Hot Peppers', 'Люти чушки', 'peppers-hot', id, '🌶️', 4
FROM categories WHERE slug = 'veg-tomatoes';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Kapia Peppers', 'Капия', 'peppers-kapia', id, '🫑', 5
FROM categories WHERE slug = 'veg-tomatoes';

-- ================================================================
-- GROCERY L3: Vegetables - Root Vegetables
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Potatoes', 'Картофи', 'roots-potato', id, '🥔', 1
FROM categories WHERE slug = 'veg-roots';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Carrots', 'Моркови', 'roots-carrot', id, '🥕', 2
FROM categories WHERE slug = 'veg-roots';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Beets', 'Цвекло', 'roots-beet', id, '🫒', 3
FROM categories WHERE slug = 'veg-roots';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Radishes', 'Репички', 'roots-radish', id, '🫒', 4
FROM categories WHERE slug = 'veg-roots';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sweet Potatoes', 'Сладки картофи', 'roots-sweet-potato', id, '🍠', 5
FROM categories WHERE slug = 'veg-roots';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Turnips', 'Ряпа', 'roots-turnip', id, '🫒', 6
FROM categories WHERE slug = 'veg-roots';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Parsnips', 'Пащърнак', 'roots-parsnip', id, '🫒', 7
FROM categories WHERE slug = 'veg-roots';

-- ================================================================
-- GROCERY L3: Vegetables - Fresh Herbs
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Parsley', 'Магданоз', 'herbs-parsley', id, '🌿', 1
FROM categories WHERE slug = 'veg-herbs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Dill', 'Копър', 'herbs-dill', id, '🌿', 2
FROM categories WHERE slug = 'veg-herbs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Coriander/Cilantro', 'Кориандър', 'herbs-coriander', id, '🌿', 3
FROM categories WHERE slug = 'veg-herbs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Basil', 'Босилек', 'herbs-basil', id, '🌿', 4
FROM categories WHERE slug = 'veg-herbs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mint', 'Мента', 'herbs-mint', id, '🌿', 5
FROM categories WHERE slug = 'veg-herbs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Rosemary', 'Розмарин', 'herbs-rosemary', id, '🌿', 6
FROM categories WHERE slug = 'veg-herbs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Thyme', 'Мащерка', 'herbs-thyme', id, '🌿', 7
FROM categories WHERE slug = 'veg-herbs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Oregano', 'Риган', 'herbs-oregano', id, '🌿', 8
FROM categories WHERE slug = 'veg-herbs';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Chives', 'Сибирски лук', 'herbs-chives', id, '🌿', 9
FROM categories WHERE slug = 'veg-herbs';;
