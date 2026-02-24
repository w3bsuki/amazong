-- Phase 3: Horses L3 Categories
-- Horse Feed L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Horse Hay', 'Сено за коне', 'horse-hay', '21c009ab-2780-47f3-8089-5d8a37786e95', NULL, 1, 'Hay for horses', 'Сено за коне'),
('Horse Grain', 'Зърно за коне', 'horse-grain', '21c009ab-2780-47f3-8089-5d8a37786e95', NULL, 2, 'Grain feed for horses', 'Зърно за коне'),
('Horse Pellets', 'Пелети за коне', 'horse-pellets', '21c009ab-2780-47f3-8089-5d8a37786e95', NULL, 3, 'Pellet feed for horses', 'Пелети за коне'),
('Senior Horse Food', 'Храна за възрастни коне', 'senior-horse-food', '21c009ab-2780-47f3-8089-5d8a37786e95', NULL, 4, 'Food for senior horses', 'Храна за възрастни коне'),
('Performance Feed', 'Храна за състезателни коне', 'performance-feed', '21c009ab-2780-47f3-8089-5d8a37786e95', NULL, 5, 'Feed for performance horses', 'Храна за състезателни коне'),
('Horse Supplements', 'Добавки за коне', 'horse-supplements', '21c009ab-2780-47f3-8089-5d8a37786e95', NULL, 6, 'Nutritional supplements', 'Хранителни добавки за коне'),
('Horse Vitamins', 'Витамини за коне', 'horse-vitamins', '21c009ab-2780-47f3-8089-5d8a37786e95', NULL, 7, 'Vitamins for horses', 'Витамини за коне'),
('Joint Supplements', 'Добавки за стави', 'horse-joint-supplements', '21c009ab-2780-47f3-8089-5d8a37786e95', NULL, 8, 'Joint supplements for horses', 'Добавки за стави на коне')
ON CONFLICT (slug) DO NOTHING;

-- Horse Treats L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Carrot Treats', 'Лакомства с моркови', 'horse-carrot-treats', 'cfd27e3c-85f8-434c-9cab-01f6526cf02e', NULL, 1, 'Carrot treats for horses', 'Лакомства с моркови за коне'),
('Apple Treats', 'Ябълкови лакомства', 'horse-apple-treats', 'cfd27e3c-85f8-434c-9cab-01f6526cf02e', NULL, 2, 'Apple treats for horses', 'Ябълкови лакомства за коне'),
('Peppermint Treats', 'Ментови лакомства', 'horse-peppermint-treats', 'cfd27e3c-85f8-434c-9cab-01f6526cf02e', NULL, 3, 'Peppermint treats', 'Ментови лакомства'),
('Sugar Cubes', 'Захарни кубчета', 'horse-sugar-cubes', 'cfd27e3c-85f8-434c-9cab-01f6526cf02e', NULL, 4, 'Sugar cubes for horses', 'Захарни кубчета за коне'),
('Training Treats', 'Лакомства за тренировка', 'horse-training-treats', 'cfd27e3c-85f8-434c-9cab-01f6526cf02e', NULL, 5, 'Training treats for horses', 'Лакомства за тренировка'),
('Treat Balls', 'Топки с лакомства', 'horse-treat-balls', 'cfd27e3c-85f8-434c-9cab-01f6526cf02e', NULL, 6, 'Treat dispensing balls', 'Топки за раздаване на лакомства')
ON CONFLICT (slug) DO NOTHING;

-- Horse Tack L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Western Saddles', 'Уестърн седла', 'western-saddles', '045556ed-de89-4ec7-b206-44bc83d1d560', NULL, 1, 'Western style saddles', 'Уестърн седла'),
('English Saddles', 'Английски седла', 'english-saddles', '045556ed-de89-4ec7-b206-44bc83d1d560', NULL, 2, 'English style saddles', 'Английски седла'),
('Saddle Pads', 'Подложки за седла', 'saddle-pads', '045556ed-de89-4ec7-b206-44bc83d1d560', NULL, 3, 'Saddle pads and blankets', 'Подложки за седла'),
('Bridles', 'Юзди', 'bridles', '045556ed-de89-4ec7-b206-44bc83d1d560', NULL, 4, 'Horse bridles', 'Юзди за коне'),
('Reins', 'Поводи', 'horse-reins', '045556ed-de89-4ec7-b206-44bc83d1d560', NULL, 5, 'Horse reins', 'Поводи за коне'),
('Halters & Lead Ropes', 'Недоуздици и поводи', 'halters-lead-ropes', '045556ed-de89-4ec7-b206-44bc83d1d560', NULL, 6, 'Halters and lead ropes', 'Недоуздици и поводи'),
('Bits', 'Юзди', 'horse-bits', '045556ed-de89-4ec7-b206-44bc83d1d560', NULL, 7, 'Horse bits', 'Юзди'),
('Girths & Cinches', 'Коремни ремъци', 'girths-cinches', '045556ed-de89-4ec7-b206-44bc83d1d560', NULL, 8, 'Girths and cinches', 'Коремни ремъци'),
('Stirrups', 'Стремена', 'stirrups', '045556ed-de89-4ec7-b206-44bc83d1d560', NULL, 9, 'Horse stirrups', 'Стремена')
ON CONFLICT (slug) DO NOTHING;

