-- ================================================================
-- GROCERY L2: Dairy & Animal Products
-- ================================================================

-- L2: Milk & Cream
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Milk & Cream', 'Мляко и сметана', 'dairy-milk', id, '🥛', 1,
    'Fresh milk, cream, buttermilk, and plant-based alternatives',
    'Прясно мляко, сметана, мътеница и растителни алтернативи'
FROM categories WHERE slug = 'grocery-dairy';

-- L2: Cheese (Bulgarian sirene is key!)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Cheese', 'Сирене', 'dairy-cheese', id, '🧀', 2,
    'Bulgarian sirene, kashkaval, yellow cheese, feta, mozzarella, and more',
    'Българско сирене, кашкавал, топено сирене, фета, моцарела и други'
FROM categories WHERE slug = 'grocery-dairy';

-- L2: Yogurt (Bulgarian yogurt is world famous!)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Yogurt', 'Кисело мляко', 'dairy-yogurt', id, '🥣', 3,
    'Bulgarian yogurt, Greek yogurt, fruit yogurt, probiotic yogurt',
    'Българско кисело мляко, гръцко кисело мляко, плодово, пробиотично'
FROM categories WHERE slug = 'grocery-dairy';

-- L2: Butter & Spreads
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Butter & Spreads', 'Масло и намазки', 'dairy-butter', id, '🧈', 4,
    'Butter, margarine, spreads, and plant-based alternatives',
    'Масло, маргарин, намазки и растителни алтернативи'
FROM categories WHERE slug = 'grocery-dairy';

-- L2: Eggs
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Eggs', 'Яйца', 'dairy-eggs', id, '🥚', 5,
    'Chicken eggs, quail eggs, organic eggs, free-range eggs',
    'Кокоши яйца, пъдпъдъчи яйца, био яйца, яйца от свободно отглеждане'
FROM categories WHERE slug = 'grocery-dairy';

-- L2: Honey & Bee Products (Very popular in Bulgaria!)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Honey & Bee Products', 'Мед и пчелни продукти', 'dairy-honey', id, '🍯', 6,
    'Raw honey, honeycomb, propolis, royal jelly, bee pollen',
    'Натурален мед, пчелна пита, прополис, пчелно млечице, пчелен прашец'
FROM categories WHERE slug = 'grocery-dairy';

-- ================================================================
-- GROCERY L2: Fruits
-- ================================================================

-- L2: Berries
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Berries', 'Горски плодове', 'fruits-berries', id, '🍓', 1,
    'Strawberries, blueberries, raspberries, blackberries, and more',
    'Ягоди, боровинки, малини, къпини и други'
FROM categories WHERE slug = 'grocery-fruits';

-- L2: Apples & Pears
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Apples & Pears', 'Ябълки и круши', 'fruits-apples', id, '🍎', 2,
    'Fresh apples, pears, quinces, and similar fruits',
    'Пресни ябълки, круши, дюли и подобни плодове'
FROM categories WHERE slug = 'grocery-fruits';

-- L2: Stone Fruits
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Stone Fruits', 'Костилкови плодове', 'fruits-stone', id, '🍑', 3,
    'Peaches, plums, cherries, apricots, nectarines',
    'Праскови, сливи, череши, кайсии, нектарини'
FROM categories WHERE slug = 'grocery-fruits';

-- L2: Grapes
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Grapes', 'Грозде', 'fruits-grapes', id, '🍇', 4,
    'Table grapes, seedless grapes, wine grapes',
    'Десертно грозде, безсеменно грозде, винено грозде'
FROM categories WHERE slug = 'grocery-fruits';

-- L2: Citrus Fruits
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Citrus Fruits', 'Цитрусови плодове', 'fruits-citrus', id, '🍊', 5,
    'Oranges, lemons, limes, grapefruits, mandarins',
    'Портокали, лимони, лайм, грейпфрути, мандарини'
FROM categories WHERE slug = 'grocery-fruits';

