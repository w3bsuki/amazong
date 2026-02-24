
-- Batch 13: Office Supplies, Pet Supplies, Jewelry & Watches deep categories
DO $$
DECLARE
  v_office_id UUID;
  v_office_furniture_id UUID;
  v_school_id UUID;
  v_desk_id UUID;
  v_pets_id UUID;
  v_dogs_id UUID;
  v_cats_id UUID;
  v_fish_id UUID;
  v_birds_id UUID;
  v_small_animals_id UUID;
  v_jewelry_id UUID;
  v_necklaces_id UUID;
  v_rings_id UUID;
  v_earrings_id UUID;
  v_bracelets_id UUID;
BEGIN
  SELECT id INTO v_office_id FROM categories WHERE slug = 'office-supplies';
  SELECT id INTO v_office_furniture_id FROM categories WHERE slug = 'office-furniture';
  SELECT id INTO v_school_id FROM categories WHERE slug = 'school-supplies';
  SELECT id INTO v_desk_id FROM categories WHERE slug = 'desk-accessories';
  SELECT id INTO v_pets_id FROM categories WHERE slug = 'pet-supplies';
  SELECT id INTO v_dogs_id FROM categories WHERE slug = 'dogs';
  SELECT id INTO v_cats_id FROM categories WHERE slug = 'cats';
  SELECT id INTO v_fish_id FROM categories WHERE slug = 'fish-aquarium';
  SELECT id INTO v_birds_id FROM categories WHERE slug = 'birds';
  SELECT id INTO v_small_animals_id FROM categories WHERE slug = 'small-animals';
  SELECT id INTO v_jewelry_id FROM categories WHERE slug = 'jewelry-watches';
  SELECT id INTO v_necklaces_id FROM categories WHERE slug = 'necklaces';
  SELECT id INTO v_rings_id FROM categories WHERE slug = 'rings';
  SELECT id INTO v_earrings_id FROM categories WHERE slug = 'earrings';
  SELECT id INTO v_bracelets_id FROM categories WHERE slug = 'bracelets';
  
  -- Dogs deep categories
  IF v_dogs_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Dog Food', 'Храна за кучета', 'dogs-food', v_dogs_id, 1),
    ('Dry Dog Food', 'Суха храна за кучета', 'dogs-food-dry', v_dogs_id, 2),
    ('Wet Dog Food', 'Мокра храна за кучета', 'dogs-food-wet', v_dogs_id, 3),
    ('Grain-Free Dog Food', 'Безглутенова храна', 'dogs-food-grain-free', v_dogs_id, 4),
    ('Puppy Food', 'Храна за кученца', 'dogs-food-puppy', v_dogs_id, 5),
    ('Senior Dog Food', 'Храна за възрастни кучета', 'dogs-food-senior', v_dogs_id, 6),
    ('Dog Treats', 'Лакомства за кучета', 'dogs-treats', v_dogs_id, 7),
    ('Training Treats', 'Лакомства за обучение', 'dogs-treats-training', v_dogs_id, 8),
    ('Dental Treats', 'Лакомства за зъби', 'dogs-treats-dental', v_dogs_id, 9),
    ('Dog Toys', 'Играчки за кучета', 'dogs-toys', v_dogs_id, 10),
    ('Chew Toys', 'Играчки за дъвчене', 'dogs-toys-chew', v_dogs_id, 11),
    ('Fetch Toys', 'Играчки за хвърляне', 'dogs-toys-fetch', v_dogs_id, 12),
    ('Interactive Toys', 'Интерактивни играчки', 'dogs-toys-interactive', v_dogs_id, 13),
    ('Dog Beds', 'Легла за кучета', 'dogs-beds', v_dogs_id, 14),
    ('Orthopedic Beds', 'Ортопедични легла', 'dogs-beds-orthopedic', v_dogs_id, 15),
    ('Dog Crates', 'Клетки за кучета', 'dogs-crates', v_dogs_id, 16),
    ('Dog Kennels', 'Кучешки къщички', 'dogs-kennels', v_dogs_id, 17),
    ('Dog Collars', 'Нашийници', 'dogs-collars', v_dogs_id, 18),
    ('Dog Leashes', 'Повод за кучета', 'dogs-leashes', v_dogs_id, 19),
    ('Dog Harnesses', 'Нагръдници', 'dogs-harnesses', v_dogs_id, 20),
    ('Dog Clothing', 'Облекло за кучета', 'dogs-clothing', v_dogs_id, 21),
    ('Dog Coats', 'Палта за кучета', 'dogs-coats', v_dogs_id, 22),
    ('Dog Grooming', 'Грижа за козината', 'dogs-grooming', v_dogs_id, 23),
    ('Dog Shampoo', 'Шампоан за кучета', 'dogs-shampoo', v_dogs_id, 24),
    ('Dog Brushes', 'Четки за кучета', 'dogs-brushes', v_dogs_id, 25)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cats deep categories
  IF v_cats_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Cat Food', 'Храна за котки', 'cats-food', v_cats_id, 1),
    ('Dry Cat Food', 'Суха храна за котки', 'cats-food-dry', v_cats_id, 2),
    ('Wet Cat Food', 'Мокра храна за котки', 'cats-food-wet', v_cats_id, 3),
    ('Kitten Food', 'Храна за котенца', 'cats-food-kitten', v_cats_id, 4),
    ('Senior Cat Food', 'Храна за възрастни котки', 'cats-food-senior', v_cats_id, 5),
    ('Cat Treats', 'Лакомства за котки', 'cats-treats', v_cats_id, 6),
    ('Cat Toys', 'Играчки за котки', 'cats-toys', v_cats_id, 7),
    ('Interactive Cat Toys', 'Интерактивни играчки', 'cats-toys-interactive', v_cats_id, 8),
    ('Feather Toys', 'Играчки с пера', 'cats-toys-feather', v_cats_id, 9),
    ('Laser Pointers', 'Лазерни показалки', 'cats-toys-laser', v_cats_id, 10),
    ('Cat Litter', 'Постелка за котки', 'cats-litter', v_cats_id, 11),
    ('Clumping Litter', 'Сбиваща се постелка', 'cats-litter-clumping', v_cats_id, 12),
    ('Crystal Litter', 'Кристална постелка', 'cats-litter-crystal', v_cats_id, 13),
    ('Litter Boxes', 'Котешки тоалетни', 'cats-litter-boxes', v_cats_id, 14),
    ('Covered Litter Boxes', 'Закрити тоалетни', 'cats-litter-boxes-covered', v_cats_id, 15),
    ('Cat Beds', 'Легла за котки', 'cats-beds', v_cats_id, 16),
    ('Cat Trees', 'Катерушки', 'cats-trees', v_cats_id, 17),
    ('Scratching Posts', 'Драскалки', 'cats-scratching-posts', v_cats_id, 18),
    ('Cat Carriers', 'Транспортни чанти', 'cats-carriers', v_cats_id, 19),
    ('Cat Collars', 'Нашийници за котки', 'cats-collars', v_cats_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fish & Aquarium deep categories
  IF v_fish_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Aquariums', 'Аквариуми', 'fish-aquariums', v_fish_id, 1),
    ('Small Aquariums', 'Малки аквариуми', 'fish-aquariums-small', v_fish_id, 2),
    ('Large Aquariums', 'Големи аквариуми', 'fish-aquariums-large', v_fish_id, 3),
    ('Aquarium Kits', 'Комплекти аквариуми', 'fish-aquarium-kits', v_fish_id, 4),
    ('Fish Food', 'Храна за риби', 'fish-food', v_fish_id, 5),
    ('Flake Food', 'Храна на люспи', 'fish-food-flakes', v_fish_id, 6),
    ('Pellet Food', 'Гранулирана храна', 'fish-food-pellets', v_fish_id, 7),
    ('Frozen Food', 'Замразена храна', 'fish-food-frozen', v_fish_id, 8),
    ('Aquarium Filters', 'Филтри за аквариум', 'fish-filters', v_fish_id, 9),
    ('Internal Filters', 'Вътрешни филтри', 'fish-filters-internal', v_fish_id, 10),
    ('External Filters', 'Външни филтри', 'fish-filters-external', v_fish_id, 11),
    ('Aquarium Heaters', 'Нагреватели', 'fish-heaters', v_fish_id, 12),
    ('Aquarium Lighting', 'Осветление', 'fish-lighting', v_fish_id, 13),
    ('LED Lights', 'LED осветление', 'fish-lighting-led', v_fish_id, 14),
    ('Air Pumps', 'Въздушни помпи', 'fish-air-pumps', v_fish_id, 15),
    ('Decorations', 'Декорации', 'fish-decorations', v_fish_id, 16),
    ('Plants', 'Растения', 'fish-plants', v_fish_id, 17),
    ('Live Plants', 'Живи растения', 'fish-plants-live', v_fish_id, 18),
    ('Gravel', 'Чакъл', 'fish-gravel', v_fish_id, 19),
    ('Water Treatment', 'Третиране на вода', 'fish-water-treatment', v_fish_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Birds deep categories
  IF v_birds_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bird Cages', 'Клетки за птици', 'birds-cages', v_birds_id, 1),
    ('Small Bird Cages', 'Малки клетки', 'birds-cages-small', v_birds_id, 2),
    ('Large Bird Cages', 'Големи клетки', 'birds-cages-large', v_birds_id, 3),
    ('Bird Food', 'Храна за птици', 'birds-food', v_birds_id, 4),
    ('Seed Mixes', 'Семена', 'birds-food-seeds', v_birds_id, 5),
    ('Pellet Food', 'Гранулирана храна', 'birds-food-pellets', v_birds_id, 6),
    ('Bird Treats', 'Лакомства за птици', 'birds-treats', v_birds_id, 7),
    ('Bird Toys', 'Играчки за птици', 'birds-toys', v_birds_id, 8),
    ('Swings', 'Люлки', 'birds-toys-swings', v_birds_id, 9),
    ('Perches', 'Кацалки', 'birds-perches', v_birds_id, 10),
    ('Bird Baths', 'Вани за птици', 'birds-baths', v_birds_id, 11),
    ('Feeders', 'Хранилки', 'birds-feeders', v_birds_id, 12),
    ('Waterers', 'Поилки', 'birds-waterers', v_birds_id, 13),
    ('Bird Health', 'Здраве на птици', 'birds-health', v_birds_id, 14),
    ('Bird Supplements', 'Добавки за птици', 'birds-supplements', v_birds_id, 15)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Office Furniture deep categories
  IF v_office_furniture_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Office Desks', 'Офис бюра', 'office-desks', v_office_furniture_id, 1),
    ('Standing Desks', 'Стоящи бюра', 'office-desks-standing', v_office_furniture_id, 2),
    ('L-Shaped Desks', 'L-образни бюра', 'office-desks-l-shaped', v_office_furniture_id, 3),
    ('Computer Desks', 'Компютърни бюра', 'office-desks-computer', v_office_furniture_id, 4),
    ('Office Chairs', 'Офис столове', 'office-chairs', v_office_furniture_id, 5),
    ('Executive Chairs', 'Директорски столове', 'office-chairs-executive', v_office_furniture_id, 6),
    ('Ergonomic Chairs', 'Ергономични столове', 'office-chairs-ergonomic', v_office_furniture_id, 7),
    ('Task Chairs', 'Работни столове', 'office-chairs-task', v_office_furniture_id, 8),
    ('Filing Cabinets', 'Шкафове за документи', 'office-filing-cabinets', v_office_furniture_id, 9),
    ('Bookcases', 'Етажерки', 'office-bookcases', v_office_furniture_id, 10),
    ('Conference Tables', 'Конферентни маси', 'office-conference-tables', v_office_furniture_id, 11),
    ('Reception Desks', 'Рецепции', 'office-reception-desks', v_office_furniture_id, 12)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- School Supplies deep categories
  IF v_school_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Notebooks', 'Тетрадки', 'school-notebooks', v_school_id, 1),
    ('Spiral Notebooks', 'Спирални тетрадки', 'school-notebooks-spiral', v_school_id, 2),
    ('Composition Notebooks', 'Тетрадки с твърди корици', 'school-notebooks-composition', v_school_id, 3),
    ('Binders', 'Класьори', 'school-binders', v_school_id, 4),
    ('3-Ring Binders', '3-халкови класьори', 'school-binders-3ring', v_school_id, 5),
    ('Folders', 'Папки', 'school-folders', v_school_id, 6),
    ('Pencils', 'Моливи', 'school-pencils', v_school_id, 7),
    ('Mechanical Pencils', 'Автоматични моливи', 'school-pencils-mechanical', v_school_id, 8),
    ('Pens', 'Химикалки', 'school-pens', v_school_id, 9),
    ('Ballpoint Pens', 'Химикали', 'school-pens-ballpoint', v_school_id, 10),
    ('Gel Pens', 'Гел химикалки', 'school-pens-gel', v_school_id, 11),
    ('Erasers', 'Гуми', 'school-erasers', v_school_id, 12),
    ('Rulers', 'Линии', 'school-rulers', v_school_id, 13),
    ('Scissors', 'Ножици', 'school-scissors', v_school_id, 14),
    ('Glue', 'Лепило', 'school-glue', v_school_id, 15),
    ('Highlighters', 'Маркери', 'school-highlighters', v_school_id, 16),
    ('Calculators', 'Калкулатори', 'school-calculators', v_school_id, 17),
    ('Backpacks', 'Раници', 'school-backpacks', v_school_id, 18),
    ('Pencil Cases', 'Перначета', 'school-pencil-cases', v_school_id, 19),
    ('Art Supplies', 'Материали за рисуване', 'school-art-supplies', v_school_id, 20)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
