
-- Batch 31: More missing L2 and L3 categories - filling gaps
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Smart Home L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smart-speakers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Amazon Echo', 'Amazon Echo', 'amazon-echo', v_parent_id, 1),
      ('Google Home', 'Google Home', 'google-home', v_parent_id, 2),
      ('Apple HomePod', 'Apple HomePod', 'apple-homepod', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smart-lighting';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Smart Bulbs', 'Смарт крушки', 'smart-bulbs', v_parent_id, 1),
      ('Smart Light Strips', 'Смарт LED ленти', 'smart-light-strips', v_parent_id, 2),
      ('Smart Light Switches', 'Смарт ключове', 'smart-light-switches', v_parent_id, 3),
      ('Smart Plugs', 'Смарт контакти', 'smart-plugs', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'home-security';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Security Cameras', 'Охранителни камери', 'security-cameras', v_parent_id, 1),
      ('Video Doorbells', 'Видео звънци', 'video-doorbells', v_parent_id, 2),
      ('Smart Locks', 'Смарт брави', 'smart-locks', v_parent_id, 3),
      ('Alarm Systems', 'Аларми', 'alarm-systems', v_parent_id, 4),
      ('Motion Sensors', 'Сензори за движение', 'motion-sensors', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smart-thermostats';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Nest Thermostats', 'Nest термостати', 'nest-thermostats', v_parent_id, 1),
      ('Ecobee', 'Ecobee', 'ecobee', v_parent_id, 2),
      ('Honeywell Smart', 'Honeywell Smart', 'honeywell-smart', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Wearables L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fitness-trackers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fitbit Bands', 'Fitbit гривни', 'fitbit-bands', v_parent_id, 1),
      ('Xiaomi Mi Band', 'Xiaomi Mi Band', 'xiaomi-mi-band', v_parent_id, 2),
      ('Garmin Trackers', 'Garmin тракери', 'garmin-trackers', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Networking L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'networking';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Routers', 'Рутери', 'routers', v_parent_id, 1),
      ('Modems', 'Модеми', 'modems', v_parent_id, 2),
      ('Mesh WiFi', 'Меш WiFi системи', 'mesh-wifi', v_parent_id, 3),
      ('Network Switches', 'Мрежови суичове', 'network-switches', v_parent_id, 4),
      ('WiFi Range Extenders', 'WiFi екстендъри', 'wifi-range-extenders', v_parent_id, 5),
      ('Network Cables', 'Мрежови кабели', 'network-cables', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Storage L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'storage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('SSDs', 'SSD дискове', 'ssds', v_parent_id, 1),
      ('Hard Drives', 'Твърди дискове', 'hard-drives', v_parent_id, 2),
      ('USB Flash Drives', 'USB флашки', 'usb-flash-drives', v_parent_id, 3),
      ('Memory Cards', 'Карти памет', 'memory-cards', v_parent_id, 4),
      ('NAS Devices', 'NAS устройства', 'nas-devices', v_parent_id, 5),
      ('External SSDs', 'Външни SSD', 'external-ssds', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Frozen Foods L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'frozen-foods';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Frozen Vegetables', 'Замразени зеленчуци', 'frozen-vegetables', v_parent_id, 1),
      ('Frozen Fruits', 'Замразени плодове', 'frozen-fruits', v_parent_id, 2),
      ('Frozen Meals', 'Замразени ястия', 'frozen-meals', v_parent_id, 3),
      ('Frozen Pizza', 'Замразена пица', 'frozen-pizza', v_parent_id, 4),
      ('Ice Cream', 'Сладолед', 'ice-cream', v_parent_id, 5),
      ('Frozen Seafood', 'Замразени морски дарове', 'frozen-seafood', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Household Items L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cleaning-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('All-Purpose Cleaners', 'Универсални почистващи', 'all-purpose-cleaners', v_parent_id, 1),
      ('Laundry Detergent', 'Перилен препарат', 'laundry-detergent', v_parent_id, 2),
      ('Dish Soap', 'Препарат за съдове', 'dish-soap', v_parent_id, 3),
      ('Disinfectants', 'Дезинфектанти', 'disinfectants', v_parent_id, 4),
      ('Mops & Brooms', 'Моп и метли', 'mops-brooms', v_parent_id, 5),
      ('Vacuum Bags', 'Торби за прахосмукачка', 'vacuum-bags', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'paper-plastic';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Toilet Paper', 'Тоалетна хартия', 'toilet-paper', v_parent_id, 1),
      ('Paper Towels', 'Хартиени кърпи', 'paper-towels', v_parent_id, 2),
      ('Facial Tissues', 'Кърпички за лице', 'facial-tissues', v_parent_id, 3),
      ('Trash Bags', 'Торби за боклук', 'trash-bags', v_parent_id, 4),
      ('Food Storage Bags', 'Торби за храна', 'food-storage-bags', v_parent_id, 5),
      ('Aluminum Foil', 'Алуминиево фолио', 'aluminum-foil', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Medical Supplies L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'first-aid';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bandages', 'Превръзки', 'bandages', v_parent_id, 1),
      ('Antiseptics', 'Антисептици', 'antiseptics', v_parent_id, 2),
      ('First Aid Kits', 'Аптечки', 'first-aid-kits', v_parent_id, 3),
      ('Medical Tape', 'Медицинска лепенка', 'medical-tape', v_parent_id, 4),
      ('Pain Relievers', 'Болкоуспокояващи', 'pain-relievers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'health-monitors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Blood Pressure Monitors', 'Апарати за кръвно', 'blood-pressure-monitors', v_parent_id, 1),
      ('Thermometers', 'Термометри', 'thermometers', v_parent_id, 2),
      ('Pulse Oximeters', 'Пулсоксиметри', 'pulse-oximeters', v_parent_id, 3),
      ('Glucose Monitors', 'Глюкомери', 'glucose-monitors', v_parent_id, 4),
      ('Scales', 'Кантари', 'health-scales', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Software L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'operating-systems';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Windows', 'Windows', 'windows-os', v_parent_id, 1),
      ('macOS', 'macOS', 'macos', v_parent_id, 2),
      ('Linux', 'Linux', 'linux', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'productivity-software';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Microsoft Office', 'Microsoft Office', 'microsoft-office', v_parent_id, 1),
      ('Google Workspace', 'Google Workspace', 'google-workspace', v_parent_id, 2),
      ('PDF Software', 'PDF софтуер', 'pdf-software', v_parent_id, 3),
      ('Project Management', 'Управление на проекти', 'project-management', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'creative-software';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Adobe Creative Suite', 'Adobe Creative Suite', 'adobe-creative-suite', v_parent_id, 1),
      ('Video Editing', 'Видео редактиране', 'video-editing', v_parent_id, 2),
      ('Audio Software', 'Аудио софтуер', 'audio-software', v_parent_id, 3),
      ('3D Modeling', '3D моделиране', '3d-modeling', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'security-software';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Antivirus', 'Антивирусен софтуер', 'antivirus', v_parent_id, 1),
      ('VPN Services', 'VPN услуги', 'vpn-services', v_parent_id, 2),
      ('Password Managers', 'Мениджъри на пароли', 'password-managers', v_parent_id, 3),
      ('Backup Software', 'Софтуер за архивиране', 'backup-software', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
