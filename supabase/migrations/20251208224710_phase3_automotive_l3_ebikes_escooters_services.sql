
-- Phase 3.1.7: Automotive E-Bikes, E-Scooters & Services L3 Categories

-- City E-Bikes L3 (parent: ebike-city)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Commuter E-Bikes', 'Step-Through E-Bikes', 'Cruiser E-Bikes', 'Dutch Style E-Bikes', 'Hybrid E-Bikes']),
  unnest(ARRAY['ebike-city-commuter', 'ebike-city-step-through', 'ebike-city-cruiser', 'ebike-city-dutch', 'ebike-city-hybrid']),
  (SELECT id FROM categories WHERE slug = 'ebike-city'),
  unnest(ARRAY['Комютърни', 'Ниска рамка', 'Круизъри', 'Холандски стил', 'Хибридни']),
  '🚲'
ON CONFLICT (slug) DO NOTHING;

-- Mountain E-Bikes L3 (parent: ebike-mountain)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hardtail E-MTB', 'Full Suspension E-MTB', 'Trail E-Bikes', 'Enduro E-Bikes', 'Downhill E-Bikes', 'Cross Country E-MTB']),
  unnest(ARRAY['ebike-mtb-hardtail', 'ebike-mtb-full-sus', 'ebike-mtb-trail', 'ebike-mtb-enduro', 'ebike-mtb-downhill', 'ebike-mtb-xc']),
  (SELECT id FROM categories WHERE slug = 'ebike-mountain'),
  unnest(ARRAY['Hardtail', 'Пълно окачване', 'Trail', 'Enduro', 'Downhill', 'Cross Country']),
  '🚵'
ON CONFLICT (slug) DO NOTHING;

-- Road E-Bikes L3 (parent: ebike-road)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Racing E-Bikes', 'Gravel E-Bikes', 'Touring E-Bikes', 'Fitness E-Bikes']),
  unnest(ARRAY['ebike-road-racing', 'ebike-road-gravel', 'ebike-road-touring', 'ebike-road-fitness']),
  (SELECT id FROM categories WHERE slug = 'ebike-road'),
  unnest(ARRAY['Състезателни', 'Gravel', 'Туринг', 'Фитнес']),
  '🚴'
ON CONFLICT (slug) DO NOTHING;

-- Folding E-Bikes L3 (parent: ebike-folding)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Compact Folding', 'Full-Size Folding', 'Mini Folding', 'Fat Tire Folding']),
  unnest(ARRAY['ebike-fold-compact', 'ebike-fold-full', 'ebike-fold-mini', 'ebike-fold-fat']),
  (SELECT id FROM categories WHERE slug = 'ebike-folding'),
  unnest(ARRAY['Компактни сгъваеми', 'Пълноразмерни сгъваеми', 'Мини сгъваеми', 'Дебели гуми сгъваеми']),
  '🚲'
ON CONFLICT (slug) DO NOTHING;

-- Cargo E-Bikes L3 (parent: ebike-cargo)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Longtail Cargo', 'Front Loader Cargo', 'Mid-Tail Cargo', 'Box Cargo', 'Trike Cargo']),
  unnest(ARRAY['ebike-cargo-longtail', 'ebike-cargo-front', 'ebike-cargo-mid', 'ebike-cargo-box', 'ebike-cargo-trike']),
  (SELECT id FROM categories WHERE slug = 'ebike-cargo'),
  unnest(ARRAY['Longtail', 'Преден товар', 'Mid-Tail', 'Боксове', 'Триколки']),
  '📦'
ON CONFLICT (slug) DO NOTHING;

