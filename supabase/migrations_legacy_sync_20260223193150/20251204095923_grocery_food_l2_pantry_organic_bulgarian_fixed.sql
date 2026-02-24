-- ================================================================
-- GROCERY L2: Pantry & Dry Goods
-- ================================================================

-- L2: Rice & Grains
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Rice & Grains', 'Ориз и зърнени', 'pantry-rice', id, '🍚', 1,
    'White rice, brown rice, bulgur, buckwheat, quinoa, couscous',
    'Бял ориз, кафяв ориз, булгур, елда, киноа, кускус'
FROM categories WHERE slug = 'grocery-pantry';

-- L2: Pasta & Noodles
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pasta & Noodles', 'Паста и юфка', 'pantry-pasta', id, '🍝', 2,
    'Spaghetti, penne, lasagna, egg noodles, Asian noodles',
    'Спагети, пене, лазаня, яйчена юфка, азиатски нудълс'
FROM categories WHERE slug = 'grocery-pantry';

-- L2: Flour & Baking
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Flour & Baking', 'Брашно и съставки за печене', 'pantry-flour', id, '🥮', 3,
    'All-purpose flour, whole wheat, yeast, baking powder, sugar',
    'Бяло брашно, пълнозърнесто, мая, бакпулвер, захар'
FROM categories WHERE slug = 'grocery-pantry';

-- L2: Canned Goods
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Canned Goods', 'Консерви', 'pantry-canned', id, '🥫', 4,
    'Canned vegetables, beans, tomatoes, fish, soups',
    'Консервирани зеленчуци, боб, домати, риба, супи'
FROM categories WHERE slug = 'grocery-pantry';

-- L2: Oils & Vinegars
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Oils & Vinegars', 'Олио и оцет', 'pantry-oils', id, '🫒', 5,
    'Sunflower oil, olive oil, coconut oil, vinegars',
    'Слънчогледово олио, зехтин, кокосово масло, оцет'
FROM categories WHERE slug = 'grocery-pantry';

-- L2: Sauces & Condiments
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Sauces & Condiments', 'Сосове и подправки', 'pantry-sauces', id, '🍯', 6,
    'Ketchup, mayonnaise, mustard, soy sauce, hot sauce',
    'Кетчуп, майонеза, горчица, соев сос, лют сос'
FROM categories WHERE slug = 'grocery-pantry';

-- L2: Spices & Seasonings
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Spices & Seasonings', 'Подправки и билки', 'pantry-spices', id, '🌶️', 7,
    'Salt, pepper, paprika, cumin, oregano, cinnamon, sharena sol',
    'Сол, пипер, червен пипер, кимион, риган, канела, шарена сол'
FROM categories WHERE slug = 'grocery-pantry';

-- L2: Breakfast Cereals
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Breakfast Cereals', 'Зърнени закуски', 'pantry-cereals', id, '🥣', 8,
    'Oatmeal, cornflakes, muesli, granola',
    'Овесени ядки, корнфлейкс, мюсли, гранола'
FROM categories WHERE slug = 'grocery-pantry';

-- L2: Jams & Spreads
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Jams & Spreads', 'Сладка и конфитюр', 'pantry-jams', id, '🍓', 9,
    'Fruit jams, marmalade, Nutella, peanut butter, tahini',
    'Плодови сладка, мармалад, Нутела, фъстъчено масло, тахан'
FROM categories WHERE slug = 'grocery-pantry';

-- ================================================================
-- GROCERY L2: Organic & Bio
-- ================================================================

-- L2: Organic Produce
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Organic Produce', 'Био плодове и зеленчуци', 'organic-produce', id, '🥗', 1,
    'Certified organic fruits and vegetables',
    'Сертифицирани био плодове и зеленчуци'
FROM categories WHERE slug = 'grocery-organic';

-- L2: Organic Dairy
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Organic Dairy', 'Био млечни продукти', 'organic-dairy-products', id, '🥛', 2,
    'Organic milk, cheese, yogurt, butter',
    'Био мляко, сирене, кисело мляко, масло'
FROM categories WHERE slug = 'grocery-organic';

-- L2: Organic Meat
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Organic Meat', 'Био месо', 'organic-meat-products', id, '🥩', 3,
    'Organic and free-range meat products',
    'Био и месо от свободно отглеждане'
FROM categories WHERE slug = 'grocery-organic';

