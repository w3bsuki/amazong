-- Phase 3: Pet Memorials L2 Categories
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Pet Urns', 'Урни за домашни любимци', 'pet-urns', '8418ed82-b59c-4e5a-a727-c653476a67fe', NULL, 1, 'Pet urns', 'Урни за домашни любимци'),
('Memorial Jewelry', 'Възпоменателни бижута', 'pet-memorial-jewelry', '8418ed82-b59c-4e5a-a727-c653476a67fe', NULL, 2, 'Pet memorial jewelry', 'Възпоменателни бижута'),
('Memorial Stones & Markers', 'Възпоменателни камъни', 'memorial-stones', '8418ed82-b59c-4e5a-a727-c653476a67fe', NULL, 3, 'Pet memorial stones and markers', 'Възпоменателни камъни и маркери'),
('Pet Caskets', 'Ковчези за домашни любимци', 'pet-caskets', '8418ed82-b59c-4e5a-a727-c653476a67fe', NULL, 4, 'Pet caskets', 'Ковчези за домашни любимци'),
('Paw Print Kits', 'Комплекти за отпечатъци', 'paw-print-kits', '8418ed82-b59c-4e5a-a727-c653476a67fe', NULL, 5, 'Paw print and memory kits', 'Комплекти за отпечатъци и спомени'),
('Memorial Frames & Art', 'Рамки и изкуство', 'memorial-frames', '8418ed82-b59c-4e5a-a727-c653476a67fe', NULL, 6, 'Memorial frames and art', 'Възпоменателни рамки и изкуство')
ON CONFLICT (slug) DO NOTHING;

-- Pet Memorials L3 - Pet Urns
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Wooden Urns', 'Дървени урни', 'wooden-pet-urns', id, NULL, 1, 'Wooden pet urns', 'Дървени урни за домашни любимци'
FROM categories WHERE slug = 'pet-urns' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Ceramic Urns', 'Керамични урни', 'ceramic-pet-urns', id, NULL, 2, 'Ceramic pet urns', 'Керамични урни'
FROM categories WHERE slug = 'pet-urns' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Metal Urns', 'Метални урни', 'metal-pet-urns', id, NULL, 3, 'Metal pet urns', 'Метални урни'
FROM categories WHERE slug = 'pet-urns' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Biodegradable Urns', 'Биоразградими урни', 'biodegradable-urns', id, NULL, 4, 'Biodegradable pet urns', 'Биоразградими урни'
FROM categories WHERE slug = 'pet-urns' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Keepsake Urns', 'Малки спомен урни', 'keepsake-urns', id, NULL, 5, 'Keepsake urns', 'Малки урни за спомен'
FROM categories WHERE slug = 'pet-urns' ON CONFLICT (slug) DO NOTHING;

-- Pet Memorials L3 - Memorial Jewelry
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Ash Pendants', 'Висулки с пепел', 'ash-pendants', id, NULL, 1, 'Ash holding pendants', 'Висулки за пепел'
FROM categories WHERE slug = 'pet-memorial-jewelry' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Paw Print Jewelry', 'Бижута с отпечатък', 'paw-print-jewelry', id, NULL, 2, 'Paw print jewelry', 'Бижута с отпечатък на лапа'
FROM categories WHERE slug = 'pet-memorial-jewelry' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Photo Lockets', 'Медальони със снимка', 'photo-lockets', id, NULL, 3, 'Photo lockets', 'Медальони със снимка'
FROM categories WHERE slug = 'pet-memorial-jewelry' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Memorial Bracelets', 'Възпоменателни гривни', 'memorial-bracelets', id, NULL, 4, 'Memorial bracelets', 'Възпоменателни гривни'
FROM categories WHERE slug = 'pet-memorial-jewelry' ON CONFLICT (slug) DO NOTHING;

-- Pet Memorials L3 - Paw Print Kits
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Clay Paw Print Kits', 'Комплекти с глина', 'clay-paw-print-kits', id, NULL, 1, 'Clay paw print kits', 'Комплекти с глина за отпечатъци'
FROM categories WHERE slug = 'paw-print-kits' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Ink Paw Print Kits', 'Комплекти с мастило', 'ink-paw-print-kits', id, NULL, 2, 'Ink paw print kits', 'Комплекти с мастило за отпечатъци'
FROM categories WHERE slug = 'paw-print-kits' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Nose Print Kits', 'Комплекти за нос', 'nose-print-kits', id, NULL, 3, 'Nose print kits', 'Комплекти за отпечатък на нос'
FROM categories WHERE slug = 'paw-print-kits' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Memory Books', 'Книги за спомени', 'pet-memory-books', id, NULL, 4, 'Pet memory books', 'Книги за спомени'
FROM categories WHERE slug = 'paw-print-kits' ON CONFLICT (slug) DO NOTHING;

-- Pet Gifts L2 Categories
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Gift Baskets', 'Подаръчни кошници', 'pet-gift-baskets', '8f4153ec-8803-44dc-99b4-205ba95d905d', NULL, 1, 'Pet gift baskets', 'Подаръчни кошници за домашни любимци'),
('Pet-Themed Clothing', 'Облекло с животни', 'pet-themed-clothing', '8f4153ec-8803-44dc-99b4-205ba95d905d', NULL, 2, 'Pet-themed clothing for humans', 'Облекло с теми за животни'),
('Pet Home Decor', 'Декорация за дома', 'pet-themed-home-decor', '8f4153ec-8803-44dc-99b4-205ba95d905d', NULL, 3, 'Pet-themed home decor', 'Декорация за дома с животни'),
('Gift Cards', 'Подаръчни карти', 'pet-gift-cards', '8f4153ec-8803-44dc-99b4-205ba95d905d', NULL, 4, 'Pet store gift cards', 'Подаръчни карти'),
('Subscription Boxes', 'Абонаментни кутии', 'pet-subscription-boxes', '8f4153ec-8803-44dc-99b4-205ba95d905d', NULL, 5, 'Pet subscription boxes', 'Абонаментни кутии за домашни любимци'),
('Personalized Items', 'Персонализирани артикули', 'personalized-pet-items', '8f4153ec-8803-44dc-99b4-205ba95d905d', NULL, 6, 'Personalized pet items', 'Персонализирани артикули')
ON CONFLICT (slug) DO NOTHING;

