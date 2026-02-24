
-- L3 for Baby Clothing
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Baby Bodysuits', 'Бебешки бодита', 'baby-bodysuits', id, 1 FROM categories WHERE slug = 'baby-clothing'
UNION ALL
SELECT 'Baby Rompers', 'Бебешки гащеризони', 'baby-rompers', id, 2 FROM categories WHERE slug = 'baby-clothing'
UNION ALL
SELECT 'Baby Sleepwear', 'Бебешки пижами', 'baby-sleepwear', id, 3 FROM categories WHERE slug = 'baby-clothing'
UNION ALL
SELECT 'Baby Outerwear', 'Бебешки якета', 'baby-outerwear', id, 4 FROM categories WHERE slug = 'baby-clothing';

-- L3 for Baby Gear
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Strollers', 'Колички', 'babygear-strollers', id, 1 FROM categories WHERE slug = 'baby-gear'
UNION ALL
SELECT 'Car Seats', 'Столчета за кола', 'babygear-carseats', id, 2 FROM categories WHERE slug = 'baby-gear'
UNION ALL
SELECT 'Baby Carriers', 'Раници за бебета', 'babygear-carriers', id, 3 FROM categories WHERE slug = 'baby-gear'
UNION ALL
SELECT 'Baby Cribs', 'Бебешки легла', 'babygear-cribs', id, 4 FROM categories WHERE slug = 'baby-gear'
UNION ALL
SELECT 'Highchairs', 'Столчета за хранене', 'babygear-highchairs', id, 5 FROM categories WHERE slug = 'baby-gear';

-- L3 for Feeding
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Baby Bottles', 'Бебешки шишета', 'feeding-bottles', id, 1 FROM categories WHERE slug = 'feeding'
UNION ALL
SELECT 'Breast Pumps', 'Помпи за кърма', 'feeding-breastpumps', id, 2 FROM categories WHERE slug = 'feeding'
UNION ALL
SELECT 'Baby Food', 'Бебешка храна', 'feeding-babyfood', id, 3 FROM categories WHERE slug = 'feeding'
UNION ALL
SELECT 'Bibs & Burp Cloths', 'Лигавници и кърпички', 'feeding-bibs', id, 4 FROM categories WHERE slug = 'feeding';

-- L3 for Diapers & Changing
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Disposable Diapers', 'Еднократни пелени', 'diapers-disposable', id, 1 FROM categories WHERE slug = 'diapers'
UNION ALL
SELECT 'Cloth Diapers', 'Текстилни пелени', 'diapers-cloth', id, 2 FROM categories WHERE slug = 'diapers'
UNION ALL
SELECT 'Diaper Bags', 'Чанти за пелени', 'diapers-bags', id, 3 FROM categories WHERE slug = 'diapers'
UNION ALL
SELECT 'Changing Pads', 'Подложки за преповиване', 'diapers-pads', id, 4 FROM categories WHERE slug = 'diapers'
UNION ALL
SELECT 'Wipes', 'Мокри кърпички', 'diapers-wipes', id, 5 FROM categories WHERE slug = 'diapers';

-- L3 for Coins (Collectibles)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Ancient Coins', 'Антични монети', 'coins-ancient', id, 1 FROM categories WHERE slug = 'coins'
UNION ALL
SELECT 'World Coins', 'Световни монети', 'coins-world', id, 2 FROM categories WHERE slug = 'coins'
UNION ALL
SELECT 'Bulgarian Coins', 'Български монети', 'coins-bulgarian', id, 3 FROM categories WHERE slug = 'coins'
UNION ALL
SELECT 'Gold & Silver Coins', 'Златни и сребърни монети', 'coins-precious', id, 4 FROM categories WHERE slug = 'coins';

-- L3 for Stamps
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Bulgarian Stamps', 'Български пощенски марки', 'stamps-bulgarian', id, 1 FROM categories WHERE slug = 'stamps'
UNION ALL
SELECT 'European Stamps', 'Европейски марки', 'stamps-european', id, 2 FROM categories WHERE slug = 'stamps'
UNION ALL
SELECT 'Thematic Stamps', 'Тематични марки', 'stamps-thematic', id, 3 FROM categories WHERE slug = 'stamps';

-- L3 for Antiques
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Antique Furniture', 'Антикварни мебели', 'antiques-furniture', id, 1 FROM categories WHERE slug = 'antiques'
UNION ALL
SELECT 'Antique Art', 'Антикварно изкуство', 'antiques-art', id, 2 FROM categories WHERE slug = 'antiques'
UNION ALL
SELECT 'Antique Clocks', 'Антикварни часовници', 'antiques-clocks', id, 3 FROM categories WHERE slug = 'antiques'
UNION ALL
SELECT 'Vintage Porcelain', 'Антикварен порцелан', 'antiques-porcelain', id, 4 FROM categories WHERE slug = 'antiques';
;
