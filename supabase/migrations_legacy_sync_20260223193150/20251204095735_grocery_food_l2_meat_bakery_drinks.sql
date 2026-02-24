-- ================================================================
-- GROCERY L2: Meat & Seafood
-- ================================================================

-- L2: Beef
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Beef', 'Телешко месо', 'meat-beef', id, '🥩', 1,
    'Steaks, ground beef, roasts, veal',
    'Пържоли, кайма, печено, телешко'
FROM categories WHERE slug = 'grocery-meat';

-- L2: Pork
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pork', 'Свинско месо', 'meat-pork', id, '🥓', 2,
    'Pork chops, ribs, ham, bacon, pork belly',
    'Свински котлети, ребра, шунка, бекон, свинско'
FROM categories WHERE slug = 'grocery-meat';

-- L2: Poultry
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Poultry', 'Птиче месо', 'meat-poultry', id, '🍗', 3,
    'Chicken, turkey, duck, goose, quail',
    'Пиле, пуйка, патица, гъска, пъдпъдък'
FROM categories WHERE slug = 'grocery-meat';

-- L2: Lamb & Goat
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Lamb & Goat', 'Агнешко и козе', 'meat-lamb', id, '🐑', 4,
    'Lamb chops, leg of lamb, goat meat, kid meat',
    'Агнешки котлети, агнешки бут, козе месо, ярешко'
FROM categories WHERE slug = 'grocery-meat';

-- L2: Sausages & Deli Meats (Very Bulgarian - lukanka, sudzhuk!)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Sausages & Deli Meats', 'Колбаси и деликатеси', 'meat-deli', id, '🌭', 5,
    'Lukanka, sudzhuk, sausages, salami, ham, prosciutto',
    'Луканка, суджук, наденица, салам, шунка, прошуто'
FROM categories WHERE slug = 'grocery-meat';

-- L2: Fresh Fish
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Fresh Fish', 'Прясна риба', 'meat-fish', id, '🐟', 6,
    'Salmon, trout, carp, mackerel, sea bass, sea bream',
    'Сьомга, пъстърва, шаран, скумрия, лаврак, ципура'
FROM categories WHERE slug = 'grocery-meat';

-- L2: Seafood
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Seafood', 'Морски дарове', 'meat-seafood', id, '🦐', 7,
    'Shrimp, mussels, calamari, octopus, crab, lobster',
    'Скариди, миди, калмари, октопод, раци, омар'
FROM categories WHERE slug = 'grocery-meat';

-- L2: Game Meat
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Game Meat', 'Дивечово месо', 'meat-game', id, '🦌', 8,
    'Venison, wild boar, rabbit, pheasant, wild game',
    'Еленско месо, диво прасе, заек, фазан, дивеч'
FROM categories WHERE slug = 'grocery-meat';

-- ================================================================
-- GROCERY L2: Bakery & Bread
-- ================================================================

-- L2: Bread
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Bread', 'Хляб', 'bakery-bread', id, '🍞', 1,
    'White bread, whole wheat, sourdough, rye, village bread',
    'Бял хляб, пълнозърнест, квас, ръжен, селски хляб'
FROM categories WHERE slug = 'grocery-bakery';

-- L2: Pastries
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pastries', 'Тестени изделия', 'bakery-pastries', id, '🥐', 2,
    'Croissants, banitsa, mekitsi, puff pastry, savory pastries',
    'Кроасани, баница, мекици, бутер тесто, солени тестени изделия'
FROM categories WHERE slug = 'grocery-bakery';

-- L2: Cakes & Desserts
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Cakes & Desserts', 'Торти и десерти', 'bakery-cakes', id, '🎂', 3,
    'Birthday cakes, cheesecakes, tarts, desserts',
    'Рожденични торти, чийзкейк, тарти, десерти'
FROM categories WHERE slug = 'grocery-bakery';

