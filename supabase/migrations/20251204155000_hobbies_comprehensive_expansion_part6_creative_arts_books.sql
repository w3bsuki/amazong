
-- =====================================================
-- HOBBIES PART 6: Creative Arts + Books Expansion
-- =====================================================

DO $$
DECLARE
  creative_id UUID;
  books_id UUID;
  cat_id UUID;
BEGIN
  SELECT id INTO creative_id FROM categories WHERE slug = 'hobby-creative-arts';
  SELECT id INTO books_id FROM categories WHERE slug = 'books';
  
  -- ========== CREATIVE ARTS ==========
  -- L2: Painting & Drawing
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Painting & Drawing', 'Рисуване и чертане', 'creative-painting', creative_id, '🎨', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Oil Paints', 'Маслени бои', 'paint-oil', cat_id, '🎨', 1),
  ('Acrylic Paints', 'Акрилни бои', 'paint-acrylic', cat_id, '🎨', 2),
  ('Watercolors', 'Акварел', 'paint-watercolor', cat_id, '💧', 3),
  ('Gouache', 'Гваш', 'paint-gouache', cat_id, '🎨', 4),
  ('Pencils & Charcoal', 'Моливи и въглен', 'paint-pencils', cat_id, '✏️', 5),
  ('Pastels', 'Пастели', 'paint-pastels', cat_id, '🖍️', 6),
  ('Canvas & Paper', 'Платна и хартия', 'paint-canvas', cat_id, '📄', 7),
  ('Brushes', 'Четки', 'paint-brushes', cat_id, '🖌️', 8),
  ('Easels', 'Стативи', 'paint-easels', cat_id, '🖼️', 9)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Photography (Hobby)
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Photography', 'Фотография', 'creative-photography', creative_id, '📷', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Film Photography', 'Филмова фотография', 'photo-film', cat_id, '📷', 1),
  ('Instant Photography', 'Моментална фотография', 'photo-instant', cat_id, '📸', 2),
  ('Photo Printing', 'Фото печат', 'photo-printing', cat_id, '🖨️', 3),
  ('Darkroom Supplies', 'Тъмна стая', 'photo-darkroom', cat_id, '🌑', 4),
  ('Photo Albums', 'Фото албуми', 'photo-albums', cat_id, '📚', 5),
  ('Photo Frames', 'Фото рамки', 'photo-frames', cat_id, '🖼️', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Calligraphy & Lettering
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Calligraphy & Lettering', 'Калиграфия и летъринг', 'creative-calligraphy', creative_id, '✒️', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Calligraphy Pens', 'Калиграфски пера', 'calli-pens', cat_id, '✒️', 1),
  ('Fountain Pens', 'Писалки', 'calli-fountain', cat_id, '🖋️', 2),
  ('Brush Pens', 'Четкови маркери', 'calli-brush', cat_id, '🖌️', 3),
  ('Calligraphy Inks', 'Калиграфски мастила', 'calli-inks', cat_id, '🧪', 4),
  ('Practice Paper', 'Хартия за практика', 'calli-paper', cat_id, '📄', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Sculpting & Pottery
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Sculpting & Pottery', 'Скулптура и грънчарство', 'creative-sculpting', creative_id, '🏺', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Clay & Pottery', 'Глина и грънчарство', 'sculpt-clay', cat_id, '🏺', 1),
  ('Pottery Wheels', 'Грънчарски кръгове', 'sculpt-wheels', cat_id, '⭕', 2),
  ('Kilns', 'Пещи', 'sculpt-kilns', cat_id, '🔥', 3),
  ('Sculpting Tools', 'Инструменти', 'sculpt-tools', cat_id, '🔧', 4),
  ('Glazes', 'Глазури', 'sculpt-glazes', cat_id, '✨', 5),
  ('Polymer Clay', 'Полимерна глина', 'sculpt-polymer', cat_id, '🎨', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Digital Art
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Digital Art', 'Дигитално изкуство', 'creative-digital', creative_id, '💻', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Drawing Tablets', 'Графични таблети', 'digital-tablets', cat_id, '📱', 1),
  ('Stylus Pens', 'Стилуси', 'digital-stylus', cat_id, '✏️', 2),
  ('Digital Art Software', 'Софтуер за изкуство', 'digital-software', cat_id, '💿', 3),
  ('Pen Displays', 'Екранни таблети', 'digital-displays', cat_id, '🖥️', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- L2: Journaling & Planning
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Journaling & Planning', 'Дневници и планиране', 'creative-journaling', creative_id, '📔', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Bullet Journals', 'Bullet дневници', 'journal-bullet', cat_id, '📓', 1),
  ('Planners', 'Планери', 'journal-planners', cat_id, '📅', 2),
  ('Stickers & Washi', 'Стикери и васи лента', 'journal-stickers', cat_id, '🏷️', 3),
  ('Stamps', 'Печати', 'journal-stamps', cat_id, '🔖', 4),
  ('Journal Supplies', 'Аксесоари за дневници', 'journal-supplies', cat_id, '✂️', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- ========== BOOKS EXPANSION ==========
  -- Update Fiction L3
  SELECT id INTO cat_id FROM categories WHERE slug = 'fiction';
  IF cat_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
    ('Contemporary Fiction', 'Съвременна проза', 'fiction-contemporary', cat_id, '📖', 7),
    ('Classics', 'Класика', 'fiction-classics', cat_id, '📚', 8),
    ('Short Stories', 'Разкази', 'fiction-short', cat_id, '📝', 9),
    ('Bulgarian Fiction', 'Българска художествена', 'fiction-bulgarian', cat_id, '🇧🇬', 10)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;
  END IF;

  -- NEW L2: Rare & Antiquarian Books
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Rare & Antiquarian', 'Редки и антикварни', 'books-rare', books_id, '📜', 10)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('First Editions', 'Първи издания', 'books-first-editions', cat_id, '1️⃣', 1),
  ('Signed Books', 'Подписани книги', 'books-signed', cat_id, '✍️', 2),
  ('Vintage Books', 'Винтидж книги', 'books-vintage', cat_id, '📜', 3),
  ('Bulgarian Antiquarian', 'Български антикварни', 'books-bg-antique', cat_id, '🇧🇬', 4),
  ('Illustrated Books', 'Илюстровани книги', 'books-illustrated', cat_id, '🎨', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- NEW L2: Comics & Graphic Novels (separate from Collectibles graded comics)
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Comics & Graphic Novels', 'Комикси и графични романи', 'books-comics', books_id, '💬', 11)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Superhero Comics', 'Супергеройски комикси', 'comics-superhero', cat_id, '🦸', 1),
  ('Manga Reading', 'Манга за четене', 'comics-manga-reading', cat_id, '📖', 2),
  ('Indie & Alternative', 'Инди и алтернативни', 'comics-indie-reading', cat_id, '🎭', 3),
  ('European Comics', 'Европейски комикси', 'comics-euro', cat_id, '🇪🇺', 4),
  ('Bulgarian Comics', 'Български комикси', 'comics-bulgarian', cat_id, '🇧🇬', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- NEW L2: Self-Published & Zines
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Self-Published & Zines', 'Самоиздадени и зини', 'books-zines', books_id, '📰', 12)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg
  RETURNING id INTO cat_id;
  
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Art Zines', 'Арт зини', 'zines-art', cat_id, '🎨', 1),
  ('Poetry Zines', 'Поезия зини', 'zines-poetry', cat_id, '📝', 2),
  ('Music Zines', 'Музикални зини', 'zines-music', cat_id, '🎵', 3),
  ('DIY & Craft Zines', 'DIY зини', 'zines-diy', cat_id, '✂️', 4),
  ('Self-Published Books', 'Самоиздадени книги', 'zines-selfpub', cat_id, '📚', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

END $$;
;
