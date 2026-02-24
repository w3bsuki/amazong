
-- Phase 3.2.2: Sports L3 Categories - Combat Sports & Fitness

-- Boxing L3 (parent: combat-boxing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Boxing Gloves', 'Punching Bags', 'Hand Wraps', 'Head Guards', 'Boxing Shoes', 'Speed Bags', 'Focus Mitts', 'Boxing Rings']),
  unnest(ARRAY['boxing-gloves', 'boxing-bags', 'boxing-wraps', 'boxing-headguards', 'boxing-shoes', 'boxing-speed-bags', 'boxing-mitts', 'boxing-rings']),
  (SELECT id FROM categories WHERE slug = 'combat-boxing'),
  unnest(ARRAY['Боксови ръкавици', 'Боксови чували', 'Бинтове', 'Каски', 'Обувки', 'Скоростни круши', 'Фокус лапи', 'Рингове']),
  '🥊'
ON CONFLICT (slug) DO NOTHING;

-- Boxing Equipment L3 (parent: boxing-equipment - duplicate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Training Gloves', 'Competition Gloves', 'Heavy Bags', 'Aqua Bags', 'Double End Bags', 'Body Protectors']),
  unnest(ARRAY['boxing-eq-training', 'boxing-eq-comp', 'boxing-eq-heavy', 'boxing-eq-aqua', 'boxing-eq-double', 'boxing-eq-body']),
  (SELECT id FROM categories WHERE slug = 'boxing-equipment'),
  unnest(ARRAY['Тренировъчни ръкавици', 'Състезателни ръкавици', 'Тежки чували', 'Аква чували', 'Двустранни чували', 'Протектори']),
  '🥊'
ON CONFLICT (slug) DO NOTHING;

-- MMA L3 (parent: combat-mma)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['MMA Gloves', 'MMA Shorts', 'Grappling Dummies', 'Submission Equipment', 'MMA Shin Guards', 'Rash Guards', 'MMA Headgear', 'Octagon Equipment']),
  unnest(ARRAY['mma-gloves', 'mma-shorts', 'mma-dummies', 'mma-submission', 'mma-shin-guards', 'mma-rashguards', 'mma-headgear', 'mma-octagon']),
  (SELECT id FROM categories WHERE slug = 'combat-mma'),
  unnest(ARRAY['MMA ръкавици', 'MMA шорти', 'Манекени', 'Submission оборудване', 'Кори', 'Рашгарди', 'Каски', 'Октагон']),
  '🥋'
ON CONFLICT (slug) DO NOTHING;

-- Kickboxing & Muay Thai L3 (parent: kickboxing-muay-thai)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Kickboxing Gloves', 'Thai Pads', 'Shin Guards', 'Ankle Supports', 'Kickboxing Shorts', 'Kickboxing Bags']),
  unnest(ARRAY['kick-gloves', 'kick-thai-pads', 'kick-shin-guards', 'kick-ankles', 'kick-shorts', 'kick-bags']),
  (SELECT id FROM categories WHERE slug = 'kickboxing-muay-thai'),
  unnest(ARRAY['Ръкавици', 'Thai лапи', 'Кори', 'Глезени', 'Шорти', 'Чували']),
  '🥊'
ON CONFLICT (slug) DO NOTHING;

-- Wrestling L3 (parent: combat-wrestling)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Wrestling Shoes', 'Wrestling Singlets', 'Wrestling Headgear', 'Wrestling Mats', 'Wrestling Dummies', 'Knee Pads']),
  unnest(ARRAY['wrestling-shoes', 'wrestling-singlets', 'wrestling-headgear', 'wrestling-mats', 'wrestling-dummies', 'wrestling-knee-pads']),
  (SELECT id FROM categories WHERE slug = 'combat-wrestling'),
  unnest(ARRAY['Обувки', 'Трика', 'Предпазители за уши', 'Татами', 'Манекени', 'Наколенки']),
  '🤼'
ON CONFLICT (slug) DO NOTHING;

-- Fencing L3 (parent: combat-fencing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Foils', 'Epees', 'Sabres', 'Fencing Masks', 'Fencing Jackets', 'Fencing Gloves', 'Fencing Bags', 'Electric Equipment']),
  unnest(ARRAY['fencing-foils', 'fencing-epees', 'fencing-sabres', 'fencing-masks', 'fencing-jackets', 'fencing-gloves', 'fencing-bags', 'fencing-electric']),
  (SELECT id FROM categories WHERE slug = 'combat-fencing'),
  unnest(ARRAY['Рапири', 'Шпаги', 'Саби', 'Маски', 'Якета', 'Ръкавици', 'Чанти', 'Електрическо оборудване']),
  '🤺'
ON CONFLICT (slug) DO NOTHING;

-- Fitness Accessories L3 (parent: fitness-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Yoga Mats', 'Resistance Bands', 'Jump Ropes', 'Foam Rollers', 'Exercise Balls', 'Ab Rollers', 'Pull-Up Bars', 'Push-Up Bars', 'Gym Gloves', 'Weight Lifting Belts']),
  unnest(ARRAY['fit-yoga-mats', 'fit-resistance', 'fit-jump-ropes', 'fit-foam-rollers', 'fit-exercise-balls', 'fit-ab-rollers', 'fit-pullup-bars', 'fit-pushup-bars', 'fit-gym-gloves', 'fit-belts']),
  (SELECT id FROM categories WHERE slug = 'fitness-accessories'),
  unnest(ARRAY['Йога постелки', 'Ластици', 'Въжета за скачане', 'Ролери', 'Фитнес топки', 'Колело за коремни', 'Лостове за набиране', 'Лостове за лицеви', 'Фитнес ръкавици', 'Колани']),
  '🧘'
ON CONFLICT (slug) DO NOTHING;

-- Fitness Trackers L3 (parent: fit-trackers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Fitness Bands', 'Smart Watches', 'Heart Rate Monitors', 'GPS Running Watches', 'Cycling Computers', 'Swimming Trackers']),
  unnest(ARRAY['tracker-bands', 'tracker-smartwatch', 'tracker-hr', 'tracker-gps', 'tracker-cycling', 'tracker-swimming']),
  (SELECT id FROM categories WHERE slug = 'fit-trackers'),
  unnest(ARRAY['Фитнес гривни', 'Смарт часовници', 'Пулсомери', 'GPS часовници', 'Велокомпютри', 'Плувни тракери']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Running Watches L3 (parent: running-watches)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Basic Running Watches', 'GPS Running Watches', 'Triathlon Watches', 'Trail Running Watches', 'Ultra Running Watches']),
  unnest(ARRAY['run-watch-basic', 'run-watch-gps', 'run-watch-tri', 'run-watch-trail', 'run-watch-ultra']),
  (SELECT id FROM categories WHERE slug = 'running-watches'),
  unnest(ARRAY['Базови', 'GPS часовници', 'Триатлон', 'Trail', 'Ултра']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Running Shoes L3 (parent: running-shoes-sport)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Road Running Shoes', 'Trail Running Shoes', 'Racing Flats', 'Stability Shoes', 'Motion Control Shoes', 'Minimalist Shoes', 'Carbon Plate Shoes']),
  unnest(ARRAY['run-shoe-road', 'run-shoe-trail', 'run-shoe-racing', 'run-shoe-stability', 'run-shoe-motion', 'run-shoe-minimalist', 'run-shoe-carbon']),
  (SELECT id FROM categories WHERE slug = 'running-shoes-sport'),
  unnest(ARRAY['Шосейни', 'Trail', 'Състезателни', 'Стабилни', 'Motion Control', 'Минималистични', 'С карбонова плака']),
  '👟'
ON CONFLICT (slug) DO NOTHING;

-- Hydration L3 (parent: running-hydration)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Running Belts', 'Hydration Vests', 'Handheld Bottles', 'Hydration Packs', 'Soft Flasks', 'Water Bottles']),
  unnest(ARRAY['hydra-belts', 'hydra-vests', 'hydra-handheld', 'hydra-packs', 'hydra-flasks', 'hydra-bottles']),
  (SELECT id FROM categories WHERE slug = 'running-hydration'),
  unnest(ARRAY['Колани', 'Хидрация жилетки', 'Ръчни бутилки', 'Раници', 'Меки бутилки', 'Бутилки']),
  '💧'
ON CONFLICT (slug) DO NOTHING;
;
