
-- ============================================
-- COMPREHENSIVE CATEGORY ATTRIBUTES
-- Based on /docs/*.md specifications
-- ============================================

-- Helper: Get category ID by slug
CREATE OR REPLACE FUNCTION get_cat_id(cat_slug TEXT) 
RETURNS UUID AS $$
  SELECT id FROM categories WHERE slug = cat_slug LIMIT 1;
$$ LANGUAGE SQL;

-- ============================================
-- GLOBAL ATTRIBUTES (Apply to all products)
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
VALUES
  (NULL, 'Model', 'Модел', 'text', '[]', '[]', false, true, 3),
  (NULL, 'Warranty', 'Гаранция', 'select', '["No warranty", "1 month", "3 months", "6 months", "1 year", "2 years", "3+ years"]', '["Без гаранция", "1 месец", "3 месеца", "6 месеца", "1 година", "2 години", "3+ години"]', false, true, 4),
  (NULL, 'Original Box', 'Оригинална кутия', 'boolean', '[]', '[]', false, true, 5)
ON CONFLICT DO NOTHING;

-- ============================================
-- PHONES & TABLETS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('smartphones'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Storage', 'Памет', 'select', '["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]', '["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]', true, true, 1),
  ('Screen Size', 'Размер екран', 'select', '["Under 5\"", "5-5.5\"", "5.5-6\"", "6-6.5\"", "6.5-7\"", "7\"+"]', '["Под 5\"", "5-5.5\"", "5.5-6\"", "6-6.5\"", "6.5-7\"", "7\"+"]', false, true, 2),
  ('Battery Capacity', 'Батерия', 'select', '["Under 3000mAh", "3000-4000mAh", "4000-5000mAh", "5000-6000mAh", "6000mAh+"]', '["Под 3000mAh", "3000-4000mAh", "4000-5000mAh", "5000-6000mAh", "6000mAh+"]', false, true, 3),
  ('SIM Type', 'Тип SIM', 'multiselect', '["Single SIM", "Dual SIM", "eSIM", "Nano SIM", "Micro SIM"]', '["Единична SIM", "Двойна SIM", "eSIM", "Nano SIM", "Micro SIM"]', false, true, 4),
  ('Camera', 'Камера', 'select', '["Under 12MP", "12-48MP", "48-64MP", "64-108MP", "108MP+"]', '["Под 12MP", "12-48MP", "48-64MP", "64-108MP", "108MP+"]', false, true, 5),
  ('Features', 'Функции', 'multiselect', '["5G", "NFC", "Wireless Charging", "Fast Charging", "Water Resistant", "Face ID", "Fingerprint"]', '["5G", "NFC", "Безжично зареждане", "Бързо зареждане", "Водоустойчив", "Face ID", "Пръстов отпечатък"]', false, true, 6)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('smartphones') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPUTERS - LAPTOPS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('laptops'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Storage Type', 'Тип памет', 'select', '["SSD", "HDD", "SSD + HDD", "NVMe"]', '["SSD", "HDD", "SSD + HDD", "NVMe"]', false, true, 5),
  ('Storage Capacity', 'Капацитет', 'select', '["128GB", "256GB", "512GB", "1TB", "2TB", "4TB+"]', '["128GB", "256GB", "512GB", "1TB", "2TB", "4TB+"]', true, true, 6),
  ('Screen Resolution', 'Резолюция', 'select', '["HD (1366x768)", "Full HD (1920x1080)", "2K (2560x1440)", "4K (3840x2160)", "OLED"]', '["HD (1366x768)", "Full HD (1920x1080)", "2K (2560x1440)", "4K (3840x2160)", "OLED"]', false, true, 7),
  ('Refresh Rate', 'Честота', 'select', '["60Hz", "90Hz", "120Hz", "144Hz", "165Hz", "240Hz"]', '["60Hz", "90Hz", "120Hz", "144Hz", "165Hz", "240Hz"]', false, true, 8),
  ('Battery Life', 'Живот батерия', 'select', '["Under 4 hours", "4-6 hours", "6-8 hours", "8-10 hours", "10+ hours"]', '["Под 4 часа", "4-6 часа", "6-8 часа", "8-10 часа", "10+ часа"]', false, true, 9),
  ('Ports', 'Портове', 'multiselect', '["USB-A", "USB-C", "Thunderbolt", "HDMI", "DisplayPort", "SD Card", "Ethernet", "Headphone Jack"]', '["USB-A", "USB-C", "Thunderbolt", "HDMI", "DisplayPort", "SD карта", "Ethernet", "Жак за слушалки"]', false, true, 10),
  ('Touch Screen', 'Тъч екран', 'boolean', '[]', '[]', false, true, 11),
  ('Backlit Keyboard', 'Подсветка клавиатура', 'boolean', '[]', '[]', false, true, 12)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('laptops') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPUTERS - DESKTOPS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('desktops'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Form Factor', 'Форм фактор', 'select', '["Tower", "Mini Tower", "SFF", "Mini PC", "All-in-One"]', '["Tower", "Mini Tower", "SFF", "Мини PC", "All-in-One"]', false, true, 1),
  ('Processor', 'Процесор', 'select', '["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9"]', '["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9"]', false, true, 2),
  ('RAM', 'RAM', 'select', '["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"]', '["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"]', true, true, 3),
  ('GPU', 'Видеокарта', 'select', '["Integrated", "NVIDIA GTX", "NVIDIA RTX", "AMD Radeon RX"]', '["Интегрирана", "NVIDIA GTX", "NVIDIA RTX", "AMD Radeon RX"]', false, true, 4),
  ('Storage', 'Памет', 'select', '["256GB SSD", "512GB SSD", "1TB SSD", "1TB HDD", "2TB HDD", "SSD + HDD Combo"]', '["256GB SSD", "512GB SSD", "1TB SSD", "1TB HDD", "2TB HDD", "SSD + HDD комбо"]', false, true, 5),
  ('WiFi', 'WiFi', 'select', '["No WiFi", "WiFi 5", "WiFi 6", "WiFi 6E", "WiFi 7"]', '["Без WiFi", "WiFi 5", "WiFi 6", "WiFi 6E", "WiFi 7"]', false, true, 6),
  ('Bluetooth', 'Bluetooth', 'boolean', '[]', '[]', false, true, 7)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('desktops') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPONENTS - GPUs
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('components'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('GPU Brand', 'Марка GPU', 'select', '["NVIDIA", "AMD", "Intel"]', '["NVIDIA", "AMD", "Intel"]', true, true, 1),
  ('GPU Series', 'Серия', 'select', '["RTX 4000", "RTX 3000", "RTX 2000", "GTX 1600", "RX 7000", "RX 6000", "Arc"]', '["RTX 4000", "RTX 3000", "RTX 2000", "GTX 1600", "RX 7000", "RX 6000", "Arc"]', false, true, 2),
  ('VRAM', 'VRAM', 'select', '["4GB", "6GB", "8GB", "10GB", "12GB", "16GB", "24GB"]', '["4GB", "6GB", "8GB", "10GB", "12GB", "16GB", "24GB"]', true, true, 3),
  ('Memory Type', 'Тип памет', 'select', '["GDDR5", "GDDR6", "GDDR6X"]', '["GDDR5", "GDDR6", "GDDR6X"]', false, true, 4),
  ('Cooling', 'Охлаждане', 'select', '["Single Fan", "Dual Fan", "Triple Fan", "Blower", "Liquid"]', '["Един вентилатор", "Два вентилатора", "Три вентилатора", "Blower", "Водно"]', false, true, 5),
  ('Length', 'Дължина', 'select', '["Under 200mm", "200-250mm", "250-300mm", "300mm+"]', '["Под 200mm", "200-250mm", "250-300mm", "300mm+"]', false, true, 6),
  ('Power Required', 'Необходима мощност', 'select', '["Under 150W", "150-200W", "200-300W", "300-400W", "400W+"]', '["Под 150W", "150-200W", "200-300W", "300-400W", "400W+"]', false, true, 7)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('components') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- MONITORS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('monitors'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Screen Size', 'Размер', 'select', '["Under 22\"", "22-24\"", "24-27\"", "27-32\"", "32-34\"", "34\"+"]', '["Под 22\"", "22-24\"", "24-27\"", "27-32\"", "32-34\"", "34\"+"]', true, true, 1),
  ('Resolution', 'Резолюция', 'select', '["1080p FHD", "1440p QHD", "4K UHD", "5K", "Ultrawide 2560x1080", "Ultrawide 3440x1440"]', '["1080p FHD", "1440p QHD", "4K UHD", "5K", "Ultrawide 2560x1080", "Ultrawide 3440x1440"]', true, true, 2),
  ('Panel Type', 'Тип панел', 'select', '["IPS", "VA", "TN", "OLED", "Mini-LED"]', '["IPS", "VA", "TN", "OLED", "Mini-LED"]', false, true, 3),
  ('Refresh Rate', 'Честота', 'select', '["60Hz", "75Hz", "100Hz", "120Hz", "144Hz", "165Hz", "180Hz", "240Hz", "360Hz"]', '["60Hz", "75Hz", "100Hz", "120Hz", "144Hz", "165Hz", "180Hz", "240Hz", "360Hz"]', true, true, 4),
  ('Response Time', 'Време реакция', 'select', '["1ms", "2ms", "4ms", "5ms", "8ms+"]', '["1ms", "2ms", "4ms", "5ms", "8ms+"]', false, true, 5),
  ('Aspect Ratio', 'Съотношение', 'select', '["16:9", "21:9", "32:9", "16:10", "4:3"]', '["16:9", "21:9", "32:9", "16:10", "4:3"]', false, true, 6),
  ('HDR', 'HDR', 'select', '["No HDR", "HDR10", "HDR400", "HDR600", "HDR1000", "Dolby Vision"]', '["Без HDR", "HDR10", "HDR400", "HDR600", "HDR1000", "Dolby Vision"]', false, true, 7),
  ('Adaptive Sync', 'Адаптивен синхрон', 'multiselect', '["G-Sync", "G-Sync Compatible", "FreeSync", "FreeSync Premium", "FreeSync Premium Pro"]', '["G-Sync", "G-Sync Compatible", "FreeSync", "FreeSync Premium", "FreeSync Premium Pro"]', false, true, 8),
  ('Curved', 'Извит', 'boolean', '[]', '[]', false, true, 9),
  ('Speakers Built-in', 'Вградени тонколони', 'boolean', '[]', '[]', false, true, 10)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('monitors') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- TV & AUDIO - TELEVISIONS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, v.name, v.name_bg, v.attribute_type, v.options::jsonb, v.options_bg::jsonb, v.is_required, v.is_filterable, v.sort_order
FROM categories c
CROSS JOIN (VALUES
  ('Screen Size', 'Размер', 'select', '["32\"", "40-43\"", "50-55\"", "65\"", "75\"", "85\"+"]', '["32\"", "40-43\"", "50-55\"", "65\"", "75\"", "85\"+"]', true, true, 1),
  ('Display Type', 'Тип дисплей', 'select', '["LED", "QLED", "OLED", "Mini-LED", "MicroLED"]', '["LED", "QLED", "OLED", "Mini-LED", "MicroLED"]', true, true, 2),
  ('Resolution', 'Резолюция', 'select', '["HD 720p", "Full HD 1080p", "4K UHD", "8K"]', '["HD 720p", "Full HD 1080p", "4K UHD", "8K"]', true, true, 3),
  ('Smart TV', 'Смарт ТВ', 'select', '["No", "Android TV", "Google TV", "webOS", "Tizen", "Roku", "Fire TV"]', '["Не", "Android TV", "Google TV", "webOS", "Tizen", "Roku", "Fire TV"]', false, true, 4),
  ('HDR Support', 'HDR поддръжка', 'multiselect', '["HDR10", "HDR10+", "Dolby Vision", "HLG"]', '["HDR10", "HDR10+", "Dolby Vision", "HLG"]', false, true, 5),
  ('Refresh Rate', 'Честота', 'select', '["60Hz", "100Hz", "120Hz", "144Hz"]', '["60Hz", "100Hz", "120Hz", "144Hz"]', false, true, 6),
  ('HDMI Ports', 'HDMI портове', 'select', '["1", "2", "3", "4", "5+"]', '["1", "2", "3", "4", "5+"]', false, true, 7)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE c.name = 'TV & Audio'
ON CONFLICT DO NOTHING;

-- ============================================
-- HEADPHONES
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, v.name, v.name_bg, v.attribute_type, v.options::jsonb, v.options_bg::jsonb, v.is_required, v.is_filterable, v.sort_order
FROM categories c
CROSS JOIN (VALUES
  ('Type', 'Тип', 'select', '["Over-Ear", "On-Ear", "In-Ear", "True Wireless", "Bone Conduction"]', '["Над ушите", "На ушите", "В ушите", "Напълно безжични", "Костна проводимост"]', true, true, 1),
  ('Connection', 'Връзка', 'select', '["Wired", "Bluetooth", "Wired + Bluetooth", "2.4GHz Wireless"]', '["Кабелни", "Bluetooth", "Кабелни + Bluetooth", "2.4GHz безжични"]', true, true, 2),
  ('Noise Cancelling', 'Шумопотискане', 'select', '["None", "Passive", "Active (ANC)"]', '["Няма", "Пасивно", "Активно (ANC)"]', false, true, 3),
  ('Microphone', 'Микрофон', 'boolean', '[]', '[]', false, true, 4),
  ('Driver Size', 'Размер драйвер', 'select', '["Under 30mm", "30-40mm", "40-50mm", "50mm+"]', '["Под 30mm", "30-40mm", "40-50mm", "50mm+"]', false, true, 5),
  ('Battery Life', 'Живот батерия', 'select', '["Under 10h", "10-20h", "20-30h", "30-40h", "40h+"]', '["Под 10ч", "10-20ч", "20-30ч", "30-40ч", "40ч+"]', false, true, 6),
  ('Foldable', 'Сгъваеми', 'boolean', '[]', '[]', false, true, 7)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE c.slug = 'tv-headphones' OR c.name LIKE '%Headphones%'
ON CONFLICT DO NOTHING;

-- ============================================
-- CAMERAS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, v.name, v.name_bg, v.attribute_type, v.options::jsonb, v.options_bg::jsonb, v.is_required, v.is_filterable, v.sort_order
FROM categories c
CROSS JOIN (VALUES
  ('Camera Type', 'Тип камера', 'select', '["DSLR", "Mirrorless", "Compact", "Action Camera", "Instant", "Film"]', '["DSLR", "Безогледална", "Компактна", "Екшън камера", "Моментална", "Филмова"]', true, true, 1),
  ('Sensor Size', 'Размер сензор', 'select', '["1/2.3\"", "1\"", "Micro Four Thirds", "APS-C", "Full Frame", "Medium Format"]', '["1/2.3\"", "1\"", "Micro Four Thirds", "APS-C", "Full Frame", "Среден формат"]', false, true, 2),
  ('Megapixels', 'Мегапиксели', 'select', '["Under 12MP", "12-20MP", "20-30MP", "30-50MP", "50MP+"]', '["Под 12MP", "12-20MP", "20-30MP", "30-50MP", "50MP+"]', false, true, 3),
  ('Video Resolution', 'Видео резолюция', 'select', '["1080p", "4K", "6K", "8K"]', '["1080p", "4K", "6K", "8K"]', false, true, 4),
  ('Image Stabilization', 'Стабилизация', 'select', '["None", "Lens-based (OIS)", "In-Body (IBIS)", "Both"]', '["Няма", "В обектива (OIS)", "В тялото (IBIS)", "И двете"]', false, true, 5),
  ('Lens Mount', 'Байонет', 'select', '["Canon EF", "Canon RF", "Nikon F", "Nikon Z", "Sony E", "Sony A", "Fuji X", "MFT", "Leica L"]', '["Canon EF", "Canon RF", "Nikon F", "Nikon Z", "Sony E", "Sony A", "Fuji X", "MFT", "Leica L"]', false, true, 6),
  ('Weather Sealed', 'Устойчив на влага', 'boolean', '[]', '[]', false, true, 7)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE c.name = 'Cameras'
ON CONFLICT DO NOTHING;

-- ============================================
-- AUTOMOTIVE - VEHICLES (More detailed)
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('vehicles'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Doors', 'Врати', 'select', '["2", "3", "4", "5"]', '["2", "3", "4", "5"]', false, true, 8),
  ('Seats', 'Места', 'select', '["2", "4", "5", "6", "7", "8", "9+"]', '["2", "4", "5", "6", "7", "8", "9+"]', false, true, 9),
  ('Engine Size', 'Обем двигател', 'select', '["Under 1.0L", "1.0-1.5L", "1.5-2.0L", "2.0-2.5L", "2.5-3.0L", "3.0-4.0L", "4.0L+", "Electric"]', '["Под 1.0L", "1.0-1.5L", "1.5-2.0L", "2.0-2.5L", "2.5-3.0L", "3.0-4.0L", "4.0L+", "Електрически"]', false, true, 10),
  ('Horsepower', 'Конски сили', 'select', '["Under 100hp", "100-150hp", "150-200hp", "200-300hp", "300-400hp", "400-500hp", "500hp+"]', '["Под 100к.с.", "100-150к.с.", "150-200к.с.", "200-300к.с.", "300-400к.с.", "400-500к.с.", "500к.с.+"]', false, true, 11),
  ('Drivetrain', 'Задвижване', 'select', '["FWD", "RWD", "AWD", "4x4"]', '["Предно", "Задно", "Пълно AWD", "4x4"]', false, true, 12),
  ('Color', 'Цвят', 'select', '["White", "Black", "Silver", "Gray", "Blue", "Red", "Green", "Brown", "Beige", "Other"]', '["Бял", "Черен", "Сребрист", "Сив", "Син", "Червен", "Зелен", "Кафяв", "Бежов", "Друг"]', false, true, 13),
  ('Euro Standard', 'Евро стандарт', 'select', '["Euro 3", "Euro 4", "Euro 5", "Euro 6", "Euro 6d"]', '["Евро 3", "Евро 4", "Евро 5", "Евро 6", "Евро 6d"]', false, true, 14),
  ('Service History', 'Сервизна история', 'select', '["Full", "Partial", "None", "Unknown"]', '["Пълна", "Частична", "Няма", "Неизвестна"]', false, true, 15),
  ('Accident Free', 'Без катастрофи', 'boolean', '[]', '[]', false, true, 16),
  ('First Owner', 'Първи собственик', 'boolean', '[]', '[]', false, true, 17)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('vehicles') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- AUTOMOTIVE - PARTS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT c.id, v.name, v.name_bg, v.attribute_type, v.options::jsonb, v.options_bg::jsonb, v.is_required, v.is_filterable, v.sort_order
FROM categories c
CROSS JOIN (VALUES
  ('Part Condition', 'Състояние на частта', 'select', '["New OEM", "New Aftermarket", "Used", "Refurbished", "For Rebuild"]', '["Ново OEM", "Ново алтернативно", "Употребявано", "Реновирано", "За ремонт"]', true, true, 1),
  ('Compatible Makes', 'Съвместими марки', 'text', '[]', '[]', true, true, 2),
  ('Compatible Years', 'Съвместими години', 'text', '[]', '[]', false, true, 3),
  ('Part Number', 'Номер на част', 'text', '[]', '[]', false, true, 4),
  ('OEM Number', 'OEM номер', 'text', '[]', '[]', false, true, 5),
  ('Position', 'Позиция', 'select', '["Front", "Rear", "Left", "Right", "Front Left", "Front Right", "Rear Left", "Rear Right", "All"]', '["Отпред", "Отзад", "Ляво", "Дясно", "Преден ляв", "Преден десен", "Заден ляв", "Заден десен", "Всички"]', false, true, 6)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE c.name = 'Parts & Components'
ON CONFLICT DO NOTHING;

-- ============================================
-- FASHION - MORE DETAIL
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('fashion'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Shoe Size EU', 'Размер обувки EU', 'select', '["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"]', '["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"]', false, true, 5),
  ('Clothing Size', 'Размер дреха', 'select', '["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size"]', '["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "Един размер"]', false, true, 6),
  ('Style', 'Стил', 'select', '["Casual", "Formal", "Sport", "Streetwear", "Vintage", "Bohemian", "Classic", "Minimalist"]', '["Ежедневен", "Официален", "Спортен", "Улично", "Винтидж", "Бохемски", "Класически", "Минималистичен"]', false, true, 7),
  ('Season', 'Сезон', 'multiselect', '["Spring", "Summer", "Fall", "Winter", "All Season"]', '["Пролет", "Лято", "Есен", "Зима", "Всички сезони"]', false, true, 8),
  ('Pattern', 'Шарка', 'select', '["Solid", "Striped", "Plaid", "Floral", "Animal Print", "Geometric", "Abstract", "Camo"]', '["Едноцветен", "Раирано", "Каре", "Флорален", "Животински принт", "Геометричен", "Абстрактен", "Камуфлаж"]', false, true, 9)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('fashion') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- HOME & KITCHEN - MORE DETAIL
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('home'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Furniture Type', 'Тип мебел', 'select', '["Sofa", "Chair", "Table", "Bed", "Wardrobe", "Desk", "Shelf", "Cabinet", "Other"]', '["Диван", "Стол", "Маса", "Легло", "Гардероб", "Бюро", "Рафт", "Шкаф", "Друго"]', false, true, 4),
  ('Dimensions', 'Размери', 'text', '[]', '[]', false, false, 5),
  ('Assembly Required', 'Изисква сглобяване', 'boolean', '[]', '[]', false, true, 6),
  ('Weight Capacity', 'Натоварване', 'select', '["Under 50kg", "50-100kg", "100-150kg", "150-200kg", "200kg+"]', '["Под 50кг", "50-100кг", "100-150кг", "150-200кг", "200кг+"]', false, true, 7)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('home') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- GAMING - MORE DETAIL
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('gaming'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Console Generation', 'Поколение конзола', 'select', '["Current Gen", "Last Gen", "Retro", "Handheld"]', '["Текущо поколение", "Предишно поколение", "Ретро", "Преносимо"]', false, true, 3),
  ('Region', 'Регион', 'select', '["PAL", "NTSC", "Region Free"]', '["PAL", "NTSC", "Без регион"]', false, true, 4),
  ('Game Rating', 'Рейтинг игра', 'select', '["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18"]', '["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18"]', false, true, 5),
  ('Multiplayer', 'Мултиплейър', 'multiselect', '["Local Co-op", "Online Co-op", "Competitive Online", "Splitscreen", "Single Player Only"]', '["Локален ко-оп", "Онлайн ко-оп", "Онлайн състезателен", "Сплит скрийн", "Само сингъл плейър"]', false, true, 6),
  ('Storage Size', 'Размер на играта', 'select', '["Under 10GB", "10-25GB", "25-50GB", "50-100GB", "100GB+"]', '["Под 10GB", "10-25GB", "25-50GB", "50-100GB", "100GB+"]', false, true, 7),
  ('Includes Case/Manual', 'С кутия/ръководство', 'boolean', '[]', '[]', false, true, 8)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('gaming') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- BABY & KIDS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('baby-kids'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Age Range', 'Възраст', 'select', '["0-3 months", "3-6 months", "6-12 months", "1-2 years", "2-3 years", "3-5 years", "5-8 years", "8-12 years", "12+ years"]', '["0-3 месеца", "3-6 месеца", "6-12 месеца", "1-2 години", "2-3 години", "3-5 години", "5-8 години", "8-12 години", "12+ години"]', false, true, 1),
  ('Gender', 'Пол', 'select', '["Boys", "Girls", "Unisex"]', '["Момчета", "Момичета", "Унисекс"]', false, true, 2),
  ('Safety Certified', 'Сертификат безопасност', 'boolean', '[]', '[]', false, true, 3),
  ('Baby Size', 'Размер бебе', 'select', '["Preemie", "Newborn", "0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M", "2T", "3T", "4T", "5T"]', '["Недоносено", "Новородено", "0-3М", "3-6М", "6-9М", "9-12М", "12-18М", "18-24М", "2T", "3T", "4T", "5T"]', false, true, 4)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('baby-kids') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- BEAUTY
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('beauty'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Skin Type', 'Тип кожа', 'multiselect', '["Normal", "Dry", "Oily", "Combination", "Sensitive", "Mature"]', '["Нормална", "Суха", "Мазна", "Комбинирана", "Чувствителна", "Зряла"]', false, true, 1),
  ('Product Form', 'Форма на продукт', 'select', '["Cream", "Gel", "Serum", "Oil", "Foam", "Spray", "Powder", "Liquid"]', '["Крем", "Гел", "Серум", "Олио", "Пяна", "Спрей", "Пудра", "Течност"]', false, true, 2),
  ('Ingredients', 'Съставки', 'multiselect', '["Vitamin C", "Retinol", "Hyaluronic Acid", "Niacinamide", "Salicylic Acid", "SPF", "Natural/Organic"]', '["Витамин C", "Ретинол", "Хиалуронова киселина", "Ниацинамид", "Салицилова киселина", "SPF", "Натурално/Органично"]', false, true, 3),
  ('Cruelty Free', 'Не тествано на животни', 'boolean', '[]', '[]', false, true, 4),
  ('Vegan', 'Веган', 'boolean', '[]', '[]', false, true, 5),
  ('Size/Volume', 'Размер/Обем', 'select', '["Travel Size", "Mini", "Standard", "Large", "Value Size"]', '["Пътен размер", "Мини", "Стандартен", "Голям", "Икономичен"]', false, true, 6)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('beauty') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- SPORTS & OUTDOORS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('sports'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Sport Type', 'Вид спорт', 'multiselect', '["Running", "Cycling", "Swimming", "Hiking", "Fitness", "Yoga", "Basketball", "Football", "Tennis", "Golf", "Skiing", "Snowboarding"]', '["Бягане", "Колоездене", "Плуване", "Туризъм", "Фитнес", "Йога", "Баскетбол", "Футбол", "Тенис", "Голф", "Ски", "Сноуборд"]', false, true, 1),
  ('Skill Level', 'Ниво', 'select', '["Beginner", "Intermediate", "Advanced", "Professional"]', '["Начинаещ", "Средно напреднал", "Напреднал", "Професионален"]', false, true, 2),
  ('Indoor/Outdoor', 'Вътре/Вън', 'select', '["Indoor", "Outdoor", "Both"]', '["На закрито", "На открито", "И двете"]', false, true, 3),
  ('Weight', 'Тегло', 'select', '["Ultra Light", "Light", "Medium", "Heavy"]', '["Ултра леко", "Леко", "Средно", "Тежко"]', false, true, 4)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('sports') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- JEWELRY & WATCHES
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('jewelry-watches'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Jewelry Type', 'Тип бижу', 'select', '["Necklace", "Bracelet", "Ring", "Earrings", "Watch", "Pendant", "Brooch", "Anklet"]', '["Колие", "Гривна", "Пръстен", "Обеци", "Часовник", "Висулка", "Брошка", "Гривна за глезен"]', false, true, 1),
  ('Metal Type', 'Вид метал', 'select', '["Gold 24K", "Gold 18K", "Gold 14K", "Gold 9K", "White Gold", "Rose Gold", "Silver 925", "Platinum", "Stainless Steel", "Titanium", "Brass", "Costume"]', '["Злато 24К", "Злато 18К", "Злато 14К", "Злато 9К", "Бяло злато", "Розово злато", "Сребро 925", "Платина", "Неръждаема стомана", "Титан", "Месинг", "Бижутерия"]', false, true, 2),
  ('Gemstone', 'Камък', 'multiselect', '["Diamond", "Ruby", "Sapphire", "Emerald", "Pearl", "Opal", "Topaz", "Amethyst", "Aquamarine", "Cubic Zirconia", "None"]', '["Диамант", "Рубин", "Сапфир", "Изумруд", "Перла", "Опал", "Топаз", "Аметист", "Аквамарин", "Кубичен цирконий", "Без камък"]', false, true, 3),
  ('Watch Type', 'Тип часовник', 'select', '["Analog", "Digital", "Smart", "Hybrid", "Chronograph", "Dive", "Dress", "Sport"]', '["Аналогов", "Дигитален", "Смарт", "Хибриден", "Хронограф", "Водолазен", "Елегантен", "Спортен"]', false, true, 4),
  ('Watch Movement', 'Механизъм', 'select', '["Automatic", "Mechanical", "Quartz", "Solar", "Kinetic"]', '["Автоматичен", "Механичен", "Кварцов", "Соларен", "Кинетичен"]', false, true, 5),
  ('Ring Size', 'Размер пръстен', 'select', '["5", "6", "7", "8", "9", "10", "11", "12", "13"]', '["5", "6", "7", "8", "9", "10", "11", "12", "13"]', false, true, 6),
  ('Water Resistant', 'Водоустойчив', 'select', '["No", "30m", "50m", "100m", "200m", "300m+"]', '["Не", "30м", "50м", "100м", "200м", "300м+"]', false, true, 7)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('jewelry-watches') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- PETS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('pets'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Pet Type', 'Вид домашен любимец', 'select', '["Dog", "Cat", "Bird", "Fish", "Small Animal", "Reptile", "Horse"]', '["Куче", "Котка", "Птица", "Риба", "Малко животно", "Влечуго", "Кон"]', true, true, 1),
  ('Pet Size', 'Размер', 'select', '["Extra Small", "Small", "Medium", "Large", "Extra Large", "Giant"]', '["Много малък", "Малък", "Среден", "Голям", "Много голям", "Гигантски"]', false, true, 2),
  ('Life Stage', 'Етап от живота', 'select', '["Puppy/Kitten", "Junior", "Adult", "Senior", "All Life Stages"]', '["Малко/Коте", "Юноша", "Възрастен", "Старчески", "Всички етапи"]', false, true, 3),
  ('Product Type', 'Тип продукт', 'select', '["Food", "Treats", "Toys", "Beds & Furniture", "Bowls & Feeders", "Collars & Leashes", "Grooming", "Health & Wellness", "Training", "Travel"]', '["Храна", "Лакомства", "Играчки", "Легла и мебели", "Купи и хранилки", "Нашийници и каишки", "Грижа", "Здраве", "Обучение", "Пътуване"]', false, true, 4)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('pets') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- BOOKS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('books'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Format', 'Формат', 'select', '["Hardcover", "Paperback", "E-book", "Audiobook", "Board Book"]', '["Твърди корици", "Меки корици", "Е-книга", "Аудиокнига", "Картонена книга"]', false, true, 1),
  ('Language', 'Език', 'select', '["Bulgarian", "English", "German", "French", "Spanish", "Russian", "Other"]', '["Български", "Английски", "Немски", "Френски", "Испански", "Руски", "Друг"]', false, true, 2),
  ('Genre', 'Жанр', 'multiselect', '["Fiction", "Non-Fiction", "Romance", "Mystery", "Sci-Fi", "Fantasy", "Biography", "History", "Self-Help", "Business", "Children", "Young Adult"]', '["Художествена", "Нехудожествена", "Романтика", "Мистерия", "Научна фантастика", "Фентъзи", "Биография", "История", "Самопомощ", "Бизнес", "Детска", "Тийнейджърска"]', false, true, 3),
  ('Publication Year', 'Година на издаване', 'select', '["2024", "2023", "2022", "2021", "2020", "2015-2019", "2010-2014", "2000-2009", "1990-1999", "Before 1990"]', '["2024", "2023", "2022", "2021", "2020", "2015-2019", "2010-2014", "2000-2009", "1990-1999", "Преди 1990"]', false, true, 4)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('books') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- TOOLS & HOME IMPROVEMENT
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('tools-home'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Tool Type', 'Тип инструмент', 'select', '["Power Tool", "Hand Tool", "Measuring", "Safety", "Storage"]', '["Електроинструмент", "Ръчен инструмент", "Измервателен", "Безопасност", "Съхранение"]', false, true, 1),
  ('Power Source', 'Захранване', 'select', '["Corded Electric", "Cordless/Battery", "Pneumatic", "Manual", "Gas"]', '["С кабел", "Безжичен/Батерия", "Пневматичен", "Ръчен", "Бензинов"]', false, true, 2),
  ('Voltage', 'Волтаж', 'select', '["12V", "18V", "20V", "36V", "40V", "60V", "N/A"]', '["12V", "18V", "20V", "36V", "40V", "60V", "Не е приложимо"]', false, true, 3),
  ('Includes Accessories', 'Включени аксесоари', 'boolean', '[]', '[]', false, true, 4),
  ('Professional Grade', 'Професионален клас', 'boolean', '[]', '[]', false, true, 5)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('tools-home') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- COLLECTIBLES & ART
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('collectibles'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Collectible Type', 'Тип колекция', 'select', '["Art", "Antiques", "Coins", "Stamps", "Sports Memorabilia", "Trading Cards", "Vintage", "Comics", "Toys", "Autographs"]', '["Изкуство", "Антики", "Монети", "Марки", "Спортни сувенири", "Карти за търговия", "Винтидж", "Комикси", "Играчки", "Автографи"]', false, true, 1),
  ('Era/Period', 'Ера/Период', 'select', '["Ancient", "Medieval", "18th Century", "19th Century", "Early 20th Century", "Mid-Century", "Vintage (1970-1990)", "Modern", "Contemporary"]', '["Древен", "Средновековен", "18-ти век", "19-ти век", "Начало на 20-ти век", "Средата на века", "Винтидж (1970-1990)", "Модерен", "Съвременен"]', false, true, 2),
  ('Authenticity', 'Автентичност', 'select', '["Certified/Authenticated", "COA Included", "Unverified", "Reproduction"]', '["Сертифицирано", "Със сертификат", "Непроверено", "Репродукция"]', false, true, 3),
  ('Signed', 'Подписано', 'boolean', '[]', '[]', false, true, 4),
  ('Numbered Edition', 'Номерирано издание', 'boolean', '[]', '[]', false, true, 5)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('collectibles') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- MUSICAL INSTRUMENTS
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('musical-instruments'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Instrument Type', 'Тип инструмент', 'select', '["Guitar", "Bass", "Keyboard/Piano", "Drums/Percussion", "Wind", "String", "DJ Equipment", "Recording", "Accessories"]', '["Китара", "Бас", "Клавиатура/Пиано", "Барабани/Перкусии", "Духови", "Струнни", "DJ оборудване", "Записващо", "Аксесоари"]', false, true, 1),
  ('Skill Level', 'Ниво', 'select', '["Beginner", "Intermediate", "Advanced", "Professional"]', '["Начинаещ", "Междинен", "Напреднал", "Професионален"]', false, true, 2),
  ('Acoustic/Electric', 'Акустичен/Електрически', 'select', '["Acoustic", "Electric", "Acoustic-Electric", "Electronic"]', '["Акустичен", "Електрически", "Акустично-електрически", "Електронен"]', false, true, 3),
  ('Hand Orientation', 'Ориентация', 'select', '["Right-Handed", "Left-Handed", "Ambidextrous"]', '["За десничари", "За левичари", "Амбидекстър"]', false, true, 4),
  ('Includes Case', 'С калъф', 'boolean', '[]', '[]', false, true, 5)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('musical-instruments') IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================
-- SMART HOME
-- ============================================
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
SELECT get_cat_id('smart-home'), name, name_bg, attribute_type, options::jsonb, options_bg::jsonb, is_required, is_filterable, sort_order
FROM (VALUES
  ('Ecosystem', 'Екосистема', 'multiselect', '["Amazon Alexa", "Google Home", "Apple HomeKit", "Samsung SmartThings", "Matter Compatible", "IFTTT"]', '["Amazon Alexa", "Google Home", "Apple HomeKit", "Samsung SmartThings", "Matter съвместим", "IFTTT"]', false, true, 1),
  ('Connection Type', 'Тип връзка', 'multiselect', '["WiFi", "Bluetooth", "Zigbee", "Z-Wave", "Thread", "Hub Required"]', '["WiFi", "Bluetooth", "Zigbee", "Z-Wave", "Thread", "Изисква хъб"]', false, true, 2),
  ('Voice Control', 'Гласов контрол', 'boolean', '[]', '[]', false, true, 3),
  ('Remote Access', 'Отдалечен достъп', 'boolean', '[]', '[]', false, true, 4),
  ('Energy Monitoring', 'Мониторинг на енергия', 'boolean', '[]', '[]', false, true, 5)
) AS v(name, name_bg, attribute_type, options, options_bg, is_required, is_filterable, sort_order)
WHERE get_cat_id('smart-home') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Clean up helper function
DROP FUNCTION IF EXISTS get_cat_id(TEXT);
;
