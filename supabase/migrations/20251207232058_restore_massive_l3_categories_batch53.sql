
-- Batch 53: More categories - Automotive parts, Motorcycle, RV, Marine
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Motorcycle deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'motorcycles';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sport Bikes', 'Спортни мотори', 'sport-bikes', v_parent_id, 1),
      ('Cruiser Bikes', 'Круизъри', 'cruiser-bikes', v_parent_id, 2),
      ('Touring Bikes', 'Туринг мотори', 'touring-bikes', v_parent_id, 3),
      ('Dirt Bikes', 'Крос мотори', 'dirt-bikes', v_parent_id, 4),
      ('Scooters', 'Скутери', 'scooters', v_parent_id, 5),
      ('Electric Motorcycles', 'Електрически мотори', 'electric-motorcycles', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'motorcycle-gear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Motorcycle Helmets', 'Мото каски', 'motorcycle-helmets', v_parent_id, 1),
      ('Motorcycle Jackets', 'Мото якета', 'motorcycle-jackets', v_parent_id, 2),
      ('Motorcycle Gloves', 'Мото ръкавици', 'motorcycle-gloves', v_parent_id, 3),
      ('Motorcycle Boots', 'Мото ботуши', 'motorcycle-boots', v_parent_id, 4),
      ('Motorcycle Pants', 'Мото панталони', 'motorcycle-pants', v_parent_id, 5),
      ('Protective Gear', 'Защитна екипировка', 'motorcycle-protective-gear', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'motorcycle-parts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Motorcycle Tires', 'Мото гуми', 'motorcycle-tires', v_parent_id, 1),
      ('Motorcycle Exhausts', 'Мото ауспуси', 'motorcycle-exhausts', v_parent_id, 2),
      ('Motorcycle Brakes', 'Мото спирачки', 'motorcycle-brakes', v_parent_id, 3),
      ('Motorcycle Chains', 'Мото вериги', 'motorcycle-chains', v_parent_id, 4),
      ('Motorcycle Mirrors', 'Мото огледала', 'motorcycle-mirrors', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ATV deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'atvs';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sport ATVs', 'Спортни АТВ', 'sport-atvs', v_parent_id, 1),
      ('Utility ATVs', 'Работни АТВ', 'utility-atvs', v_parent_id, 2),
      ('Youth ATVs', 'Детски АТВ', 'youth-atvs', v_parent_id, 3),
      ('ATV Parts', 'Части за АТВ', 'atv-parts', v_parent_id, 4),
      ('ATV Accessories', 'Аксесоари за АТВ', 'atv-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Boats & Marine deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'boats-marine';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Boats', 'Лодки', 'boats', v_parent_id, 1),
      ('Jet Skis', 'Джетове', 'jet-skis', v_parent_id, 2),
      ('Boat Parts', 'Части за лодки', 'boat-parts', v_parent_id, 3),
      ('Marine Electronics', 'Морска електроника', 'marine-electronics', v_parent_id, 4),
      ('Boat Covers', 'Покривала за лодки', 'boat-covers', v_parent_id, 5),
      ('Anchors', 'Котви', 'anchors', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- RV deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'rvs-campers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Travel Trailers', 'Пътнически каравани', 'travel-trailers', v_parent_id, 1),
      ('Motorhomes', 'Кемпери', 'motorhomes', v_parent_id, 2),
      ('Camper Vans', 'Кампер вани', 'camper-vans', v_parent_id, 3),
      ('RV Parts', 'Части за кемпери', 'rv-parts', v_parent_id, 4),
      ('RV Accessories', 'Аксесоари за кемпери', 'rv-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Car Interior deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'car-interior';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Seat Covers', 'Калъфи за седалки', 'seat-covers', v_parent_id, 1),
      ('Floor Mats', 'Стелки за кола', 'floor-mats', v_parent_id, 2),
      ('Steering Wheel Covers', 'Калъфи за волан', 'steering-wheel-covers', v_parent_id, 3),
      ('Car Organizers', 'Органайзери за кола', 'car-organizers', v_parent_id, 4),
      ('Sun Shades', 'Сенници', 'sun-shades', v_parent_id, 5),
      ('Air Fresheners', 'Ароматизатори', 'air-fresheners', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Car Exterior deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'car-exterior';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Car Covers', 'Покривала за кола', 'car-covers', v_parent_id, 1),
      ('Roof Racks', 'Багажници', 'roof-racks', v_parent_id, 2),
      ('Bike Racks', 'Стойки за велосипеди', 'bike-racks', v_parent_id, 3),
      ('Cargo Carriers', 'Товарни кутии', 'cargo-carriers', v_parent_id, 4),
      ('Mud Flaps', 'Калобрани', 'mud-flaps', v_parent_id, 5),
      ('Running Boards', 'Степенки', 'running-boards', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tools & Garage deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'automotive-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Jack Stands', 'Крикове', 'jack-stands', v_parent_id, 1),
      ('Floor Jacks', 'Подови крикове', 'floor-jacks', v_parent_id, 2),
      ('OBD Scanners', 'OBD скенери', 'obd-scanners', v_parent_id, 3),
      ('Tire Pressure Gauges', 'Манометри', 'tire-pressure-gauges', v_parent_id, 4),
      ('Jump Starters', 'Стартери', 'jump-starters', v_parent_id, 5),
      ('Battery Chargers', 'Зарядни за акумулатор', 'battery-chargers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Oils & Fluids deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'oils-fluids';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Motor Oil', 'Моторно масло', 'motor-oil', v_parent_id, 1),
      ('Transmission Fluid', 'Трансмисионна течност', 'transmission-fluid', v_parent_id, 2),
      ('Brake Fluid', 'Спирачна течност', 'brake-fluid', v_parent_id, 3),
      ('Coolant', 'Антифриз', 'coolant', v_parent_id, 4),
      ('Power Steering Fluid', 'Хидравлична течност', 'power-steering-fluid', v_parent_id, 5),
      ('Windshield Washer', 'Течност за чистачки', 'windshield-washer', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
