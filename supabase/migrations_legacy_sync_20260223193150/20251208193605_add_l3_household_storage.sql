
-- Add L3 categories for Household & Cleaning
INSERT INTO categories (name, name_bg, slug, parent_id) VALUES
-- Air Fresheners (1dde9884-b31f-4551-8f97-77afdaecdaec)
('Plug-In Air Fresheners', 'Ароматизатори за контакт', 'fresheners-plugin', '1dde9884-b31f-4551-8f97-77afdaecdaec'),
('Spray Air Fresheners', 'Спрей ароматизатори', 'fresheners-spray', '1dde9884-b31f-4551-8f97-77afdaecdaec'),
('Reed Diffusers', 'Дифузори с клечки', 'fresheners-diffusers', '1dde9884-b31f-4551-8f97-77afdaecdaec'),
('Scented Candles', 'Ароматни свещи', 'fresheners-candles', '1dde9884-b31f-4551-8f97-77afdaecdaec'),

-- Cleaning Supplies (9c72b091-c4d3-42da-833c-20201ca3600a)
('All-Purpose Cleaners', 'Универсални почистващи', 'cleaning-allpurpose', '9c72b091-c4d3-42da-833c-20201ca3600a'),
('Glass Cleaners', 'Препарати за стъкло', 'cleaning-glass', '9c72b091-c4d3-42da-833c-20201ca3600a'),
('Floor Cleaners', 'Препарати за под', 'cleaning-floor', '9c72b091-c4d3-42da-833c-20201ca3600a'),
('Bathroom Cleaners', 'Препарати за баня', 'cleaning-bathroom', '9c72b091-c4d3-42da-833c-20201ca3600a'),
('Kitchen Cleaners', 'Препарати за кухня', 'cleaning-kitchen', '9c72b091-c4d3-42da-833c-20201ca3600a'),
('Disinfectants', 'Дезинфектанти', 'cleaning-disinfectants', '9c72b091-c4d3-42da-833c-20201ca3600a'),

-- Cleaning Tools (a9e1e80a-188f-4c59-b294-185b89f2fd98)
('Microfiber Cloths', 'Микрофибърни кърпи', 'tools-microfiber', 'a9e1e80a-188f-4c59-b294-185b89f2fd98'),
('Sponges & Scrubbers', 'Гъби и четки', 'tools-sponges', 'a9e1e80a-188f-4c59-b294-185b89f2fd98'),
('Dusters', 'Метлички за прах', 'tools-dusters', 'a9e1e80a-188f-4c59-b294-185b89f2fd98'),
('Rubber Gloves', 'Гумени ръкавици', 'tools-gloves', 'a9e1e80a-188f-4c59-b294-185b89f2fd98'),
('Buckets', 'Кофи', 'tools-buckets', 'a9e1e80a-188f-4c59-b294-185b89f2fd98'),

-- Ironing (644bee05-dd83-4b2f-8362-08caa43231ed)
('Steam Irons', 'Ютии с пара', 'ironing-steam', '644bee05-dd83-4b2f-8362-08caa43231ed'),
('Steam Generators', 'Парогенератори', 'ironing-generators', '644bee05-dd83-4b2f-8362-08caa43231ed'),
('Ironing Boards', 'Дъски за гладене', 'ironing-boards', '644bee05-dd83-4b2f-8362-08caa43231ed'),
('Garment Steamers', 'Вертикални парочистачки', 'ironing-steamers', '644bee05-dd83-4b2f-8362-08caa43231ed'),

-- Laundry Supplies (026de1e0-6767-432a-a168-d084653ddfe5)
('Laundry Detergent', 'Перилни препарати', 'laundry-detergent', '026de1e0-6767-432a-a168-d084653ddfe5'),
('Fabric Softener', 'Омекотители', 'laundry-softener', '026de1e0-6767-432a-a168-d084653ddfe5'),
('Stain Removers', 'Препарати за петна', 'laundry-stain', '026de1e0-6767-432a-a168-d084653ddfe5'),
('Laundry Bags', 'Торби за пране', 'laundry-bags', '026de1e0-6767-432a-a168-d084653ddfe5'),
('Drying Racks', 'Простори', 'laundry-racks', '026de1e0-6767-432a-a168-d084653ddfe5'),

-- Mops & Brooms (d0a25cbf-b248-4aa8-98cf-1f6080d3a4a5)
('Spin Mops', 'Въртящи се моп', 'mops-spin', 'd0a25cbf-b248-4aa8-98cf-1f6080d3a4a5'),
('Flat Mops', 'Плоски моп', 'mops-flat', 'd0a25cbf-b248-4aa8-98cf-1f6080d3a4a5'),
('Brooms', 'Метли', 'mops-brooms', 'd0a25cbf-b248-4aa8-98cf-1f6080d3a4a5'),
('Dustpans', 'Лопатки за боклук', 'mops-dustpans', 'd0a25cbf-b248-4aa8-98cf-1f6080d3a4a5'),

-- Pest Control (fe8b85e4-1681-4116-9b81-d3192d29dd21)
('Insect Repellents', 'Репеленти за насекоми', 'pest-repellents', 'fe8b85e4-1681-4116-9b81-d3192d29dd21'),
('Mouse Traps', 'Капани за мишки', 'pest-mouse', 'fe8b85e4-1681-4116-9b81-d3192d29dd21'),
('Bug Zappers', 'Електрически капани', 'pest-zappers', 'fe8b85e4-1681-4116-9b81-d3192d29dd21'),
('Ultrasonic Repellers', 'Ултразвукови уреди', 'pest-ultrasonic', 'fe8b85e4-1681-4116-9b81-d3192d29dd21'),

-- Trash & Recycling (0e7a79cc-ac02-402c-a6b9-f9a9695ca0e3)
('Kitchen Trash Cans', 'Кухненски кошове', 'trash-kitchen', '0e7a79cc-ac02-402c-a6b9-f9a9695ca0e3'),
('Recycling Bins', 'Кошове за рециклиране', 'trash-recycling', '0e7a79cc-ac02-402c-a6b9-f9a9695ca0e3'),
('Trash Bags', 'Торби за боклук', 'trash-bags', '0e7a79cc-ac02-402c-a6b9-f9a9695ca0e3'),
('Compost Bins', 'Кошове за компост', 'trash-compost', '0e7a79cc-ac02-402c-a6b9-f9a9695ca0e3'),

-- Vacuums (e24b6659-7053-41be-aa93-a93eed07235e)
('Upright Vacuums', 'Вертикални прахосмукачки', 'vacuums-upright', 'e24b6659-7053-41be-aa93-a93eed07235e'),
('Canister Vacuums', 'Прахосмукачки с контейнер', 'vacuums-canister', 'e24b6659-7053-41be-aa93-a93eed07235e'),
('Robot Vacuums', 'Роботи прахосмукачки', 'vacuums-robot', 'e24b6659-7053-41be-aa93-a93eed07235e'),
('Handheld Vacuums', 'Ръчни прахосмукачки', 'vacuums-handheld', 'e24b6659-7053-41be-aa93-a93eed07235e'),
('Stick Vacuums', 'Безкабелни прахосмукачки', 'vacuums-stick', 'e24b6659-7053-41be-aa93-a93eed07235e'),
('Wet & Dry Vacuums', 'Прахо и водосмукачки', 'vacuums-wetdry', 'e24b6659-7053-41be-aa93-a93eed07235e');
;
