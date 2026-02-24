-- Batch 6: Real Estate, Vehicles, E-Mobility Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Real Estate
  SELECT id INTO cat_id FROM categories WHERE slug = 'real-estate';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Property Type', 'Тип имот', 'select', true, true, '["Apartment","House","Villa","Studio","Penthouse","Duplex","Commercial","Land","Parking"]', '["Апартамент","Къща","Вила","Студио","Пентхаус","Мезонет","Търговски","Парцел","Паркинг"]', 1),
      (cat_id, 'Transaction', 'Сделка', 'select', true, true, '["For Sale","For Rent","For Exchange"]', '["Продажба","Наем","Замяна"]', 2),
      (cat_id, 'Rooms', 'Стаи', 'select', false, true, '["Studio","1","2","3","4","5+"]', '["Студио","1","2","3","4","5+"]', 3),
      (cat_id, 'Area (sq.m)', 'Площ (кв.м)', 'select', false, true, '["Under 40","40-60","60-80","80-100","100-150","150-200","200+"]', '["Под 40","40-60","60-80","80-100","100-150","150-200","200+"]', 4),
      (cat_id, 'Floor', 'Етаж', 'select', false, true, '["Ground Floor","1-3","4-6","7-10","10+","Last Floor"]', '["Партер","1-3","4-6","7-10","10+","Последен"]', 5),
      (cat_id, 'Construction', 'Строителство', 'select', false, true, '["New Build","Brick","Panel","EPK","Monolith","Other"]', '["Ново строителство","Тухла","Панел","ЕПК","Монолит","Друго"]', 6),
      (cat_id, 'Heating', 'Отопление', 'select', false, true, '["Central","Gas","Electric","Air Conditioning","Fireplace","None"]', '["Централно","Газ","Електрическо","Климатик","Камина","Без"]', 7),
      (cat_id, 'Furnished', 'Обзаведен', 'select', false, true, '["Unfurnished","Semi-Furnished","Fully Furnished"]', '["Необзаведен","Частично обзаведен","Напълно обзаведен"]', 8),
      (cat_id, 'Parking', 'Паркинг', 'select', false, true, '["No Parking","Street Parking","Underground Garage","Dedicated Spot"]', '["Без паркинг","Улично паркиране","Подземен гараж","Определено място"]', 9)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Cars
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'cars';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Make', 'Марка', 'select', true, true, '["Audi","BMW","Mercedes-Benz","Volkswagen","Toyota","Honda","Ford","Opel","Peugeot","Renault","Skoda","Seat","Hyundai","Kia","Mazda","Nissan","Volvo","Tesla","Porsche","Other"]', '["Audi","BMW","Mercedes-Benz","Volkswagen","Toyota","Honda","Ford","Opel","Peugeot","Renault","Skoda","Seat","Hyundai","Kia","Mazda","Nissan","Volvo","Tesla","Porsche","Друго"]', 1),
      (cat_id, 'Year', 'Година', 'select', true, true, '["2024","2023","2022","2021","2020","2019","2018","2017","2016","2015","2010-2014","2005-2009","2000-2004","Before 2000"]', '["2024","2023","2022","2021","2020","2019","2018","2017","2016","2015","2010-2014","2005-2009","2000-2004","Преди 2000"]', 2),
      (cat_id, 'Body Type', 'Тип каросерия', 'select', false, true, '["Sedan","Hatchback","Wagon/Estate","SUV","Crossover","Coupe","Convertible","Pickup","Minivan"]', '["Седан","Хечбек","Комби","Джип/SUV","Кросоувър","Купе","Кабриолет","Пикап","Миниван"]', 3),
      (cat_id, 'Fuel Type', 'Гориво', 'select', true, true, '["Petrol","Diesel","Electric","Hybrid","Plug-in Hybrid","LPG","CNG"]', '["Бензин","Дизел","Електрически","Хибрид","Plug-in хибрид","Газ/LPG","Метан/CNG"]', 4),
      (cat_id, 'Transmission', 'Скоростна кутия', 'select', true, true, '["Manual","Automatic","Semi-Automatic","CVT"]', '["Ръчна","Автоматична","Полуавтоматична","CVT"]', 5),
      (cat_id, 'Mileage (km)', 'Пробег (км)', 'select', false, true, '["Under 10,000","10,000-50,000","50,000-100,000","100,000-150,000","150,000-200,000","200,000+"]', '["Под 10 000","10 000-50 000","50 000-100 000","100 000-150 000","150 000-200 000","200 000+"]', 6),
      (cat_id, 'Engine Size (L)', 'Обем двигател (л)', 'select', false, true, '["Under 1.0L","1.0-1.4L","1.5-1.9L","2.0-2.4L","2.5-2.9L","3.0L+"]', '["Под 1.0л","1.0-1.4л","1.5-1.9л","2.0-2.4л","2.5-2.9л","3.0л+"]', 7),
      (cat_id, 'Power (hp)', 'Мощност (к.с.)', 'select', false, true, '["Under 100hp","100-150hp","150-200hp","200-300hp","300-400hp","400hp+"]', '["Под 100 к.с.","100-150 к.с.","150-200 к.с.","200-300 к.с.","300-400 к.с.","400+ к.с."]', 8),
      (cat_id, 'Drive', 'Задвижване', 'select', false, true, '["FWD (Front)","RWD (Rear)","AWD/4WD"]', '["Предно","Задно","4x4"]', 9),
      (cat_id, 'Color', 'Цвят', 'select', false, true, '["Black","White","Silver","Gray","Blue","Red","Green","Brown","Other"]', '["Черен","Бял","Сребрист","Сив","Син","Червен","Зелен","Кафяв","Друг"]', 10)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- E-Scooters
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'emob-escooters';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Max Speed (km/h)', 'Макс. скорост (км/ч)', 'select', false, true, '["Under 25","25-35","35-50","50-70","70+"]', '["Под 25","25-35","35-50","50-70","70+"]', 1),
      (cat_id, 'Range (km)', 'Пробег (км)', 'select', false, true, '["Under 20","20-40","40-60","60-80","80+"]', '["Под 20","20-40","40-60","60-80","80+"]', 2),
      (cat_id, 'Motor Power (W)', 'Мощност мотор (W)', 'select', false, true, '["250W","350W","500W","800W","1000W+","Dual Motor"]', '["250W","350W","500W","800W","1000W+","Двоен мотор"]', 3),
      (cat_id, 'Max Load (kg)', 'Макс. тегло (кг)', 'select', false, true, '["Under 100","100-120","120-150","150+"]', '["Под 100","100-120","120-150","150+"]', 4),
      (cat_id, 'Foldable', 'Сгъваем', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Tire Type', 'Тип гуми', 'select', false, true, '["Solid","Pneumatic","Honeycomb"]', '["Плътни","Пневматични","Пчелна пита"]', 6),
      (cat_id, 'Suspension', 'Амортисьори', 'select', false, true, '["None","Front Only","Rear Only","Front & Rear"]', '["Без","Само предни","Само задни","Предни и задни"]', 7),
      (cat_id, 'IP Rating', 'IP рейтинг', 'select', false, true, '["None","IP54","IP55","IP65","IP67"]', '["Без","IP54","IP55","IP65","IP67"]', 8)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- E-Bikes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'emob-ebikes';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'E-Bike Type', 'Тип е-велосипед', 'select', true, true, '["City","Mountain","Folding","Cargo","Road","Fat Tire"]', '["Градски","Планински","Сгъваем","Карго","Шосеен","Дебели гуми"]', 1),
      (cat_id, 'Motor Type', 'Тип мотор', 'select', false, true, '["Hub (Rear)","Hub (Front)","Mid-Drive"]', '["Задна главина","Предна главина","Среден"]', 2),
      (cat_id, 'Motor Power', 'Мощност мотор', 'select', false, true, '["250W","350W","500W","750W","1000W+"]', '["250W","350W","500W","750W","1000W+"]', 3),
      (cat_id, 'Battery (Wh)', 'Батерия (Wh)', 'select', false, true, '["Under 400Wh","400-500Wh","500-700Wh","700-1000Wh","1000Wh+"]', '["Под 400Wh","400-500Wh","500-700Wh","700-1000Wh","1000Wh+"]', 4),
      (cat_id, 'Range (km)', 'Пробег (км)', 'select', false, true, '["Under 40","40-60","60-80","80-100","100+"]', '["Под 40","40-60","60-80","80-100","100+"]', 5),
      (cat_id, 'Frame Size', 'Размер рамка', 'select', false, true, '["S (15-16\")","M (17-18\")","L (19-20\")","XL (21\"+)"]', '["S (15-16\")","M (17-18\")","L (19-20\")","XL (21\"+)"]', 6),
      (cat_id, 'Gears', 'Скорости', 'select', false, true, '["Single Speed","7 Speed","8-9 Speed","10-11 Speed","12+ Speed"]', '["Единична","7 скорости","8-9 скорости","10-11 скорости","12+ скорости"]', 7)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
