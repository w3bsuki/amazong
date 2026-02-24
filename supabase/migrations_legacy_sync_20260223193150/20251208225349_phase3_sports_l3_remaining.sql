
-- Phase 3.2.5: Sports L3 Categories - Remaining Categories

-- Archery L3 (parent: sports-archery)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Compound Bows', 'Recurve Bows', 'Longbows', 'Crossbows', 'Arrows', 'Quivers', 'Bow Sights', 'Archery Targets', 'Archery Gloves']),
  unnest(ARRAY['archery-compound', 'archery-recurve', 'archery-longbow', 'archery-crossbow', 'archery-arrows', 'archery-quivers', 'archery-sights', 'archery-targets', 'archery-gloves']),
  (SELECT id FROM categories WHERE slug = 'sports-archery'),
  unnest(ARRAY['Компаунд лъкове', 'Рикърв лъкове', 'Дълги лъкове', 'Арбалети', 'Стрели', 'Колчани', 'Прицели', 'Мишени', 'Ръкавици']),
  '🏹'
ON CONFLICT (slug) DO NOTHING;

-- Binoculars L3 (parent: binoculars)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Compact Binoculars', 'Full-Size Binoculars', 'Night Vision', 'Monoculars', 'Spotting Scopes', 'Binocular Accessories']),
  unnest(ARRAY['bino-compact', 'bino-fullsize', 'bino-night', 'bino-monocular', 'bino-spotting', 'bino-accessories']),
  (SELECT id FROM categories WHERE slug = 'binoculars'),
  unnest(ARRAY['Компактни бинокли', 'Пълноразмерни', 'Нощно виждане', 'Монокуляри', 'Зрителни тръби', 'Аксесоари']),
  '🔭'
ON CONFLICT (slug) DO NOTHING;

-- Fishing Gear L3 (parent: fishing-gear)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Fishing Rods', 'Fishing Reels', 'Fishing Line', 'Fishing Lures', 'Fishing Tackle Boxes', 'Fishing Nets', 'Fishing Waders', 'Fish Finders']),
  unnest(ARRAY['fish-rods', 'fish-reels', 'fish-line', 'fish-lures', 'fish-tackle', 'fish-nets', 'fish-waders', 'fish-finders']),
  (SELECT id FROM categories WHERE slug = 'fishing-gear'),
  unnest(ARRAY['Въдици', 'Макари', 'Влакна', 'Примамки', 'Кутии', 'Кепове', 'Гащеризони', 'Сонари']),
  '🎣'
ON CONFLICT (slug) DO NOTHING;

