
-- =====================================================
-- HOBBIES PART 4: Model Building & RC L2/L3 Expansion
-- Focus: Scale models, model kits, RC vehicles, drones
-- =====================================================

DO $$
DECLARE
  model_id UUID;
  rc_id UUID;
  cat_id UUID;
BEGIN
  SELECT id INTO model_id FROM categories WHERE slug = 'hobby-model-building';
  
  -- L2: Plastic Model Kits (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-plastic-models';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Military Model Kits', 'Военни модели', 'models-military', cat_id, '🪖', 1),
    ('Aircraft Model Kits', 'Самолети модели', 'models-aircraft', cat_id, '✈️', 2),
    ('Vehicle Model Kits', 'Автомобили модели', 'models-vehicles', cat_id, '🚗', 3),
    ('Ship Model Kits', 'Кораби модели', 'models-ships', cat_id, '🚢', 4),
    ('Sci-Fi & Fantasy Kits', 'Научна фантастика', 'models-scifi', cat_id, '🚀', 5),
    ('Gundam & Mecha', 'Gundam и меха', 'models-gundam', cat_id, '🤖', 6),
    ('Figure Model Kits', 'Фигури модели', 'models-figures', cat_id, '🧑', 7)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L2: Model Trains (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-model-trains';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('HO Scale Trains', 'HO мащаб влакове', 'trains-ho', cat_id, '🚂', 1),
    ('N Scale Trains', 'N мащаб влакове', 'trains-n', cat_id, '🚃', 2),
    ('O Scale Trains', 'O мащаб влакове', 'trains-o', cat_id, '🚂', 3),
    ('G Scale Trains', 'G мащаб влакове', 'trains-g', cat_id, '🚂', 4),
    ('Track & Accessories', 'Релси и аксесоари', 'trains-track', cat_id, '🛤️', 5),
    ('Scenery & Buildings', 'Сгради и декор', 'trains-scenery', cat_id, '🏠', 6)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L2: Model Ships (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-model-ships';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Sailing Ships', 'Ветроходни кораби', 'ships-sailing', cat_id, '⛵', 1),
    ('Warships', 'Военни кораби', 'ships-warships', cat_id, '🚢', 2),
    ('Submarines', 'Подводници', 'ships-submarines', cat_id, '🤿', 3),
    ('Ship Bottles', 'Кораби в бутилка', 'ships-bottles', cat_id, '🍾', 4)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L2: Model Aircraft (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-model-aircraft';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('WWII Aircraft', 'WWII самолети', 'aircraft-ww2', cat_id, '✈️', 1),
    ('Modern Jets', 'Модерни изтребители', 'aircraft-jets', cat_id, '🛩️', 2),
    ('Civilian Aircraft', 'Цивилни самолети', 'aircraft-civilian', cat_id, '✈️', 3),
    ('Helicopters', 'Хеликоптери', 'aircraft-helicopters', cat_id, '🚁', 4),
    ('Spacecraft', 'Космически кораби', 'aircraft-space', cat_id, '🚀', 5)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L2: Model Tools & Paints (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-model-tools';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Model Paints', 'Бои за модели', 'model-paints', cat_id, '🎨', 1),
    ('Airbrushes', 'Ейрбръши', 'model-airbrush', cat_id, '💨', 2),
    ('Model Glue', 'Лепила', 'model-glue', cat_id, '🧴', 3),
    ('Cutting Tools', 'Режещи инструменти', 'model-cutting', cat_id, '✂️', 4),
    ('Detail Tools', 'Детайлни инструменти', 'model-detail', cat_id, '🔧', 5),
    ('Decals & Transfers', 'Декали', 'model-decals', cat_id, '🏷️', 6)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L2: Diecast & Collectible Models
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Diecast Models', 'Метални модели', 'hobby-diecast', model_id, '🚗', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('1:18 Scale', '1:18 мащаб', 'diecast-118', cat_id, '🚗', 1),
  ('1:24 Scale', '1:24 мащаб', 'diecast-124', cat_id, '🚗', 2),
  ('1:43 Scale', '1:43 мащаб', 'diecast-143', cat_id, '🚗', 3),
  ('1:64 Scale', '1:64 мащаб', 'diecast-164', cat_id, '🚗', 4),
  ('Matchbox & Hot Wheels', 'Matchbox и Hot Wheels', 'diecast-hotwheels', cat_id, '🔥', 5),
  ('F1 & Racing', 'F1 и състезания', 'diecast-f1', cat_id, '🏎️', 6),
  ('Trucks & Heavy', 'Камиони', 'diecast-trucks', cat_id, '🚚', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Get RC & Drones category (moved under model building)
  SELECT id INTO rc_id FROM categories WHERE slug = 'hobby-rc-drones';
  
  -- L3: RC Cars & Trucks (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-rc-cars';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('RC Crawlers', 'RC кролери', 'rc-crawlers', cat_id, '🪨', 1),
    ('RC Buggies', 'RC бъгита', 'rc-buggies', cat_id, '🏜️', 2),
    ('RC Monster Trucks', 'RC монстър тракове', 'rc-monster', cat_id, '🚙', 3),
    ('RC Drift Cars', 'RC дрифт коли', 'rc-drift', cat_id, '🚗', 4),
    ('RC Racing', 'RC състезания', 'rc-racing', cat_id, '🏁', 5),
    ('RC Short Course', 'RC шорт курс', 'rc-shortcourse', cat_id, '🏎️', 6)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L3: FPV Drones (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-fpv-drones';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Racing Quads', 'Състезателни квадове', 'fpv-racing', cat_id, '🏁', 1),
    ('Freestyle Drones', 'Freestyle дронове', 'fpv-freestyle', cat_id, '🔄', 2),
    ('Long Range FPV', 'Дълъг обхват FPV', 'fpv-longrange', cat_id, '📡', 3),
    ('Tiny Whoops', 'Tiny Whoops', 'fpv-tinywhoop', cat_id, '🦟', 4),
    ('FPV Goggles', 'FPV очила', 'fpv-goggles', cat_id, '🥽', 5),
    ('FPV Controllers', 'FPV контролери', 'fpv-controllers', cat_id, '🎮', 6)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L3: RC Parts & Accessories (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'hobby-rc-parts';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('RC Batteries', 'RC батерии', 'rc-batteries', cat_id, '🔋', 1),
    ('RC Motors', 'RC мотори', 'rc-motors', cat_id, '⚙️', 2),
    ('RC ESC', 'RC ESC', 'rc-esc', cat_id, '🔌', 3),
    ('RC Servos', 'RC серва', 'rc-servos', cat_id, '🤖', 4),
    ('RC Tires & Wheels', 'RC гуми и джанти', 'rc-tires', cat_id, '🛞', 5),
    ('RC Bodies & Shells', 'RC каросерии', 'rc-bodies', cat_id, '🚗', 6),
    ('RC Chargers', 'RC зарядни', 'rc-chargers', cat_id, '🔌', 7),
    ('RC Transmitters', 'RC предаватели', 'rc-transmitters', cat_id, '📡', 8)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

END $$;
;
