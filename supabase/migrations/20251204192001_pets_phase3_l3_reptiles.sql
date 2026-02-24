-- Phase 3: Reptiles L3 Categories
-- Reptile Food L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Dry Reptile Food', 'Суха храна за влечуги', 'dry-reptile-food', '19bc54e1-4230-4d7f-b8bb-52ebd918dc77', NULL, 1, 'Dry food for reptiles', 'Суха храна за влечуги'),
('Freeze-Dried Insects', 'Лиофилизирани насекоми', 'freeze-dried-insects', '19bc54e1-4230-4d7f-b8bb-52ebd918dc77', NULL, 2, 'Freeze-dried insects', 'Лиофилизирани насекоми'),
('Live Insects', 'Живи насекоми', 'live-insects', '19bc54e1-4230-4d7f-b8bb-52ebd918dc77', NULL, 3, 'Live feeder insects', 'Живи насекоми за хранене'),
('Frozen Feeders', 'Замразена храна', 'frozen-feeders', '19bc54e1-4230-4d7f-b8bb-52ebd918dc77', NULL, 4, 'Frozen feeder animals', 'Замразена храна'),
('Canned Reptile Food', 'Консервирана храна', 'canned-reptile-food', '19bc54e1-4230-4d7f-b8bb-52ebd918dc77', NULL, 5, 'Canned reptile food', 'Консервирана храна за влечуги'),
('Herbivore Food', 'Храна за тревопасни', 'herbivore-food', '19bc54e1-4230-4d7f-b8bb-52ebd918dc77', NULL, 6, 'Food for herbivore reptiles', 'Храна за тревопасни влечуги'),
('Carnivore Food', 'Храна за месоядни', 'carnivore-food', '19bc54e1-4230-4d7f-b8bb-52ebd918dc77', NULL, 7, 'Food for carnivore reptiles', 'Храна за месоядни влечуги')
ON CONFLICT (slug) DO NOTHING;

-- Reptile Terrariums L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Glass Terrariums', 'Стъклени терариуми', 'glass-terrariums', '31f8e8f1-0281-46fb-b5c6-c2fb7e8cd542', NULL, 1, 'Glass terrariums', 'Стъклени терариуми'),
('Screen Terrariums', 'Мрежести терариуми', 'screen-terrariums', '31f8e8f1-0281-46fb-b5c6-c2fb7e8cd542', NULL, 2, 'Screen mesh terrariums', 'Мрежести терариуми'),
('Front-Opening Terrariums', 'Терариуми с предно отваряне', 'front-opening-terrariums', '31f8e8f1-0281-46fb-b5c6-c2fb7e8cd542', NULL, 3, 'Front-opening terrariums', 'Терариуми с предно отваряне'),
('Plastic Tubs', 'Пластмасови кутии', 'plastic-tubs', '31f8e8f1-0281-46fb-b5c6-c2fb7e8cd542', NULL, 4, 'Plastic reptile tubs', 'Пластмасови кутии за влечуги'),
('Terrarium Kits', 'Комплекти терариуми', 'terrarium-kits', '31f8e8f1-0281-46fb-b5c6-c2fb7e8cd542', NULL, 5, 'Terrarium starter kits', 'Комплекти терариуми за начинаещи'),
('Terrarium Stands', 'Стойки за терариуми', 'terrarium-stands', '31f8e8f1-0281-46fb-b5c6-c2fb7e8cd542', NULL, 6, 'Terrarium stands', 'Стойки за терариуми')
ON CONFLICT (slug) DO NOTHING;

-- Reptile Lighting L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('UVB Lights', 'UVB лампи', 'uvb-lights', 'dd623e94-7bb6-4a9a-9006-1c7c63060d5b', NULL, 1, 'UVB lighting for reptiles', 'UVB лампи за влечуги'),
('Basking Lights', 'Лампи за греене', 'basking-lights', 'dd623e94-7bb6-4a9a-9006-1c7c63060d5b', NULL, 2, 'Basking lights', 'Лампи за греене'),
('Night Lights', 'Нощни лампи', 'reptile-night-lights', 'dd623e94-7bb6-4a9a-9006-1c7c63060d5b', NULL, 3, 'Night viewing lights', 'Нощни лампи'),
('Light Fixtures', 'Осветителни тела', 'reptile-light-fixtures', 'dd623e94-7bb6-4a9a-9006-1c7c63060d5b', NULL, 4, 'Light fixtures and hoods', 'Осветителни тела и капаци'),
('Mercury Vapor Bulbs', 'Живачни лампи', 'mercury-vapor-bulbs', 'dd623e94-7bb6-4a9a-9006-1c7c63060d5b', NULL, 5, 'Mercury vapor bulbs', 'Живачни лампи'),
('Light Timers', 'Таймери за осветление', 'reptile-light-timers', 'dd623e94-7bb6-4a9a-9006-1c7c63060d5b', NULL, 6, 'Light timers', 'Таймери за осветление')
ON CONFLICT (slug) DO NOTHING;

