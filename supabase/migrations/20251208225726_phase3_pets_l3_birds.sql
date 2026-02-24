
-- Phase 3.3.1: Pets L3 Categories - Birds

-- Bird Baths L3 (parent: birds-baths)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hanging Baths', 'Standing Baths', 'Heated Baths', 'Fountain Baths']),
  unnest(ARRAY['birds-bath-hanging', 'birds-bath-standing', 'birds-bath-heated', 'birds-bath-fountain']),
  (SELECT id FROM categories WHERE slug = 'birds-baths'),
  unnest(ARRAY['Висящи', 'Стоящи', 'С отопление', 'Фонтани']),
  '🛁'
ON CONFLICT (slug) DO NOTHING;

-- Bird Cage Accessories L3 (parent: bird-cage-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Cage Covers', 'Cage Liners', 'Cage Cleaners', 'Cage Locks', 'Cage Stands']),
  unnest(ARRAY['cage-covers', 'cage-liners', 'cage-cleaners', 'cage-locks', 'cage-stands']),
  (SELECT id FROM categories WHERE slug = 'bird-cage-accessories'),
  unnest(ARRAY['Покривала', 'Подложки', 'Почистващи', 'Катинари', 'Стойки']),
  '🦜'
ON CONFLICT (slug) DO NOTHING;

-- Bird Cages L3 (parent: birds-cages)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Parakeet Cages', 'Parrot Cages', 'Canary Cages', 'Finch Cages', 'Cockatiel Cages', 'Flight Cages', 'Breeding Cages']),
  unnest(ARRAY['cage-parakeet', 'cage-parrot', 'cage-canary', 'cage-finch', 'cage-cockatiel', 'cage-flight', 'cage-breeding']),
  (SELECT id FROM categories WHERE slug = 'birds-cages'),
  unnest(ARRAY['За папагалчета', 'За папагали', 'За канарчета', 'За финчове', 'За корели', 'Летателни', 'За развъждане']),
  '🦜'
ON CONFLICT (slug) DO NOTHING;

-- Bird Feeders & Waterers L3 (parent: birds-feeders)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Seed Feeders', 'Fruit Feeders', 'Pellet Feeders', 'Automatic Feeders', 'Nectar Feeders']),
  unnest(ARRAY['feeder-seed', 'feeder-fruit', 'feeder-pellet', 'feeder-auto', 'feeder-nectar']),
  (SELECT id FROM categories WHERE slug = 'birds-feeders'),
  unnest(ARRAY['За семена', 'За плодове', 'За пелети', 'Автоматични', 'За нектар']),
  '🍽️'
ON CONFLICT (slug) DO NOTHING;

-- Bird Health L3 (parent: birds-health)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Bird Vitamins', 'Bird Medications', 'Beak Care', 'Feather Care', 'Mite Treatment']),
  unnest(ARRAY['bird-vitamins', 'bird-meds', 'bird-beak', 'bird-feather', 'bird-mite']),
  (SELECT id FROM categories WHERE slug = 'birds-health'),
  unnest(ARRAY['Витамини', 'Лекарства', 'Грижа за клюн', 'Грижа за пера', 'Срещу паразити']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- Bird Health & Grooming L3 (parent: bird-health)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Nail Clippers', 'Wing Clippers', 'Grooming Sprays', 'Bath Sprays', 'First Aid']),
  unnest(ARRAY['bird-nail-clip', 'bird-wing-clip', 'bird-groom-spray', 'bird-bath-spray', 'bird-first-aid']),
  (SELECT id FROM categories WHERE slug = 'bird-health'),
  unnest(ARRAY['Ноктрезачки', 'За криле', 'Спрейове', 'За къпане', 'Първа помощ']),
  '✂️'
ON CONFLICT (slug) DO NOTHING;

-- Bird Nesting & Breeding L3 (parent: bird-nesting)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Nest Boxes', 'Nesting Material', 'Breeding Cages', 'Egg Incubators', 'Egg Food']),
  unnest(ARRAY['nest-boxes', 'nest-material', 'nest-cages', 'nest-incubators', 'nest-food']),
  (SELECT id FROM categories WHERE slug = 'bird-nesting'),
  unnest(ARRAY['Гнездилки', 'Материали за гнезда', 'Клетки за развъждане', 'Инкубатори', 'Храна за яйца']),
  '🥚'
ON CONFLICT (slug) DO NOTHING;

-- Bird Perches L3 (parent: birds-perches)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Wood Perches', 'Rope Perches', 'Heated Perches', 'Platform Perches', 'Swing Perches']),
  unnest(ARRAY['perch-wood', 'perch-rope', 'perch-heated', 'perch-platform', 'perch-swing']),
  (SELECT id FROM categories WHERE slug = 'birds-perches'),
  unnest(ARRAY['Дървени', 'Въжени', 'С отопление', 'Платформи', 'Люлки']),
  '🪵'
ON CONFLICT (slug) DO NOTHING;

-- Bird Perches & Stands L3 (parent: bird-perches)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Table Top Stands', 'Floor Stands', 'Window Perches', 'Shower Perches', 'Training Perches']),
  unnest(ARRAY['stand-table', 'stand-floor', 'stand-window', 'stand-shower', 'stand-training']),
  (SELECT id FROM categories WHERE slug = 'bird-perches'),
  unnest(ARRAY['Настолни', 'Подови', 'За прозорец', 'За душ', 'За обучение']),
  '🪶'
ON CONFLICT (slug) DO NOTHING;

-- Bird Supplements L3 (parent: birds-supplements)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Calcium Supplements', 'Vitamin D', 'Probiotics', 'Electrolytes', 'Molting Supplements']),
  unnest(ARRAY['supp-calcium', 'supp-vitamin-d', 'supp-probiotics', 'supp-electro', 'supp-molting']),
  (SELECT id FROM categories WHERE slug = 'birds-supplements'),
  unnest(ARRAY['Калций', 'Витамин D', 'Пробиотици', 'Електролити', 'За смяна на пера']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- Bird Toys L3 (parent: birds-toys)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Chew Toys', 'Foraging Toys', 'Climbing Toys', 'Puzzle Toys', 'Mirror Toys', 'Bell Toys', 'Shredding Toys']),
  unnest(ARRAY['toy-chew', 'toy-forage', 'toy-climb', 'toy-puzzle', 'toy-mirror', 'toy-bell', 'toy-shred']),
  (SELECT id FROM categories WHERE slug = 'birds-toys'),
  unnest(ARRAY['За гризане', 'За търсене', 'За катерене', 'Пъзели', 'Огледала', 'Звънчета', 'За накъсване']),
  '🧸'
ON CONFLICT (slug) DO NOTHING;

-- Bird Travel Carriers L3 (parent: bird-carriers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Small Bird Carriers', 'Large Bird Carriers', 'Backpack Carriers', 'Airline Approved', 'Car Carriers']),
  unnest(ARRAY['carrier-small', 'carrier-large', 'carrier-backpack', 'carrier-airline', 'carrier-car']),
  (SELECT id FROM categories WHERE slug = 'bird-carriers'),
  unnest(ARRAY['За малки птици', 'За големи птици', 'Раници', 'За самолет', 'За кола']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Bird Treats L3 (parent: bird-treats)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Seed Sticks', 'Fruit Treats', 'Nut Treats', 'Millet Sprays', 'Honey Sticks']),
  unnest(ARRAY['treat-seed', 'treat-fruit', 'treat-nut', 'treat-millet', 'treat-honey']),
  (SELECT id FROM categories WHERE slug = 'bird-treats'),
  unnest(ARRAY['Семена на клечка', 'Плодови', 'Ядки', 'Просо', 'С мед']),
  '🍬'
ON CONFLICT (slug) DO NOTHING;

-- Large Bird Cages L3 (parent: birds-cages-large)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Macaw Cages', 'African Grey Cages', 'Cockatoo Cages', 'Aviary Cages']),
  unnest(ARRAY['cage-macaw', 'cage-grey', 'cage-cockatoo', 'cage-aviary']),
  (SELECT id FROM categories WHERE slug = 'birds-cages-large'),
  unnest(ARRAY['За ара', 'За жако', 'За какаду', 'Волиери']),
  '🦜'
ON CONFLICT (slug) DO NOTHING;

-- Pellet Food L3 (parent: birds-food-pellets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Small Bird Pellets', 'Medium Bird Pellets', 'Large Bird Pellets', 'Organic Pellets']),
  unnest(ARRAY['pellet-small', 'pellet-medium', 'pellet-large', 'pellet-organic']),
  (SELECT id FROM categories WHERE slug = 'birds-food-pellets'),
  unnest(ARRAY['За малки птици', 'За средни', 'За големи', 'Органични']),
  '🥜'
ON CONFLICT (slug) DO NOTHING;

-- Seed Mixes L3 (parent: birds-food-seeds)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Parakeet Mix', 'Canary Mix', 'Finch Mix', 'Parrot Mix', 'Wild Bird Mix']),
  unnest(ARRAY['seed-parakeet', 'seed-canary', 'seed-finch', 'seed-parrot', 'seed-wild']),
  (SELECT id FROM categories WHERE slug = 'birds-food-seeds'),
  unnest(ARRAY['За папагалчета', 'За канарчета', 'За финчове', 'За папагали', 'За диви птици']),
  '🌻'
ON CONFLICT (slug) DO NOTHING;

-- Small Bird Cages L3 (parent: birds-cages-small)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Budgie Cages', 'Lovebird Cages', 'Finch Cages Small', 'Travel Cages']),
  unnest(ARRAY['cage-budgie', 'cage-lovebird', 'cage-finch-sm', 'cage-travel']),
  (SELECT id FROM categories WHERE slug = 'birds-cages-small'),
  unnest(ARRAY['За вълнисти', 'За неразделки', 'За финчове', 'За пътуване']),
  '🐦'
ON CONFLICT (slug) DO NOTHING;

-- Swings L3 (parent: birds-toys-swings)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Wood Swings', 'Rope Swings', 'Acrylic Swings', 'Natural Swings']),
  unnest(ARRAY['swing-wood', 'swing-rope', 'swing-acrylic', 'swing-natural']),
  (SELECT id FROM categories WHERE slug = 'birds-toys-swings'),
  unnest(ARRAY['Дървени', 'Въжени', 'Акрилни', 'Натурални']),
  '🎠'
ON CONFLICT (slug) DO NOTHING;

-- Waterers L3 (parent: birds-waterers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Bottle Waterers', 'Bowl Waterers', 'Automatic Waterers', 'Heated Waterers']),
  unnest(ARRAY['water-bottle', 'water-bowl', 'water-auto', 'water-heated']),
  (SELECT id FROM categories WHERE slug = 'birds-waterers'),
  unnest(ARRAY['Бутилки', 'Купички', 'Автоматични', 'С отопление']),
  '💧'
ON CONFLICT (slug) DO NOTHING;
;
