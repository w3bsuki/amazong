-- Phase 3: Fish & Aquatic L3 Categories
-- Fish Food L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Flake Food', 'Люспеста храна', 'fish-flake-food', '3d78f767-f5f1-477c-bee5-e93fcd3dc396', NULL, 1, 'Fish flake food', 'Люспеста храна за риби'),
('Pellet Food', 'Пелетна храна', 'fish-pellet-food', '3d78f767-f5f1-477c-bee5-e93fcd3dc396', NULL, 2, 'Fish pellet food', 'Пелетна храна за риби'),
('Freeze-Dried Food', 'Лиофилизирана храна', 'fish-freeze-dried', '3d78f767-f5f1-477c-bee5-e93fcd3dc396', NULL, 3, 'Freeze-dried fish food', 'Лиофилизирана храна за риби'),
('Frozen Fish Food', 'Замразена храна', 'fish-frozen-food', '3d78f767-f5f1-477c-bee5-e93fcd3dc396', NULL, 4, 'Frozen fish food', 'Замразена храна за риби'),
('Live Food', 'Жива храна', 'fish-live-food', '3d78f767-f5f1-477c-bee5-e93fcd3dc396', NULL, 5, 'Live fish food', 'Жива храна за риби'),
('Betta Fish Food', 'Храна за бети', 'betta-food', '3d78f767-f5f1-477c-bee5-e93fcd3dc396', NULL, 6, 'Food for betta fish', 'Храна за бети'),
('Goldfish Food', 'Храна за златни рибки', 'goldfish-food', '3d78f767-f5f1-477c-bee5-e93fcd3dc396', NULL, 7, 'Food for goldfish', 'Храна за златни рибки'),
('Cichlid Food', 'Храна за цихлиди', 'cichlid-food', '3d78f767-f5f1-477c-bee5-e93fcd3dc396', NULL, 8, 'Food for cichlids', 'Храна за цихлиди'),
('Bottom Feeder Food', 'Храна за дънни риби', 'bottom-feeder-food', '3d78f767-f5f1-477c-bee5-e93fcd3dc396', NULL, 9, 'Food for bottom feeders', 'Храна за дънни риби'),
('Vacation Feeders', 'Автоматични хранилки', 'vacation-feeders', '3d78f767-f5f1-477c-bee5-e93fcd3dc396', NULL, 10, 'Vacation fish feeders', 'Автоматични хранилки за риби')
ON CONFLICT (slug) DO NOTHING;

