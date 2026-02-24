
-- Phase 1.8: Add Attributes to Electronics Categories
-- Part 2: Laptop & PC Attributes

-- Add attributes to Laptops L1 category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'laptops'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Processor Brand', 'Марка процесор', 'select', true, '["Intel Core","AMD Ryzen","Apple M-Series","Intel Celeron","Intel Pentium","Qualcomm Snapdragon"]', '["Intel Core","AMD Ryzen","Apple M-Series","Intel Celeron","Intel Pentium","Qualcomm Snapdragon"]', 1),
  ('Processor Generation', 'Поколение процесор', 'select', false, '["Intel 14th Gen","Intel 13th Gen","Intel 12th Gen","AMD 7000","AMD 5000","Apple M3","Apple M2","Apple M1"]', '["Intel 14-то Поколение","Intel 13-то Поколение","Intel 12-то Поколение","AMD 7000","AMD 5000","Apple M3","Apple M2","Apple M1"]', 2),
  ('RAM', 'RAM', 'select', true, '["4GB","8GB","16GB","32GB","64GB","128GB"]', '["4GB","8GB","16GB","32GB","64GB","128GB"]', 3),
  ('Storage Type', 'Тип памет', 'select', true, '["SSD","HDD","SSD + HDD","eMMC"]', '["SSD","HDD","SSD + HDD","eMMC"]', 4),
  ('Storage Size', 'Размер памет', 'select', true, '["128GB","256GB","512GB","1TB","2TB","4TB+"]', '["128GB","256GB","512GB","1TB","2TB","4TB+"]', 5),
  ('Screen Size', 'Размер екран', 'select', true, '["11\"-12\"","13\"-14\"","14\"-15\"","15\"-16\"","17\"+"]', '["11\"-12\"","13\"-14\"","14\"-15\"","15\"-16\"","17\"+"]', 6),
  ('Display Resolution', 'Резолюция', 'select', false, '["HD (1366x768)","Full HD (1920x1080)","2K (2560x1440)","4K (3840x2160)","OLED","Retina"]', '["HD (1366x768)","Full HD (1920x1080)","2K (2560x1440)","4K (3840x2160)","OLED","Retina"]', 7),
  ('Graphics Card', 'Видео карта', 'select', false, '["Integrated","NVIDIA RTX 40 Series","NVIDIA RTX 30 Series","AMD Radeon RX","Intel Arc","Apple GPU"]', '["Интегрирана","NVIDIA RTX 40 Серия","NVIDIA RTX 30 Серия","AMD Radeon RX","Intel Arc","Apple GPU"]', 8),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Refurbished","Very Good","Good","Acceptable"]', '["Ново","Като ново","Реновиран","Много добро","Добро","Приемливо"]', 9),
  ('Color', 'Цвят', 'select', false, '["Black","Silver","Space Gray","White","Blue","Gold","Pink","Other"]', '["Черен","Сребрист","Space Gray","Бял","Син","Златен","Розов","Друг"]', 10),
  ('Backlit Keyboard', 'Подсветка клавиатура', 'select', false, '["None","White","RGB","Single Zone RGB"]', '["Няма","Бяла","RGB","Single Zone RGB"]', 11),
  ('Weight', 'Тегло', 'select', false, '["Under 1kg","1-1.5kg","1.5-2kg","2-2.5kg","Over 2.5kg"]', '["Под 1kg","1-1.5kg","1.5-2kg","2-2.5kg","Над 2.5kg"]', 12),
  ('Battery Life', 'Живот батерия', 'select', false, '["Under 5 hours","5-8 hours","8-12 hours","12-15 hours","15+ hours"]', '["Под 5 часа","5-8 часа","8-12 часа","12-15 часа","15+ часа"]', 13)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Add attributes to Desktop PCs L1 category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'desktops'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Processor', 'Процесор', 'select', true, '["Intel Core i9","Intel Core i7","Intel Core i5","Intel Core i3","AMD Ryzen 9","AMD Ryzen 7","AMD Ryzen 5","AMD Ryzen 3","Apple M3","Apple M2"]', '["Intel Core i9","Intel Core i7","Intel Core i5","Intel Core i3","AMD Ryzen 9","AMD Ryzen 7","AMD Ryzen 5","AMD Ryzen 3","Apple M3","Apple M2"]', 1),
  ('RAM', 'RAM', 'select', true, '["8GB","16GB","32GB","64GB","128GB","256GB"]', '["8GB","16GB","32GB","64GB","128GB","256GB"]', 2),
  ('Storage', 'Памет', 'select', true, '["256GB SSD","512GB SSD","1TB SSD","2TB SSD","1TB HDD","2TB HDD","SSD+HDD Combo"]', '["256GB SSD","512GB SSD","1TB SSD","2TB SSD","1TB HDD","2TB HDD","SSD+HDD Комбо"]', 3),
  ('Graphics Card', 'Видео карта', 'select', true, '["Integrated","RTX 4090","RTX 4080","RTX 4070 Ti","RTX 4070","RTX 4060 Ti","RTX 4060","RX 7900 XTX","RX 7800 XT","RX 7700 XT","RX 7600"]', '["Интегрирана","RTX 4090","RTX 4080","RTX 4070 Ti","RTX 4070","RTX 4060 Ti","RTX 4060","RX 7900 XTX","RX 7800 XT","RX 7700 XT","RX 7600"]', 4),
  ('Form Factor', 'Форм фактор', 'select', false, '["Full Tower","Mid Tower","Mini Tower","SFF","All-in-One","Mini PC"]', '["Full Tower","Mid Tower","Mini Tower","SFF","All-in-One","Мини PC"]', 5),
  ('Use Case', 'Предназначение', 'select', false, '["Gaming","Workstation","Office","Home","Content Creation","Streaming"]', '["Гейминг","Работна станция","Офис","Дом","Създаване на съдържание","Стрийминг"]', 6),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Refurbished","Very Good","Good","For Parts"]', '["Ново","Като ново","Реновиран","Много добро","Добро","За части"]', 7),
  ('Operating System', 'Операционна система', 'select', false, '["Windows 11","Windows 10","macOS","Linux","No OS"]', '["Windows 11","Windows 10","macOS","Linux","Без ОС"]', 8),
  ('RGB Lighting', 'RGB Осветление', 'boolean', false, '[]', '[]', 9),
  ('WiFi', 'WiFi', 'select', false, '["None","WiFi 5","WiFi 6","WiFi 6E","WiFi 7"]', '["Няма","WiFi 5","WiFi 6","WiFi 6E","WiFi 7"]', 10)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Add attributes to Monitors L1 category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'monitors'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Screen Size', 'Размер екран', 'select', true, '["21\"-24\"","24\"-27\"","27\"-32\"","32\"-34\"","34\"-40\"","40\"+"]', '["21\"-24\"","24\"-27\"","27\"-32\"","32\"-34\"","34\"-40\"","40\"+"]', 1),
  ('Resolution', 'Резолюция', 'select', true, '["1080p FHD","1440p QHD","4K UHD","5K","8K","Ultrawide 2560x1080","Ultrawide 3440x1440","Ultrawide 5120x1440"]', '["1080p FHD","1440p QHD","4K UHD","5K","8K","Ултраширок 2560x1080","Ултраширок 3440x1440","Ултраширок 5120x1440"]', 2),
  ('Refresh Rate', 'Честота на опресняване', 'select', true, '["60Hz","75Hz","100Hz","144Hz","165Hz","180Hz","240Hz","360Hz"]', '["60Hz","75Hz","100Hz","144Hz","165Hz","180Hz","240Hz","360Hz"]', 3),
  ('Panel Type', 'Тип панел', 'select', false, '["IPS","VA","TN","OLED","Mini-LED","Nano IPS"]', '["IPS","VA","TN","OLED","Mini-LED","Nano IPS"]', 4),
  ('Response Time', 'Време за отговор', 'select', false, '["1ms","2ms","4ms","5ms","8ms+"]', '["1ms","2ms","4ms","5ms","8ms+"]', 5),
  ('Adaptive Sync', 'Adaptive Sync', 'select', false, '["None","G-Sync","G-Sync Compatible","FreeSync","FreeSync Premium","FreeSync Premium Pro"]', '["Няма","G-Sync","G-Sync Compatible","FreeSync","FreeSync Premium","FreeSync Premium Pro"]', 6),
  ('HDR', 'HDR', 'select', false, '["None","HDR10","HDR400","HDR600","HDR1000","HDR1400","Dolby Vision"]', '["Няма","HDR10","HDR400","HDR600","HDR1000","HDR1400","Dolby Vision"]', 7),
  ('Curved', 'Извит', 'select', false, '["Flat","1000R","1500R","1800R","2300R"]', '["Плосък","1000R","1500R","1800R","2300R"]', 8),
  ('Connectivity', 'Връзки', 'multiselect', false, '["HDMI 2.1","HDMI 2.0","DisplayPort 1.4","DisplayPort 2.1","USB-C","Thunderbolt 4","USB Hub"]', '["HDMI 2.1","HDMI 2.0","DisplayPort 1.4","DisplayPort 2.1","USB-C","Thunderbolt 4","USB Hub"]', 9),
  ('Use Case', 'Предназначение', 'select', false, '["Gaming","Professional","Office","Content Creation","General"]', '["Гейминг","Професионален","Офис","Създаване на съдържание","Общо"]', 10),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Refurbished","Very Good","Good","For Parts"]', '["Ново","Като ново","Реновиран","Много добро","Добро","За части"]', 11)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;
;
