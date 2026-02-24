
-- Restore L3 categories for Vehicles and Bulgarian Traditional
DO $$
DECLARE
  -- Vehicles L2 IDs
  v_cars_id UUID;
  v_motorcycles_id UUID;
  v_trucks_id UUID;
  v_boats_id UUID;
  v_rvs_id UUID;
  v_atvs_id UUID;
  v_car_parts_id UUID;
  -- Bulgarian Traditional L2 IDs
  v_traditional_food_id UUID;
  v_traditional_crafts_id UUID;
  v_traditional_clothing_id UUID;
  v_traditional_music_id UUID;
  v_bulgarian_wines_id UUID;
  v_rose_products_id UUID;
BEGIN
  -- Get Vehicles L2 IDs
  SELECT id INTO v_cars_id FROM categories WHERE slug = 'cars';
  SELECT id INTO v_motorcycles_id FROM categories WHERE slug = 'motorcycles';
  SELECT id INTO v_trucks_id FROM categories WHERE slug = 'trucks-commercial';
  SELECT id INTO v_boats_id FROM categories WHERE slug = 'boats-watercraft';
  SELECT id INTO v_rvs_id FROM categories WHERE slug = 'rvs-campers';
  SELECT id INTO v_atvs_id FROM categories WHERE slug = 'atvs-powersports';
  SELECT id INTO v_car_parts_id FROM categories WHERE slug = 'car-parts-accessories';

  -- Get Bulgarian Traditional L2 IDs
  SELECT id INTO v_traditional_food_id FROM categories WHERE slug = 'traditional-food';
  SELECT id INTO v_traditional_crafts_id FROM categories WHERE slug = 'traditional-crafts';
  SELECT id INTO v_traditional_clothing_id FROM categories WHERE slug = 'traditional-clothing';
  SELECT id INTO v_traditional_music_id FROM categories WHERE slug = 'traditional-music';
  SELECT id INTO v_bulgarian_wines_id FROM categories WHERE slug = 'bulgarian-wines';
  SELECT id INTO v_rose_products_id FROM categories WHERE slug = 'rose-products';

  -- VEHICLES L3 --
  -- Cars L3
  IF v_cars_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Sedans', 'Седани', 'sedans', v_cars_id, 1),
    ('SUVs', 'Джипове', 'suvs', v_cars_id, 2),
    ('Hatchbacks', 'Хечбеци', 'hatchbacks', v_cars_id, 3),
    ('Coupes', 'Купета', 'coupes', v_cars_id, 4),
    ('Wagons', 'Комбита', 'wagons', v_cars_id, 5),
    ('Convertibles', 'Кабриолети', 'convertibles', v_cars_id, 6),
    ('Minivans', 'Миниванове', 'minivans', v_cars_id, 7),
    ('Electric Cars', 'Електрически коли', 'electric-cars', v_cars_id, 8),
    ('Hybrid Cars', 'Хибридни коли', 'hybrid-cars', v_cars_id, 9),
    ('Luxury Cars', 'Луксозни коли', 'luxury-cars', v_cars_id, 10),
    ('Sports Cars', 'Спортни коли', 'sports-cars', v_cars_id, 11)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Motorcycles L3
  IF v_motorcycles_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Sport Bikes', 'Спортни мотори', 'sport-bikes', v_motorcycles_id, 1),
    ('Cruisers', 'Круизъри', 'cruisers', v_motorcycles_id, 2),
    ('Touring Bikes', 'Туристически мотори', 'touring-bikes', v_motorcycles_id, 3),
    ('Dirt Bikes', 'Мотокрос', 'dirt-bikes', v_motorcycles_id, 4),
    ('Adventure Bikes', 'Ендуро', 'adventure-bikes', v_motorcycles_id, 5),
    ('Scooters', 'Скутери', 'motor-scooters', v_motorcycles_id, 6),
    ('Electric Motorcycles', 'Електрически мотори', 'electric-motorcycles', v_motorcycles_id, 7),
    ('Vintage Motorcycles', 'Ретро мотори', 'vintage-motorcycles', v_motorcycles_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Trucks L3
  IF v_trucks_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Pickup Trucks', 'Пикапи', 'pickup-trucks', v_trucks_id, 1),
    ('Box Trucks', 'Фургони', 'box-trucks', v_trucks_id, 2),
    ('Semi Trucks', 'ТИР-ове', 'semi-trucks', v_trucks_id, 3),
    ('Dump Trucks', 'Самосвали', 'dump-trucks', v_trucks_id, 4),
    ('Flatbed Trucks', 'Бордови камиони', 'flatbed-trucks', v_trucks_id, 5),
    ('Vans', 'Вани', 'commercial-vans', v_trucks_id, 6),
    ('Buses', 'Автобуси', 'buses', v_trucks_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Boats L3
  IF v_boats_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Motorboats', 'Моторни лодки', 'motorboats', v_boats_id, 1),
    ('Sailboats', 'Платноходки', 'sailboats', v_boats_id, 2),
    ('Yachts', 'Яхти', 'yachts', v_boats_id, 3),
    ('Jet Skis', 'Джетове', 'jet-skis', v_boats_id, 4),
    ('Kayaks & Canoes', 'Каяци и канута', 'kayaks-canoes', v_boats_id, 5),
    ('Fishing Boats', 'Риболовни лодки', 'fishing-boats', v_boats_id, 6),
    ('Inflatable Boats', 'Надуваеми лодки', 'inflatable-boats', v_boats_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- RVs L3
  IF v_rvs_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Class A RVs', 'Клас A кемпери', 'class-a-rvs', v_rvs_id, 1),
    ('Class B RVs', 'Клас B кемпери', 'class-b-rvs', v_rvs_id, 2),
    ('Class C RVs', 'Клас C кемпери', 'class-c-rvs', v_rvs_id, 3),
    ('Travel Trailers', 'Туристически ремаркета', 'travel-trailers', v_rvs_id, 4),
    ('Fifth Wheels', 'Пето колело', 'fifth-wheels', v_rvs_id, 5),
    ('Camper Vans', 'Кемпер вани', 'camper-vans', v_rvs_id, 6),
    ('Pop-Up Campers', 'Разгъваеми кемпери', 'popup-campers', v_rvs_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ATVs L3
  IF v_atvs_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Sport ATVs', 'Спортни АТВ', 'sport-atvs', v_atvs_id, 1),
    ('Utility ATVs', 'Работни АТВ', 'utility-atvs', v_atvs_id, 2),
    ('Youth ATVs', 'Детски АТВ', 'youth-atvs', v_atvs_id, 3),
    ('Side-by-Sides', 'UTV', 'side-by-sides', v_atvs_id, 4),
    ('Snowmobiles', 'Снегоходи', 'snowmobiles', v_atvs_id, 5),
    ('Go-Karts', 'Картинги', 'go-karts', v_atvs_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Car Parts L3
  IF v_car_parts_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Engine Parts', 'Части за двигател', 'engine-parts', v_car_parts_id, 1),
    ('Brakes', 'Спирачки', 'brakes', v_car_parts_id, 2),
    ('Suspension', 'Окачване', 'suspension-parts', v_car_parts_id, 3),
    ('Transmission', 'Трансмисия', 'transmission-parts', v_car_parts_id, 4),
    ('Exhaust', 'Ауспух', 'exhaust-parts', v_car_parts_id, 5),
    ('Tires & Wheels', 'Гуми и джанти', 'tires-wheels', v_car_parts_id, 6),
    ('Interior Accessories', 'Аксесоари интериор', 'interior-accessories', v_car_parts_id, 7),
    ('Exterior Accessories', 'Аксесоари екстериор', 'exterior-accessories', v_car_parts_id, 8),
    ('Car Electronics', 'Автоелектроника', 'car-electronics', v_car_parts_id, 9),
    ('Oils & Fluids', 'Масла и течности', 'oils-fluids', v_car_parts_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- BULGARIAN TRADITIONAL L3 --
  -- Traditional Food L3
  IF v_traditional_food_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Lukanka', 'Луканка', 'lukanka', v_traditional_food_id, 1),
    ('Sujuk', 'Суджук', 'sujuk', v_traditional_food_id, 2),
    ('Sirene', 'Сирене', 'sirene-cheese', v_traditional_food_id, 3),
    ('Kashkaval', 'Кашкавал', 'kashkaval', v_traditional_food_id, 4),
    ('Bulgarian Yogurt', 'Българско кисело мляко', 'bulgarian-yogurt', v_traditional_food_id, 5),
    ('Honey', 'Мед', 'bulgarian-honey', v_traditional_food_id, 6),
    ('Lyutenitsa', 'Лютеница', 'lyutenitsa', v_traditional_food_id, 7),
    ('Rakia', 'Ракия', 'rakia', v_traditional_food_id, 8),
    ('Banitsa', 'Баница', 'banitsa', v_traditional_food_id, 9),
    ('Kiselo Zele', 'Кисело зеле', 'kiselo-zele', v_traditional_food_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Traditional Crafts L3
  IF v_traditional_crafts_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Woodcarving', 'Дърворезба', 'woodcarving', v_traditional_crafts_id, 1),
    ('Pottery', 'Керамика', 'bulgarian-pottery', v_traditional_crafts_id, 2),
    ('Embroidery', 'Бродерия', 'bulgarian-embroidery', v_traditional_crafts_id, 3),
    ('Weaving', 'Тъкачество', 'weaving', v_traditional_crafts_id, 4),
    ('Copper Work', 'Медникарство', 'copper-work', v_traditional_crafts_id, 5),
    ('Icons', 'Икони', 'bulgarian-icons', v_traditional_crafts_id, 6),
    ('Filigree', 'Филигран', 'filigree', v_traditional_crafts_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Traditional Clothing L3
  IF v_traditional_clothing_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Women''s Costumes', 'Женски носии', 'womens-folk-costumes', v_traditional_clothing_id, 1),
    ('Men''s Costumes', 'Мъжки носии', 'mens-folk-costumes', v_traditional_clothing_id, 2),
    ('Children''s Costumes', 'Детски носии', 'childrens-folk-costumes', v_traditional_clothing_id, 3),
    ('Traditional Shoes', 'Цървули', 'traditional-shoes', v_traditional_clothing_id, 4),
    ('Traditional Belts', 'Пояси', 'traditional-belts', v_traditional_clothing_id, 5),
    ('Headdresses', 'Шапки и забрадки', 'traditional-headdresses', v_traditional_clothing_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Traditional Music L3
  IF v_traditional_music_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Gaida', 'Гайда', 'gaida', v_traditional_music_id, 1),
    ('Kaval', 'Кавал', 'kaval', v_traditional_music_id, 2),
    ('Gadulka', 'Гъдулка', 'gadulka', v_traditional_music_id, 3),
    ('Tambura', 'Тамбура', 'tambura', v_traditional_music_id, 4),
    ('Tupan', 'Тъпан', 'tupan', v_traditional_music_id, 5),
    ('Folk Music CDs', 'Народна музика CD', 'folk-music-cds', v_traditional_music_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bulgarian Wines L3
  IF v_bulgarian_wines_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Mavrud', 'Мавруд', 'mavrud-wine', v_bulgarian_wines_id, 1),
    ('Melnik', 'Мелник', 'melnik-wine', v_bulgarian_wines_id, 2),
    ('Gamza', 'Гъмза', 'gamza-wine', v_bulgarian_wines_id, 3),
    ('Dimyat', 'Димят', 'dimyat-wine', v_bulgarian_wines_id, 4),
    ('Rubin', 'Рубин', 'rubin-wine', v_bulgarian_wines_id, 5),
    ('Misket', 'Мискет', 'misket-wine', v_bulgarian_wines_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Rose Products L3
  IF v_rose_products_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
    ('Rose Oil', 'Розово масло', 'rose-oil', v_rose_products_id, 1),
    ('Rose Water', 'Розова вода', 'rose-water', v_rose_products_id, 2),
    ('Rose Jam', 'Розово сладко', 'rose-jam', v_rose_products_id, 3),
    ('Rose Liqueur', 'Розов ликьор', 'rose-liqueur', v_rose_products_id, 4),
    ('Rose Soap', 'Розов сапун', 'rose-soap', v_rose_products_id, 5),
    ('Rose Cosmetics', 'Розова козметика', 'rose-cosmetics', v_rose_products_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RAISE NOTICE 'Vehicles and Bulgarian Traditional L3 categories restored';
END $$;
;
