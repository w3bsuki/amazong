-- Batch 8: Home, Kitchen, Garden, Baby/Kids Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Furniture
  SELECT id INTO cat_id FROM categories WHERE slug = 'furniture';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Room', 'Стая', 'select', false, true, '["Living Room","Bedroom","Dining Room","Office","Kids Room","Bathroom","Outdoor"]', '["Хол","Спалня","Трапезария","Офис","Детска стая","Баня","Двор"]', 1),
      (cat_id, 'Material', 'Материал', 'select', false, true, '["Wood","MDF","Metal","Plastic","Glass","Fabric","Leather","Rattan","Mixed"]', '["Дърво","МДФ","Метал","Пластмаса","Стъкло","Плат","Кожа","Ратан","Смесен"]', 2),
      (cat_id, 'Style', 'Стил', 'select', false, true, '["Modern","Scandinavian","Industrial","Traditional","Minimalist","Rustic","Contemporary","Bohemian"]', '["Модерен","Скандинавски","Индустриален","Традиционен","Минималистичен","Рустик","Съвременен","Бохемски"]', 3),
      (cat_id, 'Color', 'Цвят', 'select', false, true, '["White","Black","Natural Wood","Gray","Brown","Beige","Oak","Walnut","Multi"]', '["Бял","Черен","Натурално дърво","Сив","Кафяв","Бежов","Дъб","Орех","Многоцветен"]', 4),
      (cat_id, 'Assembly', 'Сглобяване', 'select', false, true, '["Ready Assembled","Self-Assembly","Professional Assembly Required"]', '["Готов","Самостоятелно сглобяване","Изисква професионален монтаж"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Kitchen Appliances
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'kitchen-appliances';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Appliance Type', 'Тип уред', 'select', true, true, '["Refrigerator","Dishwasher","Oven","Microwave","Coffee Machine","Blender","Mixer","Toaster","Kettle","Air Fryer","Other"]', '["Хладилник","Съдомиялна","Фурна","Микровълнова","Кафемашина","Блендер","Миксер","Тостер","Чайник","Еър фрайър","Друго"]', 1),
      (cat_id, 'Energy Class', 'Енергиен клас', 'select', false, true, '["A+++","A++","A+","A","B","C","D"]', '["A+++","A++","A+","A","B","C","D"]', 2),
      (cat_id, 'Capacity', 'Капацитет', 'select', false, true, '["Small","Medium","Large","Extra Large"]', '["Малък","Среден","Голям","Много голям"]', 3),
      (cat_id, 'Color', 'Цвят', 'select', false, true, '["White","Black","Silver/Stainless","Red","Cream/Beige"]', '["Бял","Черен","Сребрист/Инокс","Червен","Кремав/Бежов"]', 4),
      (cat_id, 'Built-in/Freestanding', 'Вграден/Свободностоящ', 'select', false, true, '["Built-in","Freestanding"]', '["Вграден","Свободностоящ"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Garden Tools
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'garden-tools';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Tool Type', 'Тип инструмент', 'select', true, true, '["Lawn Mower","Trimmer","Chainsaw","Hedge Trimmer","Leaf Blower","Pressure Washer","Hand Tools","Irrigation"]', '["Косачка","Тример","Верижен трион","Храсторез","Духалка","Водоструйка","Ръчни инструменти","Напояване"]', 1),
      (cat_id, 'Power Source', 'Захранване', 'select', false, true, '["Electric (Corded)","Cordless (Battery)","Petrol","Manual"]', '["Електрически (кабел)","Акумулаторен","Бензинов","Ръчен"]', 2),
      (cat_id, 'Garden Size', 'Размер градина', 'select', false, true, '["Small (Up to 200 sqm)","Medium (200-500 sqm)","Large (500-1000 sqm)","Professional (1000+ sqm)"]', '["Малка (до 200 кв.м)","Средна (200-500 кв.м)","Голяма (500-1000 кв.м)","Професионална (1000+ кв.м)"]', 3)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Baby Clothing
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'baby-clothing';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Size', 'Размер', 'select', true, true, '["Newborn (0-3M)","3-6M","6-9M","9-12M","12-18M","18-24M","2T","3T","4T"]', '["Новородено (0-3М)","3-6М","6-9М","9-12М","12-18М","18-24М","2Г","3Г","4Г"]', 1),
      (cat_id, 'Gender', 'Пол', 'select', false, true, '["Boy","Girl","Unisex"]', '["Момче","Момиче","Унисекс"]', 2),
      (cat_id, 'Material', 'Материал', 'select', false, true, '["100% Cotton","Organic Cotton","Cotton Blend","Fleece","Wool"]', '["100% памук","Органичен памук","Памучна смес","Полар","Вълна"]', 3),
      (cat_id, 'Season', 'Сезон', 'select', false, true, '["Summer","Winter","Spring/Fall","All Season"]', '["Лято","Зима","Пролет/Есен","Целогодишен"]', 4),
      (cat_id, 'Item Type', 'Тип дреха', 'select', false, true, '["Bodysuits","Sleepwear","Outerwear","Sets","Pants","Tops","Dresses","Accessories"]', '["Бодита","Пижами","Връхни дрехи","Комплекти","Панталони","Блузи","Рокли","Аксесоари"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Toys (General)
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'toys-games';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Age Group', 'Възрастова група', 'select', true, true, '["0-12 Months","1-2 Years","3-4 Years","5-7 Years","8-11 Years","12+ Years","Adult"]', '["0-12 месеца","1-2 години","3-4 години","5-7 години","8-11 години","12+ години","Възрастен"]', 1),
      (cat_id, 'Toy Type', 'Тип играчка', 'select', false, true, '["Building Blocks","Dolls","Action Figures","Vehicles","Puzzles","Board Games","Educational","Outdoor","Electronic","Plush"]', '["Конструктори","Кукли","Екшън фигури","Превозни средства","Пъзели","Настолни игри","Образователни","За навън","Електронни","Плюшени"]', 2),
      (cat_id, 'Brand', 'Марка', 'select', false, true, '["LEGO","Hasbro","Mattel","Fisher-Price","Playmobil","Hot Wheels","Barbie","Nerf","Other"]', '["LEGO","Hasbro","Mattel","Fisher-Price","Playmobil","Hot Wheels","Barbie","Nerf","Друго"]', 3),
      (cat_id, 'Gender', 'Пол', 'select', false, true, '["Boys","Girls","Unisex"]', '["Момчета","Момичета","Унисекс"]', 4),
      (cat_id, 'Educational', 'Образователна', 'boolean', false, true, '["Yes","No"]', '["Да","Не"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
