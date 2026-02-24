-- Phase 2.2.4: Gaming Attributes
-- Add comprehensive attributes to Gaming L0 and key L1/L2 categories

-- =====================================================
-- GAMING L0 ATTRIBUTES (Universal for all gaming items)
-- =====================================================

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'gaming'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Platform', 'Платформа', 'select', true, '["PC","PlayStation 5","PlayStation 4","Xbox Series X|S","Xbox One","Nintendo Switch","Multi-Platform","Mobile","VR"]', '["PC","PlayStation 5","PlayStation 4","Xbox Series X|S","Xbox One","Nintendo Switch","Мулти-платформа","Мобилен","VR"]', 1),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable","For Parts"]', '["Ново","Като ново","Много добро","Добро","Приемливо","За части"]', 2),
  ('Brand', 'Марка', 'text', false, '[]', '[]', 3),
  ('Color', 'Цвят', 'select', false, '["Black","White","Red","Blue","Green","Purple","Pink","Gold","Silver","Multi-Color","Limited Edition"]', '["Черен","Бял","Червен","Син","Зелен","Лилав","Розов","Златен","Сребърен","Многоцветен","Лимитирано издание"]', 4),
  ('Warranty', 'Гаранция', 'select', false, '["No Warranty","1 Month","3 Months","6 Months","1 Year","2+ Years","Manufacturer Warranty"]', '["Без гаранция","1 месец","3 месеца","6 месеца","1 година","2+ години","Фабрична гаранция"]', 5)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PC GAMING PERIPHERALS ATTRIBUTES
-- =====================================================

