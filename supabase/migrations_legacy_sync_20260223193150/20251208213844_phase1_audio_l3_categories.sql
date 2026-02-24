
-- Phase 1.5: Add L3 Audio Categories

-- Add Headphone Brands/Types under Headphones L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Sony WH Series', 'Bose QuietComfort', 'Sennheiser HD Series', 'AirPods Max', 'Beats Studio', 'Audio-Technica', 'Beyerdynamic', 'HiFiMAN', 'Over-Ear Headphones', 'On-Ear Headphones', 'Open-Back Headphones', 'Closed-Back Headphones', 'Wireless Headphones', 'Wired Headphones', 'ANC Headphones']),
  unnest(ARRAY['sony-wh-series', 'bose-quietcomfort', 'sennheiser-hd-series', 'airpods-max', 'beats-studio', 'audio-technica', 'beyerdynamic', 'hifiman', 'over-ear-headphones', 'on-ear-headphones', 'open-back-headphones', 'closed-back-headphones', 'wireless-headphones', 'wired-headphones', 'anc-headphones']),
  (SELECT id FROM categories WHERE slug = 'headphones'),
  unnest(ARRAY['Sony WH Серия', 'Bose QuietComfort', 'Sennheiser HD Серия', 'AirPods Max', 'Beats Studio', 'Audio-Technica', 'Beyerdynamic', 'HiFiMAN', 'Over-Ear Слушалки', 'On-Ear Слушалки', 'Open-Back Слушалки', 'Closed-Back Слушалки', 'Безжични Слушалки', 'Кабелни Слушалки', 'ANC Слушалки']),
  '🎧'
ON CONFLICT (slug) DO NOTHING;

-- Add TWS Earbuds Brands under Earbuds L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['AirPods Pro 2', 'AirPods 3rd Gen', 'Galaxy Buds3 Pro', 'Galaxy Buds3', 'Galaxy Buds FE', 'Sony WF Series', 'Jabra Elite', 'Nothing Ear', 'Beats Fit Pro', 'Bose QuietComfort Earbuds', 'Sennheiser Momentum', 'JBL Earbuds', 'Anker Soundcore', 'Sport Earbuds', 'Budget TWS']),
  unnest(ARRAY['airpods-pro-2', 'airpods-3rd-gen', 'galaxy-buds3-pro', 'galaxy-buds3', 'galaxy-buds-fe', 'sony-wf-series', 'jabra-elite', 'nothing-ear', 'beats-fit-pro', 'bose-qc-earbuds', 'sennheiser-momentum-tws', 'jbl-earbuds', 'anker-soundcore', 'sport-earbuds', 'budget-tws']),
  (SELECT id FROM categories WHERE slug = 'earbuds'),
  unnest(ARRAY['AirPods Pro 2', 'AirPods 3-то Поколение', 'Galaxy Buds3 Pro', 'Galaxy Buds3', 'Galaxy Buds FE', 'Sony WF Серия', 'Jabra Elite', 'Nothing Ear', 'Beats Fit Pro', 'Bose QuietComfort Earbuds', 'Sennheiser Momentum', 'JBL Слушалки', 'Anker Soundcore', 'Спортни Слушалки', 'Бюджетни TWS']),
  '🎵'
ON CONFLICT (slug) DO NOTHING;

-- Add Speaker Types under Speakers L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['JBL Portable Speakers', 'Ultimate Ears Speakers', 'Bose Portable', 'Sony Portable', 'Marshall Speakers', 'Bang & Olufsen', 'Sonos Speakers', 'KEF Speakers', 'Klipsch Speakers', 'Party Speakers', 'Desktop Speakers', 'Outdoor Speakers', 'Waterproof Speakers', 'Multi-Room Speakers']),
  unnest(ARRAY['jbl-portable-speakers', 'ultimate-ears-speakers', 'bose-portable', 'sony-portable', 'marshall-speakers', 'bang-olufsen', 'sonos-speakers', 'kef-speakers', 'klipsch-speakers', 'party-speakers', 'desktop-speakers', 'outdoor-speakers', 'waterproof-speakers', 'multi-room-speakers']),
  (SELECT id FROM categories WHERE slug = 'speakers'),
  unnest(ARRAY['JBL Преносими Колонки', 'Ultimate Ears Колонки', 'Bose Преносими', 'Sony Преносими', 'Marshall Колонки', 'Bang & Olufsen', 'Sonos Колонки', 'KEF Колонки', 'Klipsch Колонки', 'Парти Колонки', 'Настолни Колонки', 'Външни Колонки', 'Водоустойчиви Колонки', 'Multi-Room Колонки']),
  '🔊'
ON CONFLICT (slug) DO NOTHING;

