-- Restore Pets L3 categories
-- Dog Food L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Dry Dog Food', 'dog-dry-food', 'Суха храна за кучета', 1),
  ('Wet Dog Food', 'dog-wet-food', 'Влажна храна за кучета', 2),
  ('Raw Dog Food', 'dog-raw-food', 'Сурова храна за кучета', 3),
  ('Freeze-Dried Food', 'dog-freeze-dried', 'Лиофилизирана храна', 4),
  ('Dehydrated Food', 'dog-dehydrated', 'Дехидратирана храна', 5),
  ('Fresh Dog Food', 'dog-fresh-food', 'Прясна храна за кучета', 6),
  ('Puppy Food', 'puppy-food', 'Храна за кученца', 7),
  ('Senior Dog Food', 'senior-dog-food', 'Храна за възрастни кучета', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'dog-food'
ON CONFLICT (slug) DO NOTHING;

-- Dog Treats L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Biscuits & Cookies', 'dog-biscuits', 'Бисквити и сладки', 1),
  ('Jerky & Meat Treats', 'dog-jerky', 'Сушено месо', 2),
  ('Dental Treats', 'dog-dental-treats', 'Дентални лакомства', 3),
  ('Training Treats', 'dog-training-treats', 'Лакомства за тренировка', 4),
  ('Natural & Organic Treats', 'dog-natural-treats', 'Натурални лакомства', 5),
  ('Bones & Chews', 'dog-bones-chews', 'Кокали и дъвки', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'dog-treats'
ON CONFLICT (slug) DO NOTHING;

-- Dog Toys L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Chew Toys', 'dog-chew-toys', 'Играчки за дъвчене', 1),
  ('Fetch Toys', 'dog-fetch-toys', 'Играчки за хвърляне', 2),
  ('Tug Toys', 'dog-tug-toys', 'Играчки за дърпане', 3),
  ('Interactive Toys', 'dog-interactive-toys', 'Интерактивни играчки', 4),
  ('Plush Toys', 'dog-plush-toys', 'Плюшени играчки', 5),
  ('Puzzle Toys', 'dog-puzzle-toys', 'Пъзел играчки', 6),
  ('Squeaky Toys', 'dog-squeaky-toys', 'Пищящи играчки', 7),
  ('Outdoor Toys', 'dog-outdoor-toys', 'Играчки за открито', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'dog-toys'
ON CONFLICT (slug) DO NOTHING;

-- Dog Beds L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Bolster Beds', 'dog-bolster-beds', 'Легла с борд', 1),
  ('Orthopedic Beds', 'dog-orthopedic-beds', 'Ортопедични легла', 2),
  ('Donut Beds', 'dog-donut-beds', 'Кръгли легла', 3),
  ('Elevated Beds', 'dog-elevated-beds', 'Повдигнати легла', 4),
  ('Heated & Cooling Beds', 'dog-heated-beds', 'Отопляеми и охлаждащи легла', 5),
  ('Outdoor Beds', 'dog-outdoor-beds', 'Легла за открито', 6),
  ('Dog Blankets', 'dog-blankets', 'Одеяла за кучета', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'dog-beds'
ON CONFLICT (slug) DO NOTHING;

-- Dog Collars L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Standard Collars', 'dog-standard-collars', 'Стандартни нашийници', 1),
  ('Martingale Collars', 'dog-martingale-collars', 'Мартингейл нашийници', 2),
  ('Training Collars', 'dog-training-collars', 'Тренировъчни нашийници', 3),
  ('Breakaway Collars', 'dog-breakaway-collars', 'Предпазни нашийници', 4),
  ('LED & Light-Up Collars', 'dog-led-collars', 'LED нашийници', 5),
  ('Standard Leashes', 'dog-standard-leashes', 'Стандартни каишки', 6),
  ('Retractable Leashes', 'dog-retractable-leashes', 'Разтегателни каишки', 7),
  ('Training Leashes', 'dog-training-leashes', 'Тренировъчни каишки', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'dog-collars'
ON CONFLICT (slug) DO NOTHING;

-- Cat Food L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Dry Cat Food', 'cat-dry-food', 'Суха храна за котки', 1),
  ('Wet Cat Food', 'cat-wet-food', 'Влажна храна за котки', 2),
  ('Raw Cat Food', 'cat-raw-food', 'Сурова храна за котки', 3),
  ('Kitten Food', 'kitten-food', 'Храна за котенца', 4),
  ('Senior Cat Food', 'senior-cat-food', 'Храна за възрастни котки', 5),
  ('Prescription Cat Food', 'prescription-cat-food', 'Лечебна храна за котки', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'cat-food'
ON CONFLICT (slug) DO NOTHING;

-- Cat Litter L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Clumping Litter', 'cat-clumping-litter', 'Слепваща постелка', 1),
  ('Non-Clumping Litter', 'cat-nonclumping-litter', 'Неслепваща постелка', 2),
  ('Crystal Litter', 'cat-crystal-litter', 'Силиконова постелка', 3),
  ('Natural Litter', 'cat-natural-litter', 'Натурална постелка', 4),
  ('Pellet Litter', 'cat-pellet-litter', 'Пелетна постелка', 5)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'cat-litter'
ON CONFLICT (slug) DO NOTHING;

-- Bird L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Bird Seed', 'bird-seed', 'Семена за птици', 1),
  ('Bird Pellets', 'bird-pellets', 'Пелети за птици', 2),
  ('Bird Treats', 'bird-treats-food', 'Лакомства за птици', 3)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'bird-food'
ON CONFLICT (slug) DO NOTHING;

-- Fish L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Flake Food', 'fish-flake-food', 'Люспеста храна', 1),
  ('Pellet Food', 'fish-pellet-food', 'Пелетна храна', 2),
  ('Frozen Fish Food', 'fish-frozen-food', 'Замразена храна', 3),
  ('Live Fish Food', 'fish-live-food', 'Жива храна', 4)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'fish-food'
ON CONFLICT (slug) DO NOTHING;;
