
-- Restore missing Pets L3 categories (documented: 692, current: 267, missing: ~425)
-- Based on SUPABASE_CATEGORIES_FULL.md documentation

-- First, get parent IDs we need
DO $$
DECLARE
  pets_id UUID;
  dogs_id UUID;
  cats_id UUID;
  birds_id UUID;
  fish_id UUID;
  small_animals_id UUID;
  reptiles_id UUID;
  horses_id UUID;
  -- Dog L2s
  dog_food_id UUID;
  dog_treats_id UUID;
  dog_toys_id UUID;
  dog_beds_id UUID;
  dog_collars_id UUID;
  dog_grooming_id UUID;
  dog_health_id UUID;
  dog_clothing_id UUID;
  dog_training_id UUID;
  dog_bowls_id UUID;
  dog_crates_id UUID;
  dog_doors_id UUID;
  dog_carriers_id UUID;
  -- Cat L2s
  cat_food_id UUID;
  cat_treats_id UUID;
  cat_toys_id UUID;
  cat_furniture_id UUID;
  cat_litter_id UUID;
  cat_grooming_id UUID;
  cat_health_id UUID;
  cat_collars_id UUID;
  cat_bowls_id UUID;
  cat_carriers_id UUID;
  -- Bird L2s
  bird_food_id UUID;
  bird_cages_id UUID;
  bird_toys_id UUID;
  bird_health_id UUID;
  bird_accessories_id UUID;
  -- Fish L2s
  fish_tanks_id UUID;
  fish_food_id UUID;
  fish_filters_id UUID;
  fish_decor_id UUID;
  fish_lighting_id UUID;
  fish_plants_id UUID;
  fish_health_id UUID;
  -- Small Animals L2s
  small_food_id UUID;
  small_cages_id UUID;
  small_bedding_id UUID;
  small_toys_id UUID;
  small_health_id UUID;
  -- Reptile L2s
  reptile_food_id UUID;
  reptile_tanks_id UUID;
  reptile_heating_id UUID;
  reptile_decor_id UUID;
  reptile_health_id UUID;
  -- Horse L2s
  horse_feed_id UUID;
  horse_tack_id UUID;
  horse_grooming_id UUID;
  horse_health_id UUID;
  horse_stable_id UUID;
