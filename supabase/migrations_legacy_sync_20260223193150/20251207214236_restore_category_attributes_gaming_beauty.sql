-- Restore category_attributes for Gaming & Beauty

-- Gaming Console attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('gaming-consoles', 'Platform', 'Платформа', 'select', true, true, '["PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "Nintendo Switch OLED", "Nintendo Switch Lite", "Steam Deck"]', '["PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "Nintendo Switch OLED", "Nintendo Switch Lite", "Steam Deck"]', 1),
  ('gaming-consoles', 'Storage', 'Памет', 'select', false, true, '["500GB", "825GB", "1TB", "2TB"]', '["500GB", "825GB", "1TB", "2TB"]', 2),
  ('gaming-consoles', 'Edition', 'Издание', 'select', false, true, '["Standard", "Digital", "Disc", "Limited Edition", "Bundle"]', '["Стандартно", "Дигитално", "С диск", "Лимитирано издание", "Комплект"]', 3),
  ('gaming-consoles', 'Includes', 'Включва', 'multiselect', false, false, '["Controller", "Games", "Charging Station", "Headset", "Original Box"]', '["Контролер", "Игри", "Зарядна станция", "Слушалки", "Оригинална кутия"]', 4),
  ('gaming-consoles', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Video Games attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('gaming-games', 'Platform', 'Платформа', 'select', true, true, '["PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "PC"]', '["PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "PC"]', 1),
  ('gaming-games', 'Genre', 'Жанр', 'select', false, true, '["Action", "Adventure", "RPG", "Sports", "Racing", "Shooter", "Strategy", "Simulation", "Fighting", "Puzzle"]', '["Екшън", "Приключенска", "RPG", "Спортна", "Състезателна", "Шутър", "Стратегия", "Симулатор", "Файтинг", "Пъзел"]', 2),
  ('gaming-games', 'Format', 'Формат', 'select', true, true, '["Physical Disc", "Digital Code"]', '["Физически диск", "Дигитален код"]', 3),
  ('gaming-games', 'Region', 'Регион', 'select', false, true, '["Region Free", "PAL", "NTSC"]', '["Без регион", "PAL", "NTSC"]', 4),
  ('gaming-games', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "Like New", "Good", "Fair"]', '["Ново запечатано", "Като ново", "Добро", "Задоволително"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Gaming Accessories attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('gaming-accessories', 'Type', 'Тип', 'select', true, true, '["Controller", "Headset", "Keyboard", "Mouse", "Mousepad", "Chair", "Monitor", "Webcam", "Microphone", "VR Headset"]', '["Контролер", "Слушалки", "Клавиатура", "Мишка", "Подложка", "Стол", "Монитор", "Уебкамера", "Микрофон", "VR очила"]', 1),
  ('gaming-accessories', 'Compatible With', 'Съвместимост', 'multiselect', false, true, '["PC", "PlayStation", "Xbox", "Nintendo Switch", "Universal"]', '["PC", "PlayStation", "Xbox", "Nintendo Switch", "Универсални"]', 2),
  ('gaming-accessories', 'Connectivity', 'Свързване', 'select', false, true, '["Wired", "Wireless", "Bluetooth", "2.4GHz"]', '["Кабелно", "Безжично", "Bluetooth", "2.4GHz"]', 3),
  ('gaming-accessories', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair"]', '["Ново", "Като ново", "Добро", "Задоволително"]', 4)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Skincare attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('skincare', 'Product Type', 'Тип продукт', 'select', true, true, '["Cleanser", "Moisturizer", "Serum", "Toner", "Sunscreen", "Mask", "Eye Cream", "Exfoliator"]', '["Почистващ продукт", "Хидратант", "Серум", "Тоник", "Слънцезащита", "Маска", "Крем за очи", "Ексфолиант"]', 1),
  ('skincare', 'Skin Type', 'Тип кожа', 'select', false, true, '["Normal", "Oily", "Dry", "Combination", "Sensitive", "All Skin Types"]', '["Нормална", "Мазна", "Суха", "Комбинирана", "Чувствителна", "Всички типове"]', 2),
  ('skincare', 'Skin Concern', 'Грижа за', 'multiselect', false, true, '["Acne", "Anti-Aging", "Dark Spots", "Hydration", "Pores", "Redness", "Wrinkles"]', '["Акне", "Анти-ейджинг", "Тъмни петна", "Хидратация", "Пори", "Зачервяване", "Бръчки"]', 3),
  ('skincare', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 4),
  ('skincare', 'Size', 'Размер', 'text', false, false, '[]', '[]', 5),
  ('skincare', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open Box", "Partially Used"]', '["Ново запечатано", "Ново отворено", "Частично използвано"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Makeup attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, options::jsonb, options_bg::jsonb, v.sort_order
FROM (VALUES
  ('makeup', 'Product Type', 'Тип продукт', 'select', true, true, '["Foundation", "Concealer", "Powder", "Blush", "Bronzer", "Highlighter", "Primer", "Setting Spray"]', '["Фон дьо тен", "Коректор", "Пудра", "Руж", "Бронзър", "Хайлайтър", "Праймър", "Фиксатор"]', 1),
  ('makeup', 'Shade Range', 'Цветова гама', 'select', false, true, '["Fair", "Light", "Medium", "Tan", "Deep", "Universal"]', '["Светла", "Лека", "Средна", "Тен", "Тъмна", "Универсална"]', 2),
  ('makeup', 'Finish', 'Финиш', 'select', false, true, '["Matte", "Dewy", "Satin", "Natural", "Radiant"]', '["Матов", "Блестящ", "Сатенен", "Естествен", "Сияен"]', 3),
  ('makeup', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 4),
  ('makeup', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open Box", "Swatched Only"]', '["Ново запечатано", "Ново отворено", "Само тествано"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Hair Care attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('hair-care', 'Product Type', 'Тип продукт', 'select', true, true, '["Shampoo", "Conditioner", "Hair Mask", "Hair Oil", "Heat Protectant", "Styling Product", "Hair Treatment", "Hair Color"]', '["Шампоан", "Балсам", "Маска за коса", "Олио за коса", "Термозащита", "Стилизиращ продукт", "Терапия", "Боя за коса"]', 1),
  ('hair-care', 'Hair Type', 'Тип коса', 'select', false, true, '["Normal", "Oily", "Dry", "Damaged", "Color-Treated", "Curly", "Fine", "Thick"]', '["Нормална", "Мазна", "Суха", "Увредена", "Боядисана", "Къдрава", "Тънка", "Гъста"]', 2),
  ('hair-care', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 3),
  ('hair-care', 'Size', 'Размер', 'text', false, false, '[]', '[]', 4),
  ('hair-care', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Open Box"]', '["Ново запечатано", "Ново отворено"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Fragrances attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('fragrances', 'Type', 'Тип', 'select', true, true, '["Eau de Parfum", "Eau de Toilette", "Cologne", "Body Spray", "Perfume Oil"]', '["Парфюмна вода", "Тоалетна вода", "Одеколон", "Спрей за тяло", "Парфюмно масло"]', 1),
  ('fragrances', 'Gender', 'За', 'select', true, true, '["Men", "Women", "Unisex"]', '["Мъже", "Жени", "Унисекс"]', 2),
  ('fragrances', 'Size', 'Размер (ml)', 'select', true, true, '["30ml", "50ml", "75ml", "100ml", "125ml", "150ml", "200ml"]', '["30мл", "50мл", "75мл", "100мл", "125мл", "150мл", "200мл"]', 3),
  ('fragrances', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 4),
  ('fragrances', 'Scent Family', 'Аромат', 'select', false, true, '["Floral", "Woody", "Oriental", "Fresh", "Citrus", "Spicy", "Aquatic"]', '["Цветен", "Дървесен", "Ориенталски", "Свеж", "Цитрусов", "Пикантен", "Воден"]', 5),
  ('fragrances', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "New Unboxed", "Partially Used"]', '["Ново запечатано", "Ново без кутия", "Частично използвано"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
