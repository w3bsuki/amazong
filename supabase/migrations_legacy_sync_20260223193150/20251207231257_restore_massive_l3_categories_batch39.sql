
-- Batch 39: More deep categories - Baby, Books, Office
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Baby deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-feeding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baby Bottles', 'Бебешки бутилки', 'baby-bottles', v_parent_id, 1),
      ('Breast Pumps', 'Помпи за кърма', 'breast-pumps', v_parent_id, 2),
      ('Baby Food', 'Бебешка храна', 'baby-food', v_parent_id, 3),
      ('Highchairs', 'Столчета за хранене', 'highchairs', v_parent_id, 4),
      ('Baby Bibs', 'Лигавници', 'baby-bibs', v_parent_id, 5),
      ('Sippy Cups', 'Чаши с накрайник', 'sippy-cups', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'diapers-potty';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Disposable Diapers', 'Еднократни пелени', 'disposable-diapers', v_parent_id, 1),
      ('Cloth Diapers', 'Многократни пелени', 'cloth-diapers', v_parent_id, 2),
      ('Training Pants', 'Гащички за обучение', 'training-pants', v_parent_id, 3),
      ('Potty Seats', 'Детски гърнета', 'potty-seats', v_parent_id, 4),
      ('Wipes', 'Мокри кърпички', 'wipes', v_parent_id, 5),
      ('Diaper Bags', 'Чанти за пелени', 'diaper-bags', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-gear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Strollers', 'Колички', 'strollers', v_parent_id, 1),
      ('Car Seats', 'Столчета за кола', 'car-seats', v_parent_id, 2),
      ('Baby Carriers', 'Бебеносачки', 'baby-carriers', v_parent_id, 3),
      ('Cribs', 'Кошари', 'cribs', v_parent_id, 4),
      ('Bassinets', 'Бебешки кошчета', 'bassinets', v_parent_id, 5),
      ('Play Yards', 'Кошари за игра', 'play-yards', v_parent_id, 6),
      ('Baby Swings', 'Бебешки люлки', 'baby-swings', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-safety';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baby Gates', 'Предпазни врати', 'baby-gates', v_parent_id, 1),
      ('Baby Monitors', 'Бебефони', 'baby-monitors', v_parent_id, 2),
      ('Outlet Covers', 'Капачки за контакти', 'outlet-covers', v_parent_id, 3),
      ('Cabinet Locks', 'Заключване на шкафове', 'cabinet-locks', v_parent_id, 4),
      ('Corner Protectors', 'Протектори за ъгли', 'corner-protectors', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-clothing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bodysuits', 'Бодита', 'bodysuits', v_parent_id, 1),
      ('Sleepwear', 'Облекло за сън', 'baby-sleepwear', v_parent_id, 2),
      ('Baby Shoes', 'Бебешки обувки', 'baby-shoes', v_parent_id, 3),
      ('Baby Accessories', 'Бебешки аксесоари', 'baby-accessories', v_parent_id, 4),
      ('Baby Outerwear', 'Бебешки якета', 'baby-outerwear', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Books deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fiction';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Literary Fiction', 'Литературна фикция', 'literary-fiction', v_parent_id, 1),
      ('Mystery & Thriller', 'Мистерия и трилър', 'mystery-thriller', v_parent_id, 2),
      ('Science Fiction', 'Научна фантастика', 'science-fiction', v_parent_id, 3),
      ('Fantasy', 'Фентъзи', 'fantasy-books', v_parent_id, 4),
      ('Romance', 'Любовни романи', 'romance-books', v_parent_id, 5),
      ('Horror', 'Хорор', 'horror-books', v_parent_id, 6),
      ('Historical Fiction', 'Историческа фикция', 'historical-fiction', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'non-fiction';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Biography & Memoir', 'Биография и мемоари', 'biography-memoir', v_parent_id, 1),
      ('Self-Help', 'Самопомощ', 'self-help', v_parent_id, 2),
      ('Business & Finance', 'Бизнес и финанси', 'business-finance-books', v_parent_id, 3),
      ('Health & Wellness', 'Здраве и уелнес', 'health-wellness-books', v_parent_id, 4),
      ('Science & Nature', 'Наука и природа', 'science-nature-books', v_parent_id, 5),
      ('History', 'История', 'history-books', v_parent_id, 6),
      ('Travel', 'Пътешествия', 'travel-books', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'childrens-books';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Picture Books', 'Книжки с картинки', 'picture-books', v_parent_id, 1),
      ('Early Readers', 'Книги за начинаещи', 'early-readers', v_parent_id, 2),
      ('Chapter Books', 'Книги с глави', 'chapter-books', v_parent_id, 3),
      ('Young Adult', 'Тийнейджърска литература', 'young-adult', v_parent_id, 4),
      ('Educational Books', 'Образователни книги', 'educational-books-kids', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'textbooks';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('College Textbooks', 'Университетски учебници', 'college-textbooks', v_parent_id, 1),
      ('High School Textbooks', 'Гимназиални учебници', 'high-school-textbooks', v_parent_id, 2),
      ('Test Prep', 'Подготовка за тестове', 'test-prep', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Office Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pens & Pencils', 'Химикали и моливи', 'pens-pencils', v_parent_id, 1),
      ('Notebooks & Notepads', 'Тетрадки и бележници', 'notebooks-notepads', v_parent_id, 2),
      ('Paper', 'Хартия', 'paper', v_parent_id, 3),
      ('Binders & Folders', 'Папки и класьори', 'binders-folders', v_parent_id, 4),
      ('Desk Organizers', 'Органайзери за бюро', 'desk-organizers', v_parent_id, 5),
      ('Staplers & Punches', 'Телбоди и перфоратори', 'staplers-punches', v_parent_id, 6),
      ('Tape & Adhesives', 'Тиксо и лепила', 'tape-adhesives', v_parent_id, 7),
      ('Labels & Stickers', 'Етикети и стикери', 'labels-stickers', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Office Desks', 'Офис бюра', 'office-desks', v_parent_id, 1),
      ('Office Chairs', 'Офис столове', 'office-chairs', v_parent_id, 2),
      ('Filing Cabinets', 'Картотеки', 'filing-cabinets', v_parent_id, 3),
      ('Bookcases', 'Етажерки за книги', 'bookcases', v_parent_id, 4),
      ('Office Lighting', 'Офис осветление', 'office-lighting', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'printers-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Inkjet Printers', 'Мастиленоструйни принтери', 'inkjet-printers', v_parent_id, 1),
      ('Laser Printers', 'Лазерни принтери', 'laser-printers', v_parent_id, 2),
      ('Ink & Toner', 'Мастила и тонери', 'ink-toner', v_parent_id, 3),
      ('Printer Paper', 'Хартия за принтер', 'printer-paper', v_parent_id, 4),
      ('Scanners', 'Скенери', 'scanners', v_parent_id, 5),
      ('Fax Machines', 'Факс машини', 'fax-machines', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
