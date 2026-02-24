
-- =====================================================
-- 📚 BOOKS: CATEGORY ATTRIBUTES (Using UPSERT)
-- =====================================================

-- Delete existing and re-add
DELETE FROM category_attributes WHERE category_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';

-- Insert fresh attributes
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order) VALUES
-- Format & Condition
('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Book Format', 'Формат на книгата', 'select', false, true, 
 '["Hardcover", "Paperback", "Mass Market Paperback", "Leather Bound", "Spiral Bound", "Board Book", "Pocket Size", "Large Print", "Box Set"]',
 '["Твърда корица", "Мека корица", "Джобен формат", "Кожена подвързия", "Спирална подвързия", "Картонена книжка", "Джобен формат", "Голям шрифт", "Бокс сет"]', 1),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Book Condition', 'Състояние', 'select', true, true,
 '["New", "Like New", "Very Good", "Good", "Acceptable", "Poor", "For Collectors"]',
 '["Ново", "Като ново", "Много добро", "Добро", "Приемливо", "Лошо", "За колекционери"]', 2),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Language', 'Език', 'select', true, true,
 '["Bulgarian", "English", "German", "French", "Russian", "Spanish", "Italian", "Other"]',
 '["Български", "Английски", "Немски", "Френски", "Руски", "Испански", "Италиански", "Друг"]', 3),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Publication Year', 'Година на издаване', 'select', false, true,
 '["2024-2025", "2020-2023", "2015-2019", "2010-2014", "2000-2009", "1990-1999", "1980-1989", "1970-1979", "1960-1969", "Pre-1960"]',
 '["2024-2025", "2020-2023", "2015-2019", "2010-2014", "2000-2009", "1990-1999", "1980-1989", "1970-1979", "1960-1969", "Преди 1960"]', 4),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Publisher', 'Издателство', 'text', false, true, '[]', '[]', 5),
('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Author', 'Автор', 'text', false, true, '[]', '[]', 6),
('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'ISBN', 'ISBN', 'text', false, false, '[]', '[]', 7),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Edition', 'Издание', 'select', false, true,
 '["First Edition", "Second Edition", "Third Edition", "Revised Edition", "Limited Edition", "Collector Edition", "Anniversary Edition", "Special Edition", "Reprint"]',
 '["Първо издание", "Второ издание", "Трето издание", "Преработено издание", "Лимитирано издание", "Колекционерско издание", "Юбилейно издание", "Специално издание", "Препечатка"]', 8),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Page Count', 'Брой страници', 'select', false, true,
 '["Under 100", "100-200", "200-300", "300-400", "400-500", "500-700", "700-1000", "Over 1000"]',
 '["Под 100", "100-200", "200-300", "300-400", "400-500", "500-700", "700-1000", "Над 1000"]', 9),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Signed Copy', 'Подписан екземпляр', 'boolean', false, true, '[]', '[]', 10),
('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'First Edition', 'Първо издание', 'boolean', false, true, '[]', '[]', 11),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Dust Jacket', 'Обложка', 'select', false, true,
 '["Yes - Like New", "Yes - Good", "Yes - Fair", "Yes - Poor", "No Dust Jacket", "Not Applicable"]',
 '["Да - Като нова", "Да - Добра", "Да - Приемлива", "Да - Лоша", "Без обложка", "Неприложимо"]', 12),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Illustrations', 'Илюстрации', 'select', false, true,
 '["No Illustrations", "Black & White", "Color", "Photos", "Maps", "Mixed"]',
 '["Без илюстрации", "Черно-бели", "Цветни", "Снимки", "Карти", "Смесени"]', 13),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Target Age', 'Целева възраст', 'select', false, true,
 '["All Ages", "0-2 Years", "3-5 Years", "6-8 Years", "9-12 Years", "Teen (13-17)", "Adult (18+)"]',
 '["Всички възрасти", "0-2 години", "3-5 години", "6-8 години", "9-12 години", "Тийнейджър (13-17)", "Възрастни (18+)"]', 14),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Fiction Genre', 'Жанр художествена литература', 'multiselect', false, true,
 '["Literary Fiction", "Mystery", "Thriller", "Science Fiction", "Fantasy", "Romance", "Horror", "Historical Fiction", "Adventure", "Crime", "Humor"]',
 '["Съвременна проза", "Криминален", "Трилър", "Научна фантастика", "Фентъзи", "Романтика", "Ужаси", "Исторически роман", "Приключенски", "Криминален", "Хумор"]', 15),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Non-Fiction Category', 'Категория нехудожествена', 'multiselect', false, true,
 '["Biography", "Self-Help", "Business", "History", "Science", "Philosophy", "Psychology", "Politics", "Travel", "True Crime", "Health", "Cooking", "Art", "Religion", "Sports"]',
 '["Биография", "Личностно развитие", "Бизнес", "История", "Наука", "Философия", "Психология", "Политика", "Пътешествия", "Реални престъпления", "Здраве", "Готварство", "Изкуство", "Религия", "Спорт"]', 16),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Awards', 'Награди', 'multiselect', false, true,
 '["Pulitzer Prize", "Nobel Prize", "Booker Prize", "National Book Award", "Hugo Award", "Nebula Award", "Edgar Award", "Best Seller", "Other Award"]',
 '["Пулицър", "Нобелова награда", "Букър", "Национална книжна награда", "Хюго", "Небюла", "Едгар", "Бестселър", "Друга награда"]', 17),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Academic Subject', 'Учебен предмет', 'select', false, true,
 '["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "Literature", "Foreign Language", "Computer Science", "Economics", "Law", "Medicine", "Engineering", "Art", "Music", "Physical Education", "Other"]',
 '["Математика", "Физика", "Химия", "Биология", "История", "География", "Литература", "Чужд език", "Информатика", "Икономика", "Право", "Медицина", "Инженерство", "Изкуство", "Музика", "Физическо възпитание", "Друго"]', 18),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Grade Level', 'Клас/Ниво', 'select', false, true,
 '["Pre-School", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "University", "Professional"]',
 '["Предучилищно", "1 клас", "2 клас", "3 клас", "4 клас", "5 клас", "6 клас", "7 клас", "8 клас", "9 клас", "10 клас", "11 клас", "12 клас", "Университет", "Професионално"]', 19),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Series Name', 'Име на поредицата', 'text', false, true, '[]', '[]', 20),
('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Volume Number', 'Том номер', 'text', false, false, '[]', '[]', 21),

('e4ef706b-e8a0-499e-a1de-da52dec2ceac', 'Bulgarian Publisher', 'Българско издателство', 'select', false, true,
 '["Ciela", "Bard", "Enthusiast", "Soft Press", "Kragozor", "Colibri", "Hermes", "Iztok-Zapad", "Prosveta", "Anubis", "Egmont", "Millenium", "Pergament", "Other"]',
 '["Сиела", "Бард", "Ентусиаст", "Софт Прес", "Кръгозор", "Колибри", "Хермес", "Изток-Запад", "Просвета", "Анубис", "Егмонт", "Миленум", "Пергамент", "Друго"]', 22);
;