-- Aquariums & Tanks L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Nano Aquariums', 'Нано аквариуми', 'nano-aquariums', 'e679f6fa-418a-495b-a658-6b79a87f9761', NULL, 1, 'Nano aquariums under 10 gallons', 'Нано аквариуми под 40 литра'),
('Small Aquariums', 'Малки аквариуми', 'small-aquariums', 'e679f6fa-418a-495b-a658-6b79a87f9761', NULL, 2, 'Small aquariums 10-30 gallons', 'Малки аквариуми 40-120 литра'),
('Medium Aquariums', 'Средни аквариуми', 'medium-aquariums', 'e679f6fa-418a-495b-a658-6b79a87f9761', NULL, 3, 'Medium aquariums 30-55 gallons', 'Средни аквариуми 120-200 литра'),
('Large Aquariums', 'Големи аквариуми', 'large-aquariums', 'e679f6fa-418a-495b-a658-6b79a87f9761', NULL, 4, 'Large aquariums over 55 gallons', 'Големи аквариуми над 200 литра'),
('Betta Tanks', 'Аквариуми за бети', 'betta-tanks', 'e679f6fa-418a-495b-a658-6b79a87f9761', NULL, 5, 'Tanks for betta fish', 'Аквариуми за бети'),
('Aquarium Kits', 'Комплекти аквариуми', 'aquarium-kits', 'e679f6fa-418a-495b-a658-6b79a87f9761', NULL, 6, 'Aquarium starter kits', 'Комплекти аквариуми за начинаещи'),
('Aquarium Stands', 'Стойки за аквариуми', 'aquarium-stands', 'e679f6fa-418a-495b-a658-6b79a87f9761', NULL, 7, 'Aquarium stands and cabinets', 'Стойки и шкафове за аквариуми')
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Filters L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('HOB Filters', 'Външни филтри HOB', 'hob-filters', 'f5b5e6c5-cb8a-457c-a319-70d6c6a31935', NULL, 1, 'Hang on back filters', 'Външни филтри за окачване'),
('Canister Filters', 'Канистрови филтри', 'canister-filters', 'f5b5e6c5-cb8a-457c-a319-70d6c6a31935', NULL, 2, 'Canister aquarium filters', 'Канистрови филтри за аквариуми'),
('Sponge Filters', 'Гъбени филтри', 'sponge-filters', 'f5b5e6c5-cb8a-457c-a319-70d6c6a31935', NULL, 3, 'Sponge aquarium filters', 'Гъбени филтри за аквариуми'),
('Internal Filters', 'Вътрешни филтри', 'internal-filters', 'f5b5e6c5-cb8a-457c-a319-70d6c6a31935', NULL, 4, 'Internal aquarium filters', 'Вътрешни филтри за аквариуми'),
('Undergravel Filters', 'Подгравелни филтри', 'undergravel-filters', 'f5b5e6c5-cb8a-457c-a319-70d6c6a31935', NULL, 5, 'Undergravel filters', 'Подгравелни филтри'),
('Filter Media', 'Филтърни материали', 'filter-media', 'f5b5e6c5-cb8a-457c-a319-70d6c6a31935', NULL, 6, 'Aquarium filter media', 'Филтърни материали за аквариуми'),
('Filter Replacement Parts', 'Резервни части за филтри', 'filter-parts', 'f5b5e6c5-cb8a-457c-a319-70d6c6a31935', NULL, 7, 'Filter replacement parts', 'Резервни части за филтри')
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Lighting L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('LED Aquarium Lights', 'LED осветление', 'led-aquarium-lights', '505d02d5-9dfc-447f-a6f8-c262dcb380c8', NULL, 1, 'LED aquarium lighting', 'LED осветление за аквариуми'),
('Fluorescent Lights', 'Флуоресцентно осветление', 'fluorescent-lights', '505d02d5-9dfc-447f-a6f8-c262dcb380c8', NULL, 2, 'Fluorescent aquarium lights', 'Флуоресцентно осветление за аквариуми'),
('Plant Growth Lights', 'Лампи за растения', 'plant-growth-lights', '505d02d5-9dfc-447f-a6f8-c262dcb380c8', NULL, 3, 'Lights for aquarium plants', 'Лампи за аквариумни растения'),
('Moonlights', 'Лунно осветление', 'moonlights', '505d02d5-9dfc-447f-a6f8-c262dcb380c8', NULL, 4, 'Moonlight aquarium lighting', 'Лунно осветление за аквариуми'),
('Light Timers', 'Таймери за осветление', 'light-timers', '505d02d5-9dfc-447f-a6f8-c262dcb380c8', NULL, 5, 'Aquarium light timers', 'Таймери за осветление'),
('Replacement Bulbs', 'Резервни крушки', 'replacement-bulbs', '505d02d5-9dfc-447f-a6f8-c262dcb380c8', NULL, 6, 'Replacement aquarium bulbs', 'Резервни крушки за аквариуми')
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Heaters L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Submersible Heaters', 'Потопяеми нагреватели', 'submersible-heaters', '95b9efc9-6062-4f5e-b5a0-6da2ac83bd10', NULL, 1, 'Submersible aquarium heaters', 'Потопяеми нагреватели за аквариуми'),
('Inline Heaters', 'Вградени нагреватели', 'inline-heaters', '95b9efc9-6062-4f5e-b5a0-6da2ac83bd10', NULL, 2, 'Inline aquarium heaters', 'Вградени нагреватели за аквариуми'),
('Preset Heaters', 'Предварително настроени нагреватели', 'preset-heaters', '95b9efc9-6062-4f5e-b5a0-6da2ac83bd10', NULL, 3, 'Preset temperature heaters', 'Предварително настроени нагреватели'),
('Adjustable Heaters', 'Регулируеми нагреватели', 'adjustable-heaters', '95b9efc9-6062-4f5e-b5a0-6da2ac83bd10', NULL, 4, 'Adjustable aquarium heaters', 'Регулируеми нагреватели'),
('Heating Mats', 'Нагревателни подложки', 'heating-mats', '95b9efc9-6062-4f5e-b5a0-6da2ac83bd10', NULL, 5, 'Aquarium heating mats', 'Нагревателни подложки за аквариуми'),
('Thermometers', 'Термометри', 'aquarium-thermometers', '95b9efc9-6062-4f5e-b5a0-6da2ac83bd10', NULL, 6, 'Aquarium thermometers', 'Термометри за аквариуми')
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Pumps L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Air Pumps', 'Въздушни помпи', 'air-pumps', 'fcffca72-1ad8-4c17-bfed-e2255ae05fce', NULL, 1, 'Aquarium air pumps', 'Въздушни помпи за аквариуми'),
('Water Pumps', 'Водни помпи', 'water-pumps', 'fcffca72-1ad8-4c17-bfed-e2255ae05fce', NULL, 2, 'Aquarium water pumps', 'Водни помпи за аквариуми'),
('Powerheads', 'Циркулационни помпи', 'powerheads', 'fcffca72-1ad8-4c17-bfed-e2255ae05fce', NULL, 3, 'Aquarium powerheads', 'Циркулационни помпи за аквариуми'),
('Wave Makers', 'Генератори на вълни', 'wave-makers', 'fcffca72-1ad8-4c17-bfed-e2255ae05fce', NULL, 4, 'Aquarium wave makers', 'Генератори на вълни'),
('Air Stones', 'Въздушни камъни', 'air-stones', 'fcffca72-1ad8-4c17-bfed-e2255ae05fce', NULL, 5, 'Aquarium air stones', 'Въздушни камъни за аквариуми'),
('Air Tubing', 'Въздушни тръби', 'air-tubing', 'fcffca72-1ad8-4c17-bfed-e2255ae05fce', NULL, 6, 'Aquarium air tubing', 'Въздушни тръби за аквариуми'),
('Check Valves', 'Възвратни клапани', 'check-valves', 'fcffca72-1ad8-4c17-bfed-e2255ae05fce', NULL, 7, 'Air check valves', 'Възвратни клапани')
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Decorations L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Artificial Plants', 'Изкуствени растения', 'artificial-plants', '0b901288-a520-4cf2-950d-c9954482c2c2', NULL, 1, 'Artificial aquarium plants', 'Изкуствени растения за аквариуми'),
('Live Plants', 'Живи растения', 'live-aquarium-plants', '0b901288-a520-4cf2-950d-c9954482c2c2', NULL, 2, 'Live aquarium plants', 'Живи аквариумни растения'),
('Rocks & Stones', 'Камъни и скали', 'aquarium-rocks', '0b901288-a520-4cf2-950d-c9954482c2c2', NULL, 3, 'Aquarium rocks and stones', 'Камъни и скали за аквариуми'),
('Driftwood', 'Плаващо дърво', 'aquarium-driftwood', '0b901288-a520-4cf2-950d-c9954482c2c2', NULL, 4, 'Aquarium driftwood', 'Плаващо дърво за аквариуми'),
('Ornaments', 'Декорации', 'aquarium-ornaments', '0b901288-a520-4cf2-950d-c9954482c2c2', NULL, 5, 'Aquarium ornaments and decorations', 'Декорации за аквариуми'),
('Backgrounds', 'Фонове', 'aquarium-backgrounds', '0b901288-a520-4cf2-950d-c9954482c2c2', NULL, 6, 'Aquarium backgrounds', 'Фонове за аквариуми'),
('Caves & Hideouts', 'Пещери и скривалища', 'aquarium-caves', '0b901288-a520-4cf2-950d-c9954482c2c2', NULL, 7, 'Aquarium caves and hideouts', 'Пещери и скривалища за аквариуми')
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Substrate L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Gravel', 'Чакъл', 'aquarium-gravel', 'aa18a97a-3687-46f1-b934-f93e94564cdc', NULL, 1, 'Aquarium gravel', 'Чакъл за аквариуми'),
('Sand', 'Пясък', 'aquarium-sand', 'aa18a97a-3687-46f1-b934-f93e94564cdc', NULL, 2, 'Aquarium sand', 'Пясък за аквариуми'),
('Plant Substrate', 'Субстрат за растения', 'plant-substrate', 'aa18a97a-3687-46f1-b934-f93e94564cdc', NULL, 3, 'Substrate for planted aquariums', 'Субстрат за аквариуми с растения'),
('Crushed Coral', 'Натрошени корали', 'crushed-coral', 'aa18a97a-3687-46f1-b934-f93e94564cdc', NULL, 4, 'Crushed coral substrate', 'Натрошени корали за субстрат'),
('Colored Gravel', 'Цветен чакъл', 'colored-gravel', 'aa18a97a-3687-46f1-b934-f93e94564cdc', NULL, 5, 'Colored aquarium gravel', 'Цветен чакъл за аквариуми')
ON CONFLICT (slug) DO NOTHING;

