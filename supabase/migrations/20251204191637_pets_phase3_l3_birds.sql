-- Phase 3: Birds L3 Categories
-- Bird Food L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Seed Mixes', 'Смеси от семена', 'bird-seed-mixes', '35a90b67-2d96-45a9-a7e0-523a8e8e7e4f', NULL, 1, 'Bird seed mixes', 'Смеси от семена за птици'),
('Pellet Food', 'Пелетна храна', 'bird-pellet-food', '35a90b67-2d96-45a9-a7e0-523a8e8e7e4f', NULL, 2, 'Bird pellet food', 'Пелетна храна за птици'),
('Fruit & Vegetable Blends', 'Смеси с плодове и зеленчуци', 'bird-fruit-veggie', '35a90b67-2d96-45a9-a7e0-523a8e8e7e4f', NULL, 3, 'Bird fruit and vegetable blends', 'Смеси с плодове и зеленчуци за птици'),
('Nectar & Soft Foods', 'Нектар и меки храни', 'bird-nectar-soft', '35a90b67-2d96-45a9-a7e0-523a8e8e7e4f', NULL, 4, 'Nectar and soft bird foods', 'Нектар и меки храни за птици'),
('Canary Food', 'Храна за канарчета', 'canary-food', '35a90b67-2d96-45a9-a7e0-523a8e8e7e4f', NULL, 5, 'Food for canaries', 'Храна за канарчета'),
('Parakeet Food', 'Храна за папагалчета', 'parakeet-food', '35a90b67-2d96-45a9-a7e0-523a8e8e7e4f', NULL, 6, 'Food for parakeets', 'Храна за папагалчета'),
('Parrot Food', 'Храна за папагали', 'parrot-food', '35a90b67-2d96-45a9-a7e0-523a8e8e7e4f', NULL, 7, 'Food for parrots', 'Храна за папагали'),
('Finch Food', 'Храна за чинки', 'finch-food', '35a90b67-2d96-45a9-a7e0-523a8e8e7e4f', NULL, 8, 'Food for finches', 'Храна за чинки')
ON CONFLICT (slug) DO NOTHING;

-- Bird Treats L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Millet Sprays', 'Стръкове от просо', 'bird-millet-sprays', 'e0c866a9-0ecc-44a8-9b39-4def628814bb', NULL, 1, 'Millet spray treats', 'Стръкове от просо за птици'),
('Fruit Treats', 'Плодови лакомства', 'bird-fruit-treats', 'e0c866a9-0ecc-44a8-9b39-4def628814bb', NULL, 2, 'Bird fruit treats', 'Плодови лакомства за птици'),
('Seed Sticks', 'Пръчки със семена', 'bird-seed-sticks', 'e0c866a9-0ecc-44a8-9b39-4def628814bb', NULL, 3, 'Bird seed stick treats', 'Пръчки със семена за птици'),
('Honey Sticks', 'Медени пръчки', 'bird-honey-sticks', 'e0c866a9-0ecc-44a8-9b39-4def628814bb', NULL, 4, 'Bird honey stick treats', 'Медени пръчки за птици'),
('Egg & Protein Treats', 'Яйчени и протеинови лакомства', 'bird-protein-treats', 'e0c866a9-0ecc-44a8-9b39-4def628814bb', NULL, 5, 'Egg and protein treats for birds', 'Яйчени и протеинови лакомства за птици')
ON CONFLICT (slug) DO NOTHING;

-- Bird Cages L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Small Bird Cages', 'Клетки за малки птици', 'small-bird-cages', '7ab1740d-6a7a-40cd-aed3-e220fc190069', NULL, 1, 'Cages for small birds', 'Клетки за малки птици'),
('Medium Bird Cages', 'Клетки за средни птици', 'medium-bird-cages', '7ab1740d-6a7a-40cd-aed3-e220fc190069', NULL, 2, 'Cages for medium birds', 'Клетки за средни птици'),
('Large Bird Cages', 'Клетки за големи птици', 'large-bird-cages', '7ab1740d-6a7a-40cd-aed3-e220fc190069', NULL, 3, 'Cages for large birds', 'Клетки за големи птици'),
('Flight Cages & Aviaries', 'Волиери и летящи клетки', 'bird-aviaries', '7ab1740d-6a7a-40cd-aed3-e220fc190069', NULL, 4, 'Flight cages and aviaries', 'Волиери и летящи клетки'),
('Travel Cages', 'Транспортни клетки', 'bird-travel-cages', '7ab1740d-6a7a-40cd-aed3-e220fc190069', NULL, 5, 'Travel cages for birds', 'Транспортни клетки за птици'),
('Cage Covers', 'Покривала за клетки', 'bird-cage-covers', '7ab1740d-6a7a-40cd-aed3-e220fc190069', NULL, 6, 'Bird cage covers', 'Покривала за птичи клетки')
ON CONFLICT (slug) DO NOTHING;

