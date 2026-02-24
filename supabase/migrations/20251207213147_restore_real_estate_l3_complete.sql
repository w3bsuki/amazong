-- Restore Real Estate L3 categories

-- Residential Sale L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Single Family Homes', 'sale-single-family', 'Еднофамилни къщи', 1),
  ('Apartments', 'sale-apartments', 'Апартаменти', 2),
  ('Condos', 'sale-condos', 'Кондоминиуми', 3),
  ('Townhouses', 'sale-townhouses', 'Редови къщи', 4),
  ('Villas', 'sale-villas', 'Вили', 5),
  ('Penthouses', 'sale-penthouses', 'Пентхауси', 6),
  ('Duplexes', 'sale-duplexes', 'Дуплекси', 7),
  ('New Construction', 'sale-new-construction', 'Ново строителство', 8),
  ('Foreclosures', 'sale-foreclosures', 'Възбрана', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'real-estate-sale'
ON CONFLICT (slug) DO NOTHING;

-- Residential Rent L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Apartment Rentals', 'rent-apartments', 'Апартаменти под наем', 1),
  ('House Rentals', 'rent-houses', 'Къщи под наем', 2),
  ('Studio Rentals', 'rent-studios', 'Студиа под наем', 3),
  ('Room Rentals', 'rent-rooms', 'Стаи под наем', 4),
  ('Furnished Rentals', 'rent-furnished', 'Обзаведени имоти', 5),
  ('Short Term Rentals', 'rent-short-term', 'Краткосрочен наем', 6),
  ('Student Housing', 'rent-student', 'Студентско жилище', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'real-estate-rent'
ON CONFLICT (slug) DO NOTHING;

-- Commercial Real Estate L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Office Space', 'commercial-office', 'Офис площи', 1),
  ('Retail Space', 'commercial-retail', 'Търговски площи', 2),
  ('Warehouses', 'commercial-warehouses', 'Складове', 3),
  ('Industrial', 'commercial-industrial', 'Индустриални', 4),
  ('Restaurant Space', 'commercial-restaurant', 'Ресторантски площи', 5),
  ('Medical Office', 'commercial-medical', 'Медицински офиси', 6),
  ('Coworking Space', 'commercial-coworking', 'Коуъркинг', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'real-estate-commercial'
ON CONFLICT (slug) DO NOTHING;

-- Land L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Building Lots', 'land-building', 'Парцели за строеж', 1),
  ('Agricultural Land', 'land-agricultural', 'Земеделска земя', 2),
  ('Farmland', 'land-farm', 'Ферми', 3),
  ('Development Land', 'land-development', 'За развитие', 4),
  ('Recreational Land', 'land-recreational', 'За отдих', 5),
  ('Wooded Land', 'land-wooded', 'Гориста', 6),
  ('Waterfront Land', 'land-waterfront', 'На брега', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'real-estate-land'
ON CONFLICT (slug) DO NOTHING;

-- Vacation Rentals L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Beach Houses', 'vacation-beach', 'Плажни къщи', 1),
  ('Mountain Cabins', 'vacation-mountain', 'Планински къщи', 2),
  ('Lake Houses', 'vacation-lake', 'Къщи на езеро', 3),
  ('City Apartments', 'vacation-city', 'Градски апартаменти', 4),
  ('Ski Chalets', 'vacation-ski', 'Ски шалети', 5),
  ('Countryside Villas', 'vacation-countryside', 'Селски вили', 6),
  ('Island Rentals', 'vacation-island', 'Островни имоти', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'real-estate-vacation'
ON CONFLICT (slug) DO NOTHING;;
