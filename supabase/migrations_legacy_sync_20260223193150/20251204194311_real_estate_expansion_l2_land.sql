
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 2F: L2 FOR LAND
-- Land parent: 9df696ac-5885-4a79-af93-41fb1b977c4b
-- Based on Bulgarian land classification (imot.bg, NSI categories)
-- ============================================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT * FROM (VALUES
    -- Residential Land
    (gen_random_uuid(), 'Building Plots', 'Парцели за строеж', 'building-plots',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Regulated building plots with permits', 'Урегулирани парцели за строеж', 1),
    
    (gen_random_uuid(), 'Urban Plots', 'Градски парцели', 'urban-plots',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Plots in urban areas', 'Парцели в градски райони', 2),
    
    (gen_random_uuid(), 'Suburban Plots', 'Крайградски парцели', 'suburban-plots',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Plots in suburban areas', 'Парцели в крайградски райони', 3),
    
    (gen_random_uuid(), 'Village Plots', 'Селски парцели', 'village-plots',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Plots in villages and rural areas', 'Парцели в села и селски райони', 4),
    
    -- Agricultural Land
    (gen_random_uuid(), 'Agricultural Land', 'Земеделска земя', 'agricultural-land',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Farmland and agricultural plots', 'Земеделска земя и ниви', 5),
    
    (gen_random_uuid(), 'Arable Land', 'Обработваема земя', 'arable-land',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Arable farming land', 'Обработваема земеделска земя', 6),
    
    (gen_random_uuid(), 'Orchards', 'Овощни градини', 'orchards',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Orchards and fruit gardens', 'Овощни градини и насаждения', 7),
    
    (gen_random_uuid(), 'Vineyards', 'Лозя', 'vineyards',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Vineyards and grape growing land', 'Лозя и лозови насаждения', 8),
    
    (gen_random_uuid(), 'Pastures & Meadows', 'Пасища и ливади', 'pastures-meadows',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Pastures and meadow land', 'Пасища, ливади и мери', 9),
    
    -- Forest & Nature
    (gen_random_uuid(), 'Forest Land', 'Горски терени', 'forest-land',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Forest and woodland areas', 'Горски терени и гори', 10),
    
    -- Commercial Land
    (gen_random_uuid(), 'Commercial Land', 'Търговски терени', 'commercial-land',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Land zoned for commercial use', 'Терени за търговско строителство', 11),
    
    (gen_random_uuid(), 'Industrial Land', 'Промишлени терени', 'industrial-land',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Land zoned for industrial use', 'Терени за промишлено строителство', 12),
    
    -- Special Purpose Land
    (gen_random_uuid(), 'Recreation Land', 'Рекреационни терени', 'recreation-land',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Land for recreational use', 'Терени за отдих и рекреация', 13),
    
    (gen_random_uuid(), 'Seaside Plots', 'Морски парцели', 'seaside-plots',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Plots near the sea coast', 'Парцели близо до морето', 14),
    
    (gen_random_uuid(), 'Mountain Plots', 'Планински парцели', 'mountain-plots',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Plots in mountain areas', 'Парцели в планински райони', 15),
    
    (gen_random_uuid(), 'Lakeside Plots', 'Язовирни парцели', 'lakeside-plots',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Plots near lakes and dams', 'Парцели близо до язовири и езера', 16),
    
    -- Development Land
    (gen_random_uuid(), 'Development Projects', 'Проекти за развитие', 'development-projects',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Land with approved development projects', 'Терени с одобрени проекти', 17),
    
    (gen_random_uuid(), 'Unregulated Land', 'Нерегулирани терени', 'unregulated-land',
     '9df696ac-5885-4a79-af93-41fb1b977c4b'::uuid,
     'Land without regulation status', 'Терени без регулационен статут', 18)
) AS new_cats(id, name, name_bg, slug, parent_id, description, description_bg, display_order)
WHERE NOT EXISTS (
    SELECT 1 FROM categories c WHERE c.slug = new_cats.slug
);
;
