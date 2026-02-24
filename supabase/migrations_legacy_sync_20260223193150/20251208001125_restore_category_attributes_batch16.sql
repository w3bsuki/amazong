-- Batch 16: Bags, Sunglasses, Home Appliances, Baby Gear
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Backpacks
  SELECT id INTO cat_id FROM categories WHERE slug = 'backpacks';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Backpack Type', 'Тип раница', 'select', true, true, '["Everyday/Casual","Laptop/Business","Hiking/Outdoor","Travel","School","Tactical"]', '["Ежедневна","Лаптоп/Бизнес","Туризъм","Пътническа","Ученическа","Тактическа"]', 1),
      (cat_id, 'Capacity (L)', 'Капацитет (л)', 'select', false, true, '["Under 15L","15-25L","25-35L","35-50L","50-70L","70L+"]', '["Под 15л","15-25л","25-35л","35-50л","50-70л","70л+"]', 2),
      (cat_id, 'Laptop Size', 'Размер лаптоп', 'select', false, true, '["No Laptop Compartment","13\"","14\"","15-15.6\"","17\""]', '["Без отделение","13\"","14\"","15-15.6\"","17\""]', 3),
      (cat_id, 'Material', 'Материал', 'select', false, true, '["Nylon","Polyester","Canvas","Leather","Recycled Materials"]', '["Найлон","Полиестер","Брезент","Кожа","Рециклирани материали"]', 4),
      (cat_id, 'Water Resistant', 'Водоустойчива', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5),
      (cat_id, 'Features', 'Характеристики', 'multiselect', false, true, '["USB Charging Port","Anti-Theft","Rain Cover","Hip Belt","Chest Strap"]', '["USB порт","Анти-кражба","Калъф за дъжд","Колан за таз","Гръден колан"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Sunglasses
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'sunglasses';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Frame Shape', 'Форма на рамка', 'select', false, true, '["Aviator","Wayfarer","Round","Square","Cat Eye","Oversized","Sport/Wrap","Rectangular"]', '["Авиатор","Wayfarer","Кръгли","Квадратни","Котешко око","Големи","Спортни","Правоъгълни"]', 1),
      (cat_id, 'Frame Material', 'Материал рамка', 'select', false, true, '["Plastic/Acetate","Metal","Titanium","Wood","TR90/Nylon"]', '["Пластмаса/Ацетат","Метал","Титан","Дърво","TR90/Найлон"]', 2),
      (cat_id, 'Lens Type', 'Тип лещи', 'select', false, true, '["Standard","Polarized","Photochromic","Mirrored","Gradient"]', '["Стандартни","Поляризирани","Фотохромни","Огледални","Градиент"]', 3),
      (cat_id, 'Lens Color', 'Цвят лещи', 'select', false, true, '["Gray","Brown","Green","Blue","Yellow/Night Vision","Multi"]', '["Сиви","Кафяви","Зелени","Сини","Жълти/Нощно виждане","Многоцветни"]', 4),
      (cat_id, 'UV Protection', 'UV защита', 'select', false, true, '["UV400","Cat. 1","Cat. 2","Cat. 3","Cat. 4"]', '["UV400","Кат. 1","Кат. 2","Кат. 3","Кат. 4"]', 5),
      (cat_id, 'Gender', 'Пол', 'select', false, true, '["Men","Women","Unisex","Kids"]', '["Мъжки","Дамски","Унисекс","Детски"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Air Conditioners
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'air-conditioners';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'AC Type', 'Тип климатик', 'select', true, true, '["Split System","Window Unit","Portable","Central","Mini-Split"]', '["Сплит система","Прозоречен","Преносим","Централен","Мини-сплит"]', 1),
      (cat_id, 'Cooling Capacity (BTU)', 'Охлаждащ капацитет (BTU)', 'select', true, true, '["5000-8000","9000-12000","12000-18000","18000-24000","24000+"]', '["5000-8000","9000-12000","12000-18000","18000-24000","24000+"]', 2),
      (cat_id, 'Energy Class', 'Енергиен клас', 'select', false, true, '["A+++","A++","A+","A","B","C"]', '["A+++","A++","A+","A","B","C"]', 3),
      (cat_id, 'Inverter', 'Инвертор', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 4),
      (cat_id, 'Features', 'Характеристики', 'multiselect', false, true, '["Heating","WiFi Control","Air Purifier","Sleep Mode","Timer","Self-Clean"]', '["Отопление","WiFi управление","Пречистване","Нощен режим","Таймер","Самопочистване"]', 5),
      (cat_id, 'Room Size', 'Размер на стая', 'select', false, true, '["Up to 15 sqm","15-25 sqm","25-35 sqm","35-50 sqm","50+ sqm"]', '["До 15 кв.м","15-25 кв.м","25-35 кв.м","35-50 кв.м","50+ кв.м"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Washing Machines
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'washing-machines';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Type', 'Тип', 'select', true, true, '["Front Load","Top Load","Washer-Dryer Combo"]', '["Предно зареждане","Горно зареждане","Перална със сушилня"]', 1),
      (cat_id, 'Capacity (kg)', 'Капацитет (кг)', 'select', true, true, '["5-6 kg","7-8 kg","9-10 kg","11-12 kg","12+ kg"]', '["5-6 кг","7-8 кг","9-10 кг","11-12 кг","12+ кг"]', 2),
      (cat_id, 'Energy Class', 'Енергиен клас', 'select', false, true, '["A","B","C","D"]', '["A","B","C","D"]', 3),
      (cat_id, 'Spin Speed (RPM)', 'Центрофуга (об/мин)', 'select', false, true, '["800","1000","1200","1400","1600"]', '["800","1000","1200","1400","1600"]', 4),
      (cat_id, 'Smart Features', 'Смарт функции', 'multiselect', false, true, '["WiFi","App Control","Steam","Quick Wash","Delay Start","Auto Dosing"]', '["WiFi","Приложение","Пара","Бързо пране","Отложен старт","Автоматично дозиране"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Strollers
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'strollers';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Stroller Type', 'Тип количка', 'select', true, true, '["Standard","Lightweight","Jogger","Double/Twin","Travel System","Umbrella"]', '["Стандартна","Лека","За бягане","Двойна","Пътнически комплект","Сгъваема"]', 1),
      (cat_id, 'Age Range', 'Възрастов диапазон', 'select', false, true, '["Newborn+","6 Months+","Toddler (1-3 years)"]', '["Новородено+","6 месеца+","Малко дете (1-3 години)"]', 2),
      (cat_id, 'Weight Capacity', 'Макс. тегло', 'select', false, true, '["Up to 15kg","Up to 22kg","Up to 25kg","25kg+"]', '["До 15кг","До 22кг","До 25кг","25кг+"]', 3),
      (cat_id, 'Folding', 'Сгъване', 'select', false, true, '["One-Hand Fold","Two-Hand Fold","Compact Fold","Self-Standing Fold"]', '["С една ръка","С две ръце","Компактно","Самостоящо"]', 4),
      (cat_id, 'Features', 'Характеристики', 'multiselect', false, true, '["Reversible Seat","Reclining Seat","Adjustable Handlebar","Large Basket","Rain Cover","Car Seat Compatible"]', '["Обръщаема седалка","Легнала седалка","Регулируема дръжка","Голяма кошница","Дъждобран","Съвместимост с столче"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
