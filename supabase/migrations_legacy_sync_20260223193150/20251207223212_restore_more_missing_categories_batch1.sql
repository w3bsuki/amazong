
-- Restore more missing L2 and L3 categories
DO $$
DECLARE
  -- L0 IDs
  v_electronics_id UUID;
  v_pets_id UUID;
  v_sports_id UUID;
  v_health_id UUID;
  v_beauty_id UUID;
  v_office_id UUID;
  v_baby_id UUID;
  v_automotive_id UUID;
  v_services_id UUID;
  -- L1 IDs
  v_dog_supplies_id UUID;
  v_cat_supplies_id UUID;
  v_fish_supplies_id UUID;
  v_bird_supplies_id UUID;
  v_small_animal_id UUID;
  v_reptile_id UUID;
  -- Health L1s
  v_vitamins_id UUID;
  v_medical_supplies_id UUID;
  v_personal_care_id UUID;
  v_fitness_equipment_id UUID;
  -- Beauty L1s
  v_skincare_id UUID;
  v_makeup_id UUID;
  v_haircare_id UUID;
  v_fragrance_id UUID;
  v_nails_id UUID;
  -- Baby L1s
  v_baby_gear_id UUID;
  v_baby_feeding_id UUID;
  v_baby_clothing_id UUID;
  v_diapers_id UUID;
  v_baby_toys_id UUID;
  -- Office L1s
  v_office_furniture_id UUID;
  v_office_supplies_id UUID;
  v_office_electronics_id UUID;
