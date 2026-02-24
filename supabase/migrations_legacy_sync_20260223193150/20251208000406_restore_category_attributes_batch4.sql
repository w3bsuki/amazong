-- Batch 4: Fashion, Beauty, Sports Attributes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  -- Men's Clothing
  SELECT id INTO cat_id FROM categories WHERE slug = 'mens-clothing';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Size', 'Размер', 'select', true, true, '["XS","S","M","L","XL","XXL","3XL","4XL"]', '["XS","S","M","L","XL","XXL","3XL","4XL"]', 1),
      (cat_id, 'Color', 'Цвят', 'select', false, true, '["Black","White","Navy","Gray","Blue","Red","Green","Beige","Brown","Multi"]', '["Черен","Бял","Тъмносин","Сив","Син","Червен","Зелен","Бежов","Кафяв","Многоцветен"]', 2),
      (cat_id, 'Material', 'Материал', 'select', false, true, '["Cotton","Polyester","Wool","Linen","Denim","Leather","Synthetic","Blend"]', '["Памук","Полиестер","Вълна","Лен","Деним","Кожа","Синтетика","Смес"]', 3),
      (cat_id, 'Fit', 'Кройка', 'select', false, true, '["Regular","Slim","Relaxed","Athletic","Oversized"]', '["Стандартна","Слим","Свободна","Атлетична","Оверсайз"]', 4),
      (cat_id, 'Style', 'Стил', 'select', false, true, '["Casual","Formal","Business","Sport","Streetwear"]', '["Ежедневен","Официален","Бизнес","Спортен","Улично"]', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Women's Clothing
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'womens-clothing';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Size', 'Размер', 'select', true, true, '["XXS","XS","S","M","L","XL","XXL","Plus Size"]', '["XXS","XS","S","M","L","XL","XXL","Плюс размер"]', 1),
      (cat_id, 'Color', 'Цвят', 'select', false, true, '["Black","White","Pink","Red","Blue","Green","Beige","Floral","Multi"]', '["Черен","Бял","Розов","Червен","Син","Зелен","Бежов","Флорален","Многоцветен"]', 2),
      (cat_id, 'Material', 'Материал', 'select', false, true, '["Cotton","Silk","Polyester","Wool","Cashmere","Linen","Satin","Chiffon","Blend"]', '["Памук","Коприна","Полиестер","Вълна","Кашмир","Лен","Сатен","Шифон","Смес"]', 3),
      (cat_id, 'Length', 'Дължина', 'select', false, true, '["Mini","Knee-Length","Midi","Maxi","Cropped","Full Length"]', '["Мини","До коляното","Миди","Макси","Къса","Пълна дължина"]', 4),
      (cat_id, 'Occasion', 'Повод', 'select', false, true, '["Casual","Work","Party","Formal","Beach","Lounge"]', '["Ежедневен","Работа","Парти","Официален","Плаж","Домашен"]', 5),
      (cat_id, 'Neckline', 'Деколте', 'select', false, true, '["Round","V-Neck","Square","Boat","Off-Shoulder","Turtleneck","Halter"]', '["Кръгло","V-образно","Квадратно","Лодка","Паднало рамо","Поло","Халтер"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Shoes
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'shoes';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Size EU', 'Размер EU', 'select', true, true, '["35","36","37","38","39","40","41","42","43","44","45","46","47","48"]', '["35","36","37","38","39","40","41","42","43","44","45","46","47","48"]', 1),
      (cat_id, 'Width', 'Ширина', 'select', false, true, '["Narrow","Standard","Wide","Extra Wide"]', '["Тесни","Стандартни","Широки","Много широки"]', 2),
      (cat_id, 'Color', 'Цвят', 'select', false, true, '["Black","White","Brown","Navy","Gray","Red","Multi"]', '["Черен","Бял","Кафяв","Тъмносин","Сив","Червен","Многоцветен"]', 3),
      (cat_id, 'Material', 'Материал', 'select', false, true, '["Leather","Suede","Canvas","Mesh","Synthetic","Rubber"]', '["Кожа","Велур","Платно","Мрежа","Синтетика","Гума"]', 4),
      (cat_id, 'Heel Height', 'Височина на токчета', 'select', false, true, '["Flat","Low (1-3cm)","Medium (4-6cm)","High (7-10cm)","Very High (10cm+)"]', '["Равни","Ниски (1-3см)","Средни (4-6см)","Високи (7-10см)","Много високи (10см+)"]', 5),
      (cat_id, 'Closure', 'Закопчаване', 'select', false, true, '["Lace-Up","Slip-On","Velcro","Buckle","Zipper"]', '["Връзки","Без връзки","Велкро","Катарама","Цип"]', 6)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Hair Care
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'haircare';
  IF cat_id IS NOT NULL THEN
    INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
      (cat_id, 'Hair Type', 'Тип коса', 'select', false, true, '["Normal","Dry","Oily","Combination","Curly","Straight","Wavy","Colored/Treated"]', '["Нормална","Суха","Мазна","Комбинирана","Къдрава","Права","Вълниста","Боядисана"]', 1),
      (cat_id, 'Hair Concern', 'Проблем', 'multiselect', false, true, '["Damage Repair","Volume","Anti-Dandruff","Frizz Control","Color Protection","Hair Loss","Scalp Care","Shine"]', '["Възстановяване","Обем","Против пърхот","Контрол на цъфтеж","Запазване на цвета","Косопад","Грижа за скалпа","Блясък"]', 2),
      (cat_id, 'Formulation', 'Формула', 'select', false, true, '["Regular","Sulfate-Free","Paraben-Free","Silicone-Free","Organic","Vegan"]', '["Стандартна","Без сулфати","Без парабени","Без силикон","Органична","Веган"]', 3),
      (cat_id, 'Size', 'Размер', 'select', false, true, '["Travel (Under 100ml)","Regular (100-300ml)","Large (300-500ml)","Professional (500ml+)"]', '["Пътен (под 100мл)","Стандартен (100-300мл)","Голям (300-500мл)","Професионален (500мл+)"]', 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;;
