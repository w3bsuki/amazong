
-- Phase 5: E-Mobility - Accessories, Parts, Charging L3 Categories

-- E-Mobility Accessories > Helmets L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Full Face Helmets', 'Half Shell Helmets', 'Smart Helmets', 'Kids Helmets', 'Mountain Helmets', 'Urban Helmets']),
  unnest(ARRAY['emob-helmets-full', 'emob-helmets-half', 'emob-helmets-smart', 'emob-helmets-kids', 'emob-helmets-mountain', 'emob-helmets-urban']),
  (SELECT id FROM categories WHERE slug = 'emob-acc-helmets'),
  unnest(ARRAY['Цял шлем', 'Полушлем', 'Смарт каски', 'Детски каски', 'Планински каски', 'Градски каски']),
  '⛑️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- E-Mobility Accessories > Locks & Security L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['U-Locks', 'Chain Locks', 'Folding Locks', 'Cable Locks', 'Smart Locks', 'GPS Trackers']),
  unnest(ARRAY['emob-locks-u', 'emob-locks-chain', 'emob-locks-folding', 'emob-locks-cable', 'emob-locks-smart', 'emob-locks-gps']),
  (SELECT id FROM categories WHERE slug = 'emob-acc-locks'),
  unnest(ARRAY['U-катинари', 'Верижни катинари', 'Сгъваеми катинари', 'Кабелни катинари', 'Смарт катинари', 'GPS тракери']),
  '🔒',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- E-Mobility Accessories > Lights & Reflectors L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Front Lights', 'Rear Lights', 'Light Sets', 'Wheel Lights', 'Reflective Gear', 'Turn Signals']),
  unnest(ARRAY['emob-lights-front', 'emob-lights-rear', 'emob-lights-sets', 'emob-lights-wheel', 'emob-lights-reflective', 'emob-lights-signals']),
  (SELECT id FROM categories WHERE slug = 'emob-acc-lights'),
  unnest(ARRAY['Предни светлини', 'Задни светлини', 'Комплект светлини', 'Светлини за колела', 'Рефлективни аксесоари', 'Мигачи']),
  '💡',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- E-Mobility Accessories > Protection Gear L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Knee Pads', 'Elbow Pads', 'Wrist Guards', 'Full Body Armor', 'Gloves', 'Protection Sets']),
  unnest(ARRAY['emob-protect-knee', 'emob-protect-elbow', 'emob-protect-wrist', 'emob-protect-armor', 'emob-protect-gloves', 'emob-protect-sets']),
  (SELECT id FROM categories WHERE slug = 'emob-acc-protection'),
  unnest(ARRAY['Наколенки', 'Налакътници', 'Предпазители за китки', 'Цялостна броня', 'Ръкавици', 'Комплекти за защита']),
  '🦺',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- E-Mobility Parts > Batteries L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['36V Batteries', '48V Batteries', '52V Batteries', '60V Batteries', '72V Batteries', 'Custom Batteries']),
  unnest(ARRAY['emob-batt-36v', 'emob-batt-48v', 'emob-batt-52v', 'emob-batt-60v', 'emob-batt-72v', 'emob-batt-custom']),
  (SELECT id FROM categories WHERE slug = 'emob-parts-batteries'),
  unnest(ARRAY['36V батерии', '48V батерии', '52V батерии', '60V батерии', '72V батерии', 'Персонализирани батерии']),
  '🔋',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- E-Mobility Parts > Motors L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Hub Motors', 'Mid-Drive Motors', 'Gear Motors', 'Direct Drive Motors', 'Motor Kits', 'Motor Controllers']),
  unnest(ARRAY['emob-motors-hub', 'emob-motors-mid', 'emob-motors-gear', 'emob-motors-direct', 'emob-motors-kits', 'emob-motors-controllers']),
  (SELECT id FROM categories WHERE slug = 'emob-parts-motors'),
  unnest(ARRAY['Хъб мотори', 'Среден мотор', 'Мотори с предавки', 'Директно задвижване', 'Комплекти мотори', 'Контролери за мотори']),
  '⚡',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- E-Mobility Parts > Tires & Tubes L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Pneumatic Tires', 'Solid Tires', 'Tubeless Tires', 'Inner Tubes', 'Fat Tires', 'Road Tires']),
  unnest(ARRAY['emob-tires-pneumatic', 'emob-tires-solid', 'emob-tires-tubeless', 'emob-tires-tubes', 'emob-tires-fat', 'emob-tires-road']),
  (SELECT id FROM categories WHERE slug = 'emob-parts-tires'),
  unnest(ARRAY['Пневматични гуми', 'Плътни гуми', 'Безкамерни гуми', 'Вътрешни гуми', 'Дебели гуми', 'Шосейни гуми']),
  '🔘',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Charging & Power > Chargers L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Standard Chargers', 'Fast Chargers', 'Smart Chargers', 'Multi-Port Chargers', 'Universal Chargers', 'Charger Adapters']),
  unnest(ARRAY['emob-charge-standard', 'emob-charge-fast-2', 'emob-charge-smart', 'emob-charge-multi', 'emob-charge-universal', 'emob-charge-adapters']),
  (SELECT id FROM categories WHERE slug = 'emobility-chargers'),
  unnest(ARRAY['Стандартни зарядни', 'Бързи зарядни', 'Смарт зарядни', 'Многопортови зарядни', 'Универсални зарядни', 'Адаптери за зарядни']),
  '🔌',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Charging & Power > Charging Stations L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Wall Mounted Stations', 'Pedestal Stations', 'Commercial Stations', 'Residential Stations', 'Multi-Bike Stations']),
  unnest(ARRAY['emob-station-wall', 'emob-station-pedestal', 'emob-station-commercial', 'emob-station-residential', 'emob-station-multi']),
  (SELECT id FROM categories WHERE slug = 'emob-charge-stations'),
  unnest(ARRAY['Стенни станции', 'Пиедестални станции', 'Търговски станции', 'Домашни станции', 'Многоместни станции']),
  '⚡',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;
;
