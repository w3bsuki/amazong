
-- L3 for Gaming Consoles (with unique slugs)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'PlayStation 5', 'PlayStation 5', 'console-ps5', id, 1 FROM categories WHERE slug = 'consoles'
UNION ALL
SELECT 'Xbox Series X/S', 'Xbox Series X/S', 'console-xbox-series', id, 2 FROM categories WHERE slug = 'consoles'
UNION ALL
SELECT 'Nintendo Switch', 'Nintendo Switch', 'console-switch', id, 3 FROM categories WHERE slug = 'consoles'
UNION ALL
SELECT 'PlayStation 4', 'PlayStation 4', 'console-ps4', id, 4 FROM categories WHERE slug = 'consoles'
UNION ALL
SELECT 'Retro Consoles', 'Ретро конзоли', 'console-retro', id, 5 FROM categories WHERE slug = 'consoles';

-- L3 for Video Games - need to check if this exists
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'PS5 Games', 'PS5 игри', 'videogames-ps5', id, 1 FROM categories WHERE slug = 'video-games'
UNION ALL
SELECT 'Xbox Games', 'Xbox игри', 'videogames-xbox', id, 2 FROM categories WHERE slug = 'video-games'
UNION ALL
SELECT 'Switch Games', 'Switch игри', 'videogames-switch', id, 3 FROM categories WHERE slug = 'video-games'
UNION ALL
SELECT 'PC Games', 'PC игри', 'videogames-pc', id, 4 FROM categories WHERE slug = 'video-games';

-- L3 for Gaming Accessories
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Controllers', 'Контролери', 'acc-controllers', id, 1 FROM categories WHERE slug = 'gaming-accessories'
UNION ALL
SELECT 'Gaming Chairs', 'Геймърски столове', 'acc-gaming-chairs', id, 2 FROM categories WHERE slug = 'gaming-accessories'
UNION ALL
SELECT 'Gaming Desks', 'Геймърски бюра', 'acc-gaming-desks', id, 3 FROM categories WHERE slug = 'gaming-accessories'
UNION ALL
SELECT 'VR Accessories', 'VR аксесоари', 'acc-vr', id, 4 FROM categories WHERE slug = 'gaming-accessories'
UNION ALL
SELECT 'Console Stands', 'Стойки за конзоли', 'acc-console-stands', id, 5 FROM categories WHERE slug = 'gaming-accessories';
;
