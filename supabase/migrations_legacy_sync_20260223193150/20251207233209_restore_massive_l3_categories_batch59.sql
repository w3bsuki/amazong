
-- Batch 59: Bath & Towels, Window Treatments, and more
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Bath deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bath';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bath Towels', 'Кърпи за баня', 'bath-towels', v_parent_id, 1),
      ('Hand Towels', 'Кърпи за ръце', 'hand-towels', v_parent_id, 2),
      ('Washcloths', 'Хавлийки', 'washcloths', v_parent_id, 3),
      ('Bath Rugs', 'Килими за баня', 'bath-rugs', v_parent_id, 4),
      ('Shower Curtains', 'Завеси за душ', 'shower-curtains', v_parent_id, 5),
      ('Bath Accessories', 'Аксесоари за баня', 'bath-accessories', v_parent_id, 6),
      ('Soap Dispensers', 'Дозатори за сапун', 'soap-dispensers', v_parent_id, 7),
      ('Toothbrush Holders', 'Поставки за четки', 'toothbrush-holders', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Window Treatments
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'window-treatments';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Curtains', 'Завеси', 'curtains', v_parent_id, 1),
      ('Drapes', 'Драперии', 'drapes', v_parent_id, 2),
      ('Blinds', 'Щори', 'blinds', v_parent_id, 3),
      ('Shades', 'Сенници', 'shades', v_parent_id, 4),
      ('Valances', 'Перде валанс', 'valances', v_parent_id, 5),
      ('Curtain Rods', 'Корнизи', 'curtain-rods', v_parent_id, 6),
      ('Sheers', 'Тюл', 'sheers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Rugs & Carpets
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'rugs-carpets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Area Rugs', 'Килими', 'area-rugs', v_parent_id, 1),
      ('Runner Rugs', 'Пътеки', 'runner-rugs', v_parent_id, 2),
      ('Outdoor Rugs', 'Килими за открито', 'outdoor-rugs', v_parent_id, 3),
      ('Rug Pads', 'Подложки за килими', 'rug-pads', v_parent_id, 4),
      ('Kitchen Rugs', 'Килими за кухня', 'kitchen-rugs', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Decorative Pillows
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'decorative-pillows';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Throw Pillows', 'Декоративни възглавници', 'throw-pillows', v_parent_id, 1),
      ('Floor Pillows', 'Подови възглавници', 'floor-pillows', v_parent_id, 2),
      ('Pillow Covers', 'Калъфи за възглавници', 'pillow-covers', v_parent_id, 3),
      ('Lumbar Pillows', 'Поясни възглавници', 'lumbar-pillows', v_parent_id, 4),
      ('Outdoor Pillows', 'Възглавници за открито', 'outdoor-pillows', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Wall Art
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wall-art';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Canvas Art', 'Арт на платно', 'canvas-art', v_parent_id, 1),
      ('Framed Art', 'Картини в рамка', 'framed-art', v_parent_id, 2),
      ('Metal Wall Art', 'Метални декорации', 'metal-wall-art', v_parent_id, 3),
      ('Wall Sculptures', 'Стенни скулптури', 'wall-sculptures', v_parent_id, 4),
      ('Wall Decals', 'Стикери за стена', 'wall-decals', v_parent_id, 5),
      ('Tapestries', 'Гоблени', 'tapestries', v_parent_id, 6),
      ('Posters Art', 'Плакати', 'posters-art', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Mirrors
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mirrors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wall Mirrors', 'Стенни огледала', 'wall-mirrors', v_parent_id, 1),
      ('Floor Mirrors', 'Подови огледала', 'floor-mirrors', v_parent_id, 2),
      ('Vanity Mirrors', 'Огледала за тоалетка', 'vanity-mirrors', v_parent_id, 3),
      ('Decorative Mirrors', 'Декоративни огледала', 'decorative-mirrors', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Clocks
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'clocks';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wall Clocks', 'Стенни часовници', 'wall-clocks', v_parent_id, 1),
      ('Mantel Clocks', 'Каминни часовници', 'mantel-clocks', v_parent_id, 2),
      ('Desk Clocks', 'Настолни часовници', 'desk-clocks', v_parent_id, 3),
      ('Alarm Clocks', 'Будилници', 'alarm-clocks', v_parent_id, 4),
      ('Cuckoo Clocks', 'Кукувички', 'cuckoo-clocks', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Photo Frames
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'photo-frames';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Picture Frames', 'Рамки за снимки', 'picture-frames', v_parent_id, 1),
      ('Collage Frames', 'Рамки за колаж', 'collage-frames', v_parent_id, 2),
      ('Digital Frames', 'Дигитални рамки', 'digital-frames', v_parent_id, 3),
      ('Shadow Boxes', 'Кутии за сенки', 'shadow-boxes', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Vases
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vases';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Glass Vases', 'Стъклени вази', 'glass-vases', v_parent_id, 1),
      ('Ceramic Vases', 'Керамични вази', 'ceramic-vases', v_parent_id, 2),
      ('Metal Vases', 'Метални вази', 'metal-vases', v_parent_id, 3),
      ('Floor Vases', 'Подови вази', 'floor-vases', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Artificial Flowers
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'artificial-flowers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Silk Flowers', 'Копринени цветя', 'silk-flowers', v_parent_id, 1),
      ('Faux Greenery', 'Изкуствена зеленина', 'faux-greenery', v_parent_id, 2),
      ('Artificial Plants', 'Изкуствени растения', 'artificial-plants', v_parent_id, 3),
      ('Flower Arrangements', 'Аранжировки от цветя', 'flower-arrangements', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
