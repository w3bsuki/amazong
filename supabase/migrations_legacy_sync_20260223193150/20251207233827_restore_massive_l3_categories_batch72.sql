
-- Batch 72: Audio, Video, and Smart Home categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Headphones deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'headphones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Over-Ear Headphones', 'Слушалки над ухото', 'over-ear-headphones', v_parent_id, 1),
      ('On-Ear Headphones', 'Слушалки на ухото', 'on-ear-headphones', v_parent_id, 2),
      ('In-Ear Headphones', 'Слушалки в ухото', 'in-ear-headphones', v_parent_id, 3),
      ('Wireless Headphones', 'Безжични слушалки', 'wireless-headphones', v_parent_id, 4),
      ('Gaming Headsets', 'Гейминг слушалки', 'gaming-headsets', v_parent_id, 5),
      ('Noise Cancelling', 'С шумопотискане', 'noise-cancelling', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Speakers deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'speakers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bluetooth Speakers', 'Bluetooth колонки', 'bluetooth-speakers', v_parent_id, 1),
      ('Smart Speakers', 'Смарт колонки', 'smart-speakers', v_parent_id, 2),
      ('Soundbars', 'Саундбари', 'soundbars', v_parent_id, 3),
      ('Home Theater Systems', 'Домашни кина', 'home-theater-systems', v_parent_id, 4),
      ('Portable Speakers', 'Преносими колонки', 'portable-speakers', v_parent_id, 5),
      ('Bookshelf Speakers', 'Рафтови колонки', 'bookshelf-speakers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- TVs deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tvs';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('LED TVs', 'LED телевизори', 'led-tvs', v_parent_id, 1),
      ('OLED TVs', 'OLED телевизори', 'oled-tvs', v_parent_id, 2),
      ('QLED TVs', 'QLED телевизори', 'qled-tvs', v_parent_id, 3),
      ('4K TVs', '4K телевизори', '4k-tvs', v_parent_id, 4),
      ('8K TVs', '8K телевизори', '8k-tvs', v_parent_id, 5),
      ('Smart TVs', 'Смарт телевизори', 'smart-tvs', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cameras deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cameras';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('DSLR Cameras', 'DSLR фотоапарати', 'dslr-cameras', v_parent_id, 1),
      ('Mirrorless Cameras', 'Безогледални фотоапарати', 'mirrorless-cameras', v_parent_id, 2),
      ('Point and Shoot', 'Компактни фотоапарати', 'point-and-shoot', v_parent_id, 3),
      ('Action Cameras', 'Екшън камери', 'action-cameras', v_parent_id, 4),
      ('Instant Cameras', 'Моментални камери', 'instant-cameras', v_parent_id, 5),
      ('Camera Lenses', 'Обективи', 'camera-lenses', v_parent_id, 6),
      ('Camera Bags', 'Чанти за фотоапарати', 'camera-bags', v_parent_id, 7),
      ('Camera Tripods', 'Статици за фотоапарати', 'camera-tripods', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Smart Home deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smart-home';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Smart Lights', 'Смарт осветление', 'smart-lights', v_parent_id, 1),
      ('Smart Thermostats', 'Смарт термостати', 'smart-thermostats', v_parent_id, 2),
      ('Smart Locks', 'Смарт брави', 'smart-locks', v_parent_id, 3),
      ('Smart Doorbells', 'Смарт звънци', 'smart-doorbells', v_parent_id, 4),
      ('Security Cameras Home', 'Охранителни камери', 'security-cameras-home', v_parent_id, 5),
      ('Smart Plugs', 'Смарт контакти', 'smart-plugs', v_parent_id, 6),
      ('Voice Assistants', 'Гласови асистенти', 'voice-assistants', v_parent_id, 7),
      ('Smart Sensors', 'Смарт сензори', 'smart-sensors', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gaming deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gaming';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('PlayStation', 'Плейстейшън', 'playstation', v_parent_id, 1),
      ('Xbox', 'Хбокс', 'xbox', v_parent_id, 2),
      ('Nintendo', 'Нинтендо', 'nintendo', v_parent_id, 3),
      ('PC Gaming', 'PC гейминг', 'pc-gaming', v_parent_id, 4),
      ('VR Gaming', 'VR гейминг', 'vr-gaming', v_parent_id, 5),
      ('Gaming Chairs', 'Гейминг столове', 'gaming-chairs', v_parent_id, 6),
      ('Gaming Desks', 'Гейминг бюра', 'gaming-desks', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Wearables deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wearables';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Smartwatches', 'Смарт часовници', 'smartwatches', v_parent_id, 1),
      ('Fitness Trackers', 'Фитнес гривни', 'fitness-trackers', v_parent_id, 2),
      ('VR Headsets', 'VR очила', 'vr-headsets', v_parent_id, 3),
      ('Smart Glasses', 'Смарт очила', 'smart-glasses', v_parent_id, 4),
      ('Wearable Cameras', 'Носими камери', 'wearable-cameras', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
