-- Restore category_attributes for Kids & Toys, Collectibles

-- Baby Gear attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('baby-gear', 'Type', 'Тип', 'select', true, true, '["Stroller", "Car Seat", "High Chair", "Crib", "Playpen", "Baby Carrier", "Bassinet", "Bouncer", "Walker", "Monitor"]', '["Количка", "Столче за кола", "Столче за хранене", "Кошара", "Кошара за игра", "Кенгуру", "Мойсеева кошница", "Шезлонг", "Проходилка", "Монитор"]', 1),
  ('baby-gear', 'Age Range', 'Възраст', 'select', false, true, '["0-6 months", "6-12 months", "1-2 years", "2-3 years", "3+ years"]', '["0-6 месеца", "6-12 месеца", "1-2 години", "2-3 години", "3+ години"]', 2),
  ('baby-gear', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 3),
  ('baby-gear', 'Color', 'Цвят', 'text', false, true, '[]', '[]', 4),
  ('baby-gear', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair"]', '["Ново", "Като ново", "Добро", "Задоволително"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Toys attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('toys', 'Type', 'Тип', 'select', true, true, '["Action Figures", "Dolls", "Building Blocks", "Puzzles", "Board Games", "Outdoor Toys", "RC Toys", "Educational", "Plush Toys", "Play Sets"]', '["Екшън фигури", "Кукли", "Конструктори", "Пъзели", "Настолни игри", "Играчки за навън", "Радиоуправляеми", "Образователни", "Плюшени", "Комплекти за игра"]', 1),
  ('toys', 'Age Range', 'Възраст', 'select', true, true, '["0-2 years", "3-5 years", "6-8 years", "9-12 years", "12+ years", "All Ages"]', '["0-2 години", "3-5 години", "6-8 години", "9-12 години", "12+ години", "Всички възрасти"]', 2),
  ('toys', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 3),
  ('toys', 'Condition', 'Състояние', 'select', true, true, '["New", "Like New", "Good", "Fair", "For Parts"]', '["Ново", "Като ново", "Добро", "Задоволително", "За части"]', 4)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Kids Clothing attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('kids-clothing', 'Type', 'Тип', 'select', true, true, '["T-Shirts", "Pants", "Dresses", "Jackets", "Shoes", "Pajamas", "Underwear", "Accessories", "Sportswear", "School Uniform"]', '["Тениски", "Панталони", "Рокли", "Якета", "Обувки", "Пижами", "Бельо", "Аксесоари", "Спортни дрехи", "Училищна форма"]', 1),
  ('kids-clothing', 'Size', 'Размер', 'select', true, true, '["0-3M", "3-6M", "6-12M", "12-18M", "18-24M", "2T", "3T", "4T", "5", "6", "7", "8", "10", "12", "14", "16"]', '["0-3М", "3-6М", "6-12М", "12-18М", "18-24М", "2T", "3T", "4T", "5", "6", "7", "8", "10", "12", "14", "16"]', 2),
  ('kids-clothing', 'Gender', 'Пол', 'select', true, true, '["Boys", "Girls", "Unisex"]', '["Момчета", "Момичета", "Унисекс"]', 3),
  ('kids-clothing', 'Brand', 'Марка', 'text', false, true, '[]', '[]', 4),
  ('kids-clothing', 'Condition', 'Състояние', 'select', true, true, '["New with Tags", "New without Tags", "Like New", "Good", "Fair"]', '["Ново с етикет", "Ново без етикет", "Като ново", "Добро", "Задоволително"]', 5)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Trading Cards attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('trading-cards', 'Category', 'Категория', 'select', true, true, '["Pokemon", "Yu-Gi-Oh", "Magic: The Gathering", "Sports Cards", "One Piece", "Dragon Ball", "Other TCG"]', '["Pokemon", "Yu-Gi-Oh", "Magic: The Gathering", "Спортни карти", "One Piece", "Dragon Ball", "Други ККИ"]', 1),
  ('trading-cards', 'Type', 'Тип', 'select', true, true, '["Single Card", "Booster Pack", "Booster Box", "Starter Deck", "Complete Set", "Lot"]', '["Единична карта", "Бустер пакет", "Бустер кутия", "Стартов тесте", "Пълен сет", "Лот"]', 2),
  ('trading-cards', 'Rarity', 'Рядкост', 'select', false, true, '["Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare", "Promo"]', '["Обикновена", "Необикновена", "Рядка", "Ултра рядка", "Секретна рядка", "Промо"]', 3),
  ('trading-cards', 'Grading', 'Грейдинг', 'select', false, true, '["Ungraded", "PSA 10", "PSA 9", "PSA 8", "PSA 7", "BGS 10", "BGS 9.5", "CGC"]', '["Без грейд", "PSA 10", "PSA 9", "PSA 8", "PSA 7", "BGS 10", "BGS 9.5", "CGC"]', 4),
  ('trading-cards', 'Language', 'Език', 'select', false, true, '["English", "Japanese", "Korean", "Chinese", "German", "French", "Italian", "Spanish"]', '["Английски", "Японски", "Корейски", "Китайски", "Немски", "Френски", "Италиански", "Испански"]', 5),
  ('trading-cards', 'Condition', 'Състояние', 'select', true, true, '["Mint", "Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged"]', '["Mint", "Near Mint", "Леко използвана", "Умерено използвана", "Силно използвана", "Повредена"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Coins & Currency attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('coins', 'Type', 'Тип', 'select', true, true, '["Coin", "Banknote", "Token", "Medal", "Set", "Collection"]', '["Монета", "Банкнота", "Жетон", "Медал", "Сет", "Колекция"]', 1),
  ('coins', 'Country/Region', 'Страна/Регион', 'text', true, true, '[]', '[]', 2),
  ('coins', 'Year', 'Година', 'number', false, true, '[]', '[]', 3),
  ('coins', 'Material', 'Материал', 'select', false, true, '["Gold", "Silver", "Copper", "Bronze", "Nickel", "Paper", "Polymer"]', '["Злато", "Сребро", "Мед", "Бронз", "Никел", "Хартия", "Полимер"]', 4),
  ('coins', 'Certification', 'Сертификация', 'select', false, true, '["None", "NGC", "PCGS", "PMG", "ICG"]', '["Без", "NGC", "PCGS", "PMG", "ICG"]', 5),
  ('coins', 'Condition', 'Състояние', 'select', true, true, '["Uncirculated", "About Uncirculated", "Extremely Fine", "Very Fine", "Fine", "Very Good", "Good", "Fair", "Poor"]', '["Нециркулирала", "Почти нециркулирала", "Отлична", "Много добра", "Добра", "Задоволителна", "Приемлива", "Лоша", "Много лоша"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Art & Antiques attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('antiques', 'Type', 'Тип', 'select', true, true, '["Painting", "Sculpture", "Furniture", "Ceramics", "Glassware", "Jewelry", "Textiles", "Books", "Clocks", "Silverware"]', '["Картина", "Скулптура", "Мебел", "Керамика", "Стъкло", "Бижута", "Текстил", "Книги", "Часовници", "Сребро"]', 1),
  ('antiques', 'Era/Period', 'Епоха/Период', 'select', false, true, '["Pre-1800", "19th Century", "Art Nouveau", "Art Deco", "Mid-Century Modern", "Victorian", "Edwardian", "Unknown"]', '["Преди 1800", "19 век", "Ар Нуво", "Ар Деко", "Средата на века", "Викториански", "Едуардиански", "Неизвестен"]', 2),
  ('antiques', 'Origin', 'Произход', 'text', false, true, '[]', '[]', 3),
  ('antiques', 'Artist/Maker', 'Автор/Производител', 'text', false, false, '[]', '[]', 4),
  ('antiques', 'Dimensions', 'Размери', 'text', false, false, '[]', '[]', 5),
  ('antiques', 'Provenance', 'Произход', 'text', false, false, '[]', '[]', 6),
  ('antiques', 'Condition', 'Състояние', 'select', true, true, '["Excellent", "Good", "Fair", "For Restoration", "As Is"]', '["Отлично", "Добро", "Задоволително", "За реставрация", "Както е"]', 7)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

-- Comics & Memorabilia attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT c.id, v.name, v.name_bg, v.attr_type, v.is_req, v.is_filter, v.options::jsonb, v.options_bg::jsonb, v.sort_order
FROM (VALUES
  ('comics', 'Type', 'Тип', 'select', true, true, '["Single Issue", "Trade Paperback", "Hardcover", "Graphic Novel", "Manga", "Magazine"]', '["Единичен брой", "Сборник", "Твърди корици", "Графичен роман", "Манга", "Списание"]', 1),
  ('comics', 'Publisher', 'Издател', 'select', false, true, '["Marvel", "DC Comics", "Image", "Dark Horse", "IDW", "Viz Media", "Kodansha", "Other"]', '["Marvel", "DC Comics", "Image", "Dark Horse", "IDW", "Viz Media", "Kodansha", "Друго"]', 2),
  ('comics', 'Genre', 'Жанр', 'select', false, true, '["Superhero", "Horror", "Sci-Fi", "Fantasy", "Crime", "Slice of Life", "Action", "Romance"]', '["Супергерои", "Хорър", "Sci-Fi", "Фентъзи", "Криминален", "Slice of Life", "Екшън", "Романс"]', 3),
  ('comics', 'Grading', 'Грейдинг', 'select', false, true, '["Ungraded", "CGC", "CBCS", "PGX"]', '["Без грейд", "CGC", "CBCS", "PGX"]', 4),
  ('comics', 'Year', 'Година', 'number', false, true, '[]', '[]', 5),
  ('comics', 'Condition', 'Състояние', 'select', true, true, '["Mint", "Near Mint", "Very Fine", "Fine", "Very Good", "Good", "Fair", "Poor"]', '["Mint", "Near Mint", "Very Fine", "Fine", "Very Good", "Good", "Fair", "Poor"]', 6)
) AS v(cat_slug, name, name_bg, attr_type, is_req, is_filter, options, options_bg, sort_order)
CROSS JOIN categories c WHERE c.slug = v.cat_slug
ON CONFLICT DO NOTHING;;
