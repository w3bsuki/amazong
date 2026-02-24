-- ================================================================
-- GROCERY & FOOD (L0: grocery) - Complete L1 Categories
-- Bulgarian-focused marketplace structure
-- ================================================================

-- Get the parent ID for Grocery & Food
DO $$
DECLARE
    grocery_id UUID;
BEGIN
    SELECT id INTO grocery_id FROM categories WHERE slug = 'grocery';
    
    -- Delete existing L1 categories under Grocery to rebuild properly
    DELETE FROM categories WHERE parent_id = grocery_id;
    
    -- Re-insert with proper Bulgarian-focused structure
END $$;

-- L1: Dairy & Animal Products (Most important for Bulgarian market)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Dairy & Animal Products', 
    'Млечни и животински продукти',
    'grocery-dairy',
    id,
    '🥛',
    1,
    'Fresh dairy, eggs, butter, cheese, and other animal products',
    'Прясно мляко, яйца, масло, сирене и други животински продукти'
FROM categories WHERE slug = 'grocery';

-- L1: Fruits (Fresh & Local)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Fruits', 
    'Плодове',
    'grocery-fruits',
    id,
    '🍎',
    2,
    'Fresh fruits, berries, citrus, tropical and exotic fruits',
    'Пресни плодове, горски плодове, цитруси, тропически и екзотични плодове'
FROM categories WHERE slug = 'grocery';

-- L1: Vegetables
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Vegetables', 
    'Зеленчуци',
    'grocery-vegetables',
    id,
    '🥬',
    3,
    'Fresh vegetables, greens, roots, and herbs',
    'Пресни зеленчуци, зеленолистни, кореноплодни и подправки'
FROM categories WHERE slug = 'grocery';

-- L1: Meat & Seafood
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Meat & Seafood', 
    'Месо и морски дарове',
    'grocery-meat',
    id,
    '🥩',
    4,
    'Fresh and processed meat, poultry, fish, and seafood',
    'Прясно и преработено месо, птиче месо, риба и морски дарове'
FROM categories WHERE slug = 'grocery';

-- L1: Bakery & Bread
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Bakery & Bread', 
    'Хлебни и сладкарски изделия',
    'grocery-bakery',
    id,
    '🥖',
    5,
    'Fresh bread, pastries, cakes, and baked goods',
    'Пресен хляб, тестени изделия, торти и сладкиши'
FROM categories WHERE slug = 'grocery';

-- L1: Drinks & Beverages
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Drinks & Beverages', 
    'Напитки',
    'grocery-drinks',
    id,
    '🍷',
    6,
    'Water, juices, soft drinks, alcohol, wine, rakia, and hot beverages',
    'Вода, сокове, безалкохолни, алкохол, вино, ракия и топли напитки'
FROM categories WHERE slug = 'grocery';

-- L1: Pantry & Dry Goods
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Pantry & Dry Goods', 
    'Бакалия и сухи храни',
    'grocery-pantry',
    id,
    '🥫',
    7,
    'Canned goods, grains, pasta, rice, oils, and condiments',
    'Консерви, зърнени храни, тестени изделия, ориз, олио и подправки'
FROM categories WHERE slug = 'grocery';

-- L1: Organic & Bio
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Organic & Bio', 
    'Био и органични',
    'grocery-organic',
    id,
    '🌿',
    8,
    'Certified organic products, bio foods, natural and eco-friendly options',
    'Сертифицирани био продукти, органични храни и екологични продукти'
FROM categories WHERE slug = 'grocery';

-- L1: Bulgarian Specialty
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Bulgarian Specialty', 
    'Български специалитети',
    'grocery-bulgarian',
    id,
    '🇧🇬',
    9,
    'Traditional Bulgarian foods, homemade products, local delicacies',
    'Традиционни български храни, домашни продукти, местни деликатеси'
FROM categories WHERE slug = 'grocery';

-- L1: Frozen Foods
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Frozen Foods', 
    'Замразени храни',
    'grocery-frozen',
    id,
    '🧊',
    10,
    'Frozen vegetables, fruits, meals, ice cream, and frozen desserts',
    'Замразени зеленчуци, плодове, готови ястия, сладолед и десерти'
FROM categories WHERE slug = 'grocery';

-- L1: Snacks & Sweets
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Snacks & Sweets', 
    'Снаксове и сладости',
    'grocery-snacks',
    id,
    '🍫',
    11,
    'Chips, crackers, candy, chocolate, and sweet treats',
    'Чипс, крекери, бонбони, шоколад и сладки изкушения'
FROM categories WHERE slug = 'grocery';

-- L1: Baby & Kids Food
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'Baby & Kids Food', 
    'Бебешка и детска храна',
    'grocery-baby-food',
    id,
    '🍼',
    12,
    'Baby formula, purees, snacks, and healthy food for children',
    'Бебешки млека, пюрета, снаксове и здравословни храни за деца'
FROM categories WHERE slug = 'grocery';

-- L1: International Foods
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 
    'International Foods', 
    'Международна кухня',
    'grocery-international',
    id,
    '🌍',
    13,
    'Asian, Mediterranean, Mexican, Middle Eastern, and world cuisine products',
    'Азиатска, средиземноморска, мексиканска, близкоизточна и световна кухня'
FROM categories WHERE slug = 'grocery';;
