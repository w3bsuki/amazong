-- Restore more Electronics & Computers L3 categories

-- Laptops L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Gaming Laptops', 'laptops-gaming', 'Гейминг лаптопи', 1),
  ('Business Laptops', 'laptops-business', 'Бизнес лаптопи', 2),
  ('Student Laptops', 'laptops-student', 'Ученически лаптопи', 3),
  ('Ultrabooks', 'laptops-ultrabooks', 'Ултрабуци', 4),
  ('2-in-1 Laptops', 'laptops-2in1', '2-в-1 лаптопи', 5),
  ('Workstation Laptops', 'laptops-workstation', 'Работни станции', 6),
  ('Chromebooks', 'laptops-chromebooks', 'Хромбуци', 7),
  ('MacBooks', 'laptops-macbooks', 'MacBook', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'computers-laptops'
ON CONFLICT (slug) DO NOTHING;

-- Desktop Computers L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Gaming Desktops', 'desktops-gaming', 'Гейминг компютри', 1),
  ('All-in-One PCs', 'desktops-allinone', 'Компютри всичко в едно', 2),
  ('Business Desktops', 'desktops-business', 'Бизнес компютри', 3),
  ('Mini PCs', 'desktops-mini', 'Мини компютри', 4),
  ('Workstations', 'desktops-workstations', 'Работни станции', 5),
  ('iMacs', 'desktops-imacs', 'iMac', 6),
  ('Mac Mini', 'desktops-mac-mini', 'Mac Mini', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'computers-desktops'
ON CONFLICT (slug) DO NOTHING;

-- Computer Components L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('CPUs / Processors', 'components-cpu', 'Процесори', 1),
  ('Graphics Cards', 'components-gpu', 'Видеокарти', 2),
  ('RAM Memory', 'components-ram', 'RAM памет', 3),
  ('SSDs', 'components-ssd', 'SSD дискове', 4),
  ('HDDs', 'components-hdd', 'Твърди дискове', 5),
  ('Motherboards', 'components-motherboard', 'Дънни платки', 6),
  ('Power Supplies', 'components-psu', 'Захранвания', 7),
  ('Computer Cases', 'components-cases', 'Кутии', 8),
  ('CPU Coolers', 'components-coolers', 'Охлаждане', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'computers-components'
ON CONFLICT (slug) DO NOTHING;

-- Monitors L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Gaming Monitors', 'monitors-gaming', 'Гейминг монитори', 1),
  ('4K Monitors', 'monitors-4k', '4K монитори', 2),
  ('Ultrawide Monitors', 'monitors-ultrawide', 'Ултраширок монитори', 3),
  ('Curved Monitors', 'monitors-curved', 'Извити монитори', 4),
  ('Professional Monitors', 'monitors-professional', 'Професионални монитори', 5),
  ('Portable Monitors', 'monitors-portable', 'Преносими монитори', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'computers-monitors'
ON CONFLICT (slug) DO NOTHING;

-- Tablets L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('iPad', 'tablets-ipad', 'iPad', 1),
  ('Android Tablets', 'tablets-android', 'Android таблети', 2),
  ('Windows Tablets', 'tablets-windows', 'Windows таблети', 3),
  ('E-Readers', 'tablets-ereaders', 'Електронни четци', 4),
  ('Kids Tablets', 'tablets-kids', 'Детски таблети', 5),
  ('Drawing Tablets', 'tablets-drawing', 'Таблети за рисуване', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'electronics-tablets'
ON CONFLICT (slug) DO NOTHING;

-- Audio Equipment L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Wireless Headphones', 'audio-wireless', 'Безжични слушалки', 1),
  ('Wired Headphones', 'audio-wired', 'Кабелни слушалки', 2),
  ('Earbuds', 'audio-earbuds', 'Слушалки тапи', 3),
  ('Over-Ear Headphones', 'audio-over-ear', 'Големи слушалки', 4),
  ('Noise Cancelling', 'audio-anc', 'С активно шумопотискане', 5),
  ('Gaming Headsets', 'audio-gaming', 'Гейминг слушалки', 6),
  ('Studio Headphones', 'audio-studio', 'Студийни слушалки', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'electronics-headphones'
ON CONFLICT (slug) DO NOTHING;

-- Speakers L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Bluetooth Speakers', 'speakers-bluetooth', 'Bluetooth тонколони', 1),
  ('Smart Speakers', 'speakers-smart', 'Смарт тонколони', 2),
  ('Soundbars', 'speakers-soundbars', 'Саундбари', 3),
  ('Bookshelf Speakers', 'speakers-bookshelf', 'Полични тонколони', 4),
  ('Portable Speakers', 'speakers-portable', 'Преносими тонколони', 5),
  ('Outdoor Speakers', 'speakers-outdoor', 'Външни тонколони', 6),
  ('Home Theater Systems', 'speakers-home-theater', 'Домашно кино', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'electronics-speakers'
ON CONFLICT (slug) DO NOTHING;

-- Cameras L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('DSLR Cameras', 'cameras-dslr', 'DSLR фотоапарати', 1),
  ('Mirrorless Cameras', 'cameras-mirrorless', 'Безогледални фотоапарати', 2),
  ('Compact Cameras', 'cameras-compact', 'Компактни фотоапарати', 3),
  ('Action Cameras', 'cameras-action', 'Екшън камери', 4),
  ('Film Cameras', 'cameras-film', 'Филмови фотоапарати', 5),
  ('Instant Cameras', 'cameras-instant', 'Моментални фотоапарати', 6),
  ('Camera Drones', 'cameras-drones', 'Дронове с камера', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'electronics-cameras'
ON CONFLICT (slug) DO NOTHING;

-- Smart Home L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Smart Lights', 'smarthome-lights', 'Смарт осветление', 1),
  ('Smart Thermostats', 'smarthome-thermostats', 'Смарт термостати', 2),
  ('Smart Locks', 'smarthome-locks', 'Смарт брави', 3),
  ('Smart Cameras', 'smarthome-cameras', 'Смарт камери', 4),
  ('Smart Plugs', 'smarthome-plugs', 'Смарт контакти', 5),
  ('Smart Doorbells', 'smarthome-doorbells', 'Смарт звънци', 6),
  ('Smart Hubs', 'smarthome-hubs', 'Смарт хъбове', 7),
  ('Smart Sensors', 'smarthome-sensors', 'Смарт сензори', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'electronics-smarthome'
ON CONFLICT (slug) DO NOTHING;

-- Wearables L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Apple Watch', 'wearables-apple-watch', 'Apple Watch', 1),
  ('Android Smartwatches', 'wearables-android', 'Android смарт часовници', 2),
  ('Fitness Trackers', 'wearables-fitness', 'Фитнес тракери', 3),
  ('Garmin Watches', 'wearables-garmin', 'Garmin часовници', 4),
  ('Kids Smartwatches', 'wearables-kids', 'Детски смарт часовници', 5),
  ('Smart Rings', 'wearables-rings', 'Смарт пръстени', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'electronics-wearables'
ON CONFLICT (slug) DO NOTHING;;
