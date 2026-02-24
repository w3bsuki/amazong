-- Batch 17: More attributes - Car Seats, Coffee Machines, Mattresses, Sofas, etc.
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Car Seats (Child)
  SELECT id INTO cat_id FROM categories WHERE slug = 'car-seats';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Car Seat Type', 'Тип столче', 'select', true, true, '["Infant (Rear-Facing)","Convertible","Booster","All-in-One"]', '["Бебешко (Назад)","Конвертируемо","Бустер","Всичко в едно"]', 1),
      (cat_id, 'Weight Range', 'Тегловен диапазон', 'select', true, true, '["0-13 kg","0-18 kg","9-36 kg","15-36 kg","0-36 kg"]', '["0-13 кг","0-18 кг","9-36 кг","15-36 кг","0-36 кг"]', 2),
      (cat_id, 'ISOFIX', 'ISOFIX', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 3),
      (cat_id, 'Side Impact Protection', 'Странична защита', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 4),
      (cat_id, 'Rotation', 'Въртене', 'select', false, true, '["None","90°","180°","360°"]', '["Без","90°","180°","360°"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Coffee Machines
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'coffee-machines';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Machine Type', 'Тип машина', 'select', true, true, '["Espresso (Manual)","Automatic","Pod/Capsule","Drip/Filter","French Press","Moka Pot"]', '["Еспресо (Ръчна)","Автоматична","Капсулна","Филтърна","Преса","Мока"]', 1),
      (cat_id, 'Pump Pressure', 'Налягане помпа', 'select', false, true, '["N/A","9 Bar","15 Bar","19 Bar","20 Bar"]', '["Н/П","9 Bar","15 Bar","19 Bar","20 Bar"]', 2),
      (cat_id, 'Grinder', 'Мелачка', 'select', false, true, '["None","Built-in Burr","Built-in Blade"]', '["Без","Вградена конус","Вградена острие"]', 3),
      (cat_id, 'Milk System', 'Система за мляко', 'select', false, true, '["None","Manual Steam Wand","Auto Frother","Integrated Carafe"]', '["Без","Ръчна пара","Автоматичен разпенител","Интегрирана кана"]', 4),
      (cat_id, 'Water Tank', 'Воден резервоар', 'select', false, true, '["Under 1L","1-1.5L","1.5-2L","2L+","Plumbed"]', '["Под 1л","1-1.5л","1.5-2л","2л+","Водопровод"]', 5),
      (cat_id, 'Capsule System', 'Капсулна система', 'select', false, true, '["N/A","Nespresso Original","Nespresso Vertuo","Dolce Gusto","Tassimo","K-Cup","Lavazza"]', '["Н/П","Nespresso Original","Nespresso Vertuo","Dolce Gusto","Tassimo","K-Cup","Lavazza"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Mattresses
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'mattresses';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Mattress Type', 'Тип матрак', 'select', true, true, '["Memory Foam","Innerspring","Hybrid","Latex","Pocket Spring","Airbed"]', '["Мемори пяна","С пружини","Хибриден","Латекс","Джобни пружини","Надуваем"]', 1),
      (cat_id, 'Size', 'Размер', 'select', true, true, '["Single (90x190)","Double (140x190)","King (160x200)","Super King (180x200)","Custom"]', '["Единичен (90x190)","Двоен (140x190)","King (160x200)","Super King (180x200)","По поръчка"]', 2),
      (cat_id, 'Firmness', 'Твърдост', 'select', true, true, '["Soft","Medium-Soft","Medium","Medium-Firm","Firm"]', '["Мека","Средно-мека","Средна","Средно-твърда","Твърда"]', 3),
      (cat_id, 'Thickness', 'Дебелина', 'select', false, true, '["Under 15cm","15-20cm","20-25cm","25-30cm","30cm+"]', '["Под 15см","15-20см","20-25см","25-30см","30см+"]', 4),
      (cat_id, 'Features', 'Характеристики', 'multiselect', false, true, '["Cooling Gel","Orthopedic","Hypoallergenic","Organic","Flippable","Zoned Support"]', '["Охлаждащ гел","Ортопедичен","Хипоалергичен","Органичен","Двустранен","Зони на поддръжка"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Sofas
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'sofas';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Sofa Type', 'Тип диван', 'select', true, true, '["2-Seater","3-Seater","Corner/L-Shaped","Sectional","Sofa Bed","Recliner"]', '["Двуместен","Триместен","Ъглов/L-образен","Секционен","Разтегателен","С релакс"]', 1),
      (cat_id, 'Material', 'Материал', 'select', true, true, '["Fabric","Leather","Faux Leather","Velvet","Linen","Microfiber"]', '["Плат","Кожа","Изкуствена кожа","Кадифе","Лен","Микрофибър"]', 2),
      (cat_id, 'Seating Capacity', 'Места за сядане', 'select', false, true, '["2","3","4","5","6+"]', '["2","3","4","5","6+"]', 3),
      (cat_id, 'Color', 'Цвят', 'select', false, true, '["Gray","Beige","Blue","Green","Brown","Black","White","Multi"]', '["Сив","Бежов","Син","Зелен","Кафяв","Черен","Бял","Многоцветен"]', 4),
      (cat_id, 'Features', 'Характеристики', 'multiselect', false, true, '["Sleeper/Bed","Storage","Reclining","Modular","Reversible Chaise","USB Ports"]', '["Легло","Място за съхранение","Релакс","Модулен","Обръщаема шезлонга","USB портове"]', 5),
      (cat_id, 'Style', 'Стил', 'select', false, true, '["Modern","Scandinavian","Traditional","Mid-Century","Industrial","Bohemian"]', '["Модерен","Скандинавски","Традиционен","Средата на века","Индустриален","Бохемски"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Dining Tables
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'dining-tables';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Shape', 'Форма', 'select', true, true, '["Rectangular","Round","Square","Oval","Extendable"]', '["Правоъгълна","Кръгла","Квадратна","Овална","Разтегателна"]', 1),
      (cat_id, 'Seating Capacity', 'Места за сядане', 'select', true, true, '["2-4","4-6","6-8","8-10","10+"]', '["2-4","4-6","6-8","8-10","10+"]', 2),
      (cat_id, 'Material', 'Материал', 'select', true, true, '["Wood","Glass","Marble","MDF","Metal","Ceramic"]', '["Дърво","Стъкло","Мрамор","МДФ","Метал","Керамика"]', 3),
      (cat_id, 'Style', 'Стил', 'select', false, true, '["Modern","Rustic","Industrial","Scandinavian","Traditional","Contemporary"]', '["Модерен","Рустик","Индустриален","Скандинавски","Традиционен","Съвременен"]', 4),
      (cat_id, 'Set Includes', 'Комплектът включва', 'select', false, true, '["Table Only","Table + 2 Chairs","Table + 4 Chairs","Table + 6 Chairs","Table + Bench"]', '["Само маса","Маса + 2 стола","Маса + 4 стола","Маса + 6 стола","Маса + пейка"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Beds/Bed Frames
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'beds';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Bed Size', 'Размер легло', 'select', true, true, '["Single (90cm)","Double (140cm)","King (160cm)","Super King (180cm)","Bunk"]', '["Единично (90см)","Двойно (140см)","King (160см)","Super King (180см)","Двуетажно"]', 1),
      (cat_id, 'Bed Type', 'Тип легло', 'select', true, true, '["Platform","Panel/Headboard","Storage Bed","Ottoman","Divan","Four Poster"]', '["Платформа","Табла","С място за съхранение","Отоманка","Диван","С колони"]', 2),
      (cat_id, 'Material', 'Материал', 'select', false, true, '["Wood","Metal","Upholstered","MDF","Wicker/Rattan"]', '["Дърво","Метал","Тапициран","МДФ","Ратан"]', 3),
      (cat_id, 'Storage', 'Място за съхранение', 'select', false, true, '["None","Drawers","Lift-Up Ottoman","Under Bed Space"]', '["Без","Чекмеджета","Повдигащ се","Пространство под леглото"]', 4),
      (cat_id, 'Mattress Included', 'С матрак', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
