-- Restore Art, Craft & Hobby L3 categories

-- Art Supplies L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Acrylic Paints', 'art-acrylic', 'Акрилни бои', 1),
  ('Oil Paints', 'art-oil', 'Маслени бои', 2),
  ('Watercolors', 'art-watercolor', 'Акварели', 3),
  ('Pastels', 'art-pastels', 'Пастели', 4),
  ('Paint Brushes', 'art-brushes', 'Четки', 5),
  ('Canvas', 'art-canvas', 'Платна', 6),
  ('Easels', 'art-easels', 'Стативи', 7),
  ('Sketch Pads', 'art-sketch-pads', 'Скицници', 8),
  ('Drawing Pencils', 'art-pencils', 'Моливи за рисуване', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'hobby-art-supplies'
ON CONFLICT (slug) DO NOTHING;

-- Sewing & Fabric L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Sewing Machines', 'sewing-machines', 'Шевни машини', 1),
  ('Fabrics', 'sewing-fabrics', 'Платове', 2),
  ('Sewing Notions', 'sewing-notions', 'Шивашки принадлежности', 3),
  ('Patterns', 'sewing-patterns', 'Кройки', 4),
  ('Thread', 'sewing-thread', 'Конци', 5),
  ('Embroidery', 'sewing-embroidery', 'Бродерия', 6),
  ('Quilting Supplies', 'sewing-quilting', 'Принадлежности за лоскутно шиене', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'hobby-sewing'
ON CONFLICT (slug) DO NOTHING;

-- Knitting & Crochet L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Yarn', 'knitting-yarn', 'Прежда', 1),
  ('Knitting Needles', 'knitting-needles', 'Игли за плетене', 2),
  ('Crochet Hooks', 'knitting-hooks', 'Куки за плетене', 3),
  ('Knitting Kits', 'knitting-kits', 'Комплекти за плетене', 4),
  ('Stitch Markers', 'knitting-markers', 'Маркери', 5),
  ('Patterns', 'knitting-patterns', 'Схеми', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'hobby-knitting'
ON CONFLICT (slug) DO NOTHING;

-- Scrapbooking L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Scrapbook Albums', 'scrap-albums', 'Скрапбук албуми', 1),
  ('Paper Packs', 'scrap-paper', 'Хартии', 2),
  ('Stickers', 'scrap-stickers', 'Стикери', 3),
  ('Die Cuts', 'scrap-die-cuts', 'Щанци', 4),
  ('Embellishments', 'scrap-embellishments', 'Декорации', 5),
  ('Stamps', 'scrap-stamps', 'Печати', 6),
  ('Punches', 'scrap-punches', 'Перфоратори', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'hobby-scrapbooking'
ON CONFLICT (slug) DO NOTHING;

-- Jewelry Making L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Beads', 'jewelry-beads', 'Мъниста', 1),
  ('Findings', 'jewelry-findings', 'Закопчалки', 2),
  ('Wire', 'jewelry-wire', 'Тел', 3),
  ('Charms', 'jewelry-charms', 'Висулки', 4),
  ('Jewelry Tools', 'jewelry-tools', 'Инструменти', 5),
  ('Gemstones', 'jewelry-gemstones', 'Скъпоценни камъни', 6),
  ('Cord & Thread', 'jewelry-cord', 'Корда и конци', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'hobby-jewelry-making'
ON CONFLICT (slug) DO NOTHING;

-- Model Building L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Plastic Models', 'models-plastic', 'Пластмасови модели', 1),
  ('Model Trains', 'models-trains', 'Модели влакове', 2),
  ('RC Cars', 'models-rc-cars', 'RC коли', 3),
  ('RC Planes', 'models-rc-planes', 'RC самолети', 4),
  ('RC Boats', 'models-rc-boats', 'RC лодки', 5),
  ('Model Paints', 'models-paints', 'Бои за модели', 6),
  ('Drones', 'models-drones', 'Дронове', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'hobby-models'
ON CONFLICT (slug) DO NOTHING;

-- Party Supplies L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Balloons', 'party-balloons', 'Балони', 1),
  ('Banners', 'party-banners', 'Банери', 2),
  ('Party Tableware', 'party-tableware', 'Посуда за парти', 3),
  ('Decorations', 'party-decorations', 'Декорации', 4),
  ('Party Favors', 'party-favors', 'Подаръчета', 5),
  ('Themed Party Supplies', 'party-themed', 'Тематични принадлежности', 6),
  ('Candles', 'party-candles', 'Свещи', 7),
  ('Confetti', 'party-confetti', 'Конфети', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'hobby-party'
ON CONFLICT (slug) DO NOTHING;

-- Candle Making L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Wax', 'candle-wax', 'Восък', 1),
  ('Wicks', 'candle-wicks', 'Фитили', 2),
  ('Fragrance Oils', 'candle-fragrance', 'Ароматни масла', 3),
  ('Candle Molds', 'candle-molds', 'Форми за свещи', 4),
  ('Candle Dyes', 'candle-dyes', 'Багрила', 5),
  ('Containers', 'candle-containers', 'Съдове за свещи', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'hobby-candle-making'
ON CONFLICT (slug) DO NOTHING;;
