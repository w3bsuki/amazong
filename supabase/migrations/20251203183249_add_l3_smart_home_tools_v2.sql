
-- L3 for Smart Home - Smart Lighting
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Smart Bulbs', 'Смарт крушки', 'smart-lighting-bulbs', id, 1 FROM categories WHERE slug = 'smart-lighting'
UNION ALL
SELECT 'LED Strips', 'LED ленти', 'smart-lighting-strips', id, 2 FROM categories WHERE slug = 'smart-lighting'
UNION ALL
SELECT 'Smart Switches', 'Смарт ключове', 'smart-lighting-switches', id, 3 FROM categories WHERE slug = 'smart-lighting';

-- L3 for Smart Home - Security
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Indoor Cameras', 'Вътрешни камери', 'smart-security-indoor', id, 1 FROM categories WHERE slug = 'smart-security'
UNION ALL
SELECT 'Outdoor Cameras', 'Външни камери', 'smart-security-outdoor', id, 2 FROM categories WHERE slug = 'smart-security'
UNION ALL
SELECT 'Video Doorbells', 'Видео звънци', 'smart-security-doorbells', id, 3 FROM categories WHERE slug = 'smart-security'
UNION ALL
SELECT 'Smart Locks', 'Смарт брави', 'smart-security-locks', id, 4 FROM categories WHERE slug = 'smart-security'
UNION ALL
SELECT 'Motion Sensors', 'Датчици за движение', 'smart-security-sensors', id, 5 FROM categories WHERE slug = 'smart-security';

-- L3 for Smart Home - Climate
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Smart Thermostats', 'Смарт термостати', 'smart-climate-thermostats', id, 1 FROM categories WHERE slug = 'smart-climate'
UNION ALL
SELECT 'Smart AC Controllers', 'Смарт контролери за климатик', 'smart-climate-ac', id, 2 FROM categories WHERE slug = 'smart-climate'
UNION ALL
SELECT 'Air Quality Monitors', 'Монитори за качество на въздуха', 'smart-climate-airquality', id, 3 FROM categories WHERE slug = 'smart-climate';

-- L3 for Tools - Power Tools
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Drills', 'Бормашини', 'powertools-drills', id, 1 FROM categories WHERE slug = 'power-tools'
UNION ALL
SELECT 'Saws', 'Триони', 'powertools-saws', id, 2 FROM categories WHERE slug = 'power-tools'
UNION ALL
SELECT 'Sanders', 'Шлифовъчни машини', 'powertools-sanders', id, 3 FROM categories WHERE slug = 'power-tools'
UNION ALL
SELECT 'Grinders', 'Ъглошлайфи', 'powertools-grinders', id, 4 FROM categories WHERE slug = 'power-tools'
UNION ALL
SELECT 'Impact Wrenches', 'Ударни гайковерти', 'powertools-wrenches', id, 5 FROM categories WHERE slug = 'power-tools';

-- L3 for Tools - Hand Tools
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Screwdrivers', 'Отвертки', 'handtools-screwdrivers', id, 1 FROM categories WHERE slug = 'hand-tools'
UNION ALL
SELECT 'Wrenches & Spanners', 'Гаечни ключове', 'handtools-wrenches', id, 2 FROM categories WHERE slug = 'hand-tools'
UNION ALL
SELECT 'Pliers', 'Клещи', 'handtools-pliers', id, 3 FROM categories WHERE slug = 'hand-tools'
UNION ALL
SELECT 'Hammers', 'Чукове', 'handtools-hammers', id, 4 FROM categories WHERE slug = 'hand-tools'
UNION ALL
SELECT 'Measuring Tools', 'Измервателни инструменти', 'handtools-measuring', id, 5 FROM categories WHERE slug = 'hand-tools';

-- L3 for Garden Tools
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Lawn Mowers', 'Косачки', 'gardentools-mowers', id, 1 FROM categories WHERE slug = 'garden-tools'
UNION ALL
SELECT 'Hedge Trimmers', 'Храсторези', 'gardentools-trimmers', id, 2 FROM categories WHERE slug = 'garden-tools'
UNION ALL
SELECT 'Chainsaws', 'Верижни триони', 'gardentools-chainsaws', id, 3 FROM categories WHERE slug = 'garden-tools'
UNION ALL
SELECT 'Leaf Blowers', 'Духалки за листа', 'gardentools-blowers', id, 4 FROM categories WHERE slug = 'garden-tools'
UNION ALL
SELECT 'Watering Equipment', 'Поливна техника', 'gardentools-watering', id, 5 FROM categories WHERE slug = 'garden-tools';
;
