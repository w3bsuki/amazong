
-- Phase 3.3.6: Pets L3 Categories - Travel & Reptiles

-- Airline Travel L3 (parent: airline-approved)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Cabin Carriers', 'Cargo Carriers', 'Airline Crates', 'TSA Approved']),
  unnest(ARRAY['air-cabin', 'air-cargo', 'air-crate', 'air-tsa']),
  (SELECT id FROM categories WHERE slug = 'airline-approved'),
  unnest(ARRAY['За кабина', 'За багаж', 'Кутии', 'TSA одобрени']),
  '✈️'
ON CONFLICT (slug) DO NOTHING;

-- Car Travel L3 (parent: pet-car-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Seat Covers', 'Car Barriers', 'Window Guards', 'Seat Belts', 'Ramps']),
  unnest(ARRAY['car-covers', 'car-barriers', 'car-guards', 'car-belts', 'car-ramps']),
  (SELECT id FROM categories WHERE slug = 'pet-car-accessories'),
  unnest(ARRAY['Калъфи за седалки', 'Прегради', 'За прозорци', 'Колани', 'Рампи']),
  '🚗'
ON CONFLICT (slug) DO NOTHING;

-- Pet Car Seats L3 (parent: pet-car-seats)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Booster Seats', 'Console Seats', 'Bucket Seats', 'Lookout Seats']),
  unnest(ARRAY['seat-booster', 'seat-console', 'seat-bucket', 'seat-lookout']),
  (SELECT id FROM categories WHERE slug = 'pet-car-seats'),
  unnest(ARRAY['Бустери', 'За конзола', 'Кофи', 'С изглед']),
  '🚗'
ON CONFLICT (slug) DO NOTHING;

-- Pet Carriers L3 (parent: pet-carriers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Soft Sided', 'Hard Sided', 'Rolling Carriers', 'Expandable']),
  unnest(ARRAY['pcarrier-soft', 'pcarrier-hard', 'pcarrier-roll', 'pcarrier-expand']),
  (SELECT id FROM categories WHERE slug = 'pet-carriers'),
  unnest(ARRAY['Меки', 'Твърди', 'С колелца', 'Разширяеми']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Pet Carriers (duplicate) L3 (parent: pet-carriers-travel)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Backpack Carriers', 'Sling Carriers', 'Purse Carriers', 'Hiking Carriers']),
  unnest(ARRAY['pcarrier-back', 'pcarrier-sling', 'pcarrier-purse', 'pcarrier-hike']),
  (SELECT id FROM categories WHERE slug = 'pet-carriers-travel'),
  unnest(ARRAY['Раници', 'Слингове', 'Чанти', 'За туризъм']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Strollers & Wagons L3 (parent: pet-strollers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Single Strollers', 'Double Strollers', 'Jogging Strollers', 'Pet Wagons']),
  unnest(ARRAY['stroller-single', 'stroller-double', 'stroller-jog', 'stroller-wagon']),
  (SELECT id FROM categories WHERE slug = 'pet-strollers'),
  unnest(ARRAY['Единични', 'Двойни', 'За джогинг', 'Каруцки']),
  '👶'
ON CONFLICT (slug) DO NOTHING;

-- Travel Bags & Totes L3 (parent: pet-travel-bags)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Weekender Bags', 'Tote Bags', 'Duffel Bags', 'Organizers']),
  unnest(ARRAY['tbag-weekend', 'tbag-tote', 'tbag-duffel', 'tbag-organizer']),
  (SELECT id FROM categories WHERE slug = 'pet-travel-bags'),
  unnest(ARRAY['За уикенд', 'Тоути', 'Сакове', 'Органайзери']),
  '👜'
ON CONFLICT (slug) DO NOTHING;

-- Travel Bowls & Bottles L3 (parent: pet-travel-bowls)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Collapsible Bowls', 'Water Bottles', 'Travel Sets', 'Clip-On Bowls']),
  unnest(ARRAY['tbowl-collapse', 'tbowl-bottle', 'tbowl-set', 'tbowl-clip']),
  (SELECT id FROM categories WHERE slug = 'pet-travel-bowls'),
  unnest(ARRAY['Сгъваеми', 'Бутилки', 'Комплекти', 'С щипка']),
  '🥣'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Bowls & Dishes L3 (parent: reptile-bowls)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Water Dishes', 'Food Dishes', 'Corner Dishes', 'Rock Dishes']),
  unnest(ARRAY['rbowl-water', 'rbowl-food', 'rbowl-corner', 'rbowl-rock']),
  (SELECT id FROM categories WHERE slug = 'reptile-bowls'),
  unnest(ARRAY['За вода', 'За храна', 'Ъглови', 'Скални']),
  '🦎'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Décor L3 (parent: reptiles-decor)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Fake Plants', 'Branches', 'Rocks', 'Skulls', 'Backgrounds']),
  unnest(ARRAY['rdecor-plants', 'rdecor-branches', 'rdecor-rocks', 'rdecor-skulls', 'rdecor-backgrounds']),
  (SELECT id FROM categories WHERE slug = 'reptiles-decor'),
  unnest(ARRAY['Изкуствени растения', 'Клони', 'Камъни', 'Черепи', 'Фонове']),
  '🌵'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Decorations L3 (parent: reptile-decor)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Caves', 'Hammocks', 'Ledges', 'Waterfalls', 'Vines']),
  unnest(ARRAY['rdecor-caves', 'rdecor-hammocks', 'rdecor-ledges', 'rdecor-waterfalls', 'rdecor-vines']),
  (SELECT id FROM categories WHERE slug = 'reptile-decor'),
  unnest(ARRAY['Пещери', 'Хамаци', 'Платформи', 'Водопади', 'Лиани']),
  '🏞️'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Health L3 (parent: reptile-health)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Calcium Supplements', 'Vitamin D3', 'Probiotics', 'Shedding Aid', 'Parasite Treatment']),
  unnest(ARRAY['rhealth-calcium', 'rhealth-d3', 'rhealth-probio', 'rhealth-shed', 'rhealth-parasite']),
  (SELECT id FROM categories WHERE slug = 'reptile-health'),
  unnest(ARRAY['Калций', 'Витамин D3', 'Пробиотици', 'За смяна на кожа', 'Срещу паразити']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Heating L3 (parent: reptile-heating)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Heat Mats', 'Heat Lamps', 'Ceramic Heaters', 'Heat Cables', 'Thermostats']),
  unnest(ARRAY['rheat-mat', 'rheat-lamp', 'rheat-ceramic', 'rheat-cable', 'rheat-thermo']),
  (SELECT id FROM categories WHERE slug = 'reptile-heating'),
  unnest(ARRAY['Нагревателни постелки', 'Лампи', 'Керамични', 'Кабели', 'Термостати']),
  '🔥'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Humidity L3 (parent: reptile-humidity)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Foggers', 'Misters', 'Hygrometers', 'Humidity Boxes', 'Dripper Systems']),
  unnest(ARRAY['rhumid-fog', 'rhumid-mist', 'rhumid-hygro', 'rhumid-box', 'rhumid-drip']),
  (SELECT id FROM categories WHERE slug = 'reptile-humidity'),
  unnest(ARRAY['Генератори на мъгла', 'Пръскачки', 'Хигрометри', 'Влажни кутии', 'Капкови системи']),
  '💧'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Lighting L3 (parent: reptile-lighting)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['UVB Bulbs', 'Basking Bulbs', 'Night Lights', 'LED Lights', 'Light Fixtures']),
  unnest(ARRAY['rlight-uvb', 'rlight-bask', 'rlight-night', 'rlight-led', 'rlight-fixture']),
  (SELECT id FROM categories WHERE slug = 'reptile-lighting'),
  unnest(ARRAY['UVB', 'За греене', 'Нощни', 'LED', 'Тела']),
  '💡'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Lighting & Heating L3 (parent: reptiles-lighting)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Combo Fixtures', 'Mercury Vapor', 'Halogen', 'Infrared']),
  unnest(ARRAY['rlight-combo', 'rlight-mercury', 'rlight-halogen', 'rlight-infrared']),
  (SELECT id FROM categories WHERE slug = 'reptiles-lighting'),
  unnest(ARRAY['Комбинирани', 'Живачни', 'Халогенни', 'Инфрачервени']),
  '💡'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Substrate L3 (parent: reptiles-substrate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Coconut Fiber', 'Bark', 'Sand', 'Moss', 'Paper Bedding', 'Bioactive Substrate']),
  unnest(ARRAY['rsub-coco', 'rsub-bark', 'rsub-sand', 'rsub-moss', 'rsub-paper', 'rsub-bio']),
  (SELECT id FROM categories WHERE slug = 'reptiles-substrate'),
  unnest(ARRAY['Кокосови влакна', 'Кора', 'Пясък', 'Мъх', 'Хартия', 'Биоактивен']),
  '🌿'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Substrate (duplicate) L3 (parent: reptile-substrate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Reptile Carpet', 'Aspen Bedding', 'Cypress Mulch', 'Excavator Clay']),
  unnest(ARRAY['rsub-carpet', 'rsub-aspen', 'rsub-cypress', 'rsub-clay']),
  (SELECT id FROM categories WHERE slug = 'reptile-substrate'),
  unnest(ARRAY['Килим', 'Талаш', 'Кипарис', 'Глина']),
  '🌿'
ON CONFLICT (slug) DO NOTHING;

-- Terrariums L3 (parent: reptiles-terrariums)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Glass Terrariums', 'Screen Cages', 'PVC Enclosures', 'Bioactive Enclosures', 'Rack Systems']),
  unnest(ARRAY['terra-glass', 'terra-screen', 'terra-pvc', 'terra-bio', 'terra-rack']),
  (SELECT id FROM categories WHERE slug = 'reptiles-terrariums'),
  unnest(ARRAY['Стъклени', 'Мрежести', 'PVC', 'Биоактивни', 'Рафтови системи']),
  '🦎'
ON CONFLICT (slug) DO NOTHING;

-- Turtle & Tortoise Supplies L3 (parent: turtle-supplies)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Turtle Tanks', 'Turtle Docks', 'Turtle Food', 'Turtle Filters', 'Turtle Heaters', 'Shell Care']),
  unnest(ARRAY['turtle-tank', 'turtle-dock', 'turtle-food', 'turtle-filter', 'turtle-heater', 'turtle-shell']),
  (SELECT id FROM categories WHERE slug = 'turtle-supplies'),
  unnest(ARRAY['Аквариуми', 'Платформи', 'Храна', 'Филтри', 'Нагреватели', 'За черупка']),
  '🐢'
ON CONFLICT (slug) DO NOTHING;
;
