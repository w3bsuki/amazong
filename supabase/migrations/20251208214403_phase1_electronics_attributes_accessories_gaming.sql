
-- Phase 1.8: Add Attributes to Electronics Categories
-- Part 4: Accessories & Gaming Attributes

-- Add attributes to Accessories (Electronics) L1 category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'electronics-accessories'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Accessory Type', 'Тип аксесоар', 'select', true, '["Case/Cover","Charger","Cable","Adapter","Screen Protector","Stand/Mount","Cleaning Kit","Other"]', '["Калъф","Зарядно","Кабел","Адаптер","Протектор екран","Стойка","Комплект почистване","Друг"]', 1),
  ('Compatibility', 'Съвместимост', 'select', true, '["Apple iPhone","Apple iPad","Apple Watch","Apple MacBook","Samsung Galaxy","Universal Android","Universal","Multiple Brands"]', '["Apple iPhone","Apple iPad","Apple Watch","Apple MacBook","Samsung Galaxy","Универсален Android","Универсален","Много марки"]', 2),
  ('Material', 'Материал', 'select', false, '["Silicone","Leather","Plastic","Metal","Fabric","Carbon Fiber","Wood","Tempered Glass"]', '["Силикон","Кожа","Пластмаса","Метал","Плат","Карбон","Дърво","Закалено стъкло"]', 3),
  ('Brand', 'Марка', 'select', false, '["Apple","Samsung","Anker","Belkin","Spigen","OtterBox","Generic","Other"]', '["Apple","Samsung","Anker","Belkin","Spigen","OtterBox","Генерични","Друга"]', 4),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable"]', '["Ново","Като ново","Много добро","Добро","Приемливо"]', 5),
  ('Color', 'Цвят', 'select', false, '["Black","White","Clear/Transparent","Blue","Red","Green","Pink","Multi-Color","Other"]', '["Черен","Бял","Прозрачен","Син","Червен","Зелен","Розов","Многоцветен","Друг"]', 6)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Add attributes to Gaming L1 category  
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'gaming'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Platform', 'Платформа', 'select', true, '["PlayStation 5","PlayStation 4","Xbox Series X|S","Xbox One","Nintendo Switch","PC","Multi-Platform","Retro"]', '["PlayStation 5","PlayStation 4","Xbox Series X|S","Xbox One","Nintendo Switch","PC","Мулти-платформен","Ретро"]', 1),
  ('Product Type', 'Тип продукт', 'select', true, '["Console","Game","Controller","Headset","Gaming Chair","Keyboard","Mouse","Mousepad","Monitor","Capture Card","Other Accessory"]', '["Конзола","Игра","Контролер","Слушалки","Гейминг стол","Клавиатура","Мишка","Подложка","Монитор","Capture Card","Друг аксесоар"]', 2),
  ('Console Edition', 'Издание конзола', 'select', false, '["Standard","Digital","Pro/Slim","Limited Edition","Bundle"]', '["Стандартно","Дигитално","Pro/Slim","Лимитирано","Бъндъл"]', 3),
  ('Storage', 'Памет', 'select', false, '["500GB","825GB","1TB","2TB","External SSD","Physical Disc"]', '["500GB","825GB","1TB","2TB","Външен SSD","Физически диск"]', 4),
  ('Game Format', 'Формат игра', 'select', false, '["Physical Disc","Digital Code","Both Available"]', '["Физически диск","Дигитален код","И двата"]', 5),
  ('Genre', 'Жанр', 'select', false, '["Action","Adventure","RPG","Sports","Racing","Shooter","Fighting","Puzzle","Simulation","Strategy"]', '["Екшън","Приключение","RPG","Спортни","Състезателни","Шутър","Файтинг","Пъзел","Симулация","Стратегия"]', 6),
  ('Region', 'Регион', 'select', false, '["PAL (Europe)","NTSC (US)","Region Free"]', '["PAL (Европа)","NTSC (САЩ)","Без регион"]', 7),
  ('Condition', 'Състояние', 'select', true, '["New Sealed","New","Like New","Very Good","Good","Acceptable","For Parts"]', '["Ново запечатано","Ново","Като ново","Много добро","Добро","Приемливо","За части"]', 8),
  ('Color', 'Цвят', 'select', false, '["Black","White","Cosmic Red","Starlight Blue","Gray Camo","Nova Pink","Other"]', '["Черен","Бял","Cosmic Red","Starlight Blue","Gray Camo","Nova Pink","Друг"]', 9)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Add attributes to Wearables L1 category (if exists)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'wearables'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Device Type', 'Тип устройство', 'select', true, '["Smartwatch","Fitness Band","Smart Ring","Smart Glasses","Hearing Aids"]', '["Смарт часовник","Фитнес гривна","Смарт пръстен","Смарт очила","Слухови апарати"]', 1),
  ('Compatibility', 'Съвместимост', 'select', true, '["Apple iOS Only","Android Only","iOS & Android","Universal"]', '["Само Apple iOS","Само Android","iOS и Android","Универсален"]', 2),
  ('Display Type', 'Тип дисплей', 'select', false, '["AMOLED","LCD","E-Ink","No Display"]', '["AMOLED","LCD","E-Ink","Без дисплей"]', 3),
  ('Case Size', 'Размер корпус', 'select', false, '["Small (38-40mm)","Medium (42-44mm)","Large (45mm+)"]', '["Малък (38-40mm)","Среден (42-44mm)","Голям (45mm+)"]', 4),
  ('Battery Life', 'Живот батерия', 'select', false, '["Under 24 hours","1-3 days","3-7 days","7-14 days","14+ days"]', '["Под 24 часа","1-3 дни","3-7 дни","7-14 дни","14+ дни"]', 5),
  ('Water Resistance', 'Водоустойчивост', 'select', false, '["None","Splash Proof","5ATM/50m","10ATM/100m"]', '["Няма","Устойчив на пръски","5ATM/50m","10ATM/100m"]', 6),
  ('Health Features', 'Здравни функции', 'multiselect', false, '["Heart Rate","SpO2","ECG","Blood Pressure","Sleep Tracking","Stress Monitor","Temperature"]', '["Сърдечен ритъм","SpO2","ЕКГ","Кръвно налягане","Проследяване сън","Монитор стрес","Температура"]', 7),
  ('GPS', 'GPS', 'select', false, '["Built-in GPS","Connected GPS","No GPS"]', '["Вграден GPS","Свързан GPS","Без GPS"]', 8),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable"]', '["Ново","Като ново","Много добро","Добро","Приемливо"]', 9),
  ('Band Material', 'Материал каишка', 'select', false, '["Silicone/Sport","Leather","Metal/Steel","Nylon/Fabric","Multiple Bands Included"]', '["Силикон/Спортна","Кожа","Метал/Стомана","Найлон/Плат","Няколко каишки"]', 10)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
