
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 3B: L3 CATEGORIES FOR HOUSE SALES
-- Deep subcategorization by house style, size, and features
-- ============================================================================

-- L3 under Detached Houses
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'detached-houses-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Single-Story Houses', 'Едноетажни къщи', 'single-story-houses', 'One level detached houses', 'Едноетажни самостоятелни къщи', 1),
    ('Two-Story Houses', 'Двуетажни къщи', 'two-story-houses', 'Two level detached houses', 'Двуетажни самостоятелни къщи', 2),
    ('Three-Story Houses', 'Триетажни къщи', 'three-story-houses', 'Three level detached houses', 'Триетажни самостоятелни къщи', 3),
    ('Split-Level Houses', 'Денивелирани къщи', 'split-level-houses', 'Split level design houses', 'Къщи с денивелация', 4),
    ('Pool Houses', 'Къщи с басейн', 'pool-houses', 'Houses with swimming pool', 'Къщи с плувен басейн', 5),
    ('Garden Houses', 'Къщи с градина', 'garden-detached', 'Houses with large gardens', 'Къщи с големи градини', 6),
    ('Garage Houses', 'Къщи с гараж', 'garage-houses', 'Houses with garage', 'Къщи с гараж', 7)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'detached-houses-sale');

-- L3 under Villas
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'villas-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Modern Villas', 'Модерни вили', 'modern-villas', 'Contemporary design villas', 'Съвременни дизайнерски вили', 1),
    ('Classic Villas', 'Класически вили', 'classic-villas', 'Traditional style villas', 'Традиционен стил вили', 2),
    ('Mediterranean Villas', 'Средиземноморски вили', 'mediterranean-villas', 'Mediterranean style villas', 'Средиземноморски стил вили', 3),
    ('Minimalist Villas', 'Минималистични вили', 'minimalist-villas', 'Minimalist design villas', 'Минималистичен дизайн вили', 4),
    ('Pool Villas', 'Вили с басейн', 'pool-villas', 'Villas with private pool', 'Вили с частен басейн', 5),
    ('Seaside Villas', 'Морски вили', 'seaside-villas', 'Villas near the sea', 'Вили близо до морето', 6),
    ('Mountain Villas', 'Планински вили', 'mountain-villas-sale', 'Villas in mountain areas', 'Вили в планината', 7),
    ('Smart Villas', 'Смарт вили', 'smart-villas', 'Villas with smart home technology', 'Вили със смарт технологии', 8)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'villas-sale');

-- L3 under Country Houses
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'country-houses-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Traditional Bulgarian Houses', 'Традиционни български къщи', 'traditional-bg-houses', 'Traditional Bulgarian architecture', 'Традиционна българска архитектура', 1),
    ('Revival Houses', 'Възрожденски къщи', 'revival-houses', 'National Revival period houses', 'Къщи от Възраждането', 2),
    ('Stone Houses', 'Каменни къщи', 'stone-houses', 'Stone construction houses', 'Къщи от камък', 3),
    ('Wooden Houses', 'Дървени къщи', 'wooden-houses', 'Wooden construction houses', 'Дървени къщи', 4),
    ('Renovated Village Houses', 'Ремонтирани селски къщи', 'renovated-village', 'Modernized village houses', 'Модернизирани селски къщи', 5),
    ('Fixer-Upper Houses', 'Къщи за ремонт', 'fixer-upper-houses', 'Houses requiring renovation', 'Къщи нуждаещи се от ремонт', 6),
    ('Eco Village Houses', 'Еко селски къщи', 'eco-village-houses', 'Eco-friendly village houses', 'Екологични селски къщи', 7)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'country-houses-sale');

-- L3 under Townhouses
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'townhouses-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Modern Townhouses', 'Модерни редови къщи', 'modern-townhouses', 'Contemporary townhouses', 'Съвременни редови къщи', 1),
    ('End-Unit Townhouses', 'Крайни редови къщи', 'end-unit-townhouses', 'End unit with extra windows', 'Крайни единици с допълнителни прозорци', 2),
    ('Multi-Level Townhouses', 'Многоетажни редови къщи', 'multilevel-townhouses', 'Multi-story townhouses', 'Многоетажни редови къщи', 3),
    ('Garage Townhouses', 'Редови къщи с гараж', 'garage-townhouses', 'Townhouses with garage', 'Редови къщи с гараж', 4),
    ('Garden Townhouses', 'Редови къщи с градина', 'garden-townhouses', 'Townhouses with private garden', 'Редови къщи с частна градина', 5)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'townhouses-sale');

-- L3 under Bungalows
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'bungalows-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Classic Bungalows', 'Класически бунгала', 'classic-bungalows', 'Traditional single-story bungalows', 'Традиционни едноетажни бунгала', 1),
    ('Modern Bungalows', 'Модерни бунгала', 'modern-bungalows', 'Contemporary design bungalows', 'Съвременен дизайн бунгала', 2),
    ('Raised Bungalows', 'Повдигнати бунгала', 'raised-bungalows', 'Bungalows with raised foundation', 'Бунгала с повдигната основа', 3),
    ('Beach Bungalows', 'Плажни бунгала', 'beach-bungalows', 'Seaside bungalows', 'Морски бунгала', 4),
    ('Retirement Bungalows', 'Бунгала за пенсионери', 'retirement-bungalows', 'Accessible single-level living', 'Достъпно едноетажно жилище', 5)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'bungalows-sale');
;
