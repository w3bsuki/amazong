
-- Phase 5: Collectibles - Sports Memorabilia & Entertainment Memorabilia L3s

-- Sports Memorabilia > Autographed Items L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Autographed Balls', 'Autographed Jerseys', 'Autographed Photos', 'Autographed Equipment', 'Autographed Cards', 'Autographed Helmets']),
  unnest(ARRAY['sports-auto-balls', 'sports-auto-jerseys', 'sports-auto-photos', 'sports-auto-equipment', 'sports-auto-cards', 'sports-auto-helmets']),
  (SELECT id FROM categories WHERE slug = 'sports-autographed'),
  unnest(ARRAY['Автографирани топки', 'Автографирани фланелки', 'Автографирани снимки', 'Автографирано оборудване', 'Автографирани карти', 'Автографирани каски']),
  '✍️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Sports Memorabilia > Game-Worn Items L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Game-Worn Jerseys', 'Game-Worn Shoes', 'Game-Worn Gloves', 'Game-Worn Helmets', 'Game-Used Bats', 'Game-Used Balls']),
  unnest(ARRAY['sports-gw-jerseys', 'sports-gw-shoes', 'sports-gw-gloves', 'sports-gw-helmets', 'sports-gu-bats', 'sports-gu-balls']),
  (SELECT id FROM categories WHERE slug = 'sports-game-worn'),
  unnest(ARRAY['Игрови фланелки', 'Игрови обувки', 'Игрови ръкавици', 'Игрови каски', 'Игрови бухалки', 'Игрови топки']),
  '👕',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Sports Memorabilia > Programs & Tickets L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Vintage Programs', 'Championship Programs', 'Event Tickets', 'Press Passes', 'All-Star Programs', 'Playoff Tickets']),
  unnest(ARRAY['sports-prog-vintage', 'sports-prog-champ', 'sports-prog-tickets', 'sports-prog-press', 'sports-prog-allstar', 'sports-prog-playoff']),
  (SELECT id FROM categories WHERE slug = 'sports-programs'),
  unnest(ARRAY['Винтидж програми', 'Шампионатни програми', 'Билети за събития', 'Прес пропуски', 'Олстар програми', 'Плейоф билети']),
  '🎟️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Sports Memorabilia > Display Items L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Framed Memorabilia', 'Shadow Boxes', 'Trophy Displays', 'Card Displays', 'Jersey Frames', 'Bat Display Cases']),
  unnest(ARRAY['sports-display-framed', 'sports-display-shadow', 'sports-display-trophy', 'sports-display-cards', 'sports-display-jersey', 'sports-display-bat']),
  (SELECT id FROM categories WHERE slug = 'sports-display'),
  unnest(ARRAY['Рамкирани меморабилия', 'Шадоу боксове', 'Трофейни витрини', 'Витрини за карти', 'Рамки за фланелки', 'Витрини за бухалки']),
  '🖼️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Entertainment Memorabilia > Movie Props L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Screen-Used Props', 'Replica Props', 'Costumes', 'Weapons Props', 'Vehicles & Models', 'Set Pieces']),
  unnest(ARRAY['ent-props-screen', 'ent-props-replica', 'ent-props-costumes', 'ent-props-weapons', 'ent-props-vehicles', 'ent-props-sets']),
  (SELECT id FROM categories WHERE slug = 'entertainment-props'),
  unnest(ARRAY['Екранни реквизити', 'Реплика реквизити', 'Костюми', 'Оръжия реквизит', 'Превозни средства и модели', 'Сет части']),
  '🎬',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Entertainment Memorabilia > Music Memorabilia L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Concert Posters', 'Stage-Used Instruments', 'Gold Records', 'Tour Merchandise', 'Autographed Items', 'Backstage Passes', 'Setlists']),
  unnest(ARRAY['ent-music-posters', 'ent-music-instruments', 'ent-music-gold', 'ent-music-tour', 'ent-music-auto', 'ent-music-passes', 'ent-music-setlists']),
  (SELECT id FROM categories WHERE slug = 'entertainment-music'),
  unnest(ARRAY['Концертни плакати', 'Използвани на сцена инструменти', 'Златни плочи', 'Турне стока', 'Автографирани предмети', 'Бекстейдж пропуски', 'Сетлисти']),
  '🎸',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Entertainment Memorabilia > TV Show Memorabilia L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Scripts', 'Props', 'Costumes', 'Set Photos', 'Promotional Items', 'Awards', 'Call Sheets']),
  unnest(ARRAY['ent-tv-scripts', 'ent-tv-props', 'ent-tv-costumes', 'ent-tv-photos', 'ent-tv-promo', 'ent-tv-awards', 'ent-tv-callsheets']),
  (SELECT id FROM categories WHERE slug = 'entertainment-tv'),
  unnest(ARRAY['Сценарии', 'Реквизити', 'Костюми', 'Снимки от снимачна площадка', 'Промоционални артикули', 'Награди', 'Разпределителни листи']),
  '📺',
  generate_series(1, 7)
ON CONFLICT (slug) DO NOTHING;

-- Entertainment Memorabilia > Celebrity Autographs L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Actor Autographs', 'Musician Autographs', 'Director Autographs', 'Author Autographs', 'Politician Autographs', 'Historical Figures']),
  unnest(ARRAY['ent-auto-actors', 'ent-auto-musicians', 'ent-auto-directors', 'ent-auto-authors', 'ent-auto-politicians', 'ent-auto-historical']),
  (SELECT id FROM categories WHERE slug = 'entertainment-autographs'),
  unnest(ARRAY['Автографи на актьори', 'Автографи на музиканти', 'Автографи на режисьори', 'Автографи на писатели', 'Автографи на политици', 'Исторически личности']),
  '✍️',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Entertainment Memorabilia > Vintage Posters L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Movie Posters 1920s-1950s', 'Movie Posters 1960s-1970s', 'Movie Posters 1980s-1990s', 'Concert Posters', 'Theater Posters', 'Advertising Posters']),
  unnest(ARRAY['ent-posters-2050', 'ent-posters-6070', 'ent-posters-8090', 'ent-posters-concert', 'ent-posters-theater', 'ent-posters-advertising']),
  (SELECT id FROM categories WHERE slug = 'entertainment-posters'),
  unnest(ARRAY['Филмови плакати 1920-1950', 'Филмови плакати 1960-1970', 'Филмови плакати 1980-1990', 'Концертни плакати', 'Театрални плакати', 'Рекламни плакати']),
  '🎭',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;
;
