
-- Restore massive batch of L3 categories - batch 5 (Electronics Deep Dive)
DO $$
DECLARE
  -- Phone Categories
  v_smartphones_id UUID;
  v_phone_cases_id UUID;
  v_phone_chargers_id UUID;
  v_screen_protectors_id UUID;
  -- Audio Categories
  v_headphones_id UUID;
  v_speakers_id UUID;
  v_earbuds_id UUID;
  v_soundbars_id UUID;
  -- Camera Categories
  v_dslr_id UUID;
  v_mirrorless_id UUID;
  v_camera_lenses_id UUID;
  v_camera_accessories_id UUID;
  -- TV Categories
  v_led_tvs_id UUID;
  v_smart_tvs_id UUID;
  v_tv_accessories_id UUID;
  -- Laptop Categories
  v_gaming_laptops_id UUID;
  v_ultrabooks_id UUID;
  v_laptop_accessories_id UUID;
BEGIN
  -- Get Phone L2 IDs
  SELECT id INTO v_smartphones_id FROM categories WHERE slug = 'smartphones';
  SELECT id INTO v_phone_cases_id FROM categories WHERE slug = 'phone-cases';
  SELECT id INTO v_phone_chargers_id FROM categories WHERE slug = 'chargers-cables';
  SELECT id INTO v_screen_protectors_id FROM categories WHERE slug = 'screen-protectors';

  -- Get Audio L2 IDs
  SELECT id INTO v_headphones_id FROM categories WHERE slug = 'headphones';
  SELECT id INTO v_speakers_id FROM categories WHERE slug = 'speakers';
  SELECT id INTO v_earbuds_id FROM categories WHERE slug = 'earbuds';
  SELECT id INTO v_soundbars_id FROM categories WHERE slug = 'soundbars';

  -- Get Camera L2 IDs
  SELECT id INTO v_dslr_id FROM categories WHERE slug = 'dslr-cameras';
  SELECT id INTO v_mirrorless_id FROM categories WHERE slug = 'mirrorless-cameras';
  SELECT id INTO v_camera_lenses_id FROM categories WHERE slug = 'camera-lenses';
  SELECT id INTO v_camera_accessories_id FROM categories WHERE slug = 'camera-accessories';

  -- Get TV L2 IDs
  SELECT id INTO v_led_tvs_id FROM categories WHERE slug = 'led-tvs';
  SELECT id INTO v_smart_tvs_id FROM categories WHERE slug = 'smart-tvs';
  SELECT id INTO v_tv_accessories_id FROM categories WHERE slug = 'tv-accessories';

  -- Get Laptop L2 IDs
  SELECT id INTO v_gaming_laptops_id FROM categories WHERE slug = 'gaming-laptops';
  SELECT id INTO v_ultrabooks_id FROM categories WHERE slug = 'ultrabooks';
  SELECT id INTO v_laptop_accessories_id FROM categories WHERE slug = 'laptop-accessories';

  -- SMARTPHONES L3 (by brand)
  IF v_smartphones_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('iPhone', 'iPhone', 'iphone', v_smartphones_id, 1),
    ('Samsung Galaxy', 'Samsung Galaxy', 'samsung-galaxy', v_smartphones_id, 2),
    ('Google Pixel', 'Google Pixel', 'google-pixel', v_smartphones_id, 3),
    ('OnePlus', 'OnePlus', 'oneplus-phones', v_smartphones_id, 4),
    ('Xiaomi', 'Xiaomi', 'xiaomi-phones', v_smartphones_id, 5),
    ('OPPO', 'OPPO', 'oppo-phones', v_smartphones_id, 6),
    ('Vivo', 'Vivo', 'vivo-phones', v_smartphones_id, 7),
    ('Motorola', 'Motorola', 'motorola-phones', v_smartphones_id, 8),
    ('Sony Xperia', 'Sony Xperia', 'sony-xperia', v_smartphones_id, 9),
    ('Nothing Phone', 'Nothing Phone', 'nothing-phone', v_smartphones_id, 10),
    ('Huawei', 'Huawei', 'huawei-phones', v_smartphones_id, 11),
    ('ASUS ROG Phone', 'ASUS ROG Phone', 'asus-rog-phone', v_smartphones_id, 12),
    ('Realme', 'Realme', 'realme-phones', v_smartphones_id, 13),
    ('Nokia', 'Nokia', 'nokia-phones', v_smartphones_id, 14)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- PHONE CASES L3
  IF v_phone_cases_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('iPhone Cases', 'Калъфи за iPhone', 'iphone-cases', v_phone_cases_id, 1),
    ('Samsung Cases', 'Калъфи за Samsung', 'samsung-cases', v_phone_cases_id, 2),
    ('Pixel Cases', 'Калъфи за Pixel', 'pixel-cases', v_phone_cases_id, 3),
    ('Clear Cases', 'Прозрачни калъфи', 'clear-cases', v_phone_cases_id, 4),
    ('Leather Cases', 'Кожени калъфи', 'leather-phone-cases', v_phone_cases_id, 5),
    ('Wallet Cases', 'Портфейлни калъфи', 'wallet-cases', v_phone_cases_id, 6),
    ('Rugged Cases', 'Удароустойчиви калъфи', 'rugged-cases', v_phone_cases_id, 7),
    ('Designer Cases', 'Дизайнерски калъфи', 'designer-cases', v_phone_cases_id, 8),
    ('MagSafe Cases', 'MagSafe калъфи', 'magsafe-cases', v_phone_cases_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- PHONE CHARGERS L3
  IF v_phone_chargers_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Fast Chargers', 'Бързи зарядни', 'fast-chargers', v_phone_chargers_id, 1),
    ('Wireless Chargers', 'Безжични зарядни', 'wireless-chargers', v_phone_chargers_id, 2),
    ('USB-C Chargers', 'USB-C зарядни', 'usb-c-chargers', v_phone_chargers_id, 3),
    ('Car Chargers', 'Зарядни за кола', 'car-chargers', v_phone_chargers_id, 4),
    ('MagSafe Chargers', 'MagSafe зарядни', 'magsafe-chargers', v_phone_chargers_id, 5),
    ('Power Banks', 'Външни батерии', 'power-banks', v_phone_chargers_id, 6),
    ('Charging Cables', 'Зарядни кабели', 'charging-cables', v_phone_chargers_id, 7),
    ('Multi-Port Chargers', 'Многопортови зарядни', 'multi-port-chargers', v_phone_chargers_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- HEADPHONES L3
  IF v_headphones_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Over-Ear Headphones', 'Слушалки около ухото', 'over-ear-headphones', v_headphones_id, 1),
    ('On-Ear Headphones', 'Слушалки на ухото', 'on-ear-headphones', v_headphones_id, 2),
    ('Wireless Headphones', 'Безжични слушалки', 'wireless-headphones', v_headphones_id, 3),
    ('Noise-Canceling Headphones', 'Шумопотискащи слушалки', 'noise-canceling-headphones', v_headphones_id, 4),
    ('Gaming Headphones', 'Геймърски слушалки', 'gaming-headphones', v_headphones_id, 5),
    ('Studio Headphones', 'Студийни слушалки', 'studio-headphones', v_headphones_id, 6),
    ('DJ Headphones', 'DJ слушалки', 'dj-headphones', v_headphones_id, 7),
    ('Kids Headphones', 'Детски слушалки', 'kids-headphones', v_headphones_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- SPEAKERS L3
  IF v_speakers_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bluetooth Speakers', 'Bluetooth колони', 'bluetooth-speakers', v_speakers_id, 1),
    ('Portable Speakers', 'Преносими колони', 'portable-speakers', v_speakers_id, 2),
    ('Smart Speakers', 'Смарт колони', 'smart-speakers', v_speakers_id, 3),
    ('Bookshelf Speakers', 'Рафтови колони', 'bookshelf-speakers', v_speakers_id, 4),
    ('Floor-Standing Speakers', 'Стоящи колони', 'floor-standing-speakers', v_speakers_id, 5),
    ('Outdoor Speakers', 'Външни колони', 'outdoor-speakers', v_speakers_id, 6),
    ('Party Speakers', 'Парти колони', 'party-speakers', v_speakers_id, 7),
    ('Studio Monitors', 'Студийни монитори', 'studio-monitors', v_speakers_id, 8),
    ('Subwoofers', 'Субуфери', 'subwoofers', v_speakers_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- EARBUDS L3
  IF v_earbuds_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('True Wireless Earbuds', 'Истински безжични слушалки', 'true-wireless-earbuds', v_earbuds_id, 1),
    ('Noise-Canceling Earbuds', 'Шумопотискащи слушалки', 'noise-canceling-earbuds', v_earbuds_id, 2),
    ('Sports Earbuds', 'Спортни слушалки', 'sports-earbuds', v_earbuds_id, 3),
    ('Wired Earbuds', 'Кабелни слушалки', 'wired-earbuds', v_earbuds_id, 4),
    ('Gaming Earbuds', 'Геймърски слушалки', 'gaming-earbuds', v_earbuds_id, 5),
    ('AirPods', 'AirPods', 'airpods', v_earbuds_id, 6),
    ('Galaxy Buds', 'Galaxy Buds', 'galaxy-buds', v_earbuds_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- DSLR CAMERAS L3
  IF v_dslr_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Canon DSLR', 'Canon DSLR', 'canon-dslr', v_dslr_id, 1),
    ('Nikon DSLR', 'Nikon DSLR', 'nikon-dslr', v_dslr_id, 2),
    ('Entry-Level DSLR', 'DSLR за начинаещи', 'entry-level-dslr', v_dslr_id, 3),
    ('Professional DSLR', 'Професионални DSLR', 'professional-dslr', v_dslr_id, 4),
    ('Full-Frame DSLR', 'Пълен кадър DSLR', 'full-frame-dslr', v_dslr_id, 5),
    ('APS-C DSLR', 'APS-C DSLR', 'aps-c-dslr', v_dslr_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- MIRRORLESS CAMERAS L3
  IF v_mirrorless_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Sony Mirrorless', 'Sony Безогледални', 'sony-mirrorless', v_mirrorless_id, 1),
    ('Canon Mirrorless', 'Canon Безогледални', 'canon-mirrorless', v_mirrorless_id, 2),
    ('Nikon Mirrorless', 'Nikon Безогледални', 'nikon-mirrorless', v_mirrorless_id, 3),
    ('Fujifilm Mirrorless', 'Fujifilm Безогледални', 'fujifilm-mirrorless', v_mirrorless_id, 4),
    ('Panasonic Mirrorless', 'Panasonic Безогледални', 'panasonic-mirrorless', v_mirrorless_id, 5),
    ('Full-Frame Mirrorless', 'Пълен кадър безогледални', 'full-frame-mirrorless', v_mirrorless_id, 6),
    ('APS-C Mirrorless', 'APS-C Безогледални', 'aps-c-mirrorless', v_mirrorless_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- CAMERA LENSES L3
  IF v_camera_lenses_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Wide-Angle Lenses', 'Широкоъгълни обективи', 'wide-angle-lenses', v_camera_lenses_id, 1),
    ('Telephoto Lenses', 'Телефото обективи', 'telephoto-lenses', v_camera_lenses_id, 2),
    ('Prime Lenses', 'Фикс обективи', 'prime-lenses', v_camera_lenses_id, 3),
    ('Zoom Lenses', 'Зум обективи', 'zoom-lenses', v_camera_lenses_id, 4),
    ('Macro Lenses', 'Макро обективи', 'macro-lenses', v_camera_lenses_id, 5),
    ('Portrait Lenses', 'Портретни обективи', 'portrait-lenses', v_camera_lenses_id, 6),
    ('Canon Lenses', 'Canon обективи', 'canon-lenses', v_camera_lenses_id, 7),
    ('Nikon Lenses', 'Nikon обективи', 'nikon-lenses', v_camera_lenses_id, 8),
    ('Sony Lenses', 'Sony обективи', 'sony-lenses', v_camera_lenses_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- LED TVs L3
  IF v_led_tvs_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('32 inch TVs', '32 инчови телевизори', '32-inch-tvs', v_led_tvs_id, 1),
    ('40-43 inch TVs', '40-43 инчови телевизори', '40-43-inch-tvs', v_led_tvs_id, 2),
    ('50-55 inch TVs', '50-55 инчови телевизори', '50-55-inch-tvs', v_led_tvs_id, 3),
    ('65 inch TVs', '65 инчови телевизори', '65-inch-tvs', v_led_tvs_id, 4),
    ('75+ inch TVs', '75+ инчови телевизори', '75-plus-inch-tvs', v_led_tvs_id, 5),
    ('4K TVs', '4K телевизори', '4k-tvs', v_led_tvs_id, 6),
    ('8K TVs', '8K телевизори', '8k-tvs', v_led_tvs_id, 7),
    ('OLED TVs', 'OLED телевизори', 'oled-tvs', v_led_tvs_id, 8),
    ('QLED TVs', 'QLED телевизори', 'qled-tvs', v_led_tvs_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- GAMING LAPTOPS L3
  IF v_gaming_laptops_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('ASUS ROG Laptops', 'ASUS ROG лаптопи', 'asus-rog-laptops', v_gaming_laptops_id, 1),
    ('MSI Gaming Laptops', 'MSI геймърски лаптопи', 'msi-gaming-laptops', v_gaming_laptops_id, 2),
    ('Razer Laptops', 'Razer лаптопи', 'razer-laptops', v_gaming_laptops_id, 3),
    ('Alienware Laptops', 'Alienware лаптопи', 'alienware-laptops', v_gaming_laptops_id, 4),
    ('Acer Predator', 'Acer Predator', 'acer-predator', v_gaming_laptops_id, 5),
    ('Lenovo Legion', 'Lenovo Legion', 'lenovo-legion', v_gaming_laptops_id, 6),
    ('HP Omen', 'HP Omen', 'hp-omen', v_gaming_laptops_id, 7),
    ('Budget Gaming Laptops', 'Бюджетни геймърски', 'budget-gaming-laptops', v_gaming_laptops_id, 8),
    ('High-End Gaming Laptops', 'Висок клас геймърски', 'high-end-gaming-laptops', v_gaming_laptops_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- LAPTOP ACCESSORIES L3
  IF v_laptop_accessories_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Laptop Bags', 'Чанти за лаптоп', 'laptop-bags', v_laptop_accessories_id, 1),
    ('Laptop Stands', 'Стойки за лаптоп', 'laptop-stands', v_laptop_accessories_id, 2),
    ('Laptop Sleeves', 'Калъфи за лаптоп', 'laptop-sleeves', v_laptop_accessories_id, 3),
    ('Laptop Chargers', 'Зарядни за лаптоп', 'laptop-chargers', v_laptop_accessories_id, 4),
    ('Laptop Docking Stations', 'Докинг станции', 'laptop-docking-stations', v_laptop_accessories_id, 5),
    ('External Keyboards', 'Външни клавиатури', 'external-keyboards', v_laptop_accessories_id, 6),
    ('External Mice', 'Външни мишки', 'external-mice', v_laptop_accessories_id, 7),
    ('Laptop Cooling Pads', 'Охладители за лаптоп', 'laptop-cooling-pads', v_laptop_accessories_id, 8),
    ('USB Hubs', 'USB хъбове', 'usb-hubs', v_laptop_accessories_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Massive L3 categories batch 5 restored';
END $$;
;
