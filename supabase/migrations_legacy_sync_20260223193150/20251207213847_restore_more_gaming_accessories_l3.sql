-- Restore more Gaming L3 categories

-- Gaming Consoles L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('PlayStation 5', 'consoles-ps5', 'PlayStation 5', 1),
  ('PlayStation 4', 'consoles-ps4', 'PlayStation 4', 2),
  ('Xbox Series X', 'consoles-xbox-x', 'Xbox Series X', 3),
  ('Xbox Series S', 'consoles-xbox-s', 'Xbox Series S', 4),
  ('Nintendo Switch', 'consoles-switch', 'Nintendo Switch', 5),
  ('Nintendo Switch OLED', 'consoles-switch-oled', 'Nintendo Switch OLED', 6),
  ('Steam Deck', 'consoles-steam-deck', 'Steam Deck', 7),
  ('Retro Consoles', 'consoles-retro', 'Ретро конзоли', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'gaming-consoles'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Controllers L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('PlayStation Controllers', 'controllers-ps', 'PlayStation контролери', 1),
  ('Xbox Controllers', 'controllers-xbox', 'Xbox контролери', 2),
  ('Nintendo Controllers', 'controllers-nintendo', 'Nintendo контролери', 3),
  ('PC Controllers', 'controllers-pc', 'PC контролери', 4),
  ('Pro Controllers', 'controllers-pro', 'Pro контролери', 5),
  ('Fight Sticks', 'controllers-fight-sticks', 'Файт стикове', 6),
  ('Racing Wheels', 'controllers-wheels', 'Волани', 7),
  ('Flight Sticks', 'controllers-flight', 'Джойстици за самолети', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'gaming-controllers'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Headsets L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('PlayStation Headsets', 'headsets-ps', 'PlayStation слушалки', 1),
  ('Xbox Headsets', 'headsets-xbox', 'Xbox слушалки', 2),
  ('PC Gaming Headsets', 'headsets-pc', 'PC гейминг слушалки', 3),
  ('Wireless Gaming Headsets', 'headsets-wireless', 'Безжични гейминг слушалки', 4),
  ('7.1 Surround Headsets', 'headsets-surround', '7.1 съраунд слушалки', 5),
  ('Budget Gaming Headsets', 'headsets-budget', 'Бюджетни гейминг слушалки', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'gaming-headsets'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Chairs & Desks L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Racing Style Chairs', 'gaming-chair-racing', 'Рейсинг столове', 1),
  ('Ergonomic Gaming Chairs', 'gaming-chair-ergonomic', 'Ергономични гейминг столове', 2),
  ('Rocker Gaming Chairs', 'gaming-chair-rocker', 'Люлеещи се гейминг столове', 3),
  ('Gaming Desks', 'gaming-desks', 'Гейминг бюра', 4),
  ('L-Shaped Gaming Desks', 'gaming-desk-l-shaped', 'L-образни гейминг бюра', 5),
  ('Standing Gaming Desks', 'gaming-desk-standing', 'Стоящи гейминг бюра', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'gaming-furniture'
ON CONFLICT (slug) DO NOTHING;

-- PC Games by Genre L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Action Games', 'pc-games-action', 'Екшън игри', 1),
  ('RPG Games', 'pc-games-rpg', 'RPG игри', 2),
  ('FPS Games', 'pc-games-fps', 'FPS игри', 3),
  ('Strategy Games', 'pc-games-strategy', 'Стратегии', 4),
  ('Sports Games', 'pc-games-sports', 'Спортни игри', 5),
  ('Racing Games', 'pc-games-racing', 'Рейсинг игри', 6),
  ('Simulation Games', 'pc-games-simulation', 'Симулатори', 7),
  ('Adventure Games', 'pc-games-adventure', 'Приключенски игри', 8),
  ('Indie Games', 'pc-games-indie', 'Инди игри', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'gaming-pc-games'
ON CONFLICT (slug) DO NOTHING;

-- PlayStation Games L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('PS5 Action', 'ps5-games-action', 'PS5 екшън', 1),
  ('PS5 RPG', 'ps5-games-rpg', 'PS5 RPG', 2),
  ('PS5 Sports', 'ps5-games-sports', 'PS5 спортни', 3),
  ('PS5 Racing', 'ps5-games-racing', 'PS5 рейсинг', 4),
  ('PS5 Exclusives', 'ps5-games-exclusive', 'PS5 ексклузиви', 5),
  ('PS4 Games', 'ps4-games', 'PS4 игри', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'gaming-playstation'
ON CONFLICT (slug) DO NOTHING;

-- Xbox Games L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Xbox Series X Games', 'xbox-games-series-x', 'Xbox Series X игри', 1),
  ('Xbox One Games', 'xbox-games-one', 'Xbox One игри', 2),
  ('Xbox Game Pass', 'xbox-game-pass', 'Xbox Game Pass', 3),
  ('Xbox Exclusives', 'xbox-exclusives', 'Xbox ексклузиви', 4)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'gaming-xbox'
ON CONFLICT (slug) DO NOTHING;

-- Nintendo Games L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Nintendo Switch Games', 'nintendo-switch-games', 'Nintendo Switch игри', 1),
  ('Mario Games', 'nintendo-mario', 'Mario игри', 2),
  ('Zelda Games', 'nintendo-zelda', 'Zelda игри', 3),
  ('Pokemon Games', 'nintendo-pokemon', 'Pokemon игри', 4),
  ('Nintendo Exclusives', 'nintendo-exclusives', 'Nintendo ексклузиви', 5),
  ('3DS Games', 'nintendo-3ds', '3DS игри', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'gaming-nintendo'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Accessories L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Gaming Mouse Pads', 'gaming-acc-mousepads', 'Гейминг подложки', 1),
  ('Controller Chargers', 'gaming-acc-chargers', 'Зарядни за контролери', 2),
  ('Console Stands', 'gaming-acc-stands', 'Стойки за конзоли', 3),
  ('Gaming Capture Cards', 'gaming-acc-capture', 'Кепчър карти', 4),
  ('Gaming Cables', 'gaming-acc-cables', 'Гейминг кабели', 5),
  ('Console Skins', 'gaming-acc-skins', 'Скинове за конзоли', 6),
  ('Controller Grips', 'gaming-acc-grips', 'Грипове за контролери', 7),
  ('Gaming LED Lights', 'gaming-acc-lights', 'Гейминг LED осветление', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'gaming-accessories'
ON CONFLICT (slug) DO NOTHING;;
