
-- Restore Sports, Jewelry, Kids L3 categories

DO $$
DECLARE
  -- Sports
  sports_id UUID;
  team_sports_id UUID;
  fitness_id UUID;
  cycling_id UUID;
  water_sports_id UUID;
  winter_sports_id UUID;
  running_id UUID;
  golf_id UUID;
  -- Jewelry
  jewelry_id UUID;
  rings_id UUID;
  necklaces_id UUID;
  earrings_id UUID;
  bracelets_id UUID;
  watches_id UUID;
  -- Kids
  kids_id UUID;
  baby_gear_id UUID;
  baby_feeding_id UUID;
  kids_toys_id UUID;
  kids_clothing_id UUID;
  nursery_id UUID;
BEGIN
  -- SPORTS
  SELECT id INTO sports_id FROM categories WHERE slug = 'sports';
  SELECT id INTO team_sports_id FROM categories WHERE slug = 'team-sports' AND parent_id = sports_id;
  SELECT id INTO fitness_id FROM categories WHERE slug = 'fitness' OR slug = 'fitness-equipment' LIMIT 1;
  SELECT id INTO cycling_id FROM categories WHERE slug = 'cycling' AND parent_id = sports_id;
  SELECT id INTO water_sports_id FROM categories WHERE slug = 'water-sports' AND parent_id = sports_id;
  SELECT id INTO winter_sports_id FROM categories WHERE slug = 'winter-sports' AND parent_id = sports_id;
  SELECT id INTO running_id FROM categories WHERE slug = 'running' AND parent_id = sports_id;
  SELECT id INTO golf_id FROM categories WHERE slug = 'golf' AND parent_id = sports_id;

  -- Team Sports L3
  IF team_sports_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Football/Soccer Balls', 'Футболни топки', 'football-soccer-balls', team_sports_id, '⚽', 1),
    ('Football/Soccer Goals', 'Футболни врати', 'football-soccer-goals', team_sports_id, '🥅', 2),
    ('Football/Soccer Cleats', 'Футболни обувки', 'football-soccer-cleats', team_sports_id, '👟', 3),
    ('Football/Soccer Jerseys', 'Футболни фланелки', 'football-soccer-jerseys', team_sports_id, '👕', 4),
    ('Basketball Balls', 'Баскетболни топки', 'basketball-balls', team_sports_id, '🏀', 5),
    ('Basketball Hoops', 'Баскетболни кошове', 'basketball-hoops', team_sports_id, '🏀', 6),
    ('Basketball Shoes', 'Баскетболни обувки', 'basketball-shoes', team_sports_id, '👟', 7),
    ('Volleyball Equipment', 'Волейболно оборудване', 'volleyball-equipment', team_sports_id, '🏐', 8),
    ('Baseball Equipment', 'Бейзболно оборудване', 'baseball-equipment', team_sports_id, '⚾', 9),
    ('American Football', 'Американски футбол', 'american-football-equipment', team_sports_id, '🏈', 10),
    ('Hockey Equipment', 'Хокейно оборудване', 'hockey-equipment', team_sports_id, '🏒', 11),
    ('Rugby Equipment', 'Ръгби оборудване', 'rugby-equipment', team_sports_id, '🏉', 12)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fitness L3
  IF fitness_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Dumbbells', 'Дъмбели', 'dumbbells', fitness_id, '🏋️', 1),
    ('Kettlebells', 'Кетълбели', 'kettlebells', fitness_id, '🏋️', 2),
    ('Barbells & Plates', 'Щанги и тежести', 'barbells-plates', fitness_id, '🏋️', 3),
    ('Resistance Bands', 'Ластици', 'resistance-bands', fitness_id, '🎗️', 4),
    ('Yoga Mats', 'Йога постелки', 'yoga-mats', fitness_id, '🧘', 5),
    ('Yoga Blocks & Props', 'Йога блокове', 'yoga-props', fitness_id, '🧘', 6),
    ('Exercise Bikes', 'Велоергометри', 'exercise-bikes', fitness_id, '🚴', 7),
    ('Treadmills', 'Бягащи пътеки', 'treadmills', fitness_id, '🏃', 8),
    ('Rowing Machines', 'Гребни тренажори', 'rowing-machines', fitness_id, '🚣', 9),
    ('Weight Benches', 'Лежанки', 'weight-benches', fitness_id, '🛋️', 10),
    ('Pull-Up Bars', 'Лостове', 'pull-up-bars', fitness_id, '💪', 11),
    ('Jump Ropes', 'Въжета за скачане', 'jump-ropes', fitness_id, '🪢', 12),
    ('Foam Rollers', 'Фоум ролери', 'foam-rollers', fitness_id, '🧽', 13),
    ('Medicine Balls', 'Медицински топки', 'medicine-balls', fitness_id, '⚽', 14)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cycling L3
  IF cycling_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Road Bikes', 'Шосейни велосипеди', 'road-bikes', cycling_id, '🚴', 1),
    ('Mountain Bikes', 'Планински велосипеди', 'mountain-bikes', cycling_id, '🚵', 2),
    ('City Bikes', 'Градски велосипеди', 'city-bikes', cycling_id, '🚲', 3),
    ('BMX Bikes', 'BMX велосипеди', 'bmx-bikes', cycling_id, '🚲', 4),
    ('Kids Bikes', 'Детски велосипеди', 'kids-bikes', cycling_id, '🚲', 5),
    ('Bike Helmets', 'Каски', 'bike-helmets', cycling_id, '⛑️', 6),
    ('Bike Lights', 'Светлини', 'bike-lights', cycling_id, '💡', 7),
    ('Bike Locks', 'Катинари', 'bike-locks', cycling_id, '🔒', 8),
    ('Bike Pumps', 'Помпи', 'bike-pumps', cycling_id, '💨', 9),
    ('Bike Bags', 'Чанти за велосипед', 'bike-bags', cycling_id, '🎒', 10),
    ('Cycling Clothing', 'Колоездачно облекло', 'cycling-clothing', cycling_id, '👕', 11),
    ('Bike Parts', 'Части за велосипеди', 'bike-parts', cycling_id, '🔧', 12)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Water Sports L3
  IF water_sports_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Swim Goggles', 'Плувни очила', 'swim-goggles', water_sports_id, '🥽', 1),
    ('Swimsuits', 'Бански костюми', 'swimsuits-sport', water_sports_id, '👙', 2),
    ('Snorkel Gear', 'Шнорхел', 'snorkel-gear', water_sports_id, '🤿', 3),
    ('Diving Equipment', 'Водолазно оборудване', 'diving-equipment', water_sports_id, '🤿', 4),
    ('Surfboards', 'Сърф дъски', 'surfboards', water_sports_id, '🏄', 5),
    ('Paddleboards', 'SUP дъски', 'paddleboards', water_sports_id, '🏄', 6),
    ('Kayaks', 'Каяци', 'kayaks', water_sports_id, '🛶', 7),
    ('Life Jackets', 'Спасителни жилетки', 'life-jackets', water_sports_id, '🦺', 8),
    ('Wetsuits', 'Неопренови костюми', 'wetsuits', water_sports_id, '🧥', 9),
    ('Water Skis', 'Водни ски', 'water-skis', water_sports_id, '🎿', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Winter Sports L3
  IF winter_sports_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Skis', 'Ски', 'skis', winter_sports_id, '🎿', 1),
    ('Ski Boots', 'Ски обувки', 'ski-boots', winter_sports_id, '🥾', 2),
    ('Ski Poles', 'Ски щеки', 'ski-poles', winter_sports_id, '🥢', 3),
    ('Snowboards', 'Сноуборди', 'snowboards', winter_sports_id, '🏂', 4),
    ('Snowboard Boots', 'Сноуборд обувки', 'snowboard-boots', winter_sports_id, '🥾', 5),
    ('Ski/Snowboard Helmets', 'Каски', 'ski-snowboard-helmets', winter_sports_id, '⛑️', 6),
    ('Ski Goggles', 'Ски очила', 'ski-goggles', winter_sports_id, '🥽', 7),
    ('Ski Clothing', 'Ски облекло', 'ski-clothing', winter_sports_id, '🧥', 8),
    ('Ice Skates', 'Кънки', 'ice-skates', winter_sports_id, '⛸️', 9),
    ('Sleds', 'Шейни', 'sleds', winter_sports_id, '🛷', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- JEWELRY & WATCHES
  SELECT id INTO jewelry_id FROM categories WHERE slug = 'jewelry-watches';
  SELECT id INTO rings_id FROM categories WHERE slug = 'rings' AND parent_id = jewelry_id;
  SELECT id INTO necklaces_id FROM categories WHERE slug = 'necklaces' AND parent_id = jewelry_id;
  SELECT id INTO earrings_id FROM categories WHERE slug = 'earrings' AND parent_id = jewelry_id;
  SELECT id INTO bracelets_id FROM categories WHERE slug = 'bracelets' AND parent_id = jewelry_id;
  SELECT id INTO watches_id FROM categories WHERE slug = 'watches' AND parent_id = jewelry_id;

  -- Rings L3
  IF rings_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Engagement Rings', 'Годежни пръстени', 'engagement-rings', rings_id, '💍', 1),
    ('Wedding Bands', 'Брачни халки', 'wedding-bands', rings_id, '💍', 2),
    ('Promise Rings', 'Пръстени обещания', 'promise-rings', rings_id, '💍', 3),
    ('Eternity Rings', 'Пръстени вечност', 'eternity-rings', rings_id, '💍', 4),
    ('Cocktail Rings', 'Коктейлни пръстени', 'cocktail-rings', rings_id, '💍', 5),
    ('Stackable Rings', 'Стекуеми пръстени', 'stackable-rings', rings_id, '💍', 6),
    ('Signet Rings', 'Печатни пръстени', 'signet-rings', rings_id, '💍', 7),
    ('Mens Rings', 'Мъжки пръстени', 'mens-rings', rings_id, '💍', 8),
    ('Diamond Rings', 'Диамантени пръстени', 'diamond-rings', rings_id, '💎', 9),
    ('Gemstone Rings', 'Пръстени с камъни', 'gemstone-rings', rings_id, '💎', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Necklaces L3
  IF necklaces_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Pendants', 'Медальони', 'pendants', necklaces_id, '📿', 1),
    ('Chains', 'Верижки', 'chains', necklaces_id, '⛓️', 2),
    ('Chokers', 'Чокъри', 'chokers', necklaces_id, '📿', 3),
    ('Statement Necklaces', 'Изразителни колиета', 'statement-necklaces', necklaces_id, '📿', 4),
    ('Pearl Necklaces', 'Перлени колиета', 'pearl-necklaces', necklaces_id, '🦪', 5),
    ('Lockets', 'Медальони', 'lockets', necklaces_id, '❤️', 6),
    ('Layered Necklaces', 'Многоредни колиета', 'layered-necklaces', necklaces_id, '📿', 7),
    ('Name Necklaces', 'Колиета с имена', 'name-necklaces', necklaces_id, '📿', 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Watches L3
  IF watches_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Luxury Watches', 'Луксозни часовници', 'luxury-watches', watches_id, '⌚', 1),
    ('Sport Watches', 'Спортни часовници', 'sport-watches', watches_id, '⌚', 2),
    ('Smart Watches', 'Смарт часовници', 'smart-watches-jewelry', watches_id, '⌚', 3),
    ('Dress Watches', 'Елегантни часовници', 'dress-watches', watches_id, '⌚', 4),
    ('Dive Watches', 'Водолазни часовници', 'dive-watches', watches_id, '⌚', 5),
    ('Chronograph Watches', 'Хронографи', 'chronograph-watches', watches_id, '⏱️', 6),
    ('Automatic Watches', 'Автоматични часовници', 'automatic-watches', watches_id, '⚙️', 7),
    ('Quartz Watches', 'Кварцови часовници', 'quartz-watches', watches_id, '⌚', 8),
    ('Vintage Watches', 'Винтидж часовници', 'vintage-watches', watches_id, '⌚', 9),
    ('Watch Bands', 'Каишки за часовници', 'watch-bands', watches_id, '🔗', 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- KIDS & BABY
  SELECT id INTO kids_id FROM categories WHERE slug = 'baby-kids';
  SELECT id INTO baby_gear_id FROM categories WHERE slug = 'baby-gear' AND parent_id = kids_id;
  SELECT id INTO baby_feeding_id FROM categories WHERE slug = 'baby-feeding' AND parent_id = kids_id;
  SELECT id INTO kids_toys_id FROM categories WHERE slug = 'kids-toys' AND parent_id = kids_id;
  SELECT id INTO kids_clothing_id FROM categories WHERE slug = 'kids-clothing' AND parent_id = kids_id;
  SELECT id INTO nursery_id FROM categories WHERE slug = 'nursery' AND parent_id = kids_id;

  -- Baby Gear L3
  IF baby_gear_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Standard Strollers', 'Стандартни колички', 'standard-strollers', baby_gear_id, '🚼', 1),
    ('Jogging Strollers', 'Джогинг колички', 'jogging-strollers', baby_gear_id, '🏃', 2),
    ('Double Strollers', 'Двойни колички', 'double-strollers', baby_gear_id, '👶👶', 3),
    ('Umbrella Strollers', 'Чадърни колички', 'umbrella-strollers', baby_gear_id, '☂️', 4),
    ('Infant Car Seats', 'Столчета за бебета', 'infant-car-seats', baby_gear_id, '🚗', 5),
    ('Convertible Car Seats', 'Конвертируеми столчета', 'convertible-car-seats', baby_gear_id, '🚗', 6),
    ('Booster Seats', 'Бустери', 'booster-seats', baby_gear_id, '🚗', 7),
    ('Baby Carriers', 'Кенгура', 'baby-carriers-gear', baby_gear_id, '👶', 8),
    ('Baby Wraps', 'Слингове', 'baby-wraps', baby_gear_id, '🧣', 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baby Feeding L3
  IF baby_feeding_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Baby Bottles', 'Бебешки шишета', 'baby-bottles', baby_feeding_id, '🍼', 1),
    ('Bottle Warmers', 'Нагреватели за шишета', 'bottle-warmers', baby_feeding_id, '🔥', 2),
    ('Breast Pumps', 'Помпи за кърма', 'breast-pumps', baby_feeding_id, '🤱', 3),
    ('Nursing Pillows', 'Възглавници за кърмене', 'nursing-pillows', baby_feeding_id, '🛋️', 4),
    ('Baby Food Makers', 'Уреди за бебешка храна', 'baby-food-makers', baby_feeding_id, '🍲', 5),
    ('High Chairs', 'Столчета за хранене', 'high-chairs-feeding', baby_feeding_id, '🪑', 6),
    ('Bibs', 'Лигавници', 'bibs', baby_feeding_id, '👶', 7),
    ('Sippy Cups', 'Неразливащи се чаши', 'sippy-cups', baby_feeding_id, '🥤', 8),
    ('Baby Spoons & Utensils', 'Бебешки прибори', 'baby-utensils', baby_feeding_id, '🥄', 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Nursery L3
  IF nursery_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Cribs', 'Кошарки', 'cribs', nursery_id, '🛏️', 1),
    ('Bassinets', 'Люлки', 'bassinets', nursery_id, '🛏️', 2),
    ('Changing Tables', 'Маси за преповиване', 'changing-tables', nursery_id, '🛋️', 3),
    ('Dressers', 'Скринове', 'nursery-dressers', nursery_id, '🗄️', 4),
    ('Rocking Chairs', 'Люлеещи се столове', 'rocking-chairs', nursery_id, '🪑', 5),
    ('Nursery Decor', 'Декорации за детска стая', 'nursery-decor', nursery_id, '🖼️', 6),
    ('Baby Bedding', 'Бебешко спално бельо', 'baby-bedding', nursery_id, '🛏️', 7),
    ('Night Lights', 'Нощни лампи', 'night-lights', nursery_id, '💡', 8),
    ('Baby Monitors', 'Бебефони', 'baby-monitors', nursery_id, '📹', 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Sports, Jewelry, Kids L3 categories restoration complete';
END $$;
;
