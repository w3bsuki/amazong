
-- Phase 3.3.4: Pets L3 Categories - Horses & Pet Gifts

-- Horse Blankets & Sheets L3 (parent: horse-blankets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Turnout Blankets', 'Stable Blankets', 'Fly Sheets', 'Cooler Sheets', 'Rain Sheets', 'Quarter Sheets']),
  unnest(ARRAY['blanket-turnout', 'blanket-stable', 'blanket-fly', 'blanket-cooler', 'blanket-rain', 'blanket-quarter']),
  (SELECT id FROM categories WHERE slug = 'horse-blankets'),
  unnest(ARRAY['За пасище', 'За обор', 'Срещу мухи', 'Охлаждащи', 'Дъждобрани', 'Quarter']),
  '🐴'
ON CONFLICT (slug) DO NOTHING;

-- Horse Farrier & Hoof Care L3 (parent: horse-hoof)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hoof Picks', 'Hoof Oil', 'Hoof Conditioner', 'Hoof Boots', 'Horseshoes', 'Farrier Tools']),
  unnest(ARRAY['hoof-picks', 'hoof-oil', 'hoof-conditioner', 'hoof-boots', 'hoof-shoes', 'hoof-tools']),
  (SELECT id FROM categories WHERE slug = 'horse-hoof'),
  unnest(ARRAY['Копитарки', 'Масло', 'Балсами', 'Ботуши за копита', 'Подкови', 'Ковашки инструменти']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- Horse Health & First Aid L3 (parent: horse-health)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Horse Dewormers', 'Horse Supplements', 'Wound Care', 'Joint Support', 'Digestive Health', 'Fly Sprays']),
  unnest(ARRAY['horse-deworm', 'horse-supps', 'horse-wound', 'horse-joint', 'horse-digest', 'horse-fly-spray']),
  (SELECT id FROM categories WHERE slug = 'horse-health'),
  unnest(ARRAY['Обезпаразитяване', 'Добавки', 'За рани', 'За стави', 'Храносмилане', 'Срещу мухи']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- Horse Riding Apparel L3 (parent: horse-apparel)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Riding Pants', 'Riding Shirts', 'Riding Vests', 'Show Coats', 'Chaps', 'Half Chaps']),
  unnest(ARRAY['apparel-pants', 'apparel-shirts', 'apparel-vests', 'apparel-coats', 'apparel-chaps', 'apparel-half']),
  (SELECT id FROM categories WHERE slug = 'horse-apparel'),
  unnest(ARRAY['Панталони', 'Ризи', 'Елеци', 'Сака', 'Чапси', 'Полу чапси']),
  '👖'
ON CONFLICT (slug) DO NOTHING;

-- Horse Stable & Barn L3 (parent: horse-stable)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Stall Mats', 'Water Buckets', 'Feed Bins', 'Hay Nets', 'Stall Guards', 'Manure Forks']),
  unnest(ARRAY['stable-mats', 'stable-buckets', 'stable-bins', 'stable-nets', 'stable-guards', 'stable-forks']),
  (SELECT id FROM categories WHERE slug = 'horse-stable'),
  unnest(ARRAY['Постелки', 'Кофи', 'Контейнери за фураж', 'Мрежи за сено', 'Прегради', 'Вили']),
  '🏠'
ON CONFLICT (slug) DO NOTHING;

-- Horse Toys & Enrichment L3 (parent: horse-toys)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Treat Balls', 'Lick Blocks', 'Hanging Toys', 'Jolly Balls', 'Puzzle Toys']),
  unnest(ARRAY['htoy-balls', 'htoy-lick', 'htoy-hanging', 'htoy-jolly', 'htoy-puzzle']),
  (SELECT id FROM categories WHERE slug = 'horse-toys'),
  unnest(ARRAY['Топки за лакомства', 'Лизалки', 'Висящи', 'Jolly Balls', 'Пъзели']),
  '🎾'
ON CONFLICT (slug) DO NOTHING;

-- Horse Trailers & Transport L3 (parent: horse-transport)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Horse Trailers', 'Trailer Accessories', 'Shipping Boots', 'Head Bumpers', 'Trailer Ties']),
  unnest(ARRAY['trailer-horse', 'trailer-access', 'trailer-boots', 'trailer-bumpers', 'trailer-ties']),
  (SELECT id FROM categories WHERE slug = 'horse-transport'),
  unnest(ARRAY['Ремаркета', 'Аксесоари', 'Транспортни протектори', 'Протектори за глава', 'Връзки']),
  '🚛'
ON CONFLICT (slug) DO NOTHING;

-- Horse Treats L3 (parent: horse-treats)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Apple Treats', 'Carrot Treats', 'Molasses Treats', 'Mint Treats', 'Sugar Free Treats']),
  unnest(ARRAY['htreat-apple', 'htreat-carrot', 'htreat-molasses', 'htreat-mint', 'htreat-sugar-free']),
  (SELECT id FROM categories WHERE slug = 'horse-treats'),
  unnest(ARRAY['Ябълкови', 'Морковени', 'С меласа', 'Ментови', 'Без захар']),
  '🍎'
ON CONFLICT (slug) DO NOTHING;

-- Gift Baskets L3 (parent: pet-gift-baskets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dog Gift Baskets', 'Cat Gift Baskets', 'New Pet Baskets', 'Holiday Baskets']),
  unnest(ARRAY['gift-dog', 'gift-cat', 'gift-new', 'gift-holiday']),
  (SELECT id FROM categories WHERE slug = 'pet-gift-baskets'),
  unnest(ARRAY['За кучета', 'За котки', 'За нов любимец', 'Празнични']),
  '🎁'
ON CONFLICT (slug) DO NOTHING;

-- Gift Cards L3 (parent: pet-gift-cards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['E-Gift Cards', 'Physical Gift Cards', 'Store Credit']),
  unnest(ARRAY['gcard-e', 'gcard-physical', 'gcard-credit']),
  (SELECT id FROM categories WHERE slug = 'pet-gift-cards'),
  unnest(ARRAY['Електронни', 'Физически', 'Кредит']),
  '💳'
ON CONFLICT (slug) DO NOTHING;

-- Personalized Items L3 (parent: personalized-pet-items)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Custom Collars', 'Engraved Tags', 'Photo Frames', 'Custom Bowls', 'Name Tags']),
  unnest(ARRAY['custom-collar', 'custom-tags', 'custom-frames', 'custom-bowls', 'custom-name']),
  (SELECT id FROM categories WHERE slug = 'personalized-pet-items'),
  unnest(ARRAY['Персонални нашийници', 'Гравирани медальони', 'Рамки', 'Персонални купички', 'Табелки']),
  '✨'
ON CONFLICT (slug) DO NOTHING;

-- Pet Home Decor L3 (parent: pet-themed-home-decor)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pet Art', 'Pet Pillows', 'Pet Blankets', 'Pet Signs', 'Pet Figurines']),
  unnest(ARRAY['decor-art', 'decor-pillows', 'decor-blankets', 'decor-signs', 'decor-figurines']),
  (SELECT id FROM categories WHERE slug = 'pet-themed-home-decor'),
  unnest(ARRAY['Картини', 'Възглавници', 'Одеяла', 'Табели', 'Фигурки']),
  '🖼️'
ON CONFLICT (slug) DO NOTHING;

-- Pet-Themed Clothing L3 (parent: pet-themed-clothing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pet T-Shirts', 'Pet Hoodies', 'Pet Pajamas', 'Pet Socks', 'Pet Hats']),
  unnest(ARRAY['pcloth-tshirt', 'pcloth-hoodie', 'pcloth-pj', 'pcloth-socks', 'pcloth-hats']),
  (SELECT id FROM categories WHERE slug = 'pet-themed-clothing'),
  unnest(ARRAY['Тениски', 'Суичъри', 'Пижами', 'Чорапи', 'Шапки']),
  '👕'
ON CONFLICT (slug) DO NOTHING;

-- Subscription Boxes L3 (parent: pet-subscription-boxes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Dog Subscription', 'Cat Subscription', 'Treat Boxes', 'Toy Boxes']),
  unnest(ARRAY['sub-dog', 'sub-cat', 'sub-treats', 'sub-toys']),
  (SELECT id FROM categories WHERE slug = 'pet-subscription-boxes'),
  unnest(ARRAY['За кучета', 'За котки', 'С лакомства', 'С играчки']),
  '📦'
ON CONFLICT (slug) DO NOTHING;
;
