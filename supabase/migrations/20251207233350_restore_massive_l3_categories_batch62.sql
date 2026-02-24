
-- Batch 62: Kitchen Appliances, Cookware, and more kitchen categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Kitchen Appliances deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kitchen-appliances';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Blenders', 'Блендери', 'blenders', v_parent_id, 1),
      ('Food Processors', 'Кухненски роботи', 'food-processors', v_parent_id, 2),
      ('Mixers', 'Миксери', 'mixers', v_parent_id, 3),
      ('Toasters', 'Тостери', 'toasters', v_parent_id, 4),
      ('Coffee Makers', 'Кафе машини', 'coffee-makers', v_parent_id, 5),
      ('Microwaves', 'Микровълнови', 'microwaves', v_parent_id, 6),
      ('Air Fryers', 'Фритюрници с въздух', 'air-fryers', v_parent_id, 7),
      ('Instant Pots', 'Мултикукъри', 'instant-pots', v_parent_id, 8),
      ('Juicers', 'Сокоизстисквачки', 'juicers', v_parent_id, 9),
      ('Electric Kettles', 'Електрически кани', 'electric-kettles', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cookware deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cookware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pots', 'Тенджери', 'pots', v_parent_id, 1),
      ('Pans', 'Тигани', 'pans', v_parent_id, 2),
      ('Skillets', 'Дълбоки тигани', 'skillets', v_parent_id, 3),
      ('Dutch Ovens', 'Чугунени гърнета', 'dutch-ovens', v_parent_id, 4),
      ('Woks', 'Уок тигани', 'woks', v_parent_id, 5),
      ('Roasting Pans', 'Тави за печене', 'roasting-pans', v_parent_id, 6),
      ('Saucepans', 'Дълбоки тенджери', 'saucepans', v_parent_id, 7),
      ('Cookware Sets', 'Комплекти съдове', 'cookware-sets', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bakeware deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bakeware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baking Sheets', 'Тави за печене', 'baking-sheets', v_parent_id, 1),
      ('Cake Pans', 'Форми за торти', 'cake-pans', v_parent_id, 2),
      ('Muffin Pans', 'Форми за мъфини', 'muffin-pans', v_parent_id, 3),
      ('Pie Pans', 'Форми за пай', 'pie-pans', v_parent_id, 4),
      ('Loaf Pans', 'Форми за хляб', 'loaf-pans', v_parent_id, 5),
      ('Cookie Sheets', 'Тави за бисквити', 'cookie-sheets', v_parent_id, 6),
      ('Cooling Racks', 'Решетки за охлаждане', 'cooling-racks', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cutlery deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cutlery';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Chef Knives', 'Ножове за главен готвач', 'chef-knives', v_parent_id, 1),
      ('Paring Knives', 'Ножове за белене', 'paring-knives', v_parent_id, 2),
      ('Bread Knives', 'Ножове за хляб', 'bread-knives', v_parent_id, 3),
      ('Steak Knives', 'Ножове за стек', 'steak-knives', v_parent_id, 4),
      ('Knife Sets', 'Комплекти ножове', 'knife-sets', v_parent_id, 5),
      ('Knife Blocks', 'Поставки за ножове', 'knife-blocks', v_parent_id, 6),
      ('Knife Sharpeners', 'Точила за ножове', 'knife-sharpeners', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kitchen Utensils deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kitchen-utensils';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Spatulas', 'Шпатули', 'spatulas', v_parent_id, 1),
      ('Ladles', 'Черпаци', 'ladles', v_parent_id, 2),
      ('Whisks', 'Телени бъркалки', 'whisks', v_parent_id, 3),
      ('Tongs', 'Щипки', 'tongs', v_parent_id, 4),
      ('Peelers', 'Белачки', 'peelers', v_parent_id, 5),
      ('Can Openers', 'Отварачки за консерви', 'can-openers', v_parent_id, 6),
      ('Graters', 'Ренде', 'graters', v_parent_id, 7),
      ('Colanders', 'Гевгири', 'colanders', v_parent_id, 8),
      ('Measuring Cups', 'Мерителни чаши', 'measuring-cups', v_parent_id, 9),
      ('Cutting Boards', 'Дъски за рязане', 'cutting-boards', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Food Storage deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'food-storage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Food Containers', 'Контейнери за храна', 'food-containers', v_parent_id, 1),
      ('Glass Containers', 'Стъклени контейнери', 'glass-containers', v_parent_id, 2),
      ('Plastic Containers', 'Пластмасови контейнери', 'plastic-containers', v_parent_id, 3),
      ('Lunch Boxes', 'Кутии за обяд', 'lunch-boxes', v_parent_id, 4),
      ('Vacuum Sealers', 'Вакуумни уреди', 'vacuum-sealers', v_parent_id, 5),
      ('Food Wrap', 'Фолио за храна', 'food-wrap', v_parent_id, 6),
      ('Zip Bags', 'Торбички с цип', 'zip-bags', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Drinkware deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'drinkware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Coffee Mugs', 'Чаши за кафе', 'coffee-mugs', v_parent_id, 1),
      ('Water Glasses', 'Чаши за вода', 'water-glasses', v_parent_id, 2),
      ('Wine Glasses', 'Чаши за вино', 'wine-glasses', v_parent_id, 3),
      ('Beer Glasses', 'Чаши за бира', 'beer-glasses', v_parent_id, 4),
      ('Travel Mugs', 'Термо чаши', 'travel-mugs', v_parent_id, 5),
      ('Water Bottles Kitchen', 'Бутилки за вода', 'water-bottles-kitchen', v_parent_id, 6),
      ('Tumblers', 'Тъмблъри', 'tumblers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Dinnerware deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dinnerware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dinner Plates', 'Чинии за основно', 'dinner-plates', v_parent_id, 1),
      ('Salad Plates', 'Чинии за салата', 'salad-plates', v_parent_id, 2),
      ('Bowls', 'Купи', 'bowls', v_parent_id, 3),
      ('Dinnerware Sets', 'Сервизи', 'dinnerware-sets', v_parent_id, 4),
      ('Serving Platters', 'Подноси за сервиране', 'serving-platters', v_parent_id, 5),
      ('Serving Bowls', 'Купи за сервиране', 'serving-bowls', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
