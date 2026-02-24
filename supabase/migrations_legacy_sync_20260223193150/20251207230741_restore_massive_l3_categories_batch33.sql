
-- Batch 33: More deep categories from various sections
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Humidifiers & Dehumidifiers
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'humidifiers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cool Mist Humidifiers', 'Студена мъгла овлажнители', 'cool-mist-humidifiers', v_parent_id, 1),
      ('Warm Mist Humidifiers', 'Топла мъгла овлажнители', 'warm-mist-humidifiers', v_parent_id, 2),
      ('Ultrasonic Humidifiers', 'Ултразвукови овлажнители', 'ultrasonic-humidifiers', v_parent_id, 3),
      ('Dehumidifiers', 'Изсушители', 'dehumidifiers', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sewing & Knitting
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sewing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sewing Machines', 'Шевни машини', 'sewing-machines', v_parent_id, 1),
      ('Sewing Notions', 'Шивашки принадлежности', 'sewing-notions', v_parent_id, 2),
      ('Thread', 'Конци', 'thread', v_parent_id, 3),
      ('Needles & Pins', 'Игли и карфици', 'needles-pins', v_parent_id, 4),
      ('Scissors', 'Ножици', 'sewing-scissors', v_parent_id, 5),
      ('Patterns', 'Кройки', 'sewing-patterns', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Party & Celebrations
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'party-supplies-hobbies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Balloons', 'Балони', 'balloons', v_parent_id, 1),
      ('Party Decorations', 'Парти декорации', 'party-decorations', v_parent_id, 2),
      ('Tableware', 'Съдове за маса', 'party-tableware', v_parent_id, 3),
      ('Party Favors', 'Парти подаръци', 'party-favors', v_parent_id, 4),
      ('Invitations', 'Покани', 'invitations', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Seasonal Decor
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'seasonal-decor';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Christmas Decor', 'Коледни декорации', 'christmas-decor', v_parent_id, 1),
      ('Halloween Decor', 'Хелоуин декорации', 'halloween-decor', v_parent_id, 2),
      ('Easter Decor', 'Великденски декорации', 'easter-decor', v_parent_id, 3),
      ('Spring Decor', 'Пролетни декорации', 'spring-decor', v_parent_id, 4),
      ('Fall Decor', 'Есенни декорации', 'fall-decor', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gift Cards
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gift-cards';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Restaurant Gift Cards', 'Карти за ресторанти', 'restaurant-gift-cards', v_parent_id, 1),
      ('Retail Gift Cards', 'Карти за магазини', 'retail-gift-cards', v_parent_id, 2),
      ('Entertainment Gift Cards', 'Карти за развлечения', 'entertainment-gift-cards', v_parent_id, 3),
      ('Gaming Gift Cards', 'Карти за игри', 'gaming-gift-cards', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baby Clothing
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-clothing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baby Bodysuits', 'Бебешки бодита', 'baby-bodysuits', v_parent_id, 1),
      ('Baby Sleepwear', 'Бебешко нощно облекло', 'baby-sleepwear', v_parent_id, 2),
      ('Baby Outerwear', 'Бебешки горни дрехи', 'baby-outerwear', v_parent_id, 3),
      ('Baby Sets', 'Бебешки комплекти', 'baby-sets', v_parent_id, 4),
      ('Baby Accessories', 'Бебешки аксесоари', 'baby-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baby Gear
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-gear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baby Carriers', 'Носилки за бебета', 'baby-carriers', v_parent_id, 1),
      ('Baby Swings', 'Бебешки люлки', 'baby-swings', v_parent_id, 2),
      ('Baby Bouncers', 'Бебешки шезлонги', 'baby-bouncers', v_parent_id, 3),
      ('Baby Walkers', 'Проходилки', 'baby-walkers', v_parent_id, 4),
      ('Play Yards', 'Бебешки кошари', 'play-yards', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kids Toys by Age
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-toddler-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Teethers', 'Гризалки', 'teethers', v_parent_id, 1),
      ('Rattles', 'Дрънкалки', 'rattles', v_parent_id, 2),
      ('Stacking Toys', 'Играчки за подреждане', 'stacking-toys', v_parent_id, 3),
      ('Push Toys', 'Играчки за бутане', 'push-toys', v_parent_id, 4),
      ('Shape Sorters', 'Сортери за форми', 'shape-sorters', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Board Games by Type
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'board-games';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Strategy Games', 'Стратегически игри', 'strategy-games', v_parent_id, 1),
      ('Family Games', 'Семейни игри', 'family-games', v_parent_id, 2),
      ('Party Games', 'Парти игри', 'party-games', v_parent_id, 3),
      ('Classic Games', 'Класически игри', 'classic-games', v_parent_id, 4),
      ('Card Games', 'Карти игри', 'card-games', v_parent_id, 5),
      ('Cooperative Games', 'Кооперативни игри', 'cooperative-games', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Arts by Type
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fine-art';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Paintings', 'Картини', 'paintings', v_parent_id, 1),
      ('Prints', 'Принтове', 'prints', v_parent_id, 2),
      ('Drawings', 'Рисунки', 'drawings', v_parent_id, 3),
      ('Sculptures', 'Скулптури', 'sculptures', v_parent_id, 4),
      ('Photography Art', 'Фотографско изкуство', 'photography-art', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- More Office
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-electronics';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Calculators', 'Калкулатори', 'calculators', v_parent_id, 1),
      ('Label Makers', 'Принтери за етикети', 'label-makers', v_parent_id, 2),
      ('Laminators', 'Ламинатори', 'laminators', v_parent_id, 3),
      ('Shredders', 'Шредери', 'shredders', v_parent_id, 4),
      ('Projectors', 'Презентационни проектори', 'office-projectors', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mailing-shipping';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Shipping Boxes', 'Кутии за изпращане', 'shipping-boxes', v_parent_id, 1),
      ('Packing Tape', 'Тиксо за опаковане', 'packing-tape', v_parent_id, 2),
      ('Bubble Wrap', 'Фолио мехурче', 'bubble-wrap', v_parent_id, 3),
      ('Postal Scales', 'Пощенски кантари', 'postal-scales', v_parent_id, 4),
      ('Mailers', 'Пликове за пратки', 'mailers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Construction Materials
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'building-materials';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Lumber', 'Дървен материал', 'lumber', v_parent_id, 1),
      ('Drywall', 'Гипсокартон', 'drywall', v_parent_id, 2),
      ('Insulation', 'Изолация', 'insulation', v_parent_id, 3),
      ('Cement & Concrete', 'Цимент и бетон', 'cement-concrete', v_parent_id, 4),
      ('Roofing', 'Покривни материали', 'roofing', v_parent_id, 5),
      ('Flooring', 'Подови настилки', 'flooring', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hardware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Screws', 'Винтове', 'screws', v_parent_id, 1),
      ('Nails', 'Пирони', 'nails', v_parent_id, 2),
      ('Bolts & Nuts', 'Болтове и гайки', 'bolts-nuts', v_parent_id, 3),
      ('Anchors', 'Дюбели', 'anchors', v_parent_id, 4),
      ('Hooks & Hangers', 'Куки и закачалки', 'hooks-hangers', v_parent_id, 5),
      ('Hinges', 'Панти', 'hinges', v_parent_id, 6),
      ('Locks', 'Брави', 'locks', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'paint';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Interior Paint', 'Интериорна боя', 'interior-paint', v_parent_id, 1),
      ('Exterior Paint', 'Екстериорна боя', 'exterior-paint', v_parent_id, 2),
      ('Primer', 'Грунд', 'paint-primer', v_parent_id, 3),
      ('Paint Brushes', 'Четки за боя', 'wall-paint-brushes', v_parent_id, 4),
      ('Paint Rollers', 'Валяци', 'paint-rollers', v_parent_id, 5),
      ('Spray Paint', 'Спрей боя', 'spray-paint', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
