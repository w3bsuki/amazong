
-- Add attributes for main Speakers category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  -- Speakers parent category
  ('c4b45e1c-29af-4a1e-aeaa-3f54adc0d5f4', 'Speaker Type', 'Тип колонка', 'select', true, true,
   '["Bluetooth/Portable", "Bookshelf", "Floorstanding", "Center Channel", "Subwoofer", "Surround", "Smart Speaker", "Soundbar"]',
   '["Bluetooth/Преносима", "Рафтова", "Подова", "Централен канал", "Субуфер", "Съраунд", "Смарт колонка", "Саундбар"]',
   1),
  
  ('c4b45e1c-29af-4a1e-aeaa-3f54adc0d5f4', 'Total Wattage', 'Обща мощност', 'select', false, true,
   '["Under 20W", "20-50W", "50-100W", "100-200W", "200-500W", "500W+"]',
   '["Под 20W", "20-50W", "50-100W", "100-200W", "200-500W", "Над 500W"]',
   2),
  
  ('c4b45e1c-29af-4a1e-aeaa-3f54adc0d5f4', 'Connectivity', 'Свързване', 'multiselect', false, true,
   '["Bluetooth", "WiFi", "AUX 3.5mm", "Optical/Toslink", "HDMI ARC", "HDMI eARC", "RCA", "USB", "Coaxial"]',
   '["Bluetooth", "WiFi", "AUX 3.5мм", "Оптичен", "HDMI ARC", "HDMI eARC", "RCA", "USB", "Коаксиален"]',
   3),
  
  ('c4b45e1c-29af-4a1e-aeaa-3f54adc0d5f4', 'Brand', 'Марка', 'select', true, true,
   '["Sonos", "Bose", "JBL", "Sony", "Samsung", "LG", "Harman Kardon", "Marshall", "Bang & Olufsen", "KEF", "Klipsch", "Polk Audio", "Other"]',
   '["Sonos", "Bose", "JBL", "Sony", "Samsung", "LG", "Harman Kardon", "Marshall", "Bang & Olufsen", "KEF", "Klipsch", "Polk Audio", "Друга"]',
   4),
  
  ('c4b45e1c-29af-4a1e-aeaa-3f54adc0d5f4', 'Condition', 'Състояние', 'select', true, true,
   '["New Sealed", "New Open Box", "Like New", "Good", "Fair"]',
   '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително"]',
   5);

-- Add attributes for Soundbars
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('518bb023-b58a-4ed1-b66b-d0ad5ae12a51', 'Channels', 'Канали', 'select', true, true,
   '["2.0", "2.1", "3.1", "5.1", "7.1", "5.1.2 (Dolby Atmos)", "7.1.4 (Dolby Atmos)", "9.1.4 (Dolby Atmos)"]',
   '["2.0", "2.1", "3.1", "5.1", "7.1", "5.1.2 (Dolby Atmos)", "7.1.4 (Dolby Atmos)", "9.1.4 (Dolby Atmos)"]',
   1),
  
  ('518bb023-b58a-4ed1-b66b-d0ad5ae12a51', 'Subwoofer Included', 'Включен субуфер', 'boolean', false, true, '[]', '[]', 2),
  
  ('518bb023-b58a-4ed1-b66b-d0ad5ae12a51', 'Dolby Atmos', 'Dolby Atmos', 'boolean', false, true, '[]', '[]', 3),
  
  ('518bb023-b58a-4ed1-b66b-d0ad5ae12a51', 'Total Wattage', 'Обща мощност', 'select', false, true,
   '["Under 100W", "100-200W", "200-300W", "300-500W", "500W+"]',
   '["Под 100W", "100-200W", "200-300W", "300-500W", "Над 500W"]',
   4),
  
  ('518bb023-b58a-4ed1-b66b-d0ad5ae12a51', 'Connectivity', 'Свързване', 'multiselect', false, true,
   '["HDMI ARC", "HDMI eARC", "Optical/Toslink", "Bluetooth", "WiFi", "AUX"]',
   '["HDMI ARC", "HDMI eARC", "Оптичен", "Bluetooth", "WiFi", "AUX"]',
   5),
  
  ('518bb023-b58a-4ed1-b66b-d0ad5ae12a51', 'Brand', 'Марка', 'select', true, true,
   '["Samsung", "LG", "Sony", "Bose", "Sonos", "JBL", "Vizio", "TCL", "Polk Audio", "Other"]',
   '["Samsung", "LG", "Sony", "Bose", "Sonos", "JBL", "Vizio", "TCL", "Polk Audio", "Друга"]',
   6),
  
  ('518bb023-b58a-4ed1-b66b-d0ad5ae12a51', 'Condition', 'Състояние', 'select', true, true,
   '["New Sealed", "New Open Box", "Like New", "Good", "Fair"]',
   '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително"]',
   7);

-- Add attributes for Home Theater Systems
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
VALUES
  ('cda66c29-72eb-4273-81ac-fa53119ba7b5', 'System Type', 'Тип система', 'select', true, true,
   '["5.1 Surround", "7.1 Surround", "5.1.2 Dolby Atmos", "7.1.4 Dolby Atmos", "Soundbar System", "All-in-One"]',
   '["5.1 съраунд", "7.1 съраунд", "5.1.2 Dolby Atmos", "7.1.4 Dolby Atmos", "Саундбар система", "Всичко в едно"]',
   1),
  
  ('cda66c29-72eb-4273-81ac-fa53119ba7b5', 'Total Wattage', 'Обща мощност', 'select', false, true,
   '["Under 500W", "500-1000W", "1000-1500W", "1500W+"]',
   '["Под 500W", "500-1000W", "1000-1500W", "Над 1500W"]',
   2),
  
  ('cda66c29-72eb-4273-81ac-fa53119ba7b5', 'Receiver Included', 'Включен ресивър', 'boolean', false, true, '[]', '[]', 3),
  
  ('cda66c29-72eb-4273-81ac-fa53119ba7b5', 'Wireless Surround', 'Безжичен съраунд', 'boolean', false, true, '[]', '[]', 4),
  
  ('cda66c29-72eb-4273-81ac-fa53119ba7b5', 'Brand', 'Марка', 'select', true, true,
   '["Samsung", "LG", "Sony", "Bose", "Sonos", "JBL", "Klipsch", "Yamaha", "Denon", "Other"]',
   '["Samsung", "LG", "Sony", "Bose", "Sonos", "JBL", "Klipsch", "Yamaha", "Denon", "Друга"]',
   5),
  
  ('cda66c29-72eb-4273-81ac-fa53119ba7b5', 'Condition', 'Състояние', 'select', true, true,
   '["New Sealed", "New Open Box", "Like New", "Good", "Fair"]',
   '["Ново запечатано", "Ново разопаковано", "Като ново", "Добро", "Задоволително"]',
   6);
;