-- Water Care L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Water Conditioners', 'Препарати за вода', 'water-conditioners', '6becbc0e-63ef-40eb-ae7d-2e725ab3fc6f', NULL, 1, 'Water conditioners', 'Препарати за подготовка на вода'),
('Test Kits', 'Тестови комплекти', 'water-test-kits', '6becbc0e-63ef-40eb-ae7d-2e725ab3fc6f', NULL, 2, 'Water test kits', 'Тестови комплекти за вода'),
('pH Adjusters', 'Регулатори на pH', 'ph-adjusters', '6becbc0e-63ef-40eb-ae7d-2e725ab3fc6f', NULL, 3, 'pH adjusters for aquariums', 'Регулатори на pH за аквариуми'),
('Biological Boosters', 'Биологични усилватели', 'biological-boosters', '6becbc0e-63ef-40eb-ae7d-2e725ab3fc6f', NULL, 4, 'Biological boosters', 'Биологични усилватели'),
('Algae Control', 'Контрол на водорасли', 'algae-control', '6becbc0e-63ef-40eb-ae7d-2e725ab3fc6f', NULL, 5, 'Algae control products', 'Продукти за контрол на водорасли'),
('Fish Medication', 'Лекарства за риби', 'fish-medication', '6becbc0e-63ef-40eb-ae7d-2e725ab3fc6f', NULL, 6, 'Fish medications and treatments', 'Лекарства и лечения за риби')
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Cleaning L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Gravel Vacuums', 'Сифони за чакъл', 'gravel-vacuums', '31329e25-d449-470c-9e11-81b715783253', NULL, 1, 'Gravel vacuum cleaners', 'Сифони за почистване на чакъл'),
('Algae Scrapers', 'Стъргалки за водорасли', 'algae-scrapers', '31329e25-d449-470c-9e11-81b715783253', NULL, 2, 'Algae scrapers and cleaners', 'Стъргалки за водорасли'),
('Magnetic Cleaners', 'Магнитни почистващи средства', 'magnetic-cleaners', '31329e25-d449-470c-9e11-81b715783253', NULL, 3, 'Magnetic glass cleaners', 'Магнитни почистващи средства за стъкло'),
('Brushes & Nets', 'Четки и мрежи', 'brushes-nets', '31329e25-d449-470c-9e11-81b715783253', NULL, 4, 'Aquarium brushes and nets', 'Четки и мрежи за аквариуми'),
('Water Changers', 'Устройства за смяна на вода', 'water-changers', '31329e25-d449-470c-9e11-81b715783253', NULL, 5, 'Water changing systems', 'Устройства за смяна на вода')
ON CONFLICT (slug) DO NOTHING;

