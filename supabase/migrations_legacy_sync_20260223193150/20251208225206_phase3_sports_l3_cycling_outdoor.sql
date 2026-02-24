
-- Phase 3.2.3: Sports L3 Categories - Cycling & Outdoor

-- Bicycles L3 (parent: bicycles)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Road Bikes', 'Mountain Bikes', 'Hybrid Bikes', 'City Bikes', 'Gravel Bikes', 'Touring Bikes', 'Kids Bikes', 'Tandem Bikes']),
  unnest(ARRAY['bike-road', 'bike-mountain', 'bike-hybrid', 'bike-city', 'bike-gravel', 'bike-touring', 'bike-kids', 'bike-tandem']),
  (SELECT id FROM categories WHERE slug = 'bicycles'),
  unnest(ARRAY['Шосейни', 'Планински', 'Хибридни', 'Градски', 'Gravel', 'Туринг', 'Детски', 'Тандем']),
  '🚲'
ON CONFLICT (slug) DO NOTHING;

-- BMX L3 (parent: cycling-bmx)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['BMX Race Bikes', 'BMX Freestyle Bikes', 'BMX Flatland Bikes', 'BMX Dirt Bikes', 'BMX Parts', 'BMX Helmets']),
  unnest(ARRAY['bmx-race', 'bmx-freestyle', 'bmx-flatland', 'bmx-dirt', 'bmx-parts', 'bmx-helmets']),
  (SELECT id FROM categories WHERE slug = 'cycling-bmx'),
  unnest(ARRAY['Race BMX', 'Freestyle BMX', 'Flatland BMX', 'Dirt BMX', 'BMX части', 'BMX каски']),
  '🚴'
ON CONFLICT (slug) DO NOTHING;

