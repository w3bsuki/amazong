
-- Phase 5: E-Mobility - E-Scooters & Boards L3 Categories

-- E-Scooters > Adult E-Scooters L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Budget Adult Scooters', 'Mid-Range Scooters', 'Premium Adult Scooters', 'Heavy Duty Scooters', 'Lightweight Adult Scooters']),
  unnest(ARRAY['escooters-adult-budget', 'escooters-adult-midrange', 'escooters-adult-premium', 'escooters-adult-heavy', 'escooters-adult-light']),
  (SELECT id FROM categories WHERE slug = 'emob-escooters-adult'),
  unnest(ARRAY['Бюджетни за възрастни', 'Среден клас тротинетки', 'Премиум за възрастни', 'Здрави товарни', 'Леки за възрастни']),
  '🛴',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Scooters > Kids E-Scooters L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Ages 6-8', 'Ages 8-12', 'Ages 12-14', 'Teen E-Scooters', 'Starter E-Scooters']),
  unnest(ARRAY['escooters-kids-6-8', 'escooters-kids-8-12', 'escooters-kids-12-14', 'escooters-kids-teen', 'escooters-kids-starter']),
  (SELECT id FROM categories WHERE slug = 'emob-escooters-kids'),
  unnest(ARRAY['За 6-8 години', 'За 8-12 години', 'За 12-14 години', 'Тийнейджърски', 'Начинаещи']),
  '🛴',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Scooters > Performance E-Scooters L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Dual Motor', 'Racing Scooters', 'High-Speed Scooters', 'Long Range', 'Track Scooters']),
  unnest(ARRAY['escooters-perf-dual', 'escooters-perf-racing', 'escooters-perf-speed', 'escooters-perf-range', 'escooters-perf-track']),
  (SELECT id FROM categories WHERE slug = 'emob-escooters-performance'),
  unnest(ARRAY['С два мотора', 'Състезателни', 'Високоскоростни', 'С голям обхват', 'За писта']),
  '🛴',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Scooters > Seated E-Scooters L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Moped Style', 'Bench Seat', 'Removable Seat', 'Comfort Seated', 'Mobility Scooters']),
  unnest(ARRAY['escooters-seated-moped', 'escooters-seated-bench', 'escooters-seated-removable', 'escooters-seated-comfort', 'escooters-seated-mobility']),
  (SELECT id FROM categories WHERE slug = 'emob-escooters-seated'),
  unnest(ARRAY['Мопед стил', 'Със пейка', 'С подвижна седалка', 'Комфортни', 'За мобилност']),
  '🛴',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Scooters > Off-Road E-Scooters L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['All-Terrain', 'Trail Scooters', 'Desert Scooters', 'Mountain Scooters', 'Adventure Scooters']),
  unnest(ARRAY['escooters-offroad-terrain', 'escooters-offroad-trail', 'escooters-offroad-desert', 'escooters-offroad-mountain', 'escooters-offroad-adventure']),
  (SELECT id FROM categories WHERE slug = 'emob-escooters-offroad'),
  unnest(ARRAY['Всичко терен', 'За пътеки', 'Пустинни', 'Планински', 'Приключенски']),
  '🛴',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Skateboards > Electric Skateboards L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Hub Motor Boards', 'Belt Drive Boards', 'All-Terrain Boards', 'Mini Boards', 'Cruiser Boards']),
  unnest(ARRAY['eboards-skate-hub', 'eboards-skate-belt', 'eboards-skate-terrain', 'eboards-skate-mini', 'eboards-skate-cruiser']),
  (SELECT id FROM categories WHERE slug = 'emob-eboards-skateboard'),
  unnest(ARRAY['С хъб мотор', 'С ремъчно предаване', 'Всичко терен', 'Мини дъски', 'Круизер дъски']),
  '🛹',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Skateboards > Electric Longboards L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Commuter Longboards', 'Carving Longboards', 'Speed Longboards', 'Drop-Through Longboards', 'Flexy Longboards']),
  unnest(ARRAY['eboards-long-commuter', 'eboards-long-carving', 'eboards-long-speed', 'eboards-long-dropthrough', 'eboards-long-flexy']),
  (SELECT id FROM categories WHERE slug = 'emob-eboards-longboard'),
  unnest(ARRAY['Комутър лонгборд', 'Карвинг лонгборд', 'Скоростен лонгборд', 'Дроп-тру лонгборд', 'Гъвкав лонгборд']),
  '🛹',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Skateboards > Onewheel L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Onewheel Pint', 'Onewheel GT', 'Onewheel Plus', 'Float Boards', 'Onewheel Accessories']),
  unnest(ARRAY['eboards-onewheel-pint', 'eboards-onewheel-gt', 'eboards-onewheel-plus', 'eboards-onewheel-float', 'eboards-onewheel-acc']),
  (SELECT id FROM categories WHERE slug = 'emob-eboards-onewheel'),
  unnest(ARRAY['Onewheel Пинт', 'Onewheel GT', 'Onewheel Плюс', 'Флоут бордове', 'Аксесоари Onewheel']),
  '🛹',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Skateboards > Electric Surfboards L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['eFoils', 'Jet Boards', 'Electric SUP', 'Body Boards', 'Wake Surfboards']),
  unnest(ARRAY['eboards-surf-efoil', 'eboards-surf-jet', 'eboards-surf-sup', 'eboards-surf-body', 'eboards-surf-wake']),
  (SELECT id FROM categories WHERE slug = 'emob-eboards-surfboard'),
  unnest(ARRAY['еФойл', 'Джет бордове', 'Електрически SUP', 'Боди бордове', 'Уейк сърфборд']),
  '🏄',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;
;