BEGIN
  -- Get L0 IDs
  SELECT id INTO v_electronics_id FROM categories WHERE slug = 'electronics';
  SELECT id INTO v_pets_id FROM categories WHERE slug = 'pets';
  SELECT id INTO v_sports_id FROM categories WHERE slug = 'sports-outdoors';
  SELECT id INTO v_health_id FROM categories WHERE slug = 'health-wellness';
  SELECT id INTO v_beauty_id FROM categories WHERE slug = 'beauty';
  SELECT id INTO v_office_id FROM categories WHERE slug = 'office-supplies';
  SELECT id INTO v_baby_id FROM categories WHERE slug = 'baby-kids';
  SELECT id INTO v_automotive_id FROM categories WHERE slug = 'automotive';
  SELECT id INTO v_services_id FROM categories WHERE slug = 'services';

  -- Get Pet L1 IDs
  SELECT id INTO v_dog_supplies_id FROM categories WHERE slug = 'dog-supplies';
  SELECT id INTO v_cat_supplies_id FROM categories WHERE slug = 'cat-supplies';
  SELECT id INTO v_fish_supplies_id FROM categories WHERE slug = 'fish-aquatic';
  SELECT id INTO v_bird_supplies_id FROM categories WHERE slug = 'bird-supplies';
  SELECT id INTO v_small_animal_id FROM categories WHERE slug = 'small-animal-supplies';
  SELECT id INTO v_reptile_id FROM categories WHERE slug = 'reptile-supplies';

  -- Get Health L1 IDs
  SELECT id INTO v_vitamins_id FROM categories WHERE slug = 'vitamins-supplements';
  SELECT id INTO v_medical_supplies_id FROM categories WHERE slug = 'medical-supplies';
  SELECT id INTO v_personal_care_id FROM categories WHERE slug = 'personal-care';
  SELECT id INTO v_fitness_equipment_id FROM categories WHERE slug = 'fitness-equipment';

  -- Get Beauty L1 IDs
  SELECT id INTO v_skincare_id FROM categories WHERE slug = 'skincare';
  SELECT id INTO v_makeup_id FROM categories WHERE slug = 'makeup';
  SELECT id INTO v_haircare_id FROM categories WHERE slug = 'haircare';
  SELECT id INTO v_fragrance_id FROM categories WHERE slug = 'fragrance';
  SELECT id INTO v_nails_id FROM categories WHERE slug = 'nails';

  -- Get Baby L1 IDs
  SELECT id INTO v_baby_gear_id FROM categories WHERE slug = 'baby-gear';
  SELECT id INTO v_baby_feeding_id FROM categories WHERE slug = 'baby-feeding';
  SELECT id INTO v_baby_clothing_id FROM categories WHERE slug = 'baby-clothing';
  SELECT id INTO v_diapers_id FROM categories WHERE slug = 'diapers-potty';
  SELECT id INTO v_baby_toys_id FROM categories WHERE slug = 'baby-toys';

  -- Get Office L1 IDs
  SELECT id INTO v_office_furniture_id FROM categories WHERE slug = 'office-furniture-decor';
  SELECT id INTO v_office_supplies_id FROM categories WHERE slug = 'office-school-supplies';
  SELECT id INTO v_office_electronics_id FROM categories WHERE slug = 'office-electronics';

  -- MORE PET L2/L3 --
  -- Dog Food Types (L2 under dog-supplies)
  IF v_dog_supplies_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Dog Food', 'Храна за кучета', 'dog-food', v_dog_supplies_id, 1),
    ('Dog Treats', 'Лакомства за кучета', 'dog-treats', v_dog_supplies_id, 2),
    ('Dog Toys', 'Играчки за кучета', 'dog-toys', v_dog_supplies_id, 3),
    ('Dog Beds', 'Легла за кучета', 'dog-beds', v_dog_supplies_id, 4),
    ('Dog Collars & Leashes', 'Нашийници и каишки', 'dog-collars-leashes', v_dog_supplies_id, 5),
    ('Dog Grooming', 'Грижа за козината', 'dog-grooming', v_dog_supplies_id, 6),
    ('Dog Clothing', 'Дрехи за кучета', 'dog-clothing', v_dog_supplies_id, 7),
    ('Dog Health', 'Здраве за кучета', 'dog-health', v_dog_supplies_id, 8),
    ('Dog Bowls & Feeders', 'Купи и хранилки', 'dog-bowls-feeders', v_dog_supplies_id, 9),
    ('Dog Crates & Kennels', 'Клетки и боксове', 'dog-crates-kennels', v_dog_supplies_id, 10),
    ('Dog Training', 'Обучение', 'dog-training', v_dog_supplies_id, 11),
    ('Dog Travel', 'Пътуване с куче', 'dog-travel', v_dog_supplies_id, 12)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cat Categories (L2 under cat-supplies)
  IF v_cat_supplies_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Cat Food', 'Храна за котки', 'cat-food', v_cat_supplies_id, 1),
    ('Cat Treats', 'Лакомства за котки', 'cat-treats', v_cat_supplies_id, 2),
    ('Cat Toys', 'Играчки за котки', 'cat-toys', v_cat_supplies_id, 3),
    ('Cat Beds', 'Легла за котки', 'cat-beds', v_cat_supplies_id, 4),
    ('Cat Litter', 'Котешка тоалетна', 'cat-litter', v_cat_supplies_id, 5),
    ('Cat Trees & Scratchers', 'Катерушки', 'cat-trees-scratchers', v_cat_supplies_id, 6),
    ('Cat Grooming', 'Грижа за козината', 'cat-grooming', v_cat_supplies_id, 7),
    ('Cat Collars & Harnesses', 'Нашийници и нагръдници', 'cat-collars-harnesses', v_cat_supplies_id, 8),
    ('Cat Health', 'Здраве за котки', 'cat-health', v_cat_supplies_id, 9),
    ('Cat Bowls & Feeders', 'Купи и хранилки', 'cat-bowls-feeders', v_cat_supplies_id, 10),
    ('Cat Carriers', 'Транспортни чанти', 'cat-carriers', v_cat_supplies_id, 11)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- HEALTH L2 Categories
  IF v_vitamins_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Multivitamins', 'Мултивитамини', 'multivitamins', v_vitamins_id, 1),
    ('Vitamin C', 'Витамин C', 'vitamin-c', v_vitamins_id, 2),
    ('Vitamin D', 'Витамин D', 'vitamin-d', v_vitamins_id, 3),
    ('B Vitamins', 'Витамини група B', 'b-vitamins', v_vitamins_id, 4),
    ('Fish Oil', 'Рибено масло', 'fish-oil', v_vitamins_id, 5),
    ('Probiotics', 'Пробиотици', 'probiotics', v_vitamins_id, 6),
    ('Protein Supplements', 'Протеинови добавки', 'protein-supplements', v_vitamins_id, 7),
    ('Minerals', 'Минерали', 'minerals', v_vitamins_id, 8),
    ('Herbal Supplements', 'Билкови добавки', 'herbal-supplements', v_vitamins_id, 9),
    ('Sports Nutrition', 'Спортно хранене', 'sports-nutrition', v_vitamins_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_medical_supplies_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('First Aid', 'Първа помощ', 'first-aid', v_medical_supplies_id, 1),
    ('Blood Pressure Monitors', 'Апарати за кръвно', 'blood-pressure-monitors', v_medical_supplies_id, 2),
    ('Thermometers', 'Термометри', 'thermometers', v_medical_supplies_id, 3),
    ('Mobility Aids', 'Помощни средства', 'mobility-aids', v_medical_supplies_id, 4),
    ('Braces & Supports', 'Ортези и бандажи', 'braces-supports', v_medical_supplies_id, 5),
    ('Diabetes Care', 'Грижа при диабет', 'diabetes-care', v_medical_supplies_id, 6),
    ('Respiratory Care', 'Дихателна грижа', 'respiratory-care', v_medical_supplies_id, 7),
    ('Incontinence', 'Инконтиненция', 'incontinence', v_medical_supplies_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- BEAUTY L2 Categories
  IF v_skincare_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Face Moisturizers', 'Кремове за лице', 'face-moisturizers', v_skincare_id, 1),
    ('Face Cleansers', 'Почистващи продукти', 'face-cleansers', v_skincare_id, 2),
    ('Face Serums', 'Серуми за лице', 'face-serums', v_skincare_id, 3),
    ('Eye Care', 'Грижа за очи', 'eye-care', v_skincare_id, 4),
    ('Face Masks', 'Маски за лице', 'face-masks', v_skincare_id, 5),
    ('Sunscreen', 'Слънцезащитни', 'sunscreen', v_skincare_id, 6),
    ('Anti-Aging', 'Анти-ейдж', 'anti-aging', v_skincare_id, 7),
    ('Acne Care', 'Грижа при акне', 'acne-care', v_skincare_id, 8),
    ('Lip Care', 'Грижа за устни', 'lip-care', v_skincare_id, 9),
    ('Body Lotions', 'Лосиони за тяло', 'body-lotions', v_skincare_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_makeup_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Foundation', 'Фон дьо тен', 'foundation', v_makeup_id, 1),
    ('Concealer', 'Коректор', 'concealer', v_makeup_id, 2),
    ('Powder', 'Пудра', 'powder', v_makeup_id, 3),
    ('Blush', 'Руж', 'blush', v_makeup_id, 4),
    ('Bronzer', 'Бронзант', 'bronzer', v_makeup_id, 5),
    ('Highlighter', 'Хайлайтър', 'highlighter', v_makeup_id, 6),
    ('Eye Shadow', 'Сенки за очи', 'eye-shadow', v_makeup_id, 7),
    ('Eyeliner', 'Очна линия', 'eyeliner', v_makeup_id, 8),
    ('Mascara', 'Спирала', 'mascara', v_makeup_id, 9),
    ('Lipstick', 'Червило', 'lipstick', v_makeup_id, 10),
    ('Lip Gloss', 'Гланц за устни', 'lip-gloss', v_makeup_id, 11),
    ('Makeup Brushes', 'Четки за грим', 'makeup-brushes', v_makeup_id, 12),
    ('Makeup Removers', 'Почистване на грим', 'makeup-removers', v_makeup_id, 13)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_haircare_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Shampoo', 'Шампоан', 'shampoo', v_haircare_id, 1),
    ('Conditioner', 'Балсам', 'conditioner', v_haircare_id, 2),
    ('Hair Treatments', 'Терапии за коса', 'hair-treatments', v_haircare_id, 3),
    ('Hair Styling', 'Стайлинг', 'hair-styling', v_haircare_id, 4),
    ('Hair Color', 'Боя за коса', 'hair-color', v_haircare_id, 5),
    ('Hair Tools', 'Уреди за коса', 'hair-tools', v_haircare_id, 6),
    ('Hair Accessories', 'Аксесоари за коса', 'hair-accessories', v_haircare_id, 7),
    ('Hair Loss', 'Против косопад', 'hair-loss', v_haircare_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_fragrance_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Women''s Perfume', 'Дамски парфюми', 'womens-perfume', v_fragrance_id, 1),
    ('Men''s Cologne', 'Мъжки парфюми', 'mens-cologne', v_fragrance_id, 2),
    ('Unisex Fragrances', 'Унисекс парфюми', 'unisex-fragrances', v_fragrance_id, 3),
    ('Body Sprays', 'Спрейове за тяло', 'body-sprays', v_fragrance_id, 4),
    ('Perfume Sets', 'Парфюмни сетове', 'perfume-sets', v_fragrance_id, 5),
    ('Rollerballs', 'Ролер парфюми', 'rollerballs', v_fragrance_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- BABY L2 Categories
  IF v_baby_gear_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Strollers', 'Колички', 'strollers', v_baby_gear_id, 1),
    ('Car Seats', 'Столчета за кола', 'car-seats', v_baby_gear_id, 2),
    ('Baby Carriers', 'Носилки', 'baby-carriers', v_baby_gear_id, 3),
    ('Cribs & Bassinets', 'Легла и кошчета', 'cribs-bassinets', v_baby_gear_id, 4),
    ('High Chairs', 'Столчета за хранене', 'high-chairs', v_baby_gear_id, 5),
    ('Playpens', 'Кошарки', 'playpens', v_baby_gear_id, 6),
    ('Baby Swings', 'Люлки', 'baby-swings', v_baby_gear_id, 7),
    ('Baby Monitors', 'Бебефони', 'baby-monitors', v_baby_gear_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_baby_feeding_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Baby Bottles', 'Шишета', 'baby-bottles', v_baby_feeding_id, 1),
    ('Breast Pumps', 'Помпи за кърма', 'breast-pumps', v_baby_feeding_id, 2),
    ('Baby Formula', 'Адаптирано мляко', 'baby-formula', v_baby_feeding_id, 3),
    ('Baby Food', 'Бебешка храна', 'baby-food', v_baby_feeding_id, 4),
    ('Bibs', 'Лигавници', 'bibs', v_baby_feeding_id, 5),
    ('Sippy Cups', 'Чаши непроливайки', 'sippy-cups', v_baby_feeding_id, 6),
    ('Pacifiers', 'Биберони', 'pacifiers', v_baby_feeding_id, 7),
    ('Sterilizers', 'Стерилизатори', 'sterilizers', v_baby_feeding_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'More missing categories restored - batch 1';
END $$;
;
