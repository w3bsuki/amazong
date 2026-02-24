
-- Batch 52: More categories - Electronics accessories, Wearables, Gaming accessories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Wearables deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fitness-trackers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fitbit Trackers', 'Fitbit тракери', 'fitbit-trackers', v_parent_id, 1),
      ('Garmin Trackers', 'Garmin тракери', 'garmin-trackers', v_parent_id, 2),
      ('Xiaomi Band', 'Xiaomi Band', 'xiaomi-band', v_parent_id, 3),
      ('Basic Fitness Bands', 'Базови фитнес гривни', 'basic-fitness-bands', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vr-headsets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Meta Quest', 'Meta Quest', 'meta-quest', v_parent_id, 1),
      ('PlayStation VR', 'PlayStation VR', 'playstation-vr', v_parent_id, 2),
      ('PC VR Headsets', 'PC VR очила', 'pc-vr-headsets', v_parent_id, 3),
      ('VR Accessories', 'VR аксесоари', 'vr-accessories', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gaming Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gaming-controllers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('PlayStation Controllers', 'PlayStation контролери', 'playstation-controllers', v_parent_id, 1),
      ('Xbox Controllers', 'Xbox контролери', 'xbox-controllers', v_parent_id, 2),
      ('Nintendo Controllers', 'Nintendo контролери', 'nintendo-controllers', v_parent_id, 3),
      ('PC Game Controllers', 'PC контролери', 'pc-game-controllers', v_parent_id, 4),
      ('Racing Wheels', 'Волани за игри', 'racing-wheels', v_parent_id, 5),
      ('Fight Sticks', 'Аркадни стикове', 'fight-sticks', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gaming-headsets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('PC Gaming Headsets', 'PC гейминг слушалки', 'pc-gaming-headsets', v_parent_id, 1),
      ('Console Gaming Headsets', 'Конзолни гейминг слушалки', 'console-gaming-headsets', v_parent_id, 2),
      ('Wireless Gaming Headsets', 'Безжични гейминг слушалки', 'wireless-gaming-headsets-acc', v_parent_id, 3),
      ('Wired Gaming Headsets', 'Кабелни гейминг слушалки', 'wired-gaming-headsets', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gaming-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gaming Chairs', 'Гейминг столове', 'gaming-chairs-furniture', v_parent_id, 1),
      ('Gaming Desks', 'Гейминг бюра', 'gaming-desks', v_parent_id, 2),
      ('Gaming Tables', 'Гейминг маси', 'gaming-tables', v_parent_id, 3),
      ('Monitor Arms', 'Стойки за монитор', 'monitor-arms', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Streaming Equipment deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'streaming-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Webcams', 'Уеб камери', 'webcams', v_parent_id, 1),
      ('Stream Decks', 'Stream Deck', 'stream-decks', v_parent_id, 2),
      ('Capture Cards', 'Кепчър карти', 'capture-cards', v_parent_id, 3),
      ('Ring Lights', 'Ринг осветление', 'ring-lights', v_parent_id, 4),
      ('Green Screens', 'Зелени екрани', 'green-screens', v_parent_id, 5),
      ('Microphone Arms', 'Стойки за микрофон', 'microphone-arms', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- TV Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tv-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('TV Wall Mounts', 'Стойки за телевизор', 'tv-wall-mounts', v_parent_id, 1),
      ('TV Stands', 'Поставки за телевизор', 'tv-stands', v_parent_id, 2),
      ('Streaming Devices', 'Стрийминг устройства', 'streaming-devices', v_parent_id, 3),
      ('Universal Remotes', 'Универсални дистанционни', 'universal-remotes', v_parent_id, 4),
      ('HDMI Cables', 'HDMI кабели', 'hdmi-cables', v_parent_id, 5),
      ('Soundbars', 'Саундбари', 'soundbars', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Home Theater deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'home-theater';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('AV Receivers', 'AV ресивъри', 'av-receivers', v_parent_id, 1),
      ('Home Theater Systems', 'Домашни кина', 'home-theater-systems', v_parent_id, 2),
      ('Projectors', 'Проектори', 'projectors', v_parent_id, 3),
      ('Projector Screens', 'Екрани за проектор', 'projector-screens', v_parent_id, 4),
      ('Center Speakers', 'Централни тонколони', 'center-speakers', v_parent_id, 5),
      ('Surround Speakers', 'Съраунд тонколони', 'surround-speakers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hi-Fi Audio deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hi-fi-audio';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Amplifiers', 'Усилватели', 'amplifiers', v_parent_id, 1),
      ('DACs', 'ЦАП', 'dacs', v_parent_id, 2),
      ('Turntables Hi-Fi', 'Hi-Fi грамофони', 'turntables-hifi', v_parent_id, 3),
      ('CD Players', 'CD плейъри', 'cd-players', v_parent_id, 4),
      ('Network Streamers', 'Мрежови стриймъри', 'network-streamers', v_parent_id, 5),
      ('Hi-Fi Cables', 'Hi-Fi кабели', 'hifi-cables', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Portable Audio deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'portable-audio';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('MP3 Players', 'MP3 плейъри', 'mp3-players', v_parent_id, 1),
      ('DAPs', 'Цифрови аудио плейъри', 'daps', v_parent_id, 2),
      ('Portable Headphone Amps', 'Преносими усилватели', 'portable-headphone-amps', v_parent_id, 3),
      ('Portable Recorders', 'Преносими рекордери', 'portable-recorders', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
