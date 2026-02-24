
-- Batch 68: Pet supplies deeper categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Dog Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dog-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dog Food', 'Храна за кучета', 'dog-food', v_parent_id, 1),
      ('Dog Treats', 'Лакомства за кучета', 'dog-treats', v_parent_id, 2),
      ('Dog Toys', 'Играчки за кучета', 'dog-toys', v_parent_id, 3),
      ('Dog Beds', 'Легла за кучета', 'dog-beds', v_parent_id, 4),
      ('Dog Collars', 'Нашийници за кучета', 'dog-collars', v_parent_id, 5),
      ('Dog Leashes', 'Каишки за кучета', 'dog-leashes', v_parent_id, 6),
      ('Dog Crates', 'Клетки за кучета', 'dog-crates', v_parent_id, 7),
      ('Dog Grooming', 'Грижа за кучета', 'dog-grooming', v_parent_id, 8),
      ('Dog Clothing', 'Дрехи за кучета', 'dog-clothing', v_parent_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cat Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cat-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cat Food', 'Храна за котки', 'cat-food', v_parent_id, 1),
      ('Cat Treats', 'Лакомства за котки', 'cat-treats', v_parent_id, 2),
      ('Cat Toys', 'Играчки за котки', 'cat-toys', v_parent_id, 3),
      ('Cat Beds', 'Легла за котки', 'cat-beds', v_parent_id, 4),
      ('Cat Litter', 'Котешка тоалетна', 'cat-litter', v_parent_id, 5),
      ('Litter Boxes', 'Кутии за котешка тоалетна', 'litter-boxes', v_parent_id, 6),
      ('Cat Trees', 'Драскалки за котки', 'cat-trees', v_parent_id, 7),
      ('Cat Carriers', 'Транспортни чанти за котки', 'cat-carriers', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fish & Aquarium deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fish-aquarium';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Aquariums', 'Аквариуми', 'aquariums', v_parent_id, 1),
      ('Fish Food', 'Храна за риби', 'fish-food', v_parent_id, 2),
      ('Aquarium Filters', 'Филтри за аквариуми', 'aquarium-filters', v_parent_id, 3),
      ('Aquarium Lights', 'Осветление за аквариуми', 'aquarium-lights', v_parent_id, 4),
      ('Aquarium Decorations', 'Декорации за аквариуми', 'aquarium-decorations', v_parent_id, 5),
      ('Aquarium Plants', 'Растения за аквариуми', 'aquarium-plants', v_parent_id, 6),
      ('Water Conditioners', 'Обработка на вода', 'water-conditioners', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bird Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bird-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bird Cages', 'Клетки за птици', 'bird-cages', v_parent_id, 1),
      ('Bird Food', 'Храна за птици', 'bird-food', v_parent_id, 2),
      ('Bird Toys', 'Играчки за птици', 'bird-toys', v_parent_id, 3),
      ('Bird Perches', 'Кацалки', 'bird-perches', v_parent_id, 4),
      ('Bird Baths Pet', 'Вани за птици', 'bird-baths-pet', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Small Animal Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'small-animal-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hamster Supplies', 'Продукти за хамстери', 'hamster-supplies', v_parent_id, 1),
      ('Rabbit Supplies', 'Продукти за зайци', 'rabbit-supplies', v_parent_id, 2),
      ('Guinea Pig Supplies', 'Продукти за морски свинчета', 'guinea-pig-supplies', v_parent_id, 3),
      ('Small Animal Cages', 'Клетки за малки животни', 'small-animal-cages', v_parent_id, 4),
      ('Small Animal Food', 'Храна за малки животни', 'small-animal-food', v_parent_id, 5),
      ('Bedding Pet', 'Постелки за домашни любимци', 'bedding-pet', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Reptile Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'reptile-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Reptile Terrariums', 'Терариуми за влечуги', 'reptile-terrariums', v_parent_id, 1),
      ('Reptile Food', 'Храна за влечуги', 'reptile-food', v_parent_id, 2),
      ('Reptile Heating', 'Отопление за влечуги', 'reptile-heating', v_parent_id, 3),
      ('Reptile Lighting', 'Осветление за влечуги', 'reptile-lighting', v_parent_id, 4),
      ('Reptile Substrate', 'Субстрат за влечуги', 'reptile-substrate', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pet Health deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pet-health';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Flea & Tick', 'Бълхи и кърлежи', 'flea-tick', v_parent_id, 1),
      ('Pet Vitamins', 'Витамини за домашни любимци', 'pet-vitamins', v_parent_id, 2),
      ('Pet Dental Care', 'Дентална грижа за домашни любимци', 'pet-dental-care', v_parent_id, 3),
      ('Pet First Aid', 'Първа помощ за домашни любимци', 'pet-first-aid', v_parent_id, 4),
      ('Pet Medications', 'Лекарства за домашни любимци', 'pet-medications', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pet Travel deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pet-travel';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pet Carriers', 'Транспортни кутии', 'pet-carriers', v_parent_id, 1),
      ('Pet Car Seats', 'Столчета за кола за домашни любимци', 'pet-car-seats', v_parent_id, 2),
      ('Pet Strollers', 'Колички за домашни любимци', 'pet-strollers', v_parent_id, 3),
      ('Pet Travel Bowls', 'Купи за пътуване', 'pet-travel-bowls', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
