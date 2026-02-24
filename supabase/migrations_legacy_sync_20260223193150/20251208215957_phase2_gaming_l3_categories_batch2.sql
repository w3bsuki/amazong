-- Phase 2.2: Gaming L3 Categories - Batch 2: Console Gaming
-- Target: Add L3 children to Console Gaming L2 categories

-- =====================================================
-- PLAYSTATION L3 CATEGORIES
-- =====================================================

-- PlayStation 5 (console-ps5)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['PS5 Console Standard', 'PS5 Console Digital', 'PS5 Pro', 'PS5 Bundles', 'PS5 Limited Editions', 'PS5 Refurbished']),
  unnest(ARRAY['ps5-standard', 'ps5-digital', 'ps5-pro', 'ps5-bundles', 'ps5-limited', 'ps5-refurbished']),
  (SELECT id FROM categories WHERE slug = 'console-ps5'),
  unnest(ARRAY['PS5 стандартна', 'PS5 дигитална', 'PS5 Pro', 'PS5 пакети', 'PS5 лимитирани', 'PS5 ремонтирани']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- PlayStation 4 (console-ps4)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['PS4 Pro', 'PS4 Slim', 'PS4 Standard', 'PS4 Bundles', 'PS4 Refurbished']),
  unnest(ARRAY['ps4-pro', 'ps4-slim', 'ps4-standard', 'ps4-bundles', 'ps4-refurbished']),
  (SELECT id FROM categories WHERE slug = 'console-ps4'),
  unnest(ARRAY['PS4 Pro', 'PS4 Slim', 'PS4 стандартна', 'PS4 пакети', 'PS4 ремонтирани']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- PlayStation main (playstation)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['PS5 Consoles', 'PS4 Consoles', 'PlayStation Games', 'PlayStation Controllers', 'PlayStation Accessories', 'PlayStation VR']),
  unnest(ARRAY['playstation-ps5', 'playstation-ps4', 'playstation-games', 'playstation-ctrl', 'playstation-acc', 'playstation-vr']),
  (SELECT id FROM categories WHERE slug = 'playstation'),
  unnest(ARRAY['PS5 конзоли', 'PS4 конзоли', 'PlayStation игри', 'PlayStation контролери', 'PlayStation аксесоари', 'PlayStation VR']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- PlayStation Controllers (playstation-controllers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['DualSense Controllers', 'DualShock 4 Controllers', 'Scuf Controllers', 'Third-Party Controllers', 'Controller Accessories']),
  unnest(ARRAY['ps-ctrl-dualsense', 'ps-ctrl-dualshock4', 'ps-ctrl-scuf', 'ps-ctrl-thirdparty', 'ps-ctrl-accessories']),
  (SELECT id FROM categories WHERE slug = 'playstation-controllers'),
  unnest(ARRAY['DualSense контролери', 'DualShock 4 контролери', 'Scuf контролери', 'Други контролери', 'Аксесоари за контролери']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- PS5 Games (gaming-ps5-games)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Action Games', 'RPG Games', 'Sports Games', 'Racing Games', 'Adventure Games', 'Exclusives', 'Multiplayer Games', 'VR Games']),
  unnest(ARRAY['ps5-game-action', 'ps5-game-rpg', 'ps5-game-sports', 'ps5-game-racing', 'ps5-game-adventure', 'ps5-game-exclusives', 'ps5-game-multiplayer', 'ps5-game-vr']),
  (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'),
  unnest(ARRAY['Екшън игри', 'RPG игри', 'Спортни игри', 'Състезателни игри', 'Приключенски игри', 'Ексклузивни', 'Мултиплейър игри', 'VR игри']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- PS4 Games (gaming-ps4-games)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Action Games', 'RPG Games', 'Sports Games', 'Racing Games', 'Adventure Games', 'Exclusives', 'Multiplayer Games']),
  unnest(ARRAY['ps4-game-action', 'ps4-game-rpg', 'ps4-game-sports', 'ps4-game-racing', 'ps4-game-adventure', 'ps4-game-exclusives', 'ps4-game-multiplayer']),
  (SELECT id FROM categories WHERE slug = 'gaming-ps4-games'),
  unnest(ARRAY['Екшън игри', 'RPG игри', 'Спортни игри', 'Състезателни игри', 'Приключенски игри', 'Ексклузивни', 'Мултиплейър игри']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- PS5 Accessories (gaming-ps5-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Controllers', 'Charging Stations', 'Headsets', 'Remote Controls', 'Camera', 'Console Skins', 'Stands', 'Cables']),
  unnest(ARRAY['ps5-acc-controllers', 'ps5-acc-charging', 'ps5-acc-headsets', 'ps5-acc-remote', 'ps5-acc-camera', 'ps5-acc-skins', 'ps5-acc-stands', 'ps5-acc-cables']),
  (SELECT id FROM categories WHERE slug = 'gaming-ps5-accessories'),
  unnest(ARRAY['Контролери', 'Зарядни станции', 'Слушалки', 'Дистанционни', 'Камера', 'Скинове', 'Стойки', 'Кабели']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- XBOX L3 CATEGORIES
-- =====================================================

-- Xbox Series X|S (console-xbox-series)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Xbox Series X', 'Xbox Series S', 'Xbox Series X Bundles', 'Xbox Series S Bundles', 'Limited Editions', 'Refurbished']),
  unnest(ARRAY['xbox-series-x', 'xbox-series-s', 'xbox-series-x-bundles', 'xbox-series-s-bundles', 'xbox-series-limited', 'xbox-series-refurbished']),
  (SELECT id FROM categories WHERE slug = 'console-xbox-series'),
  unnest(ARRAY['Xbox Series X', 'Xbox Series S', 'Xbox Series X пакети', 'Xbox Series S пакети', 'Лимитирани издания', 'Ремонтирани']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Xbox One (console-xbox-one)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Xbox One X', 'Xbox One S', 'Xbox One Standard', 'Xbox One Bundles', 'Xbox One Refurbished']),
  unnest(ARRAY['xbox-one-x', 'xbox-one-s', 'xbox-one-standard', 'xbox-one-bundles', 'xbox-one-refurbished']),
  (SELECT id FROM categories WHERE slug = 'console-xbox-one'),
  unnest(ARRAY['Xbox One X', 'Xbox One S', 'Xbox One стандартна', 'Xbox One пакети', 'Xbox One ремонтирани']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Xbox main (xbox)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Xbox Series Consoles', 'Xbox One Consoles', 'Xbox Games', 'Xbox Controllers', 'Xbox Accessories', 'Xbox Game Pass']),
  unnest(ARRAY['xbox-series-consoles', 'xbox-one-consoles', 'xbox-games', 'xbox-controllers', 'xbox-accessories', 'xbox-gamepass']),
  (SELECT id FROM categories WHERE slug = 'xbox'),
  unnest(ARRAY['Xbox Series конзоли', 'Xbox One конзоли', 'Xbox игри', 'Xbox контролери', 'Xbox аксесоари', 'Xbox Game Pass']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Xbox Accessories (gaming-xbox-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Controllers', 'Headsets', 'Charging Docks', 'Play & Charge Kits', 'Console Skins', 'Stands', 'Remote Controls', 'Storage']),
  unnest(ARRAY['xbox-acc-controllers', 'xbox-acc-headsets', 'xbox-acc-charging', 'xbox-acc-playcharge', 'xbox-acc-skins', 'xbox-acc-stands', 'xbox-acc-remote', 'xbox-acc-storage']),
  (SELECT id FROM categories WHERE slug = 'gaming-xbox-accessories'),
  unnest(ARRAY['Контролери', 'Слушалки', 'Зарядни докове', 'Play & Charge комплекти', 'Скинове', 'Стойки', 'Дистанционни', 'Съхранение']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Xbox Series X Games (gaming-xbox-series-games)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Action Games', 'RPG Games', 'Sports Games', 'Racing Games', 'Shooter Games', 'Exclusives', 'Multiplayer Games']),
  unnest(ARRAY['xbxs-game-action', 'xbxs-game-rpg', 'xbxs-game-sports', 'xbxs-game-racing', 'xbxs-game-shooter', 'xbxs-game-exclusives', 'xbxs-game-multiplayer']),
  (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'),
  unnest(ARRAY['Екшън игри', 'RPG игри', 'Спортни игри', 'Състезателни игри', 'Шутъри', 'Ексклузивни', 'Мултиплейър игри']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- NINTENDO L3 CATEGORIES
-- =====================================================

-- Nintendo Switch (console-switch)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Switch OLED', 'Switch Standard', 'Switch Lite', 'Switch Bundles', 'Special Editions', 'Refurbished']),
  unnest(ARRAY['switch-oled', 'switch-standard', 'switch-lite', 'switch-bundles', 'switch-special', 'switch-refurbished']),
  (SELECT id FROM categories WHERE slug = 'console-switch'),
  unnest(ARRAY['Switch OLED', 'Switch стандартна', 'Switch Lite', 'Switch пакети', 'Специални издания', 'Ремонтирани']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Nintendo 3DS (console-3ds)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['New 3DS XL', '3DS XL', '3DS Standard', '2DS', '2DS XL', '3DS Games', '3DS Accessories']),
  unnest(ARRAY['3ds-new-xl', '3ds-xl', '3ds-standard', '3ds-2ds', '3ds-2dsxl', '3ds-games', '3ds-accessories']),
  (SELECT id FROM categories WHERE slug = 'console-3ds'),
  unnest(ARRAY['New 3DS XL', '3DS XL', '3DS стандартна', '2DS', '2DS XL', '3DS игри', '3DS аксесоари']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Nintendo main (nintendo)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Switch Consoles', 'Switch Games', 'Switch Accessories', '3DS Consoles', '3DS Games', 'Retro Nintendo']),
  unnest(ARRAY['nintendo-switch', 'nintendo-switch-games', 'nintendo-switch-acc', 'nintendo-3ds', 'nintendo-3ds-games', 'nintendo-retro']),
  (SELECT id FROM categories WHERE slug = 'nintendo'),
  unnest(ARRAY['Switch конзоли', 'Switch игри', 'Switch аксесоари', '3DS конзоли', '3DS игри', 'Ретро Nintendo']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Nintendo Switch Games (gaming-switch-games)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Action Games', 'RPG Games', 'Party Games', 'Sports Games', 'Racing Games', 'First-Party Games', 'Family Games', 'Indie Games']),
  unnest(ARRAY['switch-game-action', 'switch-game-rpg', 'switch-game-party', 'switch-game-sports', 'switch-game-racing', 'switch-game-firstparty', 'switch-game-family', 'switch-game-indie']),
  (SELECT id FROM categories WHERE slug = 'gaming-switch-games'),
  unnest(ARRAY['Екшън игри', 'RPG игри', 'Парти игри', 'Спортни игри', 'Състезателни игри', 'Nintendo игри', 'Семейни игри', 'Инди игри']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Switch Accessories (gaming-switch-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Joy-Cons', 'Pro Controllers', 'Cases', 'Screen Protectors', 'Docks', 'Grips', 'Chargers', 'Memory Cards']),
  unnest(ARRAY['switch-acc-joycons', 'switch-acc-procontroller', 'switch-acc-cases', 'switch-acc-screenprotector', 'switch-acc-docks', 'switch-acc-grips', 'switch-acc-chargers', 'switch-acc-memory']),
  (SELECT id FROM categories WHERE slug = 'gaming-switch-accessories'),
  unnest(ARRAY['Joy-Con контролери', 'Pro контролери', 'Калъфи', 'Протектори за екран', 'Докове', 'Грипове', 'Зарядни', 'Карти памет']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Nintendo Controllers (nintendo-controllers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Joy-Con Pairs', 'Single Joy-Cons', 'Pro Controllers', 'GameCube Controllers', 'Third-Party Controllers', 'Controller Accessories']),
  unnest(ARRAY['nintendo-ctrl-joycon-pair', 'nintendo-ctrl-joycon-single', 'nintendo-ctrl-pro', 'nintendo-ctrl-gamecube', 'nintendo-ctrl-thirdparty', 'nintendo-ctrl-accessories']),
  (SELECT id FROM categories WHERE slug = 'nintendo-controllers'),
  unnest(ARRAY['Joy-Con двойки', 'Joy-Con единични', 'Pro контролери', 'GameCube контролери', 'Други контролери', 'Аксесоари']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;;
