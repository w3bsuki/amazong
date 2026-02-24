
-- Restore Food & Beverage, Home Appliances categories
DO $$
DECLARE
  -- Grocery/Food L1 IDs
  v_grocery_id UUID;
  v_organic_id UUID;
  v_international_food_id UUID;
  v_specialty_food_id UUID;
  v_baby_food_cat_id UUID;
  v_pet_food_id UUID;
  -- Appliances L1 IDs
  v_appliances_id UUID;
  v_major_appliances_id UUID;
  v_small_appliances_id UUID;
  v_heating_cooling_id UUID;
  v_laundry_id UUID;
  v_vacuums_id UUID;
  -- Garden L1 IDs
  v_garden_id UUID;
  v_plants_id UUID;
  v_outdoor_living_id UUID;
  v_pools_spas_id UUID;
  v_patio_furniture_id UUID;
  v_bbq_id UUID;
BEGIN
  -- Get Grocery parent
  SELECT id INTO v_grocery_id FROM categories WHERE slug = 'grocery';
  
  -- Get Grocery L1 IDs
  SELECT id INTO v_organic_id FROM categories WHERE slug = 'organic-natural';
  SELECT id INTO v_international_food_id FROM categories WHERE slug = 'international-foods';
  SELECT id INTO v_specialty_food_id FROM categories WHERE slug = 'specialty-foods';

  -- Get Appliances parent (under Home & Garden)
  SELECT id INTO v_appliances_id FROM categories WHERE slug = 'appliances';
  
  -- Get Appliances L1 IDs
  SELECT id INTO v_major_appliances_id FROM categories WHERE slug = 'major-appliances';
  SELECT id INTO v_small_appliances_id FROM categories WHERE slug = 'small-appliances';
  SELECT id INTO v_heating_cooling_id FROM categories WHERE slug = 'heating-cooling';
  SELECT id INTO v_laundry_id FROM categories WHERE slug = 'laundry-appliances';
  SELECT id INTO v_vacuums_id FROM categories WHERE slug = 'vacuums-floor-care';

  -- Get Garden parent
  SELECT id INTO v_garden_id FROM categories WHERE slug = 'home-garden';
  
  -- Get Garden L1 IDs
  SELECT id INTO v_plants_id FROM categories WHERE slug = 'plants-seeds';
  SELECT id INTO v_outdoor_living_id FROM categories WHERE slug = 'outdoor-living';
  SELECT id INTO v_pools_spas_id FROM categories WHERE slug = 'pools-spas';
  SELECT id INTO v_patio_furniture_id FROM categories WHERE slug = 'patio-furniture';
  SELECT id INTO v_bbq_id FROM categories WHERE slug = 'grills-outdoor-cooking';

  -- GROCERY L2 Categories
  IF v_organic_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Organic Produce', 'Био плодове и зеленчуци', 'organic-produce-grocery', v_organic_id, 1),
    ('Organic Dairy', 'Био млечни', 'organic-dairy', v_organic_id, 2),
    ('Organic Meat', 'Био месо', 'organic-meat', v_organic_id, 3),
    ('Organic Snacks', 'Био снаксове', 'organic-snacks', v_organic_id, 4),
    ('Organic Beverages', 'Био напитки', 'organic-beverages', v_organic_id, 5),
    ('Gluten Free', 'Без глутен', 'gluten-free-foods', v_organic_id, 6),
    ('Vegan Foods', 'Веган храни', 'vegan-foods', v_organic_id, 7),
    ('Keto Foods', 'Кето храни', 'keto-foods', v_organic_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_international_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Asian Foods', 'Азиатски храни', 'asian-foods', v_international_food_id, 1),
    ('Mexican Foods', 'Мексикански храни', 'mexican-foods', v_international_food_id, 2),
    ('Italian Foods', 'Италиански храни', 'italian-foods', v_international_food_id, 3),
    ('Indian Foods', 'Индийски храни', 'indian-foods', v_international_food_id, 4),
    ('Middle Eastern', 'Средиземноморски', 'middle-eastern-foods', v_international_food_id, 5),
    ('Greek Foods', 'Гръцки храни', 'greek-foods', v_international_food_id, 6),
    ('Japanese Foods', 'Японски храни', 'japanese-foods', v_international_food_id, 7),
    ('Korean Foods', 'Корейски храни', 'korean-foods', v_international_food_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_specialty_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Gourmet Foods', 'Гурме храни', 'gourmet-foods', v_specialty_food_id, 1),
    ('Gift Baskets', 'Подаръчни кошници', 'food-gift-baskets', v_specialty_food_id, 2),
    ('Cheese Gifts', 'Подаръчни сирена', 'cheese-gifts', v_specialty_food_id, 3),
    ('Chocolate Gifts', 'Подаръчни шоколади', 'chocolate-gifts', v_specialty_food_id, 4),
    ('Specialty Meats', 'Специални меса', 'specialty-meats', v_specialty_food_id, 5),
    ('Artisan Bread', 'Занаятчийски хляб', 'artisan-bread', v_specialty_food_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- APPLIANCES L2 Categories
  IF v_major_appliances_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Refrigerators', 'Хладилници', 'refrigerators', v_major_appliances_id, 1),
    ('Freezers', 'Фризери', 'freezers', v_major_appliances_id, 2),
    ('Ranges', 'Готварски печки', 'ranges', v_major_appliances_id, 3),
    ('Ovens', 'Фурни', 'ovens', v_major_appliances_id, 4),
    ('Cooktops', 'Плотове', 'cooktops', v_major_appliances_id, 5),
    ('Dishwashers', 'Съдомиялни', 'dishwashers', v_major_appliances_id, 6),
    ('Microwaves', 'Микровълнови', 'microwaves', v_major_appliances_id, 7),
    ('Range Hoods', 'Аспиратори', 'range-hoods', v_major_appliances_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_small_appliances_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Coffee Makers', 'Кафемашини', 'coffee-makers', v_small_appliances_id, 1),
    ('Toasters', 'Тостери', 'toasters', v_small_appliances_id, 2),
    ('Blenders', 'Блендери', 'blenders', v_small_appliances_id, 3),
    ('Food Processors', 'Кухненски роботи', 'food-processors', v_small_appliances_id, 4),
    ('Mixers', 'Миксери', 'mixers', v_small_appliances_id, 5),
    ('Air Fryers', 'Фритюрници без мазнина', 'air-fryers', v_small_appliances_id, 6),
    ('Slow Cookers', 'Бавноварки', 'slow-cookers', v_small_appliances_id, 7),
    ('Instant Pots', 'Мултикукъри', 'instant-pots', v_small_appliances_id, 8),
    ('Juicers', 'Сокоизстисквачки', 'juicers', v_small_appliances_id, 9),
    ('Electric Kettles', 'Електрически кани', 'electric-kettles', v_small_appliances_id, 10),
    ('Rice Cookers', 'Уреди за ориз', 'rice-cookers', v_small_appliances_id, 11),
    ('Waffle Makers', 'Вафлиери', 'waffle-makers', v_small_appliances_id, 12)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_heating_cooling_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Air Conditioners', 'Климатици', 'air-conditioners', v_heating_cooling_id, 1),
    ('Fans', 'Вентилатори', 'fans', v_heating_cooling_id, 2),
    ('Heaters', 'Отоплителни уреди', 'heaters', v_heating_cooling_id, 3),
    ('Humidifiers', 'Овлажнители', 'humidifiers', v_heating_cooling_id, 4),
    ('Dehumidifiers', 'Изсушители', 'dehumidifiers', v_heating_cooling_id, 5),
    ('Air Purifiers', 'Пречистватели на въздух', 'air-purifiers', v_heating_cooling_id, 6),
    ('Thermostats', 'Термостати', 'thermostats', v_heating_cooling_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_laundry_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Washing Machines', 'Перални машини', 'washing-machines', v_laundry_id, 1),
    ('Dryers', 'Сушилни', 'dryers', v_laundry_id, 2),
    ('Washer-Dryer Combos', 'Перални-сушилни', 'washer-dryer-combos', v_laundry_id, 3),
    ('Irons', 'Ютии', 'irons', v_laundry_id, 4),
    ('Steamers', 'Парочистачки', 'steamers', v_laundry_id, 5),
    ('Laundry Accessories', 'Аксесоари за пране', 'laundry-accessories', v_laundry_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_vacuums_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Upright Vacuums', 'Прави прахосмукачки', 'upright-vacuums', v_vacuums_id, 1),
    ('Canister Vacuums', 'Прахосмукачки с контейнер', 'canister-vacuums', v_vacuums_id, 2),
    ('Stick Vacuums', 'Ръчни прахосмукачки', 'stick-vacuums', v_vacuums_id, 3),
    ('Handheld Vacuums', 'Преносими прахосмукачки', 'handheld-vacuums', v_vacuums_id, 4),
    ('Robot Vacuums', 'Роботи прахосмукачки', 'robot-vacuums-appliances', v_vacuums_id, 5),
    ('Steam Mops', 'Парочистачки за под', 'steam-mops', v_vacuums_id, 6),
    ('Carpet Cleaners', 'Перални за килими', 'carpet-cleaners', v_vacuums_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- GARDEN L2 Categories
  IF v_plants_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Indoor Plants', 'Стайни растения', 'indoor-plants', v_plants_id, 1),
    ('Outdoor Plants', 'Градински растения', 'outdoor-plants', v_plants_id, 2),
    ('Flower Bulbs', 'Цветни луковици', 'flower-bulbs', v_plants_id, 3),
    ('Vegetable Seeds', 'Зеленчукови семена', 'vegetable-seeds', v_plants_id, 4),
    ('Flower Seeds', 'Цветни семена', 'flower-seeds', v_plants_id, 5),
    ('Herb Seeds', 'Билкови семена', 'herb-seeds', v_plants_id, 6),
    ('Trees & Shrubs', 'Дървета и храсти', 'trees-shrubs', v_plants_id, 7),
    ('Succulents', 'Сукуленти', 'succulents', v_plants_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_outdoor_living_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Patio Sets', 'Градински комплекти', 'patio-sets', v_outdoor_living_id, 1),
    ('Outdoor Chairs', 'Градински столове', 'outdoor-chairs', v_outdoor_living_id, 2),
    ('Outdoor Tables', 'Градински маси', 'outdoor-tables', v_outdoor_living_id, 3),
    ('Hammocks', 'Хамаци', 'hammocks', v_outdoor_living_id, 4),
    ('Umbrellas', 'Чадъри', 'patio-umbrellas', v_outdoor_living_id, 5),
    ('Outdoor Rugs', 'Градински килими', 'outdoor-rugs', v_outdoor_living_id, 6),
    ('Fire Pits', 'Огнища', 'fire-pits', v_outdoor_living_id, 7),
    ('Pergolas', 'Перголи', 'pergolas', v_outdoor_living_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_pools_spas_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Above Ground Pools', 'Надземни басейни', 'above-ground-pools', v_pools_spas_id, 1),
    ('Pool Chemicals', 'Химикали за басейн', 'pool-chemicals', v_pools_spas_id, 2),
    ('Pool Accessories', 'Аксесоари за басейн', 'pool-accessories', v_pools_spas_id, 3),
    ('Hot Tubs', 'Джакузита', 'hot-tubs', v_pools_spas_id, 4),
    ('Saunas', 'Сауни', 'saunas', v_pools_spas_id, 5),
    ('Pool Floats', 'Надуваеми за басейн', 'pool-floats', v_pools_spas_id, 6),
    ('Pool Pumps', 'Помпи за басейн', 'pool-pumps', v_pools_spas_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  IF v_bbq_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Gas Grills', 'Газови грилове', 'gas-grills', v_bbq_id, 1),
    ('Charcoal Grills', 'Грилове на въглища', 'charcoal-grills', v_bbq_id, 2),
    ('Electric Grills', 'Електрически грилове', 'electric-grills', v_bbq_id, 3),
    ('Smokers', 'Пушилни', 'smokers', v_bbq_id, 4),
    ('Grill Accessories', 'Аксесоари за грил', 'grill-accessories', v_bbq_id, 5),
    ('Outdoor Pizza Ovens', 'Пещи за пица', 'outdoor-pizza-ovens', v_bbq_id, 6),
    ('Portable Grills', 'Преносими грилове', 'portable-grills', v_bbq_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Food & Beverage, Home Appliances categories restored';
END $$;
;
