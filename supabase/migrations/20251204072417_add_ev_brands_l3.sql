
-- ============================================
-- ADD L3 EV BRANDS UNDER EACH EV TYPE
-- ============================================

-- Electric Cars L3 (Brands)
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    '85e31087-fe8a-4779-8a48-8996aa209516'::uuid, -- ev-cars
    display_order
FROM (VALUES
    ('Tesla', 'ev-tesla', 'Тесла', 'Model 3, Model S, etc.', 1),
    ('BMW i', 'ev-bmw-i', 'БМВ i', 'i4, iX, etc.', 2),
    ('Mercedes EQ', 'ev-mercedes-eq', 'Мерцедес EQ', 'EQE, EQS, etc.', 3),
    ('Audi e-tron', 'ev-audi-etron', 'Ауди e-tron', 'e-tron GT, Q4 e-tron', 4),
    ('Porsche', 'ev-porsche', 'Порше', 'Taycan', 5),
    ('Polestar', 'ev-polestar', 'Полестар', 'Polestar 2, 3', 6),
    ('Lucid', 'ev-lucid', 'Луцид', 'Lucid Air', 7),
    ('Rivian', 'ev-rivian-car', 'Ривиан', 'R1T, R1S', 8),
    ('VW ID', 'ev-vw-id', 'ВВ ID', 'ID.3, ID.4, ID.7', 9),
    ('Hyundai Ioniq', 'ev-hyundai-ioniq', 'Хюндай Ioniq', 'Ioniq 5, 6', 10),
    ('Kia EV', 'ev-kia', 'Киа EV', 'EV6, EV9', 11),
    ('BYD', 'ev-byd', 'БИД', 'Seal, Dolphin, Atto 3', 12),
    ('NIO', 'ev-nio', 'НИО', 'ET5, ET7, ES6', 13),
    ('Other EV Brands', 'ev-other-brands', 'Други марки', 'Other electric car brands', 14)
) AS t(name, slug, name_bg, description, display_order);

-- Electric SUVs L3 (Models/Brands)
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    'ce37dcd3-5a63-49e4-af1b-0d48f26d70f1'::uuid, -- ev-suvs
    display_order
FROM (VALUES
    ('Tesla Model X/Y', 'ev-suv-tesla', 'Тесла Model X/Y', 'Tesla SUVs', 1),
    ('BMW iX', 'ev-suv-bmw-ix', 'БМВ iX', 'BMW electric SUVs', 2),
    ('Mercedes EQB/EQE SUV', 'ev-suv-mercedes', 'Мерцедес EQB/EQE SUV', 'Mercedes EV SUVs', 3),
    ('Audi Q4/Q8 e-tron', 'ev-suv-audi', 'Ауди Q4/Q8 e-tron', 'Audi electric SUVs', 4),
    ('Rivian R1S', 'ev-suv-rivian', 'Ривиан R1S', 'Rivian SUV', 5),
    ('VW ID.4/ID.5', 'ev-suv-vw', 'ВВ ID.4/ID.5', 'VW electric SUVs', 6),
    ('Volvo EX90/XC40 Recharge', 'ev-suv-volvo', 'Волво EX90/XC40', 'Volvo electric SUVs', 7),
    ('Ford Mustang Mach-E', 'ev-suv-ford', 'Форд Mustang Mach-E', 'Ford electric SUV', 8),
    ('Other EV SUVs', 'ev-suv-other', 'Други EV джипове', 'Other electric SUVs', 9)
) AS t(name, slug, name_bg, description, display_order);

-- Electric Trucks L3
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    'da3a3b93-18fd-41c1-aba2-fbb48bd97aa7'::uuid, -- ev-trucks
    display_order
FROM (VALUES
    ('Tesla Cybertruck', 'ev-truck-cybertruck', 'Тесла Cybertruck', 'Tesla Cybertruck', 1),
    ('Rivian R1T', 'ev-truck-rivian-r1t', 'Ривиан R1T', 'Rivian pickup truck', 2),
    ('Ford F-150 Lightning', 'ev-truck-f150', 'Форд F-150 Lightning', 'Ford electric pickup', 3),
    ('Chevrolet Silverado EV', 'ev-truck-silverado', 'Шевролет Silverado EV', 'Chevy electric pickup', 4),
    ('GMC Hummer EV', 'ev-truck-hummer', 'ДжиЕмСи Hummer EV', 'GMC electric truck', 5),
    ('RAM 1500 REV', 'ev-truck-ram', 'РАМ 1500 REV', 'RAM electric pickup', 6),
    ('Other EV Trucks', 'ev-truck-other', 'Други EV камиони', 'Other electric trucks', 7)
) AS t(name, slug, name_bg, description, display_order);

-- Electric Vans L3
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    'a1f91019-6676-4247-b2a8-392b9b7f0ae6'::uuid, -- ev-vans
    display_order
FROM (VALUES
    ('Mercedes eSprinter/eVito', 'ev-van-mercedes', 'Мерцедес eSprinter/eVito', 'Mercedes electric vans', 1),
    ('Ford E-Transit', 'ev-van-ford', 'Форд E-Transit', 'Ford electric van', 2),
    ('VW ID.Buzz', 'ev-van-vw-buzz', 'ВВ ID.Buzz', 'VW electric van/bus', 3),
    ('Rivian Commercial Van', 'ev-van-rivian', 'Ривиан Commercial Van', 'Rivian delivery van', 4),
    ('Canoo', 'ev-van-canoo', 'Kану', 'Canoo electric vehicles', 5),
    ('Other EV Vans', 'ev-van-other', 'Други EV ванове', 'Other electric vans', 6)
) AS t(name, slug, name_bg, description, display_order);

-- Hybrid Vehicles L3
INSERT INTO categories (name, slug, name_bg, description, parent_id, display_order)
SELECT name, slug, name_bg, description,
    'f2451ae4-9ce7-47b9-9859-20bca9090398'::uuid, -- hybrid-vehicles
    display_order
FROM (VALUES
    ('Plug-in Hybrids (PHEV)', 'hybrid-phev', 'Плъг-ин хибриди', 'Plug-in hybrid vehicles', 1),
    ('Self-Charging Hybrids (HEV)', 'hybrid-hev', 'Самозареждащи хибриди', 'Standard hybrid vehicles', 2),
    ('Toyota Hybrids', 'hybrid-toyota', 'Тойота хибриди', 'Prius, Camry Hybrid, etc.', 3),
    ('BMW Hybrids', 'hybrid-bmw', 'БМВ хибриди', 'BMW hybrid models', 4),
    ('Mercedes Hybrids', 'hybrid-mercedes', 'Мерцедес хибриди', 'Mercedes hybrid models', 5),
    ('Other Hybrids', 'hybrid-other', 'Други хибриди', 'Other hybrid vehicles', 6)
) AS t(name, slug, name_bg, description, display_order);
;
