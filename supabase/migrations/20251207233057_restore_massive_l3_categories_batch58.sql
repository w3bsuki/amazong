
-- Batch 58: Even more subcategories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Beach & Sand Toys deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'beach-sand-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sand Buckets', 'Кофички за пясък', 'sand-buckets', v_parent_id, 1),
      ('Sand Molds', 'Форми за пясък', 'sand-molds', v_parent_id, 2),
      ('Sand Tables', 'Маси за пясък', 'sand-tables', v_parent_id, 3),
      ('Beach Balls', 'Плажни топки', 'beach-balls', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Water Toys deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'water-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pool Floats', 'Надуваеми дюшеци', 'pool-floats', v_parent_id, 1),
      ('Water Guns', 'Водни пистолети', 'water-guns', v_parent_id, 2),
      ('Water Balloons', 'Водни балони', 'water-balloons', v_parent_id, 3),
      ('Sprinklers Toys', 'Пръскачки играчки', 'sprinklers-toys', v_parent_id, 4),
      ('Inflatable Pools', 'Надуваеми басейни', 'inflatable-pools', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Art Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'art-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Drawing Pencils', 'Моливи за рисуване', 'drawing-pencils', v_parent_id, 1),
      ('Colored Pencils', 'Цветни моливи', 'colored-pencils', v_parent_id, 2),
      ('Watercolors', 'Акварели', 'watercolors', v_parent_id, 3),
      ('Acrylic Paints', 'Акрилни бои', 'acrylic-paints', v_parent_id, 4),
      ('Oil Paints', 'Маслени бои', 'oil-paints', v_parent_id, 5),
      ('Sketch Pads', 'Скициръчници', 'sketch-pads', v_parent_id, 6),
      ('Canvases', 'Платна', 'canvases', v_parent_id, 7),
      ('Easels', 'Статици', 'easels', v_parent_id, 8),
      ('Paint Brushes Art', 'Четки за рисуване', 'paint-brushes-art', v_parent_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sewing & Knitting deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sewing-knitting';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Yarn', 'Прежда', 'yarn', v_parent_id, 1),
      ('Knitting Needles', 'Куки за плетене', 'knitting-needles', v_parent_id, 2),
      ('Crochet Hooks', 'Куки за плетене на една кука', 'crochet-hooks', v_parent_id, 3),
      ('Sewing Machines', 'Шевни машини', 'sewing-machines', v_parent_id, 4),
      ('Fabric', 'Плат', 'fabric', v_parent_id, 5),
      ('Thread', 'Конци', 'thread', v_parent_id, 6),
      ('Sewing Patterns', 'Кройки', 'sewing-patterns', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Jewelry Making deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'jewelry-making';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Beads', 'Мъниста', 'beads', v_parent_id, 1),
      ('Jewelry Wire', 'Тел за бижута', 'jewelry-wire', v_parent_id, 2),
      ('Jewelry Findings', 'Фурнитури за бижута', 'jewelry-findings', v_parent_id, 3),
      ('Pendant Settings', 'Заготовки за медальони', 'pendant-settings', v_parent_id, 4),
      ('Resin', 'Смола', 'resin', v_parent_id, 5),
      ('Gemstones', 'Камъни', 'gemstones', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Model Kits deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'model-kits';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Car Models', 'Модели на коли', 'car-models', v_parent_id, 1),
      ('Airplane Models', 'Модели на самолети', 'airplane-models', v_parent_id, 2),
      ('Ship Models', 'Модели на кораби', 'ship-models', v_parent_id, 3),
      ('Tank Models', 'Модели на танкове', 'tank-models', v_parent_id, 4),
      ('Robot Models', 'Модели на роботи', 'robot-models', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Scrapbooking deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'scrapbooking';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Scrapbook Albums', 'Албуми', 'scrapbook-albums', v_parent_id, 1),
      ('Scrapbook Paper', 'Хартия за скрапбукинг', 'scrapbook-paper', v_parent_id, 2),
      ('Stickers Scrap', 'Стикери', 'stickers-scrap', v_parent_id, 3),
      ('Die Cuts', 'Изрезки', 'die-cuts', v_parent_id, 4),
      ('Embellishments', 'Декорации', 'embellishments', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Candle Making deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'candle-making';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Candle Wax', 'Восък за свещи', 'candle-wax', v_parent_id, 1),
      ('Candle Wicks', 'Фитили за свещи', 'candle-wicks', v_parent_id, 2),
      ('Candle Molds', 'Форми за свещи', 'candle-molds', v_parent_id, 3),
      ('Fragrance Oils', 'Ароматни масла', 'fragrance-oils', v_parent_id, 4),
      ('Candle Dyes', 'Бои за свещи', 'candle-dyes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Home Fragrance deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'home-fragrance';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Scented Candles', 'Ароматни свещи', 'scented-candles', v_parent_id, 1),
      ('Reed Diffusers', 'Тръстикови дифузери', 'reed-diffusers', v_parent_id, 2),
      ('Essential Oils', 'Етерични масла', 'essential-oils-home', v_parent_id, 3),
      ('Air Fresheners', 'Освежители за въздух', 'air-fresheners', v_parent_id, 4),
      ('Incense', 'Тамян', 'incense', v_parent_id, 5),
      ('Potpourri', 'Ароматизатори', 'potpourri', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bedding deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bedding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sheet Sets', 'Комплекти чаршафи', 'sheet-sets', v_parent_id, 1),
      ('Duvet Covers', 'Калъфки за завивки', 'duvet-covers', v_parent_id, 2),
      ('Comforters', 'Юргани', 'comforters', v_parent_id, 3),
      ('Bed Pillows', 'Възглавници', 'bed-pillows', v_parent_id, 4),
      ('Pillow Cases', 'Калъфки за възглавници', 'pillow-cases', v_parent_id, 5),
      ('Mattress Pads', 'Протектори за матраци', 'mattress-pads', v_parent_id, 6),
      ('Blankets', 'Одеала', 'blankets', v_parent_id, 7),
      ('Bed Skirts', 'Поли за легла', 'bed-skirts', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
