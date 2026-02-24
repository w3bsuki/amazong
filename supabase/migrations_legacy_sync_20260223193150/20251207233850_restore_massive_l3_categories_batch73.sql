
-- Batch 73: Automotive, Books, and Movies categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Car Electronics deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'car-electronics';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Car Stereos', 'Авто стерео', 'car-stereos', v_parent_id, 1),
      ('Car Speakers', 'Авто колонки', 'car-speakers', v_parent_id, 2),
      ('Dash Cameras', 'Видеорегистратори', 'dash-cameras', v_parent_id, 3),
      ('GPS Navigation', 'GPS навигация', 'gps-navigation', v_parent_id, 4),
      ('Car Chargers', 'Авто зарядни', 'car-chargers', v_parent_id, 5),
      ('Backup Cameras', 'Камери за задно виждане', 'backup-cameras', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Car Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'car-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Car Wash', 'Автомивка', 'car-wash', v_parent_id, 1),
      ('Car Wax', 'Автовосък', 'car-wax', v_parent_id, 2),
      ('Interior Cleaners', 'Почистващи за интериор', 'interior-cleaners', v_parent_id, 3),
      ('Glass Cleaners Auto', 'Почистващи за стъкла', 'glass-cleaners-auto', v_parent_id, 4),
      ('Air Fresheners Car', 'Освежители за кола', 'air-fresheners-car', v_parent_id, 5),
      ('Detail Brushes', 'Четки за детайлинг', 'detail-brushes', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Car Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'car-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Floor Mats', 'Автостелки', 'floor-mats', v_parent_id, 1),
      ('Seat Covers', 'Калъфи за седалки', 'seat-covers', v_parent_id, 2),
      ('Sun Shades', 'Сенници', 'sun-shades', v_parent_id, 3),
      ('Steering Wheel Covers', 'Калъфи за волани', 'steering-wheel-covers', v_parent_id, 4),
      ('Phone Holders Car', 'Стойки за телефони за кола', 'phone-holders-car', v_parent_id, 5),
      ('Trunk Organizers', 'Органайзери за багажник', 'trunk-organizers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Books deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'books';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fiction', 'Художествена литература', 'fiction', v_parent_id, 1),
      ('Non-Fiction', 'Нехудожествена литература', 'non-fiction', v_parent_id, 2),
      ('Children Books', 'Детски книги', 'children-books', v_parent_id, 3),
      ('Textbooks', 'Учебници', 'textbooks', v_parent_id, 4),
      ('Cookbooks', 'Готварски книги', 'cookbooks', v_parent_id, 5),
      ('Self-Help Books', 'Книги за самопомощ', 'self-help-books', v_parent_id, 6),
      ('Mystery Books', 'Криминални романи', 'mystery-books', v_parent_id, 7),
      ('Sci-Fi Fantasy', 'Научна фантастика и фентъзи', 'sci-fi-fantasy', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Movies & TV deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'movies-tv';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Blu-ray Movies', 'Blu-ray филми', 'blu-ray-movies', v_parent_id, 1),
      ('DVD Movies', 'DVD филми', 'dvd-movies', v_parent_id, 2),
      ('4K UHD Movies', '4K UHD филми', '4k-uhd-movies', v_parent_id, 3),
      ('TV Series', 'Телевизионни сериали', 'tv-series', v_parent_id, 4),
      ('Kids Movies', 'Детски филми', 'kids-movies', v_parent_id, 5),
      ('Documentary', 'Документални', 'documentary', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Music deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'music';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Vinyl Records', 'Грамофонни плочи', 'vinyl-records', v_parent_id, 1),
      ('CDs', 'Компакт дискове', 'cds', v_parent_id, 2),
      ('Music Cassettes', 'Музикални касети', 'music-cassettes', v_parent_id, 3),
      ('Sheet Music', 'Ноти', 'sheet-music', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Musical Instruments deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'musical-instruments';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Guitars', 'Китари', 'guitars', v_parent_id, 1),
      ('Drums', 'Барабани', 'drums', v_parent_id, 2),
      ('Keyboards', 'Клавишни инструменти', 'keyboards-music', v_parent_id, 3),
      ('Brass Instruments', 'Духови инструменти', 'brass-instruments', v_parent_id, 4),
      ('Woodwind Instruments', 'Дървени духови', 'woodwind-instruments', v_parent_id, 5),
      ('String Instruments', 'Струнни инструменти', 'string-instruments', v_parent_id, 6),
      ('DJ Equipment', 'DJ оборудване', 'dj-equipment', v_parent_id, 7),
      ('Recording Equipment', 'Оборудване за запис', 'recording-equipment', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
