
-- Add universal gaming attributes to L1 categories missing them

-- PC Gaming attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'pc-gaming-main'),
  attr.name, attr.name_bg, attr.attribute_type, attr.is_required, attr.is_filterable, 
  attr.options::jsonb, attr.options_bg::jsonb, attr.sort_order
FROM (VALUES
  ('Platform', 'Платформа', 'select', true, true, '["PC","Mac","Linux","Cross-Platform"]', '["PC","Mac","Linux","Крос-платформа"]', 1),
  ('Brand', 'Марка', 'select', false, true, '["ASUS","MSI","Corsair","Razer","Logitech","SteelSeries","HyperX","NZXT","Other"]', '["ASUS","MSI","Corsair","Razer","Logitech","SteelSeries","HyperX","NZXT","Друга"]', 2),
  ('Condition', 'Състояние', 'select', true, true, '["New","Like New","Used - Excellent","Used - Good","For Parts"]', '["Ново","Като ново","Използвано - Отлично","Използвано - Добро","За части"]', 3),
  ('Connectivity', 'Свързване', 'multiselect', false, true, '["Wired","Wireless","Bluetooth","USB","USB-C"]', '["Кабелно","Безжично","Bluetooth","USB","USB-C"]', 4),
  ('RGB Lighting', 'RGB осветление', 'boolean', false, true, '[]', '[]', 5)
) AS attr(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order);

-- Console Gaming attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'console-gaming'),
  attr.name, attr.name_bg, attr.attribute_type, attr.is_required, attr.is_filterable, 
  attr.options::jsonb, attr.options_bg::jsonb, attr.sort_order
FROM (VALUES
  ('Platform', 'Платформа', 'select', true, true, '["PlayStation 5","PlayStation 4","Xbox Series X|S","Xbox One","Nintendo Switch","Nintendo 3DS","Multi-Platform"]', '["PlayStation 5","PlayStation 4","Xbox Series X|S","Xbox One","Nintendo Switch","Nintendo 3DS","Мулти-платформа"]', 1),
  ('Condition', 'Състояние', 'select', true, true, '["New Sealed","New Open Box","Like New","Good","Fair","For Parts"]', '["Ново запечатано","Ново отворена кутия","Като ново","Добро","Задоволително","За части"]', 2),
  ('Region', 'Регион', 'select', false, true, '["PAL","NTSC","Region Free"]', '["PAL","NTSC","Без регион"]', 3),
  ('Edition', 'Издание', 'select', false, true, '["Standard","Deluxe","Ultimate","Collector","Limited"]', '["Стандартно","Делукс","Ултимейт","Колекционерско","Лимитирано"]', 4)
) AS attr(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order);

-- VR & AR Gaming attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'vr-ar-gaming'),
  attr.name, attr.name_bg, attr.attribute_type, attr.is_required, attr.is_filterable, 
  attr.options::jsonb, attr.options_bg::jsonb, attr.sort_order
FROM (VALUES
  ('Platform', 'Платформа', 'select', true, true, '["Meta Quest 3","Meta Quest 2","PlayStation VR2","Valve Index","HTC Vive","Apple Vision Pro","Other"]', '["Meta Quest 3","Meta Quest 2","PlayStation VR2","Valve Index","HTC Vive","Apple Vision Pro","Друга"]', 1),
  ('Condition', 'Състояние', 'select', true, true, '["New","Like New","Used - Excellent","Used - Good"]', '["Ново","Като ново","Използвано - Отлично","Използвано - Добро"]', 2),
  ('Tracking', 'Проследяване', 'select', false, true, '["Inside-Out","Outside-In","Hybrid"]', '["Вътрешно-навън","Външно-навътре","Хибридно"]', 3),
  ('Resolution', 'Резолюция', 'select', false, true, '["1832x1920 per eye","2160x2160 per eye","2000x2040 per eye","Other"]', '["1832x1920 на око","2160x2160 на око","2000x2040 на око","Друга"]', 4)
) AS attr(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order);

-- Gaming Furniture attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'gaming-furniture'),
  attr.name, attr.name_bg, attr.attribute_type, attr.is_required, attr.is_filterable, 
  attr.options::jsonb, attr.options_bg::jsonb, attr.sort_order
FROM (VALUES
  ('Brand', 'Марка', 'select', false, true, '["Secretlab","DXRacer","noblechairs","AKRacing","Corsair","IKEA","Other"]', '["Secretlab","DXRacer","noblechairs","AKRacing","Corsair","IKEA","Друга"]', 1),
  ('Type', 'Тип', 'select', true, true, '["Gaming Chair","Gaming Desk","Monitor Stand","Desk Mat","Storage","Other"]', '["Гейминг стол","Гейминг бюро","Поставка за монитор","Подложка за бюро","Съхранение","Друго"]', 2),
  ('Condition', 'Състояние', 'select', true, true, '["New","Like New","Used - Excellent","Used - Good"]', '["Ново","Като ново","Използвано - Отлично","Използвано - Добро"]', 3),
  ('Max Weight Capacity', 'Макс. тегло', 'select', false, true, '["Under 100kg","100-120kg","120-150kg","150kg+"]', '["Под 100кг","100-120кг","120-150кг","150кг+"]', 4),
  ('RGB Lighting', 'RGB осветление', 'boolean', false, true, '[]', '[]', 5)
) AS attr(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order);

