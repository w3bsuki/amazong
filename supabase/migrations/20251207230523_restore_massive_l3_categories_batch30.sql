
-- Batch 30: Toys, Art, Music, Bulgarian Traditional deep categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Toys L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'action-figures';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Superhero Figures', 'Супергеройски фигурки', 'superhero-figures', v_parent_id, 1),
      ('Anime Figures', 'Аниме фигурки', 'anime-figures', v_parent_id, 2),
      ('Movie Figures', 'Филмови фигурки', 'movie-figures', v_parent_id, 3),
      ('Video Game Figures', 'Фигурки от видео игри', 'video-game-figures', v_parent_id, 4),
      ('Military Figures', 'Военни фигурки', 'military-figures', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'building-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('LEGO', 'ЛЕГО', 'lego', v_parent_id, 1),
      ('Building Blocks', 'Конструктори', 'building-blocks', v_parent_id, 2),
      ('Magnetic Tiles', 'Магнитни плочки', 'magnetic-tiles', v_parent_id, 3),
      ('Model Kits', 'Модели за сглобяване', 'model-kits', v_parent_id, 4),
      ('Train Sets', 'Влакчета', 'train-sets', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dolls';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fashion Dolls', 'Модни кукли', 'fashion-dolls', v_parent_id, 1),
      ('Baby Dolls', 'Бебешки кукли', 'baby-dolls', v_parent_id, 2),
      ('Collectible Dolls', 'Колекционерски кукли', 'collectible-dolls', v_parent_id, 3),
      ('Doll Houses', 'Къщи за кукли', 'doll-houses', v_parent_id, 4),
      ('Doll Accessories', 'Аксесоари за кукли', 'doll-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'outdoor-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Swing Sets', 'Люлки', 'swing-sets', v_parent_id, 1),
      ('Trampolines', 'Батути', 'trampolines', v_parent_id, 2),
      ('Playhouses', 'Къщички за игра', 'playhouses', v_parent_id, 3),
      ('Ride-On Toys', 'Превозни играчки', 'ride-on-toys', v_parent_id, 4),
      ('Water Toys', 'Водни играчки', 'water-toys', v_parent_id, 5),
      ('Sandbox Toys', 'Играчки за пясък', 'sandbox-toys', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'educational-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('STEM Toys', 'STEM играчки', 'stem-toys', v_parent_id, 1),
      ('Learning Tablets', 'Обучителни таблети', 'learning-tablets', v_parent_id, 2),
      ('Science Kits', 'Научни комплекти', 'science-kits', v_parent_id, 3),
      ('Puzzles', 'Пъзели', 'puzzles', v_parent_id, 4),
      ('Board Games', 'Настолни игри', 'board-games', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'rc-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('RC Cars', 'RC коли', 'rc-cars', v_parent_id, 1),
      ('RC Trucks', 'RC камиони', 'rc-trucks', v_parent_id, 2),
      ('RC Helicopters', 'RC хеликоптери', 'rc-helicopters', v_parent_id, 3),
      ('RC Boats', 'RC лодки', 'rc-boats', v_parent_id, 4),
      ('RC Airplanes', 'RC самолети', 'rc-airplanes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Art & Crafts L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'drawing-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Colored Pencils', 'Цветни моливи', 'colored-pencils', v_parent_id, 1),
      ('Charcoal', 'Въглен', 'charcoal', v_parent_id, 2),
      ('Pastels', 'Пастели', 'pastels', v_parent_id, 3),
      ('Sketch Pads', 'Скицници', 'sketch-pads', v_parent_id, 4),
      ('Drawing Pencils', 'Графитни моливи', 'drawing-pencils', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'painting-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Acrylic Paints', 'Акрилни бои', 'acrylic-paints', v_parent_id, 1),
      ('Oil Paints', 'Маслени бои', 'oil-paints', v_parent_id, 2),
      ('Watercolors', 'Акварелни бои', 'watercolors', v_parent_id, 3),
      ('Canvases', 'Платна', 'canvases', v_parent_id, 4),
      ('Paint Brushes', 'Четки за рисуване', 'paint-brushes', v_parent_id, 5),
      ('Easels', 'Статив', 'easels', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'craft-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fabric & Textiles', 'Платове и текстил', 'fabric-textiles', v_parent_id, 1),
      ('Beading', 'Мъниста', 'beading', v_parent_id, 2),
      ('Scrapbooking', 'Скрапбукинг', 'scrapbooking', v_parent_id, 3),
      ('Knitting & Crochet', 'Плетене', 'knitting-crochet', v_parent_id, 4),
      ('Paper Craft', 'Хартиени занаяти', 'paper-craft', v_parent_id, 5),
      ('Clay & Modeling', 'Глина и моделиране', 'clay-modeling', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bulgarian Traditional L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'traditional-costumes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Women Costumes', 'Женски носии', 'women-costumes', v_parent_id, 1),
      ('Men Costumes', 'Мъжки носии', 'men-costumes', v_parent_id, 2),
      ('Children Costumes', 'Детски носии', 'children-costumes', v_parent_id, 3),
      ('Regional Costumes', 'Регионални носии', 'regional-costumes', v_parent_id, 4),
      ('Costume Accessories', 'Аксесоари за носии', 'costume-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'folk-instruments';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gaida', 'Гайда', 'gaida', v_parent_id, 1),
      ('Kaval', 'Кавал', 'kaval', v_parent_id, 2),
      ('Gadulka', 'Гъдулка', 'gadulka', v_parent_id, 3),
      ('Tambura', 'Тамбура', 'tambura', v_parent_id, 4),
      ('Tapan', 'Тъпан', 'tapan', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'traditional-crafts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pottery', 'Грънчарство', 'traditional-pottery', v_parent_id, 1),
      ('Wood Carving', 'Дърворезба', 'wood-carving', v_parent_id, 2),
      ('Embroidery', 'Бродерия', 'embroidery', v_parent_id, 3),
      ('Weaving', 'Тъкане', 'weaving', v_parent_id, 4),
      ('Icon Painting', 'Иконопис', 'icon-painting', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'rose-products';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Rose Oil', 'Розово масло', 'rose-oil', v_parent_id, 1),
      ('Rose Water', 'Розова вода', 'rose-water', v_parent_id, 2),
      ('Rose Cosmetics', 'Розова козметика', 'rose-cosmetics', v_parent_id, 3),
      ('Rose Jam', 'Розово сладко', 'rose-jam', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'traditional-foods';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bulgarian Cheese', 'Българско сирене', 'bulgarian-cheese', v_parent_id, 1),
      ('Bulgarian Yogurt', 'Българско кисело мляко', 'bulgarian-yogurt', v_parent_id, 2),
      ('Lukanka', 'Луканка', 'lukanka', v_parent_id, 3),
      ('Ajvar', 'Айвар', 'ajvar', v_parent_id, 4),
      ('Honey Products', 'Пчелни продукти', 'honey-products', v_parent_id, 5),
      ('Rakia', 'Ракия', 'rakia', v_parent_id, 6),
      ('Wine', 'Вино', 'bulgarian-wine', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hobbies L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'model-building';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Aircraft Models', 'Модели на самолети', 'aircraft-models', v_parent_id, 1),
      ('Car Models', 'Модели на коли', 'car-models', v_parent_id, 2),
      ('Ship Models', 'Модели на кораби', 'ship-models', v_parent_id, 3),
      ('Military Models', 'Военни модели', 'military-models', v_parent_id, 4),
      ('Model Trains', 'Модели влакове', 'model-trains', v_parent_id, 5),
      ('Diorama Supplies', 'Диорама консумативи', 'diorama-supplies', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'collecting';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Comic Books', 'Комикси', 'comic-books', v_parent_id, 1),
      ('Trading Card Games', 'Игри с карти', 'trading-card-games', v_parent_id, 2),
      ('Funko Pop', 'Funko Pop', 'funko-pop', v_parent_id, 3),
      ('Die-Cast Vehicles', 'Die-Cast превозни средства', 'die-cast-vehicles', v_parent_id, 4),
      ('Sports Cards', 'Спортни картички', 'sports-cards', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