-- Add Microphone Types under Microphones L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Blue Yeti Series', 'Shure SM Series', 'Rode Microphones', 'Elgato Wave', 'HyperX QuadCast', 'Audio-Technica Mics', 'USB Microphones', 'XLR Microphones', 'Lavalier Microphones', 'Shotgun Microphones', 'Podcasting Mics', 'Streaming Mics', 'Vocal Microphones', 'Microphone Bundles']),
  unnest(ARRAY['blue-yeti-series', 'shure-sm-series', 'rode-microphones', 'elgato-wave', 'hyperx-quadcast', 'audio-technica-mics', 'usb-microphones', 'xlr-microphones', 'lavalier-microphones', 'shotgun-microphones', 'podcasting-mics', 'streaming-mics', 'vocal-microphones', 'microphone-bundles']),
  (SELECT id FROM categories WHERE slug = 'microphones'),
  unnest(ARRAY['Blue Yeti Серия', 'Shure SM Серия', 'Rode Микрофони', 'Elgato Wave', 'HyperX QuadCast', 'Audio-Technica Микрофони', 'USB Микрофони', 'XLR Микрофони', 'Lavalier Микрофони', 'Shotgun Микрофони', 'Микрофони за Подкасти', 'Микрофони за Стрийминг', 'Вокални Микрофони', 'Микрофонни Комплекти']),
  '🎤'
ON CONFLICT (slug) DO NOTHING;

-- Add Soundbar Types under Soundbars L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Samsung Soundbars', 'Sony Soundbars', 'Bose Soundbars', 'Sonos Soundbars', 'LG Soundbars', 'JBL Soundbars', 'Dolby Atmos Soundbars', 'Soundbar with Subwoofer', 'All-in-One Soundbars', 'Budget Soundbars', 'Premium Soundbars', '5.1 Soundbar Systems', '7.1 Soundbar Systems']),
  unnest(ARRAY['samsung-soundbars', 'sony-soundbars', 'bose-soundbars', 'sonos-soundbars', 'lg-soundbars', 'jbl-soundbars', 'dolby-atmos-soundbars', 'soundbar-with-subwoofer', 'all-in-one-soundbars', 'budget-soundbars', 'premium-soundbars', '51-soundbar-systems', '71-soundbar-systems']),
  (SELECT id FROM categories WHERE slug = 'audio-soundbars'),
  unnest(ARRAY['Samsung Саундбарове', 'Sony Саундбарове', 'Bose Саундбарове', 'Sonos Саундбарове', 'LG Саундбарове', 'JBL Саундбарове', 'Dolby Atmos Саундбарове', 'Саундбар със Субуфер', 'All-in-One Саундбарове', 'Бюджетни Саундбарове', 'Премиум Саундбарове', '5.1 Саундбар Системи', '7.1 Саундбар Системи']),
  '📺'
ON CONFLICT (slug) DO NOTHING;

-- Add True Wireless Earbuds Types under True Wireless Earbuds L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Premium TWS', 'Mid-Range TWS', 'Budget TWS Earbuds', 'Sports TWS', 'Gaming TWS', 'ANC TWS', 'Open-Ear TWS', 'TWS with Wireless Charging']),
  unnest(ARRAY['premium-tws', 'mid-range-tws', 'budget-tws-earbuds', 'sports-tws', 'gaming-tws', 'anc-tws', 'open-ear-tws', 'tws-wireless-charging']),
  (SELECT id FROM categories WHERE slug = 'wireless-earbuds'),
  unnest(ARRAY['Премиум TWS', 'Средна Гама TWS', 'Бюджетни TWS Слушалки', 'Спортни TWS', 'Гейминг TWS', 'ANC TWS', 'Open-Ear TWS', 'TWS с Безжично Зареждане']),
  '🎵'
ON CONFLICT (slug) DO NOTHING;

-- Add Home Audio Types under Home Audio Systems L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Stereo Systems', 'Hi-Fi Systems', 'Turntables', 'CD Players', 'Network Audio Players', 'DAC/Amplifiers', 'Receiver Systems', 'Vinyl Record Players', 'Bookshelf Systems', 'Component Systems']),
  unnest(ARRAY['stereo-systems', 'hifi-systems', 'turntables', 'cd-players', 'network-audio-players', 'dac-amplifiers', 'receiver-systems', 'vinyl-record-players', 'bookshelf-systems', 'component-systems']),
  (SELECT id FROM categories WHERE slug = 'home-audio-systems'),
  unnest(ARRAY['Стерео Системи', 'Hi-Fi Системи', 'Грамофони', 'CD Плейъри', 'Мрежови Аудио Плейъри', 'DAC/Усилватели', 'Ресийвър Системи', 'Винил Грамофони', 'Bookshelf Системи', 'Компонентни Системи']),
  '🎶'
ON CONFLICT (slug) DO NOTHING;

-- Add Studio Equipment Types under Studio Equipment L2
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Audio Interfaces', 'Studio Monitors', 'MIDI Controllers', 'Mixers', 'Preamps', 'Studio Headphones', 'Pop Filters', 'Boom Arms', 'Acoustic Panels', 'Recording Bundles']),
  unnest(ARRAY['audio-interfaces', 'studio-monitors-audio', 'midi-controllers', 'mixers', 'preamps', 'studio-headphones', 'pop-filters', 'boom-arms', 'acoustic-panels', 'recording-bundles']),
  (SELECT id FROM categories WHERE slug = 'studio-equipment'),
  unnest(ARRAY['Аудио Интерфейси', 'Студийни Монитори', 'MIDI Контролери', 'Миксери', 'Предусилватели', 'Студийни Слушалки', 'Поп Филтри', 'Рамена за Микрофон', 'Акустични Панели', 'Комплекти за Запис']),
  '🎚️'
ON CONFLICT (slug) DO NOTHING;
;
