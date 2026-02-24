
-- L3 for Fitness
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Treadmills', 'Бягащи пътеки', 'fit-treadmill', id, 1 FROM categories WHERE slug = 'fitness'
UNION ALL
SELECT 'Exercise Bikes', 'Велоергометри', 'fit-bike', id, 2 FROM categories WHERE slug = 'fitness'
UNION ALL
SELECT 'Dumbbells & Weights', 'Дъмбели и тежести', 'fit-weights', id, 3 FROM categories WHERE slug = 'fitness'
UNION ALL
SELECT 'Yoga & Pilates', 'Йога и пилатес', 'fit-yoga', id, 4 FROM categories WHERE slug = 'fitness'
UNION ALL
SELECT 'Resistance Bands', 'Ластици', 'fit-bands', id, 5 FROM categories WHERE slug = 'fitness'
UNION ALL
SELECT 'Fitness Trackers', 'Фитнес тракери', 'fit-trackers', id, 6 FROM categories WHERE slug = 'fitness';

-- L3 for Cycling
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Road Bikes', 'Шосейни велосипеди', 'bike-road', id, 1 FROM categories WHERE slug = 'cycling'
UNION ALL
SELECT 'Mountain Bikes', 'Планински велосипеди', 'bike-mountain', id, 2 FROM categories WHERE slug = 'cycling'
UNION ALL
SELECT 'Electric Bikes', 'Електрически велосипеди', 'bike-electric', id, 3 FROM categories WHERE slug = 'cycling'
UNION ALL
SELECT 'City Bikes', 'Градски велосипеди', 'bike-city', id, 4 FROM categories WHERE slug = 'cycling'
UNION ALL
SELECT 'Kids Bikes', 'Детски велосипеди', 'bike-kids-cycle', id, 5 FROM categories WHERE slug = 'cycling'
UNION ALL
SELECT 'Bike Components', 'Части за велосипеди', 'bike-components', id, 6 FROM categories WHERE slug = 'cycling'
UNION ALL
SELECT 'Cycling Gear', 'Аксесоари за колоездене', 'bike-gear', id, 7 FROM categories WHERE slug = 'cycling';

-- L3 for Outdoor (camping/hiking)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Tents', 'Палатки', 'camp-tents', id, 1 FROM categories WHERE slug = 'camping-hiking'
UNION ALL
SELECT 'Sleeping Bags', 'Спални чували', 'camp-sleeping', id, 2 FROM categories WHERE slug = 'camping-hiking'
UNION ALL
SELECT 'Hiking Backpacks', 'Туристически раници', 'camp-backpacks', id, 3 FROM categories WHERE slug = 'camping-hiking'
UNION ALL
SELECT 'Hiking Boots', 'Туристически обувки', 'camp-boots', id, 4 FROM categories WHERE slug = 'camping-hiking'
UNION ALL
SELECT 'Camping Furniture', 'Къмпинг мебели', 'camp-furniture', id, 5 FROM categories WHERE slug = 'camping-hiking'
UNION ALL
SELECT 'Camping Cooking', 'Къмпинг готвене', 'camp-cooking', id, 6 FROM categories WHERE slug = 'camping-hiking';
;