-- Bird Toys L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Swings & Rings', 'Люлки и рингове', 'bird-swings', 'bc0cf863-ffb1-44bc-8fda-e9440ce39859', NULL, 1, 'Bird swings and rings', 'Люлки и рингове за птици'),
('Ladders & Bridges', 'Стълби и мостове', 'bird-ladders', 'bc0cf863-ffb1-44bc-8fda-e9440ce39859', NULL, 2, 'Bird ladders and bridges', 'Стълби и мостове за птици'),
('Chew & Shred Toys', 'Играчки за дъвчене', 'bird-chew-toys', 'bc0cf863-ffb1-44bc-8fda-e9440ce39859', NULL, 3, 'Bird chew and shred toys', 'Играчки за дъвчене за птици'),
('Foraging Toys', 'Играчки за търсене на храна', 'bird-foraging-toys', 'bc0cf863-ffb1-44bc-8fda-e9440ce39859', NULL, 4, 'Bird foraging toys', 'Играчки за търсене на храна'),
('Mirrors & Bells', 'Огледала и звънчета', 'bird-mirrors-bells', 'bc0cf863-ffb1-44bc-8fda-e9440ce39859', NULL, 5, 'Bird mirrors and bells', 'Огледала и звънчета за птици'),
('Puzzle Toys', 'Пъзел играчки', 'bird-puzzle-toys', 'bc0cf863-ffb1-44bc-8fda-e9440ce39859', NULL, 6, 'Bird puzzle toys', 'Пъзел играчки за птици')
ON CONFLICT (slug) DO NOTHING;

-- Bird Perches L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Wood Perches', 'Дървени кацалки', 'bird-wood-perches', 'd06bd3f9-d7de-4a34-8980-8cec20febfe5', NULL, 1, 'Wooden bird perches', 'Дървени кацалки за птици'),
('Rope Perches', 'Въжени кацалки', 'bird-rope-perches', 'd06bd3f9-d7de-4a34-8980-8cec20febfe5', NULL, 2, 'Rope bird perches', 'Въжени кацалки за птици'),
('Heated Perches', 'Отопляеми кацалки', 'bird-heated-perches', 'd06bd3f9-d7de-4a34-8980-8cec20febfe5', NULL, 3, 'Heated bird perches', 'Отопляеми кацалки за птици'),
('Grooming Perches', 'Кацалки за грууминг', 'bird-grooming-perches', 'd06bd3f9-d7de-4a34-8980-8cec20febfe5', NULL, 4, 'Grooming perches for birds', 'Кацалки за грууминг на птици'),
('Play Stands', 'Стойки за игра', 'bird-play-stands', 'd06bd3f9-d7de-4a34-8980-8cec20febfe5', NULL, 5, 'Bird play stands', 'Стойки за игра на птици'),
('T-Stands', 'Т-образни стойки', 'bird-t-stands', 'd06bd3f9-d7de-4a34-8980-8cec20febfe5', NULL, 6, 'Bird T-stands', 'Т-образни стойки за птици')
ON CONFLICT (slug) DO NOTHING;

-- Bird Health L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Bird Vitamins & Supplements', 'Витамини и добавки', 'bird-vitamins', 'e7b7a35f-2abd-440c-a5c2-b8eff992518c', NULL, 1, 'Bird vitamins and supplements', 'Витамини и добавки за птици'),
('Bird Grooming Tools', 'Инструменти за грууминг', 'bird-grooming-tools', 'e7b7a35f-2abd-440c-a5c2-b8eff992518c', NULL, 2, 'Bird grooming tools', 'Инструменти за грууминг на птици'),
('Nail Clippers', 'Ножички за нокти', 'bird-nail-clippers', 'e7b7a35f-2abd-440c-a5c2-b8eff992518c', NULL, 3, 'Bird nail clippers', 'Ножички за нокти за птици'),
('Mite & Lice Treatment', 'Препарати против паразити', 'bird-mite-treatment', 'e7b7a35f-2abd-440c-a5c2-b8eff992518c', NULL, 4, 'Bird mite and lice treatment', 'Препарати против паразити за птици'),
('Bird Baths', 'Вани за птици', 'bird-baths', 'e7b7a35f-2abd-440c-a5c2-b8eff992518c', NULL, 5, 'Bird baths', 'Вани за птици'),
('Feather Care', 'Грижа за перата', 'bird-feather-care', 'e7b7a35f-2abd-440c-a5c2-b8eff992518c', NULL, 6, 'Bird feather care products', 'Продукти за грижа за перата')
ON CONFLICT (slug) DO NOTHING;

