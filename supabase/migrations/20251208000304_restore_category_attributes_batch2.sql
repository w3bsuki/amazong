-- Batch 2: Audio/Headphones, TVs, and Cameras Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Audio/Headphones
  SELECT id INTO cat_id FROM categories WHERE slug = 'headphones';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Headphone Type', 'Тип слушалки', 'select', true, true, '["Over-Ear","On-Ear","In-Ear/Earbuds","True Wireless (TWS)","Neckband","Bone Conduction","Open-Back","Closed-Back"]', '["Наушници","На ухото","В ухото","Безжични (TWS)","Тип яка","Костна проводимост","Отворен гръб","Затворен гръб"]', 1),
      (cat_id, 'Connection Type', 'Тип връзка', 'multiselect', true, true, '["Wired 3.5mm","Wired USB-C","Wired USB-A","Bluetooth 5.0","Bluetooth 5.2","Bluetooth 5.3","2.4GHz Wireless","Both Wired & Wireless"]', '["Кабел 3.5mm","Кабел USB-C","Кабел USB-A","Bluetooth 5.0","Bluetooth 5.2","Bluetooth 5.3","2.4GHz Безжични","Кабел и безжични"]', 2),
      (cat_id, 'Noise Cancellation', 'Шумопотискане', 'select', false, true, '["None","Passive","Active (ANC)","Adaptive ANC","Transparency Mode"]', '["Без","Пасивно","Активно (ANC)","Адаптивно ANC","Режим прозрачност"]', 3),
      (cat_id, 'Driver Size', 'Размер драйвер', 'select', false, true, '["Under 10mm","10-30mm","30-40mm","40-50mm","50mm+"]', '["Под 10mm","10-30mm","30-40mm","40-50mm","50mm+"]', 4),
      (cat_id, 'Battery Life', 'Живот на батерията', 'select', false, true, '["Under 10h","10-20h","20-30h","30-40h","40-50h","50h+"]', '["Под 10ч","10-20ч","20-30ч","30-40ч","40-50ч","50ч+"]', 5),
      (cat_id, 'Water Resistance', 'Водоустойчивост', 'select', false, true, '["None","IPX4 (Splash)","IPX5 (Rain)","IPX7 (Immersible)","IP68"]', '["Без","IPX4 (Пръски)","IPX5 (Дъжд)","IPX7 (Потапяне)","IP68"]', 6),
      (cat_id, 'Best For', 'Най-подходящи за', 'multiselect', false, true, '["Gaming","Music Production","Sports/Workout","Commuting","Office/Work","Home Use","Audiophile"]', '["Гейминг","Музикално продуциране","Спорт","Пътуване","Офис","Домашна употреба","Аудиофил"]', 7)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- TVs Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'tvs';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Screen Size', 'Размер на екрана', 'select', true, true, '["32\"","40-43\"","50-55\"","65\"","75\"","85\"+"]', '["32\"","40-43\"","50-55\"","65\"","75\"","85\"+"]', 1),
      (cat_id, 'Resolution', 'Резолюция', 'select', true, true, '["HD (720p)","Full HD (1080p)","4K UHD","8K"]', '["HD (720p)","Full HD (1080p)","4K UHD","8K"]', 2),
      (cat_id, 'Display Type', 'Тип дисплей', 'select', true, true, '["LED","QLED","OLED","Mini-LED","Micro-LED","Neo QLED"]', '["LED","QLED","OLED","Mini-LED","Micro-LED","Neo QLED"]', 3),
      (cat_id, 'Smart TV', 'Smart TV', 'select', false, true, '["Yes - Android TV","Yes - Google TV","Yes - WebOS (LG)","Yes - Tizen (Samsung)","Yes - Fire TV","Yes - Roku","No"]', '["Да - Android TV","Да - Google TV","Да - WebOS (LG)","Да - Tizen (Samsung)","Да - Fire TV","Да - Roku","Не"]', 4),
      (cat_id, 'Refresh Rate', 'Честота на опресняване', 'select', false, true, '["60Hz","100Hz","120Hz","144Hz"]', '["60Hz","100Hz","120Hz","144Hz"]', 5),
      (cat_id, 'HDR', 'HDR', 'multiselect', false, true, '["None","HDR10","HDR10+","Dolby Vision","HLG"]', '["Без","HDR10","HDR10+","Dolby Vision","HLG"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Cameras Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'cameras';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Camera Type', 'Тип камера', 'select', true, true, '["DSLR","Mirrorless","Point & Shoot","Action Camera","Instant Camera","Film Camera","Medium Format"]', '["DSLR","Безогледална","Компактна","Екшън камера","Моментна камера","Филмова камера","Среден формат"]', 1),
      (cat_id, 'Sensor Size', 'Размер на сензора', 'select', false, true, '["Full Frame","APS-C","Micro Four Thirds","1-inch","1/2.3-inch","Medium Format"]', '["Пълен кадър","APS-C","Micro Four Thirds","1 инч","1/2.3 инча","Среден формат"]', 2),
      (cat_id, 'Megapixels', 'Мегапиксели', 'select', true, true, '["Under 12MP","12-24MP","24-36MP","36-50MP","50-100MP","100MP+"]', '["Под 12MP","12-24MP","24-36MP","36-50MP","50-100MP","100MP+"]', 3),
      (cat_id, 'Video Resolution', 'Видео резолюция', 'select', false, true, '["1080p","4K","6K","8K"]', '["1080p","4K","6K","8K"]', 4),
      (cat_id, 'Mount Type', 'Тип байонет', 'select', false, true, '["Canon EF/RF","Nikon F/Z","Sony E/FE","Fuji X","MFT","Leica L/M"]', '["Canon EF/RF","Nikon F/Z","Sony E/FE","Fuji X","MFT","Leica L/M"]', 5),
      (cat_id, 'Viewfinder Type', 'Тип визьор', 'select', false, true, '["Optical (OVF)","Electronic (EVF)","LCD Only","Hybrid"]', '["Оптичен (OVF)","Електронен (EVF)","Само LCD","Хибриден"]', 6),
      (cat_id, 'Image Stabilization', 'Стабилизация', 'select', false, true, '["None","In-Body (IBIS)","Lens-Based","Both"]', '["Без","В тялото (IBIS)","В обектива","И двете"]', 7),
      (cat_id, 'Weather Sealed', 'Водоустойчива', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 8)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
