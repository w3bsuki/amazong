
-- Restore L3 categories for Hobbies & Toys, Tools & Home, Grocery
DO $$
DECLARE
  -- Hobbies & Toys L2 IDs
  v_collectibles_id UUID;
  v_model_kits_id UUID;
  v_board_games_id UUID;
  v_arts_crafts_id UUID;
  v_musical_instruments_id UUID;
  v_outdoor_recreation_id UUID;
  -- Tools & Home L2 IDs
  v_power_tools_id UUID;
  v_hand_tools_id UUID;
  v_gardening_id UUID;
  v_home_improvement_id UUID;
  v_plumbing_id UUID;
  v_electrical_id UUID;
  v_furniture_id UUID;
  -- Grocery L2 IDs
  v_fresh_produce_id UUID;
  v_dairy_id UUID;
  v_meat_id UUID;
  v_beverages_id UUID;
  v_snacks_id UUID;
  v_pantry_id UUID;
BEGIN
  -- Get Hobbies L2 IDs
  SELECT id INTO v_collectibles_id FROM categories WHERE slug = 'collectibles';
  SELECT id INTO v_model_kits_id FROM categories WHERE slug = 'model-kits';
  SELECT id INTO v_board_games_id FROM categories WHERE slug = 'board-games';
  SELECT id INTO v_arts_crafts_id FROM categories WHERE slug = 'arts-crafts';
  SELECT id INTO v_musical_instruments_id FROM categories WHERE slug = 'musical-instruments';
  SELECT id INTO v_outdoor_recreation_id FROM categories WHERE slug = 'outdoor-recreation';

  -- Get Tools L2 IDs
  SELECT id INTO v_power_tools_id FROM categories WHERE slug = 'power-tools';
  SELECT id INTO v_hand_tools_id FROM categories WHERE slug = 'hand-tools';
  SELECT id INTO v_gardening_id FROM categories WHERE slug = 'gardening';
  SELECT id INTO v_home_improvement_id FROM categories WHERE slug = 'home-improvement';
  SELECT id INTO v_plumbing_id FROM categories WHERE slug = 'plumbing';
  SELECT id INTO v_electrical_id FROM categories WHERE slug = 'electrical-supplies';
  SELECT id INTO v_furniture_id FROM categories WHERE slug = 'furniture';

  -- Get Grocery L2 IDs
  SELECT id INTO v_fresh_produce_id FROM categories WHERE slug = 'fresh-produce';
  SELECT id INTO v_dairy_id FROM categories WHERE slug = 'dairy-eggs';
  SELECT id INTO v_meat_id FROM categories WHERE slug = 'meat-seafood';
  SELECT id INTO v_beverages_id FROM categories WHERE slug = 'beverages';
  SELECT id INTO v_snacks_id FROM categories WHERE slug = 'snacks-candy';
  SELECT id INTO v_pantry_id FROM categories WHERE slug = 'pantry-staples';

  -- HOBBIES & TOYS L3 --
  -- Collectibles L3
  IF v_collectibles_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Coins', 'Монети', 'coins-collectibles', v_collectibles_id, 1),
    ('Stamps', 'Марки', 'stamps-collectibles', v_collectibles_id, 2),
    ('Sports Cards', 'Спортни картички', 'sports-cards', v_collectibles_id, 3),
    ('Trading Cards', 'Търговски картички', 'trading-cards', v_collectibles_id, 4),
    ('Vinyl Records', 'Винилови плочи', 'vinyl-records', v_collectibles_id, 5),
    ('Antiques', 'Антики', 'antiques', v_collectibles_id, 6),
    ('Figurines', 'Фигурки', 'figurines-collectibles', v_collectibles_id, 7),
    ('Memorabilia', 'Сувенири', 'memorabilia', v_collectibles_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Model Kits L3
  IF v_model_kits_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Airplane Models', 'Модели самолети', 'airplane-models', v_model_kits_id, 1),
    ('Car Models', 'Модели коли', 'car-models', v_model_kits_id, 2),
    ('Ship Models', 'Модели кораби', 'ship-models', v_model_kits_id, 3),
    ('Train Models', 'Модели влакове', 'train-models', v_model_kits_id, 4),
    ('Military Models', 'Военни модели', 'military-models', v_model_kits_id, 5),
    ('Gundam Models', 'Гъндам модели', 'gundam-models', v_model_kits_id, 6),
    ('Model Paints', 'Бои за модели', 'model-paints', v_model_kits_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Board Games L3
  IF v_board_games_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Strategy Games', 'Стратегически игри', 'strategy-games', v_board_games_id, 1),
    ('Party Games', 'Парти игри', 'party-games', v_board_games_id, 2),
    ('Card Games', 'Карти игри', 'card-games', v_board_games_id, 3),
    ('Family Games', 'Семейни игри', 'family-games', v_board_games_id, 4),
    ('Puzzles', 'Пъзели', 'puzzles', v_board_games_id, 5),
    ('Role Playing Games', 'Ролеви игри', 'rpg-games', v_board_games_id, 6),
    ('Classic Games', 'Класически игри', 'classic-games', v_board_games_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Arts & Crafts L3
  IF v_arts_crafts_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Drawing Supplies', 'Принадлежности за рисуване', 'drawing-supplies', v_arts_crafts_id, 1),
    ('Painting Supplies', 'Принадлежности за боядисване', 'painting-supplies', v_arts_crafts_id, 2),
    ('Sewing & Knitting', 'Шиене и плетене', 'sewing-knitting', v_arts_crafts_id, 3),
    ('Scrapbooking', 'Скрапбукинг', 'scrapbooking', v_arts_crafts_id, 4),
    ('Beading & Jewelry Making', 'Бижутерия направи си сам', 'beading-jewelry-making', v_arts_crafts_id, 5),
    ('Paper Crafts', 'Хартиени занаяти', 'paper-crafts', v_arts_crafts_id, 6),
    ('Candle Making', 'Изработка на свещи', 'candle-making', v_arts_crafts_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Musical Instruments L3
  IF v_musical_instruments_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Guitars', 'Китари', 'guitars', v_musical_instruments_id, 1),
    ('Keyboards & Pianos', 'Клавишни и пиана', 'keyboards-pianos', v_musical_instruments_id, 2),
    ('Drums', 'Барабани', 'drums', v_musical_instruments_id, 3),
    ('Wind Instruments', 'Духови инструменти', 'wind-instruments', v_musical_instruments_id, 4),
    ('String Instruments', 'Струнни инструменти', 'string-instruments', v_musical_instruments_id, 5),
    ('DJ Equipment', 'DJ оборудване', 'dj-equipment', v_musical_instruments_id, 6),
    ('Recording Equipment', 'Записващо оборудване', 'recording-equipment', v_musical_instruments_id, 7),
    ('Sheet Music', 'Ноти', 'sheet-music', v_musical_instruments_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Outdoor Recreation L3
  IF v_outdoor_recreation_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Camping Gear', 'Къмпинг оборудване', 'camping-gear', v_outdoor_recreation_id, 1),
    ('Hiking Equipment', 'Туристическо оборудване', 'hiking-equipment', v_outdoor_recreation_id, 2),
    ('Fishing Gear', 'Риболовно оборудване', 'fishing-gear', v_outdoor_recreation_id, 3),
    ('Hunting Equipment', 'Ловно оборудване', 'hunting-equipment', v_outdoor_recreation_id, 4),
    ('Climbing Gear', 'Катерачно оборудване', 'climbing-gear', v_outdoor_recreation_id, 5),
    ('Water Sports', 'Водни спортове', 'water-sports-gear', v_outdoor_recreation_id, 6),
    ('Binoculars', 'Бинокли', 'binoculars', v_outdoor_recreation_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- TOOLS & HOME L3 --
  -- Power Tools L3
  IF v_power_tools_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Drills', 'Бормашини', 'drills', v_power_tools_id, 1),
    ('Saws', 'Циркуляри', 'saws', v_power_tools_id, 2),
    ('Sanders', 'Шлайфмашини', 'sanders', v_power_tools_id, 3),
    ('Grinders', 'Шлайфи', 'grinders', v_power_tools_id, 4),
    ('Routers', 'Фрези', 'routers', v_power_tools_id, 5),
    ('Nail Guns', 'Пистолети за пирони', 'nail-guns', v_power_tools_id, 6),
    ('Air Compressors', 'Въздушни компресори', 'air-compressors', v_power_tools_id, 7),
    ('Welding Equipment', 'Заваръчно оборудване', 'welding-equipment', v_power_tools_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hand Tools L3
  IF v_hand_tools_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Hammers', 'Чукове', 'hammers', v_hand_tools_id, 1),
    ('Screwdrivers', 'Отвертки', 'screwdrivers', v_hand_tools_id, 2),
    ('Wrenches', 'Гаечни ключове', 'wrenches', v_hand_tools_id, 3),
    ('Pliers', 'Клещи', 'pliers', v_hand_tools_id, 4),
    ('Measuring Tools', 'Измервателни инструменти', 'measuring-tools', v_hand_tools_id, 5),
    ('Cutting Tools', 'Режещи инструменти', 'cutting-tools', v_hand_tools_id, 6),
    ('Tool Sets', 'Комплекти инструменти', 'tool-sets', v_hand_tools_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gardening L3
  IF v_gardening_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Lawn Mowers', 'Косачки', 'lawn-mowers', v_gardening_id, 1),
    ('Trimmers', 'Тримери', 'trimmers', v_gardening_id, 2),
    ('Garden Tools', 'Градински инструменти', 'garden-tools', v_gardening_id, 3),
    ('Planters & Pots', 'Саксии', 'planters-pots', v_gardening_id, 4),
    ('Seeds & Bulbs', 'Семена и луковици', 'seeds-bulbs', v_gardening_id, 5),
    ('Fertilizers', 'Торове', 'fertilizers', v_gardening_id, 6),
    ('Irrigation', 'Напояване', 'irrigation', v_gardening_id, 7),
    ('Greenhouses', 'Оранжерии', 'greenhouses', v_gardening_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Furniture L3
  IF v_furniture_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Living Room', 'Всекидневна', 'living-room-furniture', v_furniture_id, 1),
    ('Bedroom', 'Спалня', 'bedroom-furniture', v_furniture_id, 2),
    ('Dining Room', 'Трапезария', 'dining-room-furniture', v_furniture_id, 3),
    ('Office Furniture', 'Офис мебели', 'office-furniture', v_furniture_id, 4),
    ('Outdoor Furniture', 'Градински мебели', 'outdoor-furniture', v_furniture_id, 5),
    ('Kids Furniture', 'Детски мебели', 'kids-furniture', v_furniture_id, 6),
    ('Storage', 'Съхранение', 'storage-furniture', v_furniture_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- GROCERY L3 --
  -- Fresh Produce L3
  IF v_fresh_produce_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Fruits', 'Плодове', 'fruits', v_fresh_produce_id, 1),
    ('Vegetables', 'Зеленчуци', 'vegetables', v_fresh_produce_id, 2),
    ('Salads', 'Салати', 'salads', v_fresh_produce_id, 3),
    ('Herbs', 'Билки', 'fresh-herbs', v_fresh_produce_id, 4),
    ('Organic Produce', 'Био продукти', 'organic-produce', v_fresh_produce_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Dairy L3
  IF v_dairy_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Milk', 'Мляко', 'milk', v_dairy_id, 1),
    ('Cheese', 'Сирене', 'cheese', v_dairy_id, 2),
    ('Yogurt', 'Кисело мляко', 'yogurt', v_dairy_id, 3),
    ('Butter', 'Масло', 'butter', v_dairy_id, 4),
    ('Eggs', 'Яйца', 'eggs', v_dairy_id, 5),
    ('Cream', 'Сметана', 'cream', v_dairy_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Meat & Seafood L3
  IF v_meat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Beef', 'Телешко', 'beef', v_meat_id, 1),
    ('Pork', 'Свинско', 'pork', v_meat_id, 2),
    ('Chicken', 'Пилешко', 'chicken', v_meat_id, 3),
    ('Lamb', 'Агнешко', 'lamb', v_meat_id, 4),
    ('Fish', 'Риба', 'fish', v_meat_id, 5),
    ('Seafood', 'Морски дарове', 'seafood', v_meat_id, 6),
    ('Deli Meats', 'Колбаси', 'deli-meats', v_meat_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Beverages L3
  IF v_beverages_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Water', 'Вода', 'water', v_beverages_id, 1),
    ('Soft Drinks', 'Безалкохолни', 'soft-drinks', v_beverages_id, 2),
    ('Juices', 'Сокове', 'juices', v_beverages_id, 3),
    ('Coffee', 'Кафе', 'coffee', v_beverages_id, 4),
    ('Tea', 'Чай', 'tea', v_beverages_id, 5),
    ('Energy Drinks', 'Енергийни напитки', 'energy-drinks', v_beverages_id, 6),
    ('Wine', 'Вино', 'wine', v_beverages_id, 7),
    ('Beer', 'Бира', 'beer', v_beverages_id, 8),
    ('Spirits', 'Спиртни напитки', 'spirits', v_beverages_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Snacks L3
  IF v_snacks_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Chips', 'Чипс', 'chips', v_snacks_id, 1),
    ('Crackers', 'Крекери', 'crackers', v_snacks_id, 2),
    ('Nuts', 'Ядки', 'nuts', v_snacks_id, 3),
    ('Chocolate', 'Шоколад', 'chocolate', v_snacks_id, 4),
    ('Candy', 'Бонбони', 'candy', v_snacks_id, 5),
    ('Cookies', 'Бисквити', 'cookies', v_snacks_id, 6),
    ('Popcorn', 'Пуканки', 'popcorn', v_snacks_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pantry L3
  IF v_pantry_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Rice & Grains', 'Ориз и зърнени', 'rice-grains', v_pantry_id, 1),
    ('Pasta', 'Паста', 'pasta', v_pantry_id, 2),
    ('Canned Goods', 'Консерви', 'canned-goods', v_pantry_id, 3),
    ('Sauces', 'Сосове', 'sauces', v_pantry_id, 4),
    ('Spices', 'Подправки', 'spices', v_pantry_id, 5),
    ('Oils & Vinegars', 'Олиа и оцет', 'oils-vinegars', v_pantry_id, 6),
    ('Baking Supplies', 'Сладкарски продукти', 'baking-supplies', v_pantry_id, 7),
    ('Breakfast Foods', 'Закуска', 'breakfast-foods', v_pantry_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Hobbies, Tools, Grocery L3 categories restored';
END $$;
;
