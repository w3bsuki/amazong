
-- Restore missing Wholesale L3 categories (documented: 499, current: 222, missing: ~277)

DO $$
DECLARE
  wholesale_id UUID;
  -- L1 categories
  ws_electronics_id UUID;
  ws_fashion_id UUID;
  ws_beauty_id UUID;
  ws_home_id UUID;
  ws_food_id UUID;
  ws_toys_id UUID;
  ws_sports_id UUID;
  ws_auto_id UUID;
  ws_health_id UUID;
  ws_office_id UUID;
  ws_pet_id UUID;
  ws_packaging_id UUID;
  ws_seasonal_id UUID;
  ws_jewelry_id UUID;
  ws_baby_id UUID;
  -- L2 categories
  ws_phone_acc_id UUID;
  ws_womens_clothing_id UUID;
  ws_mens_clothing_id UUID;
  ws_shoes_id UUID;
  ws_skincare_id UUID;
  ws_makeup_id UUID;
  ws_haircare_id UUID;
  ws_home_decor_id UUID;
  ws_kitchen_id UUID;
  ws_packaged_food_id UUID;
  ws_beverages_id UUID;
  ws_edu_toys_id UUID;
  ws_action_figures_id UUID;
  ws_fitness_id UUID;
  ws_car_parts_id UUID;
  ws_medical_supplies_id UUID;
  ws_christmas_id UUID;
  ws_baby_clothing_id UUID;
  ws_baby_gear_id UUID;