-- Streaming Equipment attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'streaming-equipment'),
  attr.name, attr.name_bg, attr.attribute_type, attr.is_required, attr.is_filterable, 
  attr.options::jsonb, attr.options_bg::jsonb, attr.sort_order
FROM (VALUES
  ('Brand', 'Марка', 'select', false, true, '["Elgato","Logitech","Razer","Blue","Shure","Audio-Technica","RODE","Other"]', '["Elgato","Logitech","Razer","Blue","Shure","Audio-Technica","RODE","Друга"]', 1),
  ('Type', 'Тип', 'select', true, true, '["Webcam","Microphone","Capture Card","Lighting","Green Screen","Stream Deck","Audio Interface"]', '["Уебкамера","Микрофон","Capture карта","Осветление","Зелен екран","Stream Deck","Аудио интерфейс"]', 2),
  ('Condition', 'Състояние', 'select', true, true, '["New","Like New","Used - Excellent","Used - Good"]', '["Ново","Като ново","Използвано - Отлично","Използвано - Добро"]', 3),
  ('Resolution', 'Резолюция', 'select', false, true, '["720p","1080p","4K","N/A"]', '["720p","1080p","4K","Не е приложимо"]', 4),
  ('Connectivity', 'Свързване', 'select', false, true, '["USB","XLR","USB-C","Wireless"]', '["USB","XLR","USB-C","Безжично"]', 5)
) AS attr(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order);

-- Retro Gaming attributes  
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'retro-gaming'),
  attr.name, attr.name_bg, attr.attribute_type, attr.is_required, attr.is_filterable, 
  attr.options::jsonb, attr.options_bg::jsonb, attr.sort_order
FROM (VALUES
  ('Console', 'Конзола', 'select', true, true, '["NES","SNES","Sega Genesis","PlayStation 1","PlayStation 2","Nintendo 64","GameCube","Game Boy","Atari","Other"]', '["NES","SNES","Sega Genesis","PlayStation 1","PlayStation 2","Nintendo 64","GameCube","Game Boy","Atari","Друга"]', 1),
  ('Condition', 'Състояние', 'select', true, true, '["CIB (Complete)","Loose","New Sealed","Good","For Parts"]', '["CIB (Комплект)","Без кутия","Ново запечатано","Добро","За части"]', 2),
  ('Region', 'Регион', 'select', false, true, '["PAL","NTSC-U","NTSC-J","Region Free"]', '["PAL","NTSC-U","NTSC-J","Без регион"]', 3)
) AS attr(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order);

-- Controllers attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'gaming-controllers'),
  attr.name, attr.name_bg, attr.attribute_type, attr.is_required, attr.is_filterable, 
  attr.options::jsonb, attr.options_bg::jsonb, attr.sort_order
FROM (VALUES
  ('Platform', 'Платформа', 'select', true, true, '["PlayStation","Xbox","Nintendo Switch","PC","Universal"]', '["PlayStation","Xbox","Nintendo Switch","PC","Универсален"]', 1),
  ('Type', 'Тип', 'select', true, true, '["Standard Controller","Pro Controller","Fight Stick","Racing Wheel","Flight Stick","Other"]', '["Стандартен контролер","Про контролер","Fight Stick","Волан","Flight Stick","Друг"]', 2),
  ('Condition', 'Състояние', 'select', true, true, '["New","Like New","Used - Excellent","Used - Good"]', '["Ново","Като ново","Използвано - Отлично","Използвано - Добро"]', 3),
  ('Connectivity', 'Свързване', 'select', false, true, '["Wired","Wireless","Both"]', '["Кабелен","Безжичен","Двата варианта"]', 4),
  ('Color', 'Цвят', 'select', false, true, '["Black","White","Blue","Red","Custom","Other"]', '["Черен","Бял","Син","Червен","Персонализиран","Друг"]', 5)
) AS attr(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order);

-- Gaming Accessories attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'gaming-accessories'),
  attr.name, attr.name_bg, attr.attribute_type, attr.is_required, attr.is_filterable, 
  attr.options::jsonb, attr.options_bg::jsonb, attr.sort_order
FROM (VALUES
  ('Platform', 'Платформа', 'select', false, true, '["PlayStation","Xbox","Nintendo Switch","PC","Universal"]', '["PlayStation","Xbox","Nintendo Switch","PC","Универсален"]', 1),
  ('Type', 'Тип', 'select', true, true, '["Headset Stand","Controller Charger","Cable","Skin","Case","Storage","Other"]', '["Поставка за слушалки","Зарядно за контролер","Кабел","Скин","Калъф","Съхранение","Друго"]', 2),
  ('Condition', 'Състояние', 'select', true, true, '["New","Like New","Used"]', '["Ново","Като ново","Използвано"]', 3)
) AS attr(name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order);
;
