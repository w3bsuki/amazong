-- =====================================================
-- L3 Categories for Tool Accessories & Parts
-- =====================================================

-- Drill Bits
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'HSS Drill Bits', 'HSS свредла', 'bits-hss', id, '⚙️', 1 FROM categories WHERE slug = 'accessories-drill-bits'
UNION ALL
SELECT gen_random_uuid(), 'Carbide Drill Bits', 'Карбидни свредла', 'bits-carbide', id, '💎', 2 FROM categories WHERE slug = 'accessories-drill-bits'
UNION ALL
SELECT gen_random_uuid(), 'Masonry Drill Bits', 'Свредла за бетон', 'bits-masonry', id, '🧱', 3 FROM categories WHERE slug = 'accessories-drill-bits'
UNION ALL
SELECT gen_random_uuid(), 'Cobalt Drill Bits', 'Кобалтови свредла', 'bits-cobalt', id, '⭐', 4 FROM categories WHERE slug = 'accessories-drill-bits'
UNION ALL
SELECT gen_random_uuid(), 'Step Drill Bits', 'Стъпаловидни свредла', 'bits-step', id, '📊', 5 FROM categories WHERE slug = 'accessories-drill-bits'
UNION ALL
SELECT gen_random_uuid(), 'Spade Bits', 'Плоски свредла за дърво', 'bits-spade', id, '🪵', 6 FROM categories WHERE slug = 'accessories-drill-bits'
UNION ALL
SELECT gen_random_uuid(), 'Forstner Bits', 'Форстнер свредла', 'bits-forstner', id, '⭕', 7 FROM categories WHERE slug = 'accessories-drill-bits';

-- Saw Blades
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Circular Saw Blades', 'Циркулярни ножове', 'blades-circular', id, '⭕', 1 FROM categories WHERE slug = 'accessories-saw-blades'
UNION ALL
SELECT gen_random_uuid(), 'Reciprocating Saw Blades', 'Саблени ножове', 'blades-reciprocating', id, '↔️', 2 FROM categories WHERE slug = 'accessories-saw-blades'
UNION ALL
SELECT gen_random_uuid(), 'Jigsaw Blades', 'Прободни ножове', 'blades-jigsaw', id, '📈', 3 FROM categories WHERE slug = 'accessories-saw-blades'
UNION ALL
SELECT gen_random_uuid(), 'Band Saw Blades', 'Банциг ножове', 'blades-band', id, '🔄', 4 FROM categories WHERE slug = 'accessories-saw-blades'
UNION ALL
SELECT gen_random_uuid(), 'Miter Saw Blades', 'Ножове за герунг', 'blades-miter', id, '📐', 5 FROM categories WHERE slug = 'accessories-saw-blades'
UNION ALL
SELECT gen_random_uuid(), 'Table Saw Blades', 'Ножове за циркуляр', 'blades-table', id, '🏭', 6 FROM categories WHERE slug = 'accessories-saw-blades';

-- Batteries & Chargers
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), '12V Batteries', '12V батерии', 'batteries-12v', id, '🔋', 1 FROM categories WHERE slug = 'accessories-batteries'
UNION ALL
SELECT gen_random_uuid(), '18V Batteries', '18V батерии', 'batteries-18v', id, '🔋', 2 FROM categories WHERE slug = 'accessories-batteries'
UNION ALL
SELECT gen_random_uuid(), '20V Batteries', '20V батерии', 'batteries-20v', id, '🔋', 3 FROM categories WHERE slug = 'accessories-batteries'
UNION ALL
SELECT gen_random_uuid(), '40V+ Batteries', '40V+ батерии', 'batteries-40v', id, '💪', 4 FROM categories WHERE slug = 'accessories-batteries'
UNION ALL
SELECT gen_random_uuid(), 'Battery Chargers', 'Зарядни за батерии', 'batteries-chargers', id, '🔌', 5 FROM categories WHERE slug = 'accessories-batteries';

-- =====================================================
-- L3 Categories for Cleaning Equipment
-- =====================================================

-- Shop Vacuums
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Wet/Dry Vacuums', 'Прахосмукачки мокро/сухо', 'vacuum-wet-dry', id, '💧', 1 FROM categories WHERE slug = 'cleaning-shop-vacuums'
UNION ALL
SELECT gen_random_uuid(), 'Dust Extractors', 'Прахоуловители', 'vacuum-dust-extractor', id, '💨', 2 FROM categories WHERE slug = 'cleaning-shop-vacuums'
UNION ALL
SELECT gen_random_uuid(), 'Industrial Vacuums', 'Индустриални прахосмукачки', 'vacuum-industrial', id, '🏭', 3 FROM categories WHERE slug = 'cleaning-shop-vacuums'
UNION ALL
SELECT gen_random_uuid(), 'Backpack Vacuums', 'Гръбни прахосмукачки', 'vacuum-backpack', id, '🎒', 4 FROM categories WHERE slug = 'cleaning-shop-vacuums';

-- =====================================================
-- L3 Categories for Generators
-- =====================================================

-- Portable Generators
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Gas Generators 2000-4000W', 'Бензинови 2000-4000W', 'generator-gas-small', id, '⛽', 1 FROM categories WHERE slug = 'generators-portable'
UNION ALL
SELECT gen_random_uuid(), 'Gas Generators 4000-8000W', 'Бензинови 4000-8000W', 'generator-gas-medium', id, '⛽', 2 FROM categories WHERE slug = 'generators-portable'
UNION ALL
SELECT gen_random_uuid(), 'Gas Generators 8000W+', 'Бензинови 8000W+', 'generator-gas-large', id, '💪', 3 FROM categories WHERE slug = 'generators-portable'
UNION ALL
SELECT gen_random_uuid(), 'Diesel Generators', 'Дизелови генератори', 'generator-diesel', id, '🛢️', 4 FROM categories WHERE slug = 'generators-portable'
UNION ALL
SELECT gen_random_uuid(), 'Dual Fuel Generators', 'Двугоривни генератори', 'generator-dual-fuel', id, '⛽', 5 FROM categories WHERE slug = 'generators-portable';

-- =====================================================
-- L3 Categories for Construction & Masonry
-- =====================================================

-- Trowels & Floats
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Brick Trowels', 'Зидарски мистрии', 'trowels-brick', id, '🧱', 1 FROM categories WHERE slug = 'tools-masonry-trowels'
UNION ALL
SELECT gen_random_uuid(), 'Finishing Trowels', 'Шпакловъчни мистрии', 'trowels-finishing', id, '✨', 2 FROM categories WHERE slug = 'tools-masonry-trowels'
UNION ALL
SELECT gen_random_uuid(), 'Margin Trowels', 'Малки мистрии', 'trowels-margin', id, '📏', 3 FROM categories WHERE slug = 'tools-masonry-trowels'
UNION ALL
SELECT gen_random_uuid(), 'Floats', 'Маламашки', 'trowels-floats', id, '📦', 4 FROM categories WHERE slug = 'tools-masonry-trowels'
UNION ALL
SELECT gen_random_uuid(), 'Notched Trowels', 'Назъбени шпакли', 'trowels-notched', id, '〰️', 5 FROM categories WHERE slug = 'tools-masonry-trowels'
ON CONFLICT (slug) DO NOTHING;;
