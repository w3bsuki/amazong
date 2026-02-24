-- =====================================================
-- L3 Categories for Tool Storage
-- =====================================================

-- Tool Boxes
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Plastic Tool Boxes', 'Пластмасови куфари', 'toolbox-plastic', id, '📦', 1 FROM categories WHERE slug = 'storage-tool-boxes'
UNION ALL
SELECT gen_random_uuid(), 'Metal Tool Boxes', 'Метални куфари', 'toolbox-metal', id, '🔧', 2 FROM categories WHERE slug = 'storage-tool-boxes'
UNION ALL
SELECT gen_random_uuid(), 'Cantilever Tool Boxes', 'Хармоника куфари', 'toolbox-cantilever', id, '🧰', 3 FROM categories WHERE slug = 'storage-tool-boxes'
UNION ALL
SELECT gen_random_uuid(), 'Stackable Tool Boxes', 'Модулни куфари', 'toolbox-stackable', id, '📚', 4 FROM categories WHERE slug = 'storage-tool-boxes';

-- Workbenches
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Steel Workbenches', 'Стоманени работни маси', 'workbench-steel', id, '🔧', 1 FROM categories WHERE slug = 'storage-workbenches'
UNION ALL
SELECT gen_random_uuid(), 'Wood Workbenches', 'Дървени работни маси', 'workbench-wood', id, '🪵', 2 FROM categories WHERE slug = 'storage-workbenches'
UNION ALL
SELECT gen_random_uuid(), 'Folding Workbenches', 'Сгъваеми работни маси', 'workbench-folding', id, '📐', 3 FROM categories WHERE slug = 'storage-workbenches'
UNION ALL
SELECT gen_random_uuid(), 'Mobile Workbenches', 'Подвижни работни маси', 'workbench-mobile', id, '🛞', 4 FROM categories WHERE slug = 'storage-workbenches'
UNION ALL
SELECT gen_random_uuid(), 'Workbench Accessories', 'Аксесоари за работни маси', 'workbench-accessories', id, '🧰', 5 FROM categories WHERE slug = 'storage-workbenches';

-- =====================================================
-- L3 Categories for Test & Measurement
-- =====================================================

-- Laser Levels
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Line Laser Levels', 'Линейни лазерни нивелири', 'laser-line', id, '➖', 1 FROM categories WHERE slug = 'measurement-laser-levels'
UNION ALL
SELECT gen_random_uuid(), 'Cross Line Lasers', 'Кръстати лазерни нивелири', 'laser-cross', id, '✖️', 2 FROM categories WHERE slug = 'measurement-laser-levels'
UNION ALL
SELECT gen_random_uuid(), 'Rotary Lasers', 'Ротационни лазери', 'laser-rotary', id, '🔄', 3 FROM categories WHERE slug = 'measurement-laser-levels'
UNION ALL
SELECT gen_random_uuid(), 'Point Lasers', 'Точкови лазери', 'laser-point', id, '📍', 4 FROM categories WHERE slug = 'measurement-laser-levels'
UNION ALL
SELECT gen_random_uuid(), 'Laser Level Accessories', 'Аксесоари за лазери', 'laser-accessories', id, '🧰', 5 FROM categories WHERE slug = 'measurement-laser-levels';

-- =====================================================
-- L3 Categories for Abrasives
-- =====================================================

-- Grinding Wheels
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Bench Grinding Wheels', 'Кръгове за шмиргел', 'grinding-bench', id, '⭕', 1 FROM categories WHERE slug = 'abrasives-grinding-wheels'
UNION ALL
SELECT gen_random_uuid(), 'Angle Grinder Wheels', 'Кръгове за ъглошлайф', 'grinding-angle', id, '⚙️', 2 FROM categories WHERE slug = 'abrasives-grinding-wheels'
UNION ALL
SELECT gen_random_uuid(), 'Diamond Grinding Wheels', 'Диамантени кръгове', 'grinding-diamond', id, '💎', 3 FROM categories WHERE slug = 'abrasives-grinding-wheels'
UNION ALL
SELECT gen_random_uuid(), 'Ceramic Grinding Wheels', 'Керамични кръгове', 'grinding-ceramic', id, '🏺', 4 FROM categories WHERE slug = 'abrasives-grinding-wheels';