-- Pet Gifts L3 - Gift Baskets
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Dog Gift Baskets', 'Подаръчни кошници за кучета', 'dog-gift-baskets', id, NULL, 1, 'Gift baskets for dogs', 'Подаръчни кошници за кучета'
FROM categories WHERE slug = 'pet-gift-baskets' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Cat Gift Baskets', 'Подаръчни кошници за котки', 'cat-gift-baskets', id, NULL, 2, 'Gift baskets for cats', 'Подаръчни кошници за котки'
FROM categories WHERE slug = 'pet-gift-baskets' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'New Pet Parent Gifts', 'Подаръци за нови собственици', 'new-pet-parent-gifts', id, NULL, 3, 'Gifts for new pet parents', 'Подаръци за нови собственици'
FROM categories WHERE slug = 'pet-gift-baskets' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Birthday Gift Sets', 'Подаръчни комплекти за рожден ден', 'pet-birthday-gift-sets', id, NULL, 4, 'Pet birthday gift sets', 'Подаръчни комплекти за рожден ден'
FROM categories WHERE slug = 'pet-gift-baskets' ON CONFLICT (slug) DO NOTHING;

-- Pet Gifts L3 - Pet-Themed Clothing
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Dog-Themed T-Shirts', 'Тениски с кучета', 'dog-themed-tshirts', id, NULL, 1, 'Dog-themed t-shirts', 'Тениски с кучета'
FROM categories WHERE slug = 'pet-themed-clothing' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Cat-Themed T-Shirts', 'Тениски с котки', 'cat-themed-tshirts', id, NULL, 2, 'Cat-themed t-shirts', 'Тениски с котки'
FROM categories WHERE slug = 'pet-themed-clothing' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pet Socks', 'Чорапи с домашни любимци', 'pet-themed-socks', id, NULL, 3, 'Pet-themed socks', 'Чорапи с домашни любимци'
FROM categories WHERE slug = 'pet-themed-clothing' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pet Hoodies', 'Суитшърти с животни', 'pet-themed-hoodies', id, NULL, 4, 'Pet-themed hoodies', 'Суитшърти с животни'
FROM categories WHERE slug = 'pet-themed-clothing' ON CONFLICT (slug) DO NOTHING;

-- Pet Gifts L3 - Home Decor
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pet Wall Art', 'Стенно изкуство', 'pet-wall-art', id, NULL, 1, 'Pet-themed wall art', 'Стенно изкуство с животни'
FROM categories WHERE slug = 'pet-themed-home-decor' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pet Pillows & Blankets', 'Възглавници и одеяла', 'pet-pillows-blankets', id, NULL, 2, 'Pet-themed pillows and blankets', 'Възглавници и одеяла с животни'
FROM categories WHERE slug = 'pet-themed-home-decor' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pet Mugs & Drinkware', 'Чаши и съдове за напитки', 'pet-mugs-drinkware', id, NULL, 3, 'Pet-themed mugs and drinkware', 'Чаши и съдове за напитки с животни'
FROM categories WHERE slug = 'pet-themed-home-decor' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pet Door Signs', 'Табели за врата', 'pet-door-signs', id, NULL, 4, 'Pet door signs', 'Табели за врата с животни'
FROM categories WHERE slug = 'pet-themed-home-decor' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Pet Figurines', 'Фигурки на животни', 'pet-figurines', id, NULL, 5, 'Pet figurines and statues', 'Фигурки и статуи на животни'
FROM categories WHERE slug = 'pet-themed-home-decor' ON CONFLICT (slug) DO NOTHING;

-- Pet Gifts L3 - Personalized Items
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Custom Pet Portraits', 'Персонализирани портрети', 'custom-pet-portraits', id, NULL, 1, 'Custom pet portraits', 'Персонализирани портрети на домашни любимци'
FROM categories WHERE slug = 'personalized-pet-items' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Engraved ID Tags', 'Гравирани медальони', 'engraved-id-tags', id, NULL, 2, 'Engraved pet ID tags', 'Гравирани медальони за идентификация'
FROM categories WHERE slug = 'personalized-pet-items' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Custom Collars & Leashes', 'Персонализирани нашийници', 'custom-collars-leashes', id, NULL, 3, 'Custom collars and leashes', 'Персонализирани нашийници и каишки'
FROM categories WHERE slug = 'personalized-pet-items' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Personalized Bowls', 'Персонализирани купички', 'personalized-pet-bowls', id, NULL, 4, 'Personalized pet bowls', 'Персонализирани купички'
FROM categories WHERE slug = 'personalized-pet-items' ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
SELECT 'Custom Blankets', 'Персонализирани одеяла', 'custom-pet-blankets', id, NULL, 5, 'Custom pet blankets', 'Персонализирани одеяла'
FROM categories WHERE slug = 'personalized-pet-items' ON CONFLICT (slug) DO NOTHING;;
