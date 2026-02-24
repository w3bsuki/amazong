
-- Batch 77: More categories to exceed 7100
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Sleepwear deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sleepwear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pajama Sets', 'Пижами комплекти', 'pajama-sets', v_parent_id, 1),
      ('Nightgowns', 'Нощници', 'nightgowns', v_parent_id, 2),
      ('Robes', 'Халати', 'robes', v_parent_id, 3),
      ('Sleep Shorts', 'Шорти за сън', 'sleep-shorts', v_parent_id, 4),
      ('Sleep Tops', 'Блузи за сън', 'sleep-tops', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Socks deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'socks';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Athletic Socks', 'Спортни чорапи', 'athletic-socks', v_parent_id, 1),
      ('Dress Socks', 'Официални чорапи', 'dress-socks', v_parent_id, 2),
      ('Casual Socks', 'Ежедневни чорапи', 'casual-socks', v_parent_id, 3),
      ('Compression Socks', 'Компресионни чорапи', 'compression-socks', v_parent_id, 4),
      ('Ankle Socks', 'Чорапи глезенки', 'ankle-socks', v_parent_id, 5),
      ('Wool Socks', 'Вълнени чорапи', 'wool-socks', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Underwear deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'underwear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Boxers', 'Боксерки', 'boxers', v_parent_id, 1),
      ('Briefs', 'Слипове', 'briefs', v_parent_id, 2),
      ('Boxer Briefs', 'Боксерки слипове', 'boxer-briefs', v_parent_id, 3),
      ('Undershirts', 'Потници бельо', 'undershirts', v_parent_id, 4),
      ('Panties', 'Бикини', 'panties', v_parent_id, 5),
      ('Bras', 'Сутиени', 'bras', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Home Security deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'home-security';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Security Systems', 'Охранителни системи', 'security-systems', v_parent_id, 1),
      ('Security Cameras', 'Охранителни камери', 'security-cameras', v_parent_id, 2),
      ('Motion Sensors', 'Датчици за движение', 'motion-sensors', v_parent_id, 3),
      ('Door Sensors', 'Датчици за врати', 'door-sensors', v_parent_id, 4),
      ('Safes', 'Сейфове', 'safes', v_parent_id, 5),
      ('Video Doorbells', 'Видео звънци', 'video-doorbells', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Networking deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'networking';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Routers', 'Рутери', 'routers', v_parent_id, 1),
      ('Modems', 'Модеми', 'modems', v_parent_id, 2),
      ('WiFi Extenders', 'WiFi усилватели', 'wifi-extenders', v_parent_id, 3),
      ('Network Switches', 'Мрежови суичове', 'network-switches', v_parent_id, 4),
      ('Ethernet Cables', 'Ethernet кабели', 'ethernet-cables', v_parent_id, 5),
      ('Mesh Systems', 'Mesh системи', 'mesh-systems', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Storage Devices deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'storage-devices';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('External Hard Drives', 'Външни твърди дискове', 'external-hard-drives', v_parent_id, 1),
      ('USB Flash Drives', 'USB флаш памети', 'usb-flash-drives', v_parent_id, 2),
      ('Memory Cards', 'Карти памет', 'memory-cards', v_parent_id, 3),
      ('NAS Devices', 'NAS устройства', 'nas-devices', v_parent_id, 4),
      ('CD DVD Drives', 'CD DVD устройства', 'cd-dvd-drives', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Software deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'software';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Operating Systems', 'Операционни системи', 'operating-systems', v_parent_id, 1),
      ('Office Software', 'Офис софтуер', 'office-software', v_parent_id, 2),
      ('Antivirus Software', 'Антивирусен софтуер', 'antivirus-software', v_parent_id, 3),
      ('Photo Editing', 'Редактиране на снимки', 'photo-editing', v_parent_id, 4),
      ('Video Editing', 'Редактиране на видео', 'video-editing', v_parent_id, 5),
      ('Accounting Software', 'Счетоводен софтуер', 'accounting-software', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- E-Readers deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'e-readers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Kindle Devices', 'Kindle устройства', 'kindle-devices', v_parent_id, 1),
      ('Kobo Devices', 'Kobo устройства', 'kobo-devices', v_parent_id, 2),
      ('E-Reader Accessories', 'Аксесоари за четци', 'e-reader-accessories', v_parent_id, 3),
      ('E-Reader Cases', 'Калъфи за четци', 'e-reader-cases', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Drones deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'drones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Camera Drones', 'Дронове с камера', 'camera-drones', v_parent_id, 1),
      ('Racing Drones', 'Състезателни дронове', 'racing-drones', v_parent_id, 2),
      ('Mini Drones', 'Мини дронове', 'mini-drones', v_parent_id, 3),
      ('Drone Accessories', 'Аксесоари за дронове', 'drone-accessories', v_parent_id, 4),
      ('Drone Batteries', 'Батерии за дронове', 'drone-batteries', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- 3D Printing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = '3d-printing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('3D Printers', '3D принтери', '3d-printers', v_parent_id, 1),
      ('3D Printer Filament', 'Нишка за 3D принтер', '3d-printer-filament', v_parent_id, 2),
      ('Resin', 'Смола за 3D', 'resin-3d', v_parent_id, 3),
      ('3D Scanner', '3D скенери', '3d-scanner', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
