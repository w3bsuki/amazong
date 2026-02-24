-- Batch 15: More specific attributes - Cooling, Lighting, Musical Instruments, etc.
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- CPU Coolers
  SELECT id INTO cat_id FROM categories WHERE slug = 'cpu-coolers';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Cooler Type', 'Тип охладител', 'select', true, true, '["Air Tower","Low Profile Air","AIO Liquid 120mm","AIO Liquid 240mm","AIO Liquid 280mm","AIO Liquid 360mm","Custom Loop"]', '["Въздушен кула","Въздушен нисък","AIO 120мм","AIO 240мм","AIO 280мм","AIO 360мм","Custom Loop"]', 1),
      (cat_id, 'Socket Compatibility', 'Съвместимост сокет', 'multiselect', true, true, '["LGA 1700","LGA 1200","AM5","AM4"]', '["LGA 1700","LGA 1200","AM5","AM4"]', 2),
      (cat_id, 'TDP Support', 'TDP поддръжка', 'select', false, true, '["Up to 95W","Up to 125W","Up to 165W","Up to 250W","250W+"]', '["До 95W","До 125W","До 165W","До 250W","250W+"]', 3),
      (cat_id, 'Noise Level', 'Ниво на шум', 'select', false, true, '["Silent (<25dBA)","Quiet (25-35dBA)","Standard (35-45dBA)","High Performance (45dBA+)"]', '["Тих (<25dBA)","Спокоен (25-35dBA)","Стандартен (35-45dBA)","Високо представяне (45dBA+)"]', 4),
      (cat_id, 'RGB', 'RGB', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Case Fans
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'case-fans';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Size', 'Размер', 'select', true, true, '["80mm","92mm","120mm","140mm","200mm"]', '["80мм","92мм","120мм","140мм","200мм"]', 1),
      (cat_id, 'Type', 'Тип', 'select', false, true, '["Airflow","Static Pressure","Balanced"]', '["Въздушен поток","Статично налягане","Балансиран"]', 2),
      (cat_id, 'Bearing', 'Лагер', 'select', false, true, '["Sleeve","Rifle","Ball","Fluid Dynamic","Magnetic Levitation"]', '["Sleeve","Rifle","Сачмен","Хидравличен","Магнитна левитация"]', 3),
      (cat_id, 'RGB Lighting', 'RGB осветление', 'select', false, true, '["None","Single Color","ARGB","RGB"]', '["Без","Един цвят","ARGB","RGB"]', 4),
      (cat_id, 'PWM', 'PWM', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Pack Quantity', 'Брой в пакет', 'select', false, true, '["1","2","3","5"]', '["1","2","3","5"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Smart Bulbs
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'smart-bulbs';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Bulb Type', 'Тип крушка', 'select', true, true, '["A19/E27","BR30","E14/Candle","GU10","LED Strip","Light Bar"]', '["A19/E27","BR30","E14/Свещ","GU10","LED лента","Светлинна лента"]', 1),
      (cat_id, 'Color', 'Цвят', 'select', true, true, '["White Only","Tunable White","Color + White"]', '["Само бял","Регулируем бял","Цветен + бял"]', 2),
      (cat_id, 'Connectivity', 'Свързаност', 'multiselect', false, true, '["WiFi","Bluetooth","Zigbee","Matter","Hub Required"]', '["WiFi","Bluetooth","Zigbee","Matter","Изисква хъб"]', 3),
      (cat_id, 'Voice Control', 'Гласов контрол', 'multiselect', false, true, '["Alexa","Google Assistant","Apple HomeKit","Samsung SmartThings"]', '["Alexa","Google Assistant","Apple HomeKit","Samsung SmartThings"]', 4),
      (cat_id, 'Lumens', 'Лумени', 'select', false, true, '["Under 500","500-800","800-1100","1100-1600","1600+"]', '["Под 500","500-800","800-1100","1100-1600","1600+"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Guitars
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'guitars';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Guitar Type', 'Тип китара', 'select', true, true, '["Acoustic","Electric","Classical/Nylon","Bass","Semi-Hollow","Electro-Acoustic"]', '["Акустична","Електрическа","Класическа/Найлон","Бас","Полу-куха","Електро-акустична"]', 1),
      (cat_id, 'Body Shape', 'Форма на тялото', 'select', false, true, '["Dreadnought","Concert","Jumbo","Stratocaster","Les Paul","Telecaster","SG","Superstrat"]', '["Дреднаут","Концертна","Джъмбо","Stratocaster","Les Paul","Telecaster","SG","Superstrat"]', 2),
      (cat_id, 'Body Material', 'Материал на тялото', 'select', false, true, '["Spruce","Mahogany","Maple","Alder","Basswood","Ash"]', '["Смърч","Махагон","Клен","Елша","Липа","Ясен"]', 3),
      (cat_id, 'Number of Strings', 'Брой струни', 'select', false, true, '["4","6","7","8","12"]', '["4","6","7","8","12"]', 4),
      (cat_id, 'Pickup Configuration', 'Конфигурация звукоснематели', 'select', false, true, '["None","SS","SSS","HH","HSS","HSH","P","PJ"]', '["Без","SS","SSS","HH","HSS","HSH","P","PJ"]', 5),
      (cat_id, 'Scale Length', 'Мензура', 'select', false, true, '["Short (24\")","Medium (24.75\")","Long (25.5\")","Bass (34\")"]', '["Къса (24\")","Средна (24.75\")","Дълга (25.5\")","Бас (34\")"]', 6),
      (cat_id, 'Skill Level', 'Ниво', 'select', false, true, '["Beginner","Intermediate","Professional"]', '["Начинаещ","Напреднал","Професионален"]', 7)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Keyboards/Pianos (Musical)
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'piano-keyboards';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Keyboard Type', 'Тип клавиатура', 'select', true, true, '["Digital Piano","Acoustic Piano","MIDI Controller","Synthesizer","Workstation","Arranger"]', '["Цифрово пиано","Акустично пиано","MIDI контролер","Синтезатор","Работна станция","Аранжор"]', 1),
      (cat_id, 'Number of Keys', 'Брой клавиши', 'select', true, true, '["25","37","49","61","73","76","88"]', '["25","37","49","61","73","76","88"]', 2),
      (cat_id, 'Key Action', 'Действие на клавиатурата', 'select', false, true, '["Unweighted/Synth","Semi-Weighted","Weighted","Hammer Action","Graded Hammer"]', '["Без тежест","Полу-тежка","Тежка","Hammer Action","Graded Hammer"]', 3),
      (cat_id, 'Built-in Speakers', 'Вградени говорители', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 4),
      (cat_id, 'Polyphony', 'Полифония', 'select', false, true, '["32 notes","64 notes","128 notes","192 notes","256 notes","Unlimited"]', '["32 ноти","64 ноти","128 ноти","192 ноти","256 ноти","Неограничена"]', 5),
      (cat_id, 'Connectivity', 'Свързаност', 'multiselect', false, true, '["USB","MIDI","Bluetooth","Audio Out","Headphone Jack"]', '["USB","MIDI","Bluetooth","Аудио изход","Жак за слушалки"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
