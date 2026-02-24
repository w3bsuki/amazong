-- Restore more Pet Supplies L3 categories

-- Dog Beds L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Orthopedic Dog Beds', 'dog-beds-orthopedic', 'Ортопедични кучешки легла', 1),
  ('Bolster Dog Beds', 'dog-beds-bolster', 'Болстер кучешки легла', 2),
  ('Donut Dog Beds', 'dog-beds-donut', 'Кръгли кучешки легла', 3),
  ('Elevated Dog Beds', 'dog-beds-elevated', 'Повдигнати кучешки легла', 4),
  ('Cooling Dog Beds', 'dog-beds-cooling', 'Охлаждащи кучешки легла', 5),
  ('Heated Dog Beds', 'dog-beds-heated', 'Отоплени кучешки легла', 6),
  ('Travel Dog Beds', 'dog-beds-travel', 'Пътуващи кучешки легла', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'dogs-beds'
ON CONFLICT (slug) DO NOTHING;

-- Dog Grooming L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Dog Shampoo', 'dog-groom-shampoo', 'Шампоан за кучета', 1),
  ('Dog Brushes', 'dog-groom-brushes', 'Четки за кучета', 2),
  ('Dog Nail Clippers', 'dog-groom-nail', 'Ножички за нокти', 3),
  ('Dog Clippers', 'dog-groom-clippers', 'Машинки за подстригване', 4),
  ('Dog Deodorizers', 'dog-groom-deodorizers', 'Дезодоранти за кучета', 5),
  ('Dental Care', 'dog-groom-dental', 'Грижа за зъбите', 6),
  ('Ear Care', 'dog-groom-ear', 'Грижа за ушите', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'dogs-grooming'
ON CONFLICT (slug) DO NOTHING;

-- Dog Training L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Training Pads', 'dog-train-pads', 'Подложки за тренировка', 1),
  ('Training Treats', 'dog-train-treats', 'Лакомства за тренировка', 2),
  ('Training Clickers', 'dog-train-clickers', 'Кликери', 3),
  ('Training Collars', 'dog-train-collars', 'Тренировъчни нашийници', 4),
  ('Crates & Kennels', 'dog-train-crates', 'Кафези и кенели', 5),
  ('Training Books', 'dog-train-books', 'Книги за тренировка', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'dogs-training'
ON CONFLICT (slug) DO NOTHING;

-- Dog Collars L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Standard Collars', 'collars-standard', 'Стандартни нашийници', 1),
  ('Personalized Collars', 'collars-personalized', 'Персонализирани нашийници', 2),
  ('GPS Collars', 'collars-gps', 'GPS нашийници', 3),
  ('Leather Collars', 'collars-leather', 'Кожени нашийници', 4),
  ('LED Collars', 'collars-led', 'LED нашийници', 5),
  ('Martingale Collars', 'collars-martingale', 'Мартингейл нашийници', 6),
  ('Flea Collars', 'collars-flea', 'Противопаразитни нашийници', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'dogs-collars'
ON CONFLICT (slug) DO NOTHING;

-- Cat Food Types L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Dry Cat Food', 'cat-food-dry', 'Суха котешка храна', 1),
  ('Wet Cat Food', 'cat-food-wet', 'Мокра котешка храна', 2),
  ('Grain-Free Cat Food', 'cat-food-grain-free', 'Котешка храна без зърно', 3),
  ('Kitten Food', 'cat-food-kitten', 'Храна за котенца', 4),
  ('Senior Cat Food', 'cat-food-senior', 'Храна за възрастни котки', 5),
  ('Prescription Cat Food', 'cat-food-prescription', 'Ветеринарна котешка храна', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'cats-food'
ON CONFLICT (slug) DO NOTHING;

-- Cat Toys L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Interactive Cat Toys', 'cat-toys-interactive', 'Интерактивни котешки играчки', 1),
  ('Feather Toys', 'cat-toys-feather', 'Играчки с пера', 2),
  ('Catnip Toys', 'cat-toys-catnip', 'Играчки с котешка трева', 3),
  ('Ball Toys', 'cat-toys-balls', 'Топки', 4),
  ('Laser Toys', 'cat-toys-laser', 'Лазерни играчки', 5),
  ('Scratching Posts', 'cat-toys-scratching', 'Драскалки', 6),
  ('Cat Trees', 'cat-toys-trees', 'Катерици', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'cats-toys'
ON CONFLICT (slug) DO NOTHING;

-- Cat Beds L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Cat Caves', 'cat-beds-caves', 'Котешки пещери', 1),
  ('Heated Cat Beds', 'cat-beds-heated', 'Отоплени котешки легла', 2),
  ('Window Perches', 'cat-beds-perches', 'Перчове за прозорец', 3),
  ('Cat Hammocks', 'cat-beds-hammocks', 'Котешки хамаци', 4),
  ('Cat Houses', 'cat-beds-houses', 'Котешки къщички', 5),
  ('Enclosed Cat Beds', 'cat-beds-enclosed', 'Затворени котешки легла', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'cats-beds'
ON CONFLICT (slug) DO NOTHING;

-- Small Animal Supplies L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Rabbit Supplies', 'small-rabbit', 'Аксесоари за зайци', 1),
  ('Hamster Supplies', 'small-hamster', 'Аксесоари за хамстери', 2),
  ('Guinea Pig Supplies', 'small-guinea-pig', 'Аксесоари за морски свинчета', 3),
  ('Ferret Supplies', 'small-ferret', 'Аксесоари за порове', 4),
  ('Chinchilla Supplies', 'small-chinchilla', 'Аксесоари за чинчили', 5),
  ('Small Animal Cages', 'small-cages', 'Клетки за малки животни', 6),
  ('Small Animal Food', 'small-food', 'Храна за малки животни', 7),
  ('Small Animal Bedding', 'small-bedding', 'Постеля за малки животни', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'pets-small-animals'
ON CONFLICT (slug) DO NOTHING;

-- Reptile Supplies L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Reptile Terrariums', 'reptile-terrariums', 'Терариуми', 1),
  ('Reptile Lighting', 'reptile-lighting', 'Осветление за влечуги', 2),
  ('Reptile Heating', 'reptile-heating', 'Отопление за влечуги', 3),
  ('Reptile Substrate', 'reptile-substrate', 'Субстрат за влечуги', 4),
  ('Reptile Food', 'reptile-food', 'Храна за влечуги', 5),
  ('Reptile Decorations', 'reptile-decorations', 'Декорации за терариум', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'pets-reptiles'
ON CONFLICT (slug) DO NOTHING;

-- Aquarium Supplies L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Aquariums', 'aquarium-tanks', 'Аквариуми', 1),
  ('Aquarium Filters', 'aquarium-filters', 'Филтри за аквариум', 2),
  ('Aquarium Heaters', 'aquarium-heaters', 'Нагреватели за аквариум', 3),
  ('Aquarium Lighting', 'aquarium-lighting', 'Осветление за аквариум', 4),
  ('Aquarium Decorations', 'aquarium-decorations', 'Декорации за аквариум', 5),
  ('Fish Food', 'aquarium-food', 'Храна за риби', 6),
  ('Aquarium Plants', 'aquarium-plants', 'Аквариумни растения', 7),
  ('Water Treatment', 'aquarium-water', 'Третиране на водата', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'pets-fish'
ON CONFLICT (slug) DO NOTHING;;
