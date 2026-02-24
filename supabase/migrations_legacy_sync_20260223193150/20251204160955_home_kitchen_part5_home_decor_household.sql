
-- =====================================================
-- HOME & KITCHEN PART 5: Home Décor + Household
-- =====================================================

DO $$
DECLARE
  decor_id UUID;
  household_id UUID;
BEGIN
  SELECT id INTO decor_id FROM categories WHERE slug = 'home-decor';
  SELECT id INTO household_id FROM categories WHERE slug = 'household';

  -- ========== HOME DÉCOR L2/L3 ==========

  -- Wall Art
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Wall Art', 'Стенно изкуство', 'decor-wall-art', decor_id, '🖼️', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Canvas Prints', 'Картини на канава', 'art-canvas', (SELECT id FROM categories WHERE slug = 'decor-wall-art'), '🖼️', 1),
  ('Framed Art', 'Картини в рамка', 'art-framed', (SELECT id FROM categories WHERE slug = 'decor-wall-art'), '🖼️', 2),
  ('Posters', 'Постери', 'art-posters', (SELECT id FROM categories WHERE slug = 'decor-wall-art'), '📃', 3),
  ('Metal Wall Art', 'Метален декор', 'art-metal', (SELECT id FROM categories WHERE slug = 'decor-wall-art'), '🔩', 4),
  ('Wall Decals', 'Стикери за стена', 'art-decals', (SELECT id FROM categories WHERE slug = 'decor-wall-art'), '🏷️', 5),
  ('Tapestries', 'Гоблени', 'art-tapestries', (SELECT id FROM categories WHERE slug = 'decor-wall-art'), '🎨', 6),
  ('Gallery Sets', 'Галерийни комплекти', 'art-gallery', (SELECT id FROM categories WHERE slug = 'decor-wall-art'), '🖼️', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Mirrors
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Mirrors', 'Огледала', 'decor-mirrors', decor_id, '🪞', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Wall Mirrors', 'Стенни огледала', 'mirror-wall', (SELECT id FROM categories WHERE slug = 'decor-mirrors'), '🪞', 1),
  ('Floor Mirrors', 'Подови огледала', 'mirror-floor', (SELECT id FROM categories WHERE slug = 'decor-mirrors'), '🪞', 2),
  ('Vanity Mirrors', 'Тоалетни огледала', 'mirror-vanity', (SELECT id FROM categories WHERE slug = 'decor-mirrors'), '🪞', 3),
  ('Decorative Mirrors', 'Декоративни огледала', 'mirror-decorative', (SELECT id FROM categories WHERE slug = 'decor-mirrors'), '🪞', 4),
  ('Sunburst Mirrors', 'Слънчеви огледала', 'mirror-sunburst', (SELECT id FROM categories WHERE slug = 'decor-mirrors'), '☀️', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Clocks
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Clocks', 'Часовници', 'decor-clocks', decor_id, '🕐', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Wall Clocks', 'Стенни часовници', 'clock-wall', (SELECT id FROM categories WHERE slug = 'decor-clocks'), '🕐', 1),
  ('Desk Clocks', 'Настолни часовници', 'clock-desk', (SELECT id FROM categories WHERE slug = 'decor-clocks'), '⏰', 2),
  ('Mantel Clocks', 'Камински часовници', 'clock-mantel', (SELECT id FROM categories WHERE slug = 'decor-clocks'), '🕰️', 3),
  ('Grandfather Clocks', 'Дядов часовник', 'clock-grandfather', (SELECT id FROM categories WHERE slug = 'decor-clocks'), '🕰️', 4),
  ('Alarm Clocks', 'Будилници', 'clock-alarm', (SELECT id FROM categories WHERE slug = 'decor-clocks'), '⏰', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Rugs & Carpets
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Rugs & Carpets', 'Килими', 'decor-rugs', decor_id, '🏠', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Area Rugs', 'Килими за хол', 'rug-area', (SELECT id FROM categories WHERE slug = 'decor-rugs'), '🏠', 1),
  ('Runner Rugs', 'Пътеки', 'rug-runner', (SELECT id FROM categories WHERE slug = 'decor-rugs'), '🏠', 2),
  ('Outdoor Rugs', 'Външни килими', 'rug-outdoor', (SELECT id FROM categories WHERE slug = 'decor-rugs'), '🌳', 3),
  ('Kids Rugs', 'Детски килими', 'rug-kids', (SELECT id FROM categories WHERE slug = 'decor-rugs'), '👶', 4),
  ('Shag Rugs', 'Пухкави килими', 'rug-shag', (SELECT id FROM categories WHERE slug = 'decor-rugs'), '🐑', 5),
  ('Persian Rugs', 'Персийски килими', 'rug-persian', (SELECT id FROM categories WHERE slug = 'decor-rugs'), '🏠', 6),
  ('Door Mats', 'Изтривалки', 'rug-doormat', (SELECT id FROM categories WHERE slug = 'decor-rugs'), '🚪', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Window Treatments
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Window Treatments', 'Завеси и щори', 'decor-window', decor_id, '🪟', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Curtains', 'Завеси', 'window-curtains', (SELECT id FROM categories WHERE slug = 'decor-window'), '🪟', 1),
  ('Blinds', 'Щори', 'window-blinds', (SELECT id FROM categories WHERE slug = 'decor-window'), '🪟', 2),
  ('Shades', 'Ролетни щори', 'window-shades', (SELECT id FROM categories WHERE slug = 'decor-window'), '🪟', 3),
  ('Curtain Rods', 'Корнизи', 'window-rods', (SELECT id FROM categories WHERE slug = 'decor-window'), '🪟', 4),
  ('Valances', 'Балдахини', 'window-valance', (SELECT id FROM categories WHERE slug = 'decor-window'), '🪟', 5),
  ('Blackout Curtains', 'Затъмняващи завеси', 'window-blackout', (SELECT id FROM categories WHERE slug = 'decor-window'), '🌙', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Decorative Accents
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Decorative Accents', 'Декоративни акценти', 'decor-accents', decor_id, '✨', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Vases', 'Вази', 'accent-vases', (SELECT id FROM categories WHERE slug = 'decor-accents'), '🏺', 1),
  ('Candles & Holders', 'Свещи и свещници', 'accent-candles', (SELECT id FROM categories WHERE slug = 'decor-accents'), '🕯️', 2),
  ('Photo Frames', 'Рамки за снимки', 'accent-frames', (SELECT id FROM categories WHERE slug = 'decor-accents'), '🖼️', 3),
  ('Bookends', 'Ограничители за книги', 'accent-bookends', (SELECT id FROM categories WHERE slug = 'decor-accents'), '📚', 4),
  ('Figurines', 'Фигурки', 'accent-figurines', (SELECT id FROM categories WHERE slug = 'decor-accents'), '🗽', 5),
  ('Artificial Plants', 'Изкуствени растения', 'accent-plants', (SELECT id FROM categories WHERE slug = 'decor-accents'), '🌿', 6),
  ('Decorative Bowls', 'Декоративни купи', 'accent-bowls', (SELECT id FROM categories WHERE slug = 'decor-accents'), '🥣', 7),
  ('Decorative Trays', 'Декоративни подноси', 'accent-trays', (SELECT id FROM categories WHERE slug = 'decor-accents'), '📦', 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Cushions & Pillows
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Cushions & Pillows', 'Възглавнички', 'decor-cushions', decor_id, '🛋️', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Throw Pillows', 'Декоративни възглавници', 'cushion-throw', (SELECT id FROM categories WHERE slug = 'decor-cushions'), '🛋️', 1),
  ('Floor Cushions', 'Подови възглавници', 'cushion-floor', (SELECT id FROM categories WHERE slug = 'decor-cushions'), '🛋️', 2),
  ('Pillow Covers', 'Калъфки', 'cushion-covers', (SELECT id FROM categories WHERE slug = 'decor-cushions'), '🛋️', 3),
  ('Outdoor Cushions', 'Външни възглавници', 'cushion-outdoor', (SELECT id FROM categories WHERE slug = 'decor-cushions'), '🌳', 4),
  ('Bolster Pillows', 'Валяци', 'cushion-bolster', (SELECT id FROM categories WHERE slug = 'decor-cushions'), '🛋️', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- ========== HOUSEHOLD & CLEANING L2/L3 ==========

  -- Cleaning Supplies
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Cleaning Supplies', 'Почистващи препарати', 'house-cleaning', household_id, '🧹', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Floor Cleaners', 'Препарати за под', 'clean-floor', (SELECT id FROM categories WHERE slug = 'house-cleaning'), '🧹', 1),
  ('Surface Cleaners', 'Препарати за повърхности', 'clean-surface', (SELECT id FROM categories WHERE slug = 'house-cleaning'), '🧴', 2),
  ('Glass Cleaners', 'Препарати за стъкло', 'clean-glass', (SELECT id FROM categories WHERE slug = 'house-cleaning'), '🪟', 3),
  ('Bathroom Cleaners', 'Препарати за баня', 'clean-bathroom', (SELECT id FROM categories WHERE slug = 'house-cleaning'), '🚿', 4),
  ('Kitchen Cleaners', 'Препарати за кухня', 'clean-kitchen', (SELECT id FROM categories WHERE slug = 'house-cleaning'), '🍳', 5),
  ('Disinfectants', 'Дезинфектанти', 'clean-disinfect', (SELECT id FROM categories WHERE slug = 'house-cleaning'), '🧫', 6),
  ('Dishwashing', 'Миене на съдове', 'clean-dish', (SELECT id FROM categories WHERE slug = 'house-cleaning'), '🍽️', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Laundry
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Laundry', 'Пране', 'house-laundry', household_id, '🧺', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Laundry Detergent', 'Перилен препарат', 'laundry-detergent', (SELECT id FROM categories WHERE slug = 'house-laundry'), '🧴', 1),
  ('Fabric Softener', 'Омекотители', 'laundry-softener', (SELECT id FROM categories WHERE slug = 'house-laundry'), '🌸', 2),
  ('Stain Removers', 'Препарати за петна', 'laundry-stain', (SELECT id FROM categories WHERE slug = 'house-laundry'), '✨', 3),
  ('Laundry Baskets', 'Кошове за пране', 'laundry-baskets', (SELECT id FROM categories WHERE slug = 'house-laundry'), '🧺', 4),
  ('Drying Racks', 'Сушилни', 'laundry-drying', (SELECT id FROM categories WHERE slug = 'house-laundry'), '👕', 5),
  ('Ironing', 'Гладене', 'laundry-ironing', (SELECT id FROM categories WHERE slug = 'house-laundry'), '👔', 6),
  ('Hangers', 'Закачалки', 'laundry-hangers', (SELECT id FROM categories WHERE slug = 'house-laundry'), '👔', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Cleaning Tools
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Cleaning Tools', 'Инструменти за чистене', 'house-tools', household_id, '🧹', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Brooms & Dustpans', 'Метли и лопатки', 'tool-broom', (SELECT id FROM categories WHERE slug = 'house-tools'), '🧹', 1),
  ('Mops', 'Моп', 'tool-mop', (SELECT id FROM categories WHERE slug = 'house-tools'), '🧹', 2),
  ('Vacuum Cleaners', 'Прахосмукачки', 'tool-vacuum', (SELECT id FROM categories WHERE slug = 'house-tools'), '🧹', 3),
  ('Steam Cleaners', 'Парочистачки', 'tool-steam', (SELECT id FROM categories WHERE slug = 'house-tools'), '💨', 4),
  ('Buckets', 'Кофи', 'tool-bucket', (SELECT id FROM categories WHERE slug = 'house-tools'), '🪣', 5),
  ('Cleaning Cloths', 'Кърпи за чистене', 'tool-cloths', (SELECT id FROM categories WHERE slug = 'house-tools'), '🧽', 6),
  ('Dusters', 'Перодерки', 'tool-duster', (SELECT id FROM categories WHERE slug = 'house-tools'), '🪶', 7),
  ('Scrub Brushes', 'Четки', 'tool-brush', (SELECT id FROM categories WHERE slug = 'house-tools'), '🪥', 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Trash & Recycling
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Trash & Recycling', 'Кошове за боклук', 'house-trash', household_id, '🗑️', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Kitchen Bins', 'Кухненски кошове', 'trash-kitchen', (SELECT id FROM categories WHERE slug = 'house-trash'), '🗑️', 1),
  ('Recycling Bins', 'Кошове за рециклиране', 'trash-recycle', (SELECT id FROM categories WHERE slug = 'house-trash'), '♻️', 2),
  ('Trash Bags', 'Торби за боклук', 'trash-bags', (SELECT id FROM categories WHERE slug = 'house-trash'), '🗑️', 3),
  ('Compost Bins', 'Кошове за компост', 'trash-compost', (SELECT id FROM categories WHERE slug = 'house-trash'), '🌱', 4),
  ('Outdoor Bins', 'Външни кошове', 'trash-outdoor', (SELECT id FROM categories WHERE slug = 'house-trash'), '🏠', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Pest Control
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Pest Control', 'Борба с вредители', 'house-pest', household_id, '🐜', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Insect Repellent', 'Репеленти', 'pest-repellent', (SELECT id FROM categories WHERE slug = 'house-pest'), '🦟', 1),
  ('Traps', 'Капани', 'pest-traps', (SELECT id FROM categories WHERE slug = 'house-pest'), '🪤', 2),
  ('Sprays', 'Спрейове', 'pest-spray', (SELECT id FROM categories WHERE slug = 'house-pest'), '🧴', 3),
  ('Ultrasonic Repellers', 'Ултразвукови уреди', 'pest-ultrasonic', (SELECT id FROM categories WHERE slug = 'house-pest'), '🔊', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

END $$;
;
