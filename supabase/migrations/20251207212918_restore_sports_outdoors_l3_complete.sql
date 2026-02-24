-- Restore Sports & Outdoors L3 categories

-- Cycling L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Road Bikes', 'bikes-road', 'Шосейни велосипеди', 1),
  ('Mountain Bikes', 'bikes-mountain', 'Планински велосипеди', 2),
  ('Hybrid Bikes', 'bikes-hybrid', 'Хибридни велосипеди', 3),
  ('BMX Bikes', 'bikes-bmx', 'BMX велосипеди', 4),
  ('Electric Bikes', 'bikes-electric', 'Електрически велосипеди', 5),
  ('Kids Bikes', 'bikes-kids', 'Детски велосипеди', 6),
  ('Folding Bikes', 'bikes-folding', 'Сгъваеми велосипеди', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'cycling-bikes'
ON CONFLICT (slug) DO NOTHING;

-- Cycling Accessories L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Bike Helmets', 'cycling-helmets', 'Велосипедни каски', 1),
  ('Bike Lights', 'cycling-lights', 'Велосипедни светлини', 2),
  ('Bike Locks', 'cycling-locks', 'Заключващи устройства', 3),
  ('Bike Pumps', 'cycling-pumps', 'Помпи', 4),
  ('Bike Bags', 'cycling-bags', 'Чанти за велосипед', 5),
  ('Water Bottles', 'cycling-bottles', 'Бутилки за вода', 6),
  ('Cycling Computers', 'cycling-computers', 'Велокомпютри', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'cycling-accessories'
ON CONFLICT (slug) DO NOTHING;

-- Fitness Equipment L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Dumbbells', 'weights-dumbbells', 'Дъмбели', 1),
  ('Barbells', 'weights-barbells', 'Щанги', 2),
  ('Kettlebells', 'weights-kettlebells', 'Гири', 3),
  ('Weight Plates', 'weights-plates', 'Дискове за щанга', 4),
  ('Weight Sets', 'weights-sets', 'Комплекти тежести', 5),
  ('Weight Benches', 'weights-benches', 'Лежанки', 6),
  ('Power Racks', 'weights-racks', 'Стойки за щанга', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'fitness-weights'
ON CONFLICT (slug) DO NOTHING;

-- Cardio Equipment L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Treadmills', 'cardio-treadmills', 'Бягащи пътеки', 1),
  ('Exercise Bikes', 'cardio-bikes', 'Велоергометри', 2),
  ('Ellipticals', 'cardio-ellipticals', 'Елиптични тренажори', 3),
  ('Rowing Machines', 'cardio-rowing', 'Гребни тренажори', 4),
  ('Stair Climbers', 'cardio-stair', 'Стълбищни тренажори', 5),
  ('Jump Ropes', 'cardio-jump-ropes', 'Въжета за скачане', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'fitness-cardio'
ON CONFLICT (slug) DO NOTHING;

-- Team Sports L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Soccer Balls', 'soccer-balls', 'Футболни топки', 1),
  ('Soccer Cleats', 'soccer-cleats', 'Футболни обувки', 2),
  ('Soccer Jerseys', 'soccer-jerseys', 'Футболни екипи', 3),
  ('Soccer Goals', 'soccer-goals', 'Футболни врати', 4),
  ('Shin Guards', 'soccer-shin-guards', 'Кори', 5),
  ('Goalkeeper Gloves', 'soccer-gloves', 'Вратарски ръкавици', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'team-soccer'
ON CONFLICT (slug) DO NOTHING;

-- Basketball L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Basketballs', 'basketball-balls', 'Баскетболни топки', 1),
  ('Basketball Shoes', 'basketball-shoes', 'Баскетболни обувки', 2),
  ('Basketball Hoops', 'basketball-hoops', 'Баскетболни кошове', 3),
  ('Basketball Jerseys', 'basketball-jerseys', 'Баскетболни екипи', 4)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'team-basketball'
ON CONFLICT (slug) DO NOTHING;

-- Camping L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Dome Tents', 'tents-dome', 'Куполни палатки', 1),
  ('Cabin Tents', 'tents-cabin', 'Кабинни палатки', 2),
  ('Pop-Up Tents', 'tents-popup', 'Сгъваеми палатки', 3),
  ('Backpacking Tents', 'tents-backpacking', 'Туристически палатки', 4),
  ('Family Tents', 'tents-family', 'Семейни палатки', 5),
  ('Canopy Tents', 'tents-canopy', 'Шатри', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'camping-tents'
ON CONFLICT (slug) DO NOTHING;

-- Sleeping Gear L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Mummy Bags', 'sleeping-mummy', 'Муминни спални чували', 1),
  ('Rectangular Bags', 'sleeping-rectangular', 'Правоъгълни спални чували', 2),
  ('Double Sleeping Bags', 'sleeping-double', 'Двойни спални чували', 3),
  ('Sleeping Pads', 'sleeping-pads', 'Постелки за спане', 4),
  ('Air Mattresses', 'sleeping-air-mattress', 'Надуваеми матраци', 5),
  ('Camping Pillows', 'sleeping-pillows', 'Туристически възглавници', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'camping-sleeping'
ON CONFLICT (slug) DO NOTHING;

-- Hunting L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Compound Bows', 'bows-compound', 'Съставни лъкове', 1),
  ('Recurve Bows', 'bows-recurve', 'Рекурсивни лъкове', 2),
  ('Crossbows', 'bows-crossbow', 'Арбалети', 3),
  ('Arrows', 'bows-arrows', 'Стрели', 4),
  ('Bow Accessories', 'bows-accessories', 'Аксесоари за лъкове', 5),
  ('Targets', 'bows-targets', 'Мишени', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'hunting-bows'
ON CONFLICT (slug) DO NOTHING;

-- Fishing L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Spinning Rods', 'rods-spinning', 'Спининг въдици', 1),
  ('Casting Rods', 'rods-casting', 'Кастинг въдици', 2),
  ('Fly Rods', 'rods-fly', 'Мухарски въдици', 3),
  ('Ice Fishing Rods', 'rods-ice', 'Зимни въдици', 4),
  ('Surf Rods', 'rods-surf', 'Сърф въдици', 5),
  ('Telescopic Rods', 'rods-telescopic', 'Телескопични въдици', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'fishing-rods'
ON CONFLICT (slug) DO NOTHING;;
