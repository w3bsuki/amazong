
-- Restore more missing L2 and L3 categories - batch 3
DO $$
DECLARE
  -- Sports L1 IDs
  v_sports_id UUID;
  v_team_sports_id UUID;
  v_fitness_id UUID;
  v_cycling_id UUID;
  v_water_sports_id UUID;
  v_winter_sports_id UUID;
  v_golf_id UUID;
  v_tennis_id UUID;
  v_running_id UUID;
  -- Jewelry L1 IDs
  v_jewelry_id UUID;
  v_rings_id UUID;
  v_necklaces_id UUID;
  v_earrings_id UUID;
  v_bracelets_id UUID;
  -- Kids/Toys L1 IDs
  v_toys_id UUID;
  v_action_figures_id UUID;
  v_dolls_id UUID;
  v_building_toys_id UUID;
  v_educational_toys_id UUID;
  v_outdoor_toys_id UUID;
  v_ride_on_toys_id UUID;
  v_stuffed_animals_id UUID;
BEGIN
  -- Get Sports parent
  SELECT id INTO v_sports_id FROM categories WHERE slug = 'sports-outdoors';
  
  -- Get Sports L1 IDs
  SELECT id INTO v_team_sports_id FROM categories WHERE slug = 'team-sports';
  SELECT id INTO v_fitness_id FROM categories WHERE slug = 'fitness';
  SELECT id INTO v_cycling_id FROM categories WHERE slug = 'cycling';
  SELECT id INTO v_water_sports_id FROM categories WHERE slug = 'water-sports';
  SELECT id INTO v_winter_sports_id FROM categories WHERE slug = 'winter-sports';
  SELECT id INTO v_golf_id FROM categories WHERE slug = 'golf';
  SELECT id INTO v_tennis_id FROM categories WHERE slug = 'tennis';
  SELECT id INTO v_running_id FROM categories WHERE slug = 'running';

  -- Get Jewelry parent
  SELECT id INTO v_jewelry_id FROM categories WHERE slug = 'jewelry';
  
  -- Get Jewelry L1 IDs
  SELECT id INTO v_rings_id FROM categories WHERE slug = 'rings';
  SELECT id INTO v_necklaces_id FROM categories WHERE slug = 'necklaces';
  SELECT id INTO v_earrings_id FROM categories WHERE slug = 'earrings';
  SELECT id INTO v_bracelets_id FROM categories WHERE slug = 'bracelets';

  -- Get Toys parent
  SELECT id INTO v_toys_id FROM categories WHERE slug = 'toys-games';
  
  -- Get Toys L1 IDs
  SELECT id INTO v_action_figures_id FROM categories WHERE slug = 'action-figures';
  SELECT id INTO v_dolls_id FROM categories WHERE slug = 'dolls';
  SELECT id INTO v_building_toys_id FROM categories WHERE slug = 'building-toys';
  SELECT id INTO v_educational_toys_id FROM categories WHERE slug = 'educational-toys';
  SELECT id INTO v_outdoor_toys_id FROM categories WHERE slug = 'outdoor-toys';
  SELECT id INTO v_ride_on_toys_id FROM categories WHERE slug = 'ride-on-toys';
  SELECT id INTO v_stuffed_animals_id FROM categories WHERE slug = 'stuffed-animals';

  -- SPORTS L2 Categories
  IF v_team_sports_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Soccer', 'Футбол', 'soccer-equipment', v_team_sports_id, 1),
    ('Basketball', 'Баскетбол', 'basketball-equipment', v_team_sports_id, 2),
    ('Baseball', 'Бейзбол', 'baseball-equipment', v_team_sports_id, 3),
    ('Football', 'Американски футбол', 'football-equipment', v_team_sports_id, 4),
    ('Hockey', 'Хокей', 'hockey-equipment', v_team_sports_id, 5),
    ('Volleyball', 'Волейбол', 'volleyball-equipment', v_team_sports_id, 6),
    ('Rugby', 'Ръгби', 'rugby-equipment', v_team_sports_id, 7),
    ('Handball', 'Хандбал', 'handball-equipment', v_team_sports_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_fitness_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Weights', 'Тежести', 'weights', v_fitness_id, 1),
    ('Cardio Equipment', 'Кардио уреди', 'cardio-equipment', v_fitness_id, 2),
    ('Yoga & Pilates', 'Йога и пилатес', 'yoga-pilates', v_fitness_id, 3),
    ('Resistance Bands', 'Ластици', 'resistance-bands', v_fitness_id, 4),
    ('Exercise Mats', 'Постелки', 'exercise-mats', v_fitness_id, 5),
    ('Gym Machines', 'Фитнес уреди', 'gym-machines', v_fitness_id, 6),
    ('Kettlebells', 'Гири', 'kettlebells', v_fitness_id, 7),
    ('Jump Ropes', 'Въжета', 'jump-ropes', v_fitness_id, 8),
    ('Boxing Equipment', 'Бокс оборудване', 'boxing-equipment', v_fitness_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_cycling_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Road Bikes', 'Шосейни велосипеди', 'road-bikes', v_cycling_id, 1),
    ('Mountain Bikes', 'Планински велосипеди', 'mountain-bikes', v_cycling_id, 2),
    ('Hybrid Bikes', 'Хибридни велосипеди', 'hybrid-bikes', v_cycling_id, 3),
    ('Kids Bikes', 'Детски велосипеди', 'kids-bikes', v_cycling_id, 4),
    ('BMX Bikes', 'BMX велосипеди', 'bmx-bikes', v_cycling_id, 5),
    ('Bike Accessories', 'Аксесоари', 'bike-accessories', v_cycling_id, 6),
    ('Bike Helmets', 'Каски', 'bike-helmets', v_cycling_id, 7),
    ('Cycling Apparel', 'Дрехи за колоездене', 'cycling-apparel', v_cycling_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_water_sports_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Swimming', 'Плуване', 'swimming-gear', v_water_sports_id, 1),
    ('Surfing', 'Сърфинг', 'surfing-gear', v_water_sports_id, 2),
    ('Kayaking', 'Каякинг', 'kayaking-gear', v_water_sports_id, 3),
    ('Diving', 'Гмуркане', 'diving-gear', v_water_sports_id, 4),
    ('Snorkeling', 'Шнорхел', 'snorkeling-gear', v_water_sports_id, 5),
    ('Paddleboarding', 'Падълборд', 'paddleboarding-gear', v_water_sports_id, 6),
    ('Wakeboarding', 'Уейкборд', 'wakeboarding-gear', v_water_sports_id, 7),
    ('Water Skiing', 'Водни ски', 'water-skiing-gear', v_water_sports_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_winter_sports_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Skiing', 'Ски', 'skiing-equipment', v_winter_sports_id, 1),
    ('Snowboarding', 'Сноуборд', 'snowboarding-equipment', v_winter_sports_id, 2),
    ('Ice Skating', 'Кънки', 'ice-skating-equipment', v_winter_sports_id, 3),
    ('Cross Country Skiing', 'Ски бягане', 'cross-country-skiing', v_winter_sports_id, 4),
    ('Snowshoes', 'Снегоходки', 'snowshoes', v_winter_sports_id, 5),
    ('Winter Apparel', 'Зимни дрехи', 'winter-sports-apparel', v_winter_sports_id, 6),
    ('Sleds', 'Шейни', 'sleds', v_winter_sports_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_golf_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Golf Clubs', 'Голф стикове', 'golf-clubs', v_golf_id, 1),
    ('Golf Balls', 'Голф топки', 'golf-balls', v_golf_id, 2),
    ('Golf Bags', 'Голф чанти', 'golf-bags', v_golf_id, 3),
    ('Golf Shoes', 'Голф обувки', 'golf-shoes', v_golf_id, 4),
    ('Golf Apparel', 'Голф облекло', 'golf-apparel', v_golf_id, 5),
    ('Golf Accessories', 'Голф аксесоари', 'golf-accessories', v_golf_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_tennis_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Tennis Rackets', 'Тенис ракети', 'tennis-rackets', v_tennis_id, 1),
    ('Tennis Balls', 'Тенис топки', 'tennis-balls', v_tennis_id, 2),
    ('Tennis Bags', 'Тенис чанти', 'tennis-bags', v_tennis_id, 3),
    ('Tennis Shoes', 'Тенис обувки', 'tennis-shoes', v_tennis_id, 4),
    ('Tennis Apparel', 'Тенис облекло', 'tennis-apparel', v_tennis_id, 5),
    ('Tennis Accessories', 'Тенис аксесоари', 'tennis-accessories', v_tennis_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_running_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Running Shoes', 'Маратонки за бягане', 'running-shoes', v_running_id, 1),
    ('Running Apparel', 'Облекло за бягане', 'running-apparel', v_running_id, 2),
    ('Running Watches', 'Часовници за бягане', 'running-watches', v_running_id, 3),
    ('Hydration', 'Хидратация', 'running-hydration', v_running_id, 4),
    ('Running Accessories', 'Аксесоари', 'running-accessories', v_running_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- JEWELRY L2 Categories
  IF v_rings_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Engagement Rings', 'Годежни пръстени', 'engagement-rings', v_rings_id, 1),
    ('Wedding Bands', 'Сватбени халки', 'wedding-bands', v_rings_id, 2),
    ('Fashion Rings', 'Модни пръстени', 'fashion-rings', v_rings_id, 3),
    ('Stackable Rings', 'Стекващи се пръстени', 'stackable-rings', v_rings_id, 4),
    ('Men''s Rings', 'Мъжки пръстени', 'mens-rings', v_rings_id, 5),
    ('Birthstone Rings', 'Пръстени с рожден камък', 'birthstone-rings', v_rings_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_necklaces_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Pendant Necklaces', 'Медальони', 'pendant-necklaces', v_necklaces_id, 1),
    ('Chain Necklaces', 'Вериги', 'chain-necklaces', v_necklaces_id, 2),
    ('Chokers', 'Чокъри', 'chokers', v_necklaces_id, 3),
    ('Statement Necklaces', 'Статийни огърлици', 'statement-necklaces', v_necklaces_id, 4),
    ('Layered Necklaces', 'Многослойни', 'layered-necklaces', v_necklaces_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_earrings_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Stud Earrings', 'Обици с щифт', 'stud-earrings', v_earrings_id, 1),
    ('Hoop Earrings', 'Халки', 'hoop-earrings', v_earrings_id, 2),
    ('Drop Earrings', 'Висящи обици', 'drop-earrings', v_earrings_id, 3),
    ('Chandelier Earrings', 'Полилей обици', 'chandelier-earrings', v_earrings_id, 4),
    ('Ear Cuffs', 'Обици кафове', 'ear-cuffs', v_earrings_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_bracelets_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Bangles', 'Гривни', 'bangles', v_bracelets_id, 1),
    ('Charm Bracelets', 'Гривни с чармове', 'charm-bracelets', v_bracelets_id, 2),
    ('Cuff Bracelets', 'Твърди гривни', 'cuff-bracelets', v_bracelets_id, 3),
    ('Tennis Bracelets', 'Тенис гривни', 'tennis-bracelets', v_bracelets_id, 4),
    ('Beaded Bracelets', 'Мъниста гривни', 'beaded-bracelets', v_bracelets_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- TOYS L2 Categories
  IF v_action_figures_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Superhero Figures', 'Супергерои', 'superhero-figures', v_action_figures_id, 1),
    ('Movie Figures', 'Филмови герои', 'movie-figures', v_action_figures_id, 2),
    ('Anime Figures', 'Аниме фигури', 'anime-figures', v_action_figures_id, 3),
    ('Video Game Figures', 'Герои от игри', 'video-game-figures', v_action_figures_id, 4),
    ('Military Figures', 'Военни фигури', 'military-figures', v_action_figures_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_dolls_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Fashion Dolls', 'Модни кукли', 'fashion-dolls', v_dolls_id, 1),
    ('Baby Dolls', 'Бебешки кукли', 'baby-dolls', v_dolls_id, 2),
    ('Collector Dolls', 'Колекционерски кукли', 'collector-dolls', v_dolls_id, 3),
    ('Doll Houses', 'Къщи за кукли', 'doll-houses', v_dolls_id, 4),
    ('Doll Accessories', 'Аксесоари за кукли', 'doll-accessories', v_dolls_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_building_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('LEGO', 'LEGO', 'lego-sets', v_building_toys_id, 1),
    ('Building Blocks', 'Конструктори', 'building-blocks', v_building_toys_id, 2),
    ('Magnetic Tiles', 'Магнитни плочки', 'magnetic-tiles', v_building_toys_id, 3),
    ('K''NEX', 'K''NEX', 'knex-sets', v_building_toys_id, 4),
    ('Wooden Blocks', 'Дървени кубчета', 'wooden-blocks', v_building_toys_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_educational_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('STEM Toys', 'STEM играчки', 'stem-toys', v_educational_toys_id, 1),
    ('Learning Tablets', 'Таблети за учене', 'learning-tablets', v_educational_toys_id, 2),
    ('Science Kits', 'Научни комплекти', 'science-kits', v_educational_toys_id, 3),
    ('Musical Toys', 'Музикални играчки', 'musical-toys', v_educational_toys_id, 4),
    ('Language Learning', 'Езиково обучение', 'language-learning-toys', v_educational_toys_id, 5),
    ('Math Toys', 'Математически играчки', 'math-toys', v_educational_toys_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_outdoor_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Playsets', 'Детски площадки', 'playsets', v_outdoor_toys_id, 1),
    ('Trampolines', 'Батути', 'trampolines', v_outdoor_toys_id, 2),
    ('Swing Sets', 'Люлки', 'swing-sets', v_outdoor_toys_id, 3),
    ('Sandboxes', 'Пясъчници', 'sandboxes', v_outdoor_toys_id, 4),
    ('Water Toys', 'Водни играчки', 'water-toys', v_outdoor_toys_id, 5),
    ('Sports Toys', 'Спортни играчки', 'sports-toys', v_outdoor_toys_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_ride_on_toys_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Electric Cars', 'Електрически коли', 'electric-ride-on-cars', v_ride_on_toys_id, 1),
    ('Tricycles', 'Триколки', 'tricycles', v_ride_on_toys_id, 2),
    ('Scooters', 'Тротинетки', 'kids-scooters', v_ride_on_toys_id, 3),
    ('Balance Bikes', 'Баланс колела', 'balance-bikes', v_ride_on_toys_id, 4),
    ('Wagons', 'Каручки', 'wagons', v_ride_on_toys_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'More missing categories restored - batch 3';
END $$;
;
