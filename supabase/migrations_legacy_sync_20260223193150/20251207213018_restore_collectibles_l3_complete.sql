-- Restore Collectibles L3 categories

-- Trading Cards L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Pokémon Cards', 'cards-pokemon', 'Pokémon карти', 1),
  ('Magic: The Gathering', 'cards-mtg', 'Magic: The Gathering', 2),
  ('Yu-Gi-Oh Cards', 'cards-yugioh', 'Yu-Gi-Oh карти', 3),
  ('Sports Cards', 'cards-sports', 'Спортни карти', 4),
  ('Card Sleeves', 'cards-sleeves', 'Протектори за карти', 5),
  ('Card Binders', 'cards-binders', 'Албуми за карти', 6),
  ('Graded Cards', 'cards-graded', 'Оценени карти', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'collect-trading-cards'
ON CONFLICT (slug) DO NOTHING;

-- Comics L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Marvel Comics', 'comics-marvel', 'Marvel комикси', 1),
  ('DC Comics', 'comics-dc', 'DC комикси', 2),
  ('Manga', 'comics-manga', 'Манга', 3),
  ('Indie Comics', 'comics-indie', 'Инди комикси', 4),
  ('Vintage Comics', 'comics-vintage', 'Винтидж комикси', 5),
  ('Graphic Novels', 'comics-graphic-novels', 'Графични романи', 6),
  ('Comic Storage', 'comics-storage', 'Съхранение за комикси', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'collect-comics'
ON CONFLICT (slug) DO NOTHING;

-- Coins & Currency L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Ancient Coins', 'coins-ancient', 'Антични монети', 1),
  ('World Coins', 'coins-world', 'Световни монети', 2),
  ('US Coins', 'coins-us', 'Американски монети', 3),
  ('European Coins', 'coins-european', 'Европейски монети', 4),
  ('Bullion Coins', 'coins-bullion', 'Инвестиционни монети', 5),
  ('Banknotes', 'coins-banknotes', 'Банкноти', 6),
  ('Coin Albums', 'coins-albums', 'Албуми за монети', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'collect-coins'
ON CONFLICT (slug) DO NOTHING;

-- Stamps L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Vintage Stamps', 'stamps-vintage', 'Винтидж пощенски марки', 1),
  ('World Stamps', 'stamps-world', 'Световни марки', 2),
  ('First Day Covers', 'stamps-fdc', 'Първодневни пликове', 3),
  ('Stamp Albums', 'stamps-albums', 'Албуми за марки', 4),
  ('Stamp Tools', 'stamps-tools', 'Инструменти за филателия', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'collect-stamps'
ON CONFLICT (slug) DO NOTHING;

-- Memorabilia L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Autographs', 'memorabilia-autographs', 'Автографи', 1),
  ('Movie Props', 'memorabilia-props', 'Филмови реквизити', 2),
  ('Concert Memorabilia', 'memorabilia-concert', 'Концертни сувенири', 3),
  ('Historical Documents', 'memorabilia-historical', 'Исторически документи', 4),
  ('Celebrity Items', 'memorabilia-celebrity', 'Знаменитости', 5),
  ('Posters & Photos', 'memorabilia-posters', 'Плакати и снимки', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'collect-memorabilia'
ON CONFLICT (slug) DO NOTHING;

-- Sports Memorabilia L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Signed Jerseys', 'sports-mem-jerseys', 'Подписани екипи', 1),
  ('Signed Balls', 'sports-mem-balls', 'Подписани топки', 2),
  ('Helmets', 'sports-mem-helmets', 'Каски', 3),
  ('Equipment', 'sports-mem-equipment', 'Оборудване', 4),
  ('Photos', 'sports-mem-photos', 'Снимки', 5),
  ('Tickets', 'sports-mem-tickets', 'Билети', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'collect-sports'
ON CONFLICT (slug) DO NOTHING;

-- Antiques L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Antique Furniture', 'antiques-furniture', 'Антични мебели', 1),
  ('Antique Jewelry', 'antiques-jewelry', 'Антични бижута', 2),
  ('Antique Clocks', 'antiques-clocks', 'Антични часовници', 3),
  ('Antique Porcelain', 'antiques-porcelain', 'Античен порцелан', 4),
  ('Antique Art', 'antiques-art', 'Антично изкуство', 5),
  ('Antique Books', 'antiques-books', 'Антикварни книги', 6),
  ('Antique Silver', 'antiques-silver', 'Антично сребро', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'collect-antiques'
ON CONFLICT (slug) DO NOTHING;

-- Vintage Items L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Vintage Clothing', 'vintage-clothing', 'Винтидж дрехи', 1),
  ('Vintage Electronics', 'vintage-electronics', 'Винтидж електроника', 2),
  ('Vintage Toys', 'vintage-toys', 'Винтидж играчки', 3),
  ('Vintage Cameras', 'vintage-cameras', 'Винтидж фотоапарати', 4),
  ('Vintage Signs', 'vintage-signs', 'Винтидж табели', 5),
  ('Vintage Watches', 'vintage-watches', 'Винтидж часовници', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'collect-vintage'
ON CONFLICT (slug) DO NOTHING;

-- Figurines & Statues L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Anime Statues', 'figurines-anime', 'Аниме статуи', 1),
  ('Movie Statues', 'figurines-movie', 'Филмови статуи', 2),
  ('Comic Statues', 'figurines-comic', 'Комикс статуи', 3),
  ('Video Game Statues', 'figurines-videogame', 'Статуи от игри', 4),
  ('Fantasy Figurines', 'figurines-fantasy', 'Фентъзи фигурки', 5),
  ('Military Figurines', 'figurines-military', 'Военни фигурки', 6),
  ('Display Cases', 'figurines-display', 'Витрини', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'collect-figurines'
ON CONFLICT (slug) DO NOTHING;;
