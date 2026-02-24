
-- Batch 51: More categories - Tableware, Kitchen organization, Cookware details
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Tableware deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dinnerware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dinner Plates', 'Чинии за вечеря', 'dinner-plates', v_parent_id, 1),
      ('Salad Plates', 'Чинии за салата', 'salad-plates', v_parent_id, 2),
      ('Bowls', 'Купи', 'dinnerware-bowls', v_parent_id, 3),
      ('Dinnerware Sets', 'Комплекти за хранене', 'dinnerware-sets', v_parent_id, 4),
      ('Serving Platters', 'Блюда за сервиране', 'serving-platters', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'glassware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wine Glasses', 'Чаши за вино', 'wine-glasses', v_parent_id, 1),
      ('Beer Glasses', 'Чаши за бира', 'beer-glasses', v_parent_id, 2),
      ('Tumblers', 'Тумблъри', 'tumblers', v_parent_id, 3),
      ('Champagne Flutes', 'Чаши за шампанско', 'champagne-flutes', v_parent_id, 4),
      ('Cocktail Glasses', 'Чаши за коктейли', 'cocktail-glasses', v_parent_id, 5),
      ('Drinking Glasses', 'Чаши за вода', 'drinking-glasses', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'flatware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Flatware Sets', 'Комплекти прибори', 'flatware-sets', v_parent_id, 1),
      ('Forks', 'Вилици', 'forks', v_parent_id, 2),
      ('Spoons', 'Лъжици', 'spoons', v_parent_id, 3),
      ('Knives', 'Ножове за хранене', 'dinner-knives', v_parent_id, 4),
      ('Serving Utensils', 'Сервизни прибори', 'serving-utensils', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Drinkware deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'drinkware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Coffee Mugs', 'Чаши за кафе', 'coffee-mugs', v_parent_id, 1),
      ('Travel Mugs', 'Термо чаши', 'travel-mugs', v_parent_id, 2),
      ('Water Bottles', 'Бутилки за вода', 'water-bottles', v_parent_id, 3),
      ('Teacups', 'Чаши за чай', 'teacups', v_parent_id, 4),
      ('Tumblers Insulated', 'Изолирани чаши', 'tumblers-insulated', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bakeware deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bakeware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cake Pans', 'Форми за торти', 'cake-pans', v_parent_id, 1),
      ('Cookie Sheets', 'Тави за бисквити', 'cookie-sheets', v_parent_id, 2),
      ('Muffin Pans', 'Форми за мъфини', 'muffin-pans', v_parent_id, 3),
      ('Pie Pans', 'Форми за пай', 'pie-pans', v_parent_id, 4),
      ('Bread Pans', 'Форми за хляб', 'bread-pans', v_parent_id, 5),
      ('Baking Mats', 'Подложки за печене', 'baking-mats', v_parent_id, 6),
      ('Cooling Racks', 'Решетки за охлаждане', 'cooling-racks', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kitchen Organization deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kitchen-storage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Food Storage Containers', 'Кутии за храна', 'food-storage-containers', v_parent_id, 1),
      ('Spice Racks', 'Стелажи за подправки', 'spice-racks', v_parent_id, 2),
      ('Canisters', 'Буркани', 'canisters', v_parent_id, 3),
      ('Bread Boxes', 'Кутии за хляб', 'bread-boxes', v_parent_id, 4),
      ('Pantry Organizers', 'Организатори за килер', 'pantry-organizers', v_parent_id, 5),
      ('Cabinet Organizers', 'Организатори за шкафове', 'cabinet-organizers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kitchen Tools deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kitchen-utensils';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Spatulas', 'Шпатули', 'spatulas', v_parent_id, 1),
      ('Whisks', 'Бъркалки', 'whisks', v_parent_id, 2),
      ('Tongs', 'Щипки', 'tongs', v_parent_id, 3),
      ('Ladles', 'Черпаци', 'ladles', v_parent_id, 4),
      ('Peelers', 'Белачки', 'peelers', v_parent_id, 5),
      ('Graters', 'Ренде', 'graters', v_parent_id, 6),
      ('Can Openers', 'Отварачки за консерви', 'can-openers', v_parent_id, 7),
      ('Colanders', 'Гевгири', 'colanders', v_parent_id, 8),
      ('Cutting Boards', 'Дъски за рязане', 'cutting-boards', v_parent_id, 9),
      ('Measuring Cups', 'Мерителни чаши', 'measuring-cups', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bar Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bar-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cocktail Shakers', 'Шейкъри', 'cocktail-shakers', v_parent_id, 1),
      ('Bar Tools Sets', 'Комплекти за бар', 'bar-tools-sets', v_parent_id, 2),
      ('Ice Buckets', 'Ледарки', 'ice-buckets', v_parent_id, 3),
      ('Wine Openers', 'Тирбушони', 'wine-openers', v_parent_id, 4),
      ('Decanters', 'Декантери', 'decanters', v_parent_id, 5),
      ('Jiggers', 'Мерки за коктейли', 'jiggers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tea & Coffee deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'coffee-tea';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Coffee Grinders', 'Мелници за кафе', 'coffee-grinders', v_parent_id, 1),
      ('French Presses', 'Кани за кафе', 'french-presses', v_parent_id, 2),
      ('Espresso Machines', 'Еспресо машини', 'espresso-machines', v_parent_id, 3),
      ('Pour Over Coffee', 'Пур оувър кафе', 'pour-over-coffee', v_parent_id, 4),
      ('Teapots', 'Чайници', 'teapots', v_parent_id, 5),
      ('Tea Infusers', 'Инфузери за чай', 'tea-infusers', v_parent_id, 6),
      ('Cold Brew Makers', 'Студено кафе', 'cold-brew-makers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
