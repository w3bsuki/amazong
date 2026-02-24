
-- Phase 3.3.2: Pets L3 Categories - Cats & Dogs

-- Cat Beds & Hideaways L3 (parent: cat-beds)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Cat Caves', 'Cat Hammocks', 'Heated Cat Beds', 'Window Perches', 'Cat Mats', 'Orthopedic Cat Beds', 'Cat Tents']),
  unnest(ARRAY['cat-caves', 'cat-hammocks', 'cat-bed-heated', 'cat-window', 'cat-mats', 'cat-bed-ortho', 'cat-tents']),
  (SELECT id FROM categories WHERE slug = 'cat-beds'),
  unnest(ARRAY['Пещери', 'Хамаци', 'С отопление', 'За прозорец', 'Постелки', 'Ортопедични', 'Палатки']),
  '🛏️'
ON CONFLICT (slug) DO NOTHING;

-- Cat Bowls & Feeders L3 (parent: cat-bowls)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Ceramic Bowls', 'Stainless Steel Bowls', 'Elevated Bowls', 'Slow Feeders', 'Automatic Feeders', 'Water Fountains']),
  unnest(ARRAY['cat-bowl-ceramic', 'cat-bowl-steel', 'cat-bowl-elevated', 'cat-bowl-slow', 'cat-feeder-auto', 'cat-fountain']),
  (SELECT id FROM categories WHERE slug = 'cat-bowls'),
  unnest(ARRAY['Керамични', 'От неръждаема стомана', 'Повдигнати', 'Бавни хранилки', 'Автоматични', 'Фонтани']),
  '🍽️'
ON CONFLICT (slug) DO NOTHING;

-- Cat Carriers & Travel L3 (parent: cat-carriers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hard Shell Carriers', 'Soft Carriers', 'Backpack Carriers', 'Stroller Carriers', 'Airline Approved', 'Expandable Carriers']),
  unnest(ARRAY['cat-carrier-hard', 'cat-carrier-soft', 'cat-carrier-backpack', 'cat-stroller', 'cat-carrier-airline', 'cat-carrier-expand']),
  (SELECT id FROM categories WHERE slug = 'cat-carriers'),
  unnest(ARRAY['Твърди', 'Меки', 'Раници', 'Колички', 'За самолет', 'Разширяеми']),
  '🎒'
ON CONFLICT (slug) DO NOTHING;

-- Cat Collars & ID Tags L3 (parent: cat-collars)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Breakaway Collars', 'Reflective Collars', 'Flea Collars', 'Bow Tie Collars', 'ID Tags', 'GPS Collars']),
  unnest(ARRAY['collar-breakaway', 'collar-reflective', 'collar-flea', 'collar-bowtie', 'cat-id-tags', 'collar-gps']),
  (SELECT id FROM categories WHERE slug = 'cat-collars'),
  unnest(ARRAY['Откопчаващи се', 'Светлоотразителни', 'Против бълхи', 'С папийонка', 'Медальони', 'GPS']),
  '🎀'
ON CONFLICT (slug) DO NOTHING;

-- Cat Grooming L3 (parent: cat-grooming)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Cat Brushes', 'Cat Nail Clippers', 'Cat Shampoo', 'Dematting Tools', 'Cat Wipes', 'Ear Cleaning', 'Dental Care']),
  unnest(ARRAY['cat-brushes', 'cat-nail-clip', 'cat-shampoo', 'cat-demat', 'cat-wipes', 'cat-ear', 'cat-dental']),
  (SELECT id FROM categories WHERE slug = 'cat-grooming'),
  unnest(ARRAY['Четки', 'Ноктрезачки', 'Шампоани', 'За възли', 'Кърпички', 'За уши', 'За зъби']),
  '✂️'
ON CONFLICT (slug) DO NOTHING;

-- Cat Scratchers L3 (parent: cats-scratchers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Scratching Posts', 'Scratching Pads', 'Cat Trees', 'Wall Scratchers', 'Cardboard Scratchers', 'Sisal Scratchers']),
  unnest(ARRAY['scratch-post', 'scratch-pad', 'cat-tree', 'scratch-wall', 'scratch-cardboard', 'scratch-sisal']),
  (SELECT id FROM categories WHERE slug = 'cats-scratchers'),
  unnest(ARRAY['Драскалки колони', 'Драскалки плоски', 'Катерушки', 'За стена', 'Картонени', 'От сизал']),
  '🐱'
ON CONFLICT (slug) DO NOTHING;

-- Dog Carriers L3 (parent: dog-carriers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dog Crates', 'Soft Dog Carriers', 'Dog Backpacks', 'Dog Slings', 'Rolling Carriers', 'Airline Dog Carriers']),
  unnest(ARRAY['dog-crate', 'dog-carrier-soft', 'dog-backpack', 'dog-sling', 'dog-rolling', 'dog-carrier-airline']),
  (SELECT id FROM categories WHERE slug = 'dog-carriers'),
  unnest(ARRAY['Кутии', 'Меки чанти', 'Раници', 'Слингове', 'С колелца', 'За самолет']),
  '🐕'
ON CONFLICT (slug) DO NOTHING;

-- Dog Tech & GPS L3 (parent: dog-tech)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['GPS Dog Trackers', 'Smart Dog Collars', 'Activity Monitors', 'Training Collars', 'Bark Control', 'Pet Cameras']),
  unnest(ARRAY['dog-gps', 'dog-smart-collar', 'dog-activity', 'dog-training-collar', 'dog-bark', 'dog-camera']),
  (SELECT id FROM categories WHERE slug = 'dog-tech'),
  unnest(ARRAY['GPS тракери', 'Смарт нашийници', 'Монитори', 'За обучение', 'Срещу лай', 'Камери']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Dog Waste & Cleanup L3 (parent: dog-waste)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Poop Bags', 'Poop Bag Holders', 'Pooper Scoopers', 'Indoor Potty', 'Stain Removers', 'Odor Eliminators']),
  unnest(ARRAY['poop-bags', 'poop-holders', 'poop-scooper', 'dog-potty', 'dog-stain', 'dog-odor']),
  (SELECT id FROM categories WHERE slug = 'dog-waste'),
  unnest(ARRAY['Торбички', 'Държачи', 'Лопатки', 'Вътрешна тоалетна', 'За петна', 'За миризми']),
  '🗑️'
ON CONFLICT (slug) DO NOTHING;
;
