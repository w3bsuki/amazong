-- Batch 18: More attributes - Lawnmowers, BBQs, Pools, Security, LEGO, etc.
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Lawn Mowers
  SELECT id INTO cat_id FROM categories WHERE slug = 'lawn-mowers';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Mower Type', 'Тип косачка', 'select', true, true, '["Push/Walk-Behind","Self-Propelled","Ride-On","Robot","Hover"]', '["Ръчна","Самоходна","Тракторна","Робот","Hover"]', 1),
      (cat_id, 'Power Source', 'Захранване', 'select', true, true, '["Electric (Corded)","Cordless (Battery)","Petrol","Manual"]', '["Електрическа","Акумулаторна","Бензинова","Ръчна"]', 2),
      (cat_id, 'Cutting Width', 'Ширина на рязане', 'select', false, true, '["Under 30cm","30-40cm","40-50cm","50-60cm","60cm+"]', '["Под 30см","30-40см","40-50см","50-60см","60см+"]', 3),
      (cat_id, 'Garden Size', 'Размер градина', 'select', false, true, '["Small (up to 200sqm)","Medium (200-500sqm)","Large (500-1000sqm)","Very Large (1000sqm+)"]', '["Малка (до 200кв.м)","Средна (200-500кв.м)","Голяма (500-1000кв.м)","Много голяма (1000кв.м+)"]', 4),
      (cat_id, 'Grass Box Capacity', 'Капацитет кош', 'select', false, true, '["Under 30L","30-50L","50-70L","70L+","No Box"]', '["Под 30л","30-50л","50-70л","70л+","Без кош"]', 5),
      (cat_id, 'Mulching', 'Мулчиране', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- BBQ & Grills
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'bbq-grills';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Grill Type', 'Тип грил', 'select', true, true, '["Gas","Charcoal","Electric","Pellet/Smoker","Portable","Kamado"]', '["Газов","Въглен","Електрически","Пелетен/Пушач","Преносим","Камадо"]', 1),
      (cat_id, 'Number of Burners', 'Брой горелки', 'select', false, true, '["1","2","3","4","5","6+","N/A"]', '["1","2","3","4","5","6+","Н/П"]', 2),
      (cat_id, 'Cooking Area', 'Площ за готвене', 'select', false, true, '["Small (under 2000 sqcm)","Medium (2000-3500 sqcm)","Large (3500-5000 sqcm)","Extra Large (5000+ sqcm)"]', '["Малка (под 2000 кв.см)","Средна (2000-3500 кв.см)","Голяма (3500-5000 кв.см)","Много голяма (5000+ кв.см)"]', 3),
      (cat_id, 'Features', 'Характеристики', 'multiselect', false, true, '["Side Burner","Warming Rack","Temperature Gauge","Rotisserie","Smoker Box","Foldable Shelves"]', '["Странична горелка","Затоплящ рафт","Термометър","Ротисери","Пушач","Сгъваеми рафтове"]', 4),
      (cat_id, 'Material', 'Материал', 'select', false, true, '["Stainless Steel","Porcelain-Coated","Cast Iron","Ceramic"]', '["Неръждаема стомана","Порцеланово покритие","Чугун","Керамика"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Swimming Pools
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'pools';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Pool Type', 'Тип басейн', 'select', true, true, '["Inflatable","Frame/Steel","Above Ground","In-Ground","Kiddie/Splash"]', '["Надуваем","С рамка","Надземен","Вкопан","Детски"]', 1),
      (cat_id, 'Shape', 'Форма', 'select', false, true, '["Round","Rectangular","Oval","Irregular"]', '["Кръгъл","Правоъгълен","Овален","Неправилна"]', 2),
      (cat_id, 'Size', 'Размер', 'select', false, true, '["Small (under 3m)","Medium (3-5m)","Large (5-7m)","Extra Large (7m+)"]', '["Малък (под 3м)","Среден (3-5м)","Голям (5-7м)","Много голям (7м+)"]', 3),
      (cat_id, 'Depth', 'Дълбочина', 'select', false, true, '["Under 60cm","60-90cm","90-120cm","120-150cm","150cm+"]', '["Под 60см","60-90см","90-120см","120-150см","150см+"]', 4),
      (cat_id, 'Included Accessories', 'Включени аксесоари', 'multiselect', false, true, '["Filter Pump","Ladder","Cover","Ground Cloth","Skimmer"]', '["Филтърна помпа","Стълба","Покривало","Подложка","Скимер"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Security Cameras
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'security-cameras';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Camera Type', 'Тип камера', 'select', true, true, '["Indoor","Outdoor","Indoor/Outdoor","Doorbell","PTZ (Pan-Tilt-Zoom)","Floodlight"]', '["Вътрешна","Външна","Вътрешна/Външна","За врата","PTZ","С прожектор"]', 1),
      (cat_id, 'Resolution', 'Резолюция', 'select', true, true, '["1080p","2K","4K","5MP+"]', '["1080p","2K","4K","5MP+"]', 2),
      (cat_id, 'Power Source', 'Захранване', 'select', false, true, '["Wired (AC)","Battery","Solar","PoE (Ethernet)"]', '["Кабел (AC)","Батерия","Соларна","PoE (Ethernet)"]', 3),
      (cat_id, 'Storage', 'Съхранение', 'multiselect', false, true, '["Cloud","Local SD Card","NVR/DVR","No Storage"]', '["Облак","Локална SD карта","NVR/DVR","Без съхранение"]', 4),
      (cat_id, 'Features', 'Характеристики', 'multiselect', false, true, '["Night Vision","Two-Way Audio","Motion Detection","AI Person Detection","Siren/Alarm","Spotlight"]', '["Нощно виждане","Двупосочно аудио","Детекция на движение","AI детекция","Сирена","Прожектор"]', 5),
      (cat_id, 'Smart Home', 'Смарт дом', 'multiselect', false, true, '["Alexa","Google Assistant","Apple HomeKit","IFTTT"]', '["Alexa","Google Assistant","Apple HomeKit","IFTTT"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- LEGO
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'lego';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Theme', 'Тема', 'select', true, true, '["City","Star Wars","Technic","Creator","Architecture","Harry Potter","Marvel","DC","Ninjago","Friends","DUPLO","Ideas","Speed Champions","Minecraft","Other"]', '["City","Star Wars","Technic","Creator","Architecture","Harry Potter","Marvel","DC","Ninjago","Friends","DUPLO","Ideas","Speed Champions","Minecraft","Друго"]', 1),
      (cat_id, 'Age Range', 'Възраст', 'select', true, true, '["1.5-3 (DUPLO)","4-7","8-12","13+","16+","18+"]', '["1.5-3 (DUPLO)","4-7","8-12","13+","16+","18+"]', 2),
      (cat_id, 'Piece Count', 'Брой части', 'select', false, true, '["Under 100","100-500","500-1000","1000-2000","2000-5000","5000+"]', '["Под 100","100-500","500-1000","1000-2000","2000-5000","5000+"]', 3),
      (cat_id, 'Set Type', 'Тип комплект', 'select', false, true, '["Building Set","Minifigure Pack","Polybag","Gift Set","Limited Edition"]', '["Комплект за сглобяване","Пакет минифигури","Полибег","Подаръчен комплект","Лимитирано издание"]', 4),
      (cat_id, 'New/Retired', 'Нов/Изтеглен', 'select', false, true, '["Current","Retired","Coming Soon"]', '["Актуален","Изтеглен","Очаквано"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
