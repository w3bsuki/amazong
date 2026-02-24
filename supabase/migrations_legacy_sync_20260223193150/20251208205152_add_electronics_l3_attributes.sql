-- Step 3: Add attributes to Electronics L3 categories
-- This enables Amazon/eBay-style filtering for electronics products

-- Helper function to get category ID by slug
CREATE OR REPLACE FUNCTION get_cat_id(cat_slug TEXT) RETURNS UUID AS $$
  SELECT id FROM categories WHERE slug = cat_slug LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- USB-C Cables attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('usb-c-cables'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Cable Length', 'Дължина на кабела', 'select', '["0.5m","1m","2m","3m","5m","10m"]', '["0.5м","1м","2м","3м","5м","10м"]', 1),
  ('USB Version', 'USB версия', 'select', '["USB 2.0","USB 3.0","USB 3.1","USB 3.2","USB4","Thunderbolt 3","Thunderbolt 4"]', '["USB 2.0","USB 3.0","USB 3.1","USB 3.2","USB4","Thunderbolt 3","Thunderbolt 4"]', 2),
  ('Data Transfer Speed', 'Скорост на трансфер', 'select', '["480Mbps","5Gbps","10Gbps","20Gbps","40Gbps"]', '["480Mbps","5Gbps","10Gbps","20Gbps","40Gbps"]', 3),
  ('Power Delivery', 'Power Delivery', 'select', '["No PD","20W","45W","65W","100W","140W","240W"]', '["Без PD","20W","45W","65W","100W","140W","240W"]', 4),
  ('Connector Type', 'Тип конектор', 'select', '["USB-C to USB-C","USB-C to USB-A","USB-C to Lightning","USB-C to HDMI","USB-C to DisplayPort"]', '["USB-C към USB-C","USB-C към USB-A","USB-C към Lightning","USB-C към HDMI","USB-C към DisplayPort"]', 5),
  ('Color', 'Цвят', 'select', '["Black","White","Gray","Blue","Red","Braided Black","Braided White"]', '["Черен","Бял","Сив","Син","Червен","Оплетен черен","Оплетен бял"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('usb-c-cables') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Power Banks attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('power-banks'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Capacity', 'Капацитет', 'select', '["5000mAh","10000mAh","15000mAh","20000mAh","26800mAh","30000mAh","50000mAh"]', '["5000mAh","10000mAh","15000mAh","20000mAh","26800mAh","30000mAh","50000mAh"]', 1),
  ('Output Power', 'Изходна мощност', 'select', '["10W","18W","20W","30W","45W","65W","100W","140W"]', '["10W","18W","20W","30W","45W","65W","100W","140W"]', 2),
  ('Number of Ports', 'Брой портове', 'select', '["1","2","3","4","5+"]', '["1","2","3","4","5+"]', 3),
  ('Port Types', 'Типове портове', 'multiselect', '["USB-A","USB-C","Micro USB","Lightning","Wireless Qi"]', '["USB-A","USB-C","Micro USB","Lightning","Безжично Qi"]', 4),
  ('Fast Charging', 'Бързо зареждане', 'select', '["No","Quick Charge 3.0","USB PD","Both QC & PD"]', '["Не","Quick Charge 3.0","USB PD","QC и PD"]', 5),
  ('Size', 'Размер', 'select', '["Pocket Size","Compact","Standard","Large"]', '["Джобен","Компактен","Стандартен","Голям"]', 6),
  ('Wireless Charging', 'Безжично зареждане', 'boolean', '[]', '[]', 7)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('power-banks') IS NOT NULL
ON CONFLICT DO NOTHING;

-- iPhone Cases attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('iphone-cases'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('iPhone Model', 'Модел iPhone', 'select', '["iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16 Plus","iPhone 16","iPhone 15 Pro Max","iPhone 15 Pro","iPhone 15 Plus","iPhone 15","iPhone 14 Pro Max","iPhone 14 Pro","iPhone 14 Plus","iPhone 14","iPhone 13","iPhone SE"]', '["iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16 Plus","iPhone 16","iPhone 15 Pro Max","iPhone 15 Pro","iPhone 15 Plus","iPhone 15","iPhone 14 Pro Max","iPhone 14 Pro","iPhone 14 Plus","iPhone 14","iPhone 13","iPhone SE"]', 1),
  ('Case Material', 'Материал', 'select', '["Silicone","Leather","Plastic","TPU","Rubber","Metal","Fabric","Wood","Carbon Fiber"]', '["Силикон","Кожа","Пластмаса","TPU","Гума","Метал","Плат","Дърво","Карбон"]', 2),
  ('Protection Level', 'Ниво на защита', 'select', '["Basic","Standard","Heavy Duty","Military Grade","Waterproof"]', '["Основна","Стандартна","Усилена","Военен клас","Водоустойчива"]', 3),
  ('MagSafe Compatible', 'MagSafe съвместим', 'boolean', '[]', '[]', 4),
  ('Case Style', 'Стил', 'select', '["Clear","Solid Color","Patterned","Designer","Wallet","Folio","Battery Case"]', '["Прозрачен","Едноцветен","С шарка","Дизайнерски","Портфейл","Калъф-книга","Батерия"]', 5),
  ('Color', 'Цвят', 'select', '["Black","White","Clear","Blue","Red","Pink","Green","Purple","Gold","Rose Gold"]', '["Черен","Бял","Прозрачен","Син","Червен","Розов","Зелен","Лилав","Златен","Розово злато"]', 6),
  ('Brand', 'Марка', 'select', '["Apple","Spigen","OtterBox","Casetify","UAG","Mous","Ringke","ESR","JETech","Generic"]', '["Apple","Spigen","OtterBox","Casetify","UAG","Mous","Ringke","ESR","JETech","Небрандирано"]', 7)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('iphone-cases') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Wireless Chargers attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('phones-chargers-wireless'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Charging Power', 'Мощност на зареждане', 'select', '["5W","7.5W","10W","15W","20W","25W"]', '["5W","7.5W","10W","15W","20W","25W"]', 1),
  ('Charger Type', 'Тип зарядно', 'select', '["Pad","Stand","3-in-1","Car Mount","Foldable","MagSafe"]', '["Подложка","Стойка","3-в-1","За кола","Сгъваемо","MagSafe"]', 2),
  ('Compatible Devices', 'Съвместими устройства', 'multiselect', '["iPhone","Samsung","Android","AirPods","Apple Watch","Earbuds"]', '["iPhone","Samsung","Android","AirPods","Apple Watch","Слушалки"]', 3),
  ('MagSafe Compatible', 'MagSafe съвместим', 'boolean', '[]', '[]', 4),
  ('Number of Devices', 'Брой устройства', 'select', '["1","2","3","4+"]', '["1","2","3","4+"]', 5),
  ('Color', 'Цвят', 'select', '["Black","White","Gray","Wood Finish"]', '["Черен","Бял","Сив","Дървесен"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('phones-chargers-wireless') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Screen Protectors (Tempered Glass) attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('tempered-glass'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Compatible Device', 'Съвместимо устройство', 'select', '["iPhone 16 Series","iPhone 15 Series","iPhone 14 Series","Samsung Galaxy S24","Samsung Galaxy S23","Pixel 9","Pixel 8","Universal"]', '["iPhone 16 серия","iPhone 15 серия","iPhone 14 серия","Samsung Galaxy S24","Samsung Galaxy S23","Pixel 9","Pixel 8","Универсален"]', 1),
  ('Glass Hardness', 'Твърдост на стъклото', 'select', '["9H","10H","11H"]', '["9H","10H","11H"]', 2),
  ('Coverage Type', 'Тип покритие', 'select', '["Full Coverage","Edge to Edge","Camera Only","Full Kit"]', '["Пълно покритие","От край до край","Само камера","Пълен комплект"]', 3),
  ('Pack Quantity', 'Брой в опаковка', 'select', '["1","2","3","4","5+"]', '["1","2","3","4","5+"]', 4),
  ('Features', 'Характеристики', 'multiselect', '["Anti-Fingerprint","Anti-Glare","Blue Light Filter","Privacy","Bubble-Free","Case Friendly"]', '["Против отпечатъци","Против отблясъци","Филтър синя светлина","Поверителност","Без мехурчета","Съвместим с калъф"]', 5)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('tempered-glass') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Laptop Bags attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('acc-laptop-bags'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Laptop Size', 'Размер на лаптоп', 'select', '["11-12 inch","13-14 inch","15-16 inch","17+ inch"]', '["11-12 инча","13-14 инча","15-16 инча","17+ инча"]', 1),
  ('Bag Type', 'Тип чанта', 'select', '["Sleeve","Backpack","Messenger","Briefcase","Tote","Rolling"]', '["Калъф","Раница","Пощальонска","Куфарче","Чанта Tote","На колелца"]', 2),
  ('Material', 'Материал', 'select', '["Nylon","Polyester","Leather","Canvas","Neoprene","Recycled"]', '["Найлон","Полиестер","Кожа","Канава","Неопрен","Рециклиран"]', 3),
  ('Water Resistant', 'Водоустойчив', 'boolean', '[]', '[]', 4),
  ('Color', 'Цвят', 'select', '["Black","Gray","Navy","Brown","Pink","Green","Camo"]', '["Черен","Сив","Тъмносин","Кафяв","Розов","Зелен","Камуфлаж"]', 5),
  ('Features', 'Характеристики', 'multiselect', '["USB Port","TSA Friendly","Anti-Theft","Padded Straps","Expandable","Organizer Pockets"]', '["USB порт","TSA съвместим","Против кражба","Меки презрамки","Разширяем","Организатор"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('acc-laptop-bags') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Docking Stations attributes  
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('docking-stations-new'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Connection Type', 'Тип връзка', 'select', '["USB-C","Thunderbolt 3","Thunderbolt 4","USB-A"]', '["USB-C","Thunderbolt 3","Thunderbolt 4","USB-A"]', 1),
  ('Number of Displays', 'Брой дисплеи', 'select', '["1","2","3","4+"]', '["1","2","3","4+"]', 2),
  ('Max Resolution', 'Макс. резолюция', 'select', '["1080p","1440p","4K@60Hz","4K@120Hz","5K","8K"]', '["1080p","1440p","4K@60Hz","4K@120Hz","5K","8K"]', 3),
  ('Power Delivery', 'Power Delivery', 'select', '["No","45W","65W","85W","96W","100W","140W"]', '["Не","45W","65W","85W","96W","100W","140W"]', 4),
  ('Ports', 'Портове', 'multiselect', '["HDMI","DisplayPort","USB-A","USB-C","Ethernet","SD Card","Audio Jack","Thunderbolt"]', '["HDMI","DisplayPort","USB-A","USB-C","Ethernet","SD карта","Аудио жак","Thunderbolt"]', 5),
  ('Compatibility', 'Съвместимост', 'multiselect', '["Windows","macOS","ChromeOS","Linux"]', '["Windows","macOS","ChromeOS","Linux"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('docking-stations-new') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Samsung Cases attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('samsung-cases'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Samsung Model', 'Модел Samsung', 'select', '["Galaxy S24 Ultra","Galaxy S24+","Galaxy S24","Galaxy S23 Ultra","Galaxy S23+","Galaxy S23","Galaxy Z Fold 5","Galaxy Z Flip 5","Galaxy A54","Galaxy A34"]', '["Galaxy S24 Ultra","Galaxy S24+","Galaxy S24","Galaxy S23 Ultra","Galaxy S23+","Galaxy S23","Galaxy Z Fold 5","Galaxy Z Flip 5","Galaxy A54","Galaxy A34"]', 1),
  ('Case Material', 'Материал', 'select', '["Silicone","Leather","Plastic","TPU","Rubber","Metal","Fabric","Carbon Fiber"]', '["Силикон","Кожа","Пластмаса","TPU","Гума","Метал","Плат","Карбон"]', 2),
  ('Protection Level', 'Ниво на защита', 'select', '["Basic","Standard","Heavy Duty","Military Grade"]', '["Основна","Стандартна","Усилена","Военен клас"]', 3),
  ('Case Style', 'Стил', 'select', '["Clear","Solid Color","Patterned","Wallet","Folio","S Pen Compatible"]', '["Прозрачен","Едноцветен","С шарка","Портфейл","Калъф-книга","S Pen съвместим"]', 4),
  ('Color', 'Цвят', 'select', '["Black","White","Clear","Blue","Red","Pink","Green","Purple"]', '["Черен","Бял","Прозрачен","Син","Червен","Розов","Зелен","Лилав"]', 5)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('samsung-cases') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Fast Chargers attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('fast-chargers'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Charging Power', 'Мощност', 'select', '["18W","20W","25W","30W","45W","65W","100W","140W","240W"]', '["18W","20W","25W","30W","45W","65W","100W","140W","240W"]', 1),
  ('Charging Protocol', 'Протокол на зареждане', 'multiselect', '["USB PD","Quick Charge 3.0","Quick Charge 4+","Super VOOC","Warp Charge","GaN"]', '["USB PD","Quick Charge 3.0","Quick Charge 4+","Super VOOC","Warp Charge","GaN"]', 2),
  ('Number of Ports', 'Брой портове', 'select', '["1","2","3","4","5+"]', '["1","2","3","4","5+"]', 3),
  ('Port Types', 'Типове портове', 'multiselect', '["USB-C","USB-A","Both"]', '["USB-C","USB-A","И двата"]', 4),
  ('GaN Technology', 'GaN технология', 'boolean', '[]', '[]', 5),
  ('Foldable Plug', 'Сгъваем щепсел', 'boolean', '[]', '[]', 6),
  ('Color', 'Цвят', 'select', '["Black","White","Gray"]', '["Черен","Бял","Сив"]', 7)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('fast-chargers') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Wall Chargers attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, options, options_bg, sort_order)
SELECT get_cat_id('wall-chargers'), name, name_bg, attr_type, true, options::jsonb, options_bg::jsonb, sort_order
FROM (VALUES 
  ('Charging Power', 'Мощност', 'select', '["5W","12W","18W","20W","30W","45W","65W","100W"]', '["5W","12W","18W","20W","30W","45W","65W","100W"]', 1),
  ('Number of Ports', 'Брой портове', 'select', '["1","2","3","4","6"]', '["1","2","3","4","6"]', 2),
  ('Port Types', 'Типове портове', 'multiselect', '["USB-C","USB-A","Both"]', '["USB-C","USB-A","И двата"]', 3),
  ('Fast Charging', 'Бързо зареждане', 'select', '["No","USB PD","Quick Charge","Both"]', '["Не","USB PD","Quick Charge","И двата"]', 4),
  ('Plug Type', 'Тип щепсел', 'select', '["EU (Type C/F)","US (Type A/B)","UK (Type G)","Universal"]', '["ЕС (Тип C/F)","САЩ (Тип A/B)","UK (Тип G)","Универсален"]', 5),
  ('Color', 'Цвят', 'select', '["Black","White","Gray"]', '["Черен","Бял","Сив"]', 6)
) AS t(name, name_bg, attr_type, options, options_bg, sort_order)
WHERE get_cat_id('wall-chargers') IS NOT NULL
ON CONFLICT DO NOTHING;

-- Clean up the helper function
DROP FUNCTION IF EXISTS get_cat_id(TEXT);

-- Add comment for documentation
COMMENT ON TABLE category_attributes IS 'Defines dynamic form fields per category (like eBay Item Specifics). Updated with Electronics L3 attributes in Step 3.';;
