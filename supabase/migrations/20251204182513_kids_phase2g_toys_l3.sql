
-- KIDS CATEGORY IMPROVEMENT - PHASE 2G: Toys & Games L3 Categories
-- ================================================================

-- L3 for Baby & Toddler Toys (686f3be0-dbb9-4e65-a706-69fa5d6f75bb)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Rattles & Teethers', 'Дрънкалки и гризалки', 'babytoy-rattles', '686f3be0-dbb9-4e65-a706-69fa5d6f75bb', 1),
('Soft Toys for Babies', 'Меки играчки', 'babytoy-soft', '686f3be0-dbb9-4e65-a706-69fa5d6f75bb', 2),
('Activity Centers', 'Активни центрове', 'babytoy-activity', '686f3be0-dbb9-4e65-a706-69fa5d6f75bb', 3),
('Bath Toys', 'Играчки за баня', 'babytoy-bath', '686f3be0-dbb9-4e65-a706-69fa5d6f75bb', 4),
('Stacking & Sorting', 'Подреждане', 'babytoy-stacking', '686f3be0-dbb9-4e65-a706-69fa5d6f75bb', 5);

-- L3 for Building & Construction (b2928aeb-387c-4be2-b79c-a7227b94a74b) - Already has some, add more
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) 
SELECT 'LEGO Duplo', 'LEGO Duplo', 'building-duplo', 'b2928aeb-387c-4be2-b79c-a7227b94a74b', 6
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'building-duplo');

-- L3 for Dolls & Accessories (e416342e-0562-4ed5-b3f6-520972fade08)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Baby Dolls', 'Бебешки кукли', 'doll-baby', 'e416342e-0562-4ed5-b3f6-520972fade08', 1),
('Fashion Dolls', 'Модни кукли', 'doll-fashion', 'e416342e-0562-4ed5-b3f6-520972fade08', 2),
('Dollhouses', 'Къщи за кукли', 'doll-houses', 'e416342e-0562-4ed5-b3f6-520972fade08', 3),
('Doll Accessories', 'Аксесоари за кукли', 'doll-accessories', 'e416342e-0562-4ed5-b3f6-520972fade08', 4);

-- L3 for Action Figures (53711ba4-b045-4584-a873-651a1bdb9556)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Superhero Figures', 'Супергерои', 'action-superhero', '53711ba4-b045-4584-a873-651a1bdb9556', 1),
('Movie & TV Figures', 'Фигурки от филми', 'action-movie', '53711ba4-b045-4584-a873-651a1bdb9556', 2),
('Anime Figures', 'Аниме фигурки', 'action-anime', '53711ba4-b045-4584-a873-651a1bdb9556', 3),
('Playsets', 'Комплекти за игра', 'action-playsets', '53711ba4-b045-4584-a873-651a1bdb9556', 4);

-- L3 for Outdoor & Sports Toys (a42ff465-82ed-48e8-930b-bd1bc3836cd2)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Bikes & Trikes', 'Велосипеди', 'outdoor-bikes', 'a42ff465-82ed-48e8-930b-bd1bc3836cd2', 1),
('Playhouses', 'Къщички за игра', 'outdoor-playhouses', 'a42ff465-82ed-48e8-930b-bd1bc3836cd2', 2),
('Sandboxes', 'Пясъчници', 'outdoor-sandboxes', 'a42ff465-82ed-48e8-930b-bd1bc3836cd2', 3),
('Water Toys', 'Водни играчки', 'outdoor-water', 'a42ff465-82ed-48e8-930b-bd1bc3836cd2', 4),
('Sports Equipment', 'Спортно оборудване', 'outdoor-sports', 'a42ff465-82ed-48e8-930b-bd1bc3836cd2', 5),
('Trampolines', 'Батути', 'outdoor-trampolines', 'a42ff465-82ed-48e8-930b-bd1bc3836cd2', 6),
('Swings & Slides', 'Люлки и пързалки', 'outdoor-swings', 'a42ff465-82ed-48e8-930b-bd1bc3836cd2', 7);

-- L3 for Ride-On Toys (8a3fbc3d-0413-4ef9-81c8-086f24b17c7e)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Electric Ride-Ons', 'Електрически коли', 'rideon-electric', '8a3fbc3d-0413-4ef9-81c8-086f24b17c7e', 1),
('Pedal Cars', 'Педални коли', 'rideon-pedal', '8a3fbc3d-0413-4ef9-81c8-086f24b17c7e', 2),
('Push & Kick Scooters', 'Тротинетки', 'rideon-scooters', '8a3fbc3d-0413-4ef9-81c8-086f24b17c7e', 3),
('Balance Bikes', 'Балансиращи колела', 'rideon-balance', '8a3fbc3d-0413-4ef9-81c8-086f24b17c7e', 4),
('Wagons', 'Вагончета', 'rideon-wagons', '8a3fbc3d-0413-4ef9-81c8-086f24b17c7e', 5);

