-- Add L4 categories for E-Mobility (priority category with 0 L4s)

-- E-Bikes by brand
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Xiaomi E-Bikes', 'Specialized E-Bikes', 'Trek E-Bikes', 'Giant E-Bikes', 'Rad Power E-Bikes', 'Aventon E-Bikes', 'Lectric E-Bikes', 'Budget E-Bikes']),
  unnest(ARRAY['Xiaomi Електрически велосипеди', 'Specialized Електрически велосипеди', 'Trek Електрически велосипеди', 'Giant Електрически велосипеди', 'Rad Power Електрически велосипеди', 'Aventon Електрически велосипеди', 'Lectric Електрически велосипеди', 'Бюджетни електрически велосипеди']),
  unnest(ARRAY['ebike-xiaomi', 'ebike-specialized', 'ebike-trek', 'ebike-giant', 'ebike-rad-power', 'ebike-aventon', 'ebike-lectric', 'ebike-budget']),
  id,
  '🚴'
FROM categories WHERE slug = 'emob-ebikes-city' OR slug = 'city-ebikes'
LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- E-Scooters by brand
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Xiaomi Scooters', 'Segway-Ninebot', 'VSETT Scooters', 'Apollo Scooters', 'Kaabo Scooters', 'Dualtron Scooters', 'EMOVE Scooters', 'Budget Scooters']),
  unnest(ARRAY['Xiaomi Тротинетки', 'Segway-Ninebot', 'VSETT Тротинетки', 'Apollo Тротинетки', 'Kaabo Тротинетки', 'Dualtron Тротинетки', 'EMOVE Тротинетки', 'Бюджетни тротинетки']),
  unnest(ARRAY['escooter-xiaomi', 'escooter-segway', 'escooter-vsett', 'escooter-apollo', 'escooter-kaabo', 'escooter-dualtron', 'escooter-emove', 'escooter-budget']),
  id,
  '🛴'
FROM categories WHERE slug = 'commuter-escooters' OR slug = 'emob-escooters'
LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- E-Scooters by speed class
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['25 km/h E-Scooters', '35 km/h E-Scooters', '45+ km/h E-Scooters', 'Off-Road E-Scooters', 'Seated E-Scooters', 'Lightweight E-Scooters']),
  unnest(ARRAY['25 км/ч Тротинетки', '35 км/ч Тротинетки', '45+ км/ч Тротинетки', 'Офроуд тротинетки', 'Тротинетки със седалка', 'Леки тротинетки']),
  unnest(ARRAY['escooter-25kmh', 'escooter-35kmh', 'escooter-45plus', 'escooter-offroad', 'escooter-seated', 'escooter-lightweight']),
  id,
  '🛴'
FROM categories WHERE slug = 'performance-escooters' OR slug = 'emob-escooters-performance'
LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Hoverboards/Self-Balancing by type
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['6.5" Hoverboards', '8.5" Hoverboards', '10" Hoverboards', 'All-Terrain Hoverboards', 'LED Hoverboards', 'Kids Hoverboards']),
  unnest(ARRAY['6.5" Ховърборди', '8.5" Ховърборди', '10" Ховърборди', 'Всички терени ховърборди', 'LED Ховърборди', 'Детски ховърборди']),
  unnest(ARRAY['hoverboard-6inch', 'hoverboard-8inch', 'hoverboard-10inch', 'hoverboard-terrain', 'hoverboard-led', 'hoverboard-kids']),
  id,
  '🛹'
FROM categories WHERE slug = 'emob-hoverboards' OR slug = 'hoverboards'
LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- E-Mobility Parts by type
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['E-Bike Batteries', 'E-Scooter Batteries', 'Replacement Chargers', 'Brake Sets', 'Tires & Tubes', 'Controllers', 'Display Units', 'Motor Replacements']),
  unnest(ARRAY['Батерии за електровелосипеди', 'Батерии за тротинетки', 'Резервни зарядни', 'Спирачни комплекти', 'Гуми и камери', 'Контролери', 'Дисплеи', 'Мотори за замяна']),
  unnest(ARRAY['emob-parts-ebike-battery', 'emob-parts-escooter-battery', 'emob-parts-chargers', 'emob-parts-brakes', 'emob-parts-tires', 'emob-parts-controllers', 'emob-parts-displays', 'emob-parts-motors']),
  id,
  '🔧'
FROM categories WHERE slug = 'emob-parts' OR slug = 'e-mobility-parts'
LIMIT 1
ON CONFLICT (slug) DO NOTHING;;
