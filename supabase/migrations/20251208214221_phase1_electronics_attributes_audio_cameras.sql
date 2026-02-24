
-- Phase 1.8: Add Attributes to Electronics Categories
-- Part 3: Audio & Camera Attributes

-- Add attributes to Audio L1 category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'audio'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Connection Type', 'Тип връзка', 'select', true, '["Wired 3.5mm","Wired USB","Wireless Bluetooth","Wireless 2.4GHz","Both Wired & Wireless"]', '["Кабелен 3.5mm","Кабелен USB","Безжичен Bluetooth","Безжичен 2.4GHz","Кабелен и Безжичен"]', 1),
  ('Type', 'Тип', 'select', false, '["Over-Ear","On-Ear","In-Ear","True Wireless","Neckband","Bone Conduction"]', '["Over-Ear","On-Ear","In-Ear","True Wireless","Neckband","Костна проводимост"]', 2),
  ('Active Noise Cancellation', 'Активно шумопотискане', 'select', false, '["None","Standard ANC","Adaptive ANC","Premium ANC"]', '["Няма","Стандартен ANC","Адаптивен ANC","Премиум ANC"]', 3),
  ('Driver Size', 'Размер драйвер', 'select', false, '["Under 30mm","30-40mm","40-50mm","50mm+"]', '["Под 30mm","30-40mm","40-50mm","50mm+"]', 4),
  ('Battery Life', 'Живот батерия', 'select', false, '["Under 10 hours","10-20 hours","20-30 hours","30-40 hours","40+ hours"]', '["Под 10 часа","10-20 часа","20-30 часа","30-40 часа","40+ часа"]', 5),
  ('Water Resistance', 'Водоустойчивост', 'select', false, '["None","IPX4 Splash","IPX5 Water","IPX7 Submersible","IPX8 Deep Water"]', '["Няма","IPX4 Пръски","IPX5 Вода","IPX7 Потопяем","IPX8 Дълбока вода"]', 6),
  ('Microphone', 'Микрофон', 'select', false, '["None","Built-in","Detachable","Boom Mic"]', '["Няма","Вграден","Сваляем","Boom Mic"]', 7),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable"]', '["Ново","Като ново","Много добро","Добро","Приемливо"]', 8),
  ('Color', 'Цвят', 'select', false, '["Black","White","Silver","Blue","Red","Green","Pink","Gold","Other"]', '["Черен","Бял","Сребрист","Син","Червен","Зелен","Розов","Златен","Друг"]', 9)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Add attributes to Cameras L1 category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'electronics-cameras'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Camera Type', 'Тип камера', 'select', true, '["Mirrorless","DSLR","Compact","Action Camera","Instant","Cinema","Film","Webcam"]', '["Mirrorless","DSLR","Компактна","Екшън камера","Моментна","Кино","Филмова","Уебкамера"]', 1),
  ('Sensor Size', 'Размер сензор', 'select', false, '["Full Frame","APS-C","Micro Four Thirds","1 inch","Medium Format","1/2.3 inch"]', '["Full Frame","APS-C","Micro Four Thirds","1 инч","Среден формат","1/2.3 инч"]', 2),
  ('Megapixels', 'Мегапиксели', 'select', false, '["Under 12MP","12-20MP","20-30MP","30-40MP","40-50MP","50-60MP","60MP+"]', '["Под 12MP","12-20MP","20-30MP","30-40MP","40-50MP","50-60MP","60MP+"]', 3),
  ('Video Resolution', 'Видео резолюция', 'select', false, '["1080p","4K 30fps","4K 60fps","4K 120fps","6K","8K"]', '["1080p","4K 30fps","4K 60fps","4K 120fps","6K","8K"]', 4),
  ('Lens Mount', 'Байонет', 'select', false, '["Canon RF","Canon EF","Sony E","Nikon Z","Nikon F","Fujifilm X","Micro Four Thirds","L Mount","None/Fixed"]', '["Canon RF","Canon EF","Sony E","Nikon Z","Nikon F","Fujifilm X","Micro Four Thirds","L Mount","Без/Фиксиран"]', 5),
  ('Image Stabilization', 'Стабилизация', 'select', false, '["None","Lens IS","Body IBIS","Both"]', '["Няма","Обективна IS","Body IBIS","И двете"]', 6),
  ('Viewfinder', 'Визьор', 'select', false, '["Electronic EVF","Optical OVF","Hybrid","None/Screen Only"]', '["Електронен EVF","Оптичен OVF","Хибриден","Няма/Само екран"]', 7),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable","For Parts"]', '["Ново","Като ново","Много добро","Добро","Приемливо","За части"]', 8),
  ('Shutter Count', 'Брой кадри', 'select', false, '["Under 5,000","5,000-20,000","20,000-50,000","50,000-100,000","100,000+","Unknown"]', '["Под 5,000","5,000-20,000","20,000-50,000","50,000-100,000","100,000+","Неизвестен"]', 9),
  ('Includes', 'Включва', 'multiselect', false, '["Body Only","Kit Lens","Extra Lens","Battery","Charger","Memory Card","Bag","Original Box"]', '["Само тяло","Кит обектив","Допълнителен обектив","Батерия","Зарядно","Карта памет","Чанта","Оригинална кутия"]', 10)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Add attributes to Smart Devices L1 category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'smart-devices'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Ecosystem', 'Екосистема', 'select', true, '["Apple HomeKit","Google Home","Amazon Alexa","Samsung SmartThings","Matter Compatible","Multi-Platform"]', '["Apple HomeKit","Google Home","Amazon Alexa","Samsung SmartThings","Matter съвместим","Мулти-платформен"]', 1),
  ('Connectivity', 'Свързаност', 'select', true, '["WiFi","Bluetooth","Zigbee","Z-Wave","Thread","WiFi + Bluetooth"]', '["WiFi","Bluetooth","Zigbee","Z-Wave","Thread","WiFi + Bluetooth"]', 2),
  ('Power Source', 'Захранване', 'select', false, '["AC Powered","Battery","USB","Solar","Rechargeable"]', '["Мрежово","Батерия","USB","Соларно","Презареждаемо"]', 3),
  ('App Control', 'Контрол чрез приложение', 'select', false, '["iOS Only","Android Only","iOS & Android","No App Required"]', '["Само iOS","Само Android","iOS и Android","Не изисква приложение"]', 4),
  ('Voice Control', 'Гласов контрол', 'select', false, '["Siri","Google Assistant","Alexa","All Three","None"]', '["Siri","Google Assistant","Alexa","Всички три","Няма"]', 5),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable"]', '["Ново","Като ново","Много добро","Добро","Приемливо"]', 6),
  ('Color', 'Цвят', 'select', false, '["Black","White","Silver","Gray","Multi-Color"]', '["Черен","Бял","Сребрист","Сив","Многоцветен"]', 7)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Add attributes to Televisions L1 category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'televisions-category'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Screen Size', 'Размер екран', 'select', true, '["32\"","40\"-43\"","50\"-55\"","65\"","75\"","77\"","83\"-85\"","98\"+"]', '["32\"","40\"-43\"","50\"-55\"","65\"","75\"","77\"","83\"-85\"","98\"+"]', 1),
  ('Display Technology', 'Технология дисплей', 'select', true, '["LED","QLED","OLED","Mini-LED","Neo QLED","QD-OLED","Micro LED"]', '["LED","QLED","OLED","Mini-LED","Neo QLED","QD-OLED","Micro LED"]', 2),
  ('Resolution', 'Резолюция', 'select', true, '["HD (720p)","Full HD (1080p)","4K UHD","8K UHD"]', '["HD (720p)","Full HD (1080p)","4K UHD","8K UHD"]', 3),
  ('Smart TV Platform', 'Смарт ТВ платформа', 'select', false, '["Google TV","Tizen (Samsung)","webOS (LG)","Roku TV","Fire TV","Android TV","Non-Smart"]', '["Google TV","Tizen (Samsung)","webOS (LG)","Roku TV","Fire TV","Android TV","Без смарт"]', 4),
  ('Refresh Rate', 'Честота опресняване', 'select', false, '["60Hz","120Hz","144Hz","240Hz"]', '["60Hz","120Hz","144Hz","240Hz"]', 5),
  ('HDR Format', 'HDR формат', 'select', false, '["None","HDR10","HDR10+","Dolby Vision","All HDR Formats"]', '["Няма","HDR10","HDR10+","Dolby Vision","Всички HDR формати"]', 6),
  ('HDMI Ports', 'HDMI портове', 'select', false, '["1","2","3","4","4+"]', '["1","2","3","4","4+"]', 7),
  ('Gaming Features', 'Гейминг функции', 'multiselect', false, '["VRR","ALLM","4K 120Hz","FreeSync","G-Sync Compatible","Game Mode"]', '["VRR","ALLM","4K 120Hz","FreeSync","G-Sync Compatible","Гейм режим"]', 8),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable","For Parts"]', '["Ново","Като ново","Много добро","Добро","Приемливо","За части"]', 9),
  ('Wall Mount', 'За стена', 'select', false, '["Included","Not Included","Wall Mounted (Sold As-Is)"]', '["Включено","Не е включено","Монтирано на стена (продава се както е)"]', 10)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Add attributes to Networking L1 category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'networking'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Device Type', 'Тип устройство', 'select', true, '["Router","Mesh System","Access Point","Switch","Modem","Range Extender","Powerline","Adapter"]', '["Рутер","Mesh система","Access Point","Суич","Модем","Усилвател","Powerline","Адаптер"]', 1),
  ('WiFi Standard', 'WiFi стандарт', 'select', true, '["WiFi 7 (BE)","WiFi 6E (AXE)","WiFi 6 (AX)","WiFi 5 (AC)","WiFi 4 (N)"]', '["WiFi 7 (BE)","WiFi 6E (AXE)","WiFi 6 (AX)","WiFi 5 (AC)","WiFi 4 (N)"]', 2),
  ('Speed Class', 'Клас скорост', 'select', false, '["Up to 300Mbps","300-1000Mbps","1-3Gbps","3-6Gbps","6Gbps+"]', '["До 300Mbps","300-1000Mbps","1-3Gbps","3-6Gbps","6Gbps+"]', 3),
  ('Band', 'Честота', 'select', false, '["Single Band 2.4GHz","Dual Band","Tri-Band","Quad-Band"]', '["Единична честота 2.4GHz","Dual Band","Tri-Band","Quad-Band"]', 4),
  ('Coverage', 'Покритие', 'select', false, '["Small (1-2 rooms)","Medium (3-4 rooms)","Large (5+ rooms)","Whole Home"]', '["Малко (1-2 стаи)","Средно (3-4 стаи)","Голямо (5+ стаи)","Цял дом"]', 5),
  ('Ports', 'Портове', 'select', false, '["No Ethernet","1-2 Ports","4 Ports","8 Ports","16+ Ports"]', '["Без Ethernet","1-2 порта","4 порта","8 порта","16+ порта"]', 6),
  ('Use Case', 'Предназначение', 'select', false, '["Home","Small Business","Gaming","Enterprise"]', '["Дом","Малък бизнес","Гейминг","Бизнес"]', 7),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable"]', '["Ново","Като ново","Много добро","Добро","Приемливо"]', 8)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;
;
