-- Restore category_attributes for Garden, Food & Grocery, Tools

-- Garden & Outdoor attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('garden-outdoor', 'Type', 'Тип', 'select', true, true, '["Plants", "Seeds", "Planters", "Garden Tools", "Outdoor Furniture", "Lawn Mower", "Irrigation", "Decor", "Fencing", "Lighting"]', '["Растения", "Семена", "Саксии", "Градински инструменти", "Градинска мебел", "Косачка", "Напояване", "Декор", "Огради", "Осветление"]', 1),
  ('garden-outdoor', 'Category', 'Категория', 'select', false, true, '["Lawn Care", "Gardening", "Patio", "Pool", "BBQ & Outdoor Cooking", "Outdoor Play"]', '["Грижа за тревата", "Градинарство", "Двор", "Басейн", "Барбекю", "Игри на открито"]', 2),
  ('garden-outdoor', 'Power Source', 'Захранване', 'select', false, true, '["Manual", "Electric Corded", "Electric Cordless", "Gas", "Solar"]', '["Ръчно", "Ел. с кабел", "Ел. безкабелно", "Бензин", "Соларно"]', 3),
  ('garden-outdoor', 'Material', 'Материал', 'select', false, true, '["Wood", "Metal", "Plastic", "Rattan", "Composite", "Ceramic"]', '["Дърво", "Метал", "Пластмаса", "Ратан", "Композит", "Керамика"]', 4),
  ('garden-outdoor', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Food & Grocery attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('food-grocery', 'Category', 'Категория', 'select', true, true, '["Snacks", "Beverages", "Canned Goods", "Dry Goods", "Condiments", "Baking", "International", "Organic", "Specialty"]', '["Снаксове", "Напитки", "Консерви", "Сухи храни", "Подправки", "За печене", "Международни", "Био", "Специални"]', 1),
  ('food-grocery', 'Dietary', 'Диетични', 'multiselect', false, true, '["Vegan", "Vegetarian", "Gluten-Free", "Sugar-Free", "Low-Carb", "Keto", "Kosher", "Halal", "Organic"]', '["Веган", "Вегетариански", "Без глутен", "Без захар", "Нисковъглехидратни", "Кето", "Кошер", "Халал", "Био"]', 2),
  ('food-grocery', 'Pack Size', 'Опаковка', 'select', false, true, '["Single", "Multi-Pack", "Bulk", "Family Size"]', '["Единична", "Мулти пакет", "На едро", "Семейна"]', 3),
  ('food-grocery', 'Expiration', 'Срок на годност', 'select', true, true, '["Long Dated", "Normal", "Short Dated", "Near Expiry"]', '["Дълъг срок", "Нормален", "Кратък срок", "Близък до изтичане"]', 4),
  ('food-grocery', 'Storage', 'Съхранение', 'select', false, true, '["Ambient", "Refrigerated", "Frozen"]', '["Стайна температура", "Хладилно", "Замразено"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Power Tools attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('power-tools', 'Type', 'Тип', 'select', true, true, '["Drill", "Impact Driver", "Circular Saw", "Jigsaw", "Angle Grinder", "Sander", "Router", "Nail Gun", "Heat Gun", "Rotary Tool"]', '["Бормашина", "Ударен гайковерт", "Циркуляр", "Прободен трион", "Ъглошлайф", "Шлайф", "Оберфреза", "Такер", "Пистолет за горещ въздух", "Мултишлайф"]', 1),
  ('power-tools', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('power-tools', 'Power Source', 'Захранване', 'select', true, true, '["Corded Electric", "Cordless", "Pneumatic"]', '["Електрическо с кабел", "Акумулаторно", "Пневматично"]', 3),
  ('power-tools', 'Voltage', 'Волтаж', 'select', false, true, '["12V", "18V", "20V", "36V", "240V"]', '["12V", "18V", "20V", "36V", "240V"]', 4),
  ('power-tools', 'Includes', 'Включва', 'multiselect', false, false, '["Battery", "Charger", "Case", "Accessories", "Extra Battery"]', '["Батерия", "Зарядно", "Куфар", "Аксесоари", "Допълнителна батерия"]', 5),
  ('power-tools', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Hand Tools attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, options::jsonb, options_bg::jsonb, v.sort_order
FROM (VALUES
  ('hand-tools', 'Type', 'Тип', 'select', true, true, '["Screwdrivers", "Wrenches", "Pliers", "Hammers", "Saws", "Measuring", "Clamps", "Chisels", "Files", "Tool Set"]', '["Отвертки", "Гаечни ключове", "Клещи", "Чукове", "Ръчни триони", "Измервателни", "Скоби", "Длета", "Пили", "Комплект инструменти"]', 1),
  ('hand-tools', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('hand-tools', 'Material', 'Материал', 'select', false, true, '["Chrome Vanadium", "Carbon Steel", "Stainless Steel", "Titanium"]', '["Хром-ванадий", "Въглеродна стомана", "Неръждаема стомана", "Титан"]', 3),
  ('hand-tools', 'Set Size', 'Брой части', 'select', false, true, '["Single", "3-10 pieces", "10-25 pieces", "25-50 pieces", "50+ pieces"]', '["Единичен", "3-10 части", "10-25 части", "25-50 части", "50+ части"]', 4),
  ('hand-tools', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair"]', '["Ново", "Като ново", "Добро", "Задоволително"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Computer Components attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('computer-components', 'Type', 'Тип', 'select', true, true, '["CPU", "GPU", "RAM", "SSD", "HDD", "Motherboard", "Power Supply", "Case", "Cooling", "Fans"]', '["Процесор", "Видеокарта", "RAM памет", "SSD", "HDD", "Дънна платка", "Захранване", "Кутия", "Охлаждане", "Вентилатори"]', 1),
  ('computer-components', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('computer-components', 'Socket/Compatibility', 'Сокет/Съвместимост', 'text', false, true, '[]', '[]', 3),
  ('computer-components', 'Capacity/Specs', 'Капацитет/Спецификации', 'text', false, false, '[]', '[]', 4),
  ('computer-components', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open Box", "Like New", "Used Working", "For Parts"]', '["Ново запечатано", "Ново разопаковано", "Като ново", "Използвано работещо", "За части"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Cameras & Photography attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('cameras', 'Type', 'Тип', 'select', true, true, '["DSLR", "Mirrorless", "Point & Shoot", "Action Camera", "Film Camera", "Instant Camera", "Drone Camera", "Camcorder"]', '["DSLR", "Безогледален", "Компактен", "Екшън камера", "Филмов апарат", "Моментална камера", "Дрон камера", "Видеокамера"]', 1),
  ('cameras', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('cameras', 'Sensor Size', 'Размер на сензора', 'select', false, true, '["Full Frame", "APS-C", "Micro Four Thirds", "1\"", "1/2.3\"", "Medium Format"]', '["Пълен кадър", "APS-C", "Micro Four Thirds", "1\"", "1/2.3\"", "Среден формат"]', 3),
  ('cameras', 'Resolution', 'Резолюция (MP)', 'text', false, true, '[]', '[]', 4),
  ('cameras', 'Video', 'Видео', 'select', false, true, '["4K", "1080p", "720p", "8K"]', '["4K", "1080p", "720p", "8K"]', 5),
  ('cameras', 'Includes', 'Включва', 'multiselect', false, false, '["Body Only", "Kit Lens", "Extra Lens", "Battery", "Charger", "Bag", "Memory Card", "Tripod"]', '["Само тяло", "Кит обектив", "Допълнителен обектив", "Батерия", "Зарядно", "Чанта", "Карта памет", "Статив"]', 6),
  ('cameras', 'Shutter Count', 'Брой затваряния', 'number', false, false, '[]', '[]', 7),
  ('cameras', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Excellent", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Отлично", "Добро", "Задоволително", "За части"]', 8)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Audio Equipment attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('audio', 'Type', 'Тип', 'select', true, true, '["Headphones", "Earbuds", "Speakers", "Soundbar", "Amplifier", "Receiver", "Turntable", "Microphone", "Studio Monitors"]', '["Слушалки", "Тапи", "Колони", "Саундбар", "Усилвател", "Ресивър", "Грамофон", "Микрофон", "Студийни монитори"]', 1),
  ('audio', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('audio', 'Connectivity', 'Свързване', 'multiselect', false, true, '["Wired", "Bluetooth", "Wi-Fi", "USB", "Optical", "RCA"]', '["Кабелно", "Bluetooth", "Wi-Fi", "USB", "Оптично", "RCA"]', 3),
  ('audio', 'Noise Cancellation', 'Шумопотискане', 'select', false, true, '["Active", "Passive", "None"]', '["Активно", "Пасивно", "Без"]', 4),
  ('audio', 'Includes', 'Включва', 'multiselect', false, false, '["Case", "Cable", "Stand", "Remote", "Extra Ear Tips"]', '["Калъф", "Кабел", "Стойка", "Дистанционно", "Допълнителни накрайници"]', 5),
  ('audio', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Excellent", "Good", "Fair"]', '["Ново", "Като ново", "Отлично", "Добро", "Задоволително"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
