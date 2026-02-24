-- Batch 12: Outdoor, Camping, Bicycles, Sports Equipment
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Bicycles
  SELECT id INTO cat_id FROM categories WHERE slug = 'bicycles';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Bike Type', 'Тип велосипед', 'select', true, true, '["Mountain (MTB)","Road","Hybrid/City","BMX","Gravel","Touring","Folding","Kids"]', '["Планински (MTB)","Шосеен","Хибрид/Градски","BMX","Гравел","Туринг","Сгъваем","Детски"]', 1),
      (cat_id, 'Frame Size', 'Размер рамка', 'select', false, true, '["XS (14-15\")","S (15-17\")","M (17-18\")","L (18-20\")","XL (20-22\")","XXL (22\"+)"]', '["XS (14-15\")","S (15-17\")","M (17-18\")","L (18-20\")","XL (20-22\")","XXL (22\"+)"]', 2),
      (cat_id, 'Wheel Size', 'Размер колело', 'select', false, true, '["26\"","27.5\"","29\"","700c","20\"","24\""]', '["26\"","27.5\"","29\"","700c","20\"","24\""]', 3),
      (cat_id, 'Frame Material', 'Материал рамка', 'select', false, true, '["Aluminum","Carbon","Steel","Titanium"]', '["Алуминий","Карбон","Стомана","Титан"]', 4),
      (cat_id, 'Gears', 'Скорости', 'select', false, true, '["Single Speed","7-9 Speed","10-11 Speed","12 Speed","Internal Hub"]', '["Единична","7-9 скорости","10-11 скорости","12 скорости","Вътрешна главина"]', 5),
      (cat_id, 'Suspension', 'Амортисьор', 'select', false, true, '["None (Rigid)","Hardtail (Front)","Full Suspension"]', '["Без (Твърд)","Hardtail (Преден)","Пълен амортисьор"]', 6),
      (cat_id, 'Brake Type', 'Тип спирачки', 'select', false, true, '["Disc (Hydraulic)","Disc (Mechanical)","Rim (V-Brake)","Rim (Caliper)"]', '["Дискови (Хидравлични)","Дискови (Механични)","Фелгови (V-Brake)","Фелгови (Калипер)"]', 7)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Camping & Tents
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'camping-tents';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Capacity', 'Капацитет', 'select', true, true, '["1 Person","2 Person","3-4 Person","5-6 Person","7+ Person","Family"]', '["1 човек","2 човека","3-4 човека","5-6 човека","7+ човека","Семейна"]', 1),
      (cat_id, 'Season Rating', 'Сезонност', 'select', false, true, '["2-Season","3-Season","3-4 Season","4-Season (Winter)"]', '["2 сезона","3 сезона","3-4 сезона","4 сезона (Зимна)"]', 2),
      (cat_id, 'Tent Type', 'Тип палатка', 'select', false, true, '["Dome","Tunnel","Cabin","Pop-Up/Instant","Backpacking","Roof Top"]', '["Куполна","Тунелна","Кабина","Pop-Up/Моментална","За туризъм","За покрив"]', 3),
      (cat_id, 'Weight', 'Тегло', 'select', false, true, '["Ultralight (Under 1.5kg)","Light (1.5-3kg)","Standard (3-5kg)","Heavy (5kg+)"]', '["Ултра леко (под 1.5кг)","Леко (1.5-3кг)","Стандартно (3-5кг)","Тежко (5кг+)"]', 4),
      (cat_id, 'Setup Type', 'Монтаж', 'select', false, true, '["Pole","Inflatable","Pop-Up","Cabin/Frame"]', '["С колове","Надуваема","Pop-Up","С рамка"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Sleeping Bags
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'sleeping-bags';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Temperature Rating', 'Температурен рейтинг', 'select', true, true, '["Summer (+10°C and up)","3-Season (0°C to +10°C)","Cold Weather (-10°C to 0°C)","Winter (-20°C and below)"]', '["Летен (+10°C и нагоре)","3 сезона (0°C до +10°C)","Студено време (-10°C до 0°C)","Зимен (-20°C и надолу)"]', 1),
      (cat_id, 'Shape', 'Форма', 'select', false, true, '["Mummy","Rectangular","Semi-Rectangular","Double"]', '["Мумия","Правоъгълен","Полуправоъгълен","Двоен"]', 2),
      (cat_id, 'Fill Type', 'Пълнеж', 'select', false, true, '["Synthetic","Down","Hybrid"]', '["Синтетичен","Пух","Хибриден"]', 3),
      (cat_id, 'Size', 'Размер', 'select', false, true, '["Regular","Long","Short"]', '["Стандартен","Дълъг","Къс"]', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Running Shoes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'running-shoes';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Running Type', 'Тип бягане', 'select', true, true, '["Road Running","Trail Running","Track/Racing","Cross Training"]', '["Шосейно бягане","Трейл бягане","Писта/Състезания","Кроссфит"]', 1),
      (cat_id, 'Cushioning', 'Амортизация', 'select', false, true, '["Minimal","Moderate","Maximum","Stability"]', '["Минимална","Умерена","Максимална","Стабилност"]', 2),
      (cat_id, 'Drop', 'Дроп', 'select', false, true, '["Zero Drop (0mm)","Low (1-4mm)","Medium (5-8mm)","Standard (9-12mm)","High (12mm+)"]', '["Нулев дроп (0мм)","Нисък (1-4мм)","Среден (5-8мм)","Стандартен (9-12мм)","Висок (12мм+)"]', 3),
      (cat_id, 'Arch Support', 'Поддръжка на свода', 'select', false, true, '["Neutral","Stability","Motion Control"]', '["Неутрална","Стабилност","Контрол на движението"]', 4),
      (cat_id, 'Width', 'Ширина', 'select', false, true, '["Narrow","Standard","Wide","Extra Wide"]', '["Тесни","Стандартни","Широки","Много широки"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Golf Clubs
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'golf-clubs';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Club Type', 'Тип стик', 'select', true, true, '["Driver","Fairway Wood","Hybrid","Irons","Wedge","Putter","Complete Set"]', '["Драйвър","Фейрвей уд","Хибрид","Айрони","Уедж","Пътер","Пълен комплект"]', 1),
      (cat_id, 'Skill Level', 'Ниво', 'select', false, true, '["Beginner","Intermediate","Advanced","Tour/Pro"]', '["Начинаещ","Напреднал","Експерт","Професионален"]', 2),
      (cat_id, 'Hand', 'Ръка', 'select', true, true, '["Right","Left"]', '["Дясна","Лява"]', 3),
      (cat_id, 'Shaft Material', 'Материал шафт', 'select', false, true, '["Graphite","Steel"]', '["Графит","Стомана"]', 4),
      (cat_id, 'Shaft Flex', 'Флекс', 'select', false, true, '["Ladies","Senior","Regular","Stiff","Extra Stiff"]', '["Дамски","Сениор","Регулар","Твърд","Много твърд"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
