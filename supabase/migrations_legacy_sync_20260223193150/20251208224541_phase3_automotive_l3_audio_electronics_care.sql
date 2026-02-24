
-- Phase 3.1.5: Automotive Audio, Electronics & Car Care L3 Categories

-- Car Audio L3 (parent: car-audio OR auto-audio)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Head Units', 'Car Speakers', 'Subwoofers', 'Amplifiers', 'Tweeters', 'Component Speakers', 'Coaxial Speakers', 'Bass Tubes', 'Sound Processors', 'Wiring Kits']),
  unnest(ARRAY['audio-head-units', 'audio-speakers', 'audio-subwoofers', 'audio-amplifiers', 'audio-tweeters', 'audio-component', 'audio-coaxial', 'audio-bass-tubes', 'audio-processors', 'audio-wiring-kits']),
  (SELECT id FROM categories WHERE slug = 'car-audio'),
  unnest(ARRAY['Мултимедии', 'Говорители', 'Субуфери', 'Усилватели', 'Тонколони', 'Компонентни', 'Коаксиални', 'Бас тръби', 'Процесори', 'Кабелни комплекти']),
  '🔊'
ON CONFLICT (slug) DO NOTHING;

-- Auto Audio L3 (parent: auto-audio - duplicate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Android Auto Units', 'Apple CarPlay Units', 'Double DIN Units', 'Single DIN Units', 'Bluetooth Receivers', 'DAB+ Tuners', 'FM Transmitters']),
  unnest(ARRAY['audio-android-auto', 'audio-carplay', 'audio-double-din', 'audio-single-din', 'audio-bluetooth', 'audio-dab', 'audio-fm-transmitters']),
  (SELECT id FROM categories WHERE slug = 'auto-audio'),
  unnest(ARRAY['Android Auto', 'Apple CarPlay', 'Двоен DIN', 'Единичен DIN', 'Bluetooth приемници', 'DAB+ тунери', 'FM трансмитери']),
  '🔊'
ON CONFLICT (slug) DO NOTHING;

-- Car Care L3 (parent: auto-care)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Car Wash Soap', 'Wax & Polish', 'Clay Bars', 'Microfiber Towels', 'Wash Mitts', 'Detailing Brushes', 'Glass Cleaners', 'Interior Cleaners', 'Leather Care', 'Tire Shine']),
  unnest(ARRAY['care-wash-soap', 'care-wax-polish', 'care-clay-bars', 'care-microfiber', 'care-wash-mitts', 'care-brushes', 'care-glass-cleaners', 'care-interior-cleaners', 'care-leather', 'care-tire-shine']),
  (SELECT id FROM categories WHERE slug = 'auto-care'),
  unnest(ARRAY['Автошампоани', 'Восъци и полиш', 'Глина', 'Микрофибърни кърпи', 'Ръкавици за миене', 'Четки', 'Препарати стъкло', 'Препарати интериор', 'Грижа за кожа', 'Гланц за гуми']),
  '🧴'
ON CONFLICT (slug) DO NOTHING;

-- Detailing & Car Wash L3 (parent: auto-detailing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pressure Washers', 'Foam Cannons', 'Polishing Machines', 'Vacuums', 'Steam Cleaners', 'Air Dryers', 'Detailing Kits', 'Ceramic Coatings', 'Paint Sealants', 'Bug & Tar Removers']),
  unnest(ARRAY['detail-pressure-washers', 'detail-foam-cannons', 'detail-polishers', 'detail-vacuums', 'detail-steam-cleaners', 'detail-air-dryers', 'detail-kits', 'detail-ceramic', 'detail-sealants', 'detail-bug-tar']),
  (SELECT id FROM categories WHERE slug = 'auto-detailing'),
  unnest(ARRAY['Водоструйки', 'Пенообразуватели', 'Полирмашини', 'Прахосмукачки', 'Парочистачки', 'Сушилни', 'Комплекти детайлинг', 'Керамични покрития', 'Уплътнители боя', 'Премахване смоли']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Car Safety L3 (parent: auto-safety)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dash Cameras', 'Rear View Cameras', 'Parking Sensors', 'Blind Spot Monitors', 'Tire Pressure Monitors', 'Car Alarms', 'Immobilizers', 'Steering Wheel Locks', 'GPS Trackers', 'Emergency Kits']),
  unnest(ARRAY['safety-dash-cams', 'safety-rear-cameras', 'safety-parking-sensors', 'safety-blind-spot', 'safety-tpms', 'safety-alarms', 'safety-immobilizers', 'safety-steering-locks', 'safety-gps-trackers', 'safety-emergency-kits']),
  (SELECT id FROM categories WHERE slug = 'auto-safety'),
  unnest(ARRAY['Видеорегистратори', 'Камери заден ход', 'Парктроници', 'Мониторинг мъртва зона', 'Датчици налягане', 'Аларми', 'Имобилайзери', 'Блокатори волан', 'GPS тракери', 'Аварийни комплекти']),
  '🚨'
ON CONFLICT (slug) DO NOTHING;

-- Car Exterior L3 (parent: auto-exterior)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Paint Protection Film', 'Ceramic Spray', 'Quick Detailer', 'Compound', 'Polish', 'Spray Wax', 'Trim Restorer', 'Headlight Restoration', 'Wheel Cleaner', 'Iron Remover']),
  unnest(ARRAY['ext-ppf', 'ext-ceramic-spray', 'ext-quick-detailer', 'ext-compound', 'ext-polish', 'ext-spray-wax', 'ext-trim-restorer', 'ext-headlight-restore', 'ext-wheel-cleaner', 'ext-iron-remover']),
  (SELECT id FROM categories WHERE slug = 'auto-exterior'),
  unnest(ARRAY['Защитно фолио', 'Керамичен спрей', 'Бърз детейлър', 'Паста', 'Полиш', 'Спрей восък', 'Пластмаса реставратор', 'Полиране фарове', 'Препарат джанти', 'Препарат желязо']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Car Interior L3 (parent: auto-interior)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Fabric Protector', 'Carpet Cleaner', 'Dashboard Protectant', 'Air Fresheners', 'Odor Eliminators', 'Plastic Cleaner', 'Vinyl Conditioner', 'All Purpose Cleaner', 'Stain Remover']),
  unnest(ARRAY['int-fabric-protector', 'int-carpet-cleaner', 'int-dashboard', 'int-air-fresheners', 'int-odor', 'int-plastic-cleaner', 'int-vinyl', 'int-all-purpose', 'int-stain-remover']),
  (SELECT id FROM categories WHERE slug = 'auto-interior'),
  unnest(ARRAY['Импрегнатор', 'Препарат килими', 'Защита табло', 'Ароматизатори', 'Елиминатори миризма', 'Препарат пластмаса', 'Препарат винил', 'Универсален препарат', 'Препарат петна']),
  '🧹'
ON CONFLICT (slug) DO NOTHING;
;
