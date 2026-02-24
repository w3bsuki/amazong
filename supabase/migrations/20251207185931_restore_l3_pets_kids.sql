
-- Restore L3 categories for Pets

-- Dogs L3 (parent: 54b7646f-e81b-4eb0-b4f4-76adeed04e01)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Dog Food', 'dogs-food', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Храна за кучета', 1),
  ('Dog Treats', 'dogs-treats', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Лакомства за кучета', 2),
  ('Dog Toys', 'dogs-toys', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Играчки за кучета', 3),
  ('Dog Beds', 'dogs-beds', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Легла за кучета', 4),
  ('Dog Collars & Leashes', 'dogs-collars', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Нашийници и каишки', 5),
  ('Dog Clothing', 'dogs-clothing', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Дрехи за кучета', 6),
  ('Dog Grooming', 'dogs-grooming', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Грижа за козината', 7),
  ('Dog Training', 'dogs-training', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Обучение', 8),
  ('Dog Bowls & Feeders', 'dogs-bowls', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Купи и хранилки', 9),
  ('Dog Crates & Kennels', 'dogs-crates', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Клетки и кучешки домове', 10),
  ('Dog Health & Wellness', 'dogs-health', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Здраве и грижа', 11),
  ('Dog Doors & Gates', 'dogs-doors', '54b7646f-e81b-4eb0-b4f4-76adeed04e01', 'Врати и прегради', 12)
ON CONFLICT (slug) DO NOTHING;

-- Cats L3 (parent: b1fc399c-f9cb-4437-ad97-5a36467fcdd8)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Cat Food', 'cats-food', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', 'Храна за котки', 1),
  ('Cat Treats', 'cats-treats', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', 'Лакомства за котки', 2),
  ('Cat Toys', 'cats-toys', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', 'Играчки за котки', 3),
  ('Cat Beds & Furniture', 'cats-beds', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', 'Легла и мебели за котки', 4),
  ('Litter & Litter Boxes', 'cats-litter', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', 'Котешки тоалетни', 5),
  ('Cat Scratchers', 'cats-scratchers', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', 'Катерушки', 6),
  ('Cat Collars', 'cats-collars', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', 'Нашийници за котки', 7),
  ('Cat Grooming', 'cats-grooming', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', 'Грижа за козината', 8),
  ('Cat Bowls & Feeders', 'cats-bowls', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', 'Купи и хранилки', 9),
  ('Cat Health & Wellness', 'cats-health', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', 'Здраве и грижа', 10)
ON CONFLICT (slug) DO NOTHING;

-- Fish & Aquatic L3 (parent: d0fd9fc8-119c-4160-b9a2-0e61d662abcc)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Fish Food', 'fish-food', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', 'Храна за риби', 1),
  ('Aquariums', 'fish-aquariums', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', 'Аквариуми', 2),
  ('Aquarium Filters', 'fish-filters', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', 'Филтри', 3),
  ('Aquarium Lighting', 'fish-lighting', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', 'Осветление', 4),
  ('Aquarium Decor', 'fish-decor', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', 'Декорации', 5),
  ('Aquarium Plants', 'fish-plants', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', 'Растения', 6),
  ('Water Treatment', 'fish-water', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', 'Третиране на вода', 7),
  ('Heaters & Thermometers', 'fish-heaters', 'd0fd9fc8-119c-4160-b9a2-0e61d662abcc', 'Нагреватели', 8)
ON CONFLICT (slug) DO NOTHING;

-- Birds L3 (parent: b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Bird Food', 'birds-food', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', 'Храна за птици', 1),
  ('Bird Cages', 'birds-cages', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', 'Клетки за птици', 2),
  ('Bird Toys', 'birds-toys', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', 'Играчки за птици', 3),
  ('Bird Perches', 'birds-perches', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', 'Кацалки', 4),
  ('Bird Feeders & Waterers', 'birds-feeders', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', 'Хранилки и поилки', 5),
  ('Bird Health', 'birds-health', 'b67bf5fa-1bbd-43ea-8b42-202ddfcc9b54', 'Здраве', 6)
ON CONFLICT (slug) DO NOTHING;

-- Small Animals L3 (parent: cb0b5930-b98a-4a72-8bcd-6523c43560e0)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Small Animal Food', 'small-animal-food', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', 'Храна', 1),
  ('Small Animal Cages', 'small-animal-cages', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', 'Клетки', 2),
  ('Small Animal Bedding', 'small-animal-bedding', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', 'Постеля', 3),
  ('Small Animal Toys', 'small-animal-toys', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', 'Играчки', 4),
  ('Small Animal Accessories', 'small-animal-accessories', 'cb0b5930-b98a-4a72-8bcd-6523c43560e0', 'Аксесоари', 5)
ON CONFLICT (slug) DO NOTHING;

-- Reptiles L3 (parent: 55b80260-6ec0-4a78-b8d6-c5afcbc5701a)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Reptile Food', 'reptiles-food', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', 'Храна за влечуги', 1),
  ('Terrariums', 'reptiles-terrariums', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', 'Терариуми', 2),
  ('Reptile Lighting & Heating', 'reptiles-lighting', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', 'Осветление и отопление', 3),
  ('Reptile Décor', 'reptiles-decor', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', 'Декорации', 4),
  ('Reptile Substrate', 'reptiles-substrate', '55b80260-6ec0-4a78-b8d6-c5afcbc5701a', 'Субстрат', 5)
ON CONFLICT (slug) DO NOTHING;

-- Toys & Games L3 (parent: a0000000-0000-0000-0000-000000000012)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Action Figures', 'toys-action-figures', 'a0000000-0000-0000-0000-000000000012', 'Екшън фигури', 1),
  ('Dolls & Accessories', 'toys-dolls', 'a0000000-0000-0000-0000-000000000012', 'Кукли', 2),
  ('Building Toys', 'toys-building', 'a0000000-0000-0000-0000-000000000012', 'Конструктори', 3),
  ('Puzzles', 'toys-puzzles', 'a0000000-0000-0000-0000-000000000012', 'Пъзели', 4),
  ('Board Games', 'toys-board-games', 'a0000000-0000-0000-0000-000000000012', 'Настолни игри', 5),
  ('Outdoor Play', 'toys-outdoor', 'a0000000-0000-0000-0000-000000000012', 'Игри на открито', 6),
  ('RC Toys', 'toys-rc', 'a0000000-0000-0000-0000-000000000012', 'Радиоуправляеми', 7),
  ('Educational Toys', 'toys-educational', 'a0000000-0000-0000-0000-000000000012', 'Образователни играчки', 8),
  ('Arts & Crafts', 'toys-arts-crafts', 'a0000000-0000-0000-0000-000000000012', 'Арт и занаяти', 9),
  ('Stuffed Animals', 'toys-stuffed', 'a0000000-0000-0000-0000-000000000012', 'Плюшени играчки', 10),
  ('Ride-On Toys', 'toys-ride-on', 'a0000000-0000-0000-0000-000000000012', 'Коли и колички', 11),
  ('Baby Toys', 'toys-baby', 'a0000000-0000-0000-0000-000000000012', 'Бебешки играчки', 12)
ON CONFLICT (slug) DO NOTHING;

-- Baby Gear L3 (parent: 199c6ea7-63f6-44d7-998a-ec9455e24cf8)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Strollers', 'baby-strollers', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Колички', 1),
  ('Car Seats', 'baby-car-seats', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Столчета за кола', 2),
  ('Baby Carriers', 'baby-carriers', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Кенгурута', 3),
  ('Bouncers & Swings', 'baby-bouncers', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Шезлонги и люлки', 4),
  ('Playpens', 'baby-playpens', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Кошари', 5),
  ('High Chairs', 'baby-high-chairs', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Столчета за хранене', 6),
  ('Baby Monitors', 'baby-monitors', '199c6ea7-63f6-44d7-998a-ec9455e24cf8', 'Бебефони', 7)
ON CONFLICT (slug) DO NOTHING;

-- Nursery & Furniture L3 (parent: ff55aca1-5110-429a-9f15-42eba84da9d7)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Cribs & Beds', 'nursery-cribs', 'ff55aca1-5110-429a-9f15-42eba84da9d7', 'Кошари и легла', 1),
  ('Changing Tables', 'nursery-changing', 'ff55aca1-5110-429a-9f15-42eba84da9d7', 'Повивалници', 2),
  ('Nursery Storage', 'nursery-storage', 'ff55aca1-5110-429a-9f15-42eba84da9d7', 'Съхранение', 3),
  ('Gliders & Rockers', 'nursery-gliders', 'ff55aca1-5110-429a-9f15-42eba84da9d7', 'Люлеещи се столове', 4),
  ('Nursery Decor', 'nursery-decor', 'ff55aca1-5110-429a-9f15-42eba84da9d7', 'Декорация', 5),
  ('Nursery Bedding', 'nursery-bedding', 'ff55aca1-5110-429a-9f15-42eba84da9d7', 'Бебешко спално бельо', 6),
  ('Baby Mattresses', 'nursery-mattresses', 'ff55aca1-5110-429a-9f15-42eba84da9d7', 'Бебешки матраци', 7)
ON CONFLICT (slug) DO NOTHING;

-- Baby Feeding L3 (parent: eaf2abb5-5395-486b-9b1a-abafeea044f4)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Bottles & Nipples', 'feeding-bottles', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Шишета и биберони', 1),
  ('Breast Pumps', 'feeding-pumps', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Помпи за кърма', 2),
  ('Baby Food', 'feeding-food', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Бебешка храна', 3),
  ('Bibs & Burp Cloths', 'feeding-bibs', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Лигавници', 4),
  ('Sippy Cups', 'feeding-sippy', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Неразливащи се чаши', 5),
  ('Baby Utensils', 'feeding-utensils', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Бебешки прибори', 6),
  ('Formula', 'feeding-formula', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', 'Адаптирано мляко', 7)
ON CONFLICT (slug) DO NOTHING;

-- Diapering & Potty L3 (parent: 4e466f5b-7948-4939-87a1-e5febc83c389)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Disposable Diapers', 'diaper-disposable', '4e466f5b-7948-4939-87a1-e5febc83c389', 'Еднократни пелени', 1),
  ('Cloth Diapers', 'diaper-cloth', '4e466f5b-7948-4939-87a1-e5febc83c389', 'Текстилни пелени', 2),
  ('Wipes', 'diaper-wipes', '4e466f5b-7948-4939-87a1-e5febc83c389', 'Мокри кърпички', 3),
  ('Diaper Cream', 'diaper-cream', '4e466f5b-7948-4939-87a1-e5febc83c389', 'Крем за подсичане', 4),
  ('Potty Training', 'diaper-potty', '4e466f5b-7948-4939-87a1-e5febc83c389', 'Гърнета', 5),
  ('Diaper Bags', 'diaper-bags', '4e466f5b-7948-4939-87a1-e5febc83c389', 'Чанти за пелени', 6)
ON CONFLICT (slug) DO NOTHING;
;