BEGIN
  SELECT id INTO wholesale_id FROM categories WHERE slug = 'wholesale';
  
  -- Get L1 IDs
  SELECT id INTO ws_electronics_id FROM categories WHERE slug = 'wholesale-electronics' AND parent_id = wholesale_id;
  SELECT id INTO ws_fashion_id FROM categories WHERE slug = 'wholesale-fashion' AND parent_id = wholesale_id;
  SELECT id INTO ws_beauty_id FROM categories WHERE slug = 'wholesale-beauty' AND parent_id = wholesale_id;
  SELECT id INTO ws_home_id FROM categories WHERE slug = 'wholesale-home-garden' AND parent_id = wholesale_id;
  SELECT id INTO ws_food_id FROM categories WHERE slug = 'wholesale-food' AND parent_id = wholesale_id;
  SELECT id INTO ws_toys_id FROM categories WHERE slug = 'wholesale-toys' AND parent_id = wholesale_id;
  SELECT id INTO ws_sports_id FROM categories WHERE slug = 'wholesale-sports' AND parent_id = wholesale_id;
  SELECT id INTO ws_auto_id FROM categories WHERE slug = 'wholesale-automotive' AND parent_id = wholesale_id;
  SELECT id INTO ws_health_id FROM categories WHERE slug = 'wholesale-health' AND parent_id = wholesale_id;
  SELECT id INTO ws_office_id FROM categories WHERE slug = 'wholesale-office' AND parent_id = wholesale_id;
  SELECT id INTO ws_pet_id FROM categories WHERE slug = 'wholesale-pet' AND parent_id = wholesale_id;
  SELECT id INTO ws_packaging_id FROM categories WHERE slug = 'wholesale-packaging' AND parent_id = wholesale_id;
  SELECT id INTO ws_seasonal_id FROM categories WHERE slug = 'wholesale-seasonal' AND parent_id = wholesale_id;
  SELECT id INTO ws_jewelry_id FROM categories WHERE slug = 'wholesale-jewelry' AND parent_id = wholesale_id;
  SELECT id INTO ws_baby_id FROM categories WHERE slug = 'wholesale-baby' AND parent_id = wholesale_id;

  -- Get L2 IDs for Electronics
  SELECT id INTO ws_phone_acc_id FROM categories WHERE slug = 'wholesale-phone-accessories' AND parent_id = ws_electronics_id;
  
  -- Phone Accessories L3
  IF ws_phone_acc_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Screen Protectors', 'Протектори за екран', 'wholesale-screen-protectors', ws_phone_acc_id, '📱', 1),
    ('Phone Cases', 'Калъфи за телефони', 'wholesale-phone-cases', ws_phone_acc_id, '📱', 2),
    ('Chargers & Cables', 'Зарядни и кабели', 'wholesale-chargers-cables', ws_phone_acc_id, '🔌', 3),
    ('Earbuds & Headphones', 'Слушалки', 'wholesale-earbuds', ws_phone_acc_id, '🎧', 4),
    ('Power Banks', 'Външни батерии', 'wholesale-power-banks', ws_phone_acc_id, '🔋', 5),
    ('Phone Mounts', 'Стойки за телефон', 'wholesale-phone-mounts', ws_phone_acc_id, '🚗', 6),
    ('Styluses', 'Писалки', 'wholesale-styluses', ws_phone_acc_id, '✏️', 7),
    ('Phone Grips & Rings', 'Пръстени за телефон', 'wholesale-phone-grips', ws_phone_acc_id, '💍', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Get L2 IDs for Fashion
  SELECT id INTO ws_womens_clothing_id FROM categories WHERE slug = 'wholesale-womens-clothing' AND parent_id = ws_fashion_id;
  SELECT id INTO ws_mens_clothing_id FROM categories WHERE slug = 'wholesale-mens-clothing' AND parent_id = ws_fashion_id;
  SELECT id INTO ws_shoes_id FROM categories WHERE slug = 'wholesale-shoes' AND parent_id = ws_fashion_id;

  -- Women's Clothing L3
  IF ws_womens_clothing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Dresses', 'Рокли', 'wholesale-dresses', ws_womens_clothing_id, '👗', 1),
    ('Tops & Blouses', 'Топове и блузи', 'wholesale-tops-blouses', ws_womens_clothing_id, '👚', 2),
    ('Pants & Leggings', 'Панталони и клинове', 'wholesale-pants-leggings', ws_womens_clothing_id, '👖', 3),
    ('Skirts', 'Поли', 'wholesale-skirts', ws_womens_clothing_id, '👗', 4),
    ('Outerwear', 'Връхни дрехи', 'wholesale-womens-outerwear', ws_womens_clothing_id, '🧥', 5),
    ('Activewear', 'Спортни дрехи', 'wholesale-womens-activewear', ws_womens_clothing_id, '🏃‍♀️', 6),
    ('Swimwear', 'Бански', 'wholesale-womens-swimwear', ws_womens_clothing_id, '👙', 7),
    ('Lingerie', 'Бельо', 'wholesale-lingerie', ws_womens_clothing_id, '🩱', 8),
    ('Plus Size', 'Големи размери', 'wholesale-plus-size', ws_womens_clothing_id, '👗', 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Men's Clothing L3
  IF ws_mens_clothing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('T-Shirts', 'Тениски', 'wholesale-tshirts', ws_mens_clothing_id, '👕', 1),
    ('Shirts', 'Ризи', 'wholesale-shirts', ws_mens_clothing_id, '👔', 2),
    ('Pants & Jeans', 'Панталони и дънки', 'wholesale-mens-pants', ws_mens_clothing_id, '👖', 3),
    ('Jackets & Coats', 'Якета и палта', 'wholesale-jackets-coats', ws_mens_clothing_id, '🧥', 4),
    ('Suits & Blazers', 'Костюми и сака', 'wholesale-suits-blazers', ws_mens_clothing_id, '🤵', 5),
    ('Sportswear', 'Спортни дрехи', 'wholesale-mens-sportswear', ws_mens_clothing_id, '🏃', 6),
    ('Underwear', 'Бельо', 'wholesale-mens-underwear', ws_mens_clothing_id, '🩲', 7),
    ('Big & Tall', 'Големи размери', 'wholesale-big-tall', ws_mens_clothing_id, '👕', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Shoes L3
  IF ws_shoes_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Sneakers', 'Маратонки', 'wholesale-sneakers', ws_shoes_id, '👟', 1),
    ('Heels', 'Токчета', 'wholesale-heels', ws_shoes_id, '👠', 2),
    ('Boots', 'Ботуши', 'wholesale-boots', ws_shoes_id, '👢', 3),
    ('Sandals', 'Сандали', 'wholesale-sandals', ws_shoes_id, '🩴', 4),
    ('Slippers', 'Пантофи', 'wholesale-slippers', ws_shoes_id, '🥿', 5),
    ('Athletic Shoes', 'Спортни обувки', 'wholesale-athletic-shoes', ws_shoes_id, '👟', 6),
    ('Kids Shoes', 'Детски обувки', 'wholesale-kids-shoes', ws_shoes_id, '👟', 7),
    ('Work Boots', 'Работни обувки', 'wholesale-work-boots', ws_shoes_id, '🥾', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Get L2 IDs for Beauty
  SELECT id INTO ws_skincare_id FROM categories WHERE slug = 'wholesale-skincare' AND parent_id = ws_beauty_id;
  SELECT id INTO ws_makeup_id FROM categories WHERE slug = 'wholesale-makeup' AND parent_id = ws_beauty_id;
  SELECT id INTO ws_haircare_id FROM categories WHERE slug = 'wholesale-haircare' AND parent_id = ws_beauty_id;

  -- Skincare L3
  IF ws_skincare_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Cleansers', 'Почистващи продукти', 'wholesale-cleansers', ws_skincare_id, '🧴', 1),
    ('Moisturizers', 'Хидратиращи кремове', 'wholesale-moisturizers', ws_skincare_id, '💧', 2),
    ('Serums', 'Серуми', 'wholesale-serums', ws_skincare_id, '✨', 3),
    ('Face Masks', 'Маски за лице', 'wholesale-face-masks', ws_skincare_id, '🎭', 4),
    ('Sunscreen', 'Слънцезащитни кремове', 'wholesale-sunscreen', ws_skincare_id, '☀️', 5),
    ('Anti-Aging', 'Антиейдж', 'wholesale-anti-aging', ws_skincare_id, '⏳', 6),
    ('Acne Treatment', 'Срещу акне', 'wholesale-acne-treatment', ws_skincare_id, '💊', 7),
    ('Eye Care', 'Грижа за очи', 'wholesale-eye-care', ws_skincare_id, '👁️', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Makeup L3
  IF ws_makeup_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Foundation', 'Фон дьо тен', 'wholesale-foundation', ws_makeup_id, '🎨', 1),
    ('Lipstick', 'Червило', 'wholesale-lipstick', ws_makeup_id, '💄', 2),
    ('Eyeshadow', 'Сенки за очи', 'wholesale-eyeshadow', ws_makeup_id, '👁️', 3),
    ('Mascara', 'Спирала', 'wholesale-mascara', ws_makeup_id, '👁️', 4),
    ('Makeup Brushes', 'Четки за грим', 'wholesale-makeup-brushes', ws_makeup_id, '🖌️', 5),
    ('Palettes', 'Палитри', 'wholesale-palettes', ws_makeup_id, '🎨', 6),
    ('Nail Polish', 'Лак за нокти', 'wholesale-nail-polish', ws_makeup_id, '💅', 7),
    ('Setting Spray', 'Фиксиращ спрей', 'wholesale-setting-spray', ws_makeup_id, '💨', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Get L2 IDs for Toys
  SELECT id INTO ws_edu_toys_id FROM categories WHERE slug = 'wholesale-educational-toys' AND parent_id = ws_toys_id;
  SELECT id INTO ws_action_figures_id FROM categories WHERE slug = 'wholesale-action-figures' AND parent_id = ws_toys_id;

  -- Educational Toys L3
  IF ws_edu_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('STEM Toys', 'STEM играчки', 'wholesale-stem-toys', ws_edu_toys_id, '🔬', 1),
    ('Learning Games', 'Образователни игри', 'wholesale-learning-games', ws_edu_toys_id, '🎮', 2),
    ('Building Blocks', 'Конструктори', 'wholesale-building-blocks', ws_edu_toys_id, '🧱', 3),
    ('Science Kits', 'Научни комплекти', 'wholesale-science-kits', ws_edu_toys_id, '⚗️', 4),
    ('Musical Toys', 'Музикални играчки', 'wholesale-musical-toys', ws_edu_toys_id, '🎵', 5),
    ('Art Supplies', 'Арт материали', 'wholesale-art-supplies', ws_edu_toys_id, '🎨', 6),
    ('Educational Books', 'Образователни книги', 'wholesale-educational-books', ws_edu_toys_id, '📚', 7),
    ('Puzzles', 'Пъзели', 'wholesale-puzzles', ws_edu_toys_id, '🧩', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Action Figures L3
  IF ws_action_figures_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Superheroes', 'Супергерои', 'wholesale-superheroes', ws_action_figures_id, '🦸', 1),
    ('Anime Figures', 'Аниме фигури', 'wholesale-anime-figures', ws_action_figures_id, '🎌', 2),
    ('Movie Characters', 'Филмови герои', 'wholesale-movie-characters', ws_action_figures_id, '🎬', 3),
    ('Video Game Figures', 'Гейминг фигури', 'wholesale-game-figures', ws_action_figures_id, '🎮', 4),
    ('Collectibles', 'Колекционерски', 'wholesale-collectible-figures', ws_action_figures_id, '⭐', 5),
    ('Playsets', 'Плейсети', 'wholesale-playsets', ws_action_figures_id, '🏰', 6),
    ('Vehicles', 'Превозни средства', 'wholesale-toy-vehicles', ws_action_figures_id, '🚗', 7),
    ('Animals', 'Животни', 'wholesale-toy-animals', ws_action_figures_id, '🦁', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Get L2 IDs for Health
  SELECT id INTO ws_medical_supplies_id FROM categories WHERE slug = 'wholesale-medical-supplies' AND parent_id = ws_health_id;

  -- Medical Supplies L3
  IF ws_medical_supplies_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Bandages & Dressings', 'Превръзки', 'wholesale-bandages', ws_medical_supplies_id, '🩹', 1),
    ('Gloves', 'Ръкавици', 'wholesale-medical-gloves', ws_medical_supplies_id, '🧤', 2),
    ('Face Masks', 'Маски за лице', 'wholesale-medical-masks', ws_medical_supplies_id, '😷', 3),
    ('Syringes', 'Спринцовки', 'wholesale-syringes', ws_medical_supplies_id, '💉', 4),
    ('Thermometers', 'Термометри', 'wholesale-thermometers', ws_medical_supplies_id, '🌡️', 5),
    ('First Aid', 'Първа помощ', 'wholesale-first-aid', ws_medical_supplies_id, '🏥', 6),
    ('Wound Care', 'Грижа за рани', 'wholesale-wound-care', ws_medical_supplies_id, '🩹', 7),
    ('PPE', 'ЛПС', 'wholesale-ppe', ws_medical_supplies_id, '🦺', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Get L2 IDs for Seasonal
  SELECT id INTO ws_christmas_id FROM categories WHERE slug = 'wholesale-christmas' AND parent_id = ws_seasonal_id;

  -- Christmas L3
  IF ws_christmas_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Christmas Trees', 'Елхи', 'wholesale-christmas-trees', ws_christmas_id, '🎄', 1),
    ('Ornaments', 'Орнаменти', 'wholesale-ornaments', ws_christmas_id, '🎊', 2),
    ('Christmas Lights', 'Коледни светлини', 'wholesale-christmas-lights', ws_christmas_id, '💡', 3),
    ('Decorations', 'Декорации', 'wholesale-christmas-decorations', ws_christmas_id, '🎀', 4),
    ('Stockings', 'Чорапи', 'wholesale-stockings', ws_christmas_id, '🧦', 5),
    ('Wreaths', 'Венци', 'wholesale-wreaths', ws_christmas_id, '🌿', 6),
    ('Gift Wrap', 'Опаковки за подаръци', 'wholesale-gift-wrap', ws_christmas_id, '🎁', 7),
    ('Costumes', 'Костюми', 'wholesale-christmas-costumes', ws_christmas_id, '🎅', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Get L2 IDs for Baby
  SELECT id INTO ws_baby_clothing_id FROM categories WHERE slug = 'wholesale-baby-clothing' AND parent_id = ws_baby_id;
  SELECT id INTO ws_baby_gear_id FROM categories WHERE slug = 'wholesale-baby-gear' AND parent_id = ws_baby_id;

  -- Baby Clothing L3
  IF ws_baby_clothing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Onesies', 'Гащеризони', 'wholesale-onesies', ws_baby_clothing_id, '👶', 1),
    ('Sleepwear', 'Пижами', 'wholesale-baby-sleepwear', ws_baby_clothing_id, '😴', 2),
    ('Outfits', 'Комплекти', 'wholesale-baby-outfits', ws_baby_clothing_id, '👕', 3),
    ('Outerwear', 'Връхни дрехи', 'wholesale-baby-outerwear', ws_baby_clothing_id, '🧥', 4),
    ('Socks & Booties', 'Чорапи и буйки', 'wholesale-baby-socks', ws_baby_clothing_id, '🧦', 5),
    ('Hats', 'Шапки', 'wholesale-baby-hats', ws_baby_clothing_id, '🎩', 6),
    ('Special Occasion', 'Специални поводи', 'wholesale-baby-special', ws_baby_clothing_id, '👗', 7),
    ('Organic', 'Органични', 'wholesale-baby-organic', ws_baby_clothing_id, '🌿', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baby Gear L3
  IF ws_baby_gear_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Strollers', 'Колички', 'wholesale-strollers', ws_baby_gear_id, '🚼', 1),
    ('Car Seats', 'Столчета за кола', 'wholesale-car-seats', ws_baby_gear_id, '🚗', 2),
    ('High Chairs', 'Столчета за хранене', 'wholesale-high-chairs', ws_baby_gear_id, '🪑', 3),
    ('Playpens', 'Кошари', 'wholesale-playpens', ws_baby_gear_id, '🏠', 4),
    ('Carriers', 'Кенгура', 'wholesale-baby-carriers', ws_baby_gear_id, '👶', 5),
    ('Bouncers', 'Бънджита', 'wholesale-bouncers', ws_baby_gear_id, '🎢', 6),
    ('Walkers', 'Проходилки', 'wholesale-walkers', ws_baby_gear_id, '🚶', 7),
    ('Monitors', 'Монитори', 'wholesale-baby-monitors', ws_baby_gear_id, '📹', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Wholesale L3 categories restoration complete';
END $$;
;
