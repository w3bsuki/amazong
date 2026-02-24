
-- Batch 14: More Electronics (Smart Home, Tablets, Phones), More Fashion (Accessories)
DO $$
DECLARE
  v_electronics_id UUID;
  v_smarthome_id UUID;
  v_tablets_id UUID;
  v_phones_id UUID;
  v_phone_cases_id UUID;
  v_wearables_id UUID;
  v_networking_id UUID;
  v_storage_id UUID;
  v_fashion_acc_id UUID;
  v_sunglasses_id UUID;
  v_belts_id UUID;
  v_scarves_id UUID;
  v_hats_id UUID;
  v_gloves_id UUID;
BEGIN
  SELECT id INTO v_electronics_id FROM categories WHERE slug = 'electronics';
  SELECT id INTO v_smarthome_id FROM categories WHERE slug = 'smart-home';
  SELECT id INTO v_tablets_id FROM categories WHERE slug = 'tablets';
  SELECT id INTO v_phones_id FROM categories WHERE slug = 'smartphones';
  SELECT id INTO v_phone_cases_id FROM categories WHERE slug = 'phone-cases';
  SELECT id INTO v_wearables_id FROM categories WHERE slug = 'wearable-technology';
  SELECT id INTO v_networking_id FROM categories WHERE slug = 'networking';
  SELECT id INTO v_storage_id FROM categories WHERE slug = 'data-storage';
  SELECT id INTO v_fashion_acc_id FROM categories WHERE slug = 'fashion-accessories';
  SELECT id INTO v_sunglasses_id FROM categories WHERE slug = 'sunglasses';
  SELECT id INTO v_belts_id FROM categories WHERE slug = 'belts';
  SELECT id INTO v_scarves_id FROM categories WHERE slug = 'scarves';
  SELECT id INTO v_hats_id FROM categories WHERE slug = 'hats-caps';
  SELECT id INTO v_gloves_id FROM categories WHERE slug = 'gloves';
  
  -- Smart Home deep categories
  IF v_smarthome_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Smart Speakers', 'Смарт колони', 'smarthome-speakers', v_smarthome_id, 1),
    ('Amazon Echo', 'Amazon Echo', 'smarthome-echo', v_smarthome_id, 2),
    ('Google Home', 'Google Home', 'smarthome-google-home', v_smarthome_id, 3),
    ('Smart Displays', 'Смарт дисплеи', 'smarthome-displays', v_smarthome_id, 4),
    ('Smart Lighting', 'Смарт осветление', 'smarthome-lighting', v_smarthome_id, 5),
    ('Smart Bulbs', 'Смарт крушки', 'smarthome-bulbs', v_smarthome_id, 6),
    ('Smart Light Strips', 'LED ленти', 'smarthome-light-strips', v_smarthome_id, 7),
    ('Smart Plugs', 'Смарт контакти', 'smarthome-plugs', v_smarthome_id, 8),
    ('Smart Switches', 'Смарт ключове', 'smarthome-switches', v_smarthome_id, 9),
    ('Smart Thermostats', 'Смарт термостати', 'smarthome-thermostats', v_smarthome_id, 10),
    ('Security Cameras', 'Охранителни камери', 'smarthome-cameras', v_smarthome_id, 11),
    ('Indoor Cameras', 'Вътрешни камери', 'smarthome-cameras-indoor', v_smarthome_id, 12),
    ('Outdoor Cameras', 'Външни камери', 'smarthome-cameras-outdoor', v_smarthome_id, 13),
    ('Video Doorbells', 'Видео звънци', 'smarthome-doorbells', v_smarthome_id, 14),
    ('Smart Locks', 'Смарт брави', 'smarthome-locks', v_smarthome_id, 15),
    ('Keypad Locks', 'Брави с клавиатура', 'smarthome-locks-keypad', v_smarthome_id, 16),
    ('Smart Sensors', 'Смарт сензори', 'smarthome-sensors', v_smarthome_id, 17),
    ('Motion Sensors', 'Сензори за движение', 'smarthome-sensors-motion', v_smarthome_id, 18),
    ('Door Sensors', 'Сензори за врата', 'smarthome-sensors-door', v_smarthome_id, 19),
    ('Smart Hubs', 'Смарт хъбове', 'smarthome-hubs', v_smarthome_id, 20),
    ('Robot Vacuums', 'Роботи прахосмукачки', 'smarthome-robot-vacuums', v_smarthome_id, 21),
    ('Smart Appliances', 'Смарт уреди', 'smarthome-appliances', v_smarthome_id, 22),
    ('Smart Air Purifiers', 'Смарт пречистватели', 'smarthome-air-purifiers', v_smarthome_id, 23),
    ('Smart Garage', 'Смарт гараж', 'smarthome-garage', v_smarthome_id, 24),
    ('Smart Irrigation', 'Смарт напояване', 'smarthome-irrigation', v_smarthome_id, 25)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tablets deep categories
  IF v_tablets_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('iPad', 'iPad', 'tablets-ipad', v_tablets_id, 1),
    ('iPad Pro', 'iPad Pro', 'tablets-ipad-pro', v_tablets_id, 2),
    ('iPad Air', 'iPad Air', 'tablets-ipad-air', v_tablets_id, 3),
    ('iPad Mini', 'iPad Mini', 'tablets-ipad-mini', v_tablets_id, 4),
    ('Android Tablets', 'Андроид таблети', 'tablets-android', v_tablets_id, 5),
    ('Samsung Tablets', 'Samsung таблети', 'tablets-samsung', v_tablets_id, 6),
    ('Lenovo Tablets', 'Lenovo таблети', 'tablets-lenovo', v_tablets_id, 7),
    ('Kids Tablets', 'Детски таблети', 'tablets-kids', v_tablets_id, 8),
    ('Windows Tablets', 'Windows таблети', 'tablets-windows', v_tablets_id, 9),
    ('E-Readers', 'Електронни четци', 'tablets-ereaders', v_tablets_id, 10),
    ('Kindle', 'Kindle', 'tablets-kindle', v_tablets_id, 11),
    ('Tablet Cases', 'Калъфи за таблети', 'tablets-cases', v_tablets_id, 12),
    ('iPad Cases', 'Калъфи за iPad', 'tablets-cases-ipad', v_tablets_id, 13),
    ('Tablet Stands', 'Стойки за таблети', 'tablets-stands', v_tablets_id, 14),
    ('Tablet Keyboards', 'Клавиатури за таблети', 'tablets-keyboards', v_tablets_id, 15),
    ('Stylus Pens', 'Стилуси', 'tablets-stylus', v_tablets_id, 16),
    ('Apple Pencil', 'Apple Pencil', 'tablets-apple-pencil', v_tablets_id, 17),
    ('Screen Protectors', 'Протектори за екран', 'tablets-screen-protectors', v_tablets_id, 18),
    ('Tablet Chargers', 'Зарядни за таблети', 'tablets-chargers', v_tablets_id, 19),
    ('Tablet Accessories', 'Аксесоари за таблети', 'tablets-accessories', v_tablets_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Smartphones deep categories
  IF v_phones_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('iPhone', 'iPhone', 'phones-iphone', v_phones_id, 1),
    ('iPhone 15', 'iPhone 15', 'phones-iphone-15', v_phones_id, 2),
    ('iPhone 14', 'iPhone 14', 'phones-iphone-14', v_phones_id, 3),
    ('iPhone SE', 'iPhone SE', 'phones-iphone-se', v_phones_id, 4),
    ('Samsung Galaxy', 'Samsung Galaxy', 'phones-samsung', v_phones_id, 5),
    ('Galaxy S Series', 'Galaxy S серия', 'phones-samsung-s', v_phones_id, 6),
    ('Galaxy A Series', 'Galaxy A серия', 'phones-samsung-a', v_phones_id, 7),
    ('Galaxy Z Fold', 'Galaxy Z Fold', 'phones-samsung-fold', v_phones_id, 8),
    ('Google Pixel', 'Google Pixel', 'phones-google-pixel', v_phones_id, 9),
    ('OnePlus', 'OnePlus', 'phones-oneplus', v_phones_id, 10),
    ('Xiaomi', 'Xiaomi', 'phones-xiaomi', v_phones_id, 11),
    ('Motorola', 'Motorola', 'phones-motorola', v_phones_id, 12),
    ('Budget Phones', 'Бюджетни телефони', 'phones-budget', v_phones_id, 13),
    ('Refurbished Phones', 'Рефърбиш телефони', 'phones-refurbished', v_phones_id, 14),
    ('5G Phones', '5G телефони', 'phones-5g', v_phones_id, 15),
    ('Phone Chargers', 'Зарядни за телефони', 'phones-chargers', v_phones_id, 16),
    ('Fast Chargers', 'Бързи зарядни', 'phones-chargers-fast', v_phones_id, 17),
    ('Wireless Chargers', 'Безжични зарядни', 'phones-chargers-wireless', v_phones_id, 18),
    ('Power Banks', 'Външни батерии', 'phones-power-banks', v_phones_id, 19),
    ('Phone Mounts', 'Стойки за телефон', 'phones-mounts', v_phones_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Wearables deep categories
  IF v_wearables_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Smartwatches', 'Смарт часовници', 'wearables-smartwatches', v_wearables_id, 1),
    ('Apple Watch', 'Apple Watch', 'wearables-apple-watch', v_wearables_id, 2),
    ('Samsung Galaxy Watch', 'Samsung Galaxy Watch', 'wearables-samsung-watch', v_wearables_id, 3),
    ('Garmin Watches', 'Garmin часовници', 'wearables-garmin', v_wearables_id, 4),
    ('Fitness Trackers', 'Фитнес тракери', 'wearables-fitness-trackers', v_wearables_id, 5),
    ('Fitbit', 'Fitbit', 'wearables-fitbit', v_wearables_id, 6),
    ('Mi Band', 'Mi Band', 'wearables-mi-band', v_wearables_id, 7),
    ('Smart Rings', 'Смарт пръстени', 'wearables-smart-rings', v_wearables_id, 8),
    ('VR Headsets', 'VR очила', 'wearables-vr', v_wearables_id, 9),
    ('Meta Quest', 'Meta Quest', 'wearables-meta-quest', v_wearables_id, 10),
    ('AR Glasses', 'AR очила', 'wearables-ar', v_wearables_id, 11),
    ('Watch Bands', 'Каишки за часовник', 'wearables-watch-bands', v_wearables_id, 12),
    ('Apple Watch Bands', 'Каишки за Apple Watch', 'wearables-apple-bands', v_wearables_id, 13),
    ('Watch Chargers', 'Зарядни за часовник', 'wearables-watch-chargers', v_wearables_id, 14),
    ('Wearable Accessories', 'Аксесоари за носими у-ва', 'wearables-accessories', v_wearables_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Networking deep categories
  IF v_networking_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Routers', 'Рутери', 'networking-routers', v_networking_id, 1),
    ('WiFi 6 Routers', 'WiFi 6 рутери', 'networking-routers-wifi6', v_networking_id, 2),
    ('Gaming Routers', 'Гейминг рутери', 'networking-routers-gaming', v_networking_id, 3),
    ('Mesh Systems', 'Меш системи', 'networking-mesh', v_networking_id, 4),
    ('WiFi Extenders', 'WiFi усилватели', 'networking-extenders', v_networking_id, 5),
    ('Network Switches', 'Мрежови суичове', 'networking-switches', v_networking_id, 6),
    ('Network Adapters', 'Мрежови адаптери', 'networking-adapters', v_networking_id, 7),
    ('WiFi Adapters', 'WiFi адаптери', 'networking-adapters-wifi', v_networking_id, 8),
    ('Ethernet Cables', 'Ethernet кабели', 'networking-cables', v_networking_id, 9),
    ('Cat6 Cables', 'Cat6 кабели', 'networking-cables-cat6', v_networking_id, 10),
    ('Modems', 'Модеми', 'networking-modems', v_networking_id, 11),
    ('Access Points', 'Точки за достъп', 'networking-access-points', v_networking_id, 12),
    ('Powerline Adapters', 'Powerline адаптери', 'networking-powerline', v_networking_id, 13),
    ('Network Attached Storage', 'NAS', 'networking-nas', v_networking_id, 14),
    ('Firewalls', 'Защитни стени', 'networking-firewalls', v_networking_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Data Storage deep categories
  IF v_storage_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('External Hard Drives', 'Външни твърди дискове', 'storage-external-hdd', v_storage_id, 1),
    ('Portable HDDs', 'Преносими HDD', 'storage-portable-hdd', v_storage_id, 2),
    ('Desktop HDDs', 'Настолни HDD', 'storage-desktop-hdd', v_storage_id, 3),
    ('External SSDs', 'Външни SSD', 'storage-external-ssd', v_storage_id, 4),
    ('Portable SSDs', 'Преносими SSD', 'storage-portable-ssd', v_storage_id, 5),
    ('USB Flash Drives', 'USB флаш памет', 'storage-usb-drives', v_storage_id, 6),
    ('USB-A Drives', 'USB-A флаш', 'storage-usb-a', v_storage_id, 7),
    ('USB-C Drives', 'USB-C флаш', 'storage-usb-c', v_storage_id, 8),
    ('Memory Cards', 'Карти памет', 'storage-memory-cards', v_storage_id, 9),
    ('SD Cards', 'SD карти', 'storage-sd-cards', v_storage_id, 10),
    ('MicroSD Cards', 'MicroSD карти', 'storage-microsd', v_storage_id, 11),
    ('CF Cards', 'CF карти', 'storage-cf-cards', v_storage_id, 12),
    ('NAS Drives', 'NAS дискове', 'storage-nas-drives', v_storage_id, 13),
    ('Optical Drives', 'Оптични устройства', 'storage-optical', v_storage_id, 14),
    ('Blu-ray Drives', 'Blu-ray устройства', 'storage-bluray', v_storage_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fashion Accessories deep categories
  IF v_fashion_acc_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Sunglasses', 'Слънчеви очила', 'fashion-sunglasses', v_fashion_acc_id, 1),
    ('Aviator Sunglasses', 'Авиаторски очила', 'fashion-sunglasses-aviator', v_fashion_acc_id, 2),
    ('Wayfarer Sunglasses', 'Уейфарър очила', 'fashion-sunglasses-wayfarer', v_fashion_acc_id, 3),
    ('Sports Sunglasses', 'Спортни очила', 'fashion-sunglasses-sports', v_fashion_acc_id, 4),
    ('Belts', 'Колани', 'fashion-belts', v_fashion_acc_id, 5),
    ('Leather Belts', 'Кожени колани', 'fashion-belts-leather', v_fashion_acc_id, 6),
    ('Canvas Belts', 'Текстилни колани', 'fashion-belts-canvas', v_fashion_acc_id, 7),
    ('Dress Belts', 'Официални колани', 'fashion-belts-dress', v_fashion_acc_id, 8),
    ('Scarves', 'Шалове', 'fashion-scarves', v_fashion_acc_id, 9),
    ('Silk Scarves', 'Копринени шалове', 'fashion-scarves-silk', v_fashion_acc_id, 10),
    ('Wool Scarves', 'Вълнени шалове', 'fashion-scarves-wool', v_fashion_acc_id, 11),
    ('Hats', 'Шапки', 'fashion-hats', v_fashion_acc_id, 12),
    ('Baseball Caps', 'Бейзболни шапки', 'fashion-hats-baseball', v_fashion_acc_id, 13),
    ('Fedoras', 'Федори', 'fashion-hats-fedora', v_fashion_acc_id, 14),
    ('Beanies', 'Шапки плетени', 'fashion-hats-beanies', v_fashion_acc_id, 15),
    ('Sun Hats', 'Летни шапки', 'fashion-hats-sun', v_fashion_acc_id, 16),
    ('Gloves', 'Ръкавици', 'fashion-gloves', v_fashion_acc_id, 17),
    ('Leather Gloves', 'Кожени ръкавици', 'fashion-gloves-leather', v_fashion_acc_id, 18),
    ('Winter Gloves', 'Зимни ръкавици', 'fashion-gloves-winter', v_fashion_acc_id, 19),
    ('Ties', 'Вратовръзки', 'fashion-ties', v_fashion_acc_id, 20),
    ('Bow Ties', 'Папийонки', 'fashion-bow-ties', v_fashion_acc_id, 21),
    ('Pocket Squares', 'Кърпички', 'fashion-pocket-squares', v_fashion_acc_id, 22),
    ('Suspenders', 'Тиранти', 'fashion-suspenders', v_fashion_acc_id, 23),
    ('Hair Accessories', 'Аксесоари за коса', 'fashion-hair-accessories', v_fashion_acc_id, 24),
    ('Socks', 'Чорапи', 'fashion-socks', v_fashion_acc_id, 25)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