-- L2: Organic Pantry
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Organic Pantry', 'Био бакалия', 'organic-pantry-staples', id, '🌾', 4,
    'Organic grains, oils, condiments, and pantry staples',
    'Био зърнени, олио, подправки и основни продукти'
FROM categories WHERE slug = 'grocery-organic';

-- L2: Vegan & Plant-Based
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Vegan & Plant-Based', 'Веган и растителни', 'organic-vegan', id, '🌱', 5,
    'Vegan products, plant-based meat and dairy alternatives',
    'Веган продукти, растителни алтернативи на месо и млечни'
FROM categories WHERE slug = 'grocery-organic';

-- L2: Gluten-Free
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Gluten-Free', 'Безглутенови', 'organic-gluten-free', id, '🌿', 6,
    'Gluten-free products for celiac and gluten-sensitive diets',
    'Безглутенови продукти за целиакия и безглутенова диета'
FROM categories WHERE slug = 'grocery-organic';

-- L2: Superfoods
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Superfoods', 'Суперхрани', 'organic-superfoods', id, '✨', 7,
    'Chia seeds, goji berries, spirulina, acai, hemp seeds',
    'Чиа семена, годжи бери, спирулина, акай, конопени семена'
FROM categories WHERE slug = 'grocery-organic';

-- ================================================================
-- GROCERY L2: Bulgarian Specialty (marketplace homegrown focus)
-- ================================================================

-- L2: Homemade Products (Key for Bulgarian marketplace!)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Homemade Products', 'Домашни продукти', 'grocery-bg-homemade', id, '🏠', 1,
    'Homegrown and homemade food products from local farmers',
    'Домашни и отгледани в дома продукти от местни фермери'
FROM categories WHERE slug = 'grocery-bulgarian';

-- L2: Traditional Dairy (Bulgarian yogurt, sirene, kashkaval)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Traditional Dairy', 'Традиционни млечни', 'grocery-bg-trad-dairy', id, '🧀', 2,
    'Bulgarian yogurt, sirene cheese, kashkaval, brinza',
    'Българско кисело мляко, сирене, кашкавал, бринза'
FROM categories WHERE slug = 'grocery-bulgarian';

-- L2: Bulgarian Preserves (Winter stores - zimnica!)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Preserves & Pickles', 'Зимнина и туршии', 'grocery-bg-preserves', id, '🥒', 3,
    'Pickled vegetables, lutenitsa, ajvar, compotes, jams',
    'Туршии, лютеница, айвар, компоти, сладка'
FROM categories WHERE slug = 'grocery-bulgarian';

-- L2: Bulgarian Meats
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Bulgarian Meats', 'Български месни', 'grocery-bg-meats', id, '🥓', 4,
    'Lukanka, sudzhuk, pastarma, sujuk, Bulgarian sausages',
    'Луканка, суджук, пастърма, наденица, български колбаси'
FROM categories WHERE slug = 'grocery-bulgarian';

-- L2: Rose Products
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Rose Products', 'Розови продукти', 'grocery-bg-rose', id, '🌹', 5,
    'Rose jam, rose water, rose oil, rose honey',
    'Сладко от рози, розова вода, розово масло, розов мед'
FROM categories WHERE slug = 'grocery-bulgarian';

-- L2: Bulgarian Wine & Rakia
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Wine & Rakia', 'Вино и ракия', 'grocery-bg-wine-rakia', id, '🍷', 6,
    'Bulgarian wines from local vineyards, homemade rakia',
    'Български вина от местни лозя, домашна ракия'
FROM categories WHERE slug = 'grocery-bulgarian';

-- L2: Honey & Bee Products
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Honey & Bee Products', 'Мед и пчелни продукти', 'grocery-bg-honey', id, '🍯', 7,
    'Bulgarian honey, propolis, royal jelly, honeycomb',
    'Български мед, прополис, пчелно млечице, пчелна пита'
FROM categories WHERE slug = 'grocery-bulgarian';

-- L2: Herbs & Mountain Tea
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Herbs & Mountain Tea', 'Билки и планински чай', 'grocery-bg-herbs', id, '🍵', 8,
    'Mountain tea, mursal tea, linden, chamomile, Bulgarian herbs',
    'Планински чай, мурсалски чай, липа, лайка, български билки'
FROM categories WHERE slug = 'grocery-bulgarian';;