-- Fishing L3 (parent: fishing-equip - duplicate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Spinning Gear', 'Fly Fishing Gear', 'Ice Fishing Gear', 'Saltwater Gear', 'Freshwater Gear']),
  unnest(ARRAY['fish-eq-spin', 'fish-eq-fly', 'fish-eq-ice', 'fish-eq-salt', 'fish-eq-fresh']),
  (SELECT id FROM categories WHERE slug = 'fishing-equip'),
  unnest(ARRAY['Спининг', 'Fly риболов', 'Лед риболов', 'Морски', 'Сладководен']),
  '🎣'
ON CONFLICT (slug) DO NOTHING;

-- Sport Fishing L3 (parent: sports-fishing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Deep Sea Fishing', 'Bass Fishing', 'Trout Fishing', 'Carp Fishing', 'Kayak Fishing']),
  unnest(ARRAY['sport-fish-deep', 'sport-fish-bass', 'sport-fish-trout', 'sport-fish-carp', 'sport-fish-kayak']),
  (SELECT id FROM categories WHERE slug = 'sports-fishing'),
  unnest(ARRAY['Дълбоководен', 'Bass риболов', 'Пъстърва', 'Шаран', 'Каяк риболов']),
  '🎣'
ON CONFLICT (slug) DO NOTHING;

-- Hunting Gear L3 (parent: hunting-gear)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Hunting Rifles', 'Hunting Scopes', 'Hunting Clothing', 'Hunting Boots', 'Hunting Blinds', 'Game Calls', 'Trail Cameras', 'Hunting Knives']),
  unnest(ARRAY['hunt-rifles', 'hunt-scopes', 'hunt-clothing', 'hunt-boots', 'hunt-blinds', 'hunt-calls', 'hunt-cameras', 'hunt-knives']),
  (SELECT id FROM categories WHERE slug = 'hunting-gear'),
  unnest(ARRAY['Ловни пушки', 'Оптика', 'Облекло', 'Обувки', 'Засади', 'Примамки', 'Камери', 'Ножове']),
  '🦌'
ON CONFLICT (slug) DO NOTHING;

-- Hunting Equipment L3 (parent: hunting-equipment - duplicate)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tree Stands', 'Ground Blinds', 'Decoys', 'Hunting Packs', 'Game Processing']),
  unnest(ARRAY['hunt-eq-stands', 'hunt-eq-blinds', 'hunt-eq-decoys', 'hunt-eq-packs', 'hunt-eq-process']),
  (SELECT id FROM categories WHERE slug = 'hunting-equipment'),
  unnest(ARRAY['Стойки за дървета', 'Наземни засади', 'Макети', 'Ловни раници', 'Обработка на дивеч']),
  '🦌'
ON CONFLICT (slug) DO NOTHING;

-- Sport Hunting L3 (parent: sports-hunting)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Big Game Hunting', 'Bird Hunting', 'Small Game Hunting', 'Bow Hunting']),
  unnest(ARRAY['hunt-big-game', 'hunt-bird', 'hunt-small-game', 'hunt-bow']),
  (SELECT id FROM categories WHERE slug = 'sports-hunting'),
  unnest(ARRAY['Едър дивеч', 'Птици', 'Дребен дивеч', 'Лъков лов']),
  '🦌'
ON CONFLICT (slug) DO NOTHING;

-- Shooting Sports L3 (parent: shooting-sports)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Target Shooting', 'Clay Shooting', 'Air Guns', 'Airsoft', 'Paintball', 'Shooting Targets', 'Ear Protection', 'Eye Protection']),
  unnest(ARRAY['shoot-target', 'shoot-clay', 'shoot-air', 'shoot-airsoft', 'shoot-paintball', 'shoot-targets', 'shoot-ear', 'shoot-eye']),
  (SELECT id FROM categories WHERE slug = 'shooting-sports'),
  unnest(ARRAY['Стрелба по мишени', 'Гълъби', 'Въздушни оръжия', 'Еърсофт', 'Пейнтбол', 'Мишени', 'Антифони', 'Очила']),
  '🎯'
ON CONFLICT (slug) DO NOTHING;

-- Equestrian - Bridles L3 (parent: bridles)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['English Bridles', 'Western Bridles', 'Bitless Bridles', 'Reins', 'Bits']),
  unnest(ARRAY['bridle-english', 'bridle-western', 'bridle-bitless', 'bridle-reins', 'bridle-bits']),
  (SELECT id FROM categories WHERE slug = 'bridles'),
  unnest(ARRAY['Английски юзди', 'Уестърн юзди', 'Без желязо', 'Поводи', 'Юзди желязо']),
  '🐴'
ON CONFLICT (slug) DO NOTHING;

-- Saddles L3 (parent: saddles)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['English Saddles', 'Western Saddles', 'Dressage Saddles', 'Jumping Saddles', 'Saddle Pads', 'Girths']),
  unnest(ARRAY['saddle-english', 'saddle-western', 'saddle-dressage', 'saddle-jumping', 'saddle-pads', 'saddle-girths']),
  (SELECT id FROM categories WHERE slug = 'saddles'),
  unnest(ARRAY['Английски седла', 'Уестърн седла', 'Дресура', 'Скачане', 'Потници', 'Корами']),
  '🐴'
ON CONFLICT (slug) DO NOTHING;

-- Riding Equipment L3 (parent: riding-equipment)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Riding Crops', 'Spurs', 'Halters', 'Lead Ropes', 'Lunging Equipment', 'Horse Blankets']),
  unnest(ARRAY['ride-eq-crops', 'ride-eq-spurs', 'ride-eq-halters', 'ride-eq-ropes', 'ride-eq-lunge', 'ride-eq-blankets']),
  (SELECT id FROM categories WHERE slug = 'riding-equipment'),
  unnest(ARRAY['Камшици', 'Шпори', 'Оглавници', 'Поводи', 'Корда', 'Дерби']),
  '🐴'
ON CONFLICT (slug) DO NOTHING;

-- Riding Helmets L3 (parent: riding-helmets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['English Helmets', 'Western Helmets', 'Kids Riding Helmets', 'Skull Caps']),
  unnest(ARRAY['helmet-english', 'helmet-western', 'helmet-kids', 'helmet-skull']),
  (SELECT id FROM categories WHERE slug = 'riding-helmets'),
  unnest(ARRAY['Английски каски', 'Уестърн каски', 'Детски каски', 'Skull Caps']),
  '🪖'
ON CONFLICT (slug) DO NOTHING;

-- Riding Boots L3 (parent: riding-boots)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Tall Boots', 'Paddock Boots', 'Western Boots', 'Jodhpur Boots', 'Kids Riding Boots']),
  unnest(ARRAY['boot-tall', 'boot-paddock', 'boot-western', 'boot-jodhpur', 'boot-kids']),
  (SELECT id FROM categories WHERE slug = 'riding-boots'),
  unnest(ARRAY['Високи ботуши', 'Paddock ботуши', 'Уестърн ботуши', 'Jodhpur ботуши', 'Детски ботуши']),
  '👢'
