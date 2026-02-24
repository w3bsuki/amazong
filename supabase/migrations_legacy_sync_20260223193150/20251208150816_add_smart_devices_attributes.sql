
-- Add attributes for Smart Devices parent category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('19c94316-3774-49b7-bff8-80115941a039', 'Smart Ecosystem', 'Смарт екосистема', 'multiselect', false, true,
   '["Amazon Alexa", "Google Home", "Apple HomeKit", "Samsung SmartThings", "Zigbee", "Z-Wave", "Matter"]',
   '["Amazon Alexa", "Google Home", "Apple HomeKit", "Samsung SmartThings", "Zigbee", "Z-Wave", "Matter"]',
   1),
  
  ('19c94316-3774-49b7-bff8-80115941a039', 'Connectivity', 'Свързване', 'multiselect', false, true,
   '["WiFi", "Bluetooth", "Zigbee", "Z-Wave", "Thread", "Matter"]',
   '["WiFi", "Bluetooth", "Zigbee", "Z-Wave", "Thread", "Matter"]',
   2),
  
  ('19c94316-3774-49b7-bff8-80115941a039', 'Brand', 'Марка', 'select', true, true,
   '["Amazon", "Google", "Apple", "Samsung", "Philips Hue", "Ring", "Nest", "Aqara", "Xiaomi", "Eufy", "TP-Link", "Other"]',
   '["Amazon", "Google", "Apple", "Samsung", "Philips Hue", "Ring", "Nest", "Aqara", "Xiaomi", "Eufy", "TP-Link", "Друга"]',
   3),
  
  ('19c94316-3774-49b7-bff8-80115941a039', 'Condition', 'Състояние', 'select', true, true,
   '["New Sealed", "New Open Box", "Like New", "Good", "Fair"]',
   '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително"]',
   4);

-- Add attributes for Smart Lighting
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('bcf3b70c-8504-4f9a-a33b-29bb46afdf45', 'Bulb Type', 'Тип крушка', 'select', true, true,
   '["LED Bulb (E27)", "LED Bulb (E14)", "LED Bulb (GU10)", "Light Strip", "Ceiling Light", "Floor Lamp", "Table Lamp", "Outdoor Light"]',
   '["LED крушка (E27)", "LED крушка (E14)", "LED крушка (GU10)", "LED лента", "Плафон", "Лампион", "Настолна лампа", "Външна лампа"]',
   1),
  
  ('bcf3b70c-8504-4f9a-a33b-29bb46afdf45', 'Color Options', 'Цветове', 'select', false, true,
   '["White Only", "Warm/Cool White", "Full RGB", "RGB + White"]',
   '["Само бяло", "Топло/Студено бяло", "Пълен RGB", "RGB + бяло"]',
   2),
  
  ('bcf3b70c-8504-4f9a-a33b-29bb46afdf45', 'Hub Required', 'Изисква хъб', 'boolean', false, true, '[]', '[]', 3),
  
  ('bcf3b70c-8504-4f9a-a33b-29bb46afdf45', 'Brand', 'Марка', 'select', true, true,
   '["Philips Hue", "IKEA Tradfri", "Xiaomi Yeelight", "LIFX", "Nanoleaf", "Govee", "Wiz", "Tuya", "Other"]',
   '["Philips Hue", "IKEA Tradfri", "Xiaomi Yeelight", "LIFX", "Nanoleaf", "Govee", "Wiz", "Tuya", "Друга"]',
   4);

-- Add attributes for Robot Vacuums
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('3fa3310f-4f77-4863-9ee2-151518f5522d', 'Features', 'Функции', 'multiselect', false, true,
   '["Mopping", "Auto-Empty Base", "Object Avoidance", "LiDAR Navigation", "Camera Navigation", "Multi-Floor Mapping", "Pet Hair Mode"]',
   '["Моп", "Автоизпразване", "Избягване на препятствия", "LiDAR навигация", "Камера навигация", "Многоетажно картографиране", "Режим за косми"]',
   1),
  
  ('3fa3310f-4f77-4863-9ee2-151518f5522d', 'Suction Power', 'Мощност засмукване', 'select', false, true,
   '["Under 2000Pa", "2000-4000Pa", "4000-6000Pa", "6000Pa+"]',
   '["Под 2000Pa", "2000-4000Pa", "4000-6000Pa", "Над 6000Pa"]',
   2),
  
  ('3fa3310f-4f77-4863-9ee2-151518f5522d', 'Battery Life', 'Живот на батерията', 'select', false, true,
   '["Under 90 min", "90-120 min", "120-180 min", "180min+"]',
   '["Под 90 мин", "90-120 мин", "120-180 мин", "Над 180 мин"]',
   3),
  
  ('3fa3310f-4f77-4863-9ee2-151518f5522d', 'Brand', 'Марка', 'select', true, true,
   '["iRobot Roomba", "Roborock", "Ecovacs Deebot", "Dreame", "Xiaomi", "Shark", "Eufy", "Samsung", "LG", "Other"]',
   '["iRobot Roomba", "Roborock", "Ecovacs Deebot", "Dreame", "Xiaomi", "Shark", "Eufy", "Samsung", "LG", "Друга"]',
   4),
  
  ('3fa3310f-4f77-4863-9ee2-151518f5522d', 'Condition', 'Състояние', 'select', true, true,
   '["New Sealed", "New Open Box", "Like New", "Good", "Fair"]',
   '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително"]',
   5);