-- Horse Blankets L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Turnout Blankets', 'Покривала за открито', 'turnout-blankets', 'b8c66b2e-021c-4804-b2fa-a4c0432cf746', NULL, 1, 'Turnout blankets', 'Покривала за открито'),
('Stable Blankets', 'Покривала за обор', 'stable-blankets', 'b8c66b2e-021c-4804-b2fa-a4c0432cf746', NULL, 2, 'Stable blankets', 'Покривала за обор'),
('Fly Sheets', 'Покривала против мухи', 'fly-sheets', 'b8c66b2e-021c-4804-b2fa-a4c0432cf746', NULL, 3, 'Fly protection sheets', 'Покривала против мухи'),
('Coolers', 'Охлаждащи покривала', 'horse-coolers', 'b8c66b2e-021c-4804-b2fa-a4c0432cf746', NULL, 4, 'Cooling sheets', 'Охлаждащи покривала'),
('Quarter Sheets', 'Четвърт покривала', 'quarter-sheets', 'b8c66b2e-021c-4804-b2fa-a4c0432cf746', NULL, 5, 'Quarter sheets', 'Четвърт покривала'),
('Neck Covers', 'Покривала за шия', 'neck-covers', 'b8c66b2e-021c-4804-b2fa-a4c0432cf746', NULL, 6, 'Neck covers', 'Покривала за шия')
ON CONFLICT (slug) DO NOTHING;

-- Horse Health L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Horse Dewormers', 'Обезпаразитяване', 'horse-dewormers', '310cb38e-427b-47b2-a055-d4540cb8f0f9', NULL, 1, 'Deworming products', 'Продукти за обезпаразитяване'),
('Fly Control', 'Контрол на мухи', 'horse-fly-control', '310cb38e-427b-47b2-a055-d4540cb8f0f9', NULL, 2, 'Fly control products', 'Продукти за контрол на мухи'),
('Wound Care', 'Грижа за рани', 'horse-wound-care', '310cb38e-427b-47b2-a055-d4540cb8f0f9', NULL, 3, 'Wound care products', 'Продукти за грижа за рани'),
('Horse Liniments', 'Мази за коне', 'horse-liniments', '310cb38e-427b-47b2-a055-d4540cb8f0f9', NULL, 4, 'Liniments and muscle care', 'Мази за мускули'),
('Horse Poultices', 'Компреси за коне', 'horse-poultices', '310cb38e-427b-47b2-a055-d4540cb8f0f9', NULL, 5, 'Poultices', 'Компреси за коне'),
('Horse Medications', 'Лекарства за коне', 'horse-medications', '310cb38e-427b-47b2-a055-d4540cb8f0f9', NULL, 6, 'Horse medications', 'Лекарства за коне'),
('Horse First Aid', 'Първа помощ', 'horse-first-aid', '310cb38e-427b-47b2-a055-d4540cb8f0f9', NULL, 7, 'First aid supplies', 'Консумативи за първа помощ')
ON CONFLICT (slug) DO NOTHING;

-- Horse Hoof Care L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Hoof Picks', 'Копитни ножове', 'hoof-picks', '88d2815e-4c29-45bc-b274-5984c9096304', NULL, 1, 'Hoof picks', 'Копитни ножове'),
('Hoof Dressings', 'Мазила за копита', 'hoof-dressings', '88d2815e-4c29-45bc-b274-5984c9096304', NULL, 2, 'Hoof dressings and conditioners', 'Мазила за копита'),
('Hoof Hardeners', 'Укрепители за копита', 'hoof-hardeners', '88d2815e-4c29-45bc-b274-5984c9096304', NULL, 3, 'Hoof hardeners', 'Укрепители за копита'),
('Thrush Treatment', 'Лечение на трашнест', 'thrush-treatment', '88d2815e-4c29-45bc-b274-5984c9096304', NULL, 4, 'Thrush treatment products', 'Продукти за лечение на трашнест'),
('Horse Boots', 'Ботуши за коне', 'horse-boots', '88d2815e-4c29-45bc-b274-5984c9096304', NULL, 5, 'Hoof boots', 'Ботуши за коне'),
('Farrier Tools', 'Инструменти за подковаване', 'farrier-tools', '88d2815e-4c29-45bc-b274-5984c9096304', NULL, 6, 'Farrier tools', 'Инструменти за подковаване')
ON CONFLICT (slug) DO NOTHING;

