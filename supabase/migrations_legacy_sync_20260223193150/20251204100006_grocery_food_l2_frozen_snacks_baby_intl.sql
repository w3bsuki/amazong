-- ================================================================
-- GROCERY L2: Frozen Foods
-- ================================================================

-- L2: Frozen Vegetables
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Frozen Vegetables', 'Замразени зеленчуци', 'frozen-vegetables', id, '🥦', 1,
    'Frozen peas, corn, mixed vegetables, broccoli',
    'Замразен грах, царевица, зеленчуков микс, броколи'
FROM categories WHERE slug = 'grocery-frozen';

-- L2: Frozen Fruits
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Frozen Fruits', 'Замразени плодове', 'frozen-fruits', id, '🍓', 2,
    'Frozen berries, mango, tropical fruits, smoothie mixes',
    'Замразени горски плодове, манго, тропически, микс за смути'
FROM categories WHERE slug = 'grocery-frozen';

-- L2: Frozen Meals
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Frozen Meals', 'Замразени ястия', 'frozen-meals', id, '🍱', 3,
    'Ready meals, pizza, lasagna, frozen entrees',
    'Готови ястия, пица, лазаня, замразени порции'
FROM categories WHERE slug = 'grocery-frozen';

-- L2: Frozen Meat & Fish
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Frozen Meat & Fish', 'Замразено месо и риба', 'frozen-meat-fish', id, '🐟', 4,
    'Frozen fish fillets, shrimp, chicken, beef',
    'Замразени рибни филета, скариди, пилешко, телешко'
FROM categories WHERE slug = 'grocery-frozen';

-- L2: Ice Cream & Desserts
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Ice Cream & Desserts', 'Сладолед и десерти', 'frozen-icecream', id, '🍦', 5,
    'Ice cream, sorbets, frozen cakes, frozen yogurt',
    'Сладолед, сорбета, замразени торти, замразен йогурт'
FROM categories WHERE slug = 'grocery-frozen';

-- L2: Frozen Dough & Pastry
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Frozen Dough & Pastry', 'Замразено тесто', 'frozen-dough', id, '🥐', 6,
    'Puff pastry, filo dough, pizza dough, banitsa sheets',
    'Бутер тесто, кори за баница, тесто за пица'
FROM categories WHERE slug = 'grocery-frozen';

-- ================================================================
-- GROCERY L2: Snacks & Sweets
-- ================================================================

-- L2: Chips & Crisps
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Chips & Crisps', 'Чипс и снаксове', 'snacks-chips', id, '🍟', 1,
    'Potato chips, tortilla chips, vegetable chips, corn snacks',
    'Картофен чипс, тортила чипс, зеленчуков чипс, царевични снаксове'
FROM categories WHERE slug = 'grocery-snacks';

-- L2: Crackers & Pretzels
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Crackers & Pretzels', 'Крекери и солети', 'snacks-crackers', id, '🥨', 2,
    'Crackers, pretzels, breadsticks, rice cakes',
    'Крекери, солети, гризини, оризови бисквити'
FROM categories WHERE slug = 'grocery-snacks';

-- L2: Chocolate
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Chocolate', 'Шоколад', 'snacks-chocolate', id, '🍫', 3,
    'Dark chocolate, milk chocolate, white chocolate, pralines',
    'Черен шоколад, млечен шоколад, бял шоколад, бонбони'
FROM categories WHERE slug = 'grocery-snacks';

-- L2: Candy & Sweets
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Candy & Sweets', 'Бонбони и сладости', 'snacks-candy', id, '🍬', 4,
    'Hard candy, gummy bears, lollipops, licorice',
    'Твърди бонбони, желирани, близалки, солници'
FROM categories WHERE slug = 'grocery-snacks';

-- L2: Nuts & Seeds
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Nuts & Seeds', 'Ядки и семена', 'snacks-nuts', id, '🥜', 5,
    'Peanuts, almonds, cashews, sunflower seeds, pumpkin seeds',
    'Фъстъци, бадеми, кашу, слънчогледови семки, тиквени семки'
FROM categories WHERE slug = 'grocery-snacks';

-- L2: Popcorn
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Popcorn', 'Пуканки', 'snacks-popcorn', id, '🍿', 6,
    'Microwave popcorn, ready-to-eat popcorn, popcorn kernels',
    'Пуканки за микровълнова, готови пуканки, царевица за пуканки'
FROM categories WHERE slug = 'grocery-snacks';

