
-- L3 for Fiction Books
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Romance', 'Романтика', 'fiction-romance', id, 1 FROM categories WHERE slug = 'fiction'
UNION ALL
SELECT 'Thriller & Mystery', 'Трилъри и мистерия', 'fiction-thriller', id, 2 FROM categories WHERE slug = 'fiction'
UNION ALL
SELECT 'Science Fiction', 'Научна фантастика', 'fiction-scifi', id, 3 FROM categories WHERE slug = 'fiction'
UNION ALL
SELECT 'Fantasy', 'Фентъзи', 'fiction-fantasy', id, 4 FROM categories WHERE slug = 'fiction'
UNION ALL
SELECT 'Horror', 'Хорър', 'fiction-horror', id, 5 FROM categories WHERE slug = 'fiction'
UNION ALL
SELECT 'Literary Fiction', 'Художествена литература', 'fiction-literary', id, 6 FROM categories WHERE slug = 'fiction';

-- L3 for Non-Fiction Books
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Biography', 'Биографии', 'nonfic-biography', id, 1 FROM categories WHERE slug = 'non-fiction'
UNION ALL
SELECT 'Self-Help', 'Самопомощ', 'nonfic-selfhelp', id, 2 FROM categories WHERE slug = 'non-fiction'
UNION ALL
SELECT 'Business', 'Бизнес', 'nonfic-business', id, 3 FROM categories WHERE slug = 'non-fiction'
UNION ALL
SELECT 'History', 'История', 'nonfic-history', id, 4 FROM categories WHERE slug = 'non-fiction'
UNION ALL
SELECT 'Science', 'Наука', 'nonfic-science', id, 5 FROM categories WHERE slug = 'non-fiction'
UNION ALL
SELECT 'Cookbooks', 'Готварски книги', 'nonfic-cookbooks', id, 6 FROM categories WHERE slug = 'non-fiction';

-- L3 for Vinyl Records (movies-music category)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Rock & Metal', 'Рок и метъл', 'vinyl-rock', id, 1 FROM categories WHERE slug = 'vinyl-records'
UNION ALL
SELECT 'Pop', 'Поп', 'vinyl-pop', id, 2 FROM categories WHERE slug = 'vinyl-records'
UNION ALL
SELECT 'Jazz & Blues', 'Джаз и блус', 'vinyl-jazz', id, 3 FROM categories WHERE slug = 'vinyl-records'
UNION ALL
SELECT 'Classical', 'Класическа музика', 'vinyl-classical', id, 4 FROM categories WHERE slug = 'vinyl-records'
UNION ALL
SELECT 'Electronic', 'Електронна музика', 'vinyl-electronic', id, 5 FROM categories WHERE slug = 'vinyl-records'
UNION ALL
SELECT 'Bulgarian Music', 'Българска музика', 'vinyl-bulgarian', id, 6 FROM categories WHERE slug = 'vinyl-records';
;
