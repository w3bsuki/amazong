-- Batch 14: Additional category attributes for Drones, Printers, Vacuums, Office
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Drones
  SELECT id INTO cat_id FROM categories WHERE slug = 'drones';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Drone Type', 'Тип дрон', 'select', true, true, '["Camera/Photography","Racing/FPV","Beginner/Toy","Professional","Mini/Compact"]', '["Камера/Фотография","Състезателен/FPV","Начинаещ/Играчка","Професионален","Мини/Компактен"]', 1),
      (cat_id, 'Camera Resolution', 'Резолюция камера', 'select', false, true, '["No Camera","720p","1080p","2.7K","4K","5.1K","8K"]', '["Без камера","720p","1080p","2.7K","4K","5.1K","8K"]', 2),
      (cat_id, 'Flight Time', 'Време на полет', 'select', false, true, '["Under 15 min","15-25 min","25-35 min","35-45 min","45+ min"]', '["Под 15 мин","15-25 мин","25-35 мин","35-45 мин","45+ мин"]', 3),
      (cat_id, 'Range', 'Обхват', 'select', false, true, '["Under 500m","500m-2km","2-5km","5-10km","10km+"]', '["Под 500м","500м-2км","2-5км","5-10км","10км+"]', 4),
      (cat_id, 'GPS', 'GPS', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Obstacle Avoidance', 'Избягване на препятствия', 'select', false, true, '["None","Forward Only","Omni-Directional","APAS/Advanced"]', '["Без","Само напред","Всички посоки","APAS/Разширено"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Printers
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'printers';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Printer Type', 'Тип принтер', 'select', true, true, '["Inkjet","Laser","All-in-One","Photo","Label","3D Printer"]', '["Мастилено-струен","Лазерен","Многофункционален","Фото","Етикети","3D принтер"]', 1),
      (cat_id, 'Color/Mono', 'Цветен/Черно-бял', 'select', true, true, '["Color","Monochrome (B&W)"]', '["Цветен","Черно-бял"]', 2),
      (cat_id, 'Print Speed', 'Скорост на печат', 'select', false, true, '["Up to 10 ppm","10-20 ppm","20-30 ppm","30+ ppm"]', '["До 10 стр/мин","10-20 стр/мин","20-30 стр/мин","30+ стр/мин"]', 3),
      (cat_id, 'Connectivity', 'Свързаност', 'multiselect', false, true, '["USB","WiFi","Ethernet","Bluetooth","WiFi Direct","Cloud Print"]', '["USB","WiFi","Ethernet","Bluetooth","WiFi Direct","Cloud Print"]', 4),
      (cat_id, 'Duplex Printing', 'Двустранен печат', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Paper Size', 'Размер хартия', 'multiselect', false, true, '["A4","A3","Letter","Legal","Photo Sizes","Roll"]', '["A4","A3","Letter","Legal","Фото размери","Рулон"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Vacuum Cleaners
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'vacuum-cleaners';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Vacuum Type', 'Тип прахосмукачка', 'select', true, true, '["Upright","Canister","Stick/Cordless","Handheld","Robot","Wet & Dry"]', '["Изправена","Контейнер","Безжична","Ръчна","Робот","Мокро и сухо"]', 1),
      (cat_id, 'Bagless/Bagged', 'Без торба/С торба', 'select', false, true, '["Bagless","Bagged"]', '["Без торба","С торба"]', 2),
      (cat_id, 'Suction Power', 'Смукателна мощност', 'select', false, true, '["Light Duty","Standard","High Power","Industrial"]', '["Лека употреба","Стандартна","Висока мощност","Индустриална"]', 3),
      (cat_id, 'HEPA Filter', 'HEPA филтър', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 4),
      (cat_id, 'Best For', 'Най-подходяща за', 'multiselect', false, true, '["Hardwood","Carpet","Pet Hair","Allergies","Large Homes","Stairs"]', '["Дървен под","Килим","Косми от животни","Алергии","Големи домове","Стълби"]', 5),
      (cat_id, 'Runtime (Cordless)', 'Работно време', 'select', false, true, '["Under 30 min","30-45 min","45-60 min","60+ min","N/A (Corded)"]', '["Под 30 мин","30-45 мин","45-60 мин","60+ мин","Н/П (Кабелна)"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Office Chairs
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'office-chairs';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Chair Type', 'Тип стол', 'select', true, true, '["Task Chair","Executive","Ergonomic","Gaming","Kneeling","Ball Chair"]', '["Работен","Директорски","Ергономичен","Гейминг","Коленичещ","Топка"]', 1),
      (cat_id, 'Material', 'Материал', 'select', false, true, '["Mesh","Fabric","Leather","Faux Leather","Vinyl"]', '["Мрежа","Плат","Кожа","Изкуствена кожа","Винил"]', 2),
      (cat_id, 'Adjustable Features', 'Регулируеми функции', 'multiselect', false, true, '["Height","Armrests","Lumbar Support","Headrest","Tilt","Seat Depth"]', '["Височина","Подлакътници","Лумбална опора","Облегалка за глава","Наклон","Дълбочина на седалката"]', 3),
      (cat_id, 'Weight Capacity', 'Макс. тегло', 'select', false, true, '["Up to 100kg","100-130kg","130-150kg","150kg+"]', '["До 100кг","100-130кг","130-150кг","150кг+"]', 4),
      (cat_id, 'Warranty', 'Гаранция', 'select', false, true, '["1 Year","2 Years","5 Years","10+ Years","Lifetime"]', '["1 година","2 години","5 години","10+ години","Доживотна"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Projectors
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'projectors';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Technology', 'Технология', 'select', true, true, '["DLP","LCD","LED","Laser","LCoS"]', '["DLP","LCD","LED","Лазерен","LCoS"]', 1),
      (cat_id, 'Resolution', 'Резолюция', 'select', true, true, '["SVGA (800x600)","WXGA (1280x800)","Full HD (1080p)","4K UHD"]', '["SVGA (800x600)","WXGA (1280x800)","Full HD (1080p)","4K UHD"]', 2),
      (cat_id, 'Brightness', 'Яркост', 'select', false, true, '["Under 2000 Lumens","2000-3000 Lumens","3000-4000 Lumens","4000+ Lumens"]', '["Под 2000 лумена","2000-3000 лумена","3000-4000 лумена","4000+ лумена"]', 3),
      (cat_id, 'Throw Distance', 'Разстояние', 'select', false, true, '["Ultra Short Throw","Short Throw","Standard","Long Throw"]', '["Ултра кратко","Кратко","Стандартно","Дълго"]', 4),
      (cat_id, 'Use Case', 'Употреба', 'select', false, true, '["Home Theater","Business/Office","Portable","Outdoor","Gaming"]', '["Домашно кино","Бизнес/Офис","Преносим","Навън","Гейминг"]', 5),
      (cat_id, 'Smart Features', 'Смарт функции', 'multiselect', false, true, '["Built-in Streaming","WiFi","Bluetooth","Screen Mirroring","Voice Control"]', '["Вградено стрийминг","WiFi","Bluetooth","Огледален екран","Гласов контрол"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