-- L2: Melons
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Melons', 'Пъпеши и дини', 'fruits-melons', id, '🍈', 6,
    'Watermelons, cantaloupes, honeydew, and other melons',
    'Дини, пъпеши и други видове дини'
FROM categories WHERE slug = 'grocery-fruits';

-- L2: Tropical & Exotic Fruits
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Tropical & Exotic', 'Тропически и екзотични', 'fruits-tropical', id, '🥭', 7,
    'Bananas, mangoes, pineapples, kiwis, papayas, exotic fruits',
    'Банани, манго, ананаси, киви, папая, екзотични плодове'
FROM categories WHERE slug = 'grocery-fruits';

-- L2: Dried Fruits & Nuts
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Dried Fruits & Nuts', 'Сушени плодове и ядки', 'fruits-dried', id, '🥜', 8,
    'Raisins, dates, figs, prunes, nuts, almonds, walnuts',
    'Стафиди, фурми, смокини, сини сливи, ядки, бадеми, орехи'
FROM categories WHERE slug = 'grocery-fruits';

-- ================================================================
-- GROCERY L2: Vegetables
-- ================================================================

-- L2: Leafy Greens
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Leafy Greens', 'Зеленолистни', 'veg-leafy', id, '🥬', 1,
    'Lettuce, spinach, kale, cabbage, chard, arugula',
    'Салата, спанак, кейл, зеле, манголд, рукола'
FROM categories WHERE slug = 'grocery-vegetables';

-- L2: Tomatoes & Peppers
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Tomatoes & Peppers', 'Домати и чушки', 'veg-tomatoes', id, '🍅', 2,
    'Tomatoes, bell peppers, hot peppers, chilis',
    'Домати, сладки чушки, люти чушки, чили'
FROM categories WHERE slug = 'grocery-vegetables';

-- L2: Cucumbers & Zucchini
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Cucumbers & Zucchini', 'Краставици и тиквички', 'veg-cucumbers', id, '🥒', 3,
    'Cucumbers, zucchini, squash, pumpkins',
    'Краставици, тиквички, тикви, кратуни'
FROM categories WHERE slug = 'grocery-vegetables';

-- L2: Root Vegetables
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Root Vegetables', 'Кореноплодни', 'veg-roots', id, '🥕', 4,
    'Carrots, potatoes, beets, radishes, turnips, parsnips',
    'Моркови, картофи, цвекло, репички, ряпа, пащърнак'
FROM categories WHERE slug = 'grocery-vegetables';

-- L2: Onions & Garlic
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Onions & Garlic', 'Лук и чесън', 'veg-onions', id, '🧅', 5,
    'Onions, garlic, leeks, shallots, green onions',
    'Лук, чесън, праз лук, шалот, зелен лук'
FROM categories WHERE slug = 'grocery-vegetables';

-- L2: Beans & Legumes
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Beans & Legumes', 'Бобови растения', 'veg-beans', id, '🫘', 6,
    'Green beans, peas, lentils, chickpeas, broad beans',
    'Зелен фасул, грах, леща, нахут, бакла'
FROM categories WHERE slug = 'grocery-vegetables';

-- L2: Fresh Herbs
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Fresh Herbs', 'Пресни подправки', 'veg-herbs', id, '🌿', 7,
    'Parsley, dill, coriander, basil, mint, thyme, rosemary',
    'Магданоз, копър, кориандър, босилек, мента, мащерка, розмарин'
FROM categories WHERE slug = 'grocery-vegetables';

-- L2: Mushrooms
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Mushrooms', 'Гъби', 'veg-mushrooms', id, '🍄', 8,
    'Button mushrooms, oyster mushrooms, wild mushrooms, porcini',
    'Печурки, кладница, горски гъби, манатарки'
FROM categories WHERE slug = 'grocery-vegetables';

-- L2: Other Vegetables
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Other Vegetables', 'Други зеленчуци', 'veg-other', id, '🥦', 9,
    'Broccoli, cauliflower, eggplant, corn, artichokes',
    'Броколи, карфиол, патладжан, царевица, артишок'
FROM categories WHERE slug = 'grocery-vegetables';;