-- Reptile Heating L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Heat Lamps', 'Нагревателни лампи', 'heat-lamps', 'f78b5f4b-f929-4b1b-b8a6-67290451c2fc', NULL, 1, 'Heat lamps', 'Нагревателни лампи'),
('Heat Mats', 'Нагревателни подложки', 'heat-mats', 'f78b5f4b-f929-4b1b-b8a6-67290451c2fc', NULL, 2, 'Under tank heat mats', 'Нагревателни подложки под терариум'),
('Ceramic Heat Emitters', 'Керамични нагреватели', 'ceramic-heat-emitters', 'f78b5f4b-f929-4b1b-b8a6-67290451c2fc', NULL, 3, 'Ceramic heat emitters', 'Керамични нагреватели'),
('Heat Rocks', 'Нагреваеми камъни', 'heat-rocks', 'f78b5f4b-f929-4b1b-b8a6-67290451c2fc', NULL, 4, 'Heat rocks', 'Нагреваеми камъни'),
('Heat Cables', 'Нагревателни кабели', 'heat-cables', 'f78b5f4b-f929-4b1b-b8a6-67290451c2fc', NULL, 5, 'Heat cables', 'Нагревателни кабели'),
('Thermostats', 'Термостати', 'reptile-thermostats', 'f78b5f4b-f929-4b1b-b8a6-67290451c2fc', NULL, 6, 'Temperature controllers', 'Термостати')
ON CONFLICT (slug) DO NOTHING;

-- Reptile Substrate L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Coconut Fiber', 'Кокосови влакна', 'coconut-fiber', 'eeb6b615-e262-4067-b100-ecf6d7417d44', NULL, 1, 'Coconut fiber substrate', 'Субстрат от кокосови влакна'),
('Reptile Bark', 'Кора за влечуги', 'reptile-bark', 'eeb6b615-e262-4067-b100-ecf6d7417d44', NULL, 2, 'Bark substrate', 'Субстрат от кора'),
('Reptile Sand', 'Пясък за влечуги', 'reptile-sand', 'eeb6b615-e262-4067-b100-ecf6d7417d44', NULL, 3, 'Sand substrate', 'Пясъчен субстрат'),
('Reptile Carpet', 'Килим за влечуги', 'reptile-carpet', 'eeb6b615-e262-4067-b100-ecf6d7417d44', NULL, 4, 'Reptile carpet', 'Килим за влечуги'),
('Moss Substrate', 'Мъх', 'moss-substrate', 'eeb6b615-e262-4067-b100-ecf6d7417d44', NULL, 5, 'Moss substrate', 'Мъх субстрат'),
('Paper Substrate', 'Хартиена постелка', 'reptile-paper-substrate', 'eeb6b615-e262-4067-b100-ecf6d7417d44', NULL, 6, 'Paper and liner substrate', 'Хартиена постелка')
ON CONFLICT (slug) DO NOTHING;

-- Reptile Decorations L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Branches & Vines', 'Клони и лиани', 'branches-vines', '54d8d999-5d1b-4b3a-b0de-8540fcfe1b0c', NULL, 1, 'Branches and vines', 'Клони и лиани'),
('Hides & Caves', 'Скривалища и пещери', 'reptile-hides-caves', '54d8d999-5d1b-4b3a-b0de-8540fcfe1b0c', NULL, 2, 'Hides and caves', 'Скривалища и пещери'),
('Rocks & Basking Platforms', 'Камъни и платформи', 'basking-platforms', '54d8d999-5d1b-4b3a-b0de-8540fcfe1b0c', NULL, 3, 'Rocks and basking platforms', 'Камъни и платформи за греене'),
('Artificial Plants', 'Изкуствени растения', 'reptile-artificial-plants', '54d8d999-5d1b-4b3a-b0de-8540fcfe1b0c', NULL, 4, 'Artificial plants', 'Изкуствени растения'),
('Live Plants', 'Живи растения', 'reptile-live-plants', '54d8d999-5d1b-4b3a-b0de-8540fcfe1b0c', NULL, 5, 'Live terrarium plants', 'Живи растения за терариум'),
('Backgrounds', 'Фонове', 'terrarium-backgrounds', '54d8d999-5d1b-4b3a-b0de-8540fcfe1b0c', NULL, 6, 'Terrarium backgrounds', 'Фонове за терариуми')
ON CONFLICT (slug) DO NOTHING;

