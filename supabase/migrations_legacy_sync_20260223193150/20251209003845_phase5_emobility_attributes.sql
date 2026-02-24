
-- Phase 5: E-Mobility - Comprehensive Attributes

-- L0: E-Mobility Universal Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'e-mobility'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Condition', 'Състояние', 'select', true, '["New", "Like New", "Excellent", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Отлично", "Добро", "Задоволително", "За части"]', 1),
  ('Brand', 'Марка', 'select', true, '["Segway-Ninebot", "Xiaomi", "Dualtron", "Apollo", "Vsett", "Kaabo", "Hiboy", "Gotrax", "Inokim", "Zero", "Varla", "TurboAnt", "Bosch", "Shimano", "Bafang", "Other"]', '["Segway-Ninebot", "Xiaomi", "Dualtron", "Apollo", "Vsett", "Kaabo", "Hiboy", "Gotrax", "Inokim", "Zero", "Varla", "TurboAnt", "Bosch", "Shimano", "Bafang", "Друга"]', 2),
  ('Max Speed', 'Макс. скорост', 'select', false, '["Under 15 km/h", "15-25 km/h", "25-35 km/h", "35-50 km/h", "50-70 km/h", "70+ km/h"]', '["Под 15 км/ч", "15-25 км/ч", "25-35 км/ч", "35-50 км/ч", "50-70 км/ч", "70+ км/ч"]', 3),
  ('Range', 'Обхват', 'select', false, '["Under 15 km", "15-30 km", "30-50 km", "50-80 km", "80-120 km", "120+ km"]', '["Под 15 км", "15-30 км", "30-50 км", "50-80 км", "80-120 км", "120+ км"]', 4),
  ('Battery Voltage', 'Напрежение батерия', 'select', false, '["24V", "36V", "48V", "52V", "60V", "72V", "84V"]', '["24V", "36V", "48V", "52V", "60V", "72V", "84V"]', 5),
  ('Motor Power', 'Мощност мотор', 'select', false, '["Under 250W", "250W", "350W", "500W", "750W", "1000W", "1500W", "2000W+", "Dual Motor"]', '["Под 250W", "250W", "350W", "500W", "750W", "1000W", "1500W", "2000W+", "Двоен мотор"]', 6)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: E-Bikes Specific Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'emob-ebikes'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Motor Type', 'Тип мотор', 'select', true, '["Hub Motor Rear", "Hub Motor Front", "Mid-Drive", "Direct Drive", "Geared Hub"]', '["Хъб мотор заден", "Хъб мотор преден", "Среден мотор", "Директно задвижване", "Хъб с предавки"]', 1),
  ('Battery Capacity', 'Капацитет батерия', 'select', false, '["Under 250Wh", "250-400Wh", "400-600Wh", "600-900Wh", "900Wh+", "Dual Battery"]', '["Под 250Wh", "250-400Wh", "400-600Wh", "600-900Wh", "900Wh+", "Двойна батерия"]', 2),
  ('Frame Type', 'Тип рамка', 'select', false, '["Step-Through", "Step-Over", "Diamond", "Folding", "Full Suspension", "Hardtail"]', '["С нисък преход", "С висок преход", "Диамант", "Сгъваема", "Пълно окачване", "Твърда опашка"]', 3),
  ('Wheel Size', 'Размер колело', 'select', false, '["16\"", "20\"", "24\"", "26\"", "27.5\"", "29\"", "700c"]', '["16\"", "20\"", "24\"", "26\"", "27.5\"", "29\"", "700c"]', 4),
  ('Pedal Assist Levels', 'Нива асистенция', 'select', false, '["3 Levels", "5 Levels", "7 Levels", "9 Levels", "Continuous"]', '["3 нива", "5 нива", "7 нива", "9 нива", "Плавно"]', 5),
  ('Class', 'Клас', 'select', false, '["Class 1 (20mph pedal assist)", "Class 2 (20mph + throttle)", "Class 3 (28mph pedal assist)", "Speed Pedelec (45km/h)"]', '["Клас 1 (32км/ч педал)", "Клас 2 (32км/ч + газ)", "Клас 3 (45км/ч педал)", "Скоростен педелек (45км/ч)"]', 6),
  ('Gears', 'Скорости', 'select', false, '["Single Speed", "3-Speed", "7-Speed", "8-Speed", "9-Speed", "10-Speed", "11-Speed", "12-Speed"]', '["Една скорост", "3 скорости", "7 скорости", "8 скорости", "9 скорости", "10 скорости", "11 скорости", "12 скорости"]', 7),
  ('Max Load', 'Макс. натоварване', 'select', false, '["Under 100kg", "100-120kg", "120-150kg", "150-180kg", "180kg+"]', '["Под 100кг", "100-120кг", "120-150кг", "150-180кг", "180кг+"]', 8)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: E-Scooters Specific Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'emob-escooters'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Motor Configuration', 'Конфигурация мотор', 'select', true, '["Single Front", "Single Rear", "Dual Motor"]', '["Единичен преден", "Единичен заден", "Двоен мотор"]', 1),
  ('Tire Type', 'Тип гуми', 'select', false, '["Solid", "Pneumatic", "Tubeless Pneumatic", "Honeycomb"]', '["Плътни", "Пневматични", "Безкамерни", "Пчелна пита"]', 2),
  ('Tire Size', 'Размер гуми', 'select', false, '["6.5\"", "8\"", "8.5\"", "10\"", "11\"", "13\"+"]', '["6.5\"", "8\"", "8.5\"", "10\"", "11\"", "13\"+"]', 3),
  ('Suspension', 'Окачване', 'select', false, '["None", "Front Only", "Rear Only", "Dual Suspension", "Air Suspension"]', '["Без", "Само предно", "Само задно", "Двойно окачване", "Въздушно окачване"]', 4),
  ('Brakes', 'Спирачки', 'select', false, '["Electric", "Disc Front", "Disc Rear", "Dual Disc", "Drum", "Hydraulic Disc"]', '["Електрически", "Дисков преден", "Дисков заден", "Двоен диск", "Барабанни", "Хидравличен диск"]', 5),
  ('Folding', 'Сгъваема', 'boolean', false, '["true", "false"]', '["Да", "Не"]', 6),
  ('IP Rating', 'IP рейтинг', 'select', false, '["IPX4", "IPX5", "IPX6", "IP54", "IP65", "IP67"]', '["IPX4", "IPX5", "IPX6", "IP54", "IP65", "IP67"]', 7),
  ('Weight', 'Тегло', 'select', false, '["Under 10kg", "10-15kg", "15-20kg", "20-30kg", "30-40kg", "40kg+"]', '["Под 10кг", "10-15кг", "15-20кг", "20-30кг", "30-40кг", "40кг+"]', 8)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: Hoverboards & Segways Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'emob-hoverboards'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Wheel Size', 'Размер колело', 'select', true, '["6.5\"", "8\"", "8.5\"", "10\"", "10.5\"+"]', '["6.5\"", "8\"", "8.5\"", "10\"", "10.5\"+"]', 1),
  ('Max Load', 'Макс. натоварване', 'select', false, '["Under 50kg", "50-75kg", "75-100kg", "100-120kg", "120kg+"]', '["Под 50кг", "50-75кг", "75-100кг", "100-120кг", "120кг+"]', 2),
  ('Bluetooth Speaker', 'Bluetooth говорител', 'boolean', false, '["true", "false"]', '["Да", "Не"]', 3),
  ('LED Lights', 'LED светлини', 'boolean', false, '["true", "false"]', '["Да", "Не"]', 4),
  ('UL2272 Certified', 'UL2272 сертификат', 'boolean', false, '["true", "false"]', '["Да", "Не"]', 5),
  ('Self-Balancing', 'Самобалансиращ', 'boolean', false, '["true", "false"]', '["Да", "Не"]', 6)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: E-Unicycles Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'emob-eunicycles'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Wheel Size', 'Размер колело', 'select', true, '["14\"", "16\"", "18\"", "20\"+"]', '["14\"", "16\"", "18\"", "20\"+"]', 1),
  ('Battery Capacity', 'Капацитет батерия', 'select', false, '["Under 500Wh", "500-1000Wh", "1000-1500Wh", "1500-2000Wh", "2000Wh+"]', '["Под 500Wh", "500-1000Wh", "1000-1500Wh", "1500-2000Wh", "2000Wh+"]', 2),
  ('Suspension', 'Окачване', 'boolean', false, '["true", "false"]', '["Да", "Не"]', 3),
  ('Trolley Handle', 'Дръжка за теглене', 'boolean', false, '["true", "false"]', '["Да", "Не"]', 4),
  ('Built-in Speakers', 'Вградени говорители', 'boolean', false, '["true", "false"]', '["Да", "Не"]', 5)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: E-Mobility Accessories Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'emob-accessories'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Accessory Type', 'Тип аксесоар', 'select', true, '["Helmet", "Lock", "Light", "Bag", "Phone Mount", "Protection Gear", "Storage", "Mirror", "Other"]', '["Каска", "Катинар", "Светлина", "Чанта", "Стойка за телефон", "Защитно оборудване", "Съхранение", "Огледало", "Друго"]', 1),
  ('Compatibility', 'Съвместимост', 'multiselect', false, '["E-Bikes", "E-Scooters", "Hoverboards", "EUC", "Universal"]', '["Е-велосипеди", "Е-тротинетки", "Ховърборди", "EUC", "Универсално"]', 2),
  ('Size', 'Размер', 'select', false, '["XS", "S", "M", "L", "XL", "XXL", "One Size"]', '["XS", "S", "M", "L", "XL", "XXL", "Един размер"]', 3),
  ('Color', 'Цвят', 'select', false, '["Black", "White", "Red", "Blue", "Green", "Yellow", "Orange", "Gray", "Multi"]', '["Черен", "Бял", "Червен", "Син", "Зелен", "Жълт", "Оранжев", "Сив", "Многоцветен"]', 4)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: E-Mobility Parts Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'emob-parts'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Part Type', 'Тип част', 'select', true, '["Battery", "Motor", "Controller", "Charger", "Tire", "Brake", "Display", "Handlebar", "Suspension", "Other"]', '["Батерия", "Мотор", "Контролер", "Зарядно", "Гума", "Спирачка", "Дисплей", "Кормило", "Окачване", "Друго"]', 1),
  ('Compatibility', 'Съвместимост', 'text', false, '[]', '[]', 2),
  ('OEM/Aftermarket', 'OEM/Следпазарен', 'select', false, '["OEM Original", "Aftermarket", "Generic", "Upgrade Part"]', '["OEM оригинален", "Следпазарен", "Генеричен", "Подобрена част"]', 3)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: Charging & Power Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'emob-charging'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Charger Type', 'Тип зарядно', 'select', true, '["Standard", "Fast", "Smart", "Multi-Port", "Solar", "Universal"]', '["Стандартно", "Бързо", "Смарт", "Многопортово", "Соларно", "Универсално"]', 1),
  ('Output Voltage', 'Изходно напрежение', 'select', false, '["36V", "42V", "48V", "52V", "54.6V", "60V", "67.2V", "72V", "84V"]', '["36V", "42V", "48V", "52V", "54.6V", "60V", "67.2V", "72V", "84V"]', 2),
  ('Output Current', 'Изходен ток', 'select', false, '["1A", "2A", "3A", "4A", "5A", "6A+"]', '["1A", "2A", "3A", "4A", "5A", "6A+"]', 3),
  ('Connector Type', 'Тип конектор', 'select', false, '["DC Barrel", "GX16", "XLR", "XT60", "Anderson", "Proprietary"]', '["DC цилиндър", "GX16", "XLR", "XT60", "Anderson", "Собствен"]', 4)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;
;
