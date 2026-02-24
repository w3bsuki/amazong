-- ================================================================
-- GROCERY L3: Bakery - Fresh Bread
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'White Bread', 'Бял хляб', 'bread-white', id, '🍞', 1
FROM categories WHERE slug = 'bakery-bread';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Whole Wheat Bread', 'Пълнозърнест хляб', 'bread-wheat', id, '🍞', 2
FROM categories WHERE slug = 'bakery-bread';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Rye Bread', 'Ръжен хляб', 'bread-rye', id, '🍞', 3
FROM categories WHERE slug = 'bakery-bread';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sourdough Bread', 'Хляб с квас', 'bread-sourdough', id, '🍞', 4
FROM categories WHERE slug = 'bakery-bread';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Baguette', 'Багета', 'bread-baguette', id, '🥖', 5
FROM categories WHERE slug = 'bakery-bread';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pogacha (Bulgarian Bread)', 'Погача', 'bread-pogacha', id, '🍞', 6
FROM categories WHERE slug = 'bakery-bread';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Pitka', 'Питка', 'bread-pitka', id, '🫓', 7
FROM categories WHERE slug = 'bakery-bread';

-- ================================================================
-- GROCERY L3: Bakery - Bulgarian Pastries
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Banitsa (Cheese)', 'Баница със сирене', 'pastry-banitsa-cheese', id, '🥐', 1
FROM categories WHERE slug = 'bakery-pastry';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Banitsa (Spinach)', 'Баница със спанак', 'pastry-banitsa-spinach', id, '🥐', 2
FROM categories WHERE slug = 'bakery-pastry';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Banitsa (Pumpkin)', 'Тиквеник', 'pastry-tikvenik', id, '🥐', 3
FROM categories WHERE slug = 'bakery-pastry';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Mekitsi', 'Мекици', 'pastry-mekitsi', id, '🫓', 4
FROM categories WHERE slug = 'bakery-pastry';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Tutmanik', 'Тутманик', 'pastry-tutmanik', id, '🥐', 5
FROM categories WHERE slug = 'bakery-pastry';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Burek', 'Бюрек', 'pastry-burek', id, '🥐', 6
FROM categories WHERE slug = 'bakery-pastry';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Croissant', 'Кроасан', 'pastry-croissant', id, '🥐', 7
FROM categories WHERE slug = 'bakery-pastry';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Danish Pastry', 'Датска баничка', 'pastry-danish', id, '🥐', 8
FROM categories WHERE slug = 'bakery-pastry';

-- ================================================================
-- GROCERY L3: Bakery - Cakes
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Birthday Cakes', 'Торти за рожден ден', 'cake-birthday', id, '🎂', 1
FROM categories WHERE slug = 'bakery-cakes';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cheesecake', 'Чийзкейк', 'cake-cheesecake', id, '🍰', 2
FROM categories WHERE slug = 'bakery-cakes';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Chocolate Cake', 'Шоколадова торта', 'cake-chocolate', id, '🍫', 3
FROM categories WHERE slug = 'bakery-cakes';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Fruit Cake', 'Плодова торта', 'cake-fruit', id, '🍰', 4
FROM categories WHERE slug = 'bakery-cakes';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Garash Cake', 'Гараш торта', 'cake-garash', id, '🍫', 5
FROM categories WHERE slug = 'bakery-cakes';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Custom Cakes', 'Поръчкови торти', 'cake-custom', id, '🎂', 6
FROM categories WHERE slug = 'bakery-cakes';

-- ================================================================
-- GROCERY L3: Pantry - Rice
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'White Rice', 'Бял ориз', 'rice-white', id, '🍚', 1
FROM categories WHERE slug = 'pantry-rice';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Brown Rice', 'Кафяв ориз', 'rice-brown', id, '🍚', 2
FROM categories WHERE slug = 'pantry-rice';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Basmati Rice', 'Басмати ориз', 'rice-basmati', id, '🍚', 3
FROM categories WHERE slug = 'pantry-rice';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Jasmine Rice', 'Жасминов ориз', 'rice-jasmine', id, '🍚', 4
FROM categories WHERE slug = 'pantry-rice';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Risotto Rice', 'Ориз за ризото', 'rice-risotto', id, '🍚', 5
FROM categories WHERE slug = 'pantry-rice';

