-- Restore more L3 categories for Vehicles, Real Estate, Beauty

-- Vehicles L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Cars subcategories (by body type)
  ('Sedans', 'sedans', 'Седани', 'cars', 1),
  ('SUVs', 'suvs', 'SUV', 'cars', 2),
  ('Hatchbacks', 'hatchbacks', 'Хетчбеци', 'cars', 3),
  ('Coupes', 'coupes', 'Купета', 'cars', 4),
  ('Wagons', 'wagons', 'Комби', 'cars', 5),
  ('Convertibles', 'convertibles', 'Кабриолети', 'cars', 6),
  ('Trucks', 'trucks-cars', 'Пикапи', 'cars', 7),
  ('Vans & Minivans', 'vans-minivans', 'Вани и минивани', 'cars', 8),
  ('Electric Cars', 'electric-cars', 'Електрически коли', 'cars', 9),
  ('Hybrid Cars', 'hybrid-cars', 'Хибридни коли', 'cars', 10),
  
  -- Motorcycles subcategories
  ('Sport Bikes', 'sport-bikes', 'Спортни мотори', 'motorcycles', 1),
  ('Cruisers', 'cruisers', 'Крузъри', 'motorcycles', 2),
  ('Touring Bikes', 'touring-bikes', 'Туристически мотори', 'motorcycles', 3),
  ('Dual Sport', 'dual-sport', 'Двоен спорт', 'motorcycles', 4),
  ('Scooters', 'scooters-cat', 'Скутери', 'motorcycles', 5),
  ('ATVs', 'atvs', 'АТВ', 'motorcycles', 6),
  ('Electric Motorcycles', 'electric-motorcycles', 'Електрически мотори', 'motorcycles', 7),
  
  -- Auto Parts subcategories
  ('Engine Parts', 'engine-parts', 'Части за двигател', 'auto-parts', 1),
  ('Brakes & Suspension', 'brakes-suspension', 'Спирачки и окачване', 'auto-parts', 2),
  ('Exterior Parts', 'exterior-parts', 'Външни части', 'auto-parts', 3),
  ('Interior Parts', 'interior-parts', 'Вътрешни части', 'auto-parts', 4),
  ('Wheels & Tires', 'wheels-tires', 'Джанти и гуми', 'auto-parts', 5),
  ('Lighting', 'auto-lighting', 'Осветление', 'auto-parts', 6),
  ('Electronics Auto', 'auto-electronics', 'Електроника', 'auto-parts', 7),
  ('Oil & Fluids', 'oil-fluids', 'Масла и течности', 'auto-parts', 8)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;

-- Real Estate L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Sale subcategories
  ('Apartments for Sale', 'apartments-sale', 'Апартаменти за продажба', 'real-estate-sale', 1),
  ('Houses for Sale', 'houses-sale', 'Къщи за продажба', 'real-estate-sale', 2),
  ('Villas for Sale', 'villas-sale', 'Вили за продажба', 'real-estate-sale', 3),
  ('Studios for Sale', 'studios-sale', 'Студиа за продажба', 'real-estate-sale', 4),
  ('Land for Sale', 'land-sale', 'Парцели за продажба', 'real-estate-sale', 5),
  ('Commercial for Sale', 'commercial-sale', 'Търговски имоти', 'real-estate-sale', 6),
  ('Garages for Sale', 'garages-sale', 'Гаражи за продажба', 'real-estate-sale', 7),
  
  -- Rent subcategories
  ('Apartments for Rent', 'apartments-rent', 'Апартаменти под наем', 'real-estate-rent', 1),
  ('Houses for Rent', 'houses-rent', 'Къщи под наем', 'real-estate-rent', 2),
  ('Rooms for Rent', 'rooms-rent', 'Стаи под наем', 'real-estate-rent', 3),
  ('Studios for Rent', 'studios-rent', 'Студиа под наем', 'real-estate-rent', 4),
  ('Offices for Rent', 'offices-rent', 'Офиси под наем', 'real-estate-rent', 5),
  ('Commercial for Rent', 'commercial-rent', 'Търговски помещения', 'real-estate-rent', 6),
  ('Garages for Rent', 'garages-rent', 'Гаражи под наем', 'real-estate-rent', 7)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;

-- Beauty L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, (SELECT id FROM categories WHERE slug = v.parent_slug), v.display_order
FROM (VALUES
  -- Skincare subcategories
  ('Cleansers', 'cleansers', 'Почистващи продукти', 'skincare', 1),
  ('Moisturizers', 'moisturizers', 'Хидратанти', 'skincare', 2),
  ('Serums', 'serums', 'Серуми', 'skincare', 3),
  ('Sunscreen', 'sunscreen', 'Слънцезащита', 'skincare', 4),
  ('Face Masks', 'face-masks', 'Маски за лице', 'skincare', 5),
  ('Eye Care', 'eye-care', 'Грижа за очи', 'skincare', 6),
  ('Acne Treatment', 'acne-treatment', 'Против акне', 'skincare', 7),
  ('Anti-Aging', 'anti-aging', 'Анти-ейджинг', 'skincare', 8),
  
  -- Makeup subcategories
  ('Foundation', 'foundation', 'Фон дьо тен', 'makeup', 1),
  ('Concealer', 'concealer', 'Коректор', 'makeup', 2),
  ('Powder', 'powder', 'Пудра', 'makeup', 3),
  ('Blush', 'blush', 'Руж', 'makeup', 4),
  ('Bronzer & Highlighter', 'bronzer-highlighter', 'Бронзър и хайлайтър', 'makeup', 5),
  ('Eye Makeup', 'eye-makeup', 'Грим за очи', 'makeup', 6),
  ('Lip Makeup', 'lip-makeup', 'Грим за устни', 'makeup', 7),
  ('Makeup Brushes', 'makeup-brushes', 'Четки за грим', 'makeup', 8),
  ('Makeup Sets', 'makeup-sets', 'Комплекти за грим', 'makeup', 9),
  
  -- Hair Care subcategories
  ('Shampoo', 'shampoo', 'Шампоани', 'hair-care', 1),
  ('Conditioner', 'conditioner', 'Балсами', 'hair-care', 2),
  ('Hair Masks', 'hair-masks', 'Маски за коса', 'hair-care', 3),
  ('Hair Styling', 'hair-styling', 'Стилизиране', 'hair-care', 4),
  ('Hair Color', 'hair-color', 'Боя за коса', 'hair-care', 5),
  ('Hair Tools', 'hair-tools', 'Инструменти за коса', 'hair-care', 6),
  ('Hair Extensions', 'hair-extensions', 'Удължения за коса', 'hair-care', 7),
  
  -- Fragrances subcategories
  ('Men''s Fragrances', 'mens-fragrances', 'Мъжки парфюми', 'fragrances', 1),
  ('Women''s Fragrances', 'womens-fragrances', 'Дамски парфюми', 'fragrances', 2),
  ('Unisex Fragrances', 'unisex-fragrances', 'Унисекс парфюми', 'fragrances', 3),
  ('Body Sprays', 'body-sprays', 'Спрейове за тяло', 'fragrances', 4),
  ('Perfume Sets', 'perfume-sets', 'Комплекти парфюми', 'fragrances', 5)
) AS v(name, slug, name_bg, parent_slug, display_order)
ON CONFLICT (slug) DO NOTHING;;
