
-- L3 for Cars
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Седани', 'Седани', 'cars-sedan', id, 1 FROM categories WHERE slug = 'cars'
UNION ALL
SELECT 'Хечбеци', 'Хечбеци', 'cars-hatchback', id, 2 FROM categories WHERE slug = 'cars'
UNION ALL
SELECT 'Комбита', 'Комбита', 'cars-wagon', id, 3 FROM categories WHERE slug = 'cars'
UNION ALL
SELECT 'Купета', 'Купета', 'cars-coupe', id, 4 FROM categories WHERE slug = 'cars'
UNION ALL
SELECT 'Кабриолети', 'Кабриолети', 'cars-convertible', id, 5 FROM categories WHERE slug = 'cars'
UNION ALL
SELECT 'Electric Cars', 'Електромобили', 'cars-electric', id, 6 FROM categories WHERE slug = 'cars';

-- L3 for Motorcycles
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Sport Bikes', 'Спортни мотори', 'moto-sport', id, 1 FROM categories WHERE slug = 'motorcycles'
UNION ALL
SELECT 'Cruisers', 'Круизъри', 'moto-cruiser', id, 2 FROM categories WHERE slug = 'motorcycles'
UNION ALL
SELECT 'Touring', 'Туристически', 'moto-touring', id, 3 FROM categories WHERE slug = 'motorcycles'
UNION ALL
SELECT 'Enduro/Off-Road', 'Ендуро', 'moto-enduro', id, 4 FROM categories WHERE slug = 'motorcycles'
UNION ALL
SELECT 'Scooters', 'Скутери', 'moto-scooter', id, 5 FROM categories WHERE slug = 'motorcycles'
UNION ALL
SELECT 'Electric Motorcycles', 'Електрически мотори', 'moto-electric', id, 6 FROM categories WHERE slug = 'motorcycles';

-- L3 for Engine Parts
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Oil Filters', 'Маслени филтри', 'engine-oil-filters', id, 1 FROM categories WHERE slug = 'engine-parts'
UNION ALL
SELECT 'Air Filters', 'Въздушни филтри', 'engine-air-filters', id, 2 FROM categories WHERE slug = 'engine-parts'
UNION ALL
SELECT 'Spark Plugs', 'Свещи', 'engine-spark-plugs', id, 3 FROM categories WHERE slug = 'engine-parts'
UNION ALL
SELECT 'Belts & Hoses', 'Ремъци и маркучи', 'engine-belts', id, 4 FROM categories WHERE slug = 'engine-parts'
UNION ALL
SELECT 'Gaskets', 'Уплътнения', 'engine-gaskets', id, 5 FROM categories WHERE slug = 'engine-parts'
UNION ALL
SELECT 'Turbo Parts', 'Турбо части', 'engine-turbo', id, 6 FROM categories WHERE slug = 'engine-parts';

-- L3 for Wheels & Tires
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Summer Tires', 'Летни гуми', 'tires-summer', id, 1 FROM categories WHERE slug = 'wheels-tires'
UNION ALL
SELECT 'Winter Tires', 'Зимни гуми', 'tires-winter', id, 2 FROM categories WHERE slug = 'wheels-tires'
UNION ALL
SELECT 'All-Season Tires', 'Всесезонни гуми', 'tires-allseason', id, 3 FROM categories WHERE slug = 'wheels-tires'
UNION ALL
SELECT 'Alloy Wheels', 'Алуминиеви джанти', 'wheels-alloy', id, 4 FROM categories WHERE slug = 'wheels-tires'
UNION ALL
SELECT 'Steel Wheels', 'Стоманени джанти', 'wheels-steel', id, 5 FROM categories WHERE slug = 'wheels-tires'
UNION ALL
SELECT 'Wheel Accessories', 'Аксесоари за джанти', 'wheels-accessories', id, 6 FROM categories WHERE slug = 'wheels-tires';
;
