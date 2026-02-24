
-- Add L3 categories for Lighting
INSERT INTO categories (name, name_bg, slug, parent_id) VALUES
-- Chandeliers (c817c846-72e0-4546-8ce6-44f7b2ecd417)
('Crystal Chandeliers', 'Кристални полилеи', 'chandeliers-crystal', 'c817c846-72e0-4546-8ce6-44f7b2ecd417'),
('Modern Chandeliers', 'Модерни полилеи', 'chandeliers-modern', 'c817c846-72e0-4546-8ce6-44f7b2ecd417'),
('Mini Chandeliers', 'Мини полилеи', 'chandeliers-mini', 'c817c846-72e0-4546-8ce6-44f7b2ecd417'),
('Drum Chandeliers', 'Барабанни полилеи', 'chandeliers-drum', 'c817c846-72e0-4546-8ce6-44f7b2ecd417'),

-- Floor Lamps (9dc9c74e-ab03-4e9f-b058-ee9682b45cff)
('Arc Floor Lamps', 'Дъгови лампи', 'floor-lamps-arc', '9dc9c74e-ab03-4e9f-b058-ee9682b45cff'),
('Torchiere Lamps', 'Факелни лампи', 'floor-lamps-torchiere', '9dc9c74e-ab03-4e9f-b058-ee9682b45cff'),
('Reading Floor Lamps', 'Лампи за четене', 'floor-lamps-reading', '9dc9c74e-ab03-4e9f-b058-ee9682b45cff'),
('Tripod Floor Lamps', 'Триножни лампи', 'floor-lamps-tripod', '9dc9c74e-ab03-4e9f-b058-ee9682b45cff'),

-- LED Bulbs (f6fa619d-dcca-4abb-a25d-dcceb6fa5519)
('E27 LED Bulbs', 'LED крушки E27', 'led-e27', 'f6fa619d-dcca-4abb-a25d-dcceb6fa5519'),
('E14 LED Bulbs', 'LED крушки E14', 'led-e14', 'f6fa619d-dcca-4abb-a25d-dcceb6fa5519'),
('GU10 LED Bulbs', 'LED крушки GU10', 'led-gu10', 'f6fa619d-dcca-4abb-a25d-dcceb6fa5519'),
('Smart LED Bulbs', 'Смарт LED крушки', 'led-smart', 'f6fa619d-dcca-4abb-a25d-dcceb6fa5519'),
('Filament LED Bulbs', 'LED крушки с нажежаема жичка', 'led-filament', 'f6fa619d-dcca-4abb-a25d-dcceb6fa5519'),

-- Pendant Lights (0630c35c-e092-4e33-a421-c601a94b2006)
('Single Pendants', 'Единични пендели', 'pendant-single', '0630c35c-e092-4e33-a421-c601a94b2006'),
('Multi-Light Pendants', 'Многосветлинни пендели', 'pendant-multi', '0630c35c-e092-4e33-a421-c601a94b2006'),
('Island Pendants', 'Пендели за кухненски остров', 'pendant-island', '0630c35c-e092-4e33-a421-c601a94b2006'),
('Glass Pendants', 'Стъклени пендели', 'pendant-glass', '0630c35c-e092-4e33-a421-c601a94b2006'),

-- Smart Lighting (8dfffd81-272d-44d2-80e8-600a616c1bd5)
('Philips Hue', 'Philips Hue', 'smart-philips-hue', '8dfffd81-272d-44d2-80e8-600a616c1bd5'),
('Smart Light Strips', 'Смарт LED ленти', 'smart-strips', '8dfffd81-272d-44d2-80e8-600a616c1bd5'),
('Smart Switches', 'Смарт ключове', 'smart-switches', '8dfffd81-272d-44d2-80e8-600a616c1bd5'),
('Smart Dimmers', 'Смарт димери', 'smart-dimmers', '8dfffd81-272d-44d2-80e8-600a616c1bd5'),

-- String Lights (a297e2a3-1f07-44c3-aa5e-e0b20c6b156c)
('Fairy Lights', 'Коледни лампички', 'string-fairy', 'a297e2a3-1f07-44c3-aa5e-e0b20c6b156c'),
('Globe String Lights', 'Гирлянди с глобуси', 'string-globe', 'a297e2a3-1f07-44c3-aa5e-e0b20c6b156c'),
('Outdoor String Lights', 'Външни гирлянди', 'string-outdoor', 'a297e2a3-1f07-44c3-aa5e-e0b20c6b156c'),
('Solar String Lights', 'Соларни гирлянди', 'string-solar', 'a297e2a3-1f07-44c3-aa5e-e0b20c6b156c'),

