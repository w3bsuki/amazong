
-- Batch 40: More deep categories - Automotive, Tools, Garden
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Automotive deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'car-electronics';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Car Stereos', 'Автомобилни стерео системи', 'car-stereos', v_parent_id, 1),
      ('Car Speakers', 'Автомобилни тонколони', 'car-speakers', v_parent_id, 2),
      ('Car Amplifiers', 'Автомобилни усилватели', 'car-amplifiers', v_parent_id, 3),
      ('Dash Cameras', 'Видеорегистратори', 'dash-cameras', v_parent_id, 4),
      ('GPS Navigation', 'GPS навигация', 'gps-navigation', v_parent_id, 5),
      ('Backup Cameras', 'Камери за паркиране', 'backup-cameras', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'car-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Car Wash', 'Автомивка', 'car-wash', v_parent_id, 1),
      ('Car Wax & Polish', 'Вакса и полиране', 'car-wax-polish', v_parent_id, 2),
      ('Interior Cleaning', 'Вътрешно почистване', 'interior-cleaning', v_parent_id, 3),
      ('Tire Care', 'Грижа за гуми', 'tire-care', v_parent_id, 4),
      ('Glass Cleaners', 'Почистване на стъкла', 'glass-cleaners', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'car-parts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Brake Parts', 'Части за спирачки', 'brake-parts', v_parent_id, 1),
      ('Engine Parts', 'Части за двигател', 'engine-parts', v_parent_id, 2),
      ('Suspension Parts', 'Части за окачване', 'suspension-parts', v_parent_id, 3),
      ('Exhaust Parts', 'Ауспуси', 'exhaust-parts', v_parent_id, 4),
      ('Transmission Parts', 'Части за трансмисия', 'transmission-parts', v_parent_id, 5),
      ('Lighting', 'Осветление', 'car-lighting', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tires-wheels';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('All-Season Tires', 'Всесезонни гуми', 'all-season-tires', v_parent_id, 1),
      ('Summer Tires', 'Летни гуми', 'summer-tires', v_parent_id, 2),
      ('Winter Tires', 'Зимни гуми', 'winter-tires', v_parent_id, 3),
      ('Performance Tires', 'Спортни гуми', 'performance-tires', v_parent_id, 4),
      ('Wheels', 'Джанти', 'wheels', v_parent_id, 5),
      ('Tire Accessories', 'Аксесоари за гуми', 'tire-accessories', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Power Tools deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'power-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Drills', 'Бормашини', 'drills', v_parent_id, 1),
      ('Saws', 'Триони', 'saws', v_parent_id, 2),
      ('Sanders', 'Шлайфмашини', 'sanders', v_parent_id, 3),
      ('Grinders', 'Ъглошлайфи', 'grinders', v_parent_id, 4),
      ('Routers', 'Оберфрези', 'routers', v_parent_id, 5),
      ('Nail Guns', 'Пистолети за пирони', 'nail-guns', v_parent_id, 6),
      ('Air Compressors', 'Компресори', 'air-compressors', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hand-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hammers', 'Чукове', 'hammers', v_parent_id, 1),
      ('Screwdrivers', 'Отвертки', 'screwdrivers', v_parent_id, 2),
      ('Pliers', 'Клещи', 'pliers', v_parent_id, 3),
      ('Wrenches', 'Гаечни ключове', 'wrenches', v_parent_id, 4),
      ('Socket Sets', 'Комплекти гедори', 'socket-sets', v_parent_id, 5),
      ('Measuring Tools', 'Измервателни инструменти', 'measuring-tools', v_parent_id, 6),
      ('Tool Sets', 'Комплекти инструменти', 'tool-sets', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Garden deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'outdoor-power-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Lawn Mowers', 'Косачки', 'lawn-mowers', v_parent_id, 1),
      ('String Trimmers', 'Тримери', 'string-trimmers', v_parent_id, 2),
      ('Leaf Blowers', 'Духалки за листа', 'leaf-blowers', v_parent_id, 3),
      ('Chainsaws', 'Моторни триони', 'chainsaws', v_parent_id, 4),
      ('Pressure Washers', 'Водоструйки', 'pressure-washers', v_parent_id, 5),
      ('Snow Blowers', 'Снегорини', 'snow-blowers', v_parent_id, 6),
      ('Tillers', 'Мотофрези', 'tillers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'garden-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Shovels', 'Лопати', 'shovels', v_parent_id, 1),
      ('Rakes', 'Гребла', 'rakes', v_parent_id, 2),
      ('Pruning Tools', 'Градинарски ножици', 'pruning-tools', v_parent_id, 3),
      ('Garden Hoses', 'Градински маркучи', 'garden-hoses', v_parent_id, 4),
      ('Watering Cans', 'Лейки', 'watering-cans', v_parent_id, 5),
      ('Wheelbarrows', 'Ръчни колички', 'wheelbarrows', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'plants-seeds';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Flower Seeds', 'Семена за цветя', 'flower-seeds', v_parent_id, 1),
      ('Vegetable Seeds', 'Семена за зеленчуци', 'vegetable-seeds', v_parent_id, 2),
      ('Herb Seeds', 'Семена за билки', 'herb-seeds', v_parent_id, 3),
      ('Indoor Plants', 'Стайни растения', 'indoor-plants', v_parent_id, 4),
      ('Outdoor Plants', 'Градински растения', 'outdoor-plants', v_parent_id, 5),
      ('Bulbs', 'Луковици', 'bulbs', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'soil-fertilizers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Potting Soil', 'Почва за саксии', 'potting-soil', v_parent_id, 1),
      ('Fertilizers', 'Торове', 'fertilizers', v_parent_id, 2),
      ('Mulch', 'Мулч', 'mulch', v_parent_id, 3),
      ('Compost', 'Компост', 'compost', v_parent_id, 4),
      ('Pest Control', 'Контрол на вредители', 'pest-control-garden', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Planters deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'planters-pots';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Ceramic Pots', 'Керамични саксии', 'ceramic-pots', v_parent_id, 1),
      ('Plastic Pots', 'Пластмасови саксии', 'plastic-pots', v_parent_id, 2),
      ('Hanging Planters', 'Висящи саксии', 'hanging-planters', v_parent_id, 3),
      ('Raised Garden Beds', 'Повдигнати лехи', 'raised-garden-beds', v_parent_id, 4),
      ('Window Boxes', 'Кашпи за прозорец', 'window-boxes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