-- Horse Apparel L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Riding Boots', 'Ботуши за езда', 'riding-boots', '54ea15cf-2faf-4ce3-8638-c5b0cd7638a4', NULL, 1, 'Riding boots', 'Ботуши за езда'),
('Riding Pants', 'Панталони за езда', 'riding-pants', '54ea15cf-2faf-4ce3-8638-c5b0cd7638a4', NULL, 2, 'Riding pants and breeches', 'Панталони за езда'),
('Riding Helmets', 'Каски за езда', 'riding-helmets', '54ea15cf-2faf-4ce3-8638-c5b0cd7638a4', NULL, 3, 'Riding helmets', 'Каски за езда'),
('Riding Gloves', 'Ръкавици за езда', 'riding-gloves', '54ea15cf-2faf-4ce3-8638-c5b0cd7638a4', NULL, 4, 'Riding gloves', 'Ръкавици за езда'),
('Riding Shirts', 'Ризи за езда', 'riding-shirts', '54ea15cf-2faf-4ce3-8638-c5b0cd7638a4', NULL, 5, 'Riding shirts and tops', 'Ризи за езда'),
('Safety Vests', 'Предпазни жилетки', 'horse-safety-vests', '54ea15cf-2faf-4ce3-8638-c5b0cd7638a4', NULL, 6, 'Safety vests', 'Предпазни жилетки'),
('Spurs', 'Шпори', 'spurs', '54ea15cf-2faf-4ce3-8638-c5b0cd7638a4', NULL, 7, 'Riding spurs', 'Шпори')
ON CONFLICT (slug) DO NOTHING;

-- Horse Stable L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Horse Stall Mats', 'Подложки за боксове', 'stall-mats', '0199ffb7-da9b-4687-a6fe-4ecfa54a5682', NULL, 1, 'Stall mats', 'Подложки за боксове'),
('Horse Bedding', 'Постеля за коне', 'horse-bedding', '0199ffb7-da9b-4687-a6fe-4ecfa54a5682', NULL, 2, 'Horse bedding', 'Постеля за коне'),
('Feed Buckets', 'Ведра за храна', 'feed-buckets', '0199ffb7-da9b-4687-a6fe-4ecfa54a5682', NULL, 3, 'Feed buckets', 'Ведра за храна'),
('Water Buckets', 'Ведра за вода', 'horse-water-buckets', '0199ffb7-da9b-4687-a6fe-4ecfa54a5682', NULL, 4, 'Water buckets', 'Ведра за вода'),
('Hay Nets & Bags', 'Мрежи и торби за сено', 'hay-nets-bags', '0199ffb7-da9b-4687-a6fe-4ecfa54a5682', NULL, 5, 'Hay nets and bags', 'Мрежи и торби за сено'),
('Stable Supplies', 'Консумативи за обор', 'stable-supplies', '0199ffb7-da9b-4687-a6fe-4ecfa54a5682', NULL, 6, 'Stable supplies', 'Консумативи за обор'),
('Fencing', 'Огради', 'horse-fencing', '0199ffb7-da9b-4687-a6fe-4ecfa54a5682', NULL, 7, 'Horse fencing', 'Огради за коне')
ON CONFLICT (slug) DO NOTHING;

-- Horse Transport L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Trailer Accessories', 'Аксесоари за ремаркета', 'trailer-accessories', 'aec37f59-927a-4394-9293-cc979f05fa93', NULL, 1, 'Horse trailer accessories', 'Аксесоари за ремаркета за коне'),
('Shipping Boots', 'Транспортни гети', 'shipping-boots', 'aec37f59-927a-4394-9293-cc979f05fa93', NULL, 2, 'Shipping boots', 'Транспортни гети'),
('Head Bumpers', 'Предпазители за глава', 'head-bumpers', 'aec37f59-927a-4394-9293-cc979f05fa93', NULL, 3, 'Head bumpers for transport', 'Предпазители за глава'),
('Trailer Ties', 'Връзки за ремаркета', 'trailer-ties', 'aec37f59-927a-4394-9293-cc979f05fa93', NULL, 4, 'Trailer ties', 'Връзки за ремаркета'),
('Travel Blankets', 'Пътни одеяла', 'travel-blankets', 'aec37f59-927a-4394-9293-cc979f05fa93', NULL, 5, 'Travel blankets', 'Пътни одеяла')
ON CONFLICT (slug) DO NOTHING;

-- Horse Toys L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Horse Balls', 'Топки за коне', 'horse-balls', '5a0b1f8b-5a56-496d-bd27-c38759530ad9', NULL, 1, 'Horse play balls', 'Топки за коне'),
('Jolly Balls', 'Джоли топки', 'jolly-balls', '5a0b1f8b-5a56-496d-bd27-c38759530ad9', NULL, 2, 'Jolly balls', 'Джоли топки'),
('Treat Dispensers', 'Раздаватели на лакомства', 'horse-treat-dispensers', '5a0b1f8b-5a56-496d-bd27-c38759530ad9', NULL, 3, 'Treat dispensing toys', 'Раздаватели на лакомства'),
('Hanging Toys', 'Висящи играчки', 'horse-hanging-toys', '5a0b1f8b-5a56-496d-bd27-c38759530ad9', NULL, 4, 'Hanging toys', 'Висящи играчки'),
('Lick Blocks', 'Блокове за ближене', 'lick-blocks', '5a0b1f8b-5a56-496d-bd27-c38759530ad9', NULL, 5, 'Salt and mineral lick blocks', 'Блокове за ближене')
ON CONFLICT (slug) DO NOTHING;;
