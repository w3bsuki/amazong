
-- =====================================================
-- HOBBIES PART 5: Music & Vinyl + Outdoor Hobbies L2/L3
-- =====================================================

DO $$
DECLARE
  music_id UUID;
  outdoor_id UUID;
  instruments_id UUID;
  cat_id UUID;
BEGIN
  SELECT id INTO music_id FROM categories WHERE slug = 'movies-music';
  SELECT id INTO outdoor_id FROM categories WHERE slug = 'hobby-outdoor';
  SELECT id INTO instruments_id FROM categories WHERE slug = 'musical-instruments';
  
  -- ========== MUSIC & VINYL ==========
  -- L3: Vinyl Records (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'vinyl-records';
  IF cat_id IS NOT NULL THEN
    UPDATE categories SET display_order = 1 WHERE id = cat_id;
    -- L3 categories already exist from earlier migrations
  END IF;

  -- Update CDs
  UPDATE categories SET display_order = 2 WHERE slug = 'cds' AND parent_id = music_id;
  
  -- L2: Cassettes
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Cassette Tapes', 'Касети', 'cassettes', music_id, '📼', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Blank Cassettes', 'Празни касети', 'cassettes-blank', cat_id, '📼', 1),
  ('Pre-Recorded Cassettes', 'Записани касети', 'cassettes-recorded', cat_id, '🎵', 2),
  ('Rare Cassettes', 'Редки касети', 'cassettes-rare', cat_id, '💎', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Turntables & Equipment
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Turntables & Equipment', 'Грамофони и оборудване', 'turntables', music_id, '📻', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Record Players', 'Грамофони', 'turntables-players', cat_id, '📻', 1),
  ('Turntable Parts', 'Части за грамофони', 'turntables-parts', cat_id, '🔧', 2),
  ('Stylus & Cartridges', 'Игли и глави', 'turntables-stylus', cat_id, '📍', 3),
  ('Record Cleaning', 'Почистване на плочи', 'turntables-cleaning', cat_id, '🧹', 4),
  ('Record Storage', 'Съхранение на плочи', 'turntables-storage', cat_id, '📦', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Update Movie/Music Memorabilia
  UPDATE categories SET display_order = 5 WHERE slug = 'movie-memorabilia' AND parent_id = music_id;
  UPDATE categories SET display_order = 6 WHERE slug = 'music-memorabilia' AND parent_id = music_id;

  -- ========== MUSICAL INSTRUMENTS EXPANSION ==========
  -- L3: Guitars & Basses (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'guitars-basses';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Electric Guitars', 'Електрически китари', 'guitars-electric', cat_id, '🎸', 1),
    ('Acoustic Guitars', 'Акустични китари', 'guitars-acoustic', cat_id, '🎸', 2),
    ('Classical Guitars', 'Класически китари', 'guitars-classical', cat_id, '🎸', 3),
    ('Bass Guitars', 'Бас китари', 'guitars-bass', cat_id, '🎸', 4),
    ('Guitar Amplifiers', 'Усилватели', 'guitars-amps', cat_id, '🔊', 5),
    ('Guitar Pedals', 'Педали', 'guitars-pedals', cat_id, '🎛️', 6),
    ('Guitar Accessories', 'Аксесоари', 'guitars-accessories', cat_id, '🎵', 7)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L3: Keyboards & Pianos (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'keyboards-pianos';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Digital Pianos', 'Дигитални пиана', 'keys-digital', cat_id, '🎹', 1),
    ('Synthesizers', 'Синтезатори', 'keys-synth', cat_id, '🎹', 2),
    ('MIDI Controllers', 'MIDI контролери', 'keys-midi', cat_id, '🎛️', 3),
    ('Acoustic Pianos', 'Акустични пиана', 'keys-acoustic', cat_id, '🎹', 4),
    ('Organs', 'Органи', 'keys-organs', cat_id, '🎹', 5)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- L3: Drums & Percussion (expand existing)
  SELECT id INTO cat_id FROM categories WHERE slug = 'drums-percussion';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Acoustic Drums', 'Акустични барабани', 'drums-acoustic', cat_id, '🥁', 1),
    ('Electronic Drums', 'Електронни барабани', 'drums-electronic', cat_id, '🥁', 2),
    ('Cymbals', 'Чинели', 'drums-cymbals', cat_id, '🔔', 3),
    ('Hand Percussion', 'Ръчни перкусии', 'drums-hand', cat_id, '👏', 4),
    ('Drum Hardware', 'Стативи и хардуер', 'drums-hardware', cat_id, '🔧', 5)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- ========== OUTDOOR HOBBIES ==========
  -- L2: Fishing
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Fishing', 'Риболов', 'hobby-fishing', outdoor_id, '🎣', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Fishing Rods', 'Въдици', 'fishing-rods', cat_id, '🎣', 1),
  ('Fishing Reels', 'Макари', 'fishing-reels', cat_id, '🔄', 2),
  ('Lures & Baits', 'Примамки и стръв', 'fishing-lures', cat_id, '🪱', 3),
  ('Fishing Line', 'Корда', 'fishing-line', cat_id, '🧵', 4),
  ('Tackle Boxes', 'Кутии за принадлежности', 'fishing-tackle', cat_id, '📦', 5),
  ('Fishing Nets', 'Кепчета', 'fishing-nets', cat_id, '🥅', 6),
  ('Fishing Accessories', 'Аксесоари за риболов', 'fishing-accessories', cat_id, '🎣', 7),
  ('Ice Fishing', 'Подледен риболов', 'fishing-ice', cat_id, '❄️', 8),
  ('Fly Fishing', 'Мухарски риболов', 'fishing-fly', cat_id, '🪰', 9)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Hunting
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Hunting', 'Лов', 'hobby-hunting', outdoor_id, '🦌', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Hunting Optics', 'Оптика за лов', 'hunting-optics', cat_id, '🔭', 1),
  ('Hunting Clothing', 'Ловно облекло', 'hunting-clothing', cat_id, '🧥', 2),
  ('Game Calls', 'Ловни манки', 'hunting-calls', cat_id, '📢', 3),
  ('Hunting Blinds', 'Ловни скривалища', 'hunting-blinds', cat_id, '🏕️', 4),
  ('Trail Cameras', 'Ловни камери', 'hunting-cameras', cat_id, '📷', 5),
  ('Hunting Knives', 'Ловни ножове', 'hunting-knives', cat_id, '🔪', 6),
  ('Decoys', 'Декои', 'hunting-decoys', cat_id, '🦆', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Birdwatching
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Birdwatching', 'Наблюдение на птици', 'hobby-birdwatching', outdoor_id, '🦅', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Binoculars', 'Бинокли', 'bird-binoculars', cat_id, '🔭', 1),
  ('Spotting Scopes', 'Телескопи', 'bird-scopes', cat_id, '🔬', 2),
  ('Bird Feeders', 'Хранилки за птици', 'bird-feeders', cat_id, '🏠', 3),
  ('Bird Houses', 'Къщички за птици', 'bird-houses', cat_id, '🏡', 4),
  ('Field Guides', 'Полеви справочници', 'bird-guides', cat_id, '📖', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Gardening as Hobby
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Hobby Gardening', 'Градинарство хоби', 'hobby-gardening', outdoor_id, '🌻', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Seeds & Bulbs', 'Семена и луковици', 'garden-seeds', cat_id, '🌱', 1),
  ('Bonsai', 'Бонсай', 'garden-bonsai', cat_id, '🌳', 2),
  ('Succulents & Cacti', 'Сукуленти и кактуси', 'garden-succulents', cat_id, '🌵', 3),
  ('Indoor Plants', 'Стайни растения', 'garden-indoor', cat_id, '🪴', 4),
  ('Hydroponics', 'Хидропоника', 'garden-hydroponics', cat_id, '💧', 5),
  ('Garden Décor', 'Градински декор', 'garden-decor', cat_id, '🏺', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Astronomy
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Astronomy', 'Астрономия', 'hobby-astronomy', outdoor_id, '🔭', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Telescopes', 'Телескопи', 'astro-telescopes', cat_id, '🔭', 1),
  ('Telescope Mounts', 'Монтажи', 'astro-mounts', cat_id, '🔩', 2),
  ('Eyepieces & Filters', 'Окуляри и филтри', 'astro-eyepieces', cat_id, '👁️', 3),
  ('Astrophotography', 'Астрофотография', 'astro-photography', cat_id, '📷', 4),
  ('Star Charts & Maps', 'Звездни карти', 'astro-charts', cat_id, '🗺️', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

END $$;
;
