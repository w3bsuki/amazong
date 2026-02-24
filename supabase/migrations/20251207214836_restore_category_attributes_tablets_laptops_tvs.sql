-- Restore category_attributes for Tablets, Laptops, TVs, Monitors

-- Tablets attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('tablets', 'Brand', 'Марка', 'select', true, true, '["Apple", "Samsung", "Lenovo", "Huawei", "Microsoft", "Amazon", "Xiaomi", "Other"]', '["Apple", "Samsung", "Lenovo", "Huawei", "Microsoft", "Amazon", "Xiaomi", "Друга"]', 1),
  ('tablets', 'Model', 'Модел', 'text', false, true, '[]', '[]', 2),
  ('tablets', 'Storage Capacity', 'Памет', 'select', true, true, '["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]', '["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]', 3),
  ('tablets', 'Screen Size', 'Размер на екрана', 'select', true, true, '["7-8 inch", "9-10 inch", "11-12 inch", "12+ inch"]', '["7-8 инча", "9-10 инча", "11-12 инча", "12+ инча"]', 4),
  ('tablets', 'Connectivity', 'Свързаност', 'select', false, true, '["WiFi Only", "WiFi + Cellular"]', '["Само WiFi", "WiFi + Мобилни данни"]', 5),
  ('tablets', 'Color', 'Цвят', 'text', false, true, '[]', '[]', 6),
  ('tablets', 'Includes', 'Включва', 'multiselect', false, false, '["Original Box", "Charger", "Case", "Stylus", "Keyboard"]', '["Оригинална кутия", "Зарядно", "Калъф", "Стилус", "Клавиатура"]', 7),
  ('tablets', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open Box", "Like New", "Good", "Fair", "For Parts"]', '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително", "За части"]', 8)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Laptops attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('laptops', 'Brand', 'Марка', 'select', true, true, '["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Microsoft", "Razer", "Samsung", "Other"]', '["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Microsoft", "Razer", "Samsung", "Друга"]', 1),
  ('laptops', 'Model', 'Модел', 'text', false, true, '[]', '[]', 2),
  ('laptops', 'Processor', 'Процесор', 'select', true, true, '["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3", "Other"]', '["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3", "Друг"]', 3),
  ('laptops', 'RAM', 'RAM памет', 'select', true, true, '["4GB", "8GB", "16GB", "32GB", "64GB"]', '["4GB", "8GB", "16GB", "32GB", "64GB"]', 4),
  ('laptops', 'Storage', 'Памет', 'select', true, true, '["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD", "1TB HDD", "256GB SSD + 1TB HDD"]', '["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD", "1TB HDD", "256GB SSD + 1TB HDD"]', 5),
  ('laptops', 'Screen Size', 'Размер на екрана', 'select', true, true, '["13\"", "14\"", "15\"", "15.6\"", "16\"", "17\"", "17.3\""]', '["13\"", "14\"", "15\"", "15.6\"", "16\"", "17\"", "17.3\""]', 6),
  ('laptops', 'GPU', 'Видеокарта', 'select', false, true, '["Integrated", "NVIDIA GTX", "NVIDIA RTX", "AMD Radeon", "Apple GPU"]', '["Интегрирана", "NVIDIA GTX", "NVIDIA RTX", "AMD Radeon", "Apple GPU"]', 7),
  ('laptops', 'Operating System', 'Операционна система', 'select', false, true, '["Windows 11", "Windows 10", "macOS", "Chrome OS", "Linux", "None"]', '["Windows 11", "Windows 10", "macOS", "Chrome OS", "Linux", "Без"]', 8),
  ('laptops', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open Box", "Like New", "Good", "Fair", "For Parts"]', '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително", "За части"]', 9)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- TVs attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('tvs', 'Brand', 'Марка', 'select', true, true, '["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Panasonic", "Other"]', '["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Panasonic", "Друга"]', 1),
  ('tvs', 'Screen Size', 'Размер на екрана', 'select', true, true, '["32\"", "40-43\"", "50-55\"", "60-65\"", "70-75\"", "77\"", "80\"+"]', '["32\"", "40-43\"", "50-55\"", "60-65\"", "70-75\"", "77\"", "80\"+"]', 2),
  ('tvs', 'Resolution', 'Резолюция', 'select', true, true, '["HD (720p)", "Full HD (1080p)", "4K UHD", "8K"]', '["HD (720p)", "Full HD (1080p)", "4K UHD", "8K"]', 3),
  ('tvs', 'Display Technology', 'Технология', 'select', false, true, '["LED", "QLED", "OLED", "Mini-LED", "Plasma"]', '["LED", "QLED", "OLED", "Mini-LED", "Плазма"]', 4),
  ('tvs', 'Smart TV', 'Smart TV', 'select', false, true, '["Android TV", "Google TV", "webOS", "Tizen", "Roku", "Fire TV", "Not Smart"]', '["Android TV", "Google TV", "webOS", "Tizen", "Roku", "Fire TV", "Не е Smart"]', 5),
  ('tvs', 'Refresh Rate', 'Честота', 'select', false, true, '["60Hz", "120Hz", "144Hz"]', '["60Hz", "120Hz", "144Hz"]', 6),
  ('tvs', 'HDR Support', 'HDR поддръжка', 'multiselect', false, true, '["HDR10", "HDR10+", "Dolby Vision", "HLG", "None"]', '["HDR10", "HDR10+", "Dolby Vision", "HLG", "Без"]', 7),
  ('tvs', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open Box", "Like New", "Good", "Fair", "For Parts"]', '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително", "За части"]', 8)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Monitors attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('monitors', 'Brand', 'Марка', 'select', true, true, '["Samsung", "LG", "Dell", "ASUS", "Acer", "BenQ", "AOC", "ViewSonic", "MSI", "Other"]', '["Samsung", "LG", "Dell", "ASUS", "Acer", "BenQ", "AOC", "ViewSonic", "MSI", "Друга"]', 1),
  ('monitors', 'Screen Size', 'Размер на екрана', 'select', true, true, '["21-22\"", "23-24\"", "27\"", "28-32\"", "34\" Ultrawide", "38\"+ Ultrawide", "49\" Super Ultrawide"]', '["21-22\"", "23-24\"", "27\"", "28-32\"", "34\" Ultrawide", "38\"+ Ultrawide", "49\" Super Ultrawide"]', 2),
  ('monitors', 'Resolution', 'Резолюция', 'select', true, true, '["Full HD (1080p)", "QHD (1440p)", "4K UHD", "5K", "WQHD Ultrawide"]', '["Full HD (1080p)", "QHD (1440p)", "4K UHD", "5K", "WQHD Ultrawide"]', 3),
  ('monitors', 'Panel Type', 'Тип панел', 'select', false, true, '["IPS", "VA", "TN", "OLED", "Mini-LED"]', '["IPS", "VA", "TN", "OLED", "Mini-LED"]', 4),
  ('monitors', 'Refresh Rate', 'Честота', 'select', false, true, '["60Hz", "75Hz", "100Hz", "120Hz", "144Hz", "165Hz", "240Hz", "360Hz"]', '["60Hz", "75Hz", "100Hz", "120Hz", "144Hz", "165Hz", "240Hz", "360Hz"]', 5),
  ('monitors', 'Response Time', 'Време за реакция', 'select', false, true, '["1ms", "2ms", "4ms", "5ms", "8ms"]', '["1ms", "2ms", "4ms", "5ms", "8ms"]', 6),
  ('monitors', 'Adaptive Sync', 'Адаптивна синхронизация', 'select', false, true, '["G-Sync", "FreeSync", "G-Sync Compatible", "None"]', '["G-Sync", "FreeSync", "G-Sync съвместим", "Без"]', 7),
  ('monitors', 'Curved', 'Извит', 'boolean', false, true, '[]', '[]', 8),
  ('monitors', 'Connectivity', 'Свързване', 'multiselect', false, false, '["HDMI", "DisplayPort", "USB-C", "VGA", "DVI"]', '["HDMI", "DisplayPort", "USB-C", "VGA", "DVI"]', 9),
  ('monitors', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open Box", "Like New", "Good", "Fair", "For Parts"]', '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително", "За части"]', 10)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Printers & Scanners attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('printers', 'Type', 'Тип', 'select', true, true, '["Inkjet Printer", "Laser Printer", "All-in-One", "Photo Printer", "3D Printer", "Scanner", "Plotter"]', '["Мастиленоструен принтер", "Лазерен принтер", "Мултифункционално", "Фото принтер", "3D принтер", "Скенер", "Плотер"]', 1),
  ('printers', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('printers', 'Print Type', 'Цвят/Черно-бял', 'select', false, true, '["Color", "Black & White"]', '["Цветен", "Черно-бял"]', 3),
  ('printers', 'Connectivity', 'Свързване', 'multiselect', false, true, '["USB", "WiFi", "Ethernet", "Bluetooth", "AirPrint"]', '["USB", "WiFi", "Ethernet", "Bluetooth", "AirPrint"]', 4),
  ('printers', 'Paper Size', 'Размер хартия', 'select', false, true, '["A4", "A3", "Letter", "Legal", "Photo Sizes"]', '["A4", "A3", "Letter", "Legal", "Фото размери"]', 5),
  ('printers', 'Functions', 'Функции', 'multiselect', false, false, '["Print", "Scan", "Copy", "Fax", "Duplex"]', '["Печат", "Сканиране", "Копиране", "Факс", "Двустранен печат"]', 6),
  ('printers', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Wearables attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('wearables', 'Type', 'Тип', 'select', true, true, '["Smartwatch", "Fitness Tracker", "Smart Ring", "Smart Glasses", "Kids Smartwatch"]', '["Смарт часовник", "Фитнес тракер", "Смарт пръстен", "Смарт очила", "Детски смарт часовник"]', 1),
  ('wearables', 'Brand', 'Марка', 'select', true, true, '["Apple", "Samsung", "Garmin", "Fitbit", "Xiaomi", "Huawei", "Amazfit", "Google", "Other"]', '["Apple", "Samsung", "Garmin", "Fitbit", "Xiaomi", "Huawei", "Amazfit", "Google", "Друга"]', 2),
  ('wearables', 'Model', 'Модел', 'text', false, true, '[]', '[]', 3),
  ('wearables', 'Compatible With', 'Съвместим с', 'multiselect', false, true, '["iPhone/iOS", "Android", "Both"]', '["iPhone/iOS", "Android", "И двете"]', 4),
  ('wearables', 'Size/Case', 'Размер/Корпус', 'select', false, true, '["Small (38-40mm)", "Medium (42-44mm)", "Large (45mm+)", "One Size"]', '["Малък (38-40мм)", "Среден (42-44мм)", "Голям (45мм+)", "Един размер"]', 5),
  ('wearables', 'Band Material', 'Материал каишка', 'select', false, true, '["Silicone", "Leather", "Metal", "Fabric", "Nylon"]', '["Силикон", "Кожа", "Метал", "Плат", "Найлон"]', 6),
  ('wearables', 'GPS', 'GPS', 'boolean', false, true, '[]', '[]', 7),
  ('wearables', 'Cellular', 'Мобилна връзка', 'boolean', false, true, '[]', '[]', 8),
  ('wearables', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open Box", "Like New", "Good", "Fair"]', '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително"]', 9)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Networking Equipment attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('networking', 'Type', 'Тип', 'select', true, true, '["Router", "Mesh System", "Range Extender", "Switch", "Access Point", "Modem", "Network Card"]', '["Рутер", "Mesh система", "Разширител", "Суич", "Точка за достъп", "Модем", "Мрежова карта"]', 1),
  ('networking', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 2),
  ('networking', 'WiFi Standard', 'WiFi стандарт', 'select', false, true, '["WiFi 4 (802.11n)", "WiFi 5 (802.11ac)", "WiFi 6 (802.11ax)", "WiFi 6E", "WiFi 7"]', '["WiFi 4 (802.11n)", "WiFi 5 (802.11ac)", "WiFi 6 (802.11ax)", "WiFi 6E", "WiFi 7"]', 3),
  ('networking', 'Speed', 'Скорост', 'select', false, true, '["N300", "AC750", "AC1200", "AC1900", "AX1800", "AX3000", "AX6000"]', '["N300", "AC750", "AC1200", "AC1900", "AX1800", "AX3000", "AX6000"]', 4),
  ('networking', 'Ports', 'Портове', 'select', false, false, '["1 LAN", "4 LAN", "5 LAN", "8 LAN", "8+ LAN"]', '["1 LAN", "4 LAN", "5 LAN", "8 LAN", "8+ LAN"]', 5),
  ('networking', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair"]', '["Ново", "Като ново", "Добро", "Задоволително"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
