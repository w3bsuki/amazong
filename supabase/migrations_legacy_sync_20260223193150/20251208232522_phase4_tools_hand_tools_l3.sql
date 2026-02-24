-- Phase 4: Tools & Industrial - Hand Tools L3 Categories
-- Following Rule 5: Using verified parent UUIDs

DO $$
DECLARE
  -- Hand Tools L2 parent IDs (verified)
  chisels_id UUID := '730723e9-4ba7-4327-bec5-238772674f68';
  files_id UUID := '2ccf7f8f-11f6-4ba1-af96-cbb965aae920';
  pry_bars_id UUID := 'c353cd4f-1dd2-4ce0-bf22-4cafa335e1ad';
  -- Additional Hand Tools L2 (need to fetch)
  hand_tools_l1 UUID := '496c798d-00b0-4126-a69d-eeb20ace0858';
  wrenches_id UUID;
  screwdrivers_id UUID;
  pliers_id UUID;
  hammers_id UUID;
  cutters_id UUID;
  clamps_id UUID;
  levels_id UUID;
  measuring_id UUID;
BEGIN
  -- Verify parent exists
  IF NOT EXISTS (SELECT 1 FROM categories WHERE id = chisels_id) THEN
    RAISE EXCEPTION 'Parent not found: chisels';
  END IF;

  -- Get additional parent IDs
  SELECT id INTO wrenches_id FROM categories WHERE slug = 'handtools-wrenches';
  SELECT id INTO screwdrivers_id FROM categories WHERE slug = 'handtools-screwdrivers';
  SELECT id INTO pliers_id FROM categories WHERE slug = 'handtools-pliers';
  SELECT id INTO hammers_id FROM categories WHERE slug = 'handtools-hammers';
  SELECT id INTO cutters_id FROM categories WHERE slug = 'handtools-cutters';
  SELECT id INTO clamps_id FROM categories WHERE slug = 'handtools-clamps';
  SELECT id INTO levels_id FROM categories WHERE slug = 'handtools-levels';
  SELECT id INTO measuring_id FROM categories WHERE slug = 'handtools-measuring';

  -- Chisels & Punches L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Wood Chisels', 'chisels-wood', chisels_id, 'Дърводелски длета', '🔧', 1),
    ('Cold Chisels', 'chisels-cold', chisels_id, 'Студени длета', '🔧', 2),
    ('Masonry Chisels', 'chisels-masonry', chisels_id, 'Зидарски длета', '🔧', 3),
    ('Center Punches', 'punches-center', chisels_id, 'Центрови поансони', '🔧', 4),
    ('Pin Punches', 'punches-pin', chisels_id, 'Щифтови поансони', '🔧', 5),
    ('Nail Sets', 'punches-nail-sets', chisels_id, 'Набивачи за пирони', '🔧', 6),
    ('Chisel Sets', 'chisels-sets', chisels_id, 'Комплекти длета', '🔧', 7)
  ON CONFLICT (slug) DO NOTHING;

  -- Files & Rasps L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Flat Files', 'files-flat', files_id, 'Плоски пили', '🔧', 1),
    ('Round Files', 'files-round', files_id, 'Кръгли пили', '🔧', 2),
    ('Half-Round Files', 'files-half-round', files_id, 'Полукръгли пили', '🔧', 3),
    ('Triangular Files', 'files-triangular', files_id, 'Триъгълни пили', '🔧', 4),
    ('Needle Files', 'files-needle', files_id, 'Иглени пили', '🔧', 5),
    ('Wood Rasps', 'rasps-wood', files_id, 'Дървени рашпили', '🔧', 6),
    ('Surform Tools', 'rasps-surform', files_id, 'Surform инструменти', '🔧', 7),
    ('File Sets', 'files-sets', files_id, 'Комплекти пили', '🔧', 8)
  ON CONFLICT (slug) DO NOTHING;

  -- Pry Bars & Crowbars L3
  INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
    ('Flat Pry Bars', 'pry-bars-flat', pry_bars_id, 'Плоски лостове', '🔧', 1),
    ('Wrecking Bars', 'pry-bars-wrecking', pry_bars_id, 'Крадци', '🔧', 2),
    ('Molding Bars', 'pry-bars-molding', pry_bars_id, 'Лостове за первази', '🔧', 3),
    ('Nail Pullers', 'pry-bars-nail-pullers', pry_bars_id, 'Клещи за пирони', '🔧', 4),
    ('Rolling Head Pry Bars', 'pry-bars-rolling', pry_bars_id, 'Лостове с въртяща глава', '🔧', 5),
    ('Indexing Pry Bars', 'pry-bars-indexing', pry_bars_id, 'Индексиращи лостове', '🔧', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Wrenches L3 (if parent exists)
  IF wrenches_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
      ('Adjustable Wrenches', 'wrenches-adjustable', wrenches_id, 'Регулируеми гаечни ключове', '🔧', 1),
      ('Combination Wrenches', 'wrenches-combination', wrenches_id, 'Комбинирани гаечни ключове', '🔧', 2),
      ('Socket Wrench Sets', 'wrenches-socket-sets', wrenches_id, 'Комплекти вложки', '🔧', 3),
      ('Torque Wrenches', 'wrenches-torque', wrenches_id, 'Динамометрични ключове', '🔧', 4),
      ('Pipe Wrenches', 'wrenches-pipe', wrenches_id, 'Тръбни ключове', '🔧', 5),
      ('Allen/Hex Keys', 'wrenches-hex-keys', wrenches_id, 'Имбусни ключове', '🔧', 6),
      ('Ratcheting Wrenches', 'wrenches-ratcheting', wrenches_id, 'Тресчоткови ключове', '🔧', 7),
      ('Crowfoot Wrenches', 'wrenches-crowfoot', wrenches_id, 'Вилкови ключове', '🔧', 8),
      ('Flare Nut Wrenches', 'wrenches-flare-nut', wrenches_id, 'Ключове за маслопроводи', '🔧', 9),
      ('Basin Wrenches', 'wrenches-basin', wrenches_id, 'Ключове за мивки', '🔧', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Screwdrivers L3 (if parent exists)
  IF screwdrivers_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
      ('Phillips Screwdrivers', 'screwdrivers-phillips', screwdrivers_id, 'Кръстати отвертки', '🔧', 1),
      ('Flathead Screwdrivers', 'screwdrivers-flathead', screwdrivers_id, 'Прави отвертки', '🔧', 2),
      ('Torx Screwdrivers', 'screwdrivers-torx', screwdrivers_id, 'Torx отвертки', '🔧', 3),
      ('Precision Screwdrivers', 'screwdrivers-precision', screwdrivers_id, 'Прецизни отвертки', '🔧', 4),
      ('Screwdriver Sets', 'screwdrivers-sets', screwdrivers_id, 'Комплекти отвертки', '🔧', 5),
      ('Insulated Screwdrivers', 'screwdrivers-insulated', screwdrivers_id, 'Изолирани отвертки', '🔧', 6),
      ('Impact Screwdrivers', 'screwdrivers-impact', screwdrivers_id, 'Ударни отвертки', '🔧', 7),
      ('Ratcheting Screwdrivers', 'screwdrivers-ratcheting', screwdrivers_id, 'Тресчоткови отвертки', '🔧', 8),
      ('Magnetic Screwdrivers', 'screwdrivers-magnetic', screwdrivers_id, 'Магнитни отвертки', '🔧', 9),
      ('Multi-Bit Screwdrivers', 'screwdrivers-multi-bit', screwdrivers_id, 'Многофункционални отвертки', '🔧', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pliers L3 (if parent exists)
  IF pliers_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order) VALUES
      ('Needle Nose Pliers', 'pliers-needle-nose', pliers_id, 'Клещи с дълъг нос', '🔧', 1),
      ('Slip Joint Pliers', 'pliers-slip-joint', pliers_id, 'Регулируеми клещи', '🔧', 2),
      ('Linesman Pliers', 'pliers-linesman', pliers_id, 'Комбинирани клещи', '🔧', 3),
      ('Locking Pliers', 'pliers-locking', pliers_id, 'Фиксиращи клещи', '🔧', 4),
      ('Channel Lock Pliers', 'pliers-channel-lock', pliers_id, 'Водопроводни клещи', '🔧', 5),
      ('Diagonal Cutting Pliers', 'pliers-diagonal', pliers_id, 'Странични резачки', '🔧', 6),
      ('End Cutting Pliers', 'pliers-end-cutting', pliers_id, 'Челни резачки', '🔧', 7),
      ('Fencing Pliers', 'pliers-fencing', pliers_id, 'Клещи за огради', '🔧', 8),
      ('Crimping Pliers', 'pliers-crimping', pliers_id, 'Кримпващи клещи', '🔧', 9),
      ('Plier Sets', 'pliers-sets', pliers_id, 'Комплекти клещи', '🔧', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;;
