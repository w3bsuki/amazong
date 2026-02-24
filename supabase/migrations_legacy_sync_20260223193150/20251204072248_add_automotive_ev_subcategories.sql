
-- ============================================
-- ADD L2 SUBCATEGORIES FOR AUTOMOTIVE EV & SERVICES
-- ============================================

-- Electric Vehicles L2 (Tesla, Rivian, BMW i, etc.)
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    '9d898c0f-8660-4145-8314-58cb4791c7e0'::uuid, -- electric-vehicles
    display_order
FROM (VALUES
    ('Electric Cars', 'ev-cars', 'Електромобили', 'Tesla, BMW i, Mercedes EQ, etc.', 1),
    ('Electric SUVs', 'ev-suvs', 'Електрически джипове', 'Electric SUVs and crossovers', 2),
    ('Electric Trucks', 'ev-trucks', 'Електрически камиони', 'Rivian, Cybertruck, etc.', 3),
    ('Electric Vans', 'ev-vans', 'Електрически ванове', 'Commercial EVs', 4),
    ('Hybrid Vehicles', 'hybrid-vehicles', 'Хибриди', 'Plug-in and standard hybrids', 5)
) AS t(name, slug, name_bg, description, display_order);

-- E-Scooters L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    '303e2f71-2fe9-469a-9888-60d075cd211f'::uuid, -- e-scooters
    display_order
FROM (VALUES
    ('Commuter Scooters', 'escooter-commuter', 'Градски тротинетки', 'Daily commute scooters', 1),
    ('Off-Road Scooters', 'escooter-offroad', 'Офроуд тротинетки', 'All-terrain e-scooters', 2),
    ('Performance Scooters', 'escooter-performance', 'Спортни тротинетки', 'High-speed scooters', 3),
    ('Kids E-Scooters', 'escooter-kids', 'Детски тротинетки', 'E-scooters for children', 4),
    ('E-Scooter Parts', 'escooter-parts', 'Части за тротинетки', 'Batteries, motors, wheels', 5),
    ('E-Scooter Accessories', 'escooter-accessories', 'Аксесоари за тротинетки', 'Bags, locks, lights', 6)
) AS t(name, slug, name_bg, description, display_order);

-- E-Bikes L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    'f21bf634-adf4-4c8e-bb7d-67e6e5980c19'::uuid, -- e-bikes-cat
    display_order
FROM (VALUES
    ('City E-Bikes', 'ebike-city', 'Градски електро колела', 'Urban commuter e-bikes', 1),
    ('Mountain E-Bikes', 'ebike-mountain', 'Планински електро колела', 'Electric MTBs', 2),
    ('Road E-Bikes', 'ebike-road', 'Шосейни електро колела', 'Electric road bikes', 3),
    ('Folding E-Bikes', 'ebike-folding', 'Сгъваеми електро колела', 'Compact folding e-bikes', 4),
    ('Cargo E-Bikes', 'ebike-cargo', 'Товарни електро колела', 'E-bikes for cargo', 5),
    ('E-Bike Conversion Kits', 'ebike-conversion', 'Комплекти за конверсия', 'Convert your bike to e-bike', 6),
    ('E-Bike Batteries', 'ebike-batteries', 'Батерии за електро колела', 'Replacement batteries', 7),
    ('E-Bike Accessories', 'ebike-accessories', 'Аксесоари за електро колела', 'Bags, racks, lights', 8)
) AS t(name, slug, name_bg, description, display_order);

-- EV Chargers L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    '1e551c28-e330-41c5-a8b3-afa09efdfb51'::uuid, -- ev-chargers
    display_order
FROM (VALUES
    ('Home Chargers', 'ev-charger-home', 'Домашни зарядни', 'Level 1 & 2 home chargers', 1),
    ('Portable Chargers', 'ev-charger-portable', 'Преносими зарядни', 'Mobile EV chargers', 2),
    ('Commercial Chargers', 'ev-charger-commercial', 'Търговски зарядни', 'Level 3 DC fast chargers', 3),
    ('Charging Cables', 'ev-charging-cables', 'Кабели за зареждане', 'Type 2, CCS, CHAdeMO cables', 4),
    ('Charging Adapters', 'ev-charging-adapters', 'Адаптери за зареждане', 'Connector adapters', 5),
    ('Solar Charging', 'ev-solar-charging', 'Соларно зареждане', 'Solar panels for EVs', 6)
) AS t(name, slug, name_bg, description, display_order);

-- EV Parts & Accessories L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    'ff7d607f-91de-445c-9ef0-07431e1c227d'::uuid, -- ev-parts
    display_order
FROM (VALUES
    ('EV Batteries', 'ev-batteries', 'Батерии за EV', 'Replacement and upgrade batteries', 1),
    ('EV Motors', 'ev-motors', 'Мотори за EV', 'Electric motors and controllers', 2),
    ('EV Electronics', 'ev-electronics', 'Електроника за EV', 'BMS, inverters, controllers', 3),
    ('EV Tires', 'ev-tires', 'Гуми за EV', 'Low rolling resistance tires', 4),
    ('EV Cooling', 'ev-cooling', 'Охлаждане за EV', 'Battery and motor cooling', 5),
    ('EV Interior', 'ev-interior-acc', 'Интериор за EV', 'Mats, covers, organizers', 6),
    ('EV Exterior', 'ev-exterior-acc', 'Екстериор за EV', 'Wraps, aero kits, lights', 7)
) AS t(name, slug, name_bg, description, display_order);

-- Auto Services L2
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    '047372fb-fe43-4277-80b0-209df4306007'::uuid, -- auto-services
    display_order
FROM (VALUES
    ('Repair & Maintenance', 'auto-repair', 'Ремонт и поддръжка', 'Mechanics and service centers', 1),
    ('Detailing & Car Wash', 'auto-detailing', 'Детейлинг и автомивка', 'Professional cleaning', 2),
    ('Inspection & Diagnostics', 'auto-inspection', 'Технически преглед', 'Vehicle inspection services', 3),
    ('Towing & Recovery', 'auto-towing', 'Пътна помощ', 'Roadside assistance', 4),
    ('Tuning & Performance', 'auto-tuning-service', 'Тунинг услуги', 'Performance upgrades', 5),
    ('Body Work & Paint', 'auto-bodywork', 'Бояджийски услуги', 'Collision repair, paint', 6),
    ('Glass & Windows', 'auto-glass', 'Авто стъкла', 'Windshield replacement', 7),
    ('Tire Services', 'auto-tire-service', 'Гумаджийница', 'Mounting, balancing, storage', 8),
    ('EV Services', 'auto-ev-service', 'Услуги за EV', 'Electric vehicle specialists', 9)
) AS t(name, slug, name_bg, description, display_order);
;