-- Add attributes for Smart Locks
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('a27cf39e-edeb-4821-bbdb-9179880e1b43', 'Lock Type', 'Тип брава', 'select', true, true,
   '["Deadbolt", "Lever", "Knob", "Padlock", "Full Door Lock"]',
   '["Резе", "Дръжка", "Топка", "Катинар", "Пълна брава"]',
   1),
  
  ('a27cf39e-edeb-4821-bbdb-9179880e1b43', 'Unlock Methods', 'Методи за отключване', 'multiselect', false, true,
   '["PIN Code", "Fingerprint", "App", "Key Fob", "Physical Key", "Voice", "Auto-Unlock"]',
   '["ПИН код", "Пръстов отпечатък", "Приложение", "Ключодържател", "Физически ключ", "Гласов", "Автоматично"]',
   2),
  
  ('a27cf39e-edeb-4821-bbdb-9179880e1b43', 'Brand', 'Марка', 'select', true, true,
   '["Yale", "August", "Schlage", "Kwikset", "Eufy", "Aqara", "Nuki", "Tedee", "Other"]',
   '["Yale", "August", "Schlage", "Kwikset", "Eufy", "Aqara", "Nuki", "Tedee", "Друга"]',
   3);

-- Add attributes for Smart Security
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('04a7f563-3a6c-44ff-82b3-4fdc7dfcc42b', 'Device Type', 'Тип устройство', 'select', true, true,
   '["Indoor Camera", "Outdoor Camera", "Video Doorbell", "Motion Sensor", "Door/Window Sensor", "Alarm System", "Siren"]',
   '["Вътрешна камера", "Външна камера", "Видео звънец", "Сензор за движение", "Сензор за врата/прозорец", "Алармена система", "Сирена"]',
   1),
  
  ('04a7f563-3a6c-44ff-82b3-4fdc7dfcc42b', 'Video Resolution', 'Видео резолюция', 'select', false, true,
   '["720p HD", "1080p FHD", "2K", "4K UHD"]',
   '["720p HD", "1080p FHD", "2K", "4K UHD"]',
   2),
  
  ('04a7f563-3a6c-44ff-82b3-4fdc7dfcc42b', 'Night Vision', 'Нощно виждане', 'boolean', false, true, '[]', '[]', 3),
  
  ('04a7f563-3a6c-44ff-82b3-4fdc7dfcc42b', 'Power Source', 'Захранване', 'select', false, true,
   '["Battery", "Wired", "Solar", "Battery + Solar"]',
   '["Батерия", "Кабел", "Соларно", "Батерия + соларно"]',
   4),
  
  ('04a7f563-3a6c-44ff-82b3-4fdc7dfcc42b', 'Local Storage', 'Локално съхранение', 'boolean', false, true, '[]', '[]', 5),
  
  ('04a7f563-3a6c-44ff-82b3-4fdc7dfcc42b', 'Brand', 'Марка', 'select', true, true,
   '["Ring", "Nest/Google", "Arlo", "Eufy", "Blink", "Wyze", "Reolink", "Hikvision", "TP-Link Tapo", "Other"]',
   '["Ring", "Nest/Google", "Arlo", "Eufy", "Blink", "Wyze", "Reolink", "Hikvision", "TP-Link Tapo", "Друга"]',
   6);

-- Add attributes for Smart Thermostats
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('4722f5f9-2d26-4c03-a03f-e293865fc287', 'HVAC Compatibility', 'Съвместимост HVAC', 'multiselect', false, true,
   '["Central Heat/AC", "Heat Pump", "Radiant Floor", "Boiler", "Electric Baseboard"]',
   '["Централно отопление/климатик", "Термопомпа", "Подово отопление", "Бойлер", "Електрически конвектор"]',
   1),
  
  ('4722f5f9-2d26-4c03-a03f-e293865fc287', 'Features', 'Функции', 'multiselect', false, true,
   '["Learning", "Geofencing", "Remote Sensors", "Humidity Control", "Energy Reports", "Touch Screen"]',
   '["Самообучение", "Геолокация", "Външни сензори", "Контрол влажност", "Енергийни отчети", "Тъч екран"]',
   2),
  
  ('4722f5f9-2d26-4c03-a03f-e293865fc287', 'Brand', 'Марка', 'select', true, true,
   '["Nest", "Ecobee", "Honeywell", "Tado", "Netatmo", "Amazon", "Other"]',
   '["Nest", "Ecobee", "Honeywell", "Tado", "Netatmo", "Amazon", "Друга"]',
   3);
;
