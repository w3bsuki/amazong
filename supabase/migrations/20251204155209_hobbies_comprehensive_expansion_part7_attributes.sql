
-- =====================================================
-- HOBBIES PART 7: Comprehensive Attributes
-- =====================================================

-- ========== HANDMADE & CRAFTS ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Material', 'Материал', 'multiselect',
  '["Sterling Silver", "Gold Plated", "Stainless Steel", "Brass", "Copper", "Leather", "Wood", "Glass", "Ceramic", "Polymer Clay", "Natural Stones", "Resin", "Fabric", "Paper", "Wax"]',
  '["Сребро 925", "Позлатено", "Неръждаема стомана", "Месинг", "Мед", "Кожа", "Дърво", "Стъкло", "Керамика", "Полимерна глина", "Естествени камъни", "Смола", "Плат", "Хартия", "Восък"]',
  true, false
FROM categories c WHERE c.slug = 'handmade'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Technique', 'Техника', 'multiselect',
  '["Hand Sewn", "Hand Knit", "Crocheted", "Hand Painted", "Hand Embroidered", "Hand Carved", "Hand Molded", "Hand Woven", "Hand Stamped", "Wire Wrapped", "Macramé", "Decoupage", "Pyrography"]',
  '["Ръчно ушито", "Ръчно плетено", "Плетено на една кука", "Ръчно рисувано", "Ръчно бродирано", "Ръчно издялано", "Ръчно моделирано", "Ръчно тъкано", "Щамповано", "Телено оплитане", "Макраме", "Декупаж", "Пирография"]',
  true, false
FROM categories c WHERE c.slug = 'handmade'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Made to Order', 'По поръчка', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'handmade'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Customizable', 'Персонализируемо', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'handmade'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Gift Packaging', 'Подаръчна опаковка', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'handmade'
ON CONFLICT DO NOTHING;

-- ========== TCG ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Card Game', 'Карта игра', 'select',
  '["Pokémon TCG", "Magic: The Gathering", "Yu-Gi-Oh!", "One Piece TCG", "Lorcana", "Sports Cards", "Other TCG"]',
  '["Pokémon TCG", "Magic: The Gathering", "Yu-Gi-Oh!", "One Piece TCG", "Lorcana", "Спортни карти", "Други TCG"]',
  true, true
FROM categories c WHERE c.slug = 'hobby-tcg'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Product Type', 'Тип продукт', 'select',
  '["Booster Pack", "Booster Box", "Elite Trainer Box", "Theme Deck", "Structure Deck", "Bundle", "Collection Box", "Starter Deck", "Accessories"]',
  '["Бустер пакет", "Бустер кутия", "Elite Trainer Box", "Тематично тесте", "Структурно тесте", "Комплект", "Колекционерска кутия", "Стартово тесте", "Аксесоари"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-tcg'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Language', 'Език', 'select',
  '["English", "Japanese", "Korean", "Chinese", "German", "French", "Spanish", "Italian", "Bulgarian"]',
  '["Английски", "Японски", "Корейски", "Китайски", "Немски", "Френски", "Испански", "Италиански", "Български"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-tcg'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Sealed', 'Запечатано', 'boolean', NULL, NULL, true, false
FROM categories c WHERE c.slug = 'hobby-tcg'
ON CONFLICT DO NOTHING;

-- ========== BOARD GAMES ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Player Count', 'Брой играчи', 'select',
  '["1 Player", "2 Players", "2-4 Players", "3-5 Players", "4-6 Players", "6+ Players", "Party (8+)"]',
  '["1 играч", "2 играчи", "2-4 играчи", "3-5 играчи", "4-6 играчи", "6+ играчи", "Парти (8+)"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-tabletop'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Age Range', 'Възрастова група', 'select',
  '["3+", "6+", "8+", "10+", "12+", "14+", "18+"]',
  '["3+", "6+", "8+", "10+", "12+", "14+", "18+"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-tabletop'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Play Time', 'Време за игра', 'select',
  '["Under 30 min", "30-60 min", "1-2 hours", "2-4 hours", "4+ hours"]',
  '["Под 30 мин", "30-60 мин", "1-2 часа", "2-4 часа", "4+ часа"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-tabletop'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Complexity', 'Сложност', 'select',
  '["Light", "Light-Medium", "Medium", "Medium-Heavy", "Heavy"]',
  '["Лека", "Лека-Средна", "Средна", "Средна-Тежка", "Тежка"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-tabletop'
ON CONFLICT DO NOTHING;

