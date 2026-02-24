-- Restore category_attributes for Pet Supplies, Health, Gaming

-- Pet Supplies attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('pet-supplies', 'Pet Type', 'Тип домашен любимец', 'select', true, true, '["Dog", "Cat", "Bird", "Fish", "Small Animal", "Reptile", "Horse", "Other"]', '["Куче", "Котка", "Птица", "Риба", "Малки животни", "Влечуго", "Кон", "Друго"]', 1),
  ('pet-supplies', 'Category', 'Категория', 'select', true, true, '["Food", "Treats", "Toys", "Beds", "Carriers", "Grooming", "Health", "Clothing", "Training", "Accessories"]', '["Храна", "Лакомства", "Играчки", "Легла", "Транспортни кутии", "Грижа за козината", "Здраве", "Облекло", "Обучение", "Аксесоари"]', 2),
  ('pet-supplies', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 3),
  ('pet-supplies', 'Size', 'Размер', 'select', false, true, '["XS", "S", "M", "L", "XL", "One Size"]', '["XS", "S", "M", "L", "XL", "Един размер"]', 4),
  ('pet-supplies', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good"]', '["Ново", "Като ново", "Добро"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Dog Supplies attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('dog-supplies', 'Type', 'Тип', 'select', true, true, '["Food", "Treats", "Toys", "Beds", "Collars & Leashes", "Grooming", "Health", "Clothing", "Training", "Crates & Carriers"]', '["Храна", "Лакомства", "Играчки", "Легла", "Нашийници и каишки", "Грижа", "Здраве", "Облекло", "Обучение", "Кошчета и транспорт"]', 1),
  ('dog-supplies', 'Dog Size', 'Размер куче', 'select', false, true, '["Small (up to 10kg)", "Medium (10-25kg)", "Large (25-45kg)", "Giant (45kg+)", "All Sizes"]', '["Малко (до 10кг)", "Средно (10-25кг)", "Голямо (25-45кг)", "Гигант (45кг+)", "Всички размери"]', 2),
  ('dog-supplies', 'Age', 'Възраст', 'select', false, true, '["Puppy", "Adult", "Senior", "All Ages"]', '["Кученце", "Възрастно", "Старо", "Всички възрасти"]', 3),
  ('dog-supplies', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 4),
  ('dog-supplies', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good"]', '["Ново", "Като ново", "Добро"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Cat Supplies attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('cat-supplies', 'Type', 'Тип', 'select', true, true, '["Food", "Treats", "Toys", "Beds", "Litter & Accessories", "Scratchers", "Carriers", "Health", "Grooming"]', '["Храна", "Лакомства", "Играчки", "Легла", "Постелки и аксесоари", "Драскалки", "Транспортни кутии", "Здраве", "Грижа"]', 1),
  ('cat-supplies', 'Age', 'Възраст', 'select', false, true, '["Kitten", "Adult", "Senior", "All Ages"]', '["Коте", "Възрастна", "Стара", "Всички възрасти"]', 2),
  ('cat-supplies', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 3),
  ('cat-supplies', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good"]', '["Ново", "Като ново", "Добро"]', 4)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Health & Wellness attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('health-wellness', 'Category', 'Категория', 'select', true, true, '["Vitamins", "Supplements", "First Aid", "Personal Care", "Medical Devices", "Fitness Trackers", "Massage", "Sleep Aids", "Pain Relief"]', '["Витамини", "Хранителни добавки", "Първа помощ", "Лична грижа", "Медицински уреди", "Фитнес тракери", "Масаж", "За сън", "Облекчаване на болка"]', 1),
  ('health-wellness', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('health-wellness', 'Target', 'За', 'select', false, true, '["Men", "Women", "Kids", "Seniors", "Unisex"]', '["Мъже", "Жени", "Деца", "Възрастни", "Унисекс"]', 3),
  ('health-wellness', 'Expiration', 'Срок на годност', 'select', false, true, '["Long Dated", "Normal", "Short Dated"]', '["Дълъг срок", "Нормален", "Кратък срок"]', 4),
  ('health-wellness', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open", "Like New"]', '["Ново запечатано", "Ново отворено", "Като ново"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Gaming Consoles attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('gaming-consoles', 'Platform', 'Платформа', 'select', true, true, '["PlayStation 5", "PlayStation 4", "Xbox Series X|S", "Xbox One", "Nintendo Switch", "Steam Deck", "Retro Console", "Other"]', '["PlayStation 5", "PlayStation 4", "Xbox Series X|S", "Xbox One", "Nintendo Switch", "Steam Deck", "Ретро конзола", "Друга"]', 1),
  ('gaming-consoles', 'Storage', 'Памет', 'select', false, true, '["500GB", "825GB", "1TB", "2TB", "Other"]', '["500GB", "825GB", "1TB", "2TB", "Друга"]', 2),
  ('gaming-consoles', 'Edition', 'Версия', 'select', false, true, '["Standard", "Digital", "Pro", "Slim", "Limited Edition", "Bundle"]', '["Стандартна", "Дигитална", "Pro", "Slim", "Лимитирана", "Комплект"]', 3),
  ('gaming-consoles', 'Includes', 'Включва', 'multiselect', false, false, '["Original Box", "Controller", "Cables", "Games", "Headset", "Stand"]', '["Оригинална кутия", "Контролер", "Кабели", "Игри", "Слушалки", "Стойка"]', 4),
  ('gaming-consoles', 'Region', 'Регион', 'select', false, true, '["Europe", "USA", "Japan", "Region Free"]', '["Европа", "САЩ", "Япония", "Без регион"]', 5),
  ('gaming-consoles', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open Box", "Like New", "Good", "Fair", "For Parts"]', '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително", "За части"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Video Games attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('video-games', 'Platform', 'Платформа', 'select', true, true, '["PlayStation 5", "PlayStation 4", "Xbox Series X|S", "Xbox One", "Nintendo Switch", "PC", "Retro", "Other"]', '["PlayStation 5", "PlayStation 4", "Xbox Series X|S", "Xbox One", "Nintendo Switch", "PC", "Ретро", "Друга"]', 1),
  ('video-games', 'Genre', 'Жанр', 'select', false, true, '["Action", "Adventure", "RPG", "Sports", "Racing", "Shooter", "Strategy", "Simulation", "Fighting", "Horror", "Puzzle", "Kids"]', '["Екшън", "Приключенска", "RPG", "Спорт", "Състезателна", "Шутър", "Стратегия", "Симулация", "Бойна", "Хорър", "Пъзел", "Детска"]', 2),
  ('video-games', 'Format', 'Формат', 'select', true, true, '["Physical Disc", "Digital Code", "Cartridge"]', '["Физически диск", "Дигитален код", "Касета"]', 3),
  ('video-games', 'Region', 'Регион', 'select', false, true, '["Europe/PAL", "USA/NTSC", "Japan", "Region Free", "Global Key"]', '["Европа/PAL", "САЩ/NTSC", "Япония", "Без регион", "Глобален ключ"]', 4),
  ('video-games', 'Language', 'Език', 'multiselect', false, true, '["English", "Bulgarian", "German", "French", "Spanish", "Russian", "Multi-Language"]', '["Английски", "Български", "Немски", "Френски", "Испански", "Руски", "Мулти-език"]', 5),
  ('video-games', 'Age Rating', 'Възрастова категория', 'select', false, true, '["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18"]', '["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18"]', 6),
  ('video-games', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "Like New", "Good", "Acceptable", "Disc Only"]', '["Ново запечатано", "Като ново", "Добро", "Приемливо", "Само диск"]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Gaming Accessories attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('gaming-accessories', 'Type', 'Тип', 'select', true, true, '["Controller", "Headset", "VR Headset", "Charging Station", "Racing Wheel", "Flight Stick", "Arcade Stick", "Carrying Case", "Skin/Cover", "Cable", "Other"]', '["Контролер", "Слушалки", "VR очила", "Зарядна станция", "Волан", "Джойстик за летене", "Аркаден стик", "Калъф за носене", "Кожа/Капак", "Кабел", "Друго"]', 1),
  ('gaming-accessories', 'Compatible With', 'Съвместим с', 'multiselect', true, true, '["PlayStation 5", "PlayStation 4", "Xbox Series X|S", "Xbox One", "Nintendo Switch", "PC", "Universal"]', '["PlayStation 5", "PlayStation 4", "Xbox Series X|S", "Xbox One", "Nintendo Switch", "PC", "Универсален"]', 2),
  ('gaming-accessories', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 3),
  ('gaming-accessories', 'Color', 'Цвят', 'text', false, true, '[]', '[]', 4),
  ('gaming-accessories', 'Connectivity', 'Свързване', 'select', false, true, '["Wired", "Wireless", "Bluetooth", "2.4GHz", "Both"]', '["Кабелно", "Безжично", "Bluetooth", "2.4GHz", "И двете"]', 5),
  ('gaming-accessories', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair"]', '["Ново", "Като ново", "Добро", "Задоволително"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- PC Gaming attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('pc-gaming', 'Type', 'Тип', 'select', true, true, '["Gaming PC", "Gaming Laptop", "Gaming Monitor", "Gaming Keyboard", "Gaming Mouse", "Gaming Headset", "Gaming Chair", "Mousepad", "Webcam", "Microphone", "Streaming Equipment"]', '["Геймърски компютър", "Геймърски лаптоп", "Геймърски монитор", "Геймърска клавиатура", "Геймърска мишка", "Геймърски слушалки", "Геймърски стол", "Подложка за мишка", "Уебкамера", "Микрофон", "За стрийминг"]', 1),
  ('pc-gaming', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('pc-gaming', 'RGB Lighting', 'RGB осветление', 'boolean', false, true, '[]', '[]', 3),
  ('pc-gaming', 'Connectivity', 'Свързване', 'select', false, true, '["Wired", "Wireless", "Both"]', '["Кабелно", "Безжично", "И двете"]', 4),
  ('pc-gaming', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
