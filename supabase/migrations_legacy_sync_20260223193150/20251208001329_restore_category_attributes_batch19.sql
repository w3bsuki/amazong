-- Batch 19: More specific attributes - Headsets, Webcams, Microphones, Speakers, etc.
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Gaming Headsets
  SELECT id INTO cat_id FROM categories WHERE slug = 'gaming-headsets';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Platform', 'Платформа', 'multiselect', true, true, '["PC","PlayStation","Xbox","Nintendo Switch","Multi-Platform"]', '["PC","PlayStation","Xbox","Nintendo Switch","Мулти-платформа"]', 1),
      (cat_id, 'Connection', 'Връзка', 'select', true, true, '["Wired USB","Wired 3.5mm","Wireless 2.4GHz","Wireless Bluetooth","Wired + Wireless"]', '["USB кабел","3.5mm кабел","Безжична 2.4GHz","Bluetooth","Кабел + Безжична"]', 2),
      (cat_id, 'Surround Sound', 'Съраунд звук', 'select', false, true, '["Stereo","7.1 Virtual","7.1 True","Dolby Atmos"]', '["Стерео","7.1 виртуален","7.1 истински","Dolby Atmos"]', 3),
      (cat_id, 'Microphone', 'Микрофон', 'select', false, true, '["Boom (Flip-to-Mute)","Boom (Detachable)","Retractable","Built-in","No Microphone"]', '["Щанга (Завърти да заглушиш)","Щанга (Свалящ се)","Прибиращ се","Вграден","Без микрофон"]', 4),
      (cat_id, 'RGB Lighting', 'RGB осветление', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Noise Cancellation', 'Шумопотискане', 'select', false, true, '["None","Passive","Active (ANC)"]', '["Без","Пасивно","Активно (ANC)"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Webcams
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'webcams';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Resolution', 'Резолюция', 'select', true, true, '["720p","1080p","2K","4K"]', '["720p","1080p","2K","4K"]', 1),
      (cat_id, 'Frame Rate', 'Кадри в секунда', 'select', false, true, '["30fps","60fps","90fps+"]', '["30fps","60fps","90fps+"]', 2),
      (cat_id, 'Field of View', 'Зрителен ъгъл', 'select', false, true, '["Narrow (60-70°)","Standard (70-90°)","Wide (90-110°)","Ultra Wide (110°+)"]', '["Тесен (60-70°)","Стандартен (70-90°)","Широк (90-110°)","Ултра широк (110°+)"]', 3),
      (cat_id, 'Microphone', 'Микрофон', 'select', false, true, '["None","Mono","Stereo","Noise Cancelling"]', '["Без","Моно","Стерео","С шумопотискане"]', 4),
      (cat_id, 'Autofocus', 'Автофокус', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Privacy Cover', 'Капак за поверителност', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Microphones
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'microphones';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Microphone Type', 'Тип микрофон', 'select', true, true, '["Condenser","Dynamic","Ribbon","USB","Lavalier","Shotgun"]', '["Кондензаторен","Динамичен","Лентов","USB","Брошка","Насочен"]', 1),
      (cat_id, 'Polar Pattern', 'Посока на звукозапис', 'select', false, true, '["Cardioid","Omnidirectional","Bidirectional","Multi-Pattern"]', '["Кардиоидна","Всепосочна","Двупосочна","Многорежимна"]', 2),
      (cat_id, 'Connection', 'Връзка', 'select', true, true, '["USB","XLR","USB + XLR","3.5mm","Wireless"]', '["USB","XLR","USB + XLR","3.5mm","Безжична"]', 3),
      (cat_id, 'Use Case', 'Употреба', 'multiselect', false, true, '["Streaming","Podcasting","Vocals","Instruments","Gaming","Video Calls"]', '["Стрийминг","Подкастинг","Вокали","Инструменти","Гейминг","Видео разговори"]', 4),
      (cat_id, 'Included Accessories', 'Включени аксесоари', 'multiselect', false, true, '["Stand","Pop Filter","Shock Mount","Windscreen","Boom Arm"]', '["Стойка","Поп филтър","Амортисьорно закрепване","Ветрозащита","Стрела"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Bluetooth Speakers
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'bluetooth-speakers';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Speaker Type', 'Тип колонка', 'select', true, true, '["Portable","Home/Bookshelf","Outdoor/Rugged","Party/Large","Mini/Ultra-Portable"]', '["Преносима","Домашна","За навън","Парти","Мини"]', 1),
      (cat_id, 'Water Resistance', 'Водоустойчивост', 'select', false, true, '["None","IPX4 (Splash)","IPX5 (Rain)","IPX7 (Submersible)","IP67/68"]', '["Без","IPX4 (Пръски)","IPX5 (Дъжд)","IPX7 (Потапяне)","IP67/68"]', 2),
      (cat_id, 'Battery Life', 'Живот на батерията', 'select', false, true, '["Under 10h","10-15h","15-24h","24-40h","40h+","No Battery (AC)"]', '["Под 10ч","10-15ч","15-24ч","24-40ч","40ч+","Без батерия (AC)"]', 3),
      (cat_id, 'Voice Assistant', 'Гласов асистент', 'multiselect', false, true, '["None","Alexa","Google Assistant","Siri"]', '["Без","Alexa","Google Assistant","Siri"]', 4),
      (cat_id, 'Stereo Pairing', 'Стерео двойка', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Features', 'Характеристики', 'multiselect', false, true, '["RGB Lights","Power Bank","Built-in Mic","Multi-Room","AUX Input","SD Card"]', '["RGB светлини","Powerbank","Вграден микрофон","Много стаи","AUX вход","SD карта"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Soundbars
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'soundbars';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Channel Configuration', 'Конфигурация канали', 'select', true, true, '["2.0","2.1","3.1","5.1","7.1","Atmos/DTS:X"]', '["2.0","2.1","3.1","5.1","7.1","Atmos/DTS:X"]', 1),
      (cat_id, 'Subwoofer', 'Субуфер', 'select', false, true, '["None","Built-in","Wireless Sub Included","Wired Sub Included"]', '["Без","Вграден","Безжичен включен","Кабелен включен"]', 2),
      (cat_id, 'Total Power', 'Обща мощност', 'select', false, true, '["Under 100W","100-200W","200-400W","400W+"]', '["Под 100W","100-200W","200-400W","400W+"]', 3),
      (cat_id, 'Connectivity', 'Свързаност', 'multiselect', false, true, '["HDMI ARC/eARC","Optical","Bluetooth","WiFi","AUX","USB"]', '["HDMI ARC/eARC","Оптичен","Bluetooth","WiFi","AUX","USB"]', 4),
      (cat_id, 'Smart Features', 'Смарт функции', 'multiselect', false, true, '["Alexa","Google Assistant","AirPlay 2","Chromecast","Spotify Connect"]', '["Alexa","Google Assistant","AirPlay 2","Chromecast","Spotify Connect"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
