
-- Phase 5: E-Mobility - Unicycles, Hoverboards, Go-Karts L3 Categories

-- E-Unicycles > Beginner EUC L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['14-inch Beginner', '16-inch Beginner', 'Training EUC', 'Lightweight Starter', 'Budget Beginner']),
  unnest(ARRAY['euc-beginner-14', 'euc-beginner-16', 'euc-beginner-training', 'euc-beginner-light', 'euc-beginner-budget']),
  (SELECT id FROM categories WHERE slug = 'emob-euc-beginner'),
  unnest(ARRAY['14-инчови начинаещи', '16-инчови начинаещи', 'Тренировъчни EUC', 'Леки начинаещи', 'Бюджетни начинаещи']),
  '🎡',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Unicycles > Commuter EUC L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['16-inch Commuter', '18-inch Commuter', 'Long Range Commuter', 'Fast Commuter', 'All-Weather Commuter']),
  unnest(ARRAY['euc-commuter-16', 'euc-commuter-18', 'euc-commuter-range', 'euc-commuter-fast', 'euc-commuter-weather']),
  (SELECT id FROM categories WHERE slug = 'emob-euc-commuter'),
  unnest(ARRAY['16-инчови комутър', '18-инчови комутър', 'С голям обхват', 'Бързи комутър', 'Всяко време']),
  '🎡',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Unicycles > Performance EUC L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['High-Speed EUC', 'Long-Range Performance', 'Suspension EUC', 'Racing EUC', 'Premium Performance']),
  unnest(ARRAY['euc-perf-speed', 'euc-perf-range', 'euc-perf-suspension', 'euc-perf-racing', 'euc-perf-premium']),
  (SELECT id FROM categories WHERE slug = 'emob-euc-performance'),
  unnest(ARRAY['Високоскоростни EUC', 'С голям обхват', 'С окачване EUC', 'Състезателни EUC', 'Премиум производителност']),
  '🎡',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- E-Unicycles > Off-Road EUC L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Trail EUC', 'Mountain EUC', 'Knobby Tire EUC', 'All-Terrain EUC', 'Adventure EUC']),
  unnest(ARRAY['euc-offroad-trail', 'euc-offroad-mountain', 'euc-offroad-knobby', 'euc-offroad-terrain', 'euc-offroad-adventure']),
  (SELECT id FROM categories WHERE slug = 'emob-euc-offroad'),
  unnest(ARRAY['Трейл EUC', 'Планински EUC', 'С грапави гуми', 'Всичко терен EUC', 'Приключенски EUC']),
  '🎡',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Hoverboards > Standard Hoverboards L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['6.5-inch Hoverboards', '8-inch Hoverboards', '10-inch Hoverboards', 'Bluetooth Hoverboards', 'LED Hoverboards', 'UL2272 Certified']),
  unnest(ARRAY['hover-standard-6', 'hover-standard-8', 'hover-standard-10', 'hover-standard-bt', 'hover-standard-led', 'hover-standard-ul']),
  (SELECT id FROM categories WHERE slug = 'emob-hover-standard'),
  unnest(ARRAY['6.5-инчови', '8-инчови', '10-инчови', 'С Bluetooth', 'С LED', 'UL2272 сертифицирани']),
  '🛹',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Hoverboards > Off-Road Hoverboards L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['8.5-inch Off-Road', '10-inch Off-Road', 'All-Terrain Hoverboards', 'Sand Hoverboards', 'Mud Hoverboards']),
  unnest(ARRAY['hover-offroad-8', 'hover-offroad-10', 'hover-offroad-terrain', 'hover-offroad-sand', 'hover-offroad-mud']),
  (SELECT id FROM categories WHERE slug = 'emob-hover-offroad'),
  unnest(ARRAY['8.5-инчови офроуд', '10-инчови офроуд', 'Всичко терен', 'За пясък', 'За кал']),
  '🛹',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Hoverboards > Segways L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Ninebot Mini', 'Ninebot S', 'Ninebot Max', 'Segway PT', 'Segway Go-Kart', 'Segway Drift']),
  unnest(ARRAY['hover-segway-mini', 'hover-segway-s', 'hover-segway-max', 'hover-segway-pt', 'hover-segway-gokart', 'hover-segway-drift']),
  (SELECT id FROM categories WHERE slug = 'emob-hover-segway'),
  unnest(ARRAY['Ninebot Мини', 'Ninebot S', 'Ninebot Макс', 'Segway PT', 'Segway Go-Kart', 'Segway Drift']),
  '🛹',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Hoverboards > Go-Kart Kits L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Basic Go-Kart Kits', 'Racing Go-Kart Kits', 'Off-Road Go-Kart Kits', 'Kids Go-Kart Kits', 'Premium Go-Kart Kits']),
  unnest(ARRAY['hover-gokart-basic', 'hover-gokart-racing', 'hover-gokart-offroad', 'hover-gokart-kids', 'hover-gokart-premium']),
  (SELECT id FROM categories WHERE slug = 'emob-hover-gokart'),
  unnest(ARRAY['Базови комплекти', 'Състезателни комплекти', 'Офроуд комплекти', 'Детски комплекти', 'Премиум комплекти']),
  '🏎️',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Electric Go-Karts > Adult Go-Karts L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Racing Go-Karts', 'Recreational Go-Karts', 'Off-Road Go-Karts', 'High-Performance Go-Karts', 'Street Legal Go-Karts']),
  unnest(ARRAY['gokart-adult-racing', 'gokart-adult-rec', 'gokart-adult-offroad', 'gokart-adult-perf', 'gokart-adult-street']),
  (SELECT id FROM categories WHERE slug = 'emob-kart-adult'),
  unnest(ARRAY['Състезателни', 'Рекреационни', 'Офроуд картове', 'Високо производителни', 'За улично движение']),
  '🏎️',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Electric Go-Karts > Kids Go-Karts L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Ages 3-5 Go-Karts', 'Ages 5-8 Go-Karts', 'Ages 8-12 Go-Karts', 'Teen Go-Karts', 'Beginner Kids Go-Karts']),
  unnest(ARRAY['gokart-kids-3-5', 'gokart-kids-5-8', 'gokart-kids-8-12', 'gokart-kids-teen', 'gokart-kids-beginner']),
  (SELECT id FROM categories WHERE slug = 'emob-kart-kids'),
  unnest(ARRAY['За 3-5 години', 'За 5-8 години', 'За 8-12 години', 'Тийнейджърски', 'За начинаещи деца']),
  '🏎️',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Electric Go-Karts > Drift Karts L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Electric Drift Trikes', 'Drift Go-Karts', 'Spinning Karts', 'Pro Drift Karts', 'Entry Drift Karts']),
  unnest(ARRAY['gokart-drift-trike', 'gokart-drift-kart', 'gokart-drift-spinning', 'gokart-drift-pro', 'gokart-drift-entry']),
  (SELECT id FROM categories WHERE slug = 'emob-kart-drift'),
  unnest(ARRAY['Електрически дрифт триколки', 'Дрифт картове', 'Въртящи се картове', 'Про дрифт картове', 'Начални дрифт картове']),
  '🏎️',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;
;
