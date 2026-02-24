-- ================================================================
-- GROCERY L3: Bulgarian Specialty - Traditional Spreads
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Lutenitsa', 'Лютеница', 'grocery-bg-lutenitsa', id, '🫙', 1
FROM categories WHERE slug = 'grocery-bg-preserves';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Kyopolou', 'Кьопоолу', 'grocery-bg-kyopolou', id, '🫙', 2
FROM categories WHERE slug = 'grocery-bg-preserves';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Ajvar', 'Айвар', 'grocery-bg-ajvar', id, '🫙', 3
FROM categories WHERE slug = 'grocery-bg-preserves';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pickled Vegetables', 'Туршия', 'grocery-bg-turshia', id, '🥒', 4
FROM categories WHERE slug = 'grocery-bg-preserves';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pickled Cabbage', 'Кисело зеле', 'grocery-bg-sauerkraut', id, '🥬', 5
FROM categories WHERE slug = 'grocery-bg-preserves';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pickled Peppers', 'Пипер туршия', 'grocery-bg-pickled-pepper', id, '🫑', 6
FROM categories WHERE slug = 'grocery-bg-preserves';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Tomato Sauce', 'Доматен сос', 'grocery-bg-tomato-sauce', id, '🍅', 7
FROM categories WHERE slug = 'grocery-bg-preserves';

-- ================================================================
-- GROCERY L3: Bulgarian Specialty - Homemade Sweets
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Fruit Jam', 'Конфитюр', 'grocery-bg-jam', id, '🍓', 1
FROM categories WHERE slug = 'grocery-bg-sweets';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Slatko (Whole Fruit Preserves)', 'Сладко', 'grocery-bg-slatko', id, '🍒', 2
FROM categories WHERE slug = 'grocery-bg-sweets';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Rose Jam', 'Сладко от рози', 'grocery-bg-rose-jam', id, '🌹', 3
FROM categories WHERE slug = 'grocery-bg-sweets';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Fig Jam', 'Сладко от смокини', 'grocery-bg-fig-jam', id, '🫐', 4
FROM categories WHERE slug = 'grocery-bg-sweets';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Quince Paste', 'Дюлев локум', 'grocery-bg-quince-paste', id, '🍯', 5
FROM categories WHERE slug = 'grocery-bg-sweets';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Walnut Preserve', 'Орехово сладко', 'grocery-bg-walnut-jam', id, '🥜', 6
FROM categories WHERE slug = 'grocery-bg-sweets';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Petmez (Grape Molasses)', 'Петмез', 'grocery-bg-petmez', id, '🍯', 7
FROM categories WHERE slug = 'grocery-bg-sweets';

-- ================================================================
-- GROCERY L3: Bulgarian Specialty - Traditional Spices
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sharena Sol (Mixed Salt)', 'Шарена сол', 'grocery-bg-sharena-sol', id, '🧂', 1
FROM categories WHERE slug = 'grocery-bg-spices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Chubritsa (Summer Savory)', 'Чубрица', 'grocery-bg-chubritsa', id, '🌿', 2
FROM categories WHERE slug = 'grocery-bg-spices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Paprika (Sweet)', 'Червен пипер (сладък)', 'grocery-bg-paprika-sweet', id, '🌶️', 3
FROM categories WHERE slug = 'grocery-bg-spices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Paprika (Hot)', 'Червен пипер (лют)', 'grocery-bg-paprika-hot', id, '🌶️', 4
FROM categories WHERE slug = 'grocery-bg-spices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Dried Mint', 'Сушена мента', 'grocery-bg-dried-mint', id, '🌿', 5
FROM categories WHERE slug = 'grocery-bg-spices';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cumin (Kimion)', 'Кимион', 'grocery-bg-cumin', id, '🌿', 6
FROM categories WHERE slug = 'grocery-bg-spices';

-- ================================================================
-- GROCERY L3: Bulgarian Specialty - Rose Products
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Rose Oil', 'Розово масло', 'grocery-bg-rose-oil', id, '🌹', 1
FROM categories WHERE slug = 'grocery-bg-rose';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Rose Water', 'Розова вода', 'grocery-bg-rose-water', id, '🌹', 2
FROM categories WHERE slug = 'grocery-bg-rose';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Rose Liqueur', 'Розов ликьор', 'grocery-bg-rose-liqueur', id, '🌹', 3
FROM categories WHERE slug = 'grocery-bg-rose';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Rose Lokum', 'Розов локум', 'grocery-bg-rose-lokum', id, '🌹', 4
FROM categories WHERE slug = 'grocery-bg-rose';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Dried Rose Petals', 'Сушени розови листенца', 'grocery-bg-rose-dried', id, '🌹', 5
FROM categories WHERE slug = 'grocery-bg-rose';

-- ================================================================
-- GROCERY L3: Bulgarian Specialty - Homemade Products
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Homemade Cheese', 'Домашно сирене', 'grocery-bg-home-cheese', id, '🧀', 1
FROM categories WHERE slug = 'grocery-bg-homemade';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Homemade Yogurt', 'Домашно кисело мляко', 'grocery-bg-home-yogurt', id, '🥛', 2
FROM categories WHERE slug = 'grocery-bg-homemade';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Homemade Butter', 'Домашно масло', 'grocery-bg-home-butter', id, '🧈', 3
FROM categories WHERE slug = 'grocery-bg-homemade';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Homemade Wine', 'Домашно вино', 'grocery-bg-home-wine', id, '🍷', 4
FROM categories WHERE slug = 'grocery-bg-homemade';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Homemade Rakia', 'Домашна ракия', 'grocery-bg-home-rakia', id, '🥃', 5
FROM categories WHERE slug = 'grocery-bg-homemade';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Homemade Sausages', 'Домашни наденици', 'grocery-bg-home-sausage', id, '🌭', 6
FROM categories WHERE slug = 'grocery-bg-homemade';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Homemade Bread', 'Домашен хляб', 'grocery-bg-home-bread', id, '🍞', 7
FROM categories WHERE slug = 'grocery-bg-homemade';

-- ================================================================
-- GROCERY L3: Bulgarian Specialty - Seasonal Products
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Fresh Farm Produce', 'Пресни селски продукти', 'grocery-bg-farm-fresh', id, '🥬', 1
FROM categories WHERE slug = 'grocery-bg-seasonal';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Garden Vegetables', 'Градински зеленчуци', 'grocery-bg-garden-veg', id, '🥕', 2
FROM categories WHERE slug = 'grocery-bg-seasonal';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Orchard Fruits', 'Овощни градини', 'grocery-bg-orchard', id, '🍎', 3
FROM categories WHERE slug = 'grocery-bg-seasonal';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Wild Mushrooms', 'Диви гъби', 'grocery-bg-mushrooms', id, '🍄', 4
FROM categories WHERE slug = 'grocery-bg-seasonal';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Wild Berries', 'Горски плодове', 'grocery-bg-wild-berries', id, '🫐', 5
FROM categories WHERE slug = 'grocery-bg-seasonal';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Forest Herbs', 'Горски билки', 'grocery-bg-forest-herbs', id, '🌿', 6
FROM categories WHERE slug = 'grocery-bg-seasonal';;
