
-- Batch 35: More detailed subcategories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Camera Bags - deeper levels
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'camera-backpacks';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Small Camera Backpacks', 'Малки фото раници', 'small-camera-backpacks', v_parent_id, 1),
      ('Large Camera Backpacks', 'Големи фото раници', 'large-camera-backpacks', v_parent_id, 2),
      ('Sling Camera Backpacks', 'Слинг фото раници', 'sling-camera-backpacks', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Computer Components deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'graphics-cards';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('NVIDIA RTX Series', 'NVIDIA RTX серия', 'nvidia-rtx', v_parent_id, 1),
      ('AMD Radeon Series', 'AMD Radeon серия', 'amd-radeon', v_parent_id, 2),
      ('Workstation GPUs', 'Работни станции GPU', 'workstation-gpus', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'processors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Intel Core i9', 'Intel Core i9', 'intel-core-i9', v_parent_id, 1),
      ('Intel Core i7', 'Intel Core i7', 'intel-core-i7', v_parent_id, 2),
      ('Intel Core i5', 'Intel Core i5', 'intel-core-i5', v_parent_id, 3),
      ('AMD Ryzen 9', 'AMD Ryzen 9', 'amd-ryzen-9', v_parent_id, 4),
      ('AMD Ryzen 7', 'AMD Ryzen 7', 'amd-ryzen-7', v_parent_id, 5),
      ('AMD Ryzen 5', 'AMD Ryzen 5', 'amd-ryzen-5', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'ram';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('DDR5 RAM', 'DDR5 RAM', 'ddr5-ram', v_parent_id, 1),
      ('DDR4 RAM', 'DDR4 RAM', 'ddr4-ram', v_parent_id, 2),
      ('Laptop RAM', 'Лаптоп RAM', 'laptop-ram', v_parent_id, 3),
      ('Server RAM', 'Сървърна RAM', 'server-ram', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'storage-drives';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('NVMe SSDs', 'NVMe SSD', 'nvme-ssds', v_parent_id, 1),
      ('SATA SSDs', 'SATA SSD', 'sata-ssds', v_parent_id, 2),
      ('Hard Drives', 'Твърди дискове', 'hard-drives-internal', v_parent_id, 3),
      ('External SSDs', 'Външни SSD', 'external-ssds', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Monitors deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gaming-monitors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('144Hz Gaming Monitors', '144Hz гейминг монитори', '144hz-gaming-monitors', v_parent_id, 1),
      ('240Hz Gaming Monitors', '240Hz гейминг монитори', '240hz-gaming-monitors', v_parent_id, 2),
      ('4K Gaming Monitors', '4K гейминг монитори', '4k-gaming-monitors', v_parent_id, 3),
      ('Ultrawide Gaming Monitors', 'Ултраширок гейминг монитор', 'ultrawide-gaming-monitors', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = '4k-monitors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('27" 4K Monitors', '27" 4K монитори', '27-inch-4k-monitors', v_parent_id, 1),
      ('32" 4K Monitors', '32" 4K монитори', '32-inch-4k-monitors', v_parent_id, 2),
      ('Professional 4K Monitors', 'Професионални 4K монитори', 'professional-4k-monitors', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Headphones deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wireless-headphones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Active Noise Cancelling', 'Активно шумопотискане', 'anc-headphones', v_parent_id, 1),
      ('True Wireless Earbuds', 'Безжични слушалки', 'true-wireless-earbuds', v_parent_id, 2),
      ('Wireless Gaming Headsets', 'Безжични гейминг слушалки', 'wireless-gaming-headsets', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wired-headphones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('In-Ear Monitors', 'Мониторни слушалки', 'in-ear-monitors', v_parent_id, 1),
      ('Studio Headphones', 'Студийни слушалки', 'studio-headphones', v_parent_id, 2),
      ('Open-Back Headphones', 'Отворени слушалки', 'open-back-headphones', v_parent_id, 3),
      ('Closed-Back Headphones', 'Затворени слушалки', 'closed-back-headphones', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Keyboards deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mechanical-keyboards';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Full-Size Mechanical', 'Пълноразмерни механични', 'full-size-mechanical', v_parent_id, 1),
      ('TKL Mechanical', 'TKL механични', 'tkl-mechanical', v_parent_id, 2),
      ('60% Mechanical', '60% механични', '60-percent-mechanical', v_parent_id, 3),
      ('75% Mechanical', '75% механични', '75-percent-mechanical', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wireless-keyboards';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bluetooth Keyboards', 'Bluetooth клавиатури', 'bluetooth-keyboards', v_parent_id, 1),
      ('2.4GHz Wireless Keyboards', '2.4GHz безжични', '2-4ghz-keyboards', v_parent_id, 2),
      ('Multi-Device Keyboards', 'Многоустройствени', 'multi-device-keyboards', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Mice deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gaming-mice';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wireless Gaming Mice', 'Безжични гейминг мишки', 'wireless-gaming-mice', v_parent_id, 1),
      ('Wired Gaming Mice', 'Кабелни гейминг мишки', 'wired-gaming-mice', v_parent_id, 2),
      ('Lightweight Gaming Mice', 'Леки гейминг мишки', 'lightweight-gaming-mice', v_parent_id, 3),
      ('MMO Gaming Mice', 'MMO гейминг мишки', 'mmo-gaming-mice', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Speakers deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bluetooth-speakers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Portable Bluetooth Speakers', 'Преносими Bluetooth колони', 'portable-bluetooth-speakers', v_parent_id, 1),
      ('Waterproof Speakers', 'Водоустойчиви колони', 'waterproof-speakers', v_parent_id, 2),
      ('Smart Speakers', 'Смарт колони', 'smart-speakers', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bookshelf-speakers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Passive Bookshelf Speakers', 'Пасивни настолни колони', 'passive-bookshelf-speakers', v_parent_id, 1),
      ('Powered Bookshelf Speakers', 'Активни настолни колони', 'powered-bookshelf-speakers', v_parent_id, 2)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Smart Home deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smart-lighting';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Smart LED Bulbs', 'Смарт LED крушки', 'smart-led-bulbs', v_parent_id, 1),
      ('Smart Light Strips', 'Смарт LED ленти', 'smart-light-strips', v_parent_id, 2),
      ('Smart Light Panels', 'Смарт светлинни панели', 'smart-light-panels', v_parent_id, 3),
      ('Smart Switches', 'Смарт ключове', 'smart-switches', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'security-cameras';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Indoor Security Cameras', 'Вътрешни камери', 'indoor-security-cameras', v_parent_id, 1),
      ('Outdoor Security Cameras', 'Външни камери', 'outdoor-security-cameras', v_parent_id, 2),
      ('Doorbell Cameras', 'Звънци с камера', 'doorbell-cameras', v_parent_id, 3),
      ('PTZ Cameras', 'PTZ камери', 'ptz-cameras', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smart-thermostats';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('WiFi Thermostats', 'WiFi термостати', 'wifi-thermostats', v_parent_id, 1),
      ('Learning Thermostats', 'Самообучаващи се термостати', 'learning-thermostats', v_parent_id, 2)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smart-locks';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Keypad Smart Locks', 'Смарт брави с клавиатура', 'keypad-smart-locks', v_parent_id, 1),
      ('Fingerprint Smart Locks', 'Биометрични смарт брави', 'fingerprint-smart-locks', v_parent_id, 2),
      ('WiFi Smart Locks', 'WiFi смарт брави', 'wifi-smart-locks', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