-- ================================================================
-- GROCERY L3: Pantry - Pasta
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Spaghetti', 'Спагети', 'pasta-spaghetti', id, '🍝', 1
FROM categories WHERE slug = 'pantry-pasta';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Penne', 'Пене', 'pasta-penne', id, '🍝', 2
FROM categories WHERE slug = 'pantry-pasta';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Fusilli', 'Фузили', 'pasta-fusilli', id, '🍝', 3
FROM categories WHERE slug = 'pantry-pasta';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Macaroni', 'Макарони', 'pasta-macaroni', id, '🍝', 4
FROM categories WHERE slug = 'pantry-pasta';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Lasagna Sheets', 'Лазаня', 'pasta-lasagna', id, '🍝', 5
FROM categories WHERE slug = 'pantry-pasta';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Egg Noodles', 'Юфка', 'pasta-noodles', id, '🍜', 6
FROM categories WHERE slug = 'pantry-pasta';

-- ================================================================
-- GROCERY L3: Pantry - Oils
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sunflower Oil', 'Слънчогледово олио', 'oil-sunflower', id, '🫒', 1
FROM categories WHERE slug = 'pantry-oils';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Olive Oil', 'Маслиново олио', 'oil-olive', id, '🫒', 2
FROM categories WHERE slug = 'pantry-oils';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Extra Virgin Olive Oil', 'Екстра върджин маслиново', 'oil-olive-extra', id, '🫒', 3
FROM categories WHERE slug = 'pantry-oils';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Coconut Oil', 'Кокосово масло', 'oil-coconut', id, '🥥', 4
FROM categories WHERE slug = 'pantry-oils';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sesame Oil', 'Сусамово масло', 'oil-sesame', id, '🫒', 5
FROM categories WHERE slug = 'pantry-oils';

-- ================================================================
-- GROCERY L3: Pantry - Canned Goods
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Canned Tomatoes', 'Консервирани домати', 'canned-tomatoes', id, '🥫', 1
FROM categories WHERE slug = 'pantry-canned';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Canned Beans', 'Консервиран боб', 'canned-beans', id, '🥫', 2
FROM categories WHERE slug = 'pantry-canned';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Canned Corn', 'Консервирана царевица', 'canned-corn', id, '🥫', 3
FROM categories WHERE slug = 'pantry-canned';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Canned Peas', 'Консервиран грах', 'canned-peas', id, '🥫', 4
FROM categories WHERE slug = 'pantry-canned';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Canned Fish', 'Рибни консерви', 'canned-fish', id, '🐟', 5
FROM categories WHERE slug = 'pantry-canned';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Canned Meat', 'Месни консерви', 'canned-meat', id, '🥫', 6
FROM categories WHERE slug = 'pantry-canned';

-- ================================================================
-- GROCERY L3: Pantry - Flour & Baking
-- ================================================================

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'All-Purpose Flour', 'Бяло брашно', 'flour-white', id, '🌾', 1
FROM categories WHERE slug = 'pantry-flour';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Whole Wheat Flour', 'Пълнозърнесто брашно', 'flour-wheat', id, '🌾', 2
FROM categories WHERE slug = 'pantry-flour';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Bread Flour', 'Брашно тип 500', 'flour-bread', id, '🌾', 3
FROM categories WHERE slug = 'pantry-flour';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Cornmeal', 'Царевично брашно', 'flour-corn', id, '🌽', 4
FROM categories WHERE slug = 'pantry-flour';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Baking Powder', 'Бакпулвер', 'flour-baking-powder', id, '🧂', 5
FROM categories WHERE slug = 'pantry-flour';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Yeast', 'Мая', 'flour-yeast', id, '🍞', 6
FROM categories WHERE slug = 'pantry-flour';

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Sugar', 'Захар', 'flour-sugar', id, '🧂', 7
FROM categories WHERE slug = 'pantry-flour';;
