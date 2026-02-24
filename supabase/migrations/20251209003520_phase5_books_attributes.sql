
-- Phase 5: Books - Comprehensive Attributes

-- Get Books L0 ID
DO $$
DECLARE
  books_l0_id UUID;
BEGIN
  SELECT id INTO books_l0_id FROM categories WHERE slug = 'books';
  IF books_l0_id IS NULL THEN
    RAISE EXCEPTION 'Books L0 category not found';
  END IF;
END $$;

-- L0: Books - Universal Book Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'books'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Condition', 'Състояние', 'select', true, '["New", "Like New", "Very Good", "Good", "Acceptable", "For Collectors"]', '["Ново", "Като ново", "Много добро", "Добро", "Приемливо", "За колекционери"]', 1),
  ('Format', 'Формат', 'select', true, '["Hardcover", "Paperback", "Mass Market", "Board Book", "Spiral", "Loose Leaf", "E-Book", "Audiobook"]', '["Твърда корица", "Мека корица", "Джобен формат", "Картонена книжка", "Спирала", "Разхлабени листа", "Е-книга", "Аудиокнига"]', 2),
  ('Language', 'Език', 'select', true, '["Bulgarian", "English", "German", "French", "Russian", "Spanish", "Italian", "Other"]', '["Български", "Английски", "Немски", "Френски", "Руски", "Испански", "Италиански", "Друг"]', 3),
  ('Publication Year', 'Година на издаване', 'select', false, '["2024", "2023", "2022", "2021", "2020", "2010-2019", "2000-2009", "1990-1999", "1980-1989", "Before 1980"]', '["2024", "2023", "2022", "2021", "2020", "2010-2019", "2000-2009", "1990-1999", "1980-1989", "Преди 1980"]', 4),
  ('Edition', 'Издание', 'select', false, '["First Edition", "Revised Edition", "Anniversary Edition", "Collectors Edition", "Limited Edition", "Signed Edition", "Standard Edition"]', '["Първо издание", "Ревизирано издание", "Юбилейно издание", "Колекционерско", "Лимитирано", "Подписано издание", "Стандартно издание"]', 5)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: Fiction Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'books-fiction'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Genre', 'Жанр', 'select', true, '["Literary Fiction", "Thriller", "Mystery", "Romance", "Science Fiction", "Fantasy", "Horror", "Historical", "Adventure", "Crime", "Dystopian"]', '["Литературна проза", "Трилър", "Мистерия", "Любовен роман", "Научна фантастика", "Фентъзи", "Хорър", "Исторически", "Приключенски", "Криминален", "Дистопия"]', 1),
  ('Reading Level', 'Ниво на четене', 'select', false, '["Adult", "Young Adult", "New Adult", "Middle Grade", "Easy Read"]', '["Възрастни", "Младежки", "Нов възрастен", "Среден клас", "Лесно четене"]', 2),
  ('Series', 'Серия', 'select', false, '["Standalone", "Part of Series", "Complete Series", "Boxed Set"]', '["Самостоятелна", "Част от серия", "Пълна серия", "Комплект"]', 3),
  ('Page Count', 'Брой страници', 'select', false, '["Under 100", "100-200", "200-400", "400-600", "600-800", "Over 800"]', '["Под 100", "100-200", "200-400", "400-600", "600-800", "Над 800"]', 4),
  ('Award Winner', 'Награждавана', 'boolean', false, '["true", "false"]', '["Да", "Не"]', 5)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: Non-Fiction Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'books-nonfiction'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Subject', 'Предмет', 'select', true, '["History", "Science", "Philosophy", "Psychology", "Self-Help", "Health", "Technology", "Politics", "Travel", "True Crime", "Sports"]', '["История", "Наука", "Философия", "Психология", "Самопомощ", "Здраве", "Технологии", "Политика", "Пътуване", "Истински престъпления", "Спорт"]', 1),
  ('Illustrations', 'Илюстрации', 'select', false, '["Color Photos", "Black & White", "Charts/Graphs", "Maps", "None"]', '["Цветни снимки", "Черно-бели", "Графики", "Карти", "Без"]', 2),
  ('Academic Level', 'Академично ниво', 'select', false, '["General Audience", "Introductory", "Intermediate", "Advanced", "Expert"]', '["Широка публика", "Въвеждащо", "Средно", "Напреднало", "Експертно"]', 3)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: Children's Books Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'childrens-books'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Age Range', 'Възрастов диапазон', 'select', true, '["0-2 Years", "3-5 Years", "6-8 Years", "9-12 Years", "Teen (13+)"]', '["0-2 години", "3-5 години", "6-8 години", "9-12 години", "Тийнейджъри (13+)"]', 1),
  ('Illustrations', 'Илюстрации', 'select', false, '["Full Color", "Black & White", "Photography", "Mixed Media"]', '["Пълноцветни", "Черно-бели", "Фотографии", "Смесена техника"]', 2),
  ('Theme', 'Тема', 'multiselect', false, '["Animals", "Adventure", "Friendship", "Family", "School", "Magic", "Nature", "Learning", "Diversity"]', '["Животни", "Приключения", "Приятелство", "Семейство", "Училище", "Магия", "Природа", "Учене", "Разнообразие"]', 3),
  ('Interactive Features', 'Интерактивни елементи', 'multiselect', false, '["Pop-Up", "Lift the Flap", "Touch and Feel", "Sound", "Stickers", "None"]', '["Подвижни", "Отваряне на капачета", "Докосни и усети", "Звук", "Стикери", "Без"]', 4)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: Textbooks Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'textbooks'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Subject', 'Предмет', 'select', true, '["Mathematics", "Science", "Literature", "History", "Geography", "Languages", "Computer Science", "Engineering", "Medicine", "Law", "Business"]', '["Математика", "Науки", "Литература", "История", "География", "Езици", "Компютърни науки", "Инженерство", "Медицина", "Право", "Бизнес"]', 1),
  ('Education Level', 'Образователно ниво', 'select', true, '["Elementary", "Middle School", "High School", "Undergraduate", "Graduate", "Professional"]', '["Начално", "Прогимназия", "Гимназия", "Бакалавър", "Магистър", "Професионално"]', 2),
  ('Access Code', 'Код за достъп', 'select', false, '["Included", "Not Included", "Used/Redeemed", "Digital Only"]', '["Включен", "Не е включен", "Използван", "Само дигитален"]', 3),
  ('Annotations', 'Анотации', 'select', false, '["None", "Light", "Moderate", "Heavy", "Highlighted Only"]', '["Без", "Леки", "Умерени", "Много", "Само маркирани"]', 4)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: Comics & Graphic Novels Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'books-comics'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Comic Type', 'Тип комикс', 'select', true, '["Manga", "American Comics", "European BD", "Graphic Novel", "Webcomic Collection", "Light Novel"]', '["Манга", "Американски комикси", "Европейски BD", "Графична новела", "Уебкомикс колекция", "Лека новела"]', 1),
  ('Genre', 'Жанр', 'select', true, '["Superhero", "Action", "Romance", "Horror", "Fantasy", "Sci-Fi", "Slice of Life", "Comedy", "Drama", "Mystery"]', '["Супергерои", "Екшън", "Романтика", "Хорър", "Фентъзи", "Научна фантастика", "Ежедневие", "Комедия", "Драма", "Мистерия"]', 2),
  ('Age Rating', 'Възрастов рейтинг', 'select', true, '["All Ages", "Teen (13+)", "Older Teen (16+)", "Mature (18+)"]', '["За всички възрасти", "Тийн (13+)", "По-големи тийн (16+)", "За възрастни (18+)"]', 3),
  ('Volume Number', 'Номер на том', 'text', false, '[]', '[]', 4),
  ('Print Quality', 'Качество на печат', 'select', false, '["Standard", "Premium", "Deluxe", "Omnibus", "Box Set"]', '["Стандартно", "Премиум", "Делукс", "Омнибус", "Комплект"]', 5)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;

-- L1: Rare & Antiquarian Attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'books-rare'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Era', 'Ера', 'select', true, '["Pre-1800", "1800-1850", "1850-1900", "1900-1950", "1950-2000", "Modern Rare"]', '["Преди 1800", "1800-1850", "1850-1900", "1900-1950", "1950-2000", "Модерна рядкост"]', 1),
  ('Signed', 'Подписана', 'select', false, '["Author Signed", "Inscribed", "Bookplate", "Not Signed"]', '["Подпис от автор", "С посвещение", "Екслибрис", "Без подпис"]', 2),
  ('Dust Jacket', 'Обложка', 'select', false, '["Present - Excellent", "Present - Good", "Present - Fair", "Missing", "N/A"]', '["Налична - отлична", "Налична - добра", "Налична - задоволителна", "Липсва", "Н/П"]', 3),
  ('Provenance', 'Произход', 'text', false, '[]', '[]', 4),
  ('Authentication', 'Удостоверяване', 'select', false, '["Certified", "Certificate Included", "Self-Authenticated", "Not Authenticated"]', '["Сертифицирана", "Със сертификат", "Самоудостоверена", "Без удостоверяване"]', 5)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;
;
