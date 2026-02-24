
-- Batch 24: Baby, Books, Watches, Office, Industrial deep categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Baby L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'strollers-car-seats';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Full-Size Strollers', 'Пълноразмерни колички', 'full-size-strollers', v_parent_id, 1),
      ('Umbrella Strollers', 'Чадър колички', 'umbrella-strollers', v_parent_id, 2),
      ('Double Strollers', 'Двойни колички', 'double-strollers', v_parent_id, 3),
      ('Jogger Strollers', 'Колички за джогинг', 'jogger-strollers', v_parent_id, 4),
      ('Infant Car Seats', 'Столчета за бебета', 'infant-car-seats', v_parent_id, 5),
      ('Convertible Car Seats', 'Конвертируеми столчета', 'convertible-car-seats', v_parent_id, 6),
      ('Booster Seats', 'Бустер столчета', 'booster-seats', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-feeding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baby Bottles', 'Бебешки бутилки', 'baby-bottles', v_parent_id, 1),
      ('Breast Pumps', 'Помпи за кърма', 'breast-pumps', v_parent_id, 2),
      ('Baby Formula', 'Бебешки формули', 'baby-formula', v_parent_id, 3),
      ('High Chairs', 'Столчета за хранене', 'high-chairs', v_parent_id, 4),
      ('Baby Food', 'Бебешка храна', 'baby-food', v_parent_id, 5),
      ('Bottle Warmers', 'Затоплящи устройства', 'bottle-warmers', v_parent_id, 6),
      ('Bibs', 'Лигавници', 'bibs', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-nursery';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cribs', 'Бебешки креватчета', 'cribs', v_parent_id, 1),
      ('Bassinets', 'Кошчета за бебета', 'bassinets', v_parent_id, 2),
      ('Changing Tables', 'Пеленатори', 'changing-tables', v_parent_id, 3),
      ('Nursery Gliders', 'Люлеещи столове', 'nursery-gliders', v_parent_id, 4),
      ('Baby Monitors', 'Бебешки монитори', 'baby-monitors', v_parent_id, 5),
      ('Nursery Decor', 'Декор за детска стая', 'nursery-decor', v_parent_id, 6),
      ('Crib Mattresses', 'Матраци за креватчета', 'crib-mattresses', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'diapering';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Disposable Diapers', 'Еднократни пелени', 'disposable-diapers', v_parent_id, 1),
      ('Cloth Diapers', 'Платнени пелени', 'cloth-diapers', v_parent_id, 2),
      ('Wipes', 'Мокри кърпички', 'wipes', v_parent_id, 3),
      ('Diaper Bags', 'Чанти за пелени', 'diaper-bags', v_parent_id, 4),
      ('Diaper Pails', 'Кофи за пелени', 'diaper-pails', v_parent_id, 5),
      ('Rash Creams', 'Кремове против обрив', 'rash-creams', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Books L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fiction-books';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Literary Fiction', 'Литературна белетристика', 'literary-fiction', v_parent_id, 1),
      ('Mystery & Thriller', 'Мистерия и трилър', 'mystery-thriller', v_parent_id, 2),
      ('Romance', 'Романтика', 'romance-books', v_parent_id, 3),
      ('Science Fiction', 'Научна фантастика', 'science-fiction', v_parent_id, 4),
      ('Fantasy', 'Фентъзи', 'fantasy-books', v_parent_id, 5),
      ('Historical Fiction', 'Исторически роман', 'historical-fiction', v_parent_id, 6),
      ('Horror', 'Хорър', 'horror-books', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'non-fiction-books';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Biographies', 'Биографии', 'biographies', v_parent_id, 1),
      ('Self-Help', 'Самопомощ', 'self-help-books', v_parent_id, 2),
      ('Business Books', 'Бизнес книги', 'business-books', v_parent_id, 3),
      ('History', 'История', 'history-books', v_parent_id, 4),
      ('Science', 'Наука', 'science-books', v_parent_id, 5),
      ('True Crime', 'Истински престъпления', 'true-crime', v_parent_id, 6),
      ('Cookbooks', 'Готварски книги', 'cookbooks', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'childrens-books';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Picture Books', 'Книжки с картинки', 'picture-books', v_parent_id, 1),
      ('Early Readers', 'Ранни читатели', 'early-readers', v_parent_id, 2),
      ('Chapter Books', 'Книги с глави', 'chapter-books', v_parent_id, 3),
      ('Middle Grade', 'Средна възраст', 'middle-grade', v_parent_id, 4),
      ('Young Adult', 'Младежки', 'young-adult', v_parent_id, 5),
      ('Educational Books', 'Образователни книги', 'educational-books', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Watches L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-watches';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dress Watches', 'Официални часовници', 'mens-dress-watches', v_parent_id, 1),
      ('Sport Watches', 'Спортни часовници', 'mens-sport-watches', v_parent_id, 2),
      ('Dive Watches', 'Водолазни часовници', 'dive-watches', v_parent_id, 3),
      ('Chronograph Watches', 'Хронографи', 'chronograph-watches', v_parent_id, 4),
      ('Automatic Watches', 'Автоматични часовници', 'automatic-watches', v_parent_id, 5),
      ('Luxury Watches', 'Луксозни часовници', 'luxury-watches', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-watches';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fashion Watches', 'Модни часовници', 'fashion-watches', v_parent_id, 1),
      ('Dress Watches', 'Официални часовници', 'womens-dress-watches', v_parent_id, 2),
      ('Sport Watches', 'Спортни часовници', 'womens-sport-watches', v_parent_id, 3),
      ('Diamond Watches', 'Диамантени часовници', 'diamond-watches', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smartwatches';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Apple Watch', 'Apple Watch', 'apple-watch', v_parent_id, 1),
      ('Samsung Galaxy Watch', 'Samsung Galaxy Watch', 'samsung-galaxy-watch', v_parent_id, 2),
      ('Garmin Smartwatches', 'Garmin смарт часовници', 'garmin-smartwatches', v_parent_id, 3),
      ('Fitbit Smartwatches', 'Fitbit смарт часовници', 'fitbit-smartwatches', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Office Supplies L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'writing-instruments';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pens', 'Химикалки', 'pens', v_parent_id, 1),
      ('Pencils', 'Моливи', 'pencils', v_parent_id, 2),
      ('Markers', 'Маркери', 'markers', v_parent_id, 3),
      ('Highlighters', 'Текст маркери', 'highlighters', v_parent_id, 4),
      ('Fountain Pens', 'Писалки', 'fountain-pens', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'paper-products';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Notebooks', 'Тетрадки', 'notebooks', v_parent_id, 1),
      ('Legal Pads', 'Бележници', 'legal-pads', v_parent_id, 2),
      ('Sticky Notes', 'Лепящи бележки', 'sticky-notes', v_parent_id, 3),
      ('Copy Paper', 'Копирна хартия', 'copy-paper', v_parent_id, 4),
      ('Envelopes', 'Пликове', 'envelopes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'desk-organization';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Desk Organizers', 'Органайзери за бюро', 'desk-organizers', v_parent_id, 1),
      ('File Folders', 'Папки за документи', 'file-folders', v_parent_id, 2),
      ('Binders', 'Класьори', 'binders', v_parent_id, 3),
      ('Paper Clips', 'Кламери', 'paper-clips', v_parent_id, 4),
      ('Staplers', 'Телбоди', 'staplers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Industrial L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'safety-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hard Hats', 'Каски', 'hard-hats', v_parent_id, 1),
      ('Safety Glasses', 'Предпазни очила', 'safety-glasses', v_parent_id, 2),
      ('Work Gloves', 'Работни ръкавици', 'work-gloves', v_parent_id, 3),
      ('Safety Vests', 'Сигнални жилетки', 'safety-vests', v_parent_id, 4),
      ('Hearing Protection', 'Защита за слуха', 'hearing-protection', v_parent_id, 5),
      ('Respirators', 'Респиратори', 'respirators', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'material-handling';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hand Trucks', 'Ръчни колички', 'hand-trucks', v_parent_id, 1),
      ('Pallet Jacks', 'Палетни колички', 'pallet-jacks', v_parent_id, 2),
      ('Dollies', 'Транспортни платформи', 'dollies', v_parent_id, 3),
      ('Storage Bins', 'Контейнери за съхранение', 'storage-bins', v_parent_id, 4),
      ('Shelving Units', 'Стелажи', 'shelving-units', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
