
-- Phase 3.2.1: Sports L3 Categories - Team Sports & Racket Sports

-- Football/Soccer L3 (parent: football-soccer)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Footballs', 'Football Boots', 'Shin Guards', 'Goalkeeper Gloves', 'Goals & Nets', 'Training Equipment', 'Referee Equipment', 'Team Kits']),
  unnest(ARRAY['football-balls', 'football-boots', 'football-shin-guards', 'football-gk-gloves', 'football-goals', 'football-training', 'football-referee', 'football-kits']),
  (SELECT id FROM categories WHERE slug = 'football-soccer'),
  unnest(ARRAY['Топки', 'Бутонки', 'Кори', 'Вратарски ръкавици', 'Врати и мрежи', 'Тренировъчни', 'Съдийски', 'Екипи']),
  '⚽'
ON CONFLICT (slug) DO NOTHING;

-- Tennis L3 (parent: racket-tennis)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tennis Rackets', 'Tennis Balls', 'Tennis Strings', 'Tennis Bags', 'Tennis Shoes', 'Tennis Nets', 'Tennis Grips', 'Tennis Accessories']),
  unnest(ARRAY['tennis-rackets', 'tennis-balls', 'tennis-strings', 'tennis-bags', 'tennis-shoes', 'tennis-nets', 'tennis-grips', 'tennis-accessories']),
  (SELECT id FROM categories WHERE slug = 'racket-tennis'),
  unnest(ARRAY['Ракети', 'Топки', 'Кордажи', 'Чанти', 'Обувки', 'Мрежи', 'Грипове', 'Аксесоари']),
  '🎾'
ON CONFLICT (slug) DO NOTHING;

-- Badminton L3 (parent: racket-badminton)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Badminton Rackets', 'Shuttlecocks', 'Badminton Bags', 'Badminton Shoes', 'Badminton Strings', 'Badminton Nets', 'Badminton Grips']),
  unnest(ARRAY['badminton-rackets', 'badminton-shuttles', 'badminton-bags', 'badminton-shoes', 'badminton-strings', 'badminton-nets', 'badminton-grips']),
  (SELECT id FROM categories WHERE slug = 'racket-badminton'),
  unnest(ARRAY['Ракети', 'Перца', 'Чанти', 'Обувки', 'Кордажи', 'Мрежи', 'Грипове']),
  '🏸'
ON CONFLICT (slug) DO NOTHING;

-- Squash L3 (parent: racket-squash)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Squash Rackets', 'Squash Balls', 'Squash Eyewear', 'Squash Shoes', 'Squash Bags', 'Squash Grips']),
  unnest(ARRAY['squash-rackets', 'squash-balls', 'squash-eyewear', 'squash-shoes', 'squash-bags', 'squash-grips']),
  (SELECT id FROM categories WHERE slug = 'racket-squash'),
  unnest(ARRAY['Ракети', 'Топки', 'Очила', 'Обувки', 'Чанти', 'Грипове']),
  '🎾'
ON CONFLICT (slug) DO NOTHING;

-- Padel L3 (parent: racket-padel)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Padel Rackets', 'Padel Balls', 'Padel Bags', 'Padel Shoes', 'Padel Grips', 'Padel Accessories']),
  unnest(ARRAY['padel-rackets', 'padel-balls', 'padel-bags', 'padel-shoes', 'padel-grips', 'padel-accessories']),
  (SELECT id FROM categories WHERE slug = 'racket-padel'),
  unnest(ARRAY['Ракети', 'Топки', 'Чанти', 'Обувки', 'Грипове', 'Аксесоари']),
  '🎾'
ON CONFLICT (slug) DO NOTHING;

-- Table Tennis L3 (parent: table-tennis)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Table Tennis Paddles', 'Table Tennis Balls', 'Table Tennis Tables', 'Table Tennis Rubbers', 'Table Tennis Nets', 'Table Tennis Robot']),
  unnest(ARRAY['tt-paddles', 'tt-balls', 'tt-tables', 'tt-rubbers', 'tt-nets', 'tt-robots']),
  (SELECT id FROM categories WHERE slug = 'table-tennis'),
  unnest(ARRAY['Хилки', 'Топчета', 'Маси', 'Гуми', 'Мрежи', 'Роботи']),
  '🏓'
ON CONFLICT (slug) DO NOTHING;

-- Training Equipment L3 (parent: team-sports-training)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Cones & Markers', 'Agility Ladders', 'Speed Parachutes', 'Hurdles', 'Resistance Bands', 'Medicine Balls', 'Training Dummies', 'Rebounders']),
  unnest(ARRAY['train-cones', 'train-agility', 'train-parachutes', 'train-hurdles', 'train-resistance', 'train-medicine-balls', 'train-dummies', 'train-rebounders']),
  (SELECT id FROM categories WHERE slug = 'team-sports-training'),
  unnest(ARRAY['Конуси', 'Координационни стълби', 'Парашути', 'Препятствия', 'Ластици', 'Медицински топки', 'Манекени', 'Отскачащи мрежи']),
  '🏋️'
ON CONFLICT (slug) DO NOTHING;

-- Basketball Fan Gear L3 (parent: fan-basketball)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['NBA Jerseys', 'NBA Hats', 'NBA T-Shirts', 'NBA Hoodies', 'NBA Accessories']),
  unnest(ARRAY['fan-nba-jerseys', 'fan-nba-hats', 'fan-nba-tshirts', 'fan-nba-hoodies', 'fan-nba-accessories']),
  (SELECT id FROM categories WHERE slug = 'fan-basketball'),
  unnest(ARRAY['NBA фланелки', 'NBA шапки', 'NBA тениски', 'NBA суитчъри', 'NBA аксесоари']),
  '🏀'
ON CONFLICT (slug) DO NOTHING;

-- Football Fan Gear L3 (parent: fan-football)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Team Jerseys', 'Team Scarves', 'Team Hats', 'Team Flags', 'Team Accessories', 'National Team Gear']),
  unnest(ARRAY['fan-team-jerseys', 'fan-team-scarves', 'fan-team-hats', 'fan-team-flags', 'fan-team-accessories', 'fan-national-gear']),
  (SELECT id FROM categories WHERE slug = 'fan-football'),
  unnest(ARRAY['Фланелки', 'Шалове', 'Шапки', 'Флагове', 'Аксесоари', 'Национален отбор']),
  '⚽'
ON CONFLICT (slug) DO NOTHING;

-- Other Fan Gear L3 (parent: fan-other-sports)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hockey Gear', 'Baseball Gear', 'Rugby Gear', 'Cricket Gear', 'Formula 1 Gear', 'MotoGP Gear']),
  unnest(ARRAY['fan-hockey', 'fan-baseball', 'fan-rugby', 'fan-cricket', 'fan-f1', 'fan-motogp']),
  (SELECT id FROM categories WHERE slug = 'fan-other-sports'),
  unnest(ARRAY['Хокей', 'Бейзбол', 'Ръгби', 'Крикет', 'Формула 1', 'MotoGP']),
  '🏆'
ON CONFLICT (slug) DO NOTHING;
;