ON CONFLICT (slug) DO NOTHING;

-- Rider Clothing L3 (parent: rider-clothing)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Breeches', 'Show Jackets', 'Show Shirts', 'Body Protectors', 'Gloves', 'Competition Wear']),
  unnest(ARRAY['rider-breeches', 'rider-jackets', 'rider-shirts', 'rider-protection', 'rider-gloves', 'rider-competition']),
  (SELECT id FROM categories WHERE slug = 'rider-clothing'),
  unnest(ARRAY['Бричове', 'Якета за състезания', 'Ризи', 'Протектори', 'Ръкавици', 'Състезателно облекло']),
  '👔'
ON CONFLICT (slug) DO NOTHING;

-- Horse Care L3 (parent: horse-care)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Horse Feed', 'Horse Supplements', 'First Aid', 'Wound Care', 'Fly Control']),
  unnest(ARRAY['horse-feed', 'horse-supplements', 'horse-first-aid', 'horse-wound', 'horse-fly']),
  (SELECT id FROM categories WHERE slug = 'horse-care'),
  unnest(ARRAY['Фураж', 'Добавки', 'Първа помощ', 'Грижа за рани', 'Срещу мухи']),
  '🐴'
ON CONFLICT (slug) DO NOTHING;

-- Horse Grooming L3 (parent: horse-grooming)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Brushes', 'Combs', 'Hoof Care', 'Shampoos', 'Clippers', 'Grooming Kits']),
  unnest(ARRAY['groom-brushes', 'groom-combs', 'groom-hoof', 'groom-shampoo', 'groom-clippers', 'groom-kits']),
  (SELECT id FROM categories WHERE slug = 'horse-grooming'),
  unnest(ARRAY['Четки', 'Гребени', 'Грижа за копита', 'Шампоани', 'Машинки', 'Комплекти']),
  '🧹'
ON CONFLICT (slug) DO NOTHING;

-- Golf Accessories L3 (parent: golf-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Golf Tees', 'Golf Balls', 'Golf Towels', 'Divot Tools', 'Ball Markers', 'Rangefinders', 'Golf Umbrellas']),
  unnest(ARRAY['golf-tees', 'golf-balls', 'golf-towels', 'golf-divot', 'golf-markers', 'golf-rangefinders', 'golf-umbrellas']),
  (SELECT id FROM categories WHERE slug = 'golf-accessories'),
  unnest(ARRAY['Пегчета', 'Топки', 'Кърпи', 'Инструменти дивот', 'Маркери', 'Далекомери', 'Чадъри']),
  '⛳'
ON CONFLICT (slug) DO NOTHING;

-- Golf Apparel L3 (parent: golf-apparel)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Golf Shirts', 'Golf Pants', 'Golf Shorts', 'Golf Jackets', 'Golf Hats']),
  unnest(ARRAY['golf-shirts', 'golf-pants', 'golf-shorts', 'golf-jackets', 'golf-hats']),
  (SELECT id FROM categories WHERE slug = 'golf-apparel'),
  unnest(ARRAY['Поло блузи', 'Панталони', 'Къси панталони', 'Якета', 'Шапки']),
  '👕'
ON CONFLICT (slug) DO NOTHING;

-- Golf Carts L3 (parent: golf-carts)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Electric Golf Carts', 'Gas Golf Carts', 'Push Carts', 'Cart Accessories']),
  unnest(ARRAY['cart-electric', 'cart-gas', 'cart-push', 'cart-accessories']),
  (SELECT id FROM categories WHERE slug = 'golf-carts'),
  unnest(ARRAY['Електрически', 'Бензинови', 'Ръчни', 'Аксесоари']),
  '🏌️'
ON CONFLICT (slug) DO NOTHING;

-- Golf Gloves L3 (parent: golf-gloves)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Men Golf Gloves', 'Women Golf Gloves', 'Rain Gloves', 'Winter Gloves']),
  unnest(ARRAY['glove-men', 'glove-women', 'glove-rain', 'glove-winter']),
  (SELECT id FROM categories WHERE slug = 'golf-gloves'),
  unnest(ARRAY['Мъжки', 'Дамски', 'За дъжд', 'Зимни']),
  '🧤'
ON CONFLICT (slug) DO NOTHING;

-- Golf Shoes L3 (parent: golf-shoes)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Spiked Golf Shoes', 'Spikeless Golf Shoes', 'Golf Sandals', 'Golf Boots']),
  unnest(ARRAY['shoe-spiked', 'shoe-spikeless', 'shoe-sandals', 'shoe-boots']),
  (SELECT id FROM categories WHERE slug = 'golf-shoes'),
  unnest(ARRAY['С шипове', 'Без шипове', 'Сандали', 'Боти']),
  '👟'
ON CONFLICT (slug) DO NOTHING;
;