-- Reptile Health L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Vitamins & Calcium', 'Витамини и калций', 'reptile-vitamins', '7356cd3c-bf0a-4516-84dd-56bcf5afedd3', NULL, 1, 'Vitamins and calcium supplements', 'Витамини и калциеви добавки'),
('Shedding Aids', 'Помощ при линеене', 'shedding-aids', '7356cd3c-bf0a-4516-84dd-56bcf5afedd3', NULL, 2, 'Shedding aid products', 'Продукти за помощ при линеене'),
('Reptile Medications', 'Лекарства за влечуги', 'reptile-medications', '7356cd3c-bf0a-4516-84dd-56bcf5afedd3', NULL, 3, 'Reptile medications', 'Лекарства за влечуги'),
('Mite Treatment', 'Третиране на кърлежи', 'reptile-mite-treatment', '7356cd3c-bf0a-4516-84dd-56bcf5afedd3', NULL, 4, 'Mite treatment products', 'Продукти против кърлежи'),
('Reptile First Aid', 'Първа помощ', 'reptile-first-aid', '7356cd3c-bf0a-4516-84dd-56bcf5afedd3', NULL, 5, 'First aid supplies', 'Консумативи за първа помощ')
ON CONFLICT (slug) DO NOTHING;

-- Reptile Bowls L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Water Dishes', 'Купички за вода', 'reptile-water-dishes', '9fb4b189-4d75-4617-832a-d72d7557f9a6', NULL, 1, 'Water dishes', 'Купички за вода'),
('Food Dishes', 'Купички за храна', 'reptile-food-dishes', '9fb4b189-4d75-4617-832a-d72d7557f9a6', NULL, 2, 'Food dishes', 'Купички за храна'),
('Waterfalls & Drippers', 'Водопади и капкомери', 'waterfalls-drippers', '9fb4b189-4d75-4617-832a-d72d7557f9a6', NULL, 3, 'Waterfalls and drippers', 'Водопади и капкомери'),
('Feeding Tongs', 'Щипки за хранене', 'feeding-tongs', '9fb4b189-4d75-4617-832a-d72d7557f9a6', NULL, 4, 'Feeding tongs', 'Щипки за хранене'),
('Insect Dishes', 'Купички за насекоми', 'insect-dishes', '9fb4b189-4d75-4617-832a-d72d7557f9a6', NULL, 5, 'Escape-proof insect dishes', 'Купички за насекоми без бягство')
ON CONFLICT (slug) DO NOTHING;

-- Reptile Humidity L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Misters & Foggers', 'Мъглогенератори', 'misters-foggers', '1151b86b-5f5f-4eef-a38b-0d4bcf580416', NULL, 1, 'Misters and foggers', 'Мъглогенератори'),
('Hygrometers', 'Хигрометри', 'hygrometers', '1151b86b-5f5f-4eef-a38b-0d4bcf580416', NULL, 2, 'Humidity gauges', 'Хигрометри'),
('Spray Bottles', 'Спрей бутилки', 'spray-bottles', '1151b86b-5f5f-4eef-a38b-0d4bcf580416', NULL, 3, 'Misting spray bottles', 'Спрей бутилки'),
('Humid Hides', 'Влажни скривалища', 'humid-hides', '1151b86b-5f5f-4eef-a38b-0d4bcf580416', NULL, 4, 'Humid hide boxes', 'Влажни скривалища'),
('Rain Systems', 'Дъждовни системи', 'rain-systems', '1151b86b-5f5f-4eef-a38b-0d4bcf580416', NULL, 5, 'Automatic rain systems', 'Автоматични дъждовни системи')
ON CONFLICT (slug) DO NOTHING;

-- Turtle Supplies L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Turtle Food', 'Храна за костенурки', 'turtle-food', '609d34d4-79d5-407b-9625-bbeabbc7b76f', NULL, 1, 'Food for turtles and tortoises', 'Храна за костенурки'),
('Turtle Tanks', 'Аквариуми за костенурки', 'turtle-tanks', '609d34d4-79d5-407b-9625-bbeabbc7b76f', NULL, 2, 'Tanks for aquatic turtles', 'Аквариуми за водни костенурки'),
('Turtle Docks', 'Платформи за костенурки', 'turtle-docks', '609d34d4-79d5-407b-9625-bbeabbc7b76f', NULL, 3, 'Basking docks for turtles', 'Платформи за греене за костенурки'),
('Turtle Filters', 'Филтри за костенурки', 'turtle-filters', '609d34d4-79d5-407b-9625-bbeabbc7b76f', NULL, 4, 'Filters for turtle tanks', 'Филтри за аквариуми с костенурки'),
('Tortoise Houses', 'Къщички за сухоземни костенурки', 'tortoise-houses', '609d34d4-79d5-407b-9625-bbeabbc7b76f', NULL, 5, 'Houses for tortoises', 'Къщички за сухоземни костенурки'),
('Turtle Health', 'Здраве на костенурки', 'turtle-health', '609d34d4-79d5-407b-9625-bbeabbc7b76f', NULL, 6, 'Health products for turtles', 'Здравни продукти за костенурки')
ON CONFLICT (slug) DO NOTHING;;
