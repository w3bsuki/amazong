
-- Phase 3.2.4: Sports L3 Categories - Water Sports, Winter Sports & Supplements

-- Water Sports L3 (parent: water-sports-gear)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Surfboards', 'Paddleboards', 'Kayaks', 'Wetsuits', 'Life Jackets', 'Diving Gear', 'Snorkeling Gear', 'Water Skis']),
  unnest(ARRAY['water-surfboards', 'water-paddleboards', 'water-kayaks', 'water-wetsuits', 'water-life-jackets', 'water-diving', 'water-snorkeling', 'water-skis']),
  (SELECT id FROM categories WHERE slug = 'water-sports-gear'),
  unnest(ARRAY['Сърфове', 'Падълбордове', 'Каяци', 'Неопрени', 'Спасителни жилетки', 'Екипировка гмуркане', 'Шноркели', 'Водни ски']),
  '🏄'
ON CONFLICT (slug) DO NOTHING;

-- Jet Skiing L3 (parent: water-jetski)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Personal Watercraft', 'Jet Ski Covers', 'Jet Ski Accessories', 'Jet Ski Parts', 'PWC Docks']),
  unnest(ARRAY['jetski-pwc', 'jetski-covers', 'jetski-accessories', 'jetski-parts', 'jetski-docks']),
  (SELECT id FROM categories WHERE slug = 'water-jetski'),
  unnest(ARRAY['Джетове', 'Покривала', 'Аксесоари', 'Части', 'Докове']),
  '🚤'
ON CONFLICT (slug) DO NOTHING;

-- Water Polo L3 (parent: water-polo)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Water Polo Balls', 'Water Polo Caps', 'Water Polo Goals', 'Swimwear', 'Training Equipment']),
  unnest(ARRAY['wpolo-balls', 'wpolo-caps', 'wpolo-goals', 'wpolo-swimwear', 'wpolo-training']),
  (SELECT id FROM categories WHERE slug = 'water-polo'),
  unnest(ARRAY['Топки', 'Шапки', 'Врати', 'Бански', 'Тренировъчни']),
  '🤽'
ON CONFLICT (slug) DO NOTHING;

