-- Batch 5: Fragrance, Sports Equipment, Tools Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Fragrance
  SELECT id INTO cat_id FROM categories WHERE slug = 'fragrance';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Fragrance Type', 'Тип парфюм', 'select', true, true, '["Eau de Parfum (EDP)","Eau de Toilette (EDT)","Parfum","Eau de Cologne","Body Mist"]', '["Парфюмна вода (EDP)","Тоалетна вода (EDT)","Парфюм","Одеколон","Спрей за тяло"]', 1),
      (cat_id, 'Scent Family', 'Семейство аромати', 'select', false, true, '["Floral","Oriental","Woody","Fresh","Citrus","Aquatic","Gourmand","Spicy","Fruity"]', '["Цветен","Ориенталски","Дървесен","Свеж","Цитрусов","Воден","Гурме","Пикантен","Плодов"]', 2),
      (cat_id, 'Gender', 'Пол', 'select', true, true, '["Women","Men","Unisex"]', '["Дамски","Мъжки","Унисекс"]', 3),
      (cat_id, 'Size', 'Размер', 'select', false, true, '["Mini (Under 30ml)","Small (30-50ml)","Medium (50-100ml)","Large (100ml+)","Gift Set"]', '["Мини (под 30мл)","Малък (30-50мл)","Среден (50-100мл)","Голям (100мл+)","Подаръчен комплект"]', 4),
      (cat_id, 'Longevity', 'Дълготрайност', 'select', false, true, '["Light (1-2h)","Moderate (3-5h)","Long-Lasting (6-8h)","Very Long-Lasting (8h+)"]', '["Лека (1-2ч)","Умерена (3-5ч)","Дълготрайна (6-8ч)","Много дълготрайна (8ч+)"]', 5),
      (cat_id, 'Season', 'Сезон', 'multiselect', false, true, '["Spring","Summer","Fall","Winter","All Year"]', '["Пролет","Лято","Есен","Зима","Целогодишен"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Sports Equipment (General)
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'sports';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Sport Type', 'Вид спорт', 'select', false, true, '["Football","Basketball","Tennis","Running","Cycling","Swimming","Yoga","Fitness","Hiking","Winter Sports","Martial Arts","Golf","Other"]', '["Футбол","Баскетбол","Тенис","Бягане","Колоездене","Плуване","Йога","Фитнес","Туризъм","Зимни спортове","Бойни изкуства","Голф","Друго"]', 1),
      (cat_id, 'Skill Level', 'Ниво', 'select', false, true, '["Beginner","Intermediate","Advanced","Professional"]', '["Начинаещ","Напреднал","Експерт","Професионален"]', 2),
      (cat_id, 'Gender', 'Пол', 'select', false, true, '["Men","Women","Unisex","Kids"]', '["Мъжки","Дамски","Унисекс","Детски"]', 3),
      (cat_id, 'Indoor/Outdoor', 'Вътре/Навън', 'select', false, true, '["Indoor","Outdoor","Both"]', '["На закрито","На открито","И двете"]', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Fitness Equipment
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'fitness-equipment';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Equipment Type', 'Тип оборудване', 'select', true, true, '["Cardio","Strength","Weights","Yoga/Pilates","Resistance Bands","Accessories"]', '["Кардио","Сила","Тежести","Йога/Пилатес","Ластици","Аксесоари"]', 1),
      (cat_id, 'For Home/Gym', 'За дома/зала', 'select', false, true, '["Home Use","Commercial/Gym","Both"]', '["За дома","Търговски/Зала","И двете"]', 2),
      (cat_id, 'Weight Capacity', 'Макс. тегло', 'select', false, true, '["Up to 100kg","100-150kg","150-200kg","200kg+"]', '["До 100кг","100-150кг","150-200кг","200кг+"]', 3),
      (cat_id, 'Foldable', 'Сгъваемо', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Power Tools
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'power-tools';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Power Source', 'Захранване', 'select', true, true, '["Corded Electric","Cordless Battery","Pneumatic (Air)","Gas"]', '["Кабел","Акумулаторен","Пневматичен","Бензинов"]', 1),
      (cat_id, 'Voltage', 'Волтаж', 'select', false, true, '["12V","18V","20V","24V","36V","40V+"]', '["12V","18V","20V","24V","36V","40V+"]', 2),
      (cat_id, 'Battery Included', 'С батерия', 'select', false, true, '["Yes - 1 Battery","Yes - 2 Batteries","No - Tool Only","N/A - Corded"]', '["Да - 1 батерия","Да - 2 батерии","Не - само инструмент","Н/П - кабел"]', 3),
      (cat_id, 'Brand', 'Марка', 'select', false, true, '["DeWalt","Milwaukee","Makita","Bosch","Ryobi","Black+Decker","Hilti","Metabo","Other"]', '["DeWalt","Milwaukee","Makita","Bosch","Ryobi","Black+Decker","Hilti","Metabo","Друго"]', 4),
      (cat_id, 'Professional Grade', 'Професионален клас', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
