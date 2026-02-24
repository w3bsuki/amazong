
-- Migration: Add Level 3 subcategories to Fashion
-- Uses unique names to avoid conflicts with unique name constraint

-- ================================================
-- WOMEN'S CLOTHING (Level 3)
-- ================================================
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Women''s Dresses', 'Дамски рокли', 'womens-dresses', id, '👗'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Women''s Tops & Blouses', 'Дамски топове и блузи', 'womens-tops', id, '👚'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Women''s Pants & Jeans', 'Дамски панталони и дънки', 'womens-pants', id, '👖'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Women''s Skirts', 'Дамски поли', 'womens-skirts', id, '👗'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Women''s Jackets & Coats', 'Дамски якета и палта', 'womens-jackets', id, '🧥'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Women''s Sweaters', 'Дамски пуловери', 'womens-sweaters', id, '🧶'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Women''s Lingerie & Sleepwear', 'Дамско бельо и пижами', 'womens-lingerie', id, '👙'
FROM categories WHERE slug = 'womens-fashion'
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- MEN'S CLOTHING (Level 3)
-- ================================================
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Men''s T-Shirts & Polos', 'Мъжки тениски и полота', 'mens-tshirts', id, '👕'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Men''s Shirts', 'Мъжки ризи', 'mens-shirts', id, '👔'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Men''s Pants & Jeans', 'Мъжки панталони и дънки', 'mens-pants', id, '👖'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Men''s Shorts', 'Мъжки къси панталони', 'mens-shorts', id, '🩳'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Men''s Jackets & Coats', 'Мъжки якета и палта', 'mens-jackets', id, '🧥'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Men''s Sweaters & Hoodies', 'Мъжки пуловери и суитшърти', 'mens-sweaters', id, '🧥'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Men''s Suits & Blazers', 'Мъжки костюми и сака', 'mens-suits', id, '🤵'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Men''s Underwear', 'Мъжко бельо', 'mens-underwear', id, '🩲'
FROM categories WHERE slug = 'mens-fashion'
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- KIDS' CLOTHING (Level 3)
-- ================================================
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Girls'' Clothing', 'Момичешки дрехи', 'kids-girls-clothing', id, '👧'
FROM categories WHERE slug = 'kids-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Boys'' Clothing', 'Момчешки дрехи', 'kids-boys-clothing', id, '👦'
FROM categories WHERE slug = 'kids-fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Baby Clothing', 'Бебешки дрехи', 'kids-baby-clothing', id, '👶'
FROM categories WHERE slug = 'kids-fashion'
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- SHOES (Level 3) - parent is existing "Shoes" under Fashion
-- ================================================
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Women''s Shoes', 'Дамски обувки', 'fashion-womens-shoes', id, '👠'
FROM categories WHERE slug = 'shoes' AND parent_id IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Men''s Shoes', 'Мъжки обувки', 'fashion-mens-shoes', id, '👞'
FROM categories WHERE slug = 'shoes' AND parent_id IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Kids'' Shoes', 'Детски обувки', 'fashion-kids-shoes', id, '👟'
FROM categories WHERE slug = 'shoes' AND parent_id IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 'Sports Shoes', 'Спортни обувки', 'fashion-sports-shoes', id, '👟'
FROM categories WHERE slug = 'shoes' AND parent_id IS NOT NULL
ON CONFLICT (slug) DO NOTHING;
;
