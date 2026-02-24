-- Add L4 categories under Gaming L3s (PS5 Games, Xbox Games, Switch Games, PC Games)

-- PS5 Games L4s (under gaming-ps5-games)
INSERT INTO categories (name, name_bg, slug, parent_id, icon) VALUES
('PS5 Action Games', 'PS5 Екшън игри', 'ps5-action-games', (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'), '🎮'),
('PS5 RPG Games', 'PS5 RPG игри', 'ps5-rpg-games', (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'), '⚔️'),
('PS5 Sports Games', 'PS5 Спортни игри', 'ps5-sports-games', (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'), '⚽'),
('PS5 Racing Games', 'PS5 Състезателни игри', 'ps5-racing-games', (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'), '🏎️'),
('PS5 Shooter Games', 'PS5 Шутър игри', 'ps5-shooter-games', (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'), '🔫'),
('PS5 Horror Games', 'PS5 Хорър игри', 'ps5-horror-games', (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'), '👻'),
('PS5 Adventure Games', 'PS5 Приключенски игри', 'ps5-adventure-games', (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'), '🗺️'),
('PS5 Fighting Games', 'PS5 Бойни игри', 'ps5-fighting-games', (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'), '🥊'),
('PS5 Exclusives', 'PS5 Ексклузивни', 'ps5-exclusives', (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'), '⭐'),
('PS5 Bundle Deals', 'PS5 Пакети', 'ps5-bundle-deals', (SELECT id FROM categories WHERE slug = 'gaming-ps5-games'), '📦')
ON CONFLICT (slug) DO NOTHING;

-- Xbox Series X Games L4s (under gaming-xbox-series-games)
INSERT INTO categories (name, name_bg, slug, parent_id, icon) VALUES
('Xbox Action Games', 'Xbox Екшън игри', 'xbox-action-games', (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'), '🎮'),
('Xbox RPG Games', 'Xbox RPG игри', 'xbox-rpg-games', (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'), '⚔️'),
('Xbox Sports Games', 'Xbox Спортни игри', 'xbox-sports-games', (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'), '⚽'),
('Xbox Racing Games', 'Xbox Състезателни игри', 'xbox-racing-games', (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'), '🏎️'),
('Xbox Shooter Games', 'Xbox Шутър игри', 'xbox-shooter-games', (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'), '🔫'),
('Xbox Game Pass Titles', 'Xbox Game Pass игри', 'xbox-game-pass-titles', (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'), '🎁'),
('Xbox Exclusives', 'Xbox Ексклузивни', 'xbox-exclusives', (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'), '⭐'),
('Xbox Fighting Games', 'Xbox Бойни игри', 'xbox-fighting-games', (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'), '🥊'),
('Xbox Adventure Games', 'Xbox Приключенски игри', 'xbox-adventure-games', (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'), '🗺️'),
('Xbox Bundle Deals', 'Xbox Пакети', 'xbox-bundle-deals', (SELECT id FROM categories WHERE slug = 'gaming-xbox-series-games'), '📦')
ON CONFLICT (slug) DO NOTHING;

-- Switch Games L4s (under gaming-switch-games)
INSERT INTO categories (name, name_bg, slug, parent_id, icon) VALUES
('Switch Action Games', 'Switch Екшън игри', 'switch-action-games', (SELECT id FROM categories WHERE slug = 'gaming-switch-games'), '🎮'),
('Switch RPG Games', 'Switch RPG игри', 'switch-rpg-games', (SELECT id FROM categories WHERE slug = 'gaming-switch-games'), '⚔️'),
('Switch Party Games', 'Switch Парти игри', 'switch-party-games', (SELECT id FROM categories WHERE slug = 'gaming-switch-games'), '🎉'),
('Switch Racing Games', 'Switch Състезателни игри', 'switch-racing-games', (SELECT id FROM categories WHERE slug = 'gaming-switch-games'), '🏎️'),
('Switch Platformers', 'Switch Платформъри', 'switch-platformers', (SELECT id FROM categories WHERE slug = 'gaming-switch-games'), '🍄'),
('Nintendo Exclusives', 'Nintendo Ексклузивни', 'nintendo-exclusives', (SELECT id FROM categories WHERE slug = 'gaming-switch-games'), '⭐'),
('Switch Indie Games', 'Switch Инди игри', 'switch-indie-games', (SELECT id FROM categories WHERE slug = 'gaming-switch-games'), '🎯'),
('Switch Family Games', 'Switch Семейни игри', 'switch-family-games', (SELECT id FROM categories WHERE slug = 'gaming-switch-games'), '👨‍👩‍👧‍👦'),
('Switch Sports Games', 'Switch Спортни игри', 'switch-sports-games', (SELECT id FROM categories WHERE slug = 'gaming-switch-games'), '⚽'),
('Switch Fighting Games', 'Switch Бойни игри', 'switch-fighting-games', (SELECT id FROM categories WHERE slug = 'gaming-switch-games'), '🥊')
ON CONFLICT (slug) DO NOTHING;

-- PC Games L4s (under pc-games-cat)
INSERT INTO categories (name, name_bg, slug, parent_id, icon) VALUES
('PC Action Games', 'PC Екшън игри', 'pcgame-action', (SELECT id FROM categories WHERE slug = 'pc-games-cat'), '🎮'),
('PC RPG Games', 'PC RPG игри', 'pcgame-rpg', (SELECT id FROM categories WHERE slug = 'pc-games-cat'), '⚔️'),
('PC Strategy Games', 'PC Стратегии', 'pcgame-strategy', (SELECT id FROM categories WHERE slug = 'pc-games-cat'), '♟️'),
('PC FPS Games', 'PC FPS игри', 'pcgame-fps', (SELECT id FROM categories WHERE slug = 'pc-games-cat'), '🔫'),
('PC MMO Games', 'PC MMO игри', 'pcgame-mmo', (SELECT id FROM categories WHERE slug = 'pc-games-cat'), '🌍'),
('PC Simulation Games', 'PC Симулации', 'pcgame-simulation', (SELECT id FROM categories WHERE slug = 'pc-games-cat'), '🚜'),
('PC Racing Games', 'PC Състезателни игри', 'pcgame-racing', (SELECT id FROM categories WHERE slug = 'pc-games-cat'), '🏎️'),
('PC Horror Games', 'PC Хорър игри', 'pcgame-horror', (SELECT id FROM categories WHERE slug = 'pc-games-cat'), '👻'),
('PC Indie Games', 'PC Инди игри', 'pcgame-indie', (SELECT id FROM categories WHERE slug = 'pc-games-cat'), '🎯'),
('PC VR Games', 'PC VR игри', 'pcgame-vr', (SELECT id FROM categories WHERE slug = 'pc-games-cat'), '🥽')
ON CONFLICT (slug) DO NOTHING;

-- Console Hardware L4s (PS5, Xbox, Switch variants)
INSERT INTO categories (name, name_bg, slug, parent_id, icon) VALUES
-- PS5 Consoles
('PS5 Standard Edition', 'PS5 Стандартно издание', 'ps5-standard', (SELECT id FROM categories WHERE slug = 'console-ps5'), '🎮'),
('PS5 Digital Edition', 'PS5 Дигитално издание', 'ps5-digital', (SELECT id FROM categories WHERE slug = 'console-ps5'), '💿'),
('PS5 Slim', 'PS5 Slim', 'ps5-slim', (SELECT id FROM categories WHERE slug = 'console-ps5'), '📱'),
('PS5 Pro', 'PS5 Pro', 'ps5-pro', (SELECT id FROM categories WHERE slug = 'console-ps5'), '⚡'),
('PS5 Limited Editions', 'PS5 Лимитирани издания', 'ps5-limited', (SELECT id FROM categories WHERE slug = 'console-ps5'), '🌟'),
-- Xbox Consoles
('Xbox Series X', 'Xbox Series X', 'xbox-series-x', (SELECT id FROM categories WHERE slug = 'console-xbox-series'), '🎮'),
('Xbox Series S', 'Xbox Series S', 'xbox-series-s', (SELECT id FROM categories WHERE slug = 'console-xbox-series'), '📦'),
('Xbox Series S 1TB', 'Xbox Series S 1TB', 'xbox-series-s-1tb', (SELECT id FROM categories WHERE slug = 'console-xbox-series'), '💾'),
('Xbox Limited Editions', 'Xbox Лимитирани издания', 'xbox-limited', (SELECT id FROM categories WHERE slug = 'console-xbox-series'), '🌟'),
-- Nintendo Consoles
('Switch OLED Model', 'Switch OLED модел', 'switch-oled', (SELECT id FROM categories WHERE slug = 'console-switch'), '📺'),
('Switch Standard', 'Switch Стандартен', 'switch-standard', (SELECT id FROM categories WHERE slug = 'console-switch'), '🎮'),
('Switch Lite', 'Switch Lite', 'switch-lite', (SELECT id FROM categories WHERE slug = 'console-switch'), '📱'),
('Switch Special Editions', 'Switch Специални издания', 'switch-special', (SELECT id FROM categories WHERE slug = 'console-switch'), '🌟')
ON CONFLICT (slug) DO NOTHING;;