-- Bird Nesting L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Nesting Boxes', 'Гнездови кутии', 'bird-nesting-boxes', 'c25171b6-8e6b-44a2-8c99-32fcf6b255bd', NULL, 1, 'Bird nesting boxes', 'Гнездови кутии за птици'),
('Nesting Material', 'Материал за гнезда', 'bird-nesting-material', 'c25171b6-8e6b-44a2-8c99-32fcf6b255bd', NULL, 2, 'Bird nesting material', 'Материал за гнезда'),
('Breeding Cages', 'Клетки за размножаване', 'bird-breeding-cages', 'c25171b6-8e6b-44a2-8c99-32fcf6b255bd', NULL, 3, 'Bird breeding cages', 'Клетки за размножаване'),
('Egg Incubators', 'Инкубатори за яйца', 'bird-incubators', 'c25171b6-8e6b-44a2-8c99-32fcf6b255bd', NULL, 4, 'Bird egg incubators', 'Инкубатори за яйца'),
('Hand Feeding Supplies', 'Консумативи за ръчно хранене', 'bird-hand-feeding', 'c25171b6-8e6b-44a2-8c99-32fcf6b255bd', NULL, 5, 'Bird hand feeding supplies', 'Консумативи за ръчно хранене')
ON CONFLICT (slug) DO NOTHING;

-- Bird Cage Accessories L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Cage Liners', 'Подложки за клетки', 'bird-cage-liners', 'e9fd9cf2-5800-4ed1-b338-5b2426142c5a', NULL, 1, 'Bird cage liners', 'Подложки за клетки'),
('Seed Guards', 'Предпазители от семена', 'bird-seed-guards', 'e9fd9cf2-5800-4ed1-b338-5b2426142c5a', NULL, 2, 'Bird cage seed guards', 'Предпазители от семена'),
('Cage Cleaning Supplies', 'Почистващи препарати', 'bird-cage-cleaning', 'e9fd9cf2-5800-4ed1-b338-5b2426142c5a', NULL, 3, 'Bird cage cleaning supplies', 'Почистващи препарати за клетки'),
('Food & Water Cups', 'Купички за храна и вода', 'bird-food-cups', 'e9fd9cf2-5800-4ed1-b338-5b2426142c5a', NULL, 4, 'Bird food and water cups', 'Купички за храна и вода'),
('Cuttlebones & Mineral Blocks', 'Сепия и минерални блокове', 'bird-cuttlebones', 'e9fd9cf2-5800-4ed1-b338-5b2426142c5a', NULL, 5, 'Cuttlebones and mineral blocks', 'Сепия и минерални блокове')
ON CONFLICT (slug) DO NOTHING;

-- Bird Carriers L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Small Bird Carriers', 'Транспортни чанти за малки птици', 'small-bird-carriers', 'a8d7b502-63cc-4f9f-ade1-4938382ec643', NULL, 1, 'Carriers for small birds', 'Транспортни чанти за малки птици'),
('Large Bird Carriers', 'Транспортни чанти за големи птици', 'large-bird-carriers', 'a8d7b502-63cc-4f9f-ade1-4938382ec643', NULL, 2, 'Carriers for large birds', 'Транспортни чанти за големи птици'),
('Bird Backpacks', 'Раници за птици', 'bird-backpacks', 'a8d7b502-63cc-4f9f-ade1-4938382ec643', NULL, 3, 'Bird backpack carriers', 'Раници за птици'),
('Bird Harnesses & Leashes', 'Нагръдници и каишки', 'bird-harnesses', 'a8d7b502-63cc-4f9f-ade1-4938382ec643', NULL, 4, 'Bird harnesses and leashes', 'Нагръдници и каишки за птици')
ON CONFLICT (slug) DO NOTHING;;
