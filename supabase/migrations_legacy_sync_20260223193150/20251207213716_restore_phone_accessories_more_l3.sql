-- Restore Phone & Mobile Accessories L3 categories

-- Phone Cases L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('iPhone Cases', 'cases-iphone', 'Калъфи за iPhone', 1),
  ('Samsung Cases', 'cases-samsung', 'Калъфи за Samsung', 2),
  ('Google Pixel Cases', 'cases-pixel', 'Калъфи за Pixel', 3),
  ('Clear Cases', 'cases-clear', 'Прозрачни калъфи', 4),
  ('Leather Cases', 'cases-leather', 'Кожени калъфи', 5),
  ('Wallet Cases', 'cases-wallet', 'Калъфи портфейл', 6),
  ('Rugged Cases', 'cases-rugged', 'Защитни калъфи', 7),
  ('Designer Cases', 'cases-designer', 'Дизайнерски калъфи', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'mobile-cases'
ON CONFLICT (slug) DO NOTHING;

-- Screen Protectors L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Tempered Glass', 'screen-tempered', 'Стъклени протектори', 1),
  ('Film Protectors', 'screen-film', 'Фолиа', 2),
  ('Privacy Screens', 'screen-privacy', 'Privacy протектори', 3),
  ('Anti-Glare', 'screen-antiglare', 'Антирефлексни', 4),
  ('Camera Lens Protectors', 'screen-lens', 'Протектори за камера', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'mobile-screen-protectors'
ON CONFLICT (slug) DO NOTHING;

-- Chargers & Cables L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Lightning Cables', 'cables-lightning', 'Lightning кабели', 1),
  ('USB-C Cables', 'cables-usbc', 'USB-C кабели', 2),
  ('Micro USB Cables', 'cables-microusb', 'Micro USB кабели', 3),
  ('Wall Chargers', 'chargers-wall', 'Зарядни за стена', 4),
  ('Car Chargers', 'chargers-car', 'Зарядни за кола', 5),
  ('Wireless Chargers', 'chargers-wireless', 'Безжични зарядни', 6),
  ('Power Banks', 'chargers-powerbanks', 'Външни батерии', 7),
  ('MagSafe Chargers', 'chargers-magsafe', 'MagSafe зарядни', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'mobile-chargers'
ON CONFLICT (slug) DO NOTHING;

-- Phone Mounts L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Car Phone Mounts', 'mounts-car', 'Стойки за кола', 1),
  ('Bike Phone Mounts', 'mounts-bike', 'Стойки за велосипед', 2),
  ('Desk Stands', 'mounts-desk', 'Настолни стойки', 3),
  ('Tripods', 'mounts-tripods', 'Триподи', 4),
  ('Selfie Sticks', 'mounts-selfie', 'Селфи стикове', 5),
  ('Ring Holders', 'mounts-rings', 'Пръстени държачи', 6),
  ('Gimbals', 'mounts-gimbals', 'Гимбали', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'mobile-mounts'
ON CONFLICT (slug) DO NOTHING;

-- TVs L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('OLED TVs', 'tv-oled', 'OLED телевизори', 1),
  ('QLED TVs', 'tv-qled', 'QLED телевизори', 2),
  ('LED TVs', 'tv-led', 'LED телевизори', 3),
  ('Smart TVs', 'tv-smart', 'Смарт телевизори', 4),
  ('4K TVs', 'tv-4k', '4K телевизори', 5),
  ('8K TVs', 'tv-8k', '8K телевизори', 6),
  ('Mini LED TVs', 'tv-mini-led', 'Mini LED телевизори', 7),
  ('Projectors', 'tv-projectors', 'Проектори', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'electronics-tvs'
ON CONFLICT (slug) DO NOTHING;

-- Home Audio L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Receivers', 'home-audio-receivers', 'Ресивъри', 1),
  ('Turntables', 'home-audio-turntables', 'Грамофони', 2),
  ('CD Players', 'home-audio-cd', 'CD плейъри', 3),
  ('Amplifiers', 'home-audio-amps', 'Усилватели', 4),
  ('Streaming Devices', 'home-audio-streaming', 'Стрийминг устройства', 5),
  ('Hi-Fi Systems', 'home-audio-hifi', 'Hi-Fi системи', 6),
  ('Subwoofers', 'home-audio-subwoofers', 'Субуфери', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'electronics-home-audio'
ON CONFLICT (slug) DO NOTHING;

-- VR & AR L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('VR Headsets', 'vr-headsets', 'VR очила', 1),
  ('VR Controllers', 'vr-controllers', 'VR контролери', 2),
  ('VR Accessories', 'vr-accessories', 'VR аксесоари', 3),
  ('AR Glasses', 'ar-glasses', 'AR очила', 4),
  ('VR Games', 'vr-games', 'VR игри', 5),
  ('VR Treadmills', 'vr-treadmills', 'VR пътеки', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'electronics-vr'
ON CONFLICT (slug) DO NOTHING;

-- Streaming Devices L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Streaming Sticks', 'streaming-sticks', 'Стрийминг стикове', 1),
  ('Streaming Boxes', 'streaming-boxes', 'Стрийминг кутии', 2),
  ('Android TV Boxes', 'streaming-android', 'Android TV кутии', 3),
  ('Apple TV', 'streaming-apple-tv', 'Apple TV', 4),
  ('Roku Devices', 'streaming-roku', 'Roku устройства', 5),
  ('Chromecast', 'streaming-chromecast', 'Chromecast', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'electronics-streaming'
ON CONFLICT (slug) DO NOTHING;;