-- Table Lamps (4f8f40f6-cd3b-43d2-80c3-ceead7357966)
('Bedside Lamps', 'Нощни лампи', 'table-bedside', '4f8f40f6-cd3b-43d2-80c3-ceead7357966'),
('Desk Lamps', 'Настолни лампи', 'table-desk', '4f8f40f6-cd3b-43d2-80c3-ceead7357966'),
('Touch Lamps', 'Лампи с докосване', 'table-touch', '4f8f40f6-cd3b-43d2-80c3-ceead7357966'),
('Accent Lamps', 'Акцентни лампи', 'table-accent', '4f8f40f6-cd3b-43d2-80c3-ceead7357966'),
('Buffet Lamps', 'Лампи за бюфет', 'table-buffet', '4f8f40f6-cd3b-43d2-80c3-ceead7357966'),

-- Wall Lights (e836ac88-8bd1-4b82-a581-f8086b828649)
('Wall Sconces', 'Стенни аплици', 'wall-sconces', 'e836ac88-8bd1-4b82-a581-f8086b828649'),
('Picture Lights', 'Осветление за картини', 'wall-picture', 'e836ac88-8bd1-4b82-a581-f8086b828649'),
('Swing Arm Lamps', 'Шарнирни лампи', 'wall-swing-arm', 'e836ac88-8bd1-4b82-a581-f8086b828649'),
('Vanity Lights', 'Осветление за тоалетка', 'wall-vanity', 'e836ac88-8bd1-4b82-a581-f8086b828649');

-- Home Décor L3s
INSERT INTO categories (name, name_bg, slug, parent_id) VALUES
-- Decorative Accents (a8925fd3-d324-4ab4-a00b-450fa6104781)
('Vases', 'Вази', 'accents-vases', 'a8925fd3-d324-4ab4-a00b-450fa6104781'),
('Decorative Bowls', 'Декоративни купи', 'accents-bowls', 'a8925fd3-d324-4ab4-a00b-450fa6104781'),
('Candles & Holders', 'Свещи и свещници', 'accents-candles', 'a8925fd3-d324-4ab4-a00b-450fa6104781'),
('Bookends', 'Опори за книги', 'accents-bookends', 'a8925fd3-d324-4ab4-a00b-450fa6104781'),
('Decorative Boxes', 'Декоративни кутии', 'accents-boxes', 'a8925fd3-d324-4ab4-a00b-450fa6104781'),

-- Figurines & Sculptures (6acb8142-afe1-4392-86a9-cbc876a24b4e)
('Animal Figurines', 'Фигурки на животни', 'figurines-animals', '6acb8142-afe1-4392-86a9-cbc876a24b4e'),
('Buddha Statues', 'Статуи на Буда', 'figurines-buddha', '6acb8142-afe1-4392-86a9-cbc876a24b4e'),
('Abstract Sculptures', 'Абстрактни скулптури', 'figurines-abstract', '6acb8142-afe1-4392-86a9-cbc876a24b4e'),
('Garden Statues', 'Градински статуи', 'figurines-garden', '6acb8142-afe1-4392-86a9-cbc876a24b4e'),

-- Picture Frames (957bdada-c2f1-4a68-b141-5644c7a27fb1)
('Photo Frames', 'Рамки за снимки', 'frames-photo', '957bdada-c2f1-4a68-b141-5644c7a27fb1'),
('Collage Frames', 'Колажни рамки', 'frames-collage', '957bdada-c2f1-4a68-b141-5644c7a27fb1'),
('Poster Frames', 'Рамки за постери', 'frames-poster', '957bdada-c2f1-4a68-b141-5644c7a27fb1'),
('Digital Frames', 'Дигитални рамки', 'frames-digital', '957bdada-c2f1-4a68-b141-5644c7a27fb1'),

-- Seasonal Décor (52270586-6a88-417f-9067-984c80d91ba4)
('Christmas Décor', 'Коледна украса', 'seasonal-christmas', '52270586-6a88-417f-9067-984c80d91ba4'),
('Halloween Décor', 'Хелоуин украса', 'seasonal-halloween', '52270586-6a88-417f-9067-984c80d91ba4'),
('Easter Décor', 'Великденска украса', 'seasonal-easter', '52270586-6a88-417f-9067-984c80d91ba4'),
('Spring Décor', 'Пролетна украса', 'seasonal-spring', '52270586-6a88-417f-9067-984c80d91ba4');
;
