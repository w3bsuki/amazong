
-- Batch 63: Flatware, Bar accessories, and various categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Flatware deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'flatware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Forks', 'Вилици', 'forks', v_parent_id, 1),
      ('Knives Flatware', 'Ножове прибори', 'knives-flatware', v_parent_id, 2),
      ('Spoons', 'Лъжици', 'spoons', v_parent_id, 3),
      ('Flatware Sets', 'Комплекти прибори', 'flatware-sets', v_parent_id, 4),
      ('Serving Utensils', 'Прибори за сервиране', 'serving-utensils', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bar Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bar-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cocktail Shakers', 'Шейкъри', 'cocktail-shakers', v_parent_id, 1),
      ('Wine Openers', 'Отварачки за вино', 'wine-openers', v_parent_id, 2),
      ('Ice Buckets', 'Кофи за лед', 'ice-buckets', v_parent_id, 3),
      ('Bar Tools', 'Барови инструменти', 'bar-tools', v_parent_id, 4),
      ('Decanters', 'Гарафи', 'decanters', v_parent_id, 5),
      ('Shot Glasses', 'Чашки за шот', 'shot-glasses', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Coffee & Tea deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'coffee-tea';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Coffee Beans', 'Кафе на зърна', 'coffee-beans', v_parent_id, 1),
      ('Ground Coffee', 'Мляно кафе', 'ground-coffee', v_parent_id, 2),
      ('Tea Bags', 'Чай в пликчета', 'tea-bags', v_parent_id, 3),
      ('Loose Leaf Tea', 'Насипен чай', 'loose-leaf-tea', v_parent_id, 4),
      ('Coffee Grinders', 'Кафемелачки', 'coffee-grinders', v_parent_id, 5),
      ('Tea Kettles', 'Чайници', 'tea-kettles', v_parent_id, 6),
      ('French Press', 'Френска преса', 'french-press', v_parent_id, 7),
      ('Espresso Machines', 'Еспресо машини', 'espresso-machines', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Office Electronics deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-electronics';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Printers', 'Принтери', 'printers', v_parent_id, 1),
      ('Scanners', 'Скенери', 'scanners', v_parent_id, 2),
      ('Fax Machines', 'Факс машини', 'fax-machines', v_parent_id, 3),
      ('Shredders', 'Шредери', 'shredders', v_parent_id, 4),
      ('Calculators', 'Калкулатори', 'calculators', v_parent_id, 5),
      ('Label Makers', 'Етикетиращи машини', 'label-makers', v_parent_id, 6),
      ('Projectors', 'Проектори', 'projectors', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Office Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pens', 'Химикалки', 'pens', v_parent_id, 1),
      ('Pencils', 'Моливи', 'pencils', v_parent_id, 2),
      ('Markers', 'Маркери', 'markers', v_parent_id, 3),
      ('Highlighters', 'Текстмаркери', 'highlighters', v_parent_id, 4),
      ('Notebooks', 'Тетрадки', 'notebooks', v_parent_id, 5),
      ('Paper Supplies', 'Хартия', 'paper-supplies', v_parent_id, 6),
      ('Staplers', 'Телбоди', 'staplers', v_parent_id, 7),
      ('Paper Clips', 'Кламери', 'paper-clips', v_parent_id, 8),
      ('Tape', 'Тиксо', 'tape', v_parent_id, 9),
      ('Scissors', 'Ножици', 'scissors', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Desk Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'desk-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Desk Organizers', 'Органайзери за бюро', 'desk-organizers', v_parent_id, 1),
      ('Pen Holders', 'Поставки за химикалки', 'pen-holders', v_parent_id, 2),
      ('Letter Trays', 'Тави за писма', 'letter-trays', v_parent_id, 3),
      ('Desk Pads', 'Подложки за бюро', 'desk-pads', v_parent_id, 4),
      ('Monitor Stands', 'Стойки за монитори', 'monitor-stands', v_parent_id, 5),
      ('Desk Lamps', 'Лампи за бюро', 'desk-lamps', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Filing & Storage Office deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'filing-storage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('File Cabinets', 'Шкафове за документи', 'file-cabinets', v_parent_id, 1),
      ('File Folders', 'Папки за документи', 'file-folders', v_parent_id, 2),
      ('Binders', 'Класьори', 'binders', v_parent_id, 3),
      ('Storage Boxes Office', 'Кутии за съхранение', 'storage-boxes-office', v_parent_id, 4),
      ('Magazine Holders', 'Поставки за списания', 'magazine-holders', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- School Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'school-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Backpacks School', 'Ученически раници', 'backpacks-school', v_parent_id, 1),
      ('Lunch Bags', 'Чанти за обяд', 'lunch-bags', v_parent_id, 2),
      ('Pencil Cases', 'Несесери', 'pencil-cases', v_parent_id, 3),
      ('Rulers', 'Линии', 'rulers', v_parent_id, 4),
      ('Erasers', 'Гуми', 'erasers', v_parent_id, 5),
      ('Glue', 'Лепило', 'glue', v_parent_id, 6),
      ('Construction Paper', 'Картон', 'construction-paper', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
