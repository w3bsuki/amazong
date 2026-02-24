
-- Restore L3 categories for Real Estate, Electronics, Fashion
DO $$
DECLARE
  -- Real Estate L2 IDs
  v_apartments_id UUID;
  v_houses_id UUID;
  v_commercial_id UUID;
  v_land_id UUID;
  v_vacation_id UUID;
  -- Electronics L2 IDs
  v_smartphones_id UUID;
  v_laptops_id UUID;
  v_cameras_id UUID;
  v_audio_id UUID;
  v_tv_id UUID;
  v_gaming_consoles_id UUID;
  v_smart_home_id UUID;
  -- Fashion L2 IDs
  v_womens_clothing_id UUID;
  v_mens_clothing_id UUID;
  v_shoes_women_id UUID;
  v_shoes_men_id UUID;
  v_bags_id UUID;
  v_accessories_id UUID;
BEGIN
  -- Get Real Estate L2 IDs
  SELECT id INTO v_apartments_id FROM categories WHERE slug = 'apartments-for-sale';
  SELECT id INTO v_houses_id FROM categories WHERE slug = 'houses-for-sale';
  SELECT id INTO v_commercial_id FROM categories WHERE slug = 'commercial-properties';
  SELECT id INTO v_land_id FROM categories WHERE slug = 'land-plots';
  SELECT id INTO v_vacation_id FROM categories WHERE slug = 'vacation-properties';

  -- Get Electronics L2 IDs  
  SELECT id INTO v_smartphones_id FROM categories WHERE slug = 'smartphones';
  SELECT id INTO v_laptops_id FROM categories WHERE slug = 'laptops';
  SELECT id INTO v_cameras_id FROM categories WHERE slug = 'cameras';
  SELECT id INTO v_audio_id FROM categories WHERE slug = 'audio';
  SELECT id INTO v_tv_id FROM categories WHERE slug = 'tvs';
  SELECT id INTO v_gaming_consoles_id FROM categories WHERE slug = 'gaming-consoles';
  SELECT id INTO v_smart_home_id FROM categories WHERE slug = 'smart-home';

  -- Get Fashion L2 IDs
  SELECT id INTO v_womens_clothing_id FROM categories WHERE slug = 'womens-clothing';
  SELECT id INTO v_mens_clothing_id FROM categories WHERE slug = 'mens-clothing';
  SELECT id INTO v_shoes_women_id FROM categories WHERE slug = 'womens-shoes';
  SELECT id INTO v_shoes_men_id FROM categories WHERE slug = 'mens-shoes';
  SELECT id INTO v_bags_id FROM categories WHERE slug = 'bags-luggage';
  SELECT id INTO v_accessories_id FROM categories WHERE slug = 'accessories';

  -- REAL ESTATE L3 --
  -- Apartments L3
  IF v_apartments_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Studio Apartments', 'Студия', 'studio-apartments', v_apartments_id, 1),
    ('1-Bedroom Apartments', 'Едностайни', 'one-bedroom-apartments', v_apartments_id, 2),
    ('2-Bedroom Apartments', 'Двустайни', 'two-bedroom-apartments', v_apartments_id, 3),
    ('3-Bedroom Apartments', 'Тристайни', 'three-bedroom-apartments', v_apartments_id, 4),
    ('4+ Bedroom Apartments', 'Многостайни', 'four-plus-bedroom-apartments', v_apartments_id, 5),
    ('Penthouses', 'Пентхауси', 'penthouses', v_apartments_id, 6),
    ('Maisonettes', 'Мезонети', 'maisonettes', v_apartments_id, 7),
    ('New Construction', 'Ново строителство', 'new-construction-apartments', v_apartments_id, 8),
    ('Renovated', 'Реновирани', 'renovated-apartments', v_apartments_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Houses L3
  IF v_houses_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Single Family Homes', 'Еднофамилни', 'single-family-homes', v_houses_id, 1),
    ('Townhouses', 'Редови къщи', 'townhouses', v_houses_id, 2),
    ('Villas', 'Вили', 'villas', v_houses_id, 3),
    ('Bungalows', 'Бунгала', 'bungalows', v_houses_id, 4),
    ('Country Houses', 'Селски къщи', 'country-houses', v_houses_id, 5),
    ('Mansions', 'Особняци', 'mansions', v_houses_id, 6),
    ('New Build Houses', 'Ново строителство', 'new-build-houses', v_houses_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Commercial L3
  IF v_commercial_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Offices', 'Офиси', 'offices-for-sale', v_commercial_id, 1),
    ('Retail Spaces', 'Магазини', 'retail-spaces', v_commercial_id, 2),
    ('Warehouses', 'Складове', 'warehouses-for-sale', v_commercial_id, 3),
    ('Hotels', 'Хотели', 'hotels-for-sale', v_commercial_id, 4),
    ('Restaurants', 'Ресторанти', 'restaurants-for-sale', v_commercial_id, 5),
    ('Industrial', 'Промишлени', 'industrial-properties', v_commercial_id, 6),
    ('Mixed Use', 'Смесено ползване', 'mixed-use-properties', v_commercial_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Land L3
  IF v_land_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Building Land', 'Парцели за строеж', 'building-land', v_land_id, 1),
    ('Agricultural Land', 'Земеделска земя', 'agricultural-land', v_land_id, 2),
    ('Forest Land', 'Горска земя', 'forest-land', v_land_id, 3),
    ('Industrial Land', 'Промишлени терени', 'industrial-land', v_land_id, 4),
    ('Investment Land', 'Инвестиционни терени', 'investment-land', v_land_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ELECTRONICS L3 --
  -- Smartphones L3
  IF v_smartphones_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Apple iPhone', 'Apple iPhone', 'apple-iphone', v_smartphones_id, 1),
    ('Samsung Galaxy', 'Samsung Galaxy', 'samsung-galaxy', v_smartphones_id, 2),
    ('Google Pixel', 'Google Pixel', 'google-pixel', v_smartphones_id, 3),
    ('OnePlus', 'OnePlus', 'oneplus-phones', v_smartphones_id, 4),
    ('Xiaomi', 'Xiaomi', 'xiaomi-phones', v_smartphones_id, 5),
    ('Huawei', 'Huawei', 'huawei-phones', v_smartphones_id, 6),
    ('Oppo', 'Oppo', 'oppo-phones', v_smartphones_id, 7),
    ('Motorola', 'Motorola', 'motorola-phones', v_smartphones_id, 8),
    ('Sony Xperia', 'Sony Xperia', 'sony-xperia', v_smartphones_id, 9),
    ('Refurbished Phones', 'Реновирани телефони', 'refurbished-phones', v_smartphones_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Laptops L3
  IF v_laptops_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Gaming Laptops', 'Геймърски лаптопи', 'gaming-laptops', v_laptops_id, 1),
    ('Business Laptops', 'Бизнес лаптопи', 'business-laptops', v_laptops_id, 2),
    ('Ultrabooks', 'Ултрабуци', 'ultrabooks', v_laptops_id, 3),
    ('MacBooks', 'MacBook', 'macbooks', v_laptops_id, 4),
    ('Chromebooks', 'Chromebook', 'chromebooks', v_laptops_id, 5),
    ('2-in-1 Laptops', '2-в-1 лаптопи', 'two-in-one-laptops', v_laptops_id, 6),
    ('Budget Laptops', 'Бюджетни лаптопи', 'budget-laptops', v_laptops_id, 7),
    ('Workstation Laptops', 'Работни станции', 'workstation-laptops', v_laptops_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cameras L3
  IF v_cameras_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('DSLR Cameras', 'DSLR камери', 'dslr-cameras', v_cameras_id, 1),
    ('Mirrorless Cameras', 'Безогледални камери', 'mirrorless-cameras', v_cameras_id, 2),
    ('Point & Shoot', 'Компактни камери', 'point-and-shoot-cameras', v_cameras_id, 3),
    ('Action Cameras', 'Екшън камери', 'action-cameras', v_cameras_id, 4),
    ('Instant Cameras', 'Моментални камери', 'instant-cameras', v_cameras_id, 5),
    ('Camera Lenses', 'Обективи', 'camera-lenses', v_cameras_id, 6),
    ('Camera Accessories', 'Аксесоари за камери', 'camera-accessories', v_cameras_id, 7),
    ('Drones', 'Дронове', 'camera-drones', v_cameras_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Audio L3
  IF v_audio_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Headphones', 'Слушалки', 'headphones', v_audio_id, 1),
    ('Earbuds', 'Безжични слушалки', 'earbuds', v_audio_id, 2),
    ('Speakers', 'Тонколони', 'speakers', v_audio_id, 3),
    ('Soundbars', 'Саундбари', 'soundbars', v_audio_id, 4),
    ('Home Theater', 'Домашно кино', 'home-theater-audio', v_audio_id, 5),
    ('Portable Speakers', 'Преносими тонколони', 'portable-speakers', v_audio_id, 6),
    ('Turntables', 'Грамофони', 'turntables', v_audio_id, 7),
    ('Amplifiers', 'Усилватели', 'amplifiers', v_audio_id, 8),
    ('Microphones', 'Микрофони', 'microphones', v_audio_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- TV L3
  IF v_tv_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('OLED TVs', 'OLED телевизори', 'oled-tvs', v_tv_id, 1),
    ('QLED TVs', 'QLED телевизори', 'qled-tvs', v_tv_id, 2),
    ('LED TVs', 'LED телевизори', 'led-tvs', v_tv_id, 3),
    ('Smart TVs', 'Смарт телевизори', 'smart-tvs', v_tv_id, 4),
    ('4K TVs', '4K телевизори', 'four-k-tvs', v_tv_id, 5),
    ('8K TVs', '8K телевизори', 'eight-k-tvs', v_tv_id, 6),
    ('Projectors', 'Проектори', 'projectors', v_tv_id, 7),
    ('TV Accessories', 'Аксесоари за ТВ', 'tv-accessories', v_tv_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gaming Consoles L3
  IF v_gaming_consoles_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('PlayStation', 'PlayStation', 'playstation', v_gaming_consoles_id, 1),
    ('Xbox', 'Xbox', 'xbox', v_gaming_consoles_id, 2),
    ('Nintendo Switch', 'Nintendo Switch', 'nintendo-switch', v_gaming_consoles_id, 3),
    ('Retro Consoles', 'Ретро конзоли', 'retro-consoles', v_gaming_consoles_id, 4),
    ('Handheld Consoles', 'Преносими конзоли', 'handheld-consoles', v_gaming_consoles_id, 5),
    ('Console Accessories', 'Аксесоари за конзоли', 'console-accessories', v_gaming_consoles_id, 6),
    ('Gaming Controllers', 'Контролери', 'gaming-controllers', v_gaming_consoles_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Smart Home L3
  IF v_smart_home_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Smart Speakers', 'Смарт тонколони', 'smart-speakers', v_smart_home_id, 1),
    ('Smart Displays', 'Смарт дисплеи', 'smart-displays', v_smart_home_id, 2),
    ('Smart Lighting', 'Смарт осветление', 'smart-lighting', v_smart_home_id, 3),
    ('Smart Thermostats', 'Смарт термостати', 'smart-thermostats', v_smart_home_id, 4),
    ('Smart Security', 'Смарт охрана', 'smart-security', v_smart_home_id, 5),
    ('Smart Locks', 'Смарт брави', 'smart-locks', v_smart_home_id, 6),
    ('Smart Plugs', 'Смарт контакти', 'smart-plugs', v_smart_home_id, 7),
    ('Robot Vacuums', 'Роботи прахосмукачки', 'robot-vacuums', v_smart_home_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- FASHION L3 --
  -- Women's Clothing L3
  IF v_womens_clothing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Dresses', 'Рокли', 'womens-dresses', v_womens_clothing_id, 1),
    ('Tops & Blouses', 'Топове и блузи', 'womens-tops-blouses', v_womens_clothing_id, 2),
    ('Pants & Jeans', 'Панталони и дънки', 'womens-pants-jeans', v_womens_clothing_id, 3),
    ('Skirts', 'Поли', 'womens-skirts', v_womens_clothing_id, 4),
    ('Coats & Jackets', 'Палта и якета', 'womens-coats-jackets', v_womens_clothing_id, 5),
    ('Sweaters', 'Пуловери', 'womens-sweaters', v_womens_clothing_id, 6),
    ('Activewear', 'Спортни дрехи', 'womens-activewear', v_womens_clothing_id, 7),
    ('Swimwear', 'Бански', 'womens-swimwear', v_womens_clothing_id, 8),
    ('Lingerie', 'Бельо', 'womens-lingerie', v_womens_clothing_id, 9),
    ('Suits & Blazers', 'Костюми и сака', 'womens-suits-blazers', v_womens_clothing_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Men's Clothing L3
  IF v_mens_clothing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Shirts', 'Ризи', 'mens-shirts', v_mens_clothing_id, 1),
    ('T-Shirts', 'Тениски', 'mens-tshirts', v_mens_clothing_id, 2),
    ('Pants & Jeans', 'Панталони и дънки', 'mens-pants-jeans', v_mens_clothing_id, 3),
    ('Suits', 'Костюми', 'mens-suits', v_mens_clothing_id, 4),
    ('Jackets & Coats', 'Якета и палта', 'mens-jackets-coats', v_mens_clothing_id, 5),
    ('Sweaters', 'Пуловери', 'mens-sweaters', v_mens_clothing_id, 6),
    ('Activewear', 'Спортни дрехи', 'mens-activewear', v_mens_clothing_id, 7),
    ('Underwear', 'Бельо', 'mens-underwear', v_mens_clothing_id, 8),
    ('Shorts', 'Къси панталони', 'mens-shorts', v_mens_clothing_id, 9),
    ('Swimwear', 'Бански', 'mens-swimwear', v_mens_clothing_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Women's Shoes L3
  IF v_shoes_women_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Heels', 'Токчета', 'womens-heels', v_shoes_women_id, 1),
    ('Flats', 'Равни обувки', 'womens-flats', v_shoes_women_id, 2),
    ('Sneakers', 'Маратонки', 'womens-sneakers', v_shoes_women_id, 3),
    ('Boots', 'Ботуши', 'womens-boots', v_shoes_women_id, 4),
    ('Sandals', 'Сандали', 'womens-sandals', v_shoes_women_id, 5),
    ('Athletic Shoes', 'Спортни обувки', 'womens-athletic-shoes', v_shoes_women_id, 6),
    ('Loafers', 'Мокасини', 'womens-loafers', v_shoes_women_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Men's Shoes L3
  IF v_shoes_men_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Dress Shoes', 'Елегантни обувки', 'mens-dress-shoes', v_shoes_men_id, 1),
    ('Sneakers', 'Маратонки', 'mens-sneakers', v_shoes_men_id, 2),
    ('Boots', 'Ботуши', 'mens-boots', v_shoes_men_id, 3),
    ('Loafers', 'Мокасини', 'mens-loafers', v_shoes_men_id, 4),
    ('Sandals', 'Сандали', 'mens-sandals', v_shoes_men_id, 5),
    ('Athletic Shoes', 'Спортни обувки', 'mens-athletic-shoes', v_shoes_men_id, 6),
    ('Casual Shoes', 'Ежедневни обувки', 'mens-casual-shoes', v_shoes_men_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bags L3
  IF v_bags_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Handbags', 'Дамски чанти', 'handbags', v_bags_id, 1),
    ('Backpacks', 'Раници', 'backpacks', v_bags_id, 2),
    ('Tote Bags', 'Тотчета', 'tote-bags', v_bags_id, 3),
    ('Crossbody Bags', 'Чанти през рамо', 'crossbody-bags', v_bags_id, 4),
    ('Clutches', 'Портмонета', 'clutches', v_bags_id, 5),
    ('Suitcases', 'Куфари', 'suitcases', v_bags_id, 6),
    ('Travel Bags', 'Пътни чанти', 'travel-bags', v_bags_id, 7),
    ('Laptop Bags', 'Чанти за лаптоп', 'laptop-bags', v_bags_id, 8),
    ('Wallets', 'Портфейли', 'wallets', v_bags_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Real Estate, Electronics, Fashion L3 categories restored';
END $$;
;