-- E-Bike Accessories L3 (parent: ebike-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['E-Bike Locks', 'E-Bike Lights', 'E-Bike Bags', 'E-Bike Mirrors', 'E-Bike Fenders', 'E-Bike Racks', 'E-Bike Helmets', 'E-Bike Phone Mounts', 'E-Bike Bells']),
  unnest(ARRAY['ebike-acc-locks', 'ebike-acc-lights', 'ebike-acc-bags', 'ebike-acc-mirrors', 'ebike-acc-fenders', 'ebike-acc-racks', 'ebike-acc-helmets', 'ebike-acc-phones', 'ebike-acc-bells']),
  (SELECT id FROM categories WHERE slug = 'ebike-accessories'),
  unnest(ARRAY['Заключващи', 'Светлини', 'Чанти', 'Огледала', 'Калници', 'Багажници', 'Каски', 'Стойки телефон', 'Звънци']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- E-Bike Batteries L3 (parent: ebike-batteries)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Frame Batteries', 'Rack Batteries', 'Downtube Batteries', 'Integrated Batteries', 'Spare Batteries']),
  unnest(ARRAY['ebike-batt-frame', 'ebike-batt-rack', 'ebike-batt-downtube', 'ebike-batt-integrated', 'ebike-batt-spare']),
  (SELECT id FROM categories WHERE slug = 'ebike-batteries'),
  unnest(ARRAY['За рамка', 'За багажник', 'Долна тръба', 'Интегрирани', 'Резервни']),
  '🔋'
ON CONFLICT (slug) DO NOTHING;

-- E-Bike Conversion Kits L3 (parent: ebike-conversion)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Front Hub Kits', 'Rear Hub Kits', 'Mid-Drive Kits', 'Complete Kits', 'Budget Kits']),
  unnest(ARRAY['ebike-conv-front', 'ebike-conv-rear', 'ebike-conv-mid', 'ebike-conv-complete', 'ebike-conv-budget']),
  (SELECT id FROM categories WHERE slug = 'ebike-conversion'),
  unnest(ARRAY['Предни главини', 'Задни главини', 'Централен мотор', 'Пълни комплекти', 'Бюджетни комплекти']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- Adult E-Scooters L3 (parent: escooter-adult)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Entry Level Scooters', 'Mid-Range Scooters', 'Premium Scooters', 'Dual Motor Scooters', 'Seated Scooters']),
  unnest(ARRAY['escooter-entry', 'escooter-mid', 'escooter-premium', 'escooter-dual', 'escooter-seated']),
  (SELECT id FROM categories WHERE slug = 'escooter-adult'),
  unnest(ARRAY['Начално ниво', 'Среден клас', 'Премиум', 'Двоен мотор', 'Със седалка']),
  '🛴'
ON CONFLICT (slug) DO NOTHING;

-- Performance Scooters L3 (parent: escooter-performance)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['High Speed Scooters', 'Long Range Scooters', 'Racing Scooters', 'Heavy Duty Scooters']),
  unnest(ARRAY['escooter-perf-speed', 'escooter-perf-range', 'escooter-perf-racing', 'escooter-perf-heavy']),
  (SELECT id FROM categories WHERE slug = 'escooter-performance'),
  unnest(ARRAY['Бързи тротинетки', 'Дълъг пробег', 'Състезателни', 'Тежкотоварни']),
  '🛴'
ON CONFLICT (slug) DO NOTHING;

-- Off-Road Scooters L3 (parent: escooter-offroad)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['All-Terrain Scooters', 'Trail Scooters', 'Fat Tire Scooters', 'Suspension Scooters']),
  unnest(ARRAY['escooter-off-terrain', 'escooter-off-trail', 'escooter-off-fat', 'escooter-off-sus']),
  (SELECT id FROM categories WHERE slug = 'escooter-offroad'),
  unnest(ARRAY['All-Terrain', 'Trail', 'Дебели гуми', 'С окачване']),
  '🛴'
ON CONFLICT (slug) DO NOTHING;

-- Commuter Scooters L3 (parent: escooter-commuter)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Lightweight Scooters', 'Portable Scooters', 'Folding Scooters', 'Waterproof Scooters']),
  unnest(ARRAY['escooter-comm-light', 'escooter-comm-portable', 'escooter-comm-folding', 'escooter-comm-waterproof']),
  (SELECT id FROM categories WHERE slug = 'escooter-commuter'),
  unnest(ARRAY['Леки', 'Преносими', 'Сгъваеми', 'Водоустойчиви']),
  '🛴'
