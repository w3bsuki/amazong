
-- Phase 5: E-Mobility - E-Bikes L3 Categories

-- E-Bikes > City E-Bikes L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Step-Through City', 'Step-Over City', 'Hybrid City', 'Comfort City', 'Urban Cruiser', 'Ladies City E-Bikes', 'Mens City E-Bikes']),
  unnest(ARRAY['ebikes-city-step-through', 'ebikes-city-step-over', 'ebikes-city-hybrid', 'ebikes-city-comfort', 'ebikes-city-cruiser', 'ebikes-city-ladies', 'ebikes-city-mens']),
  (SELECT id FROM categories WHERE slug = 'emob-ebikes-city'),
  unnest(ARRAY['Градски с нисък преход', 'Градски с висок преход', 'Хибридни градски', 'Комфортни градски', 'Градски круизер', 'Дамски градски', 'Мъжки градски']),
  '🚲',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- E-Bikes > Mountain E-Bikes L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Hardtail EMTB', 'Full Suspension EMTB', 'Cross Country EMTB', 'Trail EMTB', 'Enduro EMTB', 'Downhill EMTB']),
  unnest(ARRAY['ebikes-mountain-hardtail', 'ebikes-mountain-full', 'ebikes-mountain-xc', 'ebikes-mountain-trail', 'ebikes-mountain-enduro', 'ebikes-mountain-downhill']),
  (SELECT id FROM categories WHERE slug = 'emob-ebikes-mountain'),
  unnest(ARRAY['Твърда опашка EMTB', 'Пълно окачване EMTB', 'Крос кънтри EMTB', 'Трейл EMTB', 'Ендуро EMTB', 'Даунхил EMTB']),
  '🚵',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- E-Bikes > Folding E-Bikes L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Compact Folding', 'Full-Size Folding', 'Fat Tire Folding', 'Lightweight Folding', 'Cargo Folding']),
  unnest(ARRAY['ebikes-folding-compact', 'ebikes-folding-full', 'ebikes-folding-fat', 'ebikes-folding-light', 'ebikes-folding-cargo']),
  (SELECT id FROM categories WHERE slug = 'emob-ebikes-folding'),
  unnest(ARRAY['Компактни сгъваеми', 'Пълноразмерни сгъваеми', 'С дебели гуми сгъваеми', 'Леки сгъваеми', 'Карго сгъваеми']),
  '🚲',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Bikes > Cargo E-Bikes L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Longtail Cargo', 'Front Loader Cargo', 'Box Bike Cargo', 'Midtail Cargo', 'Cargo Trailer Systems']),
  unnest(ARRAY['ebikes-cargo-longtail', 'ebikes-cargo-front', 'ebikes-cargo-box', 'ebikes-cargo-midtail', 'ebikes-cargo-trailer']),
  (SELECT id FROM categories WHERE slug = 'emob-ebikes-cargo'),
  unnest(ARRAY['Дълга опашка карго', 'Предно натоварване карго', 'Кутия карго', 'Средна опашка карго', 'Карго ремарке системи']),
  '📦',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Bikes > Fat Tire E-Bikes L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Beach Fat Tire', 'Snow Fat Tire', 'All-Terrain Fat Tire', 'Hunting Fat Tire', 'Cruiser Fat Tire']),
  unnest(ARRAY['ebikes-fat-beach', 'ebikes-fat-snow', 'ebikes-fat-terrain', 'ebikes-fat-hunting', 'ebikes-fat-cruiser']),
  (SELECT id FROM categories WHERE slug = 'emob-ebikes-fat'),
  unnest(ARRAY['Плажни с дебели гуми', 'Снежни с дебели гуми', 'Всичко терен', 'Ловни с дебели гуми', 'Круизер с дебели гуми']),
  '🚲',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Bikes > Road E-Bikes L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Road Race E-Bikes', 'Gravel E-Bikes', 'Endurance Road', 'Aero Road', 'Touring E-Bikes']),
  unnest(ARRAY['ebikes-road-race', 'ebikes-road-gravel', 'ebikes-road-endurance', 'ebikes-road-aero', 'ebikes-road-touring']),
  (SELECT id FROM categories WHERE slug = 'emob-ebikes-road'),
  unnest(ARRAY['Шосейни състезателни', 'Гравел е-велосипеди', 'Ендуранс шосейни', 'Аеро шосейни', 'Туристически е-вело']),
  '🚴',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Bikes > Commuter E-Bikes L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Speed Pedelec', 'Class 3 Commuter', 'Belt Drive Commuter', 'Hub Motor Commuter', 'Mid-Drive Commuter']),
  unnest(ARRAY['ebikes-commuter-speed', 'ebikes-commuter-class3', 'ebikes-commuter-belt', 'ebikes-commuter-hub', 'ebikes-commuter-mid']),
  (SELECT id FROM categories WHERE slug = 'emob-ebikes-commuter'),
  unnest(ARRAY['Скоростен педелек', 'Клас 3 комутър', 'С ремъчно предаване', 'С мотор в главината', 'Среден мотор комутър']),
  '🚲',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Bikes > Kids E-Bikes L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Kids Mountain E-Bikes', 'Kids BMX E-Bikes', 'Teen E-Bikes', 'Balance E-Bikes', 'Youth Commuter']),
  unnest(ARRAY['ebikes-kids-mountain', 'ebikes-kids-bmx', 'ebikes-kids-teen', 'ebikes-kids-balance', 'ebikes-kids-commuter']),
  (SELECT id FROM categories WHERE slug = 'emob-ebikes-kids'),
  unnest(ARRAY['Детски планински', 'Детски BMX', 'Тийнейджърски', 'Баланс е-вело', 'Младежки комутър']),
  '🚲',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;
;