-- L3 for Arts & Crafts (3b487a49-5ead-4f0a-9a25-75c7df0984a6)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Drawing & Painting', 'Рисуване', 'arts-drawing', '3b487a49-5ead-4f0a-9a25-75c7df0984a6', 1),
('Craft Kits', 'Комплекти за занаяти', 'arts-craftkits', '3b487a49-5ead-4f0a-9a25-75c7df0984a6', 2),
('Play-Doh & Clay', 'Пластилин и глина', 'arts-clay', '3b487a49-5ead-4f0a-9a25-75c7df0984a6', 3),
('Jewelry Making', 'Бижутерство', 'arts-jewelry', '3b487a49-5ead-4f0a-9a25-75c7df0984a6', 4),
('Sewing & Knitting', 'Шиене и плетене', 'arts-sewing', '3b487a49-5ead-4f0a-9a25-75c7df0984a6', 5);

-- L3 for Games & Puzzles (c6a03800-39f6-46ac-8991-fc280651708f)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Board Games', 'Настолни игри', 'games-board', 'c6a03800-39f6-46ac-8991-fc280651708f', 1),
('Card Games', 'Карти игри', 'games-cards', 'c6a03800-39f6-46ac-8991-fc280651708f', 2),
('Jigsaw Puzzles', 'Пъзели', 'games-jigsaw', 'c6a03800-39f6-46ac-8991-fc280651708f', 3),
('Memory Games', 'Игри за памет', 'games-memory', 'c6a03800-39f6-46ac-8991-fc280651708f', 4),
('Family Games', 'Семейни игри', 'games-family', 'c6a03800-39f6-46ac-8991-fc280651708f', 5);

-- L3 for Plush & Stuffed Toys (ef588906-383c-463b-a3a5-caef2b789a19)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Stuffed Animals', 'Плюшени животни', 'plush-animals', 'ef588906-383c-463b-a3a5-caef2b789a19', 1),
('Character Plush', 'Герои плюшени', 'plush-characters', 'ef588906-383c-463b-a3a5-caef2b789a19', 2),
('Giant Plush', 'Големи плюшени', 'plush-giant', 'ef588906-383c-463b-a3a5-caef2b789a19', 3),
('Interactive Plush', 'Интерактивни плюшени', 'plush-interactive', 'ef588906-383c-463b-a3a5-caef2b789a19', 4);

-- L3 for Pretend Play (44e43116-48e8-4c43-8597-c1c6587f6a00)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Kitchen Playsets', 'Кухни за игра', 'pretend-kitchen', '44e43116-48e8-4c43-8597-c1c6587f6a00', 1),
('Tool Sets', 'Инструменти', 'pretend-tools', '44e43116-48e8-4c43-8597-c1c6587f6a00', 2),
('Doctor Kits', 'Лекарски комплекти', 'pretend-doctor', '44e43116-48e8-4c43-8597-c1c6587f6a00', 3),
('Dress-Up & Costumes', 'Костюми', 'pretend-dressup', '44e43116-48e8-4c43-8597-c1c6587f6a00', 4),
('Play Food', 'Храна за игра', 'pretend-food', '44e43116-48e8-4c43-8597-c1c6587f6a00', 5);

-- L3 for Remote Control (654004cc-d219-4968-9423-b150d762827f)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('RC Cars', 'RC Коли', 'rc-cars', '654004cc-d219-4968-9423-b150d762827f', 1),
('RC Drones', 'RC Дронове', 'rc-drones', '654004cc-d219-4968-9423-b150d762827f', 2),
('RC Robots', 'RC Роботи', 'rc-robots', '654004cc-d219-4968-9423-b150d762827f', 3),
('RC Boats', 'RC Лодки', 'rc-boats', '654004cc-d219-4968-9423-b150d762827f', 4),
('RC Helicopters', 'RC Хеликоптери', 'rc-helicopters', '654004cc-d219-4968-9423-b150d762827f', 5);

-- L3 for Electronic Toys (f9f26018-0917-4a38-9a1c-e26362518c47)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Interactive Toys', 'Интерактивни играчки', 'electronic-interactive', 'f9f26018-0917-4a38-9a1c-e26362518c47', 1),
('Musical Toys', 'Музикални играчки', 'electronic-musical', 'f9f26018-0917-4a38-9a1c-e26362518c47', 2),
('Robotic Toys', 'Роботи играчки', 'electronic-robotic', 'f9f26018-0917-4a38-9a1c-e26362518c47', 3),
('Kids Tablets', 'Детски таблети', 'electronic-tablets', 'f9f26018-0917-4a38-9a1c-e26362518c47', 4),
('Learning Computers', 'Обучаващи компютри', 'electronic-computers', 'f9f26018-0917-4a38-9a1c-e26362518c47', 5);
;