-- Gaming Keyboards Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  cat.id,
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM categories cat
CROSS JOIN (VALUES
  ('Switch Type', 'Тип превключватели', 'select', false, '["Cherry MX Red","Cherry MX Blue","Cherry MX Brown","Cherry MX Speed","Gateron Red","Gateron Yellow","Razer Green","Razer Orange","Membrane","Optical"]', '["Cherry MX Red","Cherry MX Blue","Cherry MX Brown","Cherry MX Speed","Gateron Red","Gateron Yellow","Razer Green","Razer Orange","Мембранни","Оптични"]', 10),
  ('Layout Size', 'Размер оформление', 'select', true, '["Full-Size (100%)","TKL (80%)","75%","65%","60%","40%","Numpad"]', '["Пълен размер (100%)","TKL (80%)","75%","65%","60%","40%","Нумпад"]', 11),
  ('Connection Type', 'Вид връзка', 'select', true, '["Wired USB","Wireless 2.4GHz","Bluetooth","Wired + Wireless","Triple Mode"]', '["Кабелен USB","Безжичен 2.4GHz","Bluetooth","Кабелен + Безжичен","Тройна връзка"]', 12),
  ('Backlighting', 'Подсветка', 'select', false, '["RGB","Single Color","Zone RGB","No Backlight","Per-Key RGB"]', '["RGB","Едноцветна","Зонова RGB","Без подсветка","RGB на клавиш"]', 13),
  ('Hot-Swappable', 'Hot-Swap', 'select', false, '["Yes","No"]', '["Да","Не"]', 14),
  ('Keycap Material', 'Материал клавиши', 'select', false, '["ABS","PBT","Double-Shot PBT"]', '["ABS","PBT","Double-Shot PBT"]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
WHERE cat.slug IN ('pc-gaming-keyboards', 'gaming-keyboards')
ON CONFLICT DO NOTHING;

-- Gaming Mice Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  cat.id,
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM categories cat
CROSS JOIN (VALUES
  ('Sensor Type', 'Тип сензор', 'select', false, '["Optical","Laser","Hero Sensor","Focus Pro","PAW3395","Razer Focus+"]', '["Оптичен","Лазерен","Hero сензор","Focus Pro","PAW3395","Razer Focus+"]', 10),
  ('DPI', 'DPI', 'select', false, '["Up to 8000","8000-16000","16000-20000","20000-25000","25000+"]', '["До 8000","8000-16000","16000-20000","20000-25000","25000+"]', 11),
  ('Connection Type', 'Вид връзка', 'select', true, '["Wired","Wireless 2.4GHz","Bluetooth","Wired + Wireless","Triple Mode"]', '["Кабелен","Безжичен 2.4GHz","Bluetooth","Кабелен + Безжичен","Тройна връзка"]', 12),
  ('Weight', 'Тегло', 'select', false, '["Ultralight (<60g)","Light (60-80g)","Medium (80-100g)","Heavy (100g+)","Adjustable"]', '["Ултралеки (<60г)","Леки (60-80г)","Средни (80-100г)","Тежки (100г+)","Регулируемо"]', 13),
  ('Grip Style', 'Стил захват', 'select', false, '["Palm","Claw","Fingertip","Universal"]', '["Palm","Claw","Fingertip","Универсален"]', 14),
  ('Button Count', 'Брой бутони', 'select', false, '["5 or less","6-8","8-12","12+"]', '["5 или по-малко","6-8","8-12","12+"]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
WHERE cat.slug IN ('pc-gaming-mice', 'gaming-mice')
ON CONFLICT DO NOTHING;

-- Gaming Headsets Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'pc-gaming-headsets'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Connection Type', 'Вид връзка', 'select', true, '["Wired USB","Wired 3.5mm","Wireless 2.4GHz","Bluetooth","Wireless + Wired"]', '["Кабелен USB","Кабелен 3.5мм","Безжичен 2.4GHz","Bluetooth","Безжичен + Кабелен"]', 10),
  ('Surround Sound', 'Съраунд звук', 'select', false, '["Stereo","7.1 Virtual","7.1 True","Dolby Atmos","3D Audio"]', '["Стерео","7.1 виртуален","7.1 истински","Dolby Atmos","3D аудио"]', 11),
  ('Driver Size', 'Размер драйвер', 'select', false, '["40mm","50mm","53mm","Other"]', '["40мм","50мм","53мм","Друг"]', 12),
  ('Microphone Type', 'Тип микрофон', 'select', false, '["Boom Mic","Detachable Boom","Retractable","Built-in","No Mic"]', '["Бум микрофон","Свалящ се бум","Прибиращ се","Вграден","Без микрофон"]', 13),
  ('Noise Cancelling', 'Шумопотискане', 'select', false, '["Active ANC","Passive","None"]', '["Активно ANC","Пасивно","Няма"]', 14),
  ('Open/Closed Back', 'Отворен/Затворен гръб', 'select', false, '["Closed-Back","Open-Back","Semi-Open"]', '["Затворен","Отворен","Полуотворен"]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Gaming Monitors Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'pc-gaming-monitors'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Screen Size', 'Размер екран', 'select', true, '["24\"","27\"","32\"","34\" Ultrawide","38\" Ultrawide","49\" Super Ultrawide"]', '["24\"","27\"","32\"","34\" Ultrawide","38\" Ultrawide","49\" Super Ultrawide"]', 10),
  ('Resolution', 'Резолюция', 'select', true, '["1080p FHD","1440p QHD","4K UHD","5K","Ultrawide 2560x1080","Ultrawide 3440x1440","Super Ultrawide 5120x1440"]', '["1080p FHD","1440p QHD","4K UHD","5K","Ultrawide 2560x1080","Ultrawide 3440x1440","Super Ultrawide 5120x1440"]', 11),
  ('Refresh Rate', 'Честота опресняване', 'select', true, '["60Hz","75Hz","144Hz","165Hz","180Hz","240Hz","280Hz","360Hz","500Hz"]', '["60Hz","75Hz","144Hz","165Hz","180Hz","240Hz","280Hz","360Hz","500Hz"]', 12),
  ('Panel Type', 'Тип панел', 'select', false, '["IPS","VA","TN","OLED","QD-OLED","Mini LED"]', '["IPS","VA","TN","OLED","QD-OLED","Mini LED"]', 13),
  ('Response Time', 'Време за отговор', 'select', false, '["1ms","0.5ms","0.03ms (OLED)","2ms","4ms","5ms+"]', '["1мс","0.5мс","0.03мс (OLED)","2мс","4мс","5мс+"]', 14),
  ('Adaptive Sync', 'Адаптивна синхр.', 'select', false, '["G-Sync","G-Sync Compatible","FreeSync","FreeSync Premium","FreeSync Premium Pro","None"]', '["G-Sync","G-Sync Compatible","FreeSync","FreeSync Premium","FreeSync Premium Pro","Няма"]', 15),
  ('HDR', 'HDR', 'select', false, '["HDR10","HDR400","HDR600","HDR1000","HDR1400","Dolby Vision","No HDR"]', '["HDR10","HDR400","HDR600","HDR1000","HDR1400","Dolby Vision","Без HDR"]', 16),
  ('Curved', 'Извит', 'select', false, '["Flat","1000R","1500R","1800R","2300R"]', '["Плосък","1000R","1500R","1800R","2300R"]', 17)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- =====================================================
-- CONSOLE GAMING ATTRIBUTES
-- =====================================================

-- Console Games Attributes (apply to all game categories)
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  cat.id,
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM categories cat
CROSS JOIN (VALUES
  ('Game Format', 'Формат', 'select', true, '["Physical Disc","Digital Code","Digital Download"]', '["Физически диск","Дигитален код","Дигитално изтегляне"]', 10),
  ('Genre', 'Жанр', 'select', false, '["Action","Adventure","RPG","Sports","Racing","Shooter","Strategy","Simulation","Fighting","Puzzle","Horror","Platform","Open World"]', '["Екшън","Приключенски","RPG","Спортни","Състезателни","Шутър","Стратегия","Симулация","Файтинг","Пъзел","Хорър","Платформър","Отворен свят"]', 11),
  ('ESRB Rating', 'Рейтинг', 'select', false, '["E - Everyone","E10+ - Everyone 10+","T - Teen","M - Mature 17+","AO - Adults Only","RP - Rating Pending"]', '["E - За всички","E10+ - 10+","T - Тийнейджъри","M - 17+","AO - Само за възрастни","RP - Очаква се рейтинг"]', 12),
  ('Region', 'Регион', 'select', false, '["Region Free","North America (NTSC)","Europe (PAL)","Japan","Asia"]', '["Без регион","Северна Америка (NTSC)","Европа (PAL)","Япония","Азия"]', 13),
  ('Multiplayer', 'Мултиплейър', 'select', false, '["Single Player","Local Co-op","Online Multiplayer","Both Local & Online","MMO"]', '["Сингъл плейър","Локален ко-оп","Онлайн мултиплейър","Локален и онлайн","MMO"]', 14),
  ('Language', 'Език', 'select', false, '["English","Multi-Language","Japanese","Subtitles Only"]', '["Английски","Многоезичен","Японски","Само субтитри"]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
WHERE cat.slug IN ('gaming-ps5-games', 'gaming-ps4-games', 'gaming-xbox-series-games', 'gaming-switch-games', 'gaming-pc-games')
ON CONFLICT DO NOTHING;

-- Console Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  cat.id,
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM categories cat
CROSS JOIN (VALUES
  ('Storage Capacity', 'Капацитет', 'select', true, '["256GB","500GB","512GB","825GB","1TB","2TB"]', '["256GB","500GB","512GB","825GB","1TB","2TB"]', 10),
  ('Edition', 'Издание', 'select', false, '["Standard","Digital","Pro","Slim","Limited Edition","Bundle"]', '["Стандартно","Дигитално","Pro","Slim","Лимитирано","Пакет"]', 11),
  ('Includes Controller', 'Включва контролер', 'select', false, '["Yes","No","2 Controllers"]', '["Да","Не","2 контролера"]', 12),
  ('Box Contents', 'Съдържание', 'select', false, '["Console Only","Complete In Box","Missing Accessories","Sealed"]', '["Само конзола","Пълен комплект","Липсват аксесоари","Запечатана"]', 13)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
WHERE cat.slug IN ('console-ps5', 'console-ps4', 'console-xbox-series', 'console-xbox-one', 'console-switch')
ON CONFLICT DO NOTHING;

-- =====================================================
-- GAMING FURNITURE ATTRIBUTES
-- =====================================================

-- Gaming Chairs Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'gaming-chairs'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Chair Style', 'Стил стол', 'select', true, '["Racing Style","Ergonomic","Rocker","Bean Bag","Floor Chair"]', '["Състезателен стил","Ергономичен","Люлеещ се","Пуф","Подов"]', 10),
  ('Max Weight Capacity', 'Макс. тегло', 'select', false, '["Up to 100kg","Up to 120kg","Up to 150kg","Up to 180kg","200kg+"]', '["До 100кг","До 120кг","До 150кг","До 180кг","200кг+"]', 11),
  ('Material', 'Материал', 'select', false, '["PU Leather","Fabric","Mesh","Real Leather","Velvet"]', '["Изкуствена кожа","Плат","Мрежа","Естествена кожа","Кадифе"]', 12),
  ('Adjustable Features', 'Настройки', 'multiselect', false, '["Height","Armrests","Backrest Angle","Lumbar Support","Headrest"]', '["Височина","Облегалки","Ъгъл на облегалка","Лумбална опора","Облегалка за глава"]', 13),
  ('RGB Lighting', 'RGB осветление', 'select', false, '["Yes","No"]', '["Да","Не"]', 14)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- Gaming Desks Attributes  
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'gaming-desks'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Desk Shape', 'Форма', 'select', true, '["Rectangular","L-Shaped","Corner","Standing","Adjustable Height"]', '["Правоъгълно","L-образно","Ъглово","Стоящо","Регулируема височина"]', 10),
  ('Desk Width', 'Ширина', 'select', false, '["Under 120cm","120-140cm","140-160cm","160-180cm","180cm+"]', '["Под 120см","120-140см","140-160см","160-180см","180см+"]', 11),
  ('Material', 'Материал', 'select', false, '["MDF","Particle Board","Solid Wood","Glass","Carbon Fiber Look","Metal"]', '["MDF","ПДЧ","Масивно дърво","Стъкло","Карбонов вид","Метал"]', 12),
  ('Cable Management', 'Управление кабели', 'select', false, '["Built-in","Grommet Holes","Cable Tray","None"]', '["Вградено","Отвори","Поставка за кабели","Няма"]', 13),
  ('RGB Lighting', 'RGB осветление', 'select', false, '["Yes","No"]', '["Да","Не"]', 14),
  ('Monitor Mount Support', 'Поддръжка за монитор', 'select', false, '["Yes","No"]', '["Да","Не"]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- =====================================================
-- TRADING CARD GAMES ATTRIBUTES
-- =====================================================

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  cat.id,
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM categories cat
CROSS JOIN (VALUES
  ('Card Condition', 'Състояние карта', 'select', true, '["Gem Mint","Near Mint","Lightly Played","Moderately Played","Heavily Played","Damaged"]', '["Перфектно","Почти перфектно","Леко използвано","Умерено използвано","Силно използвано","Повредено"]', 10),
  ('Grading Service', 'Служба за оценка', 'select', false, '["PSA","BGS/Beckett","CGC","Ungraded"]', '["PSA","BGS/Beckett","CGC","Без оценка"]', 11),
  ('Grade', 'Оценка', 'select', false, '["10","9.5","9","8.5","8","7.5","7 or lower","Ungraded"]', '["10","9.5","9","8.5","8","7.5","7 или по-ниско","Без оценка"]', 12),
  ('Rarity', 'Рядкост', 'select', false, '["Common","Uncommon","Rare","Super Rare","Ultra Rare","Secret Rare","Special Art"]', '["Обикновена","Необикновена","Рядка","Супер рядка","Ултра рядка","Секретна рядка","Специално арт"]', 13),
  ('Language', 'Език', 'select', false, '["English","Japanese","Korean","Chinese","Other"]', '["Английски","Японски","Корейски","Китайски","Друг"]', 14),
  ('Set/Expansion', 'Сет/Разширение', 'text', false, '[]', '[]', 15)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
WHERE cat.slug IN ('pokemon-cards', 'mtg-cards', 'yugioh-cards', 'sports-cards', 'dragonball-cards', 'one-piece-cards')
ON CONFLICT DO NOTHING;;
