
-- Batch 34: Even more deep categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Doors & Windows
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'doors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Interior Doors', 'Интериорни врати', 'interior-doors', v_parent_id, 1),
      ('Exterior Doors', 'Входни врати', 'exterior-doors', v_parent_id, 2),
      ('Screen Doors', 'Комарници врати', 'screen-doors', v_parent_id, 3),
      ('Door Hardware', 'Обков за врати', 'door-hardware', v_parent_id, 4),
      ('Garage Doors', 'Гаражни врати', 'garage-doors', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'windows';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Replacement Windows', 'Заместващи прозорци', 'replacement-windows', v_parent_id, 1),
      ('Skylights', 'Покривни прозорци', 'skylights', v_parent_id, 2),
      ('Window Film', 'Фолио за прозорци', 'window-film', v_parent_id, 3),
      ('Window Screens', 'Комарници', 'window-screens', v_parent_id, 4),
      ('Window Hardware', 'Обков за прозорци', 'window-hardware', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Safety & Security
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'home-safety';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Smoke Detectors', 'Детектори за дим', 'smoke-detectors', v_parent_id, 1),
      ('Carbon Monoxide Detectors', 'Детектори за въглероден оксид', 'carbon-monoxide-detectors', v_parent_id, 2),
      ('Fire Extinguishers', 'Пожарогасители', 'fire-extinguishers', v_parent_id, 3),
      ('Safes', 'Сейфове', 'safes', v_parent_id, 4),
      ('Emergency Kits', 'Аварийни комплекти', 'emergency-kits', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Wine & Spirits
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'alcoholic-beverages';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Red Wine', 'Червено вино', 'red-wine', v_parent_id, 1),
      ('White Wine', 'Бяло вино', 'white-wine', v_parent_id, 2),
      ('Rose Wine', 'Розе вино', 'rose-wine', v_parent_id, 3),
      ('Champagne & Sparkling', 'Шампанско и пенливи', 'champagne-sparkling', v_parent_id, 4),
      ('Beer', 'Бира', 'beer', v_parent_id, 5),
      ('Spirits', 'Спиртни напитки', 'spirits', v_parent_id, 6),
      ('Liqueurs', 'Ликьори', 'liqueurs', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Coffee & Tea Accessories
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'coffee';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Coffee Beans', 'Кафе на зърна', 'coffee-beans', v_parent_id, 1),
      ('Ground Coffee', 'Мляно кафе', 'ground-coffee', v_parent_id, 2),
      ('Instant Coffee', 'Инстантно кафе', 'instant-coffee', v_parent_id, 3),
      ('Coffee Pods', 'Кафе капсули', 'coffee-pods', v_parent_id, 4),
      ('Decaf Coffee', 'Безкофеиново кафе', 'decaf-coffee', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tea';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Black Tea', 'Черен чай', 'black-tea', v_parent_id, 1),
      ('Green Tea', 'Зелен чай', 'green-tea', v_parent_id, 2),
      ('Herbal Tea', 'Билков чай', 'herbal-tea', v_parent_id, 3),
      ('Oolong Tea', 'Улонг чай', 'oolong-tea', v_parent_id, 4),
      ('Tea Accessories', 'Аксесоари за чай', 'tea-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Breakfast Foods
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'breakfast-foods';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cereals', 'Зърнени закуски', 'cereals', v_parent_id, 1),
      ('Oatmeal', 'Овесени ядки', 'oatmeal', v_parent_id, 2),
      ('Pancake Mix', 'Микс за палачинки', 'pancake-mix', v_parent_id, 3),
      ('Granola', 'Гранола', 'granola', v_parent_id, 4),
      ('Breakfast Bars', 'Барове за закуска', 'breakfast-bars', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Condiments
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sauces';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Ketchup', 'Кетчуп', 'ketchup', v_parent_id, 1),
      ('Mustard', 'Горчица', 'mustard', v_parent_id, 2),
      ('Mayonnaise', 'Майонеза', 'mayonnaise', v_parent_id, 3),
      ('Hot Sauce', 'Люти сосове', 'hot-sauce', v_parent_id, 4),
      ('BBQ Sauce', 'BBQ сос', 'bbq-sauce', v_parent_id, 5),
      ('Salad Dressings', 'Дресинги', 'salad-dressings', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baking Supplies
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'flour-sugar';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('All-Purpose Flour', 'Универсално брашно', 'all-purpose-flour', v_parent_id, 1),
      ('Bread Flour', 'Брашно за хляб', 'bread-flour', v_parent_id, 2),
      ('Cake Flour', 'Брашно за торти', 'cake-flour', v_parent_id, 3),
      ('White Sugar', 'Бяла захар', 'white-sugar', v_parent_id, 4),
      ('Brown Sugar', 'Кафява захар', 'brown-sugar', v_parent_id, 5),
      ('Powdered Sugar', 'Пудра захар', 'powdered-sugar', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Organic Foods
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'organic-foods';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Organic Produce', 'Биологични плодове и зеленчуци', 'organic-produce-food', v_parent_id, 1),
      ('Organic Dairy', 'Биологични млечни продукти', 'organic-dairy', v_parent_id, 2),
      ('Organic Meat', 'Биологично месо', 'organic-meat', v_parent_id, 3),
      ('Organic Snacks', 'Биологични закуски', 'organic-snacks', v_parent_id, 4),
      ('Organic Pantry', 'Биологични основни продукти', 'organic-pantry', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- International Foods
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'international-foods';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Asian Foods', 'Азиатска храна', 'asian-foods', v_parent_id, 1),
      ('Mexican Foods', 'Мексиканска храна', 'mexican-foods', v_parent_id, 2),
      ('Italian Foods', 'Италианска храна', 'italian-foods', v_parent_id, 3),
      ('Indian Foods', 'Индийска храна', 'indian-foods', v_parent_id, 4),
      ('Middle Eastern Foods', 'Близкоизточна храна', 'middle-eastern-foods', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gluten-Free
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gluten-free';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gluten-Free Bread', 'Безглутенов хляб', 'gluten-free-bread', v_parent_id, 1),
      ('Gluten-Free Pasta', 'Безглутенова паста', 'gluten-free-pasta', v_parent_id, 2),
      ('Gluten-Free Snacks', 'Безглутенови закуски', 'gluten-free-snacks', v_parent_id, 3),
      ('Gluten-Free Flour', 'Безглутеново брашно', 'gluten-free-flour', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- More Camera/Photo
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'filters';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('UV Filters', 'UV филтри', 'uv-filters', v_parent_id, 1),
      ('ND Filters', 'ND филтри', 'nd-filters', v_parent_id, 2),
      ('Polarizing Filters', 'Поляризиращи филтри', 'polarizing-filters', v_parent_id, 3),
      ('Filter Kits', 'Комплекти филтри', 'filter-kits', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'memory-cards';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('SD Cards', 'SD карти', 'sd-cards', v_parent_id, 1),
      ('MicroSD Cards', 'MicroSD карти', 'microsd-cards', v_parent_id, 2),
      ('CFexpress Cards', 'CFexpress карти', 'cfexpress-cards', v_parent_id, 3),
      ('Card Readers', 'Четци за карти', 'card-readers', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
