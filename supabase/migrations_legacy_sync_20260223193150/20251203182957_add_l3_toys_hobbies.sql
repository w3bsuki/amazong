
-- L3 for Building Toys
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'LEGO', 'LEGO', 'building-lego', id, 1 FROM categories WHERE slug = 'building-toys'
UNION ALL
SELECT 'LEGO Technic', 'LEGO Technic', 'building-technic', id, 2 FROM categories WHERE slug = 'building-toys'
UNION ALL
SELECT 'Building Blocks', 'Конструктори', 'building-blocks', id, 3 FROM categories WHERE slug = 'building-toys'
UNION ALL
SELECT 'Model Kits', 'Модели за сглобяване', 'building-models', id, 4 FROM categories WHERE slug = 'building-toys'
UNION ALL
SELECT 'Magnetic Tiles', 'Магнитни плочки', 'building-magnetic', id, 5 FROM categories WHERE slug = 'building-toys';

-- L3 for Educational Toys
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'STEM Toys', 'STEM играчки', 'edu-stem', id, 1 FROM categories WHERE slug = 'educational-toys'
UNION ALL
SELECT 'Science Kits', 'Научни комплекти', 'edu-science', id, 2 FROM categories WHERE slug = 'educational-toys'
UNION ALL
SELECT 'Coding Toys', 'Играчки за програмиране', 'edu-coding', id, 3 FROM categories WHERE slug = 'educational-toys'
UNION ALL
SELECT 'Puzzles', 'Пъзели', 'edu-puzzles', id, 4 FROM categories WHERE slug = 'educational-toys'
UNION ALL
SELECT 'Learning Games', 'Образователни игри', 'edu-learning', id, 5 FROM categories WHERE slug = 'educational-toys';

-- L3 for RC Toys
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'RC Cars', 'RC коли', 'rc-cars', id, 1 FROM categories WHERE slug = 'rc-toys'
UNION ALL
SELECT 'RC Drones', 'RC дронове', 'rc-drones', id, 2 FROM categories WHERE slug = 'rc-toys'
UNION ALL
SELECT 'RC Helicopters', 'RC хеликоптери', 'rc-helicopters', id, 3 FROM categories WHERE slug = 'rc-toys'
UNION ALL
SELECT 'RC Boats', 'RC лодки', 'rc-boats', id, 4 FROM categories WHERE slug = 'rc-toys'
UNION ALL
SELECT 'RC Parts', 'RC части', 'rc-parts', id, 5 FROM categories WHERE slug = 'rc-toys';

-- L3 for Board Games
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Strategy Games', 'Стратегически игри', 'board-strategy', id, 1 FROM categories WHERE slug = 'board-games'
UNION ALL
SELECT 'Party Games', 'Парти игри', 'board-party', id, 2 FROM categories WHERE slug = 'board-games'
UNION ALL
SELECT 'Card Games', 'Карти игри', 'board-cards', id, 3 FROM categories WHERE slug = 'board-games'
UNION ALL
SELECT 'Family Games', 'Семейни игри', 'board-family', id, 4 FROM categories WHERE slug = 'board-games'
UNION ALL
SELECT 'Classic Games', 'Класически игри', 'board-classic', id, 5 FROM categories WHERE slug = 'board-games';
;