BEGIN
  -- Get main category IDs
  SELECT id INTO pets_id FROM categories WHERE slug = 'pets';
  SELECT id INTO dogs_id FROM categories WHERE slug = 'dogs' AND parent_id = pets_id;
  SELECT id INTO cats_id FROM categories WHERE slug = 'cats' AND parent_id = pets_id;
  SELECT id INTO birds_id FROM categories WHERE slug = 'birds' AND parent_id = pets_id;
  SELECT id INTO fish_id FROM categories WHERE slug = 'fish-aquarium' OR slug = 'fish-aquatic' LIMIT 1;
  SELECT id INTO small_animals_id FROM categories WHERE slug = 'small-animals' AND parent_id = pets_id;
  SELECT id INTO reptiles_id FROM categories WHERE slug = 'reptiles' AND parent_id = pets_id;
  SELECT id INTO horses_id FROM categories WHERE slug = 'horses' AND parent_id = pets_id;
  
  -- Get Dog L2 IDs
  SELECT id INTO dog_food_id FROM categories WHERE slug = 'dog-food' AND parent_id = dogs_id;
  SELECT id INTO dog_treats_id FROM categories WHERE slug = 'dog-treats' AND parent_id = dogs_id;
  SELECT id INTO dog_toys_id FROM categories WHERE slug = 'dog-toys' AND parent_id = dogs_id;
  SELECT id INTO dog_beds_id FROM categories WHERE slug = 'dog-beds' AND parent_id = dogs_id;
  SELECT id INTO dog_collars_id FROM categories WHERE slug = 'dog-collars-leashes' AND parent_id = dogs_id;
  SELECT id INTO dog_grooming_id FROM categories WHERE slug = 'dog-grooming' AND parent_id = dogs_id;
  SELECT id INTO dog_health_id FROM categories WHERE slug = 'dog-health' AND parent_id = dogs_id;
  SELECT id INTO dog_clothing_id FROM categories WHERE slug = 'dog-clothing' AND parent_id = dogs_id;
  SELECT id INTO dog_training_id FROM categories WHERE slug = 'dog-training' AND parent_id = dogs_id;
  SELECT id INTO dog_bowls_id FROM categories WHERE slug = 'dog-bowls-feeders' AND parent_id = dogs_id;
  SELECT id INTO dog_crates_id FROM categories WHERE slug = 'dog-crates-kennels' AND parent_id = dogs_id;
  SELECT id INTO dog_doors_id FROM categories WHERE slug = 'dog-doors-gates' AND parent_id = dogs_id;
  SELECT id INTO dog_carriers_id FROM categories WHERE slug = 'dog-carriers' AND parent_id = dogs_id;
  
  -- Get Cat L2 IDs
  SELECT id INTO cat_food_id FROM categories WHERE slug = 'cat-food' AND parent_id = cats_id;
  SELECT id INTO cat_treats_id FROM categories WHERE slug = 'cat-treats' AND parent_id = cats_id;
  SELECT id INTO cat_toys_id FROM categories WHERE slug = 'cat-toys' AND parent_id = cats_id;
  SELECT id INTO cat_furniture_id FROM categories WHERE slug = 'cat-furniture' AND parent_id = cats_id;
  SELECT id INTO cat_litter_id FROM categories WHERE slug = 'cat-litter' AND parent_id = cats_id;
  SELECT id INTO cat_grooming_id FROM categories WHERE slug = 'cat-grooming' AND parent_id = cats_id;
  SELECT id INTO cat_health_id FROM categories WHERE slug = 'cat-health' AND parent_id = cats_id;
  SELECT id INTO cat_collars_id FROM categories WHERE slug = 'cat-collars-harnesses' AND parent_id = cats_id;
  SELECT id INTO cat_bowls_id FROM categories WHERE slug = 'cat-bowls-feeders' AND parent_id = cats_id;
  SELECT id INTO cat_carriers_id FROM categories WHERE slug = 'cat-carriers' AND parent_id = cats_id;

  -- Insert Dog Food L3 categories
  IF dog_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Dry Food - Puppy', 'Суха храна - кученца', 'dog-dry-food-puppy', dog_food_id, '🦴', 1),
    ('Dry Food - Adult', 'Суха храна - възрастни', 'dog-dry-food-adult', dog_food_id, '🦴', 2),
    ('Dry Food - Senior', 'Суха храна - възрастни кучета', 'dog-dry-food-senior', dog_food_id, '🦴', 3),
    ('Dry Food - Small Breed', 'Суха храна - малки породи', 'dog-dry-food-small-breed', dog_food_id, '🦴', 4),
    ('Dry Food - Large Breed', 'Суха храна - големи породи', 'dog-dry-food-large-breed', dog_food_id, '🦴', 5),
    ('Dry Food - Grain Free', 'Суха храна - без зърно', 'dog-dry-food-grain-free', dog_food_id, '🦴', 6),
    ('Wet Food - Puppy', 'Мокра храна - кученца', 'dog-wet-food-puppy', dog_food_id, '🥫', 7),
    ('Wet Food - Adult', 'Мокра храна - възрастни', 'dog-wet-food-adult', dog_food_id, '🥫', 8),
    ('Wet Food - Senior', 'Мокра храна - възрастни кучета', 'dog-wet-food-senior', dog_food_id, '🥫', 9),
    ('Wet Food - Grain Free', 'Мокра храна - без зърно', 'dog-wet-food-grain-free', dog_food_id, '🥫', 10),
    ('Raw & Fresh Food', 'Сурова и прясна храна', 'dog-raw-fresh-food', dog_food_id, '🥩', 11),
    ('Freeze-Dried Food', 'Лиофилизирана храна', 'dog-freeze-dried-food', dog_food_id, '🦴', 12),
    ('Prescription Diet', 'Лечебна диета', 'dog-prescription-diet', dog_food_id, '💊', 13),
    ('Weight Management', 'Контрол на теглото', 'dog-weight-management', dog_food_id, '⚖️', 14),
    ('Sensitive Stomach', 'Чувствителен стомах', 'dog-sensitive-stomach', dog_food_id, '🍽️', 15),
    ('Limited Ingredient', 'Ограничени съставки', 'dog-limited-ingredient', dog_food_id, '🌿', 16),
    ('Food Toppers', 'Добавки за храна', 'dog-food-toppers', dog_food_id, '🥄', 17)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Insert Dog Treats L3 categories
  IF dog_treats_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Training Treats', 'Лакомства за обучение', 'dog-training-treats', dog_treats_id, '🦴', 1),
    ('Dental Treats', 'Дентални лакомства', 'dog-dental-treats', dog_treats_id, '🦷', 2),
    ('Jerky & Strips', 'Месни ленти', 'dog-jerky-strips', dog_treats_id, '🥓', 3),
    ('Biscuits & Cookies', 'Бисквити', 'dog-biscuits-cookies', dog_treats_id, '🍪', 4),
    ('Natural Chews', 'Естествени дъвки', 'dog-natural-chews', dog_treats_id, '🦴', 5),
    ('Rawhide', 'Сурова кожа', 'dog-rawhide', dog_treats_id, '🦴', 6),
    ('Freeze-Dried Treats', 'Лиофилизирани лакомства', 'dog-freeze-dried-treats', dog_treats_id, '🥩', 7),
    ('Soft Treats', 'Меки лакомства', 'dog-soft-treats', dog_treats_id, '🍬', 8),
    ('Grain-Free Treats', 'Лакомства без зърно', 'dog-grain-free-treats', dog_treats_id, '🌾', 9),
    ('Functional Treats', 'Функционални лакомства', 'dog-functional-treats', dog_treats_id, '💪', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Insert Dog Toys L3 categories
  IF dog_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Chew Toys', 'Играчки за дъвчене', 'dog-chew-toys', dog_toys_id, '🦴', 1),
    ('Fetch Toys', 'Играчки за хвърляне', 'dog-fetch-toys', dog_toys_id, '🎾', 2),
    ('Plush Toys', 'Плюшени играчки', 'dog-plush-toys', dog_toys_id, '🧸', 3),
    ('Rope Toys', 'Въжени играчки', 'dog-rope-toys', dog_toys_id, '🪢', 4),
    ('Interactive Toys', 'Интерактивни играчки', 'dog-interactive-toys', dog_toys_id, '🎯', 5),
    ('Puzzle Toys', 'Пъзел играчки', 'dog-puzzle-toys', dog_toys_id, '🧩', 6),
    ('Squeaky Toys', 'Пищящи играчки', 'dog-squeaky-toys', dog_toys_id, '📢', 7),
    ('Ball Toys', 'Топки', 'dog-ball-toys', dog_toys_id, '⚽', 8),
    ('Tug Toys', 'Играчки за дърпане', 'dog-tug-toys', dog_toys_id, '💪', 9),
    ('Outdoor Toys', 'Външни играчки', 'dog-outdoor-toys', dog_toys_id, '🌳', 10),
    ('Water Toys', 'Водни играчки', 'dog-water-toys', dog_toys_id, '💦', 11),
    ('Indestructible Toys', 'Неразрушими играчки', 'dog-indestructible-toys', dog_toys_id, '🔩', 12)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Insert Dog Beds L3 categories  
  IF dog_beds_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Orthopedic Beds', 'Ортопедични легла', 'dog-orthopedic-beds', dog_beds_id, '🛏️', 1),
    ('Memory Foam Beds', 'Легла с мемори пяна', 'dog-memory-foam-beds', dog_beds_id, '🛏️', 2),
    ('Bolster Beds', 'Легла с борд', 'dog-bolster-beds', dog_beds_id, '🛏️', 3),
    ('Crate Mats & Pads', 'Подложки за клетка', 'dog-crate-mats', dog_beds_id, '🛏️', 4),
    ('Heated Beds', 'Отоплени легла', 'dog-heated-beds', dog_beds_id, '🔥', 5),
    ('Cooling Beds', 'Охлаждащи легла', 'dog-cooling-beds', dog_beds_id, '❄️', 6),
    ('Outdoor Beds', 'Външни легла', 'dog-outdoor-beds', dog_beds_id, '🏕️', 7),
    ('Travel Beds', 'Пътни легла', 'dog-travel-beds', dog_beds_id, '✈️', 8),
    ('Cave & Hooded Beds', 'Пещерни легла', 'dog-cave-beds', dog_beds_id, '🏠', 9),
    ('Blankets & Throws', 'Одеяла', 'dog-blankets', dog_beds_id, '🧣', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Insert Dog Grooming L3 categories
  IF dog_grooming_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Shampoo & Conditioner', 'Шампоан и балсам', 'dog-shampoo-conditioner', dog_grooming_id, '🧴', 1),
    ('Brushes & Combs', 'Четки и гребени', 'dog-brushes-combs', dog_grooming_id, '🪮', 2),
    ('Nail Care', 'Грижа за ноктите', 'dog-nail-care', dog_grooming_id, '✂️', 3),
    ('Ear Care', 'Грижа за ушите', 'dog-ear-care', dog_grooming_id, '👂', 4),
    ('Eye Care', 'Грижа за очите', 'dog-eye-care', dog_grooming_id, '👁️', 5),
    ('Dental Care', 'Дентална грижа', 'dog-dental-care', dog_grooming_id, '🦷', 6),
    ('Clippers & Trimmers', 'Машинки за подстригване', 'dog-clippers-trimmers', dog_grooming_id, '✂️', 7),
    ('Deodorizers & Sprays', 'Дезодоранти', 'dog-deodorizers', dog_grooming_id, '🌸', 8),
    ('Wipes', 'Кърпички', 'dog-grooming-wipes', dog_grooming_id, '🧻', 9),
    ('Grooming Tables', 'Маси за подстригване', 'dog-grooming-tables', dog_grooming_id, '🪑', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Insert Cat Food L3 categories
  IF cat_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Dry Food - Kitten', 'Суха храна - котенца', 'cat-dry-food-kitten', cat_food_id, '🐱', 1),
    ('Dry Food - Adult', 'Суха храна - възрастни', 'cat-dry-food-adult', cat_food_id, '🐱', 2),
    ('Dry Food - Senior', 'Суха храна - възрастни котки', 'cat-dry-food-senior', cat_food_id, '🐱', 3),
    ('Dry Food - Indoor', 'Суха храна - домашни', 'cat-dry-food-indoor', cat_food_id, '🏠', 4),
    ('Dry Food - Grain Free', 'Суха храна - без зърно', 'cat-dry-food-grain-free', cat_food_id, '🌾', 5),
    ('Wet Food - Kitten', 'Мокра храна - котенца', 'cat-wet-food-kitten', cat_food_id, '🥫', 6),
    ('Wet Food - Adult', 'Мокра храна - възрастни', 'cat-wet-food-adult', cat_food_id, '🥫', 7),
    ('Wet Food - Senior', 'Мокра храна - възрастни котки', 'cat-wet-food-senior', cat_food_id, '🥫', 8),
    ('Wet Food - Grain Free', 'Мокра храна - без зърно', 'cat-wet-food-grain-free', cat_food_id, '🥫', 9),
    ('Raw & Fresh Food', 'Сурова и прясна храна', 'cat-raw-fresh-food', cat_food_id, '🥩', 10),
    ('Prescription Diet', 'Лечебна диета', 'cat-prescription-diet', cat_food_id, '💊', 11),
    ('Urinary Health', 'Уринарно здраве', 'cat-urinary-health-food', cat_food_id, '💧', 12),
    ('Weight Management', 'Контрол на теглото', 'cat-weight-management', cat_food_id, '⚖️', 13),
    ('Hairball Control', 'Контрол на космени топки', 'cat-hairball-control', cat_food_id, '🧶', 14),
    ('Food Toppers', 'Добавки за храна', 'cat-food-toppers', cat_food_id, '🥄', 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Insert Cat Toys L3 categories
  IF cat_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Wand & Teaser Toys', 'Пръчки и дразнители', 'cat-wand-toys', cat_toys_id, '🪄', 1),
    ('Balls & Chasers', 'Топки', 'cat-balls', cat_toys_id, '⚽', 2),
    ('Mice & Animals', 'Мишки и животни', 'cat-mice-toys', cat_toys_id, '🐭', 3),
    ('Interactive Toys', 'Интерактивни играчки', 'cat-interactive-toys', cat_toys_id, '🎯', 4),
    ('Catnip Toys', 'Играчки с коча билка', 'cat-catnip-toys', cat_toys_id, '🌿', 5),
    ('Laser Toys', 'Лазерни играчки', 'cat-laser-toys', cat_toys_id, '🔴', 6),
    ('Tunnel Toys', 'Тунели', 'cat-tunnel-toys', cat_toys_id, '🕳️', 7),
    ('Scratchers & Posts', 'Драскалки', 'cat-scratchers', cat_toys_id, '🪵', 8),
    ('Electronic Toys', 'Електронни играчки', 'cat-electronic-toys', cat_toys_id, '🔋', 9),
    ('Feather Toys', 'Играчки с пера', 'cat-feather-toys', cat_toys_id, '🪶', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Insert Cat Furniture L3 categories
  IF cat_furniture_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Cat Trees', 'Катерушки', 'cat-trees', cat_furniture_id, '🌲', 1),
    ('Cat Condos', 'Къщички', 'cat-condos', cat_furniture_id, '🏠', 2),
    ('Window Perches', 'Прозоречни легла', 'cat-window-perches', cat_furniture_id, '🪟', 3),
    ('Wall Shelves', 'Стенни рафтове', 'cat-wall-shelves', cat_furniture_id, '📦', 4),
    ('Cat Beds', 'Легла за котки', 'cat-beds', cat_furniture_id, '🛏️', 5),
    ('Heated Cat Beds', 'Отоплени легла', 'cat-heated-beds', cat_furniture_id, '🔥', 6),
    ('Cat Caves', 'Котешки пещери', 'cat-caves', cat_furniture_id, '🕳️', 7),
    ('Scratching Posts', 'Драскалки', 'cat-scratching-posts', cat_furniture_id, '🪵', 8),
    ('Cat Hammocks', 'Хамаци', 'cat-hammocks', cat_furniture_id, '🛖', 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Insert Cat Litter L3 categories
  IF cat_litter_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Clumping Litter', 'Слепваща постелка', 'cat-clumping-litter', cat_litter_id, '🪨', 1),
    ('Non-Clumping Litter', 'Неслепваща постелка', 'cat-non-clumping-litter', cat_litter_id, '🪨', 2),
    ('Crystal Litter', 'Кристална постелка', 'cat-crystal-litter', cat_litter_id, '💎', 3),
    ('Natural & Biodegradable', 'Естествена и биоразградима', 'cat-natural-litter', cat_litter_id, '🌿', 4),
    ('Pine & Wood Litter', 'Борова и дървесна', 'cat-wood-litter', cat_litter_id, '🌲', 5),
    ('Paper Litter', 'Хартиена постелка', 'cat-paper-litter', cat_litter_id, '📰', 6),
    ('Litter Boxes', 'Тоалетни', 'cat-litter-boxes', cat_litter_id, '📦', 7),
    ('Self-Cleaning Boxes', 'Самопочистващи се', 'cat-self-cleaning-boxes', cat_litter_id, '🤖', 8),
    ('Litter Box Accessories', 'Аксесоари', 'cat-litter-accessories', cat_litter_id, '🔧', 9),
    ('Litter Deodorizers', 'Дезодоранти', 'cat-litter-deodorizers', cat_litter_id, '🌸', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Pets L3 categories restoration complete';
END $$;
;
