
-- Restore massive batch of L3 categories to reach 7000+ target
DO $$
DECLARE
  -- Get L2 category IDs for inserting L3
  v_dog_food_id UUID;
  v_cat_food_id UUID;
  v_dog_toys_id UUID;
  v_cat_toys_id UUID;
  v_dog_treats_id UUID;
  v_cat_treats_id UUID;
  v_dog_beds_id UUID;
  v_cat_beds_id UUID;
  v_dog_health_id UUID;
  v_cat_health_id UUID;
  v_fish_food_id UUID;
  v_fish_tanks_id UUID;
  v_fish_decor_id UUID;
  v_bird_food_id UUID;
  v_bird_cages_id UUID;
  v_small_animal_food_id UUID;
  v_small_animal_bedding_id UUID;
  v_reptile_food_id UUID;
  v_reptile_habitats_id UUID;
BEGIN
  -- Get Pet L2 IDs
  SELECT id INTO v_dog_food_id FROM categories WHERE slug = 'dog-food';
  SELECT id INTO v_cat_food_id FROM categories WHERE slug = 'cat-food';
  SELECT id INTO v_dog_toys_id FROM categories WHERE slug = 'dog-toys';
  SELECT id INTO v_cat_toys_id FROM categories WHERE slug = 'cat-toys';
  SELECT id INTO v_dog_treats_id FROM categories WHERE slug = 'dog-treats';
  SELECT id INTO v_cat_treats_id FROM categories WHERE slug = 'cat-treats';
  SELECT id INTO v_dog_beds_id FROM categories WHERE slug = 'dog-beds';
  SELECT id INTO v_cat_beds_id FROM categories WHERE slug = 'cat-beds';
  SELECT id INTO v_dog_health_id FROM categories WHERE slug = 'dog-health';
  SELECT id INTO v_cat_health_id FROM categories WHERE slug = 'cat-health';
  SELECT id INTO v_fish_food_id FROM categories WHERE slug = 'fish-food';
  SELECT id INTO v_fish_tanks_id FROM categories WHERE slug = 'fish-tanks';
  SELECT id INTO v_fish_decor_id FROM categories WHERE slug = 'aquarium-decor';
  SELECT id INTO v_bird_food_id FROM categories WHERE slug = 'bird-food';
  SELECT id INTO v_bird_cages_id FROM categories WHERE slug = 'bird-cages';
  SELECT id INTO v_small_animal_food_id FROM categories WHERE slug = 'small-animal-food';
  SELECT id INTO v_small_animal_bedding_id FROM categories WHERE slug = 'small-animal-bedding';
  SELECT id INTO v_reptile_food_id FROM categories WHERE slug = 'reptile-food';
  SELECT id INTO v_reptile_habitats_id FROM categories WHERE slug = 'reptile-habitats';

  -- DOG FOOD L3
  IF v_dog_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Dry Dog Food', 'Суха храна за кучета', 'dry-dog-food', v_dog_food_id, 1),
    ('Wet Dog Food', 'Мокра храна за кучета', 'wet-dog-food', v_dog_food_id, 2),
    ('Raw Dog Food', 'Сурова храна за кучета', 'raw-dog-food', v_dog_food_id, 3),
    ('Grain Free Dog Food', 'Храна без зърнени за кучета', 'grain-free-dog-food', v_dog_food_id, 4),
    ('Puppy Food', 'Храна за кученца', 'puppy-food', v_dog_food_id, 5),
    ('Senior Dog Food', 'Храна за възрастни кучета', 'senior-dog-food', v_dog_food_id, 6),
    ('Weight Management Dog Food', 'Храна за контрол на теглото', 'weight-management-dog-food', v_dog_food_id, 7),
    ('Prescription Dog Food', 'Лечебна храна за кучета', 'prescription-dog-food', v_dog_food_id, 8),
    ('Organic Dog Food', 'Био храна за кучета', 'organic-dog-food', v_dog_food_id, 9),
    ('Small Breed Dog Food', 'Храна за малки породи', 'small-breed-dog-food', v_dog_food_id, 10),
    ('Large Breed Dog Food', 'Храна за големи породи', 'large-breed-dog-food', v_dog_food_id, 11)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- CAT FOOD L3
  IF v_cat_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Dry Cat Food', 'Суха храна за котки', 'dry-cat-food', v_cat_food_id, 1),
    ('Wet Cat Food', 'Мокра храна за котки', 'wet-cat-food', v_cat_food_id, 2),
    ('Raw Cat Food', 'Сурова храна за котки', 'raw-cat-food', v_cat_food_id, 3),
    ('Grain Free Cat Food', 'Храна без зърнени за котки', 'grain-free-cat-food', v_cat_food_id, 4),
    ('Kitten Food', 'Храна за котенца', 'kitten-food', v_cat_food_id, 5),
    ('Senior Cat Food', 'Храна за възрастни котки', 'senior-cat-food', v_cat_food_id, 6),
    ('Indoor Cat Food', 'Храна за домашни котки', 'indoor-cat-food', v_cat_food_id, 7),
    ('Prescription Cat Food', 'Лечебна храна за котки', 'prescription-cat-food', v_cat_food_id, 8),
    ('Hairball Control', 'Контрол на космени топки', 'hairball-control-food', v_cat_food_id, 9),
    ('Urinary Health', 'Уринарно здраве', 'urinary-health-cat-food', v_cat_food_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- DOG TOYS L3
  IF v_dog_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Chew Toys', 'Играчки за дъвчене', 'dog-chew-toys', v_dog_toys_id, 1),
    ('Fetch Toys', 'Играчки за хвърляне', 'dog-fetch-toys', v_dog_toys_id, 2),
    ('Plush Dog Toys', 'Плюшени играчки', 'plush-dog-toys', v_dog_toys_id, 3),
    ('Rope Toys', 'Въжени играчки', 'rope-dog-toys', v_dog_toys_id, 4),
    ('Interactive Dog Toys', 'Интерактивни играчки', 'interactive-dog-toys', v_dog_toys_id, 5),
    ('Squeaky Toys', 'Пищящи играчки', 'squeaky-dog-toys', v_dog_toys_id, 6),
    ('Treat Dispensing Toys', 'Играчки с лакомства', 'treat-dispensing-dog-toys', v_dog_toys_id, 7),
    ('Tug Toys', 'Играчки за дърпане', 'tug-dog-toys', v_dog_toys_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- CAT TOYS L3
  IF v_cat_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Interactive Cat Toys', 'Интерактивни играчки', 'interactive-cat-toys', v_cat_toys_id, 1),
    ('Feather Toys', 'Пера играчки', 'feather-cat-toys', v_cat_toys_id, 2),
    ('Laser Pointers', 'Лазерни играчки', 'laser-cat-toys', v_cat_toys_id, 3),
    ('Catnip Toys', 'Играчки с котешка мента', 'catnip-toys', v_cat_toys_id, 4),
    ('Ball Toys', 'Топки за котки', 'ball-cat-toys', v_cat_toys_id, 5),
    ('Mice Toys', 'Мишки играчки', 'mice-cat-toys', v_cat_toys_id, 6),
    ('Tunnel Toys', 'Тунели за котки', 'tunnel-cat-toys', v_cat_toys_id, 7),
    ('Electronic Cat Toys', 'Електронни играчки', 'electronic-cat-toys', v_cat_toys_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- DOG TREATS L3
  IF v_dog_treats_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Training Treats', 'Лакомства за обучение', 'dog-training-treats', v_dog_treats_id, 1),
    ('Dental Treats', 'Дентални лакомства', 'dog-dental-treats', v_dog_treats_id, 2),
    ('Jerky Treats', 'Месни лакомства', 'dog-jerky-treats', v_dog_treats_id, 3),
    ('Biscuits', 'Бисквити за кучета', 'dog-biscuits', v_dog_treats_id, 4),
    ('Bones', 'Кокали за кучета', 'dog-bones', v_dog_treats_id, 5),
    ('Rawhide', 'Сурова кожа', 'dog-rawhide', v_dog_treats_id, 6),
    ('Freeze Dried Treats', 'Сушени лакомства', 'freeze-dried-dog-treats', v_dog_treats_id, 7),
    ('Soft Treats', 'Меки лакомства', 'soft-dog-treats', v_dog_treats_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- CAT TREATS L3
  IF v_cat_treats_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Crunchy Treats', 'Хрупкави лакомства', 'crunchy-cat-treats', v_cat_treats_id, 1),
    ('Soft Treats', 'Меки лакомства', 'soft-cat-treats', v_cat_treats_id, 2),
    ('Dental Treats', 'Дентални лакомства', 'dental-cat-treats', v_cat_treats_id, 3),
    ('Freeze Dried Treats', 'Сушени лакомства', 'freeze-dried-cat-treats', v_cat_treats_id, 4),
    ('Catnip Treats', 'Лакомства с котешка мента', 'catnip-cat-treats', v_cat_treats_id, 5),
    ('Hairball Treats', 'Лакомства против космени топки', 'hairball-cat-treats', v_cat_treats_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- DOG HEALTH L3
  IF v_dog_health_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Flea & Tick', 'Бълхи и кърлежи', 'dog-flea-tick', v_dog_health_id, 1),
    ('Joint Health', 'Здрави стави', 'dog-joint-health', v_dog_health_id, 2),
    ('Skin & Coat', 'Кожа и козина', 'dog-skin-coat', v_dog_health_id, 3),
    ('Digestive Health', 'Храносмилане', 'dog-digestive-health', v_dog_health_id, 4),
    ('Dental Care', 'Дентална грижа', 'dog-dental-care', v_dog_health_id, 5),
    ('Eye & Ear Care', 'Грижа за очи и уши', 'dog-eye-ear-care', v_dog_health_id, 6),
    ('Anxiety & Calming', 'Успокояващи', 'dog-anxiety-calming', v_dog_health_id, 7),
    ('Vitamins', 'Витамини', 'dog-vitamins', v_dog_health_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- CAT HEALTH L3
  IF v_cat_health_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Flea & Tick', 'Бълхи и кърлежи', 'cat-flea-tick', v_cat_health_id, 1),
    ('Hairball Remedies', 'Против космени топки', 'cat-hairball-remedies', v_cat_health_id, 2),
    ('Urinary Health', 'Уринарно здраве', 'cat-urinary-health', v_cat_health_id, 3),
    ('Digestive Health', 'Храносмилане', 'cat-digestive-health', v_cat_health_id, 4),
    ('Dental Care', 'Дентална грижа', 'cat-dental-care', v_cat_health_id, 5),
    ('Skin & Coat', 'Кожа и козина', 'cat-skin-coat', v_cat_health_id, 6),
    ('Anxiety & Calming', 'Успокояващи', 'cat-anxiety-calming', v_cat_health_id, 7),
    ('Vitamins', 'Витамини', 'cat-vitamins', v_cat_health_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Massive L3 categories batch 1 restored';
END $$;
;