WHERE EXISTS (SELECT 1 FROM categories WHERE slug = 'wearables')
ON CONFLICT DO NOTHING;

-- Add attributes to Photography Equipment (if camera accessories exist separately)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'camera-accessories'),
  a.name, a.name_bg, a.attr_type::text, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Accessory Type', 'Тип аксесоар', 'select', true, '["Lens","Tripod","Gimbal","Flash","Battery","Memory Card","Bag/Case","Filter","Cleaning Kit","Strap","Remote","Other"]', '["Обектив","Статив","Гимбал","Светкавица","Батерия","Карта памет","Чанта/Калъф","Филтър","Комплект почистване","Ремък","Дистанционно","Друг"]', 1),
  ('Brand Compatibility', 'Съвместимост с марка', 'select', false, '["Canon","Nikon","Sony","Fujifilm","Panasonic","Universal","Multiple Brands"]', '["Canon","Nikon","Sony","Fujifilm","Panasonic","Универсален","Много марки"]', 2),
  ('Mount Type', 'Тип байонет', 'select', false, '["Canon RF","Canon EF","Sony E","Nikon Z","Nikon F","Fujifilm X","MFT","L Mount","Universal","N/A"]', '["Canon RF","Canon EF","Sony E","Nikon Z","Nikon F","Fujifilm X","MFT","L Mount","Универсален","Не важи"]', 3),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable"]', '["Ново","Като ново","Много добро","Добро","Приемливо"]', 4)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
WHERE EXISTS (SELECT 1 FROM categories WHERE slug = 'camera-accessories')
ON CONFLICT DO NOTHING;
;
