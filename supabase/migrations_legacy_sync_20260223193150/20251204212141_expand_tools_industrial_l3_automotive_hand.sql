-- =====================================================
-- L3 Categories for Automotive Tools
-- =====================================================

-- Diagnostic Tools
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'OBD2 Scanners', 'OBD2 скенери', 'diagnostic-obd2', id, '🔍', 1 FROM categories WHERE slug = 'automotive-diagnostic'
UNION ALL
SELECT gen_random_uuid(), 'Professional Scanners', 'Професионални скенери', 'diagnostic-professional', id, '💻', 2 FROM categories WHERE slug = 'automotive-diagnostic'
UNION ALL
SELECT gen_random_uuid(), 'Code Readers', 'Четци на кодове', 'diagnostic-code-readers', id, '📖', 3 FROM categories WHERE slug = 'automotive-diagnostic'
UNION ALL
SELECT gen_random_uuid(), 'Battery Testers', 'Тестери за акумулатори', 'diagnostic-battery', id, '🔋', 4 FROM categories WHERE slug = 'automotive-diagnostic'
UNION ALL
SELECT gen_random_uuid(), 'Compression Testers', 'Компресомери', 'diagnostic-compression', id, '📊', 5 FROM categories WHERE slug = 'automotive-diagnostic';

-- Jacks & Lifts
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Floor Jacks', 'Подови крикове', 'jacks-floor', id, '🚗', 1 FROM categories WHERE slug = 'automotive-jacks'
UNION ALL
SELECT gen_random_uuid(), 'Bottle Jacks', 'Бутилкови крикове', 'jacks-bottle', id, '🍾', 2 FROM categories WHERE slug = 'automotive-jacks'
UNION ALL
SELECT gen_random_uuid(), 'Scissor Jacks', 'Ромбични крикове', 'jacks-scissor', id, '✂️', 3 FROM categories WHERE slug = 'automotive-jacks'
UNION ALL
SELECT gen_random_uuid(), 'Transmission Jacks', 'Крикове за скоростни кутии', 'jacks-transmission', id, '⚙️', 4 FROM categories WHERE slug = 'automotive-jacks'
UNION ALL
SELECT gen_random_uuid(), 'Car Lifts', 'Автомобилни подемници', 'jacks-lifts', id, '🏗️', 5 FROM categories WHERE slug = 'automotive-jacks';

-- Engine Tools
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Engine Hoists', 'Кранове за двигатели', 'engine-hoists', id, '🏗️', 1 FROM categories WHERE slug = 'automotive-engine'
UNION ALL
SELECT gen_random_uuid(), 'Timing Tools', 'Инструменти за ремък', 'engine-timing', id, '⏱️', 2 FROM categories WHERE slug = 'automotive-engine'
UNION ALL
SELECT gen_random_uuid(), 'Valve Spring Compressors', 'Пресьори за клапани', 'engine-valve', id, '🔧', 3 FROM categories WHERE slug = 'automotive-engine'
UNION ALL
SELECT gen_random_uuid(), 'Piston Ring Tools', 'Инструменти за сегменти', 'engine-piston', id, '⭕', 4 FROM categories WHERE slug = 'automotive-engine';

-- =====================================================
-- L3 Categories for Hand Tools
-- =====================================================

-- Socket Sets
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), '1/4" Socket Sets', '1/4" комплекти вложки', 'sockets-quarter', id, '🔧', 1 FROM categories WHERE slug = 'handtools-sockets'
UNION ALL
SELECT gen_random_uuid(), '3/8" Socket Sets', '3/8" комплекти вложки', 'sockets-three-eighth', id, '🔧', 2 FROM categories WHERE slug = 'handtools-sockets'
UNION ALL
SELECT gen_random_uuid(), '1/2" Socket Sets', '1/2" комплекти вложки', 'sockets-half', id, '🔧', 3 FROM categories WHERE slug = 'handtools-sockets'
UNION ALL
SELECT gen_random_uuid(), 'Impact Socket Sets', 'Ударни вложки', 'sockets-impact', id, '💥', 4 FROM categories WHERE slug = 'handtools-sockets'
UNION ALL
SELECT gen_random_uuid(), 'Torx & Specialty Sockets', 'Торкс и специални вложки', 'sockets-torx', id, '⭐', 5 FROM categories WHERE slug = 'handtools-sockets';

-- Wrenches & Spanners
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Combination Wrenches', 'Звездогаечни ключове', 'wrenches-combination', id, '🔧', 1 FROM categories WHERE slug = 'handtools-wrenches'
UNION ALL
SELECT gen_random_uuid(), 'Adjustable Wrenches', 'Френски ключове', 'wrenches-adjustable', id, '🔧', 2 FROM categories WHERE slug = 'handtools-wrenches'
UNION ALL
SELECT gen_random_uuid(), 'Ratcheting Wrenches', 'Тресчоточни ключове', 'wrenches-ratcheting', id, '🔄', 3 FROM categories WHERE slug = 'handtools-wrenches'
UNION ALL
SELECT gen_random_uuid(), 'Torque Wrenches', 'Динамометрични ключове', 'wrenches-torque', id, '📏', 4 FROM categories WHERE slug = 'handtools-wrenches'
UNION ALL
SELECT gen_random_uuid(), 'Flare Nut Wrenches', 'Накидни ключове', 'wrenches-flare', id, '🔩', 5 FROM categories WHERE slug = 'handtools-wrenches';

-- Pliers
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Combination Pliers', 'Комбинирани клещи', 'pliers-combination', id, '🔧', 1 FROM categories WHERE slug = 'handtools-pliers'
UNION ALL
SELECT gen_random_uuid(), 'Needle Nose Pliers', 'Клещи с дълъг връх', 'pliers-needle-nose', id, '📍', 2 FROM categories WHERE slug = 'handtools-pliers'
UNION ALL
SELECT gen_random_uuid(), 'Locking Pliers', 'Грип клещи', 'pliers-locking', id, '🔒', 3 FROM categories WHERE slug = 'handtools-pliers'
UNION ALL
SELECT gen_random_uuid(), 'Cutting Pliers', 'Режещи клещи', 'pliers-cutting', id, '✂️', 4 FROM categories WHERE slug = 'handtools-pliers'
UNION ALL
SELECT gen_random_uuid(), 'Slip Joint Pliers', 'Водопроводни клещи', 'pliers-slip-joint', id, '💧', 5 FROM categories WHERE slug = 'handtools-pliers';

-- Screwdrivers
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Phillips Screwdrivers', 'Кръстати отвертки', 'screwdrivers-phillips', id, '✖️', 1 FROM categories WHERE slug = 'handtools-screwdrivers'
UNION ALL
SELECT gen_random_uuid(), 'Flathead Screwdrivers', 'Плоски отвертки', 'screwdrivers-flathead', id, '➖', 2 FROM categories WHERE slug = 'handtools-screwdrivers'
UNION ALL
SELECT gen_random_uuid(), 'Torx Screwdrivers', 'Торкс отвертки', 'screwdrivers-torx', id, '⭐', 3 FROM categories WHERE slug = 'handtools-screwdrivers'
UNION ALL
SELECT gen_random_uuid(), 'Precision Screwdrivers', 'Прецизни отвертки', 'screwdrivers-precision', id, '🔬', 4 FROM categories WHERE slug = 'handtools-screwdrivers'
UNION ALL
SELECT gen_random_uuid(), 'Screwdriver Sets', 'Комплекти отвертки', 'screwdrivers-sets', id, '🧰', 5 FROM categories WHERE slug = 'handtools-screwdrivers'
ON CONFLICT (slug) DO NOTHING;;
