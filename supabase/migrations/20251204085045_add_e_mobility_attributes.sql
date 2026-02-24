
-- ============================================
-- E-MOBILITY ATTRIBUTES (55 total)
-- ============================================

DO $$
DECLARE
  v_emobility_id UUID := '2ab6ebd1-f22d-4088-af7e-60b61a372903';
  v_escooters_id UUID;
  v_ebikes_id UUID;
  v_eboards_id UUID;
  v_hoverboards_id UUID;
  v_eunicycles_id UUID;
  v_egokarts_id UUID;
  v_accessories_id UUID;
  v_parts_id UUID;
  v_charging_id UUID;
BEGIN
  -- Get L1 category IDs
  SELECT id INTO v_escooters_id FROM categories WHERE slug = 'emob-escooters';
  SELECT id INTO v_ebikes_id FROM categories WHERE slug = 'emob-ebikes';
  SELECT id INTO v_eboards_id FROM categories WHERE slug = 'emob-eboards';
  SELECT id INTO v_hoverboards_id FROM categories WHERE slug = 'emob-hoverboards';
  SELECT id INTO v_eunicycles_id FROM categories WHERE slug = 'emob-eunicycles';
  SELECT id INTO v_egokarts_id FROM categories WHERE slug = 'emob-gokarts';
  SELECT id INTO v_accessories_id FROM categories WHERE slug = 'emob-accessories';
  SELECT id INTO v_parts_id FROM categories WHERE slug = 'emob-parts';
  SELECT id INTO v_charging_id FROM categories WHERE slug = 'emob-charging';

  -- ============================================
  -- GLOBAL E-MOBILITY ATTRIBUTES (applied to all e-mobility products)
  -- ============================================
  
  -- 1. Brand (global for all e-mobility)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'Brand', 'Марка', 'select', false, true,
    '["Xiaomi", "Segway-Ninebot", "Kaabo", "Dualtron", "Apollo", "VSETT", "Inokim", "Hiboy", "Gotrax", "Razor", "Bird", "Lime", "Boosted", "Evolve", "Meepo", "WowGo", "Exway", "Backfire", "Ownboard", "InMotion", "KingSong", "Gotway", "Veteran", "Leaperkim", "Bosch", "Bafang", "Shimano Steps", "Yamaha", "Giant", "Specialized", "Trek", "Haibike", "Cube", "Rad Power", "Juiced Bikes", "Aventon", "Lectric", "Velotric", "Super73", "Onyx", "Segway", "Onewheel", "Hover-1", "Swagtron", "Jetson", "Other"]'::jsonb,
    '["Xiaomi", "Segway-Ninebot", "Kaabo", "Dualtron", "Apollo", "VSETT", "Inokim", "Hiboy", "Gotrax", "Razor", "Bird", "Lime", "Boosted", "Evolve", "Meepo", "WowGo", "Exway", "Backfire", "Ownboard", "InMotion", "KingSong", "Gotway", "Veteran", "Leaperkim", "Bosch", "Bafang", "Shimano Steps", "Yamaha", "Giant", "Specialized", "Trek", "Haibike", "Cube", "Rad Power", "Juiced Bikes", "Aventon", "Lectric", "Velotric", "Super73", "Onyx", "Segway", "Onewheel", "Hover-1", "Swagtron", "Jetson", "Друга"]'::jsonb,
    1);

  -- 2. Motor Power (W)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'Motor Power', 'Мощност на мотора', 'select', false, true,
    '["Under 250W", "250W", "350W", "500W", "750W", "1000W", "1500W", "2000W", "2500W", "3000W", "4000W", "5000W+", "Dual Motor"]'::jsonb,
    '["Под 250W", "250W", "350W", "500W", "750W", "1000W", "1500W", "2000W", "2500W", "3000W", "4000W", "5000W+", "Двоен мотор"]'::jsonb,
    2);

  -- 3. Battery Capacity (Wh)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'Battery Capacity', 'Капацитет на батерията', 'select', false, true,
    '["Under 200Wh", "200-300Wh", "300-400Wh", "400-500Wh", "500-600Wh", "600-800Wh", "800-1000Wh", "1000-1500Wh", "1500-2000Wh", "2000Wh+"]'::jsonb,
    '["Под 200Wh", "200-300Wh", "300-400Wh", "400-500Wh", "500-600Wh", "600-800Wh", "800-1000Wh", "1000-1500Wh", "1500-2000Wh", "2000Wh+"]'::jsonb,
    3);

  -- 4. Range (km)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'Range', 'Обхват', 'select', false, true,
    '["Under 15km", "15-25km", "25-35km", "35-50km", "50-70km", "70-100km", "100-150km", "150km+"]'::jsonb,
    '["Под 15км", "15-25км", "25-35км", "35-50км", "50-70км", "70-100км", "100-150км", "150км+"]'::jsonb,
    4);

  -- 5. Max Speed (km/h)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'Max Speed', 'Максимална скорост', 'select', false, true,
    '["Under 20 km/h", "20-25 km/h", "25-30 km/h", "30-40 km/h", "40-50 km/h", "50-60 km/h", "60-80 km/h", "80-100 km/h", "100 km/h+"]'::jsonb,
    '["Под 20 км/ч", "20-25 км/ч", "25-30 км/ч", "30-40 км/ч", "40-50 км/ч", "50-60 км/ч", "60-80 км/ч", "80-100 км/ч", "100 км/ч+"]'::jsonb,
    5);

  -- 6. Max Load (kg)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'Max Load', 'Максимално натоварване', 'select', false, true,
    '["Under 50kg", "50-75kg", "75-100kg", "100-120kg", "120-150kg", "150kg+"]'::jsonb,
    '["Под 50кг", "50-75кг", "75-100кг", "100-120кг", "120-150кг", "150кг+"]'::jsonb,
    6);

  -- 7. Weight (kg) - of the device
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'Device Weight', 'Тегло на устройството', 'select', false, true,
    '["Under 10kg", "10-15kg", "15-20kg", "20-25kg", "25-30kg", "30-40kg", "40-50kg", "50kg+"]'::jsonb,
    '["Под 10кг", "10-15кг", "15-20кг", "20-25кг", "25-30кг", "30-40кг", "40-50кг", "50кг+"]'::jsonb,
    7);

  -- 8. Charging Time
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'Charging Time', 'Време за зареждане', 'select', false, true,
    '["Under 2 hours", "2-3 hours", "3-4 hours", "4-5 hours", "5-6 hours", "6-8 hours", "8-10 hours", "10+ hours"]'::jsonb,
    '["Под 2 часа", "2-3 часа", "3-4 часа", "4-5 часа", "5-6 часа", "6-8 часа", "8-10 часа", "10+ часа"]'::jsonb,
    8);

  -- 9. IP Rating (Water Resistance)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'IP Rating', 'IP рейтинг', 'select', false, true,
    '["Not Rated", "IP54", "IP55", "IP56", "IP65", "IP66", "IP67", "IP68"]'::jsonb,
    '["Без рейтинг", "IP54", "IP55", "IP56", "IP65", "IP66", "IP67", "IP68"]'::jsonb,
    9);

  -- 10. Foldable
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'Foldable', 'Сгъваем', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 10);

  -- 11. App Connectivity
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'App Connectivity', 'Свързване с приложение', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 11);

  -- 12. Color
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_emobility_id, 'Color', 'Цвят', 'select', false, true,
    '["Black", "White", "Gray", "Silver", "Red", "Blue", "Green", "Orange", "Yellow", "Pink", "Purple", "Gold", "Carbon", "Camo", "Other"]'::jsonb,
    '["Черен", "Бял", "Сив", "Сребърен", "Червен", "Син", "Зелен", "Оранжев", "Жълт", "Розов", "Лилав", "Златен", "Карбон", "Камуфлаж", "Друг"]'::jsonb,
    12);

  -- ============================================
  -- E-SCOOTER SPECIFIC ATTRIBUTES
  -- ============================================
  
  -- 13. Tire Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_escooters_id, 'Tire Type', 'Тип гуми', 'select', false, true,
    '["Solid (Honeycomb)", "Solid (Rubber)", "Pneumatic (Air)", "Tubeless", "Off-Road Knobby"]'::jsonb,
    '["Плътни (медена пита)", "Плътни (гума)", "Пневматични (въздух)", "Безкамерни", "Офроуд назъбени"]'::jsonb,
    20);

  -- 14. Tire Size (inches)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_escooters_id, 'Tire Size', 'Размер на гумите', 'select', false, true,
    '["6 inch", "8 inch", "8.5 inch", "10 inch", "10.5 inch", "11 inch", "12 inch", "13 inch+"]'::jsonb,
    '["6 инча", "8 инча", "8.5 инча", "10 инча", "10.5 инча", "11 инча", "12 инча", "13+ инча"]'::jsonb,
    21);

  -- 15. Suspension
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_escooters_id, 'Suspension', 'Окачване', 'select', false, true,
    '["None", "Front Only", "Rear Only", "Dual (Front & Rear)", "Full Suspension", "Adjustable"]'::jsonb,
    '["Няма", "Само предно", "Само задно", "Двойно (предно и задно)", "Пълно окачване", "Регулируемо"]'::jsonb,
    22);

  -- 16. Brake Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_escooters_id, 'Brake Type', 'Тип спирачки', 'multiselect', false, true,
    '["Electronic/Regenerative", "Disc Brake (Single)", "Disc Brake (Dual)", "Drum Brake", "Foot Brake", "Hydraulic Disc"]'::jsonb,
    '["Електронни/Регенеративни", "Дискова спирачка (единична)", "Дискова спирачка (двойна)", "Барабанна спирачка", "Крачна спирачка", "Хидравлична дискова"]'::jsonb,
    23);

  -- 17. Motor Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_escooters_id, 'Motor Type', 'Тип мотор', 'select', false, true,
    '["Single Hub Motor", "Dual Hub Motor", "Belt Drive", "Chain Drive"]'::jsonb,
    '["Единичен хъб мотор", "Двоен хъб мотор", "Ремъчен привод", "Верижен привод"]'::jsonb,
    24);

  -- 18. Has Seat
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_escooters_id, 'Has Seat', 'Има седалка', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 25);

  -- 19. Display Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_escooters_id, 'Display Type', 'Тип дисплей', 'select', false, true,
    '["None", "LED Basic", "LCD", "Color LCD", "OLED"]'::jsonb,
    '["Няма", "LED базов", "LCD", "Цветен LCD", "OLED"]'::jsonb,
    26);

  -- 20. Lights
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_escooters_id, 'Lights', 'Светлини', 'multiselect', false, true,
    '["Front Light", "Rear Light", "Brake Light", "Turn Signals", "Deck Lights", "Wheel Lights", "None"]'::jsonb,
    '["Предна светлина", "Задна светлина", "Стоп светлина", "Мигачи", "Светлини на платформата", "Светлини на колелата", "Няма"]'::jsonb,
    27);

  -- ============================================
  -- E-BIKE SPECIFIC ATTRIBUTES
  -- ============================================
  
  -- 21. E-Bike Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_ebikes_id, 'E-Bike Type', 'Тип електровелосипед', 'select', false, true,
    '["Pedal Assist (PAS)", "Throttle Only", "Pedal Assist + Throttle", "Speed Pedelec"]'::jsonb,
    '["С подпомагане при педалиране (PAS)", "Само с газ", "Подпомагане + газ", "Бърз педелек"]'::jsonb,
    30);

  -- 22. Motor Position
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_ebikes_id, 'Motor Position', 'Позиция на мотора', 'select', false, true,
    '["Front Hub", "Rear Hub", "Mid-Drive", "Dual Hub"]'::jsonb,
    '["Преден хъб", "Заден хъб", "Среднопоставен", "Двоен хъб"]'::jsonb,
    31);

  -- 23. Battery Position
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_ebikes_id, 'Battery Position', 'Позиция на батерията', 'select', false, true,
    '["Integrated Frame", "Rear Rack", "Downtube External", "Downtube Integrated", "Seat Post"]'::jsonb,
    '["Интегрирана в рамката", "Заден багажник", "Долна тръба (външна)", "Долна тръба (интегрирана)", "Седалкова тръба"]'::jsonb,
    32);

  -- 24. Frame Material
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_ebikes_id, 'Frame Material', 'Материал на рамката', 'select', false, true,
    '["Aluminum", "Carbon Fiber", "Steel", "Titanium", "Magnesium"]'::jsonb,
    '["Алуминий", "Карбон", "Стомана", "Титан", "Магнезий"]'::jsonb,
    33);

  -- 25. Frame Size
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_ebikes_id, 'Frame Size', 'Размер на рамката', 'select', false, true,
    '["XS (14-15\")", "S (15-16\")", "M (17-18\")", "L (19-20\")", "XL (21-22\")", "XXL (23\"+)", "One Size"]'::jsonb,
    '["XS (14-15\")", "S (15-16\")", "M (17-18\")", "L (19-20\")", "XL (21-22\")", "XXL (23\"+)", "Един размер"]'::jsonb,
    34);

  -- 26. Wheel Size
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_ebikes_id, 'Wheel Size', 'Размер на колелата', 'select', false, true,
    '["16\"", "20\"", "24\"", "26\"", "27.5\"", "29\"", "700c"]'::jsonb,
    '["16\"", "20\"", "24\"", "26\"", "27.5\"", "29\"", "700c"]'::jsonb,
    35);

  -- 27. Gears
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_ebikes_id, 'Gears', 'Скорости', 'select', false, true,
    '["Single Speed", "3 Speed", "7 Speed", "8 Speed", "9 Speed", "10 Speed", "11 Speed", "12 Speed", "Internal Hub"]'::jsonb,
    '["Една скорост", "3 скорости", "7 скорости", "8 скорости", "9 скорости", "10 скорости", "11 скорости", "12 скорости", "Вътрешна главина"]'::jsonb,
    36);

  -- 28. Pedal Assist Levels
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_ebikes_id, 'Pedal Assist Levels', 'Нива на подпомагане', 'select', false, true,
    '["3 Levels", "4 Levels", "5 Levels", "6+ Levels", "Customizable"]'::jsonb,
    '["3 нива", "4 нива", "5 нива", "6+ нива", "Персонализирани"]'::jsonb,
    37);

  -- 29. Step-Through Frame
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_ebikes_id, 'Step-Through Frame', 'Рамка с нисък преход', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 38);

  -- ============================================
  -- E-BOARD SPECIFIC ATTRIBUTES
  -- ============================================
  
  -- 30. Board Length
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eboards_id, 'Board Length', 'Дължина на дъската', 'select', false, true,
    '["Mini (Under 28\")", "Short (28-32\")", "Medium (32-38\")", "Long (38-42\")", "Extra Long (42\"+)"]'::jsonb,
    '["Мини (под 28\")", "Къса (28-32\")", "Средна (32-38\")", "Дълга (38-42\")", "Екстра дълга (42\"+)"]'::jsonb,
    40);

  -- 31. Drive System
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eboards_id, 'Drive System', 'Задвижваща система', 'select', false, true,
    '["Hub Motor", "Belt Drive", "Direct Drive", "Gear Drive"]'::jsonb,
    '["Хъб мотор", "Ремъчен привод", "Директен привод", "Зъбен привод"]'::jsonb,
    41);

  -- 32. Deck Material
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eboards_id, 'Deck Material', 'Материал на дъската', 'select', false, true,
    '["Maple Wood", "Bamboo", "Carbon Fiber", "Fiberglass", "Composite"]'::jsonb,
    '["Кленово дърво", "Бамбук", "Карбон", "Фибростъкло", "Композит"]'::jsonb,
    42);

  -- 33. Deck Flex
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eboards_id, 'Deck Flex', 'Гъвкавост на дъската', 'select', false, true,
    '["Stiff", "Medium", "Flexy", "Super Flexy"]'::jsonb,
    '["Твърда", "Средна", "Гъвкава", "Много гъвкава"]'::jsonb,
    43);

  -- 34. Wheel Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eboards_id, 'Wheel Type', 'Тип колела', 'select', false, true,
    '["Street (PU)", "All-Terrain (Pneumatic)", "Cloud Wheels", "Off-Road Knobby"]'::jsonb,
    '["Улични (PU)", "Всеки терен (пневматични)", "Облачни колела", "Офроуд назъбени"]'::jsonb,
    44);

  -- 35. Remote Control
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eboards_id, 'Remote Control', 'Дистанционно управление', 'select', false, true,
    '["Handheld Remote", "App Control", "No Remote (Onewheel)", "Wrist Remote"]'::jsonb,
    '["Ръчно дистанционно", "Чрез приложение", "Без дистанционно (Onewheel)", "Дистанционно за китка"]'::jsonb,
    45);

  -- ============================================
  -- HOVERBOARD SPECIFIC ATTRIBUTES
  -- ============================================
  
  -- 36. Wheel Size (Hoverboard)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_hoverboards_id, 'Wheel Size', 'Размер на колелата', 'select', false, true,
    '["4.5\"", "6.5\"", "8\"", "8.5\"", "10\"", "10.5\""]'::jsonb,
    '["4.5\"", "6.5\"", "8\"", "8.5\"", "10\"", "10.5\""]'::jsonb,
    50);

  -- 37. Self-Balancing Technology
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_hoverboards_id, 'Self-Balancing', 'Самобалансиране', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 51);

  -- 38. LED Lights
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_hoverboards_id, 'LED Lights', 'LED светлини', 'multiselect', false, true,
    '["Wheel Lights", "Front Lights", "Fender Lights", "RGB Lights", "None"]'::jsonb,
    '["Светлини на колелата", "Предни светлини", "Светлини на калниците", "RGB светлини", "Няма"]'::jsonb,
    52);

  -- 39. Bluetooth Speaker
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_hoverboards_id, 'Bluetooth Speaker', 'Bluetooth тонколона', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 53);

  -- 40. UL Certified
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_hoverboards_id, 'UL Certified', 'UL сертификат', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 54);

  -- ============================================
  -- E-UNICYCLE SPECIFIC ATTRIBUTES
  -- ============================================
  
  -- 41. Wheel Diameter
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eunicycles_id, 'Wheel Diameter', 'Диаметър на колелото', 'select', false, true,
    '["14\"", "16\"", "18\"", "20\"", "22\"", "24\""]'::jsonb,
    '["14\"", "16\"", "18\"", "20\"", "22\"", "24\""]'::jsonb,
    60);

  -- 42. Has Suspension (EUC)
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eunicycles_id, 'Has Suspension', 'Има окачване', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 61);

  -- 43. Pedal Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eunicycles_id, 'Pedal Type', 'Тип педали', 'select', false, true,
    '["Standard", "Spiked", "Extra Wide", "Honeycomb"]'::jsonb,
    '["Стандартни", "С шипове", "Екстра широки", "Медена пита"]'::jsonb,
    62);

  -- 44. Trolley Handle
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eunicycles_id, 'Trolley Handle', 'Дръжка за теглене', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 63);

  -- 45. Kickstand
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_eunicycles_id, 'Kickstand', 'Стойка', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 64);

  -- ============================================
  -- E-GO-KART SPECIFIC ATTRIBUTES
  -- ============================================
  
  -- 46. Age Range
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_egokarts_id, 'Age Range', 'Възрастова група', 'select', false, true,
    '["3-6 years", "6-10 years", "10-14 years", "14+ years", "Adults"]'::jsonb,
    '["3-6 години", "6-10 години", "10-14 години", "14+ години", "Възрастни"]'::jsonb,
    70);

  -- 47. Drift Capable
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_egokarts_id, 'Drift Capable', 'Способен да дрифти', 'boolean', false, true, '[]'::jsonb, '[]'::jsonb, 71);

  -- 48. Seat Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_egokarts_id, 'Seat Type', 'Тип седалка', 'select', false, true,
    '["Bucket Seat", "Racing Seat", "Adjustable Seat", "Fixed Seat"]'::jsonb,
    '["Спортна седалка", "Състезателна седалка", "Регулируема седалка", "Фиксирана седалка"]'::jsonb,
    72);

  -- ============================================
  -- ACCESSORIES SPECIFIC ATTRIBUTES
  -- ============================================
  
  -- 49. Compatibility
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_accessories_id, 'Compatibility', 'Съвместимост', 'multiselect', false, true,
    '["Universal", "E-Scooters", "E-Bikes", "E-Boards", "Hoverboards", "E-Unicycles", "Specific Brand"]'::jsonb,
    '["Универсален", "Електротротинетки", "Електровелосипеди", "Електро дъски", "Ховърборди", "Моноколела", "Конкретна марка"]'::jsonb,
    80);

  -- 50. Helmet Certification
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_accessories_id, 'Helmet Certification', 'Сертификат за каска', 'multiselect', false, true,
    '["CE EN1078", "CPSC", "ASTM", "Snell", "DOT", "ECE", "Not Certified"]'::jsonb,
    '["CE EN1078", "CPSC", "ASTM", "Snell", "DOT", "ECE", "Без сертификат"]'::jsonb,
    81);

  -- ============================================
  -- PARTS SPECIFIC ATTRIBUTES
  -- ============================================
  
  -- 51. Part Condition
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_parts_id, 'Part Condition', 'Състояние на частта', 'select', true, true,
    '["New OEM", "New Aftermarket", "Used", "Refurbished"]'::jsonb,
    '["Нова OEM", "Нова aftermarket", "Употребявана", "Рециклирана"]'::jsonb,
    90);

  -- 52. Battery Voltage
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_parts_id, 'Battery Voltage', 'Напрежение на батерията', 'select', false, true,
    '["24V", "36V", "48V", "52V", "60V", "72V", "84V", "100V+"]'::jsonb,
    '["24V", "36V", "48V", "52V", "60V", "72V", "84V", "100V+"]'::jsonb,
    91);

  -- 53. Battery Cell Type
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_parts_id, 'Battery Cell Type', 'Тип батерийни клетки', 'select', false, true,
    '["Samsung", "LG", "Panasonic", "Sanyo", "EVE", "Molicel", "Generic", "Unknown"]'::jsonb,
    '["Samsung", "LG", "Panasonic", "Sanyo", "EVE", "Molicel", "Общи", "Неизвестни"]'::jsonb,
    92);

  -- ============================================
  -- CHARGING SPECIFIC ATTRIBUTES
  -- ============================================
  
  -- 54. Charger Output Voltage
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_charging_id, 'Output Voltage', 'Изходно напрежение', 'select', false, true,
    '["24V", "36V", "42V", "48V", "54V", "60V", "67V", "72V", "84V", "Universal"]'::jsonb,
    '["24V", "36V", "42V", "48V", "54V", "60V", "67V", "72V", "84V", "Универсално"]'::jsonb,
    100);

  -- 55. Charger Amperage
  INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
  VALUES (v_charging_id, 'Charger Amperage', 'Ток на зарядното', 'select', false, true,
    '["1A", "2A", "3A", "4A", "5A", "6A", "8A", "10A+"]'::jsonb,
    '["1A", "2A", "3A", "4A", "5A", "6A", "8A", "10A+"]'::jsonb,
    101);

  RAISE NOTICE 'E-Mobility attributes created successfully!';
END;
$$;
;
