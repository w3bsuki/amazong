
-- Batch 28: Automotive, Real Estate, Vehicles deep categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Auto Parts L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'auto-parts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Engine Parts', 'Части за двигател', 'engine-parts', v_parent_id, 1),
      ('Brake Parts', 'Спирачни части', 'brake-parts', v_parent_id, 2),
      ('Suspension Parts', 'Части за окачване', 'suspension-parts', v_parent_id, 3),
      ('Transmission Parts', 'Части за трансмисия', 'transmission-parts', v_parent_id, 4),
      ('Exhaust Parts', 'Ауспухни системи', 'exhaust-parts', v_parent_id, 5),
      ('Cooling System', 'Охладителна система', 'cooling-system', v_parent_id, 6),
      ('Electrical Parts', 'Електрически части', 'auto-electrical-parts', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'car-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Floor Mats', 'Стелки', 'floor-mats', v_parent_id, 1),
      ('Seat Covers', 'Калъфи за седалки', 'seat-covers', v_parent_id, 2),
      ('Car Organizers', 'Организатори за кола', 'car-organizers', v_parent_id, 3),
      ('Phone Holders', 'Стойки за телефон', 'car-phone-holders', v_parent_id, 4),
      ('Sun Shades', 'Сенници', 'sun-shades', v_parent_id, 5),
      ('Roof Racks', 'Багажници за покрив', 'roof-racks', v_parent_id, 6),
      ('Dash Cams', 'Видеорегистратори', 'dash-cams', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tires-wheels';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Summer Tires', 'Летни гуми', 'summer-tires', v_parent_id, 1),
      ('Winter Tires', 'Зимни гуми', 'winter-tires', v_parent_id, 2),
      ('All-Season Tires', 'Целогодишни гуми', 'all-season-tires', v_parent_id, 3),
      ('Alloy Wheels', 'Алуминиеви джанти', 'alloy-wheels', v_parent_id, 4),
      ('Steel Wheels', 'Стоманени джанти', 'steel-wheels', v_parent_id, 5),
      ('Tire Accessories', 'Аксесоари за гуми', 'tire-accessories', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'car-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Car Wash', 'Автомивка', 'car-wash', v_parent_id, 1),
      ('Polish & Wax', 'Полиране и вакса', 'polish-wax', v_parent_id, 2),
      ('Interior Cleaners', 'Препарати за интериор', 'interior-cleaners', v_parent_id, 3),
      ('Tire Care', 'Грижа за гуми', 'tire-care', v_parent_id, 4),
      ('Glass Cleaners', 'Препарати за стъкла', 'glass-cleaners', v_parent_id, 5),
      ('Detailing Supplies', 'Детайлинг консумативи', 'detailing-supplies', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Vehicles L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cars-vehicles';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sedans', 'Седани', 'sedans', v_parent_id, 1),
      ('SUVs', 'Джипове', 'suvs', v_parent_id, 2),
      ('Trucks', 'Пикапи', 'trucks', v_parent_id, 3),
      ('Sports Cars', 'Спортни коли', 'sports-cars', v_parent_id, 4),
      ('Luxury Cars', 'Луксозни коли', 'luxury-cars', v_parent_id, 5),
      ('Electric Cars', 'Електрически коли', 'electric-cars', v_parent_id, 6),
      ('Hybrid Cars', 'Хибридни коли', 'hybrid-cars', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'motorcycles';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sport Bikes', 'Спортни мотори', 'sport-bikes', v_parent_id, 1),
      ('Cruisers', 'Круизъри', 'cruisers', v_parent_id, 2),
      ('Touring Bikes', 'Туристически мотори', 'touring-bikes', v_parent_id, 3),
      ('Dirt Bikes', 'Кросови мотори', 'dirt-bikes', v_parent_id, 4),
      ('Scooters', 'Скутери', 'motor-scooters', v_parent_id, 5),
      ('ATVs', 'АТВ', 'atvs', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'boats';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fishing Boats', 'Риболовни лодки', 'fishing-boats', v_parent_id, 1),
      ('Speedboats', 'Моторни лодки', 'speedboats', v_parent_id, 2),
      ('Sailboats', 'Ветроходи', 'sailboats', v_parent_id, 3),
      ('Jet Skis', 'Джетове', 'jet-skis', v_parent_id, 4),
      ('Pontoon Boats', 'Понтонни лодки', 'pontoon-boats', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- E-Mobility L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'electric-bikes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('City E-Bikes', 'Градски електровелосипеди', 'city-e-bikes', v_parent_id, 1),
      ('Mountain E-Bikes', 'Планински електровелосипеди', 'mountain-e-bikes', v_parent_id, 2),
      ('Folding E-Bikes', 'Сгъваеми електровелосипеди', 'folding-e-bikes', v_parent_id, 3),
      ('Cargo E-Bikes', 'Товарни електровелосипеди', 'cargo-e-bikes', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'electric-scooters';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Commuter Scooters', 'Ежедневни тротинетки', 'commuter-scooters', v_parent_id, 1),
      ('Off-Road Scooters', 'Офроуд тротинетки', 'off-road-scooters', v_parent_id, 2),
      ('Folding Scooters', 'Сгъваеми тротинетки', 'folding-scooters', v_parent_id, 3),
      ('Kids Electric Scooters', 'Детски електрически тротинетки', 'kids-electric-scooters', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Real Estate L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'residential-sale';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Apartments for Sale', 'Апартаменти за продажба', 'apartments-for-sale', v_parent_id, 1),
      ('Houses for Sale', 'Къщи за продажба', 'houses-for-sale', v_parent_id, 2),
      ('Villas for Sale', 'Вили за продажба', 'villas-for-sale', v_parent_id, 3),
      ('Townhouses for Sale', 'Редови къщи за продажба', 'townhouses-for-sale', v_parent_id, 4),
      ('Penthouses for Sale', 'Пентхауси за продажба', 'penthouses-for-sale', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'residential-rent';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Apartments for Rent', 'Апартаменти под наем', 'apartments-for-rent', v_parent_id, 1),
      ('Houses for Rent', 'Къщи под наем', 'houses-for-rent', v_parent_id, 2),
      ('Rooms for Rent', 'Стаи под наем', 'rooms-for-rent', v_parent_id, 3),
      ('Short-Term Rentals', 'Краткосрочен наем', 'short-term-rentals', v_parent_id, 4),
      ('Student Housing', 'Студентско жилище', 'student-housing', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'commercial-sale';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Offices for Sale', 'Офиси за продажба', 'offices-for-sale', v_parent_id, 1),
      ('Retail for Sale', 'Магазини за продажба', 'retail-for-sale', v_parent_id, 2),
      ('Warehouses for Sale', 'Складове за продажба', 'warehouses-for-sale', v_parent_id, 3),
      ('Industrial for Sale', 'Индустриални имоти за продажба', 'industrial-for-sale', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'commercial-rent';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Offices for Rent', 'Офиси под наем', 'offices-for-rent', v_parent_id, 1),
      ('Retail for Rent', 'Магазини под наем', 'retail-for-rent', v_parent_id, 2),
      ('Warehouses for Rent', 'Складове под наем', 'warehouses-for-rent', v_parent_id, 3),
      ('Coworking Spaces', 'Коуоркинг пространства', 'coworking-spaces', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'land';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Residential Land', 'Жилищни парцели', 'residential-land', v_parent_id, 1),
      ('Commercial Land', 'Търговски парцели', 'commercial-land', v_parent_id, 2),
      ('Agricultural Land', 'Земеделска земя', 'agricultural-land', v_parent_id, 3),
      ('Development Land', 'Парцели за строителство', 'development-land', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