-- ========== MODEL BUILDING ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Scale', 'Мащаб', 'select',
  '["1:12", "1:18", "1:24", "1:32", "1:35", "1:43", "1:48", "1:64", "1:72", "1:87 (HO)", "1:144", "1:160 (N)", "1:200", "1:350", "1:700"]',
  '["1:12", "1:18", "1:24", "1:32", "1:35", "1:43", "1:48", "1:64", "1:72", "1:87 (HO)", "1:144", "1:160 (N)", "1:200", "1:350", "1:700"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-model-building'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Skill Level', 'Ниво на умение', 'select',
  '["Beginner", "Intermediate", "Advanced", "Expert"]',
  '["Начинаещ", "Среден", "Напреднал", "Експерт"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-model-building'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Assembly', 'Сглобяване', 'select',
  '["Snap-Fit (No Glue)", "Glue Required", "Pre-Built/Diecast", "Partial Assembly"]',
  '["Snap-Fit (Без лепило)", "Изисква лепило", "Готов/Diecast", "Частично сглобяване"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-model-building'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Brand', 'Марка', 'select',
  '["Tamiya", "Revell", "Airfix", "Italeri", "Academy", "Hasegawa", "Trumpeter", "Dragon", "Eduard", "ICM", "MiniArt", "Other"]',
  '["Tamiya", "Revell", "Airfix", "Italeri", "Academy", "Hasegawa", "Trumpeter", "Dragon", "Eduard", "ICM", "MiniArt", "Друга"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-model-building'
ON CONFLICT DO NOTHING;

-- ========== RC VEHICLES ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'RC Type', 'Тип RC', 'select',
  '["On-Road Car", "Off-Road Buggy", "Monster Truck", "Crawler", "Drift Car", "Racing Drone", "Helicopter", "Airplane", "Boat", "FPV Racing"]',
  '["Шосейна кола", "Офроуд бъги", "Монстър трък", "Краулер", "Дрифт кола", "Състезателен дрон", "Хеликоптер", "Самолет", "Лодка", "FPV състезания"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-rc-drones'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Scale', 'Мащаб', 'select',
  '["1:5", "1:8", "1:10", "1:12", "1:14", "1:16", "1:18", "1:24", "1:28", "Mini/Micro"]',
  '["1:5", "1:8", "1:10", "1:12", "1:14", "1:16", "1:18", "1:24", "1:28", "Мини/Микро"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-rc-drones'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Power Source', 'Захранване', 'select',
  '["Electric Brushless", "Electric Brushed", "Nitro/Gas", "LiPo Battery", "NiMH Battery"]',
  '["Електрически безчетков", "Електрически четков", "Нитро/Бензин", "LiPo батерия", "NiMH батерия"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-rc-drones'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Ready-to-Run', 'Готов за употреба', 'select',
  '["RTR (Ready to Run)", "ARR (Almost Ready)", "Kit (Build Required)", "BNF (Bind-N-Fly)", "PNP (Plug-N-Play)"]',
  '["RTR (Готов)", "ARR (Почти готов)", "Кит (за сглобяване)", "BNF (Bind-N-Fly)", "PNP (Plug-N-Play)"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-rc-drones'
ON CONFLICT DO NOTHING;

-- ========== MUSIC & VINYL ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Format', 'Формат', 'select',
  '["Vinyl LP", "Vinyl Single 7\"", "Vinyl 10\"", "CD", "Cassette", "Box Set", "Picture Disc", "Colored Vinyl"]',
  '["Винил LP", "Винил сингъл 7\"", "Винил 10\"", "CD", "Касета", "Бокс сет", "Picture Disc", "Цветен винил"]',
  true, false
FROM categories c WHERE c.slug = 'movies-music'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Genre', 'Жанр', 'multiselect',
  '["Rock", "Pop", "Jazz", "Classical", "Electronic", "Hip-Hop", "Metal", "Folk", "Bulgarian", "Soundtracks", "Blues", "Reggae", "World Music"]',
  '["Рок", "Поп", "Джаз", "Класика", "Електронна", "Хип-хоп", "Метъл", "Фолк", "Българска", "Саундтраци", "Блус", "Реге", "Световна музика"]',
  true, false
FROM categories c WHERE c.slug = 'movies-music'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Decade', 'Десетилетие', 'select',
  '["1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"]',
  '["1950-те", "1960-те", "1970-те", "1980-те", "1990-те", "2000-те", "2010-те", "2020-те"]',
  true, false
FROM categories c WHERE c.slug = 'movies-music'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Pressing', 'Пресоване', 'select',
  '["Original Pressing", "Reissue", "Remaster", "Limited Edition", "Promotional"]',
  '["Оригинал", "Преиздаване", "Ремастър", "Лимитирано", "Промоционално"]',
  true, false
