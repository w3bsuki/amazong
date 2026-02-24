
-- =====================================================
-- 🎬🎵 MOVIES & MUSIC: CATEGORY ATTRIBUTES
-- =====================================================

INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES

-- Media Format & Condition
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Media Format', 'Формат на носителя', 'select', true, true,
 '["Vinyl LP", "Vinyl 7-inch", "Vinyl 10-inch", "CD", "DVD", "Blu-ray", "4K UHD", "Cassette", "VHS", "Laserdisc", "Digital Download", "Box Set"]',
 '["Винил LP", "Винил 7 инча", "Винил 10 инча", "CD", "DVD", "Blu-ray", "4K UHD", "Касета", "VHS", "Лазерен диск", "Дигитален", "Бокс сет"]', 1),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Item Condition', 'Състояние', 'select', true, true,
 '["Mint (M)", "Near Mint (NM)", "Very Good Plus (VG+)", "Very Good (VG)", "Good Plus (G+)", "Good (G)", "Fair (F)", "Poor (P)", "New/Sealed", "Used - Like New", "Used - Good", "Used - Acceptable"]',
 '["Mint (M)", "Near Mint (NM)", "Много добро+ (VG+)", "Много добро (VG)", "Добро+ (G+)", "Добро (G)", "Приемливо (F)", "Лошо (P)", "Ново/Запечатано", "Употребявано - Като ново", "Употребявано - Добро", "Употребявано - Приемливо"]', 2),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Sleeve/Case Condition', 'Състояние на обложката/кутията', 'select', false, true,
 '["Mint (M)", "Near Mint (NM)", "Very Good Plus (VG+)", "Very Good (VG)", "Good (G)", "Fair (F)", "Poor (P)", "Generic", "No Sleeve/Case"]',
 '["Mint (M)", "Near Mint (NM)", "Много добро+ (VG+)", "Много добро (VG)", "Добро (G)", "Приемливо (F)", "Лошо (P)", "Стандартна", "Без обложка/кутия"]', 3),

-- Music Attributes
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Music Genre', 'Музикален жанр', 'multiselect', false, true,
 '["Rock", "Pop", "Hip-Hop/Rap", "Electronic/Dance", "Jazz", "Classical", "Blues", "Country", "Folk", "Metal", "Punk", "R&B/Soul", "Reggae", "World Music", "Soundtrack", "Bulgarian Pop-Folk", "Bulgarian Folk", "Bulgarian Rock", "Bulgarian Hip-Hop", "Chalga", "Other"]',
 '["Рок", "Поп", "Хип-хоп/Рап", "Електронна/Денс", "Джаз", "Класическа", "Блус", "Кънтри", "Фолк", "Метъл", "Пънк", "R&B/Соул", "Реге", "Световна музика", "Саундтрак", "Поп-фолк", "Българска народна", "Български рок", "Български хип-хоп", "Чалга", "Друго"]', 4),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Artist/Band', 'Изпълнител/Група', 'text', false, true, '[]', '[]', 5),
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Album Name', 'Име на албума', 'text', false, false, '[]', '[]', 6),
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Release Year', 'Година на издаване', 'select', false, true,
 '["2024-2025", "2020-2023", "2015-2019", "2010-2014", "2000-2009", "1990-1999", "1980-1989", "1970-1979", "1960-1969", "Pre-1960"]',
 '["2024-2025", "2020-2023", "2015-2019", "2010-2014", "2000-2009", "1990-1999", "1980-1989", "1970-1979", "1960-1969", "Преди 1960"]', 7),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Record Label', 'Звукозаписна компания', 'text', false, true, '[]', '[]', 8),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Vinyl Weight', 'Тегло на винила', 'select', false, true,
 '["Standard (120-140g)", "Heavy (150g)", "Audiophile (180g)", "Super Heavy (200g+)", "Picture Disc"]',
 '["Стандартно (120-140г)", "Тежко (150г)", "Аудиофилско (180г)", "Супер тежко (200г+)", "Пикчър диск"]', 9),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Vinyl Color', 'Цвят на винила', 'select', false, true,
 '["Black", "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "White", "Clear", "Splatter", "Marble", "Picture Disc", "Glow in Dark", "Other"]',
 '["Черен", "Червен", "Син", "Зелен", "Жълт", "Оранжев", "Лилав", "Розов", "Бял", "Прозрачен", "Splatter", "Мрамор", "Пикчър диск", "Свети в тъмно", "Друг"]', 10),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Number of Discs', 'Брой дискове', 'select', false, true,
 '["1", "2", "3", "4", "5+", "Box Set"]',
 '["1", "2", "3", "4", "5+", "Бокс сет"]', 11),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Limited Edition', 'Лимитирано издание', 'boolean', false, true, '[]', '[]', 12),
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'First Pressing', 'Първо издание', 'boolean', false, true, '[]', '[]', 13),
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Signed', 'Подписан', 'boolean', false, true, '[]', '[]', 14),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Audio Quality', 'Качество на звука', 'select', false, true,
 '["Standard", "Remastered", "HD Audio", "Hi-Res Audio", "Dolby Atmos", "DTS-HD", "Original Master"]',
 '["Стандартно", "Ремастерирано", "HD аудио", "Hi-Res аудио", "Dolby Atmos", "DTS-HD", "Оригинален мастър"]', 15),

