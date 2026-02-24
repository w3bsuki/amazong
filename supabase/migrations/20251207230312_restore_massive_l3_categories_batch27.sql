
-- Batch 27: Electronics deep categories - Computers, Phones, Audio, TV
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Computers L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'laptops';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gaming Laptops', 'Геймърски лаптопи', 'gaming-laptops', v_parent_id, 1),
      ('Business Laptops', 'Бизнес лаптопи', 'business-laptops', v_parent_id, 2),
      ('Ultrabooks', 'Ултрабуци', 'ultrabooks', v_parent_id, 3),
      ('Chromebooks', 'Хромбуци', 'chromebooks', v_parent_id, 4),
      ('2-in-1 Laptops', 'Лаптопи 2-в-1', '2-in-1-laptops', v_parent_id, 5),
      ('Budget Laptops', 'Бюджетни лаптопи', 'budget-laptops', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'desktops';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gaming Desktops', 'Геймърски настолни компютри', 'gaming-desktops', v_parent_id, 1),
      ('All-in-One PCs', 'All-in-One компютри', 'all-in-one-pcs', v_parent_id, 2),
      ('Workstations', 'Работни станции', 'workstations', v_parent_id, 3),
      ('Mini PCs', 'Мини компютри', 'mini-pcs', v_parent_id, 4),
      ('Custom Build PCs', 'Персонализирани компютри', 'custom-build-pcs', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'monitors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gaming Monitors', 'Геймърски монитори', 'gaming-monitors', v_parent_id, 1),
      ('4K Monitors', '4K монитори', '4k-monitors', v_parent_id, 2),
      ('Ultrawide Monitors', 'Ултраширок монитори', 'ultrawide-monitors', v_parent_id, 3),
      ('Curved Monitors', 'Извити монитори', 'curved-monitors', v_parent_id, 4),
      ('Professional Monitors', 'Професионални монитори', 'professional-monitors', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'computer-components';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('CPUs', 'Процесори', 'cpus', v_parent_id, 1),
      ('Graphics Cards', 'Видео карти', 'graphics-cards', v_parent_id, 2),
      ('Motherboards', 'Дънни платки', 'motherboards', v_parent_id, 3),
      ('RAM', 'RAM памет', 'ram', v_parent_id, 4),
      ('Storage Drives', 'Твърди дискове', 'storage-drives', v_parent_id, 5),
      ('Power Supplies', 'Захранвания', 'power-supplies', v_parent_id, 6),
      ('Computer Cases', 'Компютърни кутии', 'computer-cases', v_parent_id, 7),
      ('Cooling', 'Охлаждане', 'cooling', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'computer-peripherals';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Keyboards', 'Клавиатури', 'keyboards', v_parent_id, 1),
      ('Mice', 'Мишки', 'mice', v_parent_id, 2),
      ('Webcams', 'Уеб камери', 'webcams', v_parent_id, 3),
      ('External Drives', 'Външни дискове', 'external-drives', v_parent_id, 4),
      ('USB Hubs', 'USB хъбове', 'usb-hubs', v_parent_id, 5),
      ('Printers', 'Принтери', 'printers', v_parent_id, 6),
      ('Scanners', 'Скенери', 'scanners', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Mobile Devices L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smartphones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('iPhone', 'iPhone', 'iphone', v_parent_id, 1),
      ('Samsung Galaxy', 'Samsung Galaxy', 'samsung-galaxy', v_parent_id, 2),
      ('Google Pixel', 'Google Pixel', 'google-pixel', v_parent_id, 3),
      ('OnePlus', 'OnePlus', 'oneplus', v_parent_id, 4),
      ('Xiaomi', 'Xiaomi', 'xiaomi', v_parent_id, 5),
      ('Budget Phones', 'Бюджетни телефони', 'budget-phones', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tablets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('iPad', 'iPad', 'ipad', v_parent_id, 1),
      ('Android Tablets', 'Android таблети', 'android-tablets', v_parent_id, 2),
      ('Windows Tablets', 'Windows таблети', 'windows-tablets', v_parent_id, 3),
      ('Kids Tablets', 'Детски таблети', 'kids-tablets', v_parent_id, 4),
      ('E-Readers', 'Четци за електронни книги', 'e-readers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'phone-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Phone Cases', 'Калъфи за телефони', 'phone-cases', v_parent_id, 1),
      ('Screen Protectors', 'Протектори за екран', 'screen-protectors', v_parent_id, 2),
      ('Chargers', 'Зарядни устройства', 'chargers', v_parent_id, 3),
      ('Power Banks', 'Преносими батерии', 'power-banks', v_parent_id, 4),
      ('Phone Mounts', 'Стойки за телефони', 'phone-mounts', v_parent_id, 5),
      ('Wireless Chargers', 'Безжични зарядни', 'wireless-chargers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Audio L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'headphones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Over-Ear Headphones', 'Наушници', 'over-ear-headphones', v_parent_id, 1),
      ('On-Ear Headphones', 'Слушалки на ухо', 'on-ear-headphones', v_parent_id, 2),
      ('In-Ear Earphones', 'Слушалки в ухо', 'in-ear-earphones', v_parent_id, 3),
      ('Wireless Headphones', 'Безжични слушалки', 'wireless-headphones', v_parent_id, 4),
      ('Noise Canceling', 'С шумопотискане', 'noise-canceling', v_parent_id, 5),
      ('Gaming Headsets', 'Геймърски слушалки', 'gaming-headsets', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'speakers-audio';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bluetooth Speakers', 'Bluetooth тонколони', 'bluetooth-speakers', v_parent_id, 1),
      ('Smart Speakers', 'Смарт тонколони', 'smart-speakers', v_parent_id, 2),
      ('Home Theater', 'Домашно кино', 'home-theater', v_parent_id, 3),
      ('Soundbars', 'Саундбарове', 'soundbars', v_parent_id, 4),
      ('Bookshelf Speakers', 'Рафтови тонколони', 'bookshelf-speakers', v_parent_id, 5),
      ('Subwoofers', 'Субуфери', 'subwoofers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- TV & Video L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'televisions';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('OLED TVs', 'OLED телевизори', 'oled-tvs', v_parent_id, 1),
      ('QLED TVs', 'QLED телевизори', 'qled-tvs', v_parent_id, 2),
      ('4K TVs', '4K телевизори', '4k-tvs', v_parent_id, 3),
      ('8K TVs', '8K телевизори', '8k-tvs', v_parent_id, 4),
      ('Smart TVs', 'Смарт телевизори', 'smart-tvs', v_parent_id, 5),
      ('Budget TVs', 'Бюджетни телевизори', 'budget-tvs', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'streaming-devices';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fire TV', 'Fire TV', 'fire-tv', v_parent_id, 1),
      ('Roku', 'Roku', 'roku', v_parent_id, 2),
      ('Apple TV', 'Apple TV', 'apple-tv', v_parent_id, 3),
      ('Chromecast', 'Chromecast', 'chromecast', v_parent_id, 4),
      ('Android TV Box', 'Android TV Box', 'android-tv-box', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'projectors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Home Theater Projectors', 'Проектори за домашно кино', 'home-theater-projectors', v_parent_id, 1),
      ('Portable Projectors', 'Преносими проектори', 'portable-projectors', v_parent_id, 2),
      ('Business Projectors', 'Бизнес проектори', 'business-projectors', v_parent_id, 3),
      ('Short Throw Projectors', 'Късофокусни проектори', 'short-throw-projectors', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gaming L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gaming-consoles';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('PlayStation', 'PlayStation', 'playstation', v_parent_id, 1),
      ('Xbox', 'Xbox', 'xbox', v_parent_id, 2),
      ('Nintendo Switch', 'Nintendo Switch', 'nintendo-switch', v_parent_id, 3),
      ('Handheld Consoles', 'Преносими конзоли', 'handheld-consoles', v_parent_id, 4),
      ('Retro Consoles', 'Ретро конзоли', 'retro-consoles', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gaming-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Controllers', 'Контролери', 'controllers', v_parent_id, 1),
      ('Gaming Keyboards', 'Геймърски клавиатури', 'gaming-keyboards', v_parent_id, 2),
      ('Gaming Mice', 'Геймърски мишки', 'gaming-mice', v_parent_id, 3),
      ('Gaming Chairs', 'Геймърски столове', 'gaming-chairs', v_parent_id, 4),
      ('Gaming Desks', 'Геймърски бюра', 'gaming-desks', v_parent_id, 5),
      ('VR Headsets', 'VR очила', 'vr-headsets', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'video-games';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('PlayStation Games', 'PlayStation игри', 'playstation-games', v_parent_id, 1),
      ('Xbox Games', 'Xbox игри', 'xbox-games', v_parent_id, 2),
      ('Nintendo Games', 'Nintendo игри', 'nintendo-games', v_parent_id, 3),
      ('PC Games', 'PC игри', 'pc-games', v_parent_id, 4),
      ('Game Gift Cards', 'Карти за игри', 'game-gift-cards', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
