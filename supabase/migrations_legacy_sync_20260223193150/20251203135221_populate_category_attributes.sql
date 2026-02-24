
-- ============================================
-- POPULATE CATEGORY_ATTRIBUTES
-- This is the CORE of the filtering system
-- ============================================

-- GLOBAL ATTRIBUTES (apply to all/most products)
-- We'll use NULL category_id for global attributes

-- Condition (universal)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES (NULL, 'Condition', 'Състояние', 'select', true, true, 
  '["New", "Like New", "Very Good", "Good", "Acceptable", "For Parts"]'::jsonb,
  '["Ново", "Като ново", "Много добро", "Добро", "Приемливо", "За части"]'::jsonb,
  1
);

-- Brand (universal)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES (NULL, 'Brand', 'Марка', 'text', false, true, '[]'::jsonb, '[]'::jsonb, 2);

-- ELECTRONICS ATTRIBUTES
-- Get Electronics category ID
WITH elec AS (SELECT id FROM categories WHERE slug = 'electronics')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT elec.id, 'Storage Capacity', 'Капацитет', 'select', false, true,
  '["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB"]'::jsonb,
  '["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB"]'::jsonb,
  10
FROM elec;

WITH elec AS (SELECT id FROM categories WHERE slug = 'electronics')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT elec.id, 'Color', 'Цвят', 'select', false, true,
  '["Black", "White", "Silver", "Gold", "Blue", "Red", "Green", "Pink", "Purple", "Gray"]'::jsonb,
  '["Черен", "Бял", "Сребрист", "Златен", "Син", "Червен", "Зелен", "Розов", "Лилав", "Сив"]'::jsonb,
  11
FROM elec;

WITH elec AS (SELECT id FROM categories WHERE slug = 'electronics')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT elec.id, 'Screen Size', 'Размер на екрана', 'select', false, true,
  '["Under 5\"", "5-6\"", "6-7\"", "7-10\"", "10-13\"", "13-15\"", "15-17\"", "17\"+"]'::jsonb,
  '["Под 5\"", "5-6\"", "6-7\"", "7-10\"", "10-13\"", "13-15\"", "15-17\"", "17\"+"]'::jsonb,
  12
FROM elec;

-- SMARTPHONES specific
WITH phones AS (SELECT id FROM categories WHERE slug = 'smartphones')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT phones.id, 'Operating System', 'Операционна система', 'select', false, true,
  '["iOS", "Android", "Other"]'::jsonb,
  '["iOS", "Android", "Друга"]'::jsonb,
  20
FROM phones;

WITH phones AS (SELECT id FROM categories WHERE slug = 'smartphones')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT phones.id, 'RAM', 'RAM памет', 'select', false, true,
  '["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"]'::jsonb,
  '["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"]'::jsonb,
  21
FROM phones;

WITH phones AS (SELECT id FROM categories WHERE slug = 'smartphones')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT phones.id, 'Network', 'Мрежа', 'select', false, true,
  '["5G", "4G LTE", "3G", "Unlocked"]'::jsonb,
  '["5G", "4G LTE", "3G", "Отключен"]'::jsonb,
  22
FROM phones;

-- COMPUTERS / LAPTOPS
WITH laptops AS (SELECT id FROM categories WHERE slug = 'laptops')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT laptops.id, 'Processor Type', 'Тип процесор', 'select', false, true,
  '["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3"]'::jsonb,
  '["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3"]'::jsonb,
  30
FROM laptops;

WITH laptops AS (SELECT id FROM categories WHERE slug = 'laptops')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT laptops.id, 'RAM', 'RAM памет', 'select', false, true,
  '["4GB", "8GB", "16GB", "32GB", "64GB"]'::jsonb,
  '["4GB", "8GB", "16GB", "32GB", "64GB"]'::jsonb,
  31
FROM laptops;

WITH laptops AS (SELECT id FROM categories WHERE slug = 'laptops')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT laptops.id, 'Graphics Card', 'Видео карта', 'select', false, true,
  '["Integrated", "NVIDIA GeForce GTX", "NVIDIA GeForce RTX", "AMD Radeon", "Apple GPU"]'::jsonb,
  '["Интегрирана", "NVIDIA GeForce GTX", "NVIDIA GeForce RTX", "AMD Radeon", "Apple GPU"]'::jsonb,
  32
FROM laptops;

WITH laptops AS (SELECT id FROM categories WHERE slug = 'laptops')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT laptops.id, 'Use Case', 'Предназначение', 'multiselect', false, true,
  '["Gaming", "Business", "Student", "Creative", "Everyday"]'::jsonb,
  '["Геймърски", "Бизнес", "Студентски", "Креативен", "Ежедневен"]'::jsonb,
  33
FROM laptops;

-- AUTOMOTIVE / VEHICLES
WITH vehicles AS (SELECT id FROM categories WHERE slug = 'vehicles')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT vehicles.id, 'Make', 'Марка', 'text', true, true, '[]'::jsonb, '[]'::jsonb, 40
FROM vehicles;

WITH vehicles AS (SELECT id FROM categories WHERE slug = 'vehicles')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT vehicles.id, 'Model', 'Модел', 'text', true, true, '[]'::jsonb, '[]'::jsonb, 41
FROM vehicles;

WITH vehicles AS (SELECT id FROM categories WHERE slug = 'vehicles')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT vehicles.id, 'Year', 'Година', 'number', true, true, '[]'::jsonb, '[]'::jsonb, 42
FROM vehicles;