-- L2: Cookies & Biscuits
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Cookies & Biscuits', 'Бисквити и сладки', 'bakery-cookies', id, '🍪', 4,
    'Cookies, biscuits, wafers, tea cakes',
    'Бисквити, сладки, вафли, сладки за чай'
FROM categories WHERE slug = 'grocery-bakery';

-- L2: Traditional Bulgarian Pastries
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Traditional Pastries', 'Традиционни изделия', 'bakery-traditional', id, '🥮', 5,
    'Banitsa, tutmanik, kozunak, tikvenik, zelnik',
    'Баница, тутманик, козунак, тиквеник, зелник'
FROM categories WHERE slug = 'grocery-bakery';

-- L2: Rolls & Buns
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Rolls & Buns', 'Кифли и питки', 'bakery-rolls', id, '🥯', 6,
    'Burger buns, hot dog buns, bread rolls, pita bread',
    'Питки за бургери, хот-дог, хлебчета, питки'
FROM categories WHERE slug = 'grocery-bakery';

-- ================================================================
-- GROCERY L2: Drinks & Beverages
-- ================================================================

-- L2: Water
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Water', 'Вода', 'drinks-water', id, '💧', 1,
    'Mineral water, sparkling water, spring water, flavored water',
    'Минерална вода, газирана вода, изворна вода, ароматизирана вода'
FROM categories WHERE slug = 'grocery-drinks';

-- L2: Juices
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Juices', 'Сокове', 'drinks-juices', id, '🧃', 2,
    'Fruit juices, vegetable juices, fresh squeezed, nectars',
    'Плодови сокове, зеленчукови сокове, прясно изцедени, нектари'
FROM categories WHERE slug = 'grocery-drinks';

-- L2: Soft Drinks
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Soft Drinks', 'Безалкохолни', 'drinks-soft', id, '🥤', 3,
    'Cola, lemonade, energy drinks, sports drinks',
    'Кола, лимонада, енергийни напитки, спортни напитки'
FROM categories WHERE slug = 'grocery-drinks';

-- L2: Coffee
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Coffee', 'Кафе', 'drinks-coffee', id, '☕', 4,
    'Ground coffee, coffee beans, instant coffee, capsules',
    'Мляно кафе, кафе на зърна, инстантно кафе, капсули'
FROM categories WHERE slug = 'grocery-drinks';

-- L2: Tea
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Tea', 'Чай', 'drinks-tea', id, '🍵', 5,
    'Black tea, green tea, herbal tea, fruit tea',
    'Черен чай, зелен чай, билков чай, плодов чай'
FROM categories WHERE slug = 'grocery-drinks';

-- L2: Wine (Very important for Bulgaria!)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Wine', 'Вино', 'drinks-wine', id, '🍷', 6,
    'Red wine, white wine, rosé, sparkling, Bulgarian wines',
    'Червено вино, бяло вино, розе, пенливо, български вина'
FROM categories WHERE slug = 'grocery-drinks';

-- L2: Rakia & Spirits (Bulgarian national drink!)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Rakia & Spirits', 'Ракия и спиртни напитки', 'drinks-spirits', id, '🥃', 7,
    'Rakia, vodka, whiskey, brandy, liqueurs, mastika',
    'Ракия, водка, уиски, бренди, ликьори, мастика'
FROM categories WHERE slug = 'grocery-drinks';

-- L2: Beer
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Beer', 'Бира', 'drinks-beer', id, '🍺', 8,
    'Lager, ale, craft beer, non-alcoholic beer, Bulgarian beer',
    'Лагер, ейл, крафт бира, безалкохолна бира, българска бира'
FROM categories WHERE slug = 'grocery-drinks';

-- L2: Traditional Bulgarian Drinks
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Traditional Drinks', 'Традиционни напитки', 'drinks-traditional', id, '🍶', 9,
    'Boza, ayran, kompot, rose water, elderflower syrup',
    'Боза, айран, компот, розова вода, бъзов сироп'
FROM categories WHERE slug = 'grocery-drinks';;
