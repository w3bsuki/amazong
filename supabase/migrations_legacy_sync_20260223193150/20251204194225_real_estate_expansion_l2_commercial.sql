
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 2D: L2 CATEGORIES FOR COMMERCIAL
-- Based on Bulgarian commercial real estate market (imot.bg, address.bg)
-- ============================================================================

-- Commercial Sales (existing parent: aced61f5-67c0-4cd0-8c91-c10b653bc1b9)
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT * FROM (VALUES
    -- Office Properties
    (gen_random_uuid(), 'Offices for Sale', 'Офиси продава', 'offices-commercial-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Office spaces for sale', 'Офис площи за продажба', 1),
    
    (gen_random_uuid(), 'Office Buildings', 'Офис сгради', 'office-buildings-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Entire office buildings for sale', 'Цели офис сгради за продажба', 2),
    
    (gen_random_uuid(), 'Coworking Spaces', 'Коуъркинг пространства', 'coworking-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Coworking and shared office spaces', 'Коуъркинг и споделени офис пространства', 3),
    
    -- Retail Properties
    (gen_random_uuid(), 'Retail Shops', 'Магазини', 'retail-shops-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Retail shops and stores for sale', 'Магазини и търговски обекти за продажба', 4),
    
    (gen_random_uuid(), 'Shopping Centers', 'Търговски центрове', 'shopping-centers-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Shopping malls and centers for sale', 'Молове и търговски центрове за продажба', 5),
    
    (gen_random_uuid(), 'Showrooms', 'Шоуруми', 'showrooms-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Showroom and exhibition spaces', 'Шоуруми и изложбени зали', 6),
    
    (gen_random_uuid(), 'Kiosks & Stands', 'Павилиони и сергии', 'kiosks-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Kiosks and market stands', 'Павилиони, сергии и щандове', 7),
    
    -- Industrial & Logistics
    (gen_random_uuid(), 'Warehouses', 'Складове', 'warehouses-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Warehouse and storage facilities', 'Складове и складови бази', 8),
    
    (gen_random_uuid(), 'Industrial Buildings', 'Промишлени сгради', 'industrial-buildings-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Industrial buildings and facilities', 'Промишлени сгради и съоръжения', 9),
    
    (gen_random_uuid(), 'Factories', 'Фабрики', 'factories-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Factory buildings and production facilities', 'Фабрики и производствени бази', 10),
    
    (gen_random_uuid(), 'Logistics Centers', 'Логистични центрове', 'logistics-centers-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Logistics and distribution centers', 'Логистични и дистрибуционни центрове', 11),
    
    -- Hospitality & Services
    (gen_random_uuid(), 'Restaurants & Cafes', 'Ресторанти и кафенета', 'restaurants-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Restaurant and cafe spaces', 'Ресторантски и кафе площи', 12),
    
    (gen_random_uuid(), 'Hotels', 'Хотели', 'hotels-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Hotels and hospitality properties', 'Хотели и хотелиерски имоти', 13),
    
    (gen_random_uuid(), 'Guest Houses', 'Къщи за гости', 'guesthouses-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Guest houses and B&Bs', 'Къщи за гости и пансиони', 14),
    
    (gen_random_uuid(), 'Motels', 'Мотели', 'motels-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Motels and roadside accommodations', 'Мотели и крайпътни обекти', 15),
    
    -- Specialty Commercial
    (gen_random_uuid(), 'Gas Stations', 'Бензиностанции', 'gas-stations-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Gas stations and fuel facilities', 'Бензиностанции и горивни бази', 16),
    
    (gen_random_uuid(), 'Car Washes', 'Автомивки', 'car-washes-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Car wash facilities', 'Автомивки и автосервизи', 17),
    
    (gen_random_uuid(), 'Auto Service Centers', 'Автосервизи', 'auto-service-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Auto service and repair centers', 'Автосервизи и ремонтни работилници', 18),
    
    (gen_random_uuid(), 'Medical Offices', 'Медицински кабинети', 'medical-offices-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Medical and dental offices', 'Медицински и зъболекарски кабинети', 19),
    
    (gen_random_uuid(), 'Clinics', 'Клиники', 'clinics-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Medical clinics and healthcare facilities', 'Медицински клиники и здравни заведения', 20),
    
    (gen_random_uuid(), 'Gyms & Fitness Centers', 'Фитнес центрове', 'gyms-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Gyms and fitness centers', 'Фитнес зали и спортни центрове', 21),
    
    (gen_random_uuid(), 'Beauty Salons', 'Козметични салони', 'beauty-salons-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Beauty and hair salons', 'Козметични и фризьорски салони', 22),
    
    (gen_random_uuid(), 'Educational Facilities', 'Образователни обекти', 'educational-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Schools, training centers, kindergartens', 'Училища, учебни центрове, детски градини', 23),
    
    (gen_random_uuid(), 'Mixed-Use Buildings', 'Многофункционални сгради', 'mixed-use-sale',
     'aced61f5-67c0-4cd0-8c91-c10b653bc1b9'::uuid,
     'Buildings with mixed commercial/residential use', 'Сгради със смесено ползване', 24)
) AS new_cats(id, name, name_bg, slug, parent_id, description, description_bg, display_order)
WHERE NOT EXISTS (
    SELECT 1 FROM categories c WHERE c.slug = new_cats.slug
);
;
