-- Restore category_attributes for Books & Media, Software, Wholesale

-- Books attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('books', 'Format', 'Формат', 'select', true, true, '["Hardcover", "Paperback", "E-Book Code", "Audiobook Code", "Box Set"]', '["Твърди корици", "Меки корици", "Е-книга код", "Аудиокнига код", "Комплект"]', 1),
  ('books', 'Genre', 'Жанр', 'select', true, true, '["Fiction", "Non-Fiction", "Romance", "Mystery", "Sci-Fi", "Fantasy", "Biography", "Self-Help", "Children", "Academic", "Cookbook"]', '["Художествена", "Нехудожествена", "Романтика", "Мистерия", "Sci-Fi", "Фентъзи", "Биография", "Самопомощ", "Детски", "Академична", "Готварска"]', 2),
  ('books', 'Language', 'Език', 'select', true, true, '["Bulgarian", "English", "German", "French", "Spanish", "Russian", "Other"]', '["Български", "Английски", "Немски", "Френски", "Испански", "Руски", "Друг"]', 3),
  ('books', 'Author', 'Автор', 'text', false, false, '[]', '[]', 4),
  ('books', 'Publisher', 'Издателство', 'text', false, false, '[]', '[]', 5),
  ('books', 'Year', 'Година', 'number', false, true, '[]', '[]', 6),
  ('books', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Acceptable", "For Collection"]', '["Ново", "Като ново", "Добро", "Приемливо", "За колекция"]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Music attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('music', 'Format', 'Формат', 'select', true, true, '["Vinyl LP", "CD", "Cassette", "Digital Code", "Box Set"]', '["Винил LP", "CD", "Касета", "Дигитален код", "Комплект"]', 1),
  ('music', 'Genre', 'Жанр', 'select', true, true, '["Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "Classical", "Metal", "R&B", "Country", "Folk", "Bulgarian"]', '["Поп", "Рок", "Хип-хоп", "Електронна", "Джаз", "Класическа", "Метъл", "R&B", "Кънтри", "Фолклор", "Българска"]', 2),
  ('music', 'Artist/Band', 'Изпълнител', 'text', false, true, '[]', '[]', 3),
  ('music', 'Year', 'Година', 'number', false, true, '[]', '[]', 4),
  ('music', 'Condition', 'Състояние', 'select', true, true, '["Sealed", "Mint", "Near Mint", "Very Good", "Good", "Fair"]', '["Запечатано", "Mint", "Near Mint", "Very Good", "Good", "Fair"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Movies & TV attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('movies', 'Format', 'Формат', 'select', true, true, '["DVD", "Blu-ray", "4K UHD", "Digital Code", "VHS", "Box Set"]', '["DVD", "Blu-ray", "4K UHD", "Дигитален код", "VHS", "Комплект"]', 1),
  ('movies', 'Genre', 'Жанр', 'select', true, true, '["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Animation", "Documentary", "Romance", "Thriller", "Kids"]', '["Екшън", "Комедия", "Драма", "Хорър", "Sci-Fi", "Анимация", "Документален", "Романтичен", "Трилър", "Детски"]', 2),
  ('movies', 'Region', 'Регион', 'select', false, true, '["Region Free", "Region A/1", "Region B/2", "Region C/3"]', '["Без регион", "Регион A/1", "Регион B/2", "Регион C/3"]', 3),
  ('movies', 'Languages', 'Езици', 'multiselect', false, true, '["English", "Bulgarian", "German", "French", "Spanish", "Russian", "Subtitles Included"]', '["Английски", "Български", "Немски", "Френски", "Испански", "Руски", "Със субтитри"]', 4),
  ('movies', 'Condition', 'Състояние', 'select', true, true, '["New Sealed", "Like New", "Good", "Acceptable"]', '["Ново запечатано", "Като ново", "Добро", "Приемливо"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Software attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('software', 'Type', 'Тип', 'select', true, true, '["Operating System", "Office Suite", "Antivirus", "Creative Software", "Accounting", "Development Tools", "Utility", "Education"]', '["Операционна система", "Офис пакет", "Антивирус", "Творчески софтуер", "Счетоводен", "Разработка", "Помощни програми", "Образователен"]', 1),
  ('software', 'Platform', 'Платформа', 'select', true, true, '["Windows", "Mac", "Linux", "Cross-Platform"]', '["Windows", "Mac", "Linux", "Кросплатформен"]', 2),
  ('software', 'License Type', 'Тип лиценз', 'select', true, true, '["Lifetime", "Annual", "Monthly", "Per Device", "Per User", "Volume"]', '["Вечен", "Годишен", "Месечен", "На устройство", "На потребител", "Обем"]', 3),
  ('software', 'Version', 'Версия', 'text', false, false, '[]', '[]', 4),
  ('software', 'Delivery', 'Доставка', 'select', true, true, '["Digital Download", "Physical Media", "License Key Only"]', '["Дигитален", "Физически носител", "Само лицензен ключ"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Wholesale Electronics attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('wholesale-electronics', 'Product Category', 'Категория', 'select', true, true, '["Phones", "Tablets", "Laptops", "Accessories", "Audio", "Smart Home", "Components", "Mixed Lot"]', '["Телефони", "Таблети", "Лаптопи", "Аксесоари", "Аудио", "Смарт дом", "Компоненти", "Смесен лот"]', 1),
  ('wholesale-electronics', 'Lot Size', 'Размер на партидата', 'select', true, true, '["10-50 units", "50-100 units", "100-500 units", "500-1000 units", "1000+ units"]', '["10-50 броя", "50-100 броя", "100-500 броя", "500-1000 броя", "1000+ броя"]', 2),
  ('wholesale-electronics', 'Condition Mix', 'Състояние', 'select', true, true, '["All New", "New & Open Box", "Refurbished", "Customer Returns", "Salvage", "Mixed"]', '["Всички нови", "Нови и отворени", "Рефърбиш", "Върнати", "За части", "Смесени"]', 3),
  ('wholesale-electronics', 'Manifest Available', 'Манифест', 'boolean', false, true, '[]', '[]', 4),
  ('wholesale-electronics', 'Minimum Order', 'Мин. поръчка', 'text', false, false, '[]', '[]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Wholesale Clothing attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('wholesale-clothing', 'Category', 'Категория', 'select', true, true, '["Men", "Women", "Kids", "Mixed", "Sportswear", "Underwear", "Accessories"]', '["Мъжки", "Дамски", "Детски", "Смесени", "Спортни", "Бельо", "Аксесоари"]', 1),
  ('wholesale-clothing', 'Lot Size', 'Размер на партидата', 'select', true, true, '["10-50 pieces", "50-100 pieces", "100-500 pieces", "500+ pieces", "Container"]', '["10-50 броя", "50-100 броя", "100-500 броя", "500+ броя", "Контейнер"]', 2),
  ('wholesale-clothing', 'Season', 'Сезон', 'select', false, true, '["Spring/Summer", "Fall/Winter", "All Season", "Mixed"]', '["Пролет/Лято", "Есен/Зима", "Всички сезони", "Смесени"]', 3),
  ('wholesale-clothing', 'Condition', 'Състояние', 'select', true, true, '["New with Tags", "New without Tags", "Store Returns", "Overstock", "Seconds"]', '["Нови с етикет", "Нови без етикет", "Върнати", "Излишък", "Втори сорт"]', 4),
  ('wholesale-clothing', 'Brands', 'Марки', 'text', false, true, '[]', '[]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Wholesale Food attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('wholesale-food', 'Category', 'Категория', 'select', true, true, '["Canned Goods", "Snacks", "Beverages", "Frozen", "Dry Goods", "Organic", "Supplements", "Mixed"]', '["Консерви", "Снаксове", "Напитки", "Замразени", "Сухи храни", "Био", "Добавки", "Смесени"]', 1),
  ('wholesale-food', 'Lot Size', 'Размер на партидата', 'select', true, true, '["Case", "Pallet", "Half Truck", "Full Truck", "Container"]', '["Кашон", "Палет", "Половин камион", "Цял камион", "Контейнер"]', 2),
  ('wholesale-food', 'Expiration', 'Срок на годност', 'select', true, true, '["Long Dated (6+ months)", "Short Dated (1-6 months)", "Near Date (<1 month)", "Best By Passed"]', '["Дълъг срок (6+ месеца)", "Кратък срок (1-6 месеца)", "Близък срок (<1 месец)", "Изтекъл срок"]', 3),
  ('wholesale-food', 'Storage', 'Съхранение', 'select', false, true, '["Ambient", "Refrigerated", "Frozen"]', '["Стайна температура", "Хладилно", "Замразено"]', 4),
  ('wholesale-food', 'Certifications', 'Сертификати', 'multiselect', false, true, '["Organic", "Kosher", "Halal", "Vegan", "Gluten-Free"]', '["Био", "Кошер", "Халал", "Веган", "Без глутен"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