WITH vehicles AS (SELECT id FROM categories WHERE slug = 'vehicles')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT vehicles.id, 'Fuel Type', 'Гориво', 'select', false, true,
  '["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid", "LPG", "CNG"]'::jsonb,
  '["Бензин", "Дизел", "Електрически", "Хибрид", "Plug-in хибрид", "LPG", "Метан"]'::jsonb,
  43
FROM vehicles;

WITH vehicles AS (SELECT id FROM categories WHERE slug = 'vehicles')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT vehicles.id, 'Transmission', 'Скоростна кутия', 'select', false, true,
  '["Manual", "Automatic", "Semi-Automatic", "CVT"]'::jsonb,
  '["Ръчна", "Автоматична", "Полуавтоматична", "CVT"]'::jsonb,
  44
FROM vehicles;

WITH vehicles AS (SELECT id FROM categories WHERE slug = 'vehicles')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT vehicles.id, 'Mileage', 'Километраж', 'number', false, true, '[]'::jsonb, '[]'::jsonb, 45
FROM vehicles;

WITH vehicles AS (SELECT id FROM categories WHERE slug = 'vehicles')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT vehicles.id, 'Body Type', 'Тип каросерия', 'select', false, true,
  '["Sedan", "Hatchback", "Wagon", "SUV", "Coupe", "Convertible", "Pickup", "Van", "Minivan"]'::jsonb,
  '["Седан", "Хечбек", "Комби", "Джип/SUV", "Купе", "Кабрио", "Пикап", "Ван", "Миниван"]'::jsonb,
  46
FROM vehicles;

-- FASHION
WITH fashion AS (SELECT id FROM categories WHERE slug = 'fashion')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT fashion.id, 'Size', 'Размер', 'select', false, true,
  '["XS", "S", "M", "L", "XL", "XXL", "XXXL"]'::jsonb,
  '["XS", "S", "M", "L", "XL", "XXL", "XXXL"]'::jsonb,
  50
FROM fashion;

WITH fashion AS (SELECT id FROM categories WHERE slug = 'fashion')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT fashion.id, 'Color', 'Цвят', 'select', false, true,
  '["Black", "White", "Blue", "Red", "Green", "Yellow", "Pink", "Purple", "Brown", "Gray", "Beige", "Multi"]'::jsonb,
  '["Черен", "Бял", "Син", "Червен", "Зелен", "Жълт", "Розов", "Лилав", "Кафяв", "Сив", "Бежов", "Многоцветен"]'::jsonb,
  51
FROM fashion;

WITH fashion AS (SELECT id FROM categories WHERE slug = 'fashion')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT fashion.id, 'Material', 'Материал', 'select', false, true,
  '["Cotton", "Polyester", "Wool", "Silk", "Leather", "Denim", "Linen", "Synthetic"]'::jsonb,
  '["Памук", "Полиестер", "Вълна", "Коприна", "Кожа", "Деним", "Лен", "Синтетика"]'::jsonb,
  52
FROM fashion;

WITH fashion AS (SELECT id FROM categories WHERE slug = 'fashion')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT fashion.id, 'Gender', 'Пол', 'select', false, true,
  '["Men", "Women", "Unisex", "Boys", "Girls"]'::jsonb,
  '["Мъжки", "Женски", "Унисекс", "Момчета", "Момичета"]'::jsonb,
  53
FROM fashion;

-- GAMING
WITH gaming AS (SELECT id FROM categories WHERE slug = 'gaming')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT gaming.id, 'Platform', 'Платформа', 'multiselect', false, true,
  '["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "Mobile"]'::jsonb,
  '["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "Мобилни"]'::jsonb,
  60
FROM gaming;

WITH gaming AS (SELECT id FROM categories WHERE slug = 'gaming')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT gaming.id, 'Game Genre', 'Жанр', 'multiselect', false, true,
  '["Action", "Adventure", "RPG", "Sports", "Racing", "Shooter", "Strategy", "Simulation", "Fighting", "Horror"]'::jsonb,
  '["Екшън", "Приключенска", "RPG", "Спортна", "Състезателна", "Шутър", "Стратегия", "Симулатор", "Бойна", "Ужаси"]'::jsonb,
  61
FROM gaming;

-- HOME & KITCHEN
WITH home AS (SELECT id FROM categories WHERE slug = 'home')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT home.id, 'Room', 'Стая', 'multiselect', false, true,
  '["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Outdoor", "Garage"]'::jsonb,
  '["Хол", "Спалня", "Кухня", "Баня", "Офис", "Външно", "Гараж"]'::jsonb,
  70
FROM home;

WITH home AS (SELECT id FROM categories WHERE slug = 'home')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT home.id, 'Material', 'Материал', 'select', false, true,
  '["Wood", "Metal", "Glass", "Plastic", "Fabric", "Leather", "Stone", "Ceramic"]'::jsonb,
  '["Дърво", "Метал", "Стъкло", "Пластмаса", "Плат", "Кожа", "Камък", "Керамика"]'::jsonb,
  71
FROM home;

WITH home AS (SELECT id FROM categories WHERE slug = 'home')
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT home.id, 'Style', 'Стил', 'select', false, true,
  '["Modern", "Classic", "Minimalist", "Industrial", "Scandinavian", "Bohemian", "Rustic"]'::jsonb,
  '["Модерен", "Класически", "Минималистичен", "Индустриален", "Скандинавски", "Бохо", "Рустик"]'::jsonb,
  72
FROM home;
;