FROM categories c WHERE c.slug = 'movies-music'
ON CONFLICT DO NOTHING;

-- ========== OUTDOOR HOBBIES ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Activity Type', 'Тип дейност', 'select',
  '["Fishing", "Hunting", "Birdwatching", "Camping", "Hiking", "Gardening", "Stargazing", "Metal Detecting", "Rock Collecting", "Geocaching"]',
  '["Риболов", "Лов", "Наблюдение на птици", "Къмпинг", "Туризъм", "Градинарство", "Астрономия", "Металотърсене", "Събиране на скали", "Геокешинг"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-outdoor'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Season', 'Сезон', 'multiselect',
  '["Spring", "Summer", "Fall", "Winter", "Year-Round"]',
  '["Пролет", "Лято", "Есен", "Зима", "Целогодишно"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-outdoor'
ON CONFLICT DO NOTHING;

-- ========== BOOKS ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Format', 'Формат', 'select',
  '["Hardcover", "Paperback", "Leather Bound", "Signed Copy", "First Edition", "Limited Edition", "Slipcase"]',
  '["Твърди корици", "Меки корици", "Кожена подвързия", "Подписано", "Първо издание", "Лимитирано", "Кутия"]',
  true, false
FROM categories c WHERE c.slug = 'books'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Language', 'Език', 'select',
  '["Bulgarian", "English", "German", "French", "Russian", "Other"]',
  '["Български", "Английски", "Немски", "Френски", "Руски", "Друг"]',
  true, false
FROM categories c WHERE c.slug = 'books'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Era', 'Ера', 'select',
  '["Antiquarian (pre-1900)", "Vintage (1900-1970)", "Modern First (1970-2000)", "Contemporary (2000+)"]',
  '["Антикварна (преди 1900)", "Винтидж (1900-1970)", "Модерна първа (1970-2000)", "Съвременна (2000+)"]',
  true, false
FROM categories c WHERE c.slug = 'books'
ON CONFLICT DO NOTHING;

-- ========== CREATIVE ARTS ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Medium', 'Техника', 'multiselect',
  '["Oil Paint", "Acrylic", "Watercolor", "Gouache", "Pencil", "Charcoal", "Pastel", "Ink", "Digital", "Mixed Media"]',
  '["Маслени бои", "Акрил", "Акварел", "Гваш", "Молив", "Въглен", "Пастел", "Мастило", "Дигитална", "Смесена техника"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-creative-arts'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Skill Level', 'Ниво', 'select',
  '["Beginner", "Intermediate", "Advanced", "Professional"]',
  '["Начинаещ", "Среден", "Напреднал", "Професионалист"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-creative-arts'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Brand', 'Марка', 'select',
  '["Winsor & Newton", "Faber-Castell", "Prismacolor", "Copic", "Wacom", "Strathmore", "Canson", "Golden", "Liquitex", "Other"]',
  '["Winsor & Newton", "Faber-Castell", "Prismacolor", "Copic", "Wacom", "Strathmore", "Canson", "Golden", "Liquitex", "Друга"]',
  true, false
FROM categories c WHERE c.slug = 'hobby-creative-arts'
ON CONFLICT DO NOTHING;

-- ========== MUSICAL INSTRUMENTS ATTRIBUTES ==========
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Instrument Type', 'Тип инструмент', 'select',
  '["Guitar", "Bass", "Drums", "Keyboard/Piano", "Violin", "Wind", "Brass", "Folk/Traditional", "Electronic", "Accessories"]',
  '["Китара", "Бас", "Барабани", "Клавишни/Пиано", "Цигулка", "Духови", "Духови месингови", "Фолклорни", "Електронни", "Аксесоари"]',
  true, false
FROM categories c WHERE c.slug = 'musical-instruments'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Condition', 'Състояние', 'select',
  '["New", "Like New", "Excellent", "Good", "Fair", "For Parts/Repair"]',
  '["Ново", "Като ново", "Отлично", "Добро", "Задоволително", "За части/ремонт"]',
  true, false
FROM categories c WHERE c.slug = 'musical-instruments'
ON CONFLICT DO NOTHING;

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, options, options_bg, is_filterable, is_required)
SELECT c.id, 'Skill Level', 'Ниво', 'select',
  '["Beginner/Student", "Intermediate", "Professional", "Vintage/Collector"]',
  '["Начинаещ/Ученик", "Среден", "Професионален", "Винтидж/Колекционерски"]',
  true, false
FROM categories c WHERE c.slug = 'musical-instruments'
ON CONFLICT DO NOTHING;
;
