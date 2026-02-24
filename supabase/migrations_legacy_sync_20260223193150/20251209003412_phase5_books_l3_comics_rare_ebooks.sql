
-- Phase 5: Books - Comics, Rare Books, E-Books L3 Categories

-- Comics & Graphic Novels > Comics & Manga L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Shonen Manga', 'Shojo Manga', 'Seinen Manga', 'Josei Manga', 'Manhwa', 'Manhua', 'DC Comics', 'Marvel Comics', 'Indie Comics']),
  unnest(ARRAY['comics-manga-shonen', 'comics-manga-shojo', 'comics-manga-seinen', 'comics-manga-josei', 'comics-manga-manhwa', 'comics-manga-manhua', 'comics-dc', 'comics-marvel', 'comics-indie']),
  (SELECT id FROM categories WHERE slug = 'books-comics-manga'),
  unnest(ARRAY['Шонен манга', 'Шоджо манга', 'Сейнен манга', 'Джосей манга', 'Манхва', 'Манхуа', 'DC комикси', 'Marvel комикси', 'Инди комикси']),
  '📚',
  generate_series(1, 9)
ON CONFLICT (slug) DO NOTHING;

-- Comics > Bulgarian Comics L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Bulgarian Superhero', 'Bulgarian Historical Comics', 'Bulgarian Humor Comics', 'Bulgarian Children Comics', 'Bulgarian Indie Comics']),
  unnest(ARRAY['comics-bulgarian-superhero', 'comics-bulgarian-historical', 'comics-bulgarian-humor', 'comics-bulgarian-children', 'comics-bulgarian-indie']),
  (SELECT id FROM categories WHERE slug = 'comics-bulgarian'),
  unnest(ARRAY['Български супергерои', 'Български исторически комикси', 'Хумористични комикси', 'Детски комикси', 'Българско инди']),
  '📚',
  generate_series(1, 5)
ON CONFLICT (slug) DO NOTHING;

-- Comics > European Comics L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['French BD', 'Italian Fumetti', 'Belgian Comics', 'British Comics', 'Spanish Comics', 'German Comics']),
  unnest(ARRAY['comics-euro-french', 'comics-euro-italian', 'comics-euro-belgian', 'comics-euro-british', 'comics-euro-spanish', 'comics-euro-german']),
  (SELECT id FROM categories WHERE slug = 'comics-euro'),
  unnest(ARRAY['Френски BD', 'Италиански фумети', 'Белгийски комикси', 'Британски комикси', 'Испански комикси', 'Немски комикси']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Rare & Antiquarian > First Editions L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['First Edition Fiction', 'First Edition Non-Fiction', 'Signed First Editions', 'Limited Editions', 'Numbered Editions', 'Special Editions']),
  unnest(ARRAY['rare-first-fiction', 'rare-first-nonfiction', 'rare-first-signed', 'rare-first-limited', 'rare-first-numbered', 'rare-first-special']),
  (SELECT id FROM categories WHERE slug = 'books-first-editions'),
  unnest(ARRAY['Първо издание художествена', 'Първо издание документална', 'Подписани първи издания', 'Лимитирани издания', 'Номерирани издания', 'Специални издания']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- Rare > Bulgarian Antiquarian L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Revival Period Books', 'Communist Era Books', 'Pre-War Bulgarian', 'Bulgarian Manuscripts', 'Early Print Bulgarian', 'Historical Maps']),
  unnest(ARRAY['rare-bg-revival', 'rare-bg-communist', 'rare-bg-prewar', 'rare-bg-manuscripts', 'rare-bg-early-print', 'rare-bg-maps']),
  (SELECT id FROM categories WHERE slug = 'books-bg-antique'),
  unnest(ARRAY['Възрожденски книги', 'Книги от соц. период', 'Предвоенни български', 'Български ръкописи', 'Ранен български печат', 'Исторически карти']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;

-- E-Books > E-Books & Audiobooks L3s
INSERT INTO categories (name, slug, parent_id, name_bg, icon, display_order)
SELECT 
  unnest(ARRAY['Kindle E-Books', 'EPUB E-Books', 'PDF Books', 'Audiobooks', 'Interactive E-Books', 'Subscription E-Books']),
  unnest(ARRAY['ebooks-kindle', 'ebooks-epub', 'ebooks-pdf', 'ebooks-audiobooks', 'ebooks-interactive', 'ebooks-subscription']),
  (SELECT id FROM categories WHERE slug = 'ebooks-audiobooks'),
  unnest(ARRAY['Kindle електронни книги', 'EPUB електронни книги', 'PDF книги', 'Аудиокниги', 'Интерактивни е-книги', 'Е-книги с абонамент']),
  '📚',
  generate_series(1, 6)
ON CONFLICT (slug) DO NOTHING;
;
