
-- L3 for Televisions
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'OLED TVs', 'OLED телевизори', 'tv-oled', id, 1 FROM categories WHERE slug = 'televisions'
UNION ALL
SELECT 'QLED TVs', 'QLED телевизори', 'tv-qled', id, 2 FROM categories WHERE slug = 'televisions'
UNION ALL
SELECT 'LED/LCD TVs', 'LED/LCD телевизори', 'tv-led', id, 3 FROM categories WHERE slug = 'televisions'
UNION ALL
SELECT 'Smart TVs', 'Смарт телевизори', 'tv-smart', id, 4 FROM categories WHERE slug = 'televisions'
UNION ALL
SELECT '4K/8K TVs', '4K/8K телевизори', 'tv-4k8k', id, 5 FROM categories WHERE slug = 'televisions';

-- L3 for Headphones
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Wireless Headphones', 'Безжични слушалки', 'headphones-wireless', id, 1 FROM categories WHERE slug = 'headphones'
UNION ALL
SELECT 'Noise Cancelling', 'С шумопотискане', 'headphones-anc', id, 2 FROM categories WHERE slug = 'headphones'
UNION ALL
SELECT 'Gaming Headsets', 'Геймърски слушалки', 'headphones-gaming', id, 3 FROM categories WHERE slug = 'headphones'
UNION ALL
SELECT 'Earbuds', 'Тапи/Earbuds', 'headphones-earbuds', id, 4 FROM categories WHERE slug = 'headphones'
UNION ALL
SELECT 'Over-Ear', 'Големи слушалки', 'headphones-overear', id, 5 FROM categories WHERE slug = 'headphones'
UNION ALL
SELECT 'Sports/Running', 'Спортни слушалки', 'headphones-sports', id, 6 FROM categories WHERE slug = 'headphones';

-- L3 for Soundbars & Speakers
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Soundbars', 'Саундбари', 'audio-soundbars', id, 1 FROM categories WHERE slug = 'soundbars-speakers'
UNION ALL
SELECT 'Bluetooth Speakers', 'Bluetooth тонколони', 'audio-bluetooth', id, 2 FROM categories WHERE slug = 'soundbars-speakers'
UNION ALL
SELECT 'Smart Speakers', 'Смарт тонколони', 'audio-smart-speakers', id, 3 FROM categories WHERE slug = 'soundbars-speakers'
UNION ALL
SELECT 'Bookshelf Speakers', 'Полични тонколони', 'audio-bookshelf', id, 4 FROM categories WHERE slug = 'soundbars-speakers'
UNION ALL
SELECT 'Subwoofers', 'Субуфери', 'audio-subwoofers', id, 5 FROM categories WHERE slug = 'soundbars-speakers';
;