-- BMX Bikes L3 (parent: bmx-bikes - duplicate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Complete BMX Bikes', 'BMX Frames', 'BMX Forks', 'BMX Handlebars', 'BMX Wheels']),
  unnest(ARRAY['bmx-complete', 'bmx-frames', 'bmx-forks', 'bmx-bars', 'bmx-wheels']),
  (SELECT id FROM categories WHERE slug = 'bmx-bikes'),
  unnest(ARRAY['Комплектни BMX', 'Рамки', 'Вилки', 'Кормила', 'Колела']),
  '🚴'
ON CONFLICT (slug) DO NOTHING;

-- Hybrid Bikes L3 (parent: hybrid-bikes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Fitness Hybrid Bikes', 'Comfort Hybrid Bikes', 'Urban Hybrid Bikes', 'Electric Hybrid Bikes']),
  unnest(ARRAY['hybrid-fitness', 'hybrid-comfort', 'hybrid-urban', 'hybrid-electric']),
  (SELECT id FROM categories WHERE slug = 'hybrid-bikes'),
  unnest(ARRAY['Фитнес хибриди', 'Комфортни хибриди', 'Градски хибриди', 'Електрически хибриди']),
  '🚲'
ON CONFLICT (slug) DO NOTHING;

-- Folding Bikes L3 (parent: folding-bikes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Compact Folding Bikes', 'Full Size Folding', 'Electric Folding Bikes', 'Folding Bike Bags']),
  unnest(ARRAY['fold-compact', 'fold-full', 'fold-electric', 'fold-bags']),
  (SELECT id FROM categories WHERE slug = 'folding-bikes'),
  unnest(ARRAY['Компактни сгъваеми', 'Пълноразмерни сгъваеми', 'Електрически сгъваеми', 'Чанти за сгъваеми']),
  '🚲'
ON CONFLICT (slug) DO NOTHING;

-- Camping Gear L3 (parent: camping-gear-cat)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tents', 'Sleeping Bags', 'Camping Mattresses', 'Hammocks', 'Tarps & Shelters', 'Camping Lights', 'Camp Stoves', 'Coolers']),
  unnest(ARRAY['camp-tents', 'camp-sleeping-bags', 'camp-mattresses', 'camp-hammocks', 'camp-tarps', 'camp-lights', 'camp-stoves', 'camp-coolers']),
  (SELECT id FROM categories WHERE slug = 'camping-gear-cat'),
  unnest(ARRAY['Палатки', 'Спални чували', 'Постелки', 'Хамаци', 'Покривала', 'Лампи', 'Котлони', 'Хладилни чанти']),
  '⛺'
ON CONFLICT (slug) DO NOTHING;

-- Camping Cooking L3 (parent: camping-cooking)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Camping Stoves', 'Cooking Sets', 'Camping Grills', 'Water Filters', 'Camping Utensils', 'Food Storage', 'Coffee Makers']),
  unnest(ARRAY['cook-stoves', 'cook-sets', 'cook-grills', 'cook-filters', 'cook-utensils', 'cook-storage', 'cook-coffee']),
  (SELECT id FROM categories WHERE slug = 'camping-cooking'),
  unnest(ARRAY['Котлони', 'Комплекти за готвене', 'Грилове', 'Филтри за вода', 'Прибори', 'Съхранение храна', 'Кафеварки']),
  '🍳'
ON CONFLICT (slug) DO NOTHING;

-- Camping Furniture L3 (parent: camping-furniture)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Camping Chairs', 'Camping Tables', 'Camping Cots', 'Camping Stools', 'Air Mattresses', 'Camp Beds']),
  unnest(ARRAY['camp-furn-chairs', 'camp-furn-tables', 'camp-furn-cots', 'camp-furn-stools', 'camp-furn-air', 'camp-furn-beds']),
  (SELECT id FROM categories WHERE slug = 'camping-furniture'),
  unnest(ARRAY['Столове', 'Маси', 'Походни легла', 'Табуретки', 'Надуваеми матраци', 'Легла']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

-- Backpacks L3 (parent: camping-backpacks)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Daypacks', 'Multi-Day Packs', 'Expedition Packs', 'Hydration Packs', 'Travel Backpacks']),
  unnest(ARRAY['pack-day', 'pack-multi-day', 'pack-expedition', 'pack-hydration', 'pack-travel']),
  (SELECT id FROM categories WHERE slug = 'camping-backpacks'),
  unnest(ARRAY['Дневни раници', 'Многодневни', 'Експедиционни', 'Хидрация', 'Пътнически']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Backpacks Outdoor L3 (parent: backpacks-outdoor - duplicate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hiking Daypacks', 'Trekking Backpacks', 'Mountaineering Packs', 'Ultralight Packs']),
  unnest(ARRAY['out-pack-day', 'out-pack-trek', 'out-pack-mountain', 'out-pack-ultralight']),
  (SELECT id FROM categories WHERE slug = 'backpacks-outdoor'),
  unnest(ARRAY['Хайкинг раници', 'Трекинг раници', 'Алпинистки', 'Ултралеки']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Hiking Backpacks L3 (parent: hiking-backpacks)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Small Hiking Packs', 'Medium Hiking Packs', 'Large Hiking Packs', 'Women Hiking Packs']),
  unnest(ARRAY['hike-pack-small', 'hike-pack-medium', 'hike-pack-large', 'hike-pack-women']),
  (SELECT id FROM categories WHERE slug = 'hiking-backpacks'),
  unnest(ARRAY['Малки (до 30L)', 'Средни (30-50L)', 'Големи (50L+)', 'Дамски']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Hiking Equipment L3 (parent: hiking-equipment)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Trekking Poles', 'Hiking Gaiters', 'Crampons', 'Ice Axes', 'Hiking Gloves', 'Hiking Hats']),
  unnest(ARRAY['hike-poles', 'hike-gaiters', 'hike-crampons', 'hike-ice-axes', 'hike-gloves', 'hike-hats']),
  (SELECT id FROM categories WHERE slug = 'hiking-equipment'),
  unnest(ARRAY['Щеки', 'Гети', 'Котки', 'Ледокопи', 'Ръкавици', 'Шапки']),
  '🥾'
ON CONFLICT (slug) DO NOTHING;

-- Hiking Boots L3 (parent: camping-boots)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Light Hiking Shoes', 'Mid-Cut Hiking Boots', 'Heavy Hiking Boots', 'Mountaineering Boots', 'Winter Hiking Boots']),
  unnest(ARRAY['boot-light', 'boot-mid', 'boot-heavy', 'boot-mountain', 'boot-winter']),
  (SELECT id FROM categories WHERE slug = 'camping-boots'),
  unnest(ARRAY['Леки обувки', 'Средни боти', 'Тежки боти', 'Алпийски боти', 'Зимни боти']),
  '🥾'
ON CONFLICT (slug) DO NOTHING;

-- Navigation & GPS L3 (parent: camping-navigation)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Handheld GPS', 'GPS Watches', 'Compasses', 'Maps', 'Altimeters', 'PLB Beacons']),
  unnest(ARRAY['nav-gps-handheld', 'nav-gps-watch', 'nav-compass', 'nav-maps', 'nav-altimeter', 'nav-plb']),
  (SELECT id FROM categories WHERE slug = 'camping-navigation'),
  unnest(ARRAY['Ръчни GPS', 'GPS часовници', 'Компаси', 'Карти', 'Алтиметри', 'PLB фарове']),
  '🧭'
ON CONFLICT (slug) DO NOTHING;

-- Navigation & Safety L3 (parent: hiking-navigation - duplicate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Emergency Whistles', 'Signal Mirrors', 'Fire Starters', 'First Aid Kits', 'Emergency Shelters']),
  unnest(ARRAY['safety-whistles', 'safety-mirrors', 'safety-fire', 'safety-first-aid', 'safety-shelters']),
  (SELECT id FROM categories WHERE slug = 'hiking-navigation'),
  unnest(ARRAY['Свирки', 'Сигнални огледала', 'Запалки', 'Първа помощ', 'Аварийни подслони']),
  '🆘'
ON CONFLICT (slug) DO NOTHING;

-- Outdoor Clothing L3 (parent: camping-clothing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Rain Jackets', 'Softshell Jackets', 'Down Jackets', 'Fleece Jackets', 'Hiking Pants', 'Base Layers', 'Outdoor Hats', 'Outdoor Gloves']),
  unnest(ARRAY['out-cloth-rain', 'out-cloth-softshell', 'out-cloth-down', 'out-cloth-fleece', 'out-cloth-pants', 'out-cloth-base', 'out-cloth-hats', 'out-cloth-gloves']),
  (SELECT id FROM categories WHERE slug = 'camping-clothing'),
  unnest(ARRAY['Дъждобрани', 'Softshell якета', 'Пухенки', 'Полари', 'Хайкинг панталони', 'Бельо', 'Шапки', 'Ръкавици']),
  '🧥'
ON CONFLICT (slug) DO NOTHING;

-- Climbing Gear L3 (parent: climbing-gear)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Climbing Harnesses', 'Climbing Ropes', 'Carabiners', 'Belay Devices', 'Quickdraws', 'Climbing Helmets', 'Climbing Shoes', 'Chalk & Chalk Bags']),
  unnest(ARRAY['climb-harness', 'climb-ropes', 'climb-carabiners', 'climb-belay', 'climb-quickdraws', 'climb-helmets', 'climb-shoes', 'climb-chalk']),
  (SELECT id FROM categories WHERE slug = 'climbing-gear'),
  unnest(ARRAY['Обвръзки', 'Въжета', 'Карабинери', 'Осигурителни устройства', 'Оттегляния', 'Каски', 'Обувки', 'Магнезий']),
  '🧗'
ON CONFLICT (slug) DO NOTHING;

-- Climbing L3 (parent: outdoor-climbing - duplicate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Sport Climbing Gear', 'Trad Climbing Gear', 'Bouldering Gear', 'Ice Climbing Gear', 'Via Ferrata Gear']),
  unnest(ARRAY['climb-sport', 'climb-trad', 'climb-boulder', 'climb-ice', 'climb-ferrata']),
  (SELECT id FROM categories WHERE slug = 'outdoor-climbing'),
  unnest(ARRAY['Спортно катерене', 'Trad катерене', 'Bouldering', 'Ледено катерене', 'Via Ferrata']),
  '🧗'
ON CONFLICT (slug) DO NOTHING;
;