-- Pond Supplies L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Pond Liners', 'Фолио за езера', 'pond-liners', 'b6f840b0-c5a2-4d4d-ac6e-424de17fa3d4', NULL, 1, 'Pond liners and underlays', 'Фолио и подложки за езера'),
('Pond Pumps', 'Помпи за езера', 'pond-pumps', 'b6f840b0-c5a2-4d4d-ac6e-424de17fa3d4', NULL, 2, 'Pond water pumps', 'Помпи за езера'),
('Pond Filters', 'Филтри за езера', 'pond-filters', 'b6f840b0-c5a2-4d4d-ac6e-424de17fa3d4', NULL, 3, 'Pond filtration systems', 'Филтри за езера'),
('Pond Fish Food', 'Храна за езерни риби', 'pond-fish-food', 'b6f840b0-c5a2-4d4d-ac6e-424de17fa3d4', NULL, 4, 'Food for pond fish', 'Храна за езерни риби'),
('Pond Lighting', 'Осветление за езера', 'pond-lighting', 'b6f840b0-c5a2-4d4d-ac6e-424de17fa3d4', NULL, 5, 'Pond lighting systems', 'Осветление за езера'),
('Pond Plants', 'Езерни растения', 'pond-plants', 'b6f840b0-c5a2-4d4d-ac6e-424de17fa3d4', NULL, 6, 'Plants for ponds', 'Растения за езера')
ON CONFLICT (slug) DO NOTHING;

-- Saltwater & Marine L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Marine Salt', 'Морска сол', 'marine-salt', 'beab32a5-ef53-4cf4-85ab-9320be33c1de', NULL, 1, 'Marine aquarium salt', 'Морска сол за аквариуми'),
('Protein Skimmers', 'Протеинови скимери', 'protein-skimmers', 'beab32a5-ef53-4cf4-85ab-9320be33c1de', NULL, 2, 'Protein skimmers', 'Протеинови скимери'),
('Live Rock', 'Жив камък', 'live-rock', 'beab32a5-ef53-4cf4-85ab-9320be33c1de', NULL, 3, 'Live rock for marine tanks', 'Жив камък за морски аквариуми'),
('Coral Food & Supplements', 'Храна за корали', 'coral-food', 'beab32a5-ef53-4cf4-85ab-9320be33c1de', NULL, 4, 'Coral food and supplements', 'Храна и добавки за корали'),
('Reef Lighting', 'Рифово осветление', 'reef-lighting', 'beab32a5-ef53-4cf4-85ab-9320be33c1de', NULL, 5, 'Lighting for reef aquariums', 'Осветление за рифови аквариуми'),
('Marine Test Kits', 'Морски тестови комплекти', 'marine-test-kits', 'beab32a5-ef53-4cf4-85ab-9320be33c1de', NULL, 6, 'Marine water test kits', 'Тестови комплекти за морска вода')
ON CONFLICT (slug) DO NOTHING;;
