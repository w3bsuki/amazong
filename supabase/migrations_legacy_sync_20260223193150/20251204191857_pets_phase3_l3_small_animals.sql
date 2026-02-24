-- Phase 3: Small Animals L3 Categories
-- Small Animal Food L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Rabbit Food', 'Храна за зайци', 'rabbit-food', '585e7885-b9c7-4685-a0af-4cbc1b73661e', NULL, 1, 'Food for rabbits', 'Храна за зайци'),
('Guinea Pig Food', 'Храна за морски свинчета', 'guinea-pig-food', '585e7885-b9c7-4685-a0af-4cbc1b73661e', NULL, 2, 'Food for guinea pigs', 'Храна за морски свинчета'),
('Hamster Food', 'Храна за хамстери', 'hamster-food', '585e7885-b9c7-4685-a0af-4cbc1b73661e', NULL, 3, 'Food for hamsters', 'Храна за хамстери'),
('Gerbil Food', 'Храна за джербили', 'gerbil-food', '585e7885-b9c7-4685-a0af-4cbc1b73661e', NULL, 4, 'Food for gerbils', 'Храна за джербили'),
('Chinchilla Food', 'Храна за чинчили', 'chinchilla-food', '585e7885-b9c7-4685-a0af-4cbc1b73661e', NULL, 5, 'Food for chinchillas', 'Храна за чинчили'),
('Rat & Mouse Food', 'Храна за плъхове и мишки', 'rat-mouse-food', '585e7885-b9c7-4685-a0af-4cbc1b73661e', NULL, 6, 'Food for rats and mice', 'Храна за плъхове и мишки'),
('Hedgehog Food', 'Храна за таралежи', 'hedgehog-food', '585e7885-b9c7-4685-a0af-4cbc1b73661e', NULL, 7, 'Food for hedgehogs', 'Храна за таралежи'),
('Sugar Glider Food', 'Храна за захарни плъхчета', 'sugar-glider-food', '585e7885-b9c7-4685-a0af-4cbc1b73661e', NULL, 8, 'Food for sugar gliders', 'Храна за захарни плъхчета')
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Treats L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Hay Treats', 'Лакомства от сено', 'hay-treats', '0dfabd9c-3c65-45fe-a7f0-64783e330f61', NULL, 1, 'Hay-based treats', 'Лакомства от сено'),
('Fruit Treats', 'Плодови лакомства', 'small-animal-fruit-treats', '0dfabd9c-3c65-45fe-a7f0-64783e330f61', NULL, 2, 'Fruit treats for small animals', 'Плодови лакомства за малки животни'),
('Vegetable Treats', 'Зеленчукови лакомства', 'small-animal-veggie-treats', '0dfabd9c-3c65-45fe-a7f0-64783e330f61', NULL, 3, 'Vegetable treats', 'Зеленчукови лакомства'),
('Chew Sticks', 'Пръчки за гризане', 'chew-sticks', '0dfabd9c-3c65-45fe-a7f0-64783e330f61', NULL, 4, 'Chew sticks for small animals', 'Пръчки за гризане'),
('Seed & Grain Treats', 'Лакомства от семена', 'seed-grain-treats', '0dfabd9c-3c65-45fe-a7f0-64783e330f61', NULL, 5, 'Seed and grain treats', 'Лакомства от семена и зърна'),
('Yogurt Drops', 'Кисело мляко капки', 'yogurt-drops', '0dfabd9c-3c65-45fe-a7f0-64783e330f61', NULL, 6, 'Yogurt drop treats', 'Лакомства с кисело мляко')
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Hay L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Timothy Hay', 'Тимотейка', 'timothy-hay', '06d5b155-7272-48d0-b04c-982836278049', NULL, 1, 'Timothy hay for small animals', 'Тимотейка за малки животни'),
('Orchard Grass', 'Ливадна трева', 'orchard-grass', '06d5b155-7272-48d0-b04c-982836278049', NULL, 2, 'Orchard grass hay', 'Ливадна трева'),
('Alfalfa Hay', 'Люцерна', 'alfalfa-hay', '06d5b155-7272-48d0-b04c-982836278049', NULL, 3, 'Alfalfa hay', 'Люцерна'),
('Oat Hay', 'Овесено сено', 'oat-hay', '06d5b155-7272-48d0-b04c-982836278049', NULL, 4, 'Oat hay', 'Овесено сено'),
('Mixed Hay', 'Смесено сено', 'mixed-hay', '06d5b155-7272-48d0-b04c-982836278049', NULL, 5, 'Mixed grass hay', 'Смесено сено')
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Cages L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Rabbit Cages', 'Клетки за зайци', 'rabbit-cages', '51580d84-9dd2-4ef2-864a-50e6614f7a6d', NULL, 1, 'Cages for rabbits', 'Клетки за зайци'),
('Guinea Pig Cages', 'Клетки за морски свинчета', 'guinea-pig-cages', '51580d84-9dd2-4ef2-864a-50e6614f7a6d', NULL, 2, 'Cages for guinea pigs', 'Клетки за морски свинчета'),
('Hamster Cages', 'Клетки за хамстери', 'hamster-cages', '51580d84-9dd2-4ef2-864a-50e6614f7a6d', NULL, 3, 'Cages for hamsters', 'Клетки за хамстери'),
('Wire Cages', 'Телени клетки', 'wire-cages', '51580d84-9dd2-4ef2-864a-50e6614f7a6d', NULL, 4, 'Wire mesh cages', 'Телени клетки'),
('Modular Cages', 'Модулни клетки', 'modular-cages', '51580d84-9dd2-4ef2-864a-50e6614f7a6d', NULL, 5, 'Modular cage systems', 'Модулни клетки'),
('Playpens', 'Кошари за игра', 'small-animal-playpens', '51580d84-9dd2-4ef2-864a-50e6614f7a6d', NULL, 6, 'Playpens for small animals', 'Кошари за игра'),
('Outdoor Hutches', 'Външни клетки', 'outdoor-hutches', '51580d84-9dd2-4ef2-864a-50e6614f7a6d', NULL, 7, 'Outdoor hutches', 'Външни клетки за малки животни')
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Bedding L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Paper Bedding', 'Постелка от хартия', 'paper-bedding', 'b77b8d0f-9302-4b8d-ae06-ad5fd7410ade', NULL, 1, 'Paper-based bedding', 'Постелка от хартия'),
('Wood Shavings', 'Дървени стружки', 'wood-shavings', 'b77b8d0f-9302-4b8d-ae06-ad5fd7410ade', NULL, 2, 'Wood shaving bedding', 'Дървени стружки'),
('Fleece Bedding', 'Полар постелка', 'fleece-bedding', 'b77b8d0f-9302-4b8d-ae06-ad5fd7410ade', NULL, 3, 'Fleece bedding liners', 'Полар постелка'),
('Hemp Bedding', 'Конопена постелка', 'hemp-bedding', 'b77b8d0f-9302-4b8d-ae06-ad5fd7410ade', NULL, 4, 'Hemp fiber bedding', 'Конопена постелка'),
('Corn Cob Bedding', 'Постелка от царевични кочани', 'corn-cob-bedding', 'b77b8d0f-9302-4b8d-ae06-ad5fd7410ade', NULL, 5, 'Corn cob bedding', 'Постелка от царевични кочани'),
('Nesting Material', 'Материал за гнезда', 'small-animal-nesting', 'b77b8d0f-9302-4b8d-ae06-ad5fd7410ade', NULL, 6, 'Nesting material', 'Материал за гнезда')
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Toys L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Exercise Wheels', 'Колела за бягане', 'exercise-wheels', '60a34dac-7237-42c6-b5cb-c6545b706300', NULL, 1, 'Exercise wheels for small animals', 'Колела за бягане'),
('Exercise Balls', 'Топки за бягане', 'exercise-balls', '60a34dac-7237-42c6-b5cb-c6545b706300', NULL, 2, 'Exercise balls', 'Топки за бягане'),
('Tunnels & Tubes', 'Тунели и тръби', 'tunnels-tubes', '60a34dac-7237-42c6-b5cb-c6545b706300', NULL, 3, 'Tunnels and tubes', 'Тунели и тръби'),
('Chew Toys', 'Играчки за гризане', 'small-animal-chew-toys', '60a34dac-7237-42c6-b5cb-c6545b706300', NULL, 4, 'Chew toys for small animals', 'Играчки за гризане'),
('Hideouts', 'Скривалища', 'small-animal-hideouts', '60a34dac-7237-42c6-b5cb-c6545b706300', NULL, 5, 'Hideouts and houses', 'Скривалища и къщички'),
('Wooden Toys', 'Дървени играчки', 'small-animal-wooden-toys', '60a34dac-7237-42c6-b5cb-c6545b706300', NULL, 6, 'Wooden toys', 'Дървени играчки'),
('Hanging Toys', 'Висящи играчки', 'small-animal-hanging-toys', '60a34dac-7237-42c6-b5cb-c6545b706300', NULL, 7, 'Hanging toys', 'Висящи играчки')
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Health L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Vitamins & Supplements', 'Витамини и добавки', 'small-animal-vitamins', 'c642775c-ad05-4de8-a575-f2aa407bac8b', NULL, 1, 'Vitamins and supplements', 'Витамини и добавки'),
('Probiotics', 'Пробиотици', 'small-animal-probiotics', 'c642775c-ad05-4de8-a575-f2aa407bac8b', NULL, 2, 'Probiotics for small animals', 'Пробиотици за малки животни'),
('Dental Care', 'Грижа за зъби', 'small-animal-dental', 'c642775c-ad05-4de8-a575-f2aa407bac8b', NULL, 3, 'Dental care products', 'Продукти за грижа за зъби'),
('First Aid', 'Първа помощ', 'small-animal-first-aid', 'c642775c-ad05-4de8-a575-f2aa407bac8b', NULL, 4, 'First aid supplies', 'Консумативи за първа помощ'),
('Parasite Control', 'Контрол на паразити', 'small-animal-parasite', 'c642775c-ad05-4de8-a575-f2aa407bac8b', NULL, 5, 'Parasite control products', 'Продукти против паразити')
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Grooming L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Brushes & Combs', 'Четки и гребени', 'small-animal-brushes', 'a416856a-6dc6-48c5-b89d-801e5d2c7c6d', NULL, 1, 'Brushes and combs', 'Четки и гребени'),
('Nail Clippers', 'Ножички за нокти', 'small-animal-nail-clippers', 'a416856a-6dc6-48c5-b89d-801e5d2c7c6d', NULL, 2, 'Nail clippers', 'Ножички за нокти'),
('Shampoos & Sprays', 'Шампоани и спрейове', 'small-animal-shampoos', 'a416856a-6dc6-48c5-b89d-801e5d2c7c6d', NULL, 3, 'Shampoos and grooming sprays', 'Шампоани и спрейове за грууминг'),
('Dust Baths', 'Прахови бани', 'dust-baths', 'a416856a-6dc6-48c5-b89d-801e5d2c7c6d', NULL, 4, 'Dust bath products', 'Продукти за прахови бани'),
('Ear & Eye Care', 'Грижа за уши и очи', 'small-animal-ear-eye', 'a416856a-6dc6-48c5-b89d-801e5d2c7c6d', NULL, 5, 'Ear and eye care', 'Грижа за уши и очи')
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Bowls L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Food Bowls', 'Купички за храна', 'small-animal-food-bowls', 'e9d300b5-4228-49e7-a520-e3f00e72d2c2', NULL, 1, 'Food bowls', 'Купички за храна'),
('Water Bottles', 'Бутилки за вода', 'water-bottles', 'e9d300b5-4228-49e7-a520-e3f00e72d2c2', NULL, 2, 'Water bottles', 'Бутилки за вода'),
('Water Bowls', 'Купички за вода', 'small-animal-water-bowls', 'e9d300b5-4228-49e7-a520-e3f00e72d2c2', NULL, 3, 'Water bowls', 'Купички за вода'),
('Hay Racks', 'Стойки за сено', 'hay-racks', 'e9d300b5-4228-49e7-a520-e3f00e72d2c2', NULL, 4, 'Hay racks and feeders', 'Стойки за сено'),
('Automatic Feeders', 'Автоматични хранилки', 'small-animal-auto-feeders', 'e9d300b5-4228-49e7-a520-e3f00e72d2c2', NULL, 5, 'Automatic feeders', 'Автоматични хранилки')
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Carriers L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Hard-Sided Carriers', 'Твърди транспортни чанти', 'hard-sided-small-carriers', 'cb29e01d-e806-44e4-b03c-ad713d26fecd', NULL, 1, 'Hard-sided carriers', 'Твърди транспортни чанти'),
('Soft-Sided Carriers', 'Меки транспортни чанти', 'soft-sided-small-carriers', 'cb29e01d-e806-44e4-b03c-ad713d26fecd', NULL, 2, 'Soft-sided carriers', 'Меки транспортни чанти'),
('Travel Cages', 'Транспортни клетки', 'small-animal-travel-cages', 'cb29e01d-e806-44e4-b03c-ad713d26fecd', NULL, 3, 'Travel cages', 'Транспортни клетки'),
('Harnesses & Leashes', 'Нагръдници и каишки', 'small-animal-harnesses', 'cb29e01d-e806-44e4-b03c-ad713d26fecd', NULL, 4, 'Harnesses and leashes', 'Нагръдници и каишки')
ON CONFLICT (slug) DO NOTHING;