-- Skiing L3 (parent: winter-skiing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Alpine Skis', 'Ski Boots', 'Ski Bindings', 'Ski Poles', 'Ski Helmets', 'Ski Goggles', 'Ski Jackets', 'Ski Pants', 'Cross Country Skis', 'Ski Bags']),
  unnest(ARRAY['ski-alpine', 'ski-boots', 'ski-bindings', 'ski-poles', 'ski-helmets', 'ski-goggles', 'ski-jackets', 'ski-pants', 'ski-cross-country', 'ski-bags']),
  (SELECT id FROM categories WHERE slug = 'winter-skiing'),
  unnest(ARRAY['Алпийски ски', 'Ски обувки', 'Автомати', 'Щеки', 'Каски', 'Очила', 'Якета', 'Панталони', 'Ски бягане', 'Чанти за ски']),
  '⛷️'
ON CONFLICT (slug) DO NOTHING;

-- Snowboarding L3 (parent: winter-snowboarding)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Snowboards', 'Snowboard Boots', 'Snowboard Bindings', 'Snowboard Helmets', 'Snowboard Goggles', 'Snowboard Jackets', 'Snowboard Pants', 'Snowboard Bags']),
  unnest(ARRAY['snow-boards', 'snow-boots', 'snow-bindings', 'snow-helmets', 'snow-goggles', 'snow-jackets', 'snow-pants', 'snow-bags']),
  (SELECT id FROM categories WHERE slug = 'winter-snowboarding'),
  unnest(ARRAY['Сноубордове', 'Обувки', 'Автомати', 'Каски', 'Очила', 'Якета', 'Панталони', 'Чанти']),
  '🏂'
ON CONFLICT (slug) DO NOTHING;

-- Inline Skating L3 (parent: inline-skating)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Fitness Skates', 'Aggressive Skates', 'Speed Skates', 'Roller Hockey Skates', 'Skate Protective Gear', 'Skate Wheels']),
  unnest(ARRAY['inline-fitness', 'inline-aggressive', 'inline-speed', 'inline-hockey', 'inline-protection', 'inline-wheels']),
  (SELECT id FROM categories WHERE slug = 'inline-skating'),
  unnest(ARRAY['Фитнес ролери', 'Агресив ролери', 'Скоростни', 'Хокейни', 'Протектори', 'Колела']),
  '🛼'
ON CONFLICT (slug) DO NOTHING;

-- Skateboarding L3 (parent: outdoor-skateboarding)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Complete Skateboards', 'Skateboard Decks', 'Skateboard Trucks', 'Skateboard Wheels', 'Skateboard Bearings', 'Skateboard Helmets', 'Skateboard Pads']),
  unnest(ARRAY['skate-complete', 'skate-decks', 'skate-trucks', 'skate-wheels', 'skate-bearings', 'skate-helmets', 'skate-pads']),
  (SELECT id FROM categories WHERE slug = 'outdoor-skateboarding'),
  unnest(ARRAY['Комплектни скейтове', 'Дъски', 'Тракове', 'Колела', 'Лагери', 'Каски', 'Протектори']),
  '🛹'
ON CONFLICT (slug) DO NOTHING;

-- Scooters L3 (parent: outdoor-scooters)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Kick Scooters', 'Stunt Scooters', 'Kids Scooters', 'Scooter Parts', 'Scooter Accessories']),
  unnest(ARRAY['scoot-kick', 'scoot-stunt', 'scoot-kids', 'scoot-parts', 'scoot-accessories']),
  (SELECT id FROM categories WHERE slug = 'outdoor-scooters'),
  unnest(ARRAY['Тротинетки', 'Трикови тротинетки', 'Детски', 'Части', 'Аксесоари']),
  '🛴'
ON CONFLICT (slug) DO NOTHING;

-- Outdoor Games L3 (parent: outdoor-games)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Lawn Games', 'Beach Games', 'Frisbees', 'Bocce Ball', 'Cornhole', 'Badminton Sets', 'Volleyball Sets']),
  unnest(ARRAY['game-lawn', 'game-beach', 'game-frisbee', 'game-bocce', 'game-cornhole', 'game-badminton-set', 'game-volleyball-set']),
  (SELECT id FROM categories WHERE slug = 'outdoor-games'),
  unnest(ARRAY['Градински игри', 'Плажни игри', 'Фрисби', 'Боча', 'Cornhole', 'Бадминтон комплекти', 'Волейбол комплекти']),
  '🎯'
ON CONFLICT (slug) DO NOTHING;

-- Sports Supplements - Protein L3 (parent: sports-protein)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Whey Protein', 'Casein Protein', 'Plant Protein', 'Protein Bars', 'Protein Cookies', 'Protein Blends']),
  unnest(ARRAY['protein-whey', 'protein-casein', 'protein-plant', 'protein-bars', 'protein-cookies', 'protein-blends']),
  (SELECT id FROM categories WHERE slug = 'sports-protein'),
  unnest(ARRAY['Суроватъчен протеин', 'Казеин', 'Растителен протеин', 'Протеинови барове', 'Протеинови бисквити', 'Протеинови смеси']),
  '💪'
ON CONFLICT (slug) DO NOTHING;

-- Pre-Workout L3 (parent: sports-pre-workout)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Stimulant Pre-Workout', 'Stim-Free Pre-Workout', 'Pump Products', 'Pre-Workout Samples']),
  unnest(ARRAY['prework-stim', 'prework-stimfree', 'prework-pump', 'prework-samples']),
  (SELECT id FROM categories WHERE slug = 'sports-pre-workout'),
  unnest(ARRAY['Със стимуланти', 'Без стимуланти', 'Pump продукти', 'Мостри']),
  '⚡'
ON CONFLICT (slug) DO NOTHING;

-- Creatine L3 (parent: sports-creatine)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Creatine Monohydrate', 'Creatine HCL', 'Buffered Creatine', 'Creatine Blends']),
  unnest(ARRAY['creatine-mono', 'creatine-hcl', 'creatine-buffered', 'creatine-blends']),
  (SELECT id FROM categories WHERE slug = 'sports-creatine'),
  unnest(ARRAY['Креатин монохидрат', 'Креатин HCL', 'Буфериран креатин', 'Креатинови смеси']),
  '💪'
ON CONFLICT (slug) DO NOTHING;

-- BCAAs & Amino Acids L3 (parent: sports-bcaa-amino)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['BCAA Powder', 'EAA Powder', 'Glutamine', 'L-Carnitine', 'Beta-Alanine']),
  unnest(ARRAY['amino-bcaa', 'amino-eaa', 'amino-glutamine', 'amino-carnitine', 'amino-beta-alanine']),
  (SELECT id FROM categories WHERE slug = 'sports-bcaa-amino'),
  unnest(ARRAY['BCAA прах', 'EAA прах', 'Глутамин', 'L-Карнитин', 'Бета-Аланин']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- Mass Gainers L3 (parent: sports-mass-gainers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['High Calorie Gainers', 'Lean Gainers', 'Weight Gainer Bars']),
  unnest(ARRAY['gainer-high-cal', 'gainer-lean', 'gainer-bars']),
  (SELECT id FROM categories WHERE slug = 'sports-mass-gainers'),
  unnest(ARRAY['Високо калорични', 'Lean гейнъри', 'Барове']),
  '💪'
ON CONFLICT (slug) DO NOTHING;

-- Fat Burners L3 (parent: sports-fat-burners)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Thermogenic Burners', 'Non-Stim Burners', 'CLA', 'Fat Burner Stacks']),
  unnest(ARRAY['burn-thermo', 'burn-nonstim', 'burn-cla', 'burn-stacks']),
  (SELECT id FROM categories WHERE slug = 'sports-fat-burners'),
  unnest(ARRAY['Термогенни', 'Без стимуланти', 'CLA', 'Комплекси']),
  '🔥'
ON CONFLICT (slug) DO NOTHING;

-- Energy & Hydration L3 (parent: sports-energy-hydration)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Energy Gels', 'Energy Bars', 'Electrolyte Drinks', 'Energy Chews', 'Hydration Tablets']),
  unnest(ARRAY['energy-gels', 'energy-bars', 'energy-electrolyte', 'energy-chews', 'energy-tablets']),
  (SELECT id FROM categories WHERE slug = 'sports-energy-hydration'),
  unnest(ARRAY['Енергийни гелове', 'Енергийни барове', 'Електролити', 'Енергийни бонбони', 'Хидратиращи таблетки']),
  '⚡'
ON CONFLICT (slug) DO NOTHING;

-- Recovery L3 (parent: sports-recovery)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Recovery Drinks', 'Massage Guns', 'Compression Gear', 'Foam Rollers', 'Ice Baths', 'Recovery Supplements']),
  unnest(ARRAY['recov-drinks', 'recov-massage', 'recov-compression', 'recov-rollers', 'recov-ice', 'recov-supplements']),
  (SELECT id FROM categories WHERE slug = 'sports-recovery'),
  unnest(ARRAY['Възстановителни напитки', 'Масажни пистолети', 'Компресионни дрехи', 'Ролери', 'Ледени вани', 'Добавки']),
  '🧘'
ON CONFLICT (slug) DO NOTHING;

-- Vitamins & Supplements L3 (parent: sports-vitamins)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Multivitamins', 'Vitamin D', 'Omega-3', 'Joint Support', 'Immune Support', 'Sleep Support']),
  unnest(ARRAY['vit-multi', 'vit-d', 'vit-omega', 'vit-joint', 'vit-immune', 'vit-sleep']),
  (SELECT id FROM categories WHERE slug = 'sports-vitamins'),
  unnest(ARRAY['Мултивитамини', 'Витамин D', 'Омега-3', 'За стави', 'За имунитет', 'За сън']),
  '💊'
ON CONFLICT (slug) DO NOTHING;
;