-- Cut-Off Wheels
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Metal Cut-Off Wheels', 'Отрезни за метал', 'cutoff-metal', id, '⚙️', 1 FROM categories WHERE slug = 'abrasives-cutoff-wheels'
UNION ALL
SELECT gen_random_uuid(), 'Stainless Steel Cut-Off', 'Отрезни за неръждаема', 'cutoff-stainless', id, '✨', 2 FROM categories WHERE slug = 'abrasives-cutoff-wheels'
UNION ALL
SELECT gen_random_uuid(), 'Masonry Cut-Off Wheels', 'Отрезни за бетон', 'cutoff-masonry', id, '🧱', 3 FROM categories WHERE slug = 'abrasives-cutoff-wheels'
UNION ALL
SELECT gen_random_uuid(), 'Diamond Cut-Off Wheels', 'Диамантени отрезни', 'cutoff-diamond', id, '💎', 4 FROM categories WHERE slug = 'abrasives-cutoff-wheels';

-- =====================================================
-- L3 Categories for Pneumatic Tools
-- =====================================================

-- Air Compressors
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Portable Compressors', 'Преносими компресори', 'compressor-portable', id, '💨', 1 FROM categories WHERE slug = 'pneumatic-compressors'
UNION ALL
SELECT gen_random_uuid(), 'Stationary Compressors', 'Стационарни компресори', 'compressor-stationary', id, '🏭', 2 FROM categories WHERE slug = 'pneumatic-compressors'
UNION ALL
SELECT gen_random_uuid(), 'Oil-Free Compressors', 'Безмаслени компресори', 'compressor-oil-free', id, '✨', 3 FROM categories WHERE slug = 'pneumatic-compressors'
UNION ALL
SELECT gen_random_uuid(), 'Pancake Compressors', 'Палачинкови компресори', 'compressor-pancake', id, '🥞', 4 FROM categories WHERE slug = 'pneumatic-compressors'
UNION ALL
SELECT gen_random_uuid(), 'Hot Dog Compressors', 'Хот-дог компресори', 'compressor-hotdog', id, '🌭', 5 FROM categories WHERE slug = 'pneumatic-compressors';

-- Pneumatic Nail Guns
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT gen_random_uuid(), 'Framing Nailers', 'Такери за рамки', 'nailers-framing', id, '🏠', 1 FROM categories WHERE slug = 'pneumatic-nailers'
UNION ALL
SELECT gen_random_uuid(), 'Finish Nailers', 'Довършителни такери', 'nailers-finish', id, '✨', 2 FROM categories WHERE slug = 'pneumatic-nailers'
UNION ALL
SELECT gen_random_uuid(), 'Brad Nailers', 'Брадва такери', 'nailers-brad', id, '📌', 3 FROM categories WHERE slug = 'pneumatic-nailers'
UNION ALL
SELECT gen_random_uuid(), 'Pin Nailers', 'Пин такери', 'nailers-pin', id, '📍', 4 FROM categories WHERE slug = 'pneumatic-nailers'
UNION ALL
SELECT gen_random_uuid(), 'Roofing Nailers', 'Покривни такери', 'nailers-roofing', id, '🏗️', 5 FROM categories WHERE slug = 'pneumatic-nailers'
UNION ALL
SELECT gen_random_uuid(), 'Staplers', 'Телбод машини', 'nailers-staplers', id, '📎', 6 FROM categories WHERE slug = 'pneumatic-nailers'
ON CONFLICT (slug) DO NOTHING;;
