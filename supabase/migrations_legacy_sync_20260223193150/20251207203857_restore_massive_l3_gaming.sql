
-- MASSIVE L3 RESTORATION - GAMING
-- PC Gaming L3
INSERT INTO categories (id, name, slug, parent_id, icon, display_order) VALUES
(gen_random_uuid(), 'Gaming Keyboards', 'pc-gaming-keyboards', (SELECT id FROM categories WHERE slug = 'pc-gaming-main'), '⌨️', 1),
(gen_random_uuid(), 'Gaming Mice', 'pc-gaming-mice', (SELECT id FROM categories WHERE slug = 'pc-gaming-main'), '🖱️', 2),
(gen_random_uuid(), 'Gaming Headsets', 'pc-gaming-headsets', (SELECT id FROM categories WHERE slug = 'pc-gaming-main'), '🎧', 3),
(gen_random_uuid(), 'Gaming Mousepads', 'pc-gaming-mousepads', (SELECT id FROM categories WHERE slug = 'pc-gaming-main'), '🎯', 4),
(gen_random_uuid(), 'PC Controllers', 'pc-gaming-controllers', (SELECT id FROM categories WHERE slug = 'pc-gaming-main'), '🎮', 5),
(gen_random_uuid(), 'Gaming Monitors', 'pc-gaming-monitors-cat', (SELECT id FROM categories WHERE slug = 'pc-gaming-main'), '🖥️', 6),
(gen_random_uuid(), 'Gaming PCs', 'pc-gaming-computers', (SELECT id FROM categories WHERE slug = 'pc-gaming-main'), '💻', 7),
-- PlayStation L3
(gen_random_uuid(), 'PS5 Consoles', 'ps5-consoles', (SELECT id FROM categories WHERE slug = 'console-playstation-cat'), '🎮', 1),
(gen_random_uuid(), 'PS5 Games', 'ps5-games', (SELECT id FROM categories WHERE slug = 'console-playstation-cat'), '🎮', 2),
(gen_random_uuid(), 'PS5 Controllers', 'ps5-controllers', (SELECT id FROM categories WHERE slug = 'console-playstation-cat'), '🎮', 3),
(gen_random_uuid(), 'PS5 Accessories', 'ps5-accessories', (SELECT id FROM categories WHERE slug = 'console-playstation-cat'), '🎮', 4),
(gen_random_uuid(), 'PS4 Consoles', 'ps4-consoles', (SELECT id FROM categories WHERE slug = 'console-playstation-cat'), '🎮', 5),
(gen_random_uuid(), 'PS4 Games', 'ps4-games', (SELECT id FROM categories WHERE slug = 'console-playstation-cat'), '🎮', 6),
(gen_random_uuid(), 'PlayStation VR2', 'psvr2', (SELECT id FROM categories WHERE slug = 'console-playstation-cat'), '🥽', 7),
-- Xbox L3
(gen_random_uuid(), 'Xbox Series X', 'xbox-series-x', (SELECT id FROM categories WHERE slug = 'console-xbox-cat'), '🎮', 1),
(gen_random_uuid(), 'Xbox Series S', 'xbox-series-s', (SELECT id FROM categories WHERE slug = 'console-xbox-cat'), '🎮', 2),
(gen_random_uuid(), 'Xbox Games', 'xbox-games', (SELECT id FROM categories WHERE slug = 'console-xbox-cat'), '🎮', 3),
(gen_random_uuid(), 'Xbox Controllers', 'xbox-controllers', (SELECT id FROM categories WHERE slug = 'console-xbox-cat'), '🎮', 4),
(gen_random_uuid(), 'Xbox Accessories', 'xbox-accessories', (SELECT id FROM categories WHERE slug = 'console-xbox-cat'), '🎮', 5),
(gen_random_uuid(), 'Xbox Elite Controllers', 'xbox-elite-controllers', (SELECT id FROM categories WHERE slug = 'console-xbox-cat'), '🎮', 6),
-- Nintendo L3
(gen_random_uuid(), 'Nintendo Switch OLED', 'switch-oled', (SELECT id FROM categories WHERE slug = 'console-nintendo-cat'), '🎮', 1),
(gen_random_uuid(), 'Nintendo Switch', 'switch-standard', (SELECT id FROM categories WHERE slug = 'console-nintendo-cat'), '🎮', 2),
(gen_random_uuid(), 'Nintendo Switch Lite', 'switch-lite', (SELECT id FROM categories WHERE slug = 'console-nintendo-cat'), '🎮', 3),
(gen_random_uuid(), 'Switch Games', 'switch-games', (SELECT id FROM categories WHERE slug = 'console-nintendo-cat'), '🎮', 4),
(gen_random_uuid(), 'Switch Controllers', 'switch-controllers', (SELECT id FROM categories WHERE slug = 'console-nintendo-cat'), '🎮', 5),
(gen_random_uuid(), 'Joy-Con Controllers', 'joycon-controllers', (SELECT id FROM categories WHERE slug = 'console-nintendo-cat'), '🎮', 6),
(gen_random_uuid(), 'Switch Accessories', 'switch-accessories', (SELECT id FROM categories WHERE slug = 'console-nintendo-cat'), '🎮', 7),
(gen_random_uuid(), 'Amiibo', 'amiibo-figures', (SELECT id FROM categories WHERE slug = 'console-nintendo-cat'), '🎮', 8),
-- Gaming Furniture L3
(gen_random_uuid(), 'Gaming Chairs', 'gaming-chairs-cat', (SELECT id FROM categories WHERE slug = 'gaming-furniture'), '🪑', 1),
(gen_random_uuid(), 'Gaming Desks', 'gaming-desks-cat', (SELECT id FROM categories WHERE slug = 'gaming-furniture'), '🖥️', 2),
(gen_random_uuid(), 'Gaming Room Setup', 'gaming-room-setup', (SELECT id FROM categories WHERE slug = 'gaming-furniture'), '🏠', 3),
-- VR Gaming L3
(gen_random_uuid(), 'VR Headsets', 'vr-headsets', (SELECT id FROM categories WHERE slug = 'vr-ar-gaming'), '🥽', 1),
(gen_random_uuid(), 'VR Accessories', 'vr-accessories', (SELECT id FROM categories WHERE slug = 'vr-ar-gaming'), '🥽', 2),
(gen_random_uuid(), 'VR Games', 'vr-games', (SELECT id FROM categories WHERE slug = 'vr-ar-gaming'), '🥽', 3),
(gen_random_uuid(), 'Meta Quest', 'vr-meta-quest', (SELECT id FROM categories WHERE slug = 'vr-ar-gaming'), '🥽', 4),
(gen_random_uuid(), 'Valve Index', 'vr-valve-index', (SELECT id FROM categories WHERE slug = 'vr-ar-gaming'), '🥽', 5)
ON CONFLICT (slug) DO NOTHING;
;
