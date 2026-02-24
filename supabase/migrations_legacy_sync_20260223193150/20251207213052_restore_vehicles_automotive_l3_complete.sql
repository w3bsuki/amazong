-- Restore Vehicles & Automotive L3 categories

-- Cars L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Sedans', 'cars-sedans', 'Седани', 1),
  ('SUVs', 'cars-suvs', 'Джипове', 2),
  ('Hatchbacks', 'cars-hatchbacks', 'Хечбеци', 3),
  ('Coupes', 'cars-coupes', 'Купета', 4),
  ('Convertibles', 'cars-convertibles', 'Кабриолети', 5),
  ('Wagons', 'cars-wagons', 'Комбита', 6),
  ('Minivans', 'cars-minivans', 'Миниванове', 7),
  ('Sports Cars', 'cars-sports', 'Спортни коли', 8),
  ('Luxury Cars', 'cars-luxury', 'Луксозни коли', 9),
  ('Electric Cars', 'cars-electric', 'Електрически коли', 10),
  ('Hybrid Cars', 'cars-hybrid', 'Хибридни коли', 11)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'vehicles-cars'
ON CONFLICT (slug) DO NOTHING;

-- Motorcycles L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Sport Bikes', 'motorcycles-sport', 'Спортни мотори', 1),
  ('Cruisers', 'motorcycles-cruisers', 'Круизери', 2),
  ('Touring Bikes', 'motorcycles-touring', 'Туристически мотори', 3),
  ('Dual Sport', 'motorcycles-dual', 'Дуал спорт', 4),
  ('Dirt Bikes', 'motorcycles-dirt', 'Крос мотори', 5),
  ('Scooters', 'motorcycles-scooters', 'Скутери', 6),
  ('Choppers', 'motorcycles-choppers', 'Чопъри', 7),
  ('Adventure Bikes', 'motorcycles-adventure', 'Приключенски мотори', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'vehicles-motorcycles'
ON CONFLICT (slug) DO NOTHING;

-- Auto Parts L3 - Engine
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Air Filters', 'engine-air-filters', 'Въздушни филтри', 1),
  ('Oil Filters', 'engine-oil-filters', 'Маслени филтри', 2),
  ('Spark Plugs', 'engine-spark-plugs', 'Свещи', 3),
  ('Fuel Pumps', 'engine-fuel-pumps', 'Горивни помпи', 4),
  ('Alternators', 'engine-alternators', 'Алтернатори', 5),
  ('Starters', 'engine-starters', 'Стартери', 6),
  ('Timing Belts', 'engine-timing', 'Ангренажни ремъци', 7),
  ('Gaskets', 'engine-gaskets', 'Гарнитури', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'parts-engine'
ON CONFLICT (slug) DO NOTHING;

-- Auto Parts L3 - Brakes
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Brake Pads', 'brakes-pads', 'Накладки', 1),
  ('Brake Rotors', 'brakes-rotors', 'Дискове', 2),
  ('Brake Calipers', 'brakes-calipers', 'Спирачни апарати', 3),
  ('Brake Lines', 'brakes-lines', 'Спирачни маркучи', 4),
  ('Brake Fluid', 'brakes-fluid', 'Спирачна течност', 5),
  ('Brake Kits', 'brakes-kits', 'Комплекти спирачки', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'parts-brakes'
ON CONFLICT (slug) DO NOTHING;

-- Auto Parts L3 - Suspension
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Shock Absorbers', 'suspension-shocks', 'Амортисьори', 1),
  ('Struts', 'suspension-struts', 'Пружини', 2),
  ('Control Arms', 'suspension-arms', 'Носачи', 3),
  ('Sway Bars', 'suspension-sway', 'Стабилизатори', 4),
  ('Ball Joints', 'suspension-ball-joints', 'Накрайници', 5),
  ('Bushings', 'suspension-bushings', 'Тампони', 6),
  ('Coilovers', 'suspension-coilovers', 'Койловери', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'parts-suspension'
ON CONFLICT (slug) DO NOTHING;

-- Tires & Wheels L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Summer Tires', 'tires-summer', 'Летни гуми', 1),
  ('Winter Tires', 'tires-winter', 'Зимни гуми', 2),
  ('All Season Tires', 'tires-allseason', 'Всесезонни гуми', 3),
  ('Performance Tires', 'tires-performance', 'Спортни гуми', 4),
  ('Off Road Tires', 'tires-offroad', 'Офроуд гуми', 5),
  ('Alloy Wheels', 'wheels-alloy', 'Алуминиеви джанти', 6),
  ('Steel Wheels', 'wheels-steel', 'Стоманени джанти', 7),
  ('Wheel Covers', 'wheels-covers', 'Тасове', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'parts-tires-wheels'
ON CONFLICT (slug) DO NOTHING;

-- Car Electronics L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Car Stereos', 'car-audio-stereos', 'Авто касетофони', 1),
  ('Car Speakers', 'car-audio-speakers', 'Авто тонколони', 2),
  ('Subwoofers', 'car-audio-subwoofers', 'Субуфери', 3),
  ('Amplifiers', 'car-audio-amplifiers', 'Усилватели', 4),
  ('Dash Cameras', 'car-electronics-dashcam', 'Видеорегистратори', 5),
  ('GPS Navigation', 'car-electronics-gps', 'GPS навигации', 6),
  ('Car Alarms', 'car-electronics-alarms', 'Авто аларми', 7),
  ('Parking Sensors', 'car-electronics-parking', 'Парктроници', 8)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'parts-electronics'
ON CONFLICT (slug) DO NOTHING;

-- Car Care L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Car Wash', 'care-wash', 'Автомивки', 1),
  ('Car Wax & Polish', 'care-wax', 'Восъци и полиши', 2),
  ('Interior Cleaners', 'care-interior', 'Почистване интериор', 3),
  ('Tire Care', 'care-tires', 'Грижа за гуми', 4),
  ('Glass Cleaners', 'care-glass', 'Почистване стъкла', 5),
  ('Air Fresheners', 'care-fresheners', 'Ароматизатори', 6),
  ('Detailing Kits', 'care-detailing', 'Комплекти за детайлинг', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'accessories-care'
ON CONFLICT (slug) DO NOTHING;

-- Boats L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Powerboats', 'boats-power', 'Моторни лодки', 1),
  ('Sailboats', 'boats-sail', 'Платноходки', 2),
  ('Fishing Boats', 'boats-fishing', 'Риболовни лодки', 3),
  ('Pontoon Boats', 'boats-pontoon', 'Понтонни лодки', 4),
  ('Jet Skis', 'boats-jetski', 'Джетове', 5),
  ('Kayaks & Canoes', 'boats-kayaks', 'Каяци и кану', 6),
  ('Inflatable Boats', 'boats-inflatable', 'Надуваеми лодки', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'vehicles-boats'
ON CONFLICT (slug) DO NOTHING;

-- RVs & Campers L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Class A RVs', 'rvs-class-a', 'Клас A кемпери', 1),
  ('Class B RVs', 'rvs-class-b', 'Клас B кемпери', 2),
  ('Class C RVs', 'rvs-class-c', 'Клас C кемпери', 3),
  ('Travel Trailers', 'rvs-travel', 'Туристически ремаркета', 4),
  ('Fifth Wheels', 'rvs-fifth-wheel', 'Пето колело', 5),
  ('Pop-Up Campers', 'rvs-popup', 'Сгъваеми кемпери', 6),
  ('Truck Campers', 'rvs-truck', 'Кемпери за пикапи', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'vehicles-rvs'
ON CONFLICT (slug) DO NOTHING;;
