
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 3D: L3 CATEGORIES FOR LAND & VACATION
-- ============================================================================

-- L3 under Building Plots
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'building-plots'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Small Plots', 'Малки парцели', 'small-building-plots', 'Plots under 500 sqm', 'Парцели под 500 кв.м', 1),
    ('Medium Plots', 'Средни парцели', 'medium-building-plots', 'Plots 500-2000 sqm', 'Парцели 500-2000 кв.м', 2),
    ('Large Plots', 'Големи парцели', 'large-building-plots', 'Plots over 2000 sqm', 'Парцели над 2000 кв.м', 3),
    ('Plots with Permit', 'Парцели с разрешително', 'plots-with-permit', 'Plots with building permit', 'Парцели с разрешително за строеж', 4),
    ('Plots with Project', 'Парцели с проект', 'plots-with-project', 'Plots with approved project', 'Парцели с одобрен проект', 5),
    ('Corner Plots', 'Ъглови парцели', 'corner-plots', 'Corner location plots', 'Ъглови парцели', 6),
    ('Flat Plots', 'Равни парцели', 'flat-plots', 'Level terrain plots', 'Парцели с равен терен', 7)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'building-plots');

-- L3 under Agricultural Land
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'agricultural-land'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Irrigated Land', 'Напояема земя', 'irrigated-land', 'Land with irrigation', 'Земя с напояване', 1),
    ('Rain-Fed Land', 'Богарска земя', 'rain-fed-land', 'Non-irrigated arable land', 'Богарска обработваема земя', 2),
    ('Organic Farmland', 'Биоземя', 'organic-farmland', 'Certified organic land', 'Сертифицирана биоземя', 3),
    ('Consolidated Parcels', 'Окрупнени масиви', 'consolidated-parcels', 'Large consolidated areas', 'Големи окрупнени масиви', 4),
    ('Fertile Black Earth', 'Плодородна черноземна', 'black-earth-land', 'Black soil fertile land', 'Черноземна плодородна земя', 5),
    ('Subsidized Land', 'Субсидирана земя', 'subsidized-land', 'Land eligible for EU subsidies', 'Земя с право на субсидии', 6)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'agricultural-land');

-- L3 under Beach Properties (Vacation)
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'beach-properties'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Beachfront Apartments', 'Апартаменти на първа линия', 'beachfront-apartments', 'First line beach apartments', 'Апартаменти на първа линия', 1),
    ('Sea View Apartments', 'Апартаменти с морска гледка', 'seaview-apartments', 'Apartments with sea view', 'Апартаменти с изглед към морето', 2),
    ('Beach Houses', 'Морски къщи', 'beach-houses-vac', 'Houses near the beach', 'Къщи близо до плажа', 3),
    ('Beach Studios', 'Морски студия', 'beach-studios', 'Studios near the beach', 'Студия близо до морето', 4),
    ('Resort Apartments', 'Курортни апартаменти', 'resort-apartments', 'Apartments in resorts', 'Апартаменти в курорти', 5),
    ('Beach Penthouses', 'Морски пентхауси', 'beach-penthouses', 'Penthouses with sea view', 'Пентхауси с морска гледка', 6)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'beach-properties');

-- L3 under Mountain Chalets
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'mountain-chalets'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Ski-In Ski-Out', 'Ски-ин ски-аут', 'ski-in-ski-out', 'Direct ski slope access', 'Директен достъп до пистите', 1),
    ('Mountain Apartments', 'Планински апартаменти', 'mountain-apartments', 'Apartments in ski resorts', 'Апартаменти в ски курорти', 2),
    ('Traditional Chalets', 'Традиционни вили', 'traditional-chalets', 'Traditional mountain chalets', 'Традиционни планински вили', 3),
    ('Modern Mountain Homes', 'Модерни планински къщи', 'modern-mountain-homes', 'Contemporary mountain properties', 'Съвременни планински имоти', 4),
    ('Year-Round Properties', 'Целогодишни имоти', 'year-round-mountain', 'Suitable for year-round living', 'Подходящи за целогодишно живеене', 5),
    ('Mountain Studios', 'Планински студия', 'mountain-studios', 'Studios in mountain resorts', 'Студия в планински курорти', 6)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'mountain-chalets');

-- L3 under Luxury Villas
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'luxury-villas'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Ultra-Luxury Villas', 'Ултра луксозни вили', 'ultra-luxury-villas', 'Top tier luxury villas', 'Вили от най-висок клас', 1),
    ('Golf Course Villas', 'Вили до голф игрище', 'golf-villas', 'Villas on golf courses', 'Вили до голф игрища', 2),
    ('Private Island Villas', 'Вили на остров', 'island-villas', 'Exclusive island properties', 'Ексклузивни островни имоти', 3),
    ('Vineyard Estates', 'Лозови имения', 'vineyard-estates', 'Estates with vineyards', 'Имения с лозя', 4),
    ('Branded Residences', 'Брандирани резиденции', 'branded-residences', 'Hotel branded residences', 'Резиденции с хотелски бранд', 5),
    ('Eco-Luxury Villas', 'Еко луксозни вили', 'eco-luxury-villas', 'Sustainable luxury villas', 'Устойчиви луксозни вили', 6)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'luxury-villas');
;