-- Ferret Supplies L3
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES 
('Ferret Food', 'Храна за порове', 'ferret-food', 'bcb4dd61-53ad-443a-92cd-eafeae4bc698', NULL, 1, 'Food for ferrets', 'Храна за порове'),
('Ferret Treats', 'Лакомства за порове', 'ferret-treats', 'bcb4dd61-53ad-443a-92cd-eafeae4bc698', NULL, 2, 'Treats for ferrets', 'Лакомства за порове'),
('Ferret Cages', 'Клетки за порове', 'ferret-cages', 'bcb4dd61-53ad-443a-92cd-eafeae4bc698', NULL, 3, 'Cages for ferrets', 'Клетки за порове'),
('Ferret Toys', 'Играчки за порове', 'ferret-toys', 'bcb4dd61-53ad-443a-92cd-eafeae4bc698', NULL, 4, 'Toys for ferrets', 'Играчки за порове'),
('Ferret Litter', 'Постелка за порове', 'ferret-litter', 'bcb4dd61-53ad-443a-92cd-eafeae4bc698', NULL, 5, 'Litter for ferrets', 'Постелка за порове'),
('Ferret Grooming', 'Грууминг за порове', 'ferret-grooming', 'bcb4dd61-53ad-443a-92cd-eafeae4bc698', NULL, 6, 'Grooming supplies for ferrets', 'Грууминг продукти за порове'),
('Ferret Harnesses', 'Нагръдници за порове', 'ferret-harnesses', 'bcb4dd61-53ad-443a-92cd-eafeae4bc698', NULL, 7, 'Harnesses and leashes for ferrets', 'Нагръдници и каишки за порове')
ON CONFLICT (slug) DO NOTHING;;
