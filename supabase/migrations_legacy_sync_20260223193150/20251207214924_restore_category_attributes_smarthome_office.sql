-- Restore category_attributes for Smart Home, Office Supplies, Bags

-- Smart Home attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('smart-home', 'Type', 'Тип', 'select', true, true, '["Smart Speaker", "Smart Display", "Smart Light", "Smart Plug", "Smart Lock", "Smart Thermostat", "Smart Camera", "Smart Doorbell", "Smart Sensor", "Hub"]', '["Смарт говорител", "Смарт дисплей", "Смарт осветление", "Смарт контакт", "Смарт брава", "Смарт термостат", "Смарт камера", "Смарт звънец", "Смарт сензор", "Хъб"]', 1),
  ('smart-home', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('smart-home', 'Ecosystem', 'Екосистема', 'multiselect', false, true, '["Amazon Alexa", "Google Home", "Apple HomeKit", "SmartThings", "Matter", "Standalone"]', '["Amazon Alexa", "Google Home", "Apple HomeKit", "SmartThings", "Matter", "Самостоятелно"]', 3),
  ('smart-home', 'Connectivity', 'Свързване', 'multiselect', false, true, '["WiFi", "Bluetooth", "Zigbee", "Z-Wave", "Thread"]', '["WiFi", "Bluetooth", "Zigbee", "Z-Wave", "Thread"]', 4),
  ('smart-home', 'Power Source', 'Захранване', 'select', false, true, '["Plug-in", "Battery", "USB", "Wired"]', '["Включване в контакт", "Батерия", "USB", "Кабелно"]', 5),
  ('smart-home', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair"]', '["Ново", "Като ново", "Добро", "Задоволително"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Office Supplies attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('office-supplies', 'Type', 'Тип', 'select', true, true, '["Writing Supplies", "Paper Products", "Desk Organizers", "Filing", "Binders", "Labels", "Staplers", "Scissors", "Tape", "Markers"]', '["Пособия за писане", "Хартиени продукти", "Органайзери за бюро", "Архивиране", "Папки", "Етикети", "Телбоди", "Ножици", "Лепенки", "Маркери"]', 1),
  ('office-supplies', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('office-supplies', 'Quantity', 'Количество', 'select', false, true, '["Single Item", "Pack", "Box", "Bulk"]', '["Единичен", "Пакет", "Кутия", "На едро"]', 3),
  ('office-supplies', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good"]', '["Ново", "Като ново", "Добро"]', 4)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Office Furniture attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('office-furniture', 'Type', 'Тип', 'select', true, true, '["Office Desk", "Office Chair", "Standing Desk", "File Cabinet", "Bookshelf", "Conference Table", "Reception Desk", "Monitor Stand"]', '["Офис бюро", "Офис стол", "Стоящо бюро", "Шкаф за документи", "Етажерка", "Конферентна маса", "Рецепция", "Стойка за монитор"]', 1),
  ('office-furniture', 'Material', 'Материал', 'select', false, true, '["Wood", "Metal", "Glass", "Laminate", "Mesh", "Leather", "Fabric"]', '["Дърво", "Метал", "Стъкло", "Ламинат", "Мрежа", "Кожа", "Плат"]', 2),
  ('office-furniture', 'Color', 'Цвят', 'text', false, true, '[]', '[]', 3),
  ('office-furniture', 'Ergonomic', 'Ергономичен', 'boolean', false, true, '[]', '[]', 4),
  ('office-furniture', 'Adjustable Height', 'Регулируема височина', 'boolean', false, true, '[]', '[]', 5),
  ('office-furniture', 'Dimensions', 'Размери', 'text', false, false, '[]', '[]', 6),
  ('office-furniture', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Restoration"]', '["Ново", "Като ново", "Добро", "Задоволително", "За реставрация"]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Bags & Luggage attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('bags', 'Type', 'Тип', 'select', true, true, '["Backpack", "Handbag", "Messenger Bag", "Tote", "Crossbody", "Laptop Bag", "Suitcase", "Carry-On", "Duffel", "Wallet", "Briefcase"]', '["Раница", "Дамска чанта", "Пощальонска чанта", "Торба", "Кросбоди", "Чанта за лаптоп", "Куфар", "Ръчен багаж", "Сак", "Портфейл", "Бизнес чанта"]', 1),
  ('bags', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('bags', 'Material', 'Материал', 'select', false, true, '["Leather", "Faux Leather", "Canvas", "Nylon", "Polyester", "Cotton", "Fabric", "Hardshell"]', '["Кожа", "Еко кожа", "Брезент", "Найлон", "Полиестер", "Памук", "Плат", "Твърда обвивка"]', 3),
  ('bags', 'Color', 'Цвят', 'text', false, true, '[]', '[]', 4),
  ('bags', 'Size', 'Размер', 'select', false, true, '["Small", "Medium", "Large", "Extra Large", "Cabin Size", "Check-In Size"]', '["Малък", "Среден", "Голям", "Много голям", "Кабинен размер", "За багажно"]', 5),
  ('bags', 'Gender', 'За', 'select', false, true, '["Men", "Women", "Unisex", "Kids"]', '["Мъже", "Жени", "Унисекс", "Деца"]', 6),
  ('bags', 'Features', 'Характеристики', 'multiselect', false, false, '["Laptop Compartment", "Waterproof", "Wheels", "TSA Lock", "Anti-Theft", "USB Charging Port"]', '["Отделение за лаптоп", "Водоустойчива", "Колелца", "TSA ключалка", "Против кражба", "USB порт"]', 7),
  ('bags', 'Condition', 'Състояние', 'select', true, true, '["New with Tags", "New without Tags", "Like New", "Good", "Fair"]', '["Ново с етикет", "Ново без етикет", "Като ново", "Добро", "Задоволително"]', 8)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Sunglasses & Eyewear attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('sunglasses', 'Type', 'Тип', 'select', true, true, '["Sunglasses", "Prescription Glasses", "Reading Glasses", "Blue Light Glasses", "Sports Glasses", "Safety Glasses"]', '["Слънчеви очила", "Диоптрични очила", "Очила за четене", "Очила за синя светлина", "Спортни очила", "Предпазни очила"]', 1),
  ('sunglasses', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('sunglasses', 'Frame Shape', 'Форма на рамката', 'select', false, true, '["Aviator", "Wayfarer", "Round", "Square", "Cat Eye", "Oval", "Rectangle", "Sport"]', '["Авиатор", "Wayfarer", "Кръгли", "Квадратни", "Котешко око", "Овални", "Правоъгълни", "Спортни"]', 3),
  ('sunglasses', 'Frame Material', 'Материал на рамката', 'select', false, true, '["Metal", "Plastic", "Acetate", "Titanium", "Wood", "Carbon Fiber"]', '["Метал", "Пластмаса", "Ацетат", "Титан", "Дърво", "Карбон"]', 4),
  ('sunglasses', 'Lens Type', 'Тип стъкла', 'select', false, true, '["Standard", "Polarized", "Mirrored", "Gradient", "Photochromic"]', '["Стандартни", "Поляризирани", "Огледални", "Градиентни", "Фотохромни"]', 5),
  ('sunglasses', 'Gender', 'За', 'select', false, true, '["Men", "Women", "Unisex", "Kids"]', '["Мъже", "Жени", "Унисекс", "Деца"]', 6),
  ('sunglasses', 'UV Protection', 'UV защита', 'select', false, true, '["UV400", "100% UV", "Partial", "None"]', '["UV400", "100% UV", "Частична", "Без"]', 7),
  ('sunglasses', 'Condition', 'Състояние', 'select', true, true, '["New with Tags", "New without Tags", "Like New", "Good", "Fair"]', '["Ново с етикет", "Ново без етикет", "Като ново", "Добро", "Задоволително"]', 8)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Sports Equipment attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('sports-equipment', 'Sport', 'Спорт', 'select', true, true, '["Football/Soccer", "Basketball", "Tennis", "Golf", "Baseball", "Volleyball", "Swimming", "Skiing", "Snowboarding", "Hockey", "Martial Arts", "Boxing", "Running", "Other"]', '["Футбол", "Баскетбол", "Тенис", "Голф", "Бейзбол", "Волейбол", "Плуване", "Ски", "Сноуборд", "Хокей", "Бойни изкуства", "Бокс", "Бягане", "Друг"]', 1),
  ('sports-equipment', 'Type', 'Тип', 'select', true, true, '["Ball", "Racket", "Club", "Gloves", "Protective Gear", "Shoes", "Apparel", "Accessories", "Goal/Net", "Training Equipment"]', '["Топка", "Ракета", "Стик/Бухалка", "Ръкавици", "Защитно оборудване", "Обувки", "Облекло", "Аксесоари", "Врата/Мрежа", "Тренировъчно оборудване"]', 2),
  ('sports-equipment', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 3),
  ('sports-equipment', 'Size', 'Размер', 'text', false, true, '[]', '[]', 4),
  ('sports-equipment', 'Gender/Age', 'Пол/Възраст', 'select', false, true, '["Men", "Women", "Youth", "Kids", "Unisex"]', '["Мъже", "Жени", "Младежи", "Деца", "Унисекс"]', 5),
  ('sports-equipment', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
