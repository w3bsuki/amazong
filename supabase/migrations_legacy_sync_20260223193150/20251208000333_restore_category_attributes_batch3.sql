-- Batch 3: Gaming, Wearables, Home & Kitchen Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Gaming Consoles
  SELECT id INTO cat_id FROM categories WHERE slug = 'gaming-consoles';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Console Brand', 'Марка конзола', 'select', true, true, '["PlayStation","Xbox","Nintendo","Steam Deck","Retro"]', '["PlayStation","Xbox","Nintendo","Steam Deck","Ретро"]', 1),
      (cat_id, 'Console Generation', 'Поколение', 'select', true, true, '["Current Gen","Previous Gen","Retro/Classic"]', '["Текущо поколение","Предишно поколение","Ретро/Класика"]', 2),
      (cat_id, 'Storage', 'Памет', 'select', false, true, '["500GB","825GB","1TB","2TB"]', '["500GB","825GB","1TB","2TB"]', 3),
      (cat_id, 'Edition', 'Издание', 'select', false, true, '["Standard","Digital Only","Pro/Enhanced","Limited Edition"]', '["Стандартно","Само цифрово","Pro/Подобрено","Лимитирано издание"]', 4),
      (cat_id, 'Bundle Contents', 'Съдържание на пакета', 'multiselect', false, false, '["Console Only","Extra Controller","Games Included","Headset","Charging Dock"]', '["Само конзола","Допълнителен контролер","Включени игри","Слушалки","Докинг станция"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Video Games
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'video-games';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Platform', 'Платформа', 'select', true, true, '["PlayStation 5","PlayStation 4","Xbox Series X/S","Xbox One","Nintendo Switch","PC","Multi-Platform"]', '["PlayStation 5","PlayStation 4","Xbox Series X/S","Xbox One","Nintendo Switch","PC","Мулти-платформа"]', 1),
      (cat_id, 'Genre', 'Жанр', 'multiselect', false, true, '["Action","Adventure","RPG","Sports","Racing","Shooter","Fighting","Strategy","Simulation","Puzzle","Horror","Family"]', '["Екшън","Приключенска","RPG","Спортна","Състезателна","Шутър","Файтинг","Стратегия","Симулатор","Пъзел","Хорър","Семейна"]', 2),
      (cat_id, 'Format', 'Формат', 'select', true, true, '["Physical Disc","Digital Code"]', '["Физически диск","Цифров код"]', 3),
      (cat_id, 'PEGI Rating', 'PEGI рейтинг', 'select', false, true, '["3+","7+","12+","16+","18+"]', '["3+","7+","12+","16+","18+"]', 4),
      (cat_id, 'Online Required', 'Изисква интернет', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Smartwatches
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'smartwatches';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Watch OS', 'Операционна система', 'select', true, true, '["watchOS (Apple)","Wear OS (Google)","Tizen (Samsung)","Garmin OS","Fitbit OS","Proprietary"]', '["watchOS (Apple)","Wear OS (Google)","Tizen (Samsung)","Garmin OS","Fitbit OS","Собствена"]', 1),
      (cat_id, 'Case Size', 'Размер корпус', 'select', false, true, '["38-40mm","41-42mm","44-45mm","46-47mm","49mm+"]', '["38-40mm","41-42mm","44-45mm","46-47mm","49mm+"]', 2),
      (cat_id, 'Display Type', 'Тип дисплей', 'select', false, true, '["AMOLED","OLED","LCD","Always-On Display"]', '["AMOLED","OLED","LCD","Always-On дисплей"]', 3),
      (cat_id, 'Connectivity', 'Свързаност', 'multiselect', false, true, '["Bluetooth","WiFi","GPS","Cellular (LTE)","NFC"]', '["Bluetooth","WiFi","GPS","Клетъчна (LTE)","NFC"]', 4),
      (cat_id, 'Health Features', 'Здравни функции', 'multiselect', false, true, '["Heart Rate","SpO2","ECG","Blood Pressure","Sleep Tracking","Stress Tracking","Temperature"]', '["Сърдечен ритъм","SpO2","ЕКГ","Кръвно налягане","Проследяване на съня","Проследяване на стреса","Температура"]', 5),
      (cat_id, 'Water Resistance', 'Водоустойчивост', 'select', false, true, '["IP67","IP68","5ATM","10ATM","Diving Rated"]', '["IP67","IP68","5ATM","10ATM","За гмуркане"]', 6),
      (cat_id, 'Battery Life', 'Живот на батерията', 'select', false, true, '["Up to 18h","1-2 Days","3-7 Days","7-14 Days","14+ Days"]', '["До 18ч","1-2 дни","3-7 дни","7-14 дни","14+ дни"]', 7)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Fitness Trackers
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'fitness-trackers';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Form Factor', 'Форма', 'select', false, true, '["Band","Watch-Style","Clip-On","Ring"]', '["Гривна","Часовник","Клип","Пръстен"]', 1),
      (cat_id, 'Display', 'Дисплей', 'select', false, true, '["OLED","LCD","No Display"]', '["OLED","LCD","Без дисплей"]', 2),
      (cat_id, 'Activity Tracking', 'Проследяване', 'multiselect', false, true, '["Steps","Distance","Calories","Floors Climbed","Active Minutes","Swimming","Cycling","Running"]', '["Стъпки","Разстояние","Калории","Изкачени етажи","Активни минути","Плуване","Колоездене","Бягане"]', 3),
      (cat_id, 'Battery Life', 'Живот на батерията', 'select', false, true, '["Up to 5 Days","5-7 Days","7-14 Days","14+ Days"]', '["До 5 дни","5-7 дни","7-14 дни","14+ дни"]', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
