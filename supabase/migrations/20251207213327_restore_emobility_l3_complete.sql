-- Restore E-Mobility L3 categories

-- Electric Scooters L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Commuter Scooters', 'escooters-commuter', 'Скутери за всеки ден', 1),
  ('Off-Road Scooters', 'escooters-offroad', 'Офроуд скутери', 2),
  ('Kids Scooters', 'escooters-kids', 'Детски скутери', 3),
  ('High Performance', 'escooters-performance', 'Високоефективни скутери', 4),
  ('Foldable Scooters', 'escooters-foldable', 'Сгъваеми скутери', 5),
  ('Seated Scooters', 'escooters-seated', 'Скутери със седалка', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'emobility-scooters'
ON CONFLICT (slug) DO NOTHING;

-- Electric Bikes L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('City E-Bikes', 'ebikes-city', 'Градски е-колела', 1),
  ('Mountain E-Bikes', 'ebikes-mountain', 'Планински е-колела', 2),
  ('Folding E-Bikes', 'ebikes-folding', 'Сгъваеми е-колела', 3),
  ('Cargo E-Bikes', 'ebikes-cargo', 'Товарни е-колела', 4),
  ('Fat Tire E-Bikes', 'ebikes-fat-tire', 'Е-колела с дебели гуми', 5),
  ('Road E-Bikes', 'ebikes-road', 'Шосейни е-колела', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'emobility-ebikes'
ON CONFLICT (slug) DO NOTHING;

-- Hoverboards L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Standard Hoverboards', 'hoverboards-standard', 'Стандартни ховърборди', 1),
  ('Off-Road Hoverboards', 'hoverboards-offroad', 'Офроуд ховърборди', 2),
  ('Kids Hoverboards', 'hoverboards-kids', 'Детски ховърборди', 3),
  ('Bluetooth Hoverboards', 'hoverboards-bluetooth', 'Ховърборди с Bluetooth', 4)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'emobility-hoverboards'
ON CONFLICT (slug) DO NOTHING;

-- Electric Unicycles L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Beginner Unicycles', 'unicycles-beginner', 'Уницикли за начинаещи', 1),
  ('Advanced Unicycles', 'unicycles-advanced', 'Уницикли за напреднали', 2),
  ('High Speed Unicycles', 'unicycles-speed', 'Бързи уницикли', 3),
  ('Off-Road Unicycles', 'unicycles-offroad', 'Офроуд уницикли', 4)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'emobility-unicycles'
ON CONFLICT (slug) DO NOTHING;

-- Electric Skateboards L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Shortboards', 'eskateboards-short', 'Къси борди', 1),
  ('Longboards', 'eskateboards-long', 'Дълги борди', 2),
  ('All-Terrain Boards', 'eskateboards-terrain', 'Всетеренни борди', 3),
  ('Budget Boards', 'eskateboards-budget', 'Бюджетни борди', 4)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'emobility-skateboards'
ON CONFLICT (slug) DO NOTHING;

-- E-Mobility Accessories L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Helmets', 'emobility-helmets', 'Каски', 1),
  ('Protective Gear', 'emobility-protection', 'Протектори', 2),
  ('Chargers', 'emobility-chargers', 'Зарядни', 3),
  ('Replacement Batteries', 'emobility-batteries', 'Резервни батерии', 4),
  ('Locks', 'emobility-locks', 'Заключващи устройства', 5),
  ('Bags & Carriers', 'emobility-bags', 'Чанти и носачи', 6),
  ('Lights', 'emobility-lights', 'Светлини', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'emobility-accessories'
ON CONFLICT (slug) DO NOTHING;

-- E-Mobility Parts L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Motors', 'emobility-motors', 'Мотори', 1),
  ('Controllers', 'emobility-controllers', 'Контролери', 2),
  ('Tires & Wheels', 'emobility-tires', 'Гуми и колела', 3),
  ('Brakes', 'emobility-brakes', 'Спирачки', 4),
  ('Displays', 'emobility-displays', 'Дисплеи', 5),
  ('Throttles', 'emobility-throttles', 'Дросели', 6),
  ('Suspension', 'emobility-suspension', 'Окачване', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'emobility-parts'
ON CONFLICT (slug) DO NOTHING;;