-- L2: Energy & Protein Bars
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Energy & Protein Bars', 'Енергийни и протеинови барове', 'snacks-bars', id, '💪', 7,
    'Granola bars, protein bars, energy bars, cereal bars',
    'Барове с мюсли, протеинови барове, енергийни барове'
FROM categories WHERE slug = 'grocery-snacks';

-- ================================================================
-- GROCERY L2: Baby & Kids Food
-- ================================================================

-- L2: Baby Formula
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Baby Formula', 'Адаптирано мляко', 'baby-formula', id, '🍼', 1,
    'Infant formula, follow-on milk, special formulas',
    'Адаптирано мляко за бебета, последващо мляко, специални формули'
FROM categories WHERE slug = 'grocery-baby-food';

-- L2: Baby Purees & Meals
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Baby Purees & Meals', 'Пюрета и ястия', 'baby-purees', id, '🥣', 2,
    'Fruit purees, vegetable purees, meat purees, ready meals',
    'Плодови пюрета, зеленчукови пюрета, месни пюрета, готови ястия'
FROM categories WHERE slug = 'grocery-baby-food';

-- L2: Baby Cereals
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Baby Cereals', 'Бебешки каши', 'baby-cereals', id, '🌾', 3,
    'Rice cereal, oatmeal, multigrain cereal',
    'Оризова каша, овесена каша, многозърнеста каша'
FROM categories WHERE slug = 'grocery-baby-food';

-- L2: Baby Snacks
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Baby Snacks', 'Бебешки снаксове', 'baby-snacks', id, '🍪', 4,
    'Baby biscuits, puffs, teething snacks, fruit snacks',
    'Бебешки бисквити, пуфове, снаксове за никнене на зъби'
FROM categories WHERE slug = 'grocery-baby-food';

-- L2: Baby Drinks
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Baby Drinks', 'Бебешки напитки', 'baby-drinks', id, '🧃', 5,
    'Baby juices, herbal teas, water for babies',
    'Бебешки сокове, билкови чайове, вода за бебета'
FROM categories WHERE slug = 'grocery-baby-food';

-- L2: Kids Healthy Snacks
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Kids Healthy Snacks', 'Здравословни детски', 'kids-healthy-snacks', id, '🥕', 6,
    'Healthy snacks for kids, fruit bars, veggie snacks',
    'Здравословни снаксове за деца, плодови барове, зеленчукови'
FROM categories WHERE slug = 'grocery-baby-food';

-- ================================================================
-- GROCERY L2: International Foods
-- ================================================================

-- L2: Asian Foods
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Asian Foods', 'Азиатска кухня', 'intl-asian', id, '🍜', 1,
    'Chinese, Japanese, Thai, Korean, Vietnamese ingredients',
    'Китайска, японска, тайландска, корейска, виетнамска кухня'
FROM categories WHERE slug = 'grocery-international';

-- L2: Mediterranean Foods
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Mediterranean', 'Средиземноморска', 'intl-mediterranean', id, '🫒', 2,
    'Greek, Italian, Spanish, Turkish ingredients',
    'Гръцка, италианска, испанска, турска кухня'
FROM categories WHERE slug = 'grocery-international';

-- L2: Mexican & Latin
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Mexican & Latin', 'Мексиканска и латино', 'intl-mexican', id, '🌮', 3,
    'Tortillas, salsa, beans, spices, Mexican ingredients',
    'Тортили, салса, боб, подправки, мексикански продукти'
FROM categories WHERE slug = 'grocery-international';

-- L2: Middle Eastern
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Middle Eastern', 'Близкоизточна', 'intl-middle-eastern', id, '🧆', 4,
    'Hummus, falafel, tahini, dates, Middle Eastern spices',
    'Хумус, фалафел, тахан, фурми, близкоизточни подправки'
FROM categories WHERE slug = 'grocery-international';

-- L2: American
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'American', 'Американска', 'intl-american', id, '🍔', 5,
    'American snacks, cereals, sauces, BBQ, peanut butter',
    'Американски снаксове, зърнени закуски, сосове, барбекю'
FROM categories WHERE slug = 'grocery-international';

-- L2: Indian
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Indian', 'Индийска', 'intl-indian', id, '🍛', 6,
    'Indian spices, curry pastes, rice, lentils, naan',
    'Индийски подправки, къри пасти, ориз, леща, наан'
FROM categories WHERE slug = 'grocery-international';

-- L2: British
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'British', 'Британска', 'intl-british', id, '🫖', 7,
    'British tea, biscuits, marmalade, Marmite, cheddar',
    'Британски чай, бисквити, мармалад, чедър'
FROM categories WHERE slug = 'grocery-international';;
