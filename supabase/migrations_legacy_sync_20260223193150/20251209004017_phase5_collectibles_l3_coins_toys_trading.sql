
-- Phase 5: Collectibles - Coins, Toys, Trading Cards L3 Categories

-- Coins > Bulgarian Coins L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Pre-Liberation Coins', 'Kingdom Era Coins', 'Socialist Era Coins', 'Modern Bulgarian Coins', 'Bulgarian Commemoratives', 'Bulgarian Gold Coins']),
  unnest(ARRAY['coins-bg-preliberation', 'coins-bg-kingdom', 'coins-bg-socialist', 'coins-bg-modern', 'coins-bg-commemorative', 'coins-bg-gold']),
  (SELECT id FROM categories WHERE slug = 'bulgarian-coins'),
  unnest(ARRAY['Преди Освобождението', 'Царство България', 'Социалистическа ера', 'Съвременни монети', 'Възпоменателни', 'Златни български']),
  '🪙',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Coins > Ancient Coins L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Greek Ancient', 'Roman Ancient', 'Byzantine', 'Celtic Coins', 'Persian Coins', 'Thracian Coins']),
  unnest(ARRAY['coins-ancient-greek', 'coins-ancient-roman', 'coins-ancient-byzantine', 'coins-ancient-celtic', 'coins-ancient-persian', 'coins-ancient-thracian']),
  (SELECT id FROM categories WHERE slug = 'ancient-coins'),
  unnest(ARRAY['Гръцки антични', 'Римски антични', 'Византийски', 'Келтски монети', 'Персийски монети', 'Тракийски монети']),
  '🪙',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Coins > Gold Coins L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['American Gold Eagles', 'Canadian Gold Maple', 'Krugerrands', 'British Sovereigns', 'Austrian Philharmonics', 'Pre-1933 US Gold']),
  unnest(ARRAY['coins-gold-eagles', 'coins-gold-maple', 'coins-gold-kruger', 'coins-gold-sovereign', 'coins-gold-philharmonic', 'coins-gold-pre1933']),
  (SELECT id FROM categories WHERE slug = 'coins-gold'),
  unnest(ARRAY['Американски златни орли', 'Канадски златен кленов лист', 'Крюгеранди', 'Британски соверени', 'Австрийски филхармоник', 'Американски пре-1933']),
  '🥇',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Coins > Silver Coins L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['American Silver Eagles', 'Canadian Silver Maple', 'Morgan Dollars', 'Peace Dollars', 'British Britannias', '90% Silver Coins']),
  unnest(ARRAY['coins-silver-eagles', 'coins-silver-maple', 'coins-silver-morgan', 'coins-silver-peace', 'coins-silver-britannia', 'coins-silver-90']),
  (SELECT id FROM categories WHERE slug = 'coins-silver'),
  unnest(ARRAY['Американски сребърни орли', 'Канадски сребърен кленов', 'Морган долари', 'Пийс долари', 'Британски британия', '90% сребърни монети']),
  '🥈',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Collectible Toys > Action Figures L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Marvel Legends', 'Star Wars Black Series', 'DC Multiverse', 'Transformers', 'NECA Figures', 'McFarlane Toys', 'Vintage Action Figures']),
  unnest(ARRAY['toys-action-marvel', 'toys-action-starwars', 'toys-action-dc', 'toys-action-transformers', 'toys-action-neca', 'toys-action-mcfarlane', 'toys-action-vintage']),
  (SELECT id FROM categories WHERE slug = 'coll-action-figures'),
  unnest(ARRAY['Марвел легенди', 'Стар Уорс Блек серия', 'DC Мултивърс', 'Трансформърс', 'NECA фигури', 'McFarlane играчки', 'Винтидж екшън фигури']),
  '🦸',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Collectible Toys > Anime Figures L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Figma', 'Nendoroid', 'Scale Figures', 'Prize Figures', 'Bandai Figures', 'Kotobukiya', 'Good Smile Company']),
  unnest(ARRAY['toys-anime-figma', 'toys-anime-nendoroid', 'toys-anime-scale', 'toys-anime-prize', 'toys-anime-bandai', 'toys-anime-kotobukiya', 'toys-anime-goodsmile']),
  (SELECT id FROM categories WHERE slug = 'toys-anime'),
  unnest(ARRAY['Фигма', 'Нендороид', 'Мащабни фигури', 'Призови фигури', 'Бандай фигури', 'Котобукия', 'Гуд Смайл Компани']),
  '🎌',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Collectible Toys > Funko Pop L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Marvel Funko', 'DC Funko', 'Star Wars Funko', 'Anime Funko', 'Movies Funko', 'TV Shows Funko', 'Music Funko', 'Chase & Exclusives']),
  unnest(ARRAY['toys-funko-marvel', 'toys-funko-dc', 'toys-funko-starwars', 'toys-funko-anime', 'toys-funko-movies', 'toys-funko-tv', 'toys-funko-music', 'toys-funko-chase']),
  (SELECT id FROM categories WHERE slug = 'toys-funko'),
  unnest(ARRAY['Марвел Фънко', 'DC Фънко', 'Стар Уорс Фънко', 'Аниме Фънко', 'Филми Фънко', 'Сериали Фънко', 'Музика Фънко', 'Чейс и ексклузиви']),
  '🎭',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Collectible Toys > Diecast Models L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['1:18 Scale Cars', '1:24 Scale Cars', '1:43 Scale Cars', '1:64 Scale Cars', 'Hot Wheels', 'Matchbox', 'Aircraft Models', 'Military Models']),
  unnest(ARRAY['toys-diecast-118', 'toys-diecast-124', 'toys-diecast-143', 'toys-diecast-164', 'toys-diecast-hotwheels', 'toys-diecast-matchbox', 'toys-diecast-aircraft', 'toys-diecast-military']),
  (SELECT id FROM categories WHERE slug = 'coll-diecast'),
  unnest(ARRAY['Мащаб 1:18 коли', 'Мащаб 1:24 коли', 'Мащаб 1:43 коли', 'Мащаб 1:64 коли', 'Хот Уийлс', 'Мачбокс', 'Модели самолети', 'Военни модели']),
  '🚗',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;

-- Trading Cards L3s (coll-trading-cards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Pokemon TCG', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Baseball Cards', 'Basketball Cards', 'Football Cards', 'Hockey Cards', 'Soccer Cards']),
  unnest(ARRAY['cards-pokemon', 'cards-mtg', 'cards-yugioh', 'cards-baseball', 'cards-basketball', 'cards-football', 'cards-hockey', 'cards-soccer']),
  (SELECT id FROM categories WHERE slug = 'coll-trading-cards'),
  unnest(ARRAY['Покемон TCG', 'Магия: Събирането', 'Ю-Ги-О!', 'Бейзбол карти', 'Баскетбол карти', 'Футбол карти', 'Хокей карти', 'Футбол карти']),
  '🃏',
  generate_series(1, 8)
ON CONFLICT (slug) DO NOTHING;
;
