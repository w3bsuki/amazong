
-- Phase 3.1 Automotive Attributes for L1 categories

-- Auto Services attributes (parent: auto-services)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'auto-services'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Service Type', 'Тип услуга', 'select', true, '["Repair","Maintenance","Detailing","Tires","Body Work","Glass","Inspection","Towing"]', '["Ремонт","Поддръжка","Детайлинг","Гуми","Тенекиджийски","Стъкло","Преглед","Теглене"]', 1),
  ('Vehicle Type', 'Тип автомобил', 'select', false, '["Car","Truck","SUV","Van","Motorcycle","RV","Commercial"]', '["Кола","Пикап","Джип","Ван","Мотоциклет","Кемпер","Товарен"]', 2),
  ('Urgency', 'Спешност', 'select', false, '["Same Day","Next Day","Scheduled","Emergency 24/7"]', '["Същия ден","Следващ ден","По уговорка","Спешно 24/7"]', 3),
  ('Warranty', 'Гаранция', 'select', false, '["No Warranty","30 Days","90 Days","6 Months","1 Year","2+ Years"]', '["Без гаранция","30 дни","90 дни","6 месеца","1 година","2+ години"]', 4),
  ('Price Range', 'Ценови диапазон', 'select', false, '["Budget","Standard","Premium","Luxury"]', '["Бюджетен","Стандартен","Премиум","Луксозен"]', 5)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Car Accessories attributes (parent: auto-accessories)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'auto-accessories'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Accessory Type', 'Тип аксесоар', 'select', true, '["Interior","Exterior","Safety","Electronics","Comfort","Storage"]', '["Интериорни","Екстериорни","Безопасност","Електроника","Комфорт","Съхранение"]', 1),
  ('Compatibility', 'Съвместимост', 'select', false, '["Universal","Vehicle-Specific","Brand-Specific"]', '["Универсални","За конкретен модел","За конкретна марка"]', 2),
  ('Material', 'Материал', 'select', false, '["Plastic","Rubber","Leather","Fabric","Metal","Carbon Fiber"]', '["Пластмаса","Гума","Кожа","Плат","Метал","Карбон"]', 3),
  ('Installation', 'Монтаж', 'select', false, '["DIY Easy","DIY Moderate","Professional Required"]', '["Лесен DIY","Среден DIY","Професионален"]', 4),
  ('Color', 'Цвят', 'select', false, '["Black","Gray","Beige","Brown","Red","Blue","Custom"]', '["Черно","Сиво","Бежово","Кафяво","Червено","Синьо","По избор"]', 5),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Good","Acceptable"]', '["Ново","Като ново","Добро","Приемливо"]', 6)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- E-Bikes attributes (parent: e-bikes-cat)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'e-bikes-cat'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('E-Bike Type', 'Тип e-bike', 'select', true, '["City","Mountain","Road","Folding","Cargo","Fat Tire"]', '["Градски","Планински","Шосеен","Сгъваем","Карго","Дебели гуми"]', 1),
  ('Motor Power', 'Мощност мотор', 'select', true, '["250W","350W","500W","750W","1000W","1500W+"]', '["250W","350W","500W","750W","1000W","1500W+"]', 2),
  ('Battery Capacity', 'Капацитет батерия', 'select', true, '["Under 300Wh","300-500Wh","500-700Wh","700-1000Wh","1000Wh+"]', '["Под 300Wh","300-500Wh","500-700Wh","700-1000Wh","1000Wh+"]', 3),
  ('Range', 'Пробег', 'select', false, '["Under 30km","30-50km","50-80km","80-120km","120km+"]', '["Под 30км","30-50км","50-80км","80-120км","120км+"]', 4),
  ('Frame Size', 'Размер рамка', 'select', false, '["XS","S","M","L","XL","Step-Through"]', '["XS","S","M","L","XL","Ниска рамка"]', 5),
  ('Motor Position', 'Позиция мотор', 'select', false, '["Front Hub","Rear Hub","Mid-Drive"]', '["Предна главина","Задна главина","Централен"]', 6),
  ('Max Speed', 'Макс. скорост', 'select', false, '["25 km/h","32 km/h","45 km/h","Unlimited"]', '["25 км/ч","32 км/ч","45 км/ч","Без ограничение"]', 7),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Good","Acceptable"]', '["Ново","Като ново","Добро","Приемливо"]', 8)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- E-Scooters attributes (parent: e-scooters)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'e-scooters'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Scooter Type', 'Тип тротинетка', 'select', true, '["Commuter","Performance","Off-Road","Kids","Seated"]', '["Комютърни","Спортни","Офроуд","Детски","Със седалка"]', 1),
  ('Motor Power', 'Мощност мотор', 'select', true, '["250W","350W","500W","800W","1000W","Dual Motor"]', '["250W","350W","500W","800W","1000W","Двоен мотор"]', 2),
  ('Battery Capacity', 'Капацитет батерия', 'select', false, '["Under 200Wh","200-400Wh","400-600Wh","600-1000Wh","1000Wh+"]', '["Под 200Wh","200-400Wh","400-600Wh","600-1000Wh","1000Wh+"]', 3),
  ('Range', 'Пробег', 'select', false, '["Under 15km","15-30km","30-50km","50-80km","80km+"]', '["Под 15км","15-30км","30-50км","50-80км","80км+"]', 4),
  ('Max Speed', 'Макс. скорост', 'select', false, '["20 km/h","25 km/h","30 km/h","40 km/h","50+ km/h"]', '["20 км/ч","25 км/ч","30 км/ч","40 км/ч","50+ км/ч"]', 5),
  ('Weight Capacity', 'Макс. тегло', 'select', false, '["Up to 80kg","Up to 100kg","Up to 120kg","Up to 150kg"]', '["До 80кг","До 100кг","До 120кг","До 150кг"]', 6),
  ('Folding', 'Сгъваема', 'select', false, '["Yes","No"]', '["Да","Не"]', 7),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Good","Acceptable"]', '["Ново","Като ново","Добро","Приемливо"]', 8)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Electric Vehicles attributes (parent: electric-vehicles)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'electric-vehicles'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('EV Type', 'Тип EV', 'select', true, '["BEV (Full Electric)","PHEV (Plug-in Hybrid)","Hybrid"]', '["BEV (Пълно електрически)","PHEV (Plug-in хибрид)","Хибрид"]', 1),
  ('Make', 'Марка', 'select', true, '["Tesla","BMW","Mercedes","Audi","Porsche","Volkswagen","Hyundai","Kia","Rivian","Lucid","Ford","Chevrolet","Toyota","Other"]', '["Tesla","BMW","Mercedes","Audi","Porsche","Volkswagen","Hyundai","Kia","Rivian","Lucid","Ford","Chevrolet","Toyota","Друга"]', 2),
  ('Body Type', 'Тип каросерия', 'select', true, '["Sedan","SUV","Truck","Van","Hatchback","Coupe"]', '["Седан","SUV","Пикап","Ван","Хечбек","Купе"]', 3),
  ('Range', 'Пробег', 'select', true, '["Under 200km","200-300km","300-400km","400-500km","500-600km","600km+"]', '["Под 200км","200-300км","300-400км","400-500км","500-600км","600км+"]', 4),
  ('Battery Capacity', 'Капацитет батерия', 'select', false, '["Under 40kWh","40-60kWh","60-80kWh","80-100kWh","100kWh+"]', '["Под 40kWh","40-60kWh","60-80kWh","80-100kWh","100kWh+"]', 5),
  ('Charging Speed', 'Скорост зареждане', 'select', false, '["Level 1 (120V)","Level 2 (240V)","DC Fast Charging","Supercharger"]', '["Level 1 (120V)","Level 2 (240V)","DC бързо","Supercharger"]', 6),
  ('Year', 'Година', 'select', false, '["2024","2023","2022","2021","2020","2019","2018","Older"]', '["2024","2023","2022","2021","2020","2019","2018","По-стара"]', 7),
  ('Mileage', 'Пробег км', 'select', false, '["Under 10,000","10,000-30,000","30,000-60,000","60,000-100,000","100,000+"]', '["Под 10,000","10,000-30,000","30,000-60,000","60,000-100,000","100,000+"]', 8),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Excellent","Good","Fair"]', '["Ново","Като ново","Отлично","Добро","Задоволително"]', 9)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- EV Chargers attributes (parent: ev-chargers)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'ev-chargers'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Charger Level', 'Ниво зарядно', 'select', true, '["Level 1 (120V)","Level 2 (240V)","Level 3 (DC Fast)"]', '["Level 1 (120V)","Level 2 (240V)","Level 3 (DC бързо)"]', 1),
  ('Charger Type', 'Тип зарядно', 'select', true, '["Home","Portable","Commercial","Universal"]', '["Домашно","Преносимо","Търговско","Универсално"]', 2),
  ('Connector Type', 'Тип конектор', 'select', true, '["J1772","CCS","CHAdeMO","Tesla/NACS","Type 2"]', '["J1772","CCS","CHAdeMO","Tesla/NACS","Type 2"]', 3),
  ('Power Output', 'Изходна мощност', 'select', false, '["3.3kW","7.2kW","11kW","22kW","50kW","150kW+"]', '["3.3kW","7.2kW","11kW","22kW","50kW","150kW+"]', 4),
  ('Cable Length', 'Дължина кабел', 'select', false, '["Under 3m","3-5m","5-7m","7m+"]', '["Под 3м","3-5м","5-7м","7м+"]', 5),
  ('Smart Features', 'Смарт функции', 'select', false, '["Basic","WiFi Connected","App Control","Load Balancing"]', '["Базови","WiFi","Апликация","Балансиране"]', 6),
  ('Installation', 'Монтаж', 'select', false, '["Plug-In","Hardwired"]', '["Plug-In","Стационарен"]', 7),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Good","Acceptable"]', '["Ново","Като ново","Добро","Приемливо"]', 8)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- EV Parts & Accessories attributes (parent: ev-parts)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'ev-parts'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Part Type', 'Тип част', 'select', true, '["Battery","Motor","Controller","Charger","Cables","Cooling","Interior","Exterior"]', '["Батерия","Мотор","Контролер","Зарядно","Кабели","Охлаждане","Интериор","Екстериор"]', 1),
  ('Vehicle Compatibility', 'Съвместимост', 'select', false, '["Tesla","BMW","Mercedes","Audi","VW","Universal","Other"]', '["Tesla","BMW","Mercedes","Audi","VW","Универсални","Други"]', 2),
  ('Part Condition', 'Състояние част', 'select', true, '["New OEM","New Aftermarket","Refurbished","Used"]', '["Ново OEM","Ново Aftermarket","Реновирано","Употребявано"]', 3),
  ('Warranty', 'Гаранция', 'select', false, '["No Warranty","30 Days","90 Days","1 Year","2+ Years"]', '["Без гаранция","30 дни","90 дни","1 година","2+ години"]', 4)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Vehicles attributes (parent: vehicles)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'vehicles'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Vehicle Type', 'Тип превозно средство', 'select', true, '["Car","Truck","SUV","Van","Motorcycle","ATV/UTV","Camper","Trailer","Classic"]', '["Кола","Пикап","Джип","Ван","Мотоциклет","ATV/UTV","Кемпер","Ремарке","Ретро"]', 1),
  ('Make', 'Марка', 'text', true, NULL, NULL, 2),
  ('Model', 'Модел', 'text', true, NULL, NULL, 3),
  ('Year', 'Година', 'select', true, '["2024","2023","2022","2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010","Older"]', '["2024","2023","2022","2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010","По-стара"]', 4),
  ('Fuel Type', 'Гориво', 'select', true, '["Gasoline","Diesel","Electric","Hybrid","Plug-in Hybrid","LPG","CNG"]', '["Бензин","Дизел","Електрически","Хибрид","Plug-in хибрид","LPG","CNG"]', 5),
  ('Transmission', 'Скоростна кутия', 'select', false, '["Manual","Automatic","CVT","DCT"]', '["Механична","Автоматична","CVT","DCT"]', 6),
  ('Mileage', 'Пробег', 'select', false, '["Under 10,000","10,000-30,000","30,000-60,000","60,000-100,000","100,000-150,000","150,000-200,000","200,000+"]', '["Под 10,000","10,000-30,000","30,000-60,000","60,000-100,000","100,000-150,000","150,000-200,000","200,000+"]', 7),
  ('Engine Size', 'Обем двигател', 'select', false, '["Under 1.0L","1.0-1.5L","1.5-2.0L","2.0-2.5L","2.5-3.0L","3.0-4.0L","4.0L+"]', '["Под 1.0L","1.0-1.5L","1.5-2.0L","2.0-2.5L","2.5-3.0L","3.0-4.0L","4.0L+"]', 8),
  ('Color', 'Цвят', 'select', false, '["Black","White","Silver","Gray","Red","Blue","Green","Brown","Beige","Other"]', '["Черно","Бяло","Сребристо","Сиво","Червено","Синьо","Зелено","Кафяво","Бежово","Друго"]', 9),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Excellent","Good","Fair","For Parts"]', '["Ново","Като ново","Отлично","Добро","Задоволително","За части"]', 10)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;
;