ON CONFLICT (slug) DO NOTHING;

-- Kids E-Scooters L3 (parent: escooter-kids)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Ages 6-8 Scooters', 'Ages 8-12 Scooters', 'Ages 12+ Scooters', 'Safety Focused']),
  unnest(ARRAY['escooter-kids-6-8', 'escooter-kids-8-12', 'escooter-kids-12plus', 'escooter-kids-safe']),
  (SELECT id FROM categories WHERE slug = 'escooter-kids'),
  unnest(ARRAY['6-8 години', '8-12 години', '12+ години', 'Безопасни']),
  '🛴'
ON CONFLICT (slug) DO NOTHING;

-- E-Scooter Accessories L3 (parent: escooter-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Scooter Locks', 'Scooter Bags', 'Scooter Seats', 'Scooter Phone Mounts', 'Scooter Mirrors', 'Scooter Lights', 'Scooter Bells', 'Scooter Carrying Straps']),
  unnest(ARRAY['escooter-acc-locks', 'escooter-acc-bags', 'escooter-acc-seats', 'escooter-acc-phones', 'escooter-acc-mirrors', 'escooter-acc-lights', 'escooter-acc-bells', 'escooter-acc-straps']),
  (SELECT id FROM categories WHERE slug = 'escooter-accessories'),
  unnest(ARRAY['Заключващи', 'Чанти', 'Седалки', 'Стойки телефон', 'Огледала', 'Светлини', 'Звънци', 'Ремъци за носене']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- E-Scooter Parts L3 (parent: escooter-parts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Scooter Tires', 'Scooter Tubes', 'Scooter Brakes', 'Scooter Controllers', 'Scooter Motors', 'Scooter Batteries', 'Scooter Chargers', 'Scooter Handlebars']),
  unnest(ARRAY['escooter-part-tires', 'escooter-part-tubes', 'escooter-part-brakes', 'escooter-part-controllers', 'escooter-part-motors', 'escooter-part-batteries', 'escooter-part-chargers', 'escooter-part-bars']),
  (SELECT id FROM categories WHERE slug = 'escooter-parts'),
  unnest(ARRAY['Гуми', 'Вътрешни гуми', 'Спирачки', 'Контролери', 'Мотори', 'Батерии', 'Зарядни', 'Кормила']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- Auto Services - Repair & Maintenance L3 (parent: auto-repair)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['General Repairs', 'Engine Repair', 'Transmission Repair', 'Brake Service', 'Suspension Service', 'AC Repair', 'Electrical Repair']),
  unnest(ARRAY['svc-general-repair', 'svc-engine-repair', 'svc-trans-repair', 'svc-brake-service', 'svc-suspension-service', 'svc-ac-repair', 'svc-electrical-repair']),
  (SELECT id FROM categories WHERE slug = 'auto-repair'),
  unnest(ARRAY['Общи ремонти', 'Ремонт двигател', 'Ремонт скоростна кутия', 'Обслужване спирачки', 'Обслужване окачване', 'Ремонт климатик', 'Ремонт ел. система']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- Body Work & Paint L3 (parent: auto-bodywork)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dent Repair', 'Scratch Repair', 'Full Paint Jobs', 'Touch Up Paint', 'Rust Repair', 'Collision Repair', 'Bumper Repair']),
  unnest(ARRAY['body-dent-repair', 'body-scratch-repair', 'body-full-paint', 'body-touch-up', 'body-rust-repair', 'body-collision', 'body-bumper-repair']),
  (SELECT id FROM categories WHERE slug = 'auto-bodywork'),
  unnest(ARRAY['Ремонт вдлъбнатини', 'Ремонт драскотини', 'Пълно боядисване', 'Touch Up боя', 'Ремонт ръжда', 'Ремонт удар', 'Ремонт брони']),
  '🎨'
ON CONFLICT (slug) DO NOTHING;
;
