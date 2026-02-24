
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 2H: L2 FOR REMAINING L1 CATEGORIES
-- ============================================================================

-- PARKING & STORAGE
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'parking-storage'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Garages', 'Гаражи', 'garages-sale', 'Garages for sale', 'Гаражи за продажба', 1),
    ('Parking Spaces', 'Паркоместа', 'parking-spaces-sale', 'Indoor and outdoor parking spaces', 'Открити и закрити паркоместа', 2),
    ('Underground Parking', 'Подземни гаражи', 'underground-parking', 'Underground parking spots', 'Подземни паркоместа', 3),
    ('Storage Units', 'Складови клетки', 'storage-units-sale', 'Storage units and lockers', 'Складови клетки и мазета', 4),
    ('Basements', 'Мазета', 'basements-sale', 'Basement storage spaces', 'Мазета и избени помещения', 5),
    ('Boat Storage', 'Лодкостоянки', 'boat-storage', 'Marina and boat storage', 'Марини и лодкостоянки', 6),
    ('Carports', 'Навеси за коли', 'carports-sale', 'Covered parking carports', 'Навеси и покрити паркоместа', 7),
    ('Parking Lots', 'Паркинги', 'parking-lots-sale', 'Commercial parking lots', 'Търговски паркинги', 8)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'parking-storage');

-- NEW CONSTRUCTION
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'new-construction'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('New Apartments', 'Нови апартаменти', 'new-apartments', 'Newly built apartments Act 16', 'Новопостроени апартаменти с Акт 16', 1),
    ('New Houses', 'Нови къщи', 'new-houses', 'Newly constructed houses', 'Новопостроени къщи', 2),
    ('Off-Plan Apartments', 'Апартаменти на зелено', 'offplan-apartments', 'Apartments under construction', 'Апартаменти в строеж', 3),
    ('Off-Plan Houses', 'Къщи на зелено', 'offplan-houses', 'Houses under construction', 'Къщи в строеж', 4),
    ('New Developments', 'Нови проекти', 'new-developments', 'New residential complexes', 'Нови жилищни комплекси', 5),
    ('Turnkey Properties', 'До ключ', 'turnkey-properties', 'Ready to move properties', 'Имоти готови за нанасяне', 6),
    ('Eco Buildings', 'Еко сгради', 'eco-buildings', 'Green and sustainable buildings', 'Зелени и устойчиви сгради', 7),
    ('Pre-Construction', 'Предстроителство', 'pre-construction', 'Projects before construction starts', 'Проекти преди началото на строителството', 8)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'new-construction');

-- RURAL & AGRICULTURAL
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'rural-agricultural'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Farms', 'Ферми', 'farms-sale', 'Working farms for sale', 'Работещи ферми за продажба', 1),
    ('Ranches', 'Ранчо', 'ranches-sale', 'Ranches and livestock farms', 'Ранча и животновъдни ферми', 2),
    ('Equestrian Properties', 'Конни бази', 'equestrian-properties', 'Horse farms and stables', 'Конни бази и конюшни', 3),
    ('Wineries', 'Винарни', 'wineries-sale', 'Wineries and wine estates', 'Винарни и винени имения', 4),
    ('Olive Groves', 'Маслинови градини', 'olive-groves', 'Olive groves and oil production', 'Маслинови градини и производство', 5),
    ('Greenhouses', 'Оранжерии', 'greenhouses-sale', 'Commercial greenhouses', 'Търговски оранжерии', 6),
    ('Fish Farms', 'Рибарници', 'fish-farms', 'Fish farms and aquaculture', 'Рибовъдни стопанства', 7),
    ('Hunting Grounds', 'Ловни терени', 'hunting-grounds', 'Hunting estates and reserves', 'Ловни имения и резервати', 8),
    ('Beekeeping Properties', 'Пчеларски имоти', 'beekeeping-properties', 'Properties for beekeeping', 'Имоти за пчеларство', 9)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'rural-agricultural');

-- FORECLOSURES & AUCTIONS
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'foreclosures-auctions'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Bank Foreclosures', 'Банкови имоти', 'bank-foreclosures', 'Bank-owned properties', 'Имоти собственост на банки', 1),
    ('Court Auctions', 'Съдебни търгове', 'court-auctions', 'Properties at court auction', 'Имоти на съдебен търг', 2),
    ('Private Bailiff Sales', 'ЧСИ продажби', 'private-bailiff-sales', 'Private bailiff property sales', 'Продажби от частен съдебен изпълнител', 3),
    ('NRA Auctions', 'Търгове на НАП', 'nra-auctions', 'Tax authority auctions', 'Търгове на Националната агенция по приходите', 4),
    ('Municipal Auctions', 'Общински търгове', 'municipal-auctions', 'Municipal property auctions', 'Общински имотни търгове', 5),
    ('Distressed Sales', 'Имоти в несъстоятелност', 'distressed-sales', 'Bankruptcy and distressed sales', 'Продажби при несъстоятелност', 6),
    ('Short Sales', 'Кратки продажби', 'short-sales', 'Below mortgage value sales', 'Продажби под стойността на ипотеката', 7)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'foreclosures-auctions');
;