-- Movie/Film Attributes
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Movie Genre', 'Филмов жанр', 'multiselect', false, true,
 '["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Horror", "Musical", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western", "Bollywood", "Bulgarian Cinema", "European Art", "Other"]',
 '["Екшън", "Приключенски", "Анимация", "Комедия", "Криминален", "Документален", "Драма", "Семеен", "Фентъзи", "Ужаси", "Мюзикъл", "Мистерия", "Романтичен", "Научна фантастика", "Трилър", "Военен", "Уестърн", "Боливуд", "Българско кино", "Европейско арт кино", "Друго"]', 16),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Director', 'Режисьор', 'text', false, true, '[]', '[]', 17),
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Lead Actors', 'Главни актьори', 'text', false, false, '[]', '[]', 18),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Region Code', 'Регионален код', 'select', false, true,
 '["Region Free", "Region 0", "Region 1 (USA/Canada)", "Region 2 (Europe/Japan)", "Region 3 (Asia)", "Region 4 (Australia)", "Region 5 (Africa/Russia)", "Region 6 (China)", "Region A (Americas)", "Region B (Europe)", "Region C (Asia)"]',
 '["Без регион", "Регион 0", "Регион 1 (САЩ/Канада)", "Регион 2 (Европа/Япония)", "Регион 3 (Азия)", "Регион 4 (Австралия)", "Регион 5 (Африка/Русия)", "Регион 6 (Китай)", "Регион A (Америка)", "Регион B (Европа)", "Регион C (Азия)"]', 19),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Subtitles', 'Субтитри', 'multiselect', false, true,
 '["Bulgarian", "English", "German", "French", "Spanish", "Russian", "Turkish", "Greek", "Serbian", "Romanian", "None"]',
 '["Български", "Английски", "Немски", "Френски", "Испански", "Руски", "Турски", "Гръцки", "Сръбски", "Румънски", "Без субтитри"]', 20),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Audio Languages', 'Аудио езици', 'multiselect', false, true,
 '["Bulgarian", "English", "German", "French", "Spanish", "Russian", "Original Language"]',
 '["Български", "Английски", "Немски", "Френски", "Испански", "Руски", "Оригинален език"]', 21),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Video Quality', 'Качество на видеото', 'select', false, true,
 '["4K Ultra HD", "1080p Full HD", "720p HD", "DVD Quality", "Standard Definition", "VHS Quality"]',
 '["4K Ultra HD", "1080p Full HD", "720p HD", "DVD качество", "Стандартна разделителна способност", "VHS качество"]', 22),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Movie Rating', 'Възрастова оценка', 'select', false, true,
 '["G (General)", "PG", "PG-13", "R (Restricted)", "NC-17", "Unrated", "All Ages"]',
 '["G (За всички)", "PG", "PG-13", "R (Ограничен)", "NC-17", "Без рейтинг", "За всички възрасти"]', 23),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Edition Type', 'Тип издание', 'select', false, true,
 '["Standard", "Special Edition", "Director Cut", "Extended Edition", "Collector Edition", "Criterion", "Steelbook", "Anniversary Edition", "Ultimate Edition"]',
 '["Стандартно", "Специално издание", "Режисьорска версия", "Разширено издание", "Колекционерско", "Criterion", "Steelbook", "Юбилейно издание", "Ultimate издание"]', 24),

-- Instruments & Equipment
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Instrument Type', 'Тип инструмент', 'select', false, true,
 '["Guitar - Acoustic", "Guitar - Electric", "Guitar - Bass", "Piano/Keyboard", "Drums", "Violin", "Cello", "Saxophone", "Trumpet", "Flute", "Clarinet", "Accordion", "Kaval", "Gadulka", "Tambura", "Gaida", "Other"]',
 '["Китара - Акустична", "Китара - Електрическа", "Китара - Бас", "Пиано/Клавир", "Барабани", "Цигулка", "Чело", "Саксофон", "Тромпет", "Флейта", "Кларинет", "Акордеон", "Кавал", "Гъдулка", "Тамбура", "Гайда", "Друго"]', 25),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Instrument Brand', 'Марка на инструмента', 'text', false, true, '[]', '[]', 26),
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Instrument Condition', 'Състояние на инструмента', 'select', false, true,
 '["New", "Like New", "Excellent", "Good", "Fair", "For Parts/Repair", "Vintage"]',
 '["Ново", "Като ново", "Отлично", "Добро", "Приемливо", "За части/ремонт", "Ретро"]', 27),

-- Memorabilia
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Memorabilia Type', 'Тип меморабилия', 'select', false, true,
 '["Concert Poster", "Tour T-Shirt", "Autographed Item", "Tour Program", "Backstage Pass", "Ticket Stub", "Press Photo", "Promotional Item", "Award Replica", "Fan Merchandise", "Movie Props Replica"]',
 '["Плакат от концерт", "Тениска от турне", "Автографиран артикул", "Програма от турне", "Бекстейдж пас", "Билет", "Прес снимка", "Промоционален артикул", "Копие на награда", "Фен продукт", "Реплика на филмов реквизит"]', 28),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Authenticity', 'Автентичност', 'select', false, true,
 '["Certified Authentic", "With COA", "Unverified", "Official Merchandise", "Licensed Reproduction"]',
 '["Сертифицирано автентично", "С CoA", "Непроверено", "Официален мърчандайз", "Лицензирано копие"]', 29),

-- Bulgarian Music Specific
('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Bulgarian Music Era', 'Епоха на българската музика', 'select', false, true,
 '["Pre-1944 (Kingdom)", "1944-1989 (Socialist)", "1990s Transition", "2000s", "Modern (2010+)", "Timeless Folk"]',
 '["До 1944 (Царство)", "1944-1989 (Социализъм)", "90-те преход", "2000-те", "Модерна (2010+)", "Вечна народна"]', 30),

('07e94dbe-f6de-4231-bdde-77a13aa0babc', 'Balkanton Original', 'Оригинал от Балкантон', 'boolean', false, true, '[]', '[]', 31);
;
