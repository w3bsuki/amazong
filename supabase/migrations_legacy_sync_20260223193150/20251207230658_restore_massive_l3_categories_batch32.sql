
-- Batch 32: Additional deep L3 categories from various sections
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- More Musical Instruments
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'music-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Guitar Strings', 'Китарни струни', 'guitar-strings', v_parent_id, 1),
      ('Guitar Picks', 'Медиатори', 'guitar-picks', v_parent_id, 2),
      ('Guitar Straps', 'Китарни каишки', 'guitar-straps', v_parent_id, 3),
      ('Guitar Cables', 'Китарни кабели', 'guitar-cables', v_parent_id, 4),
      ('Guitar Capos', 'Каподастри', 'guitar-capos', v_parent_id, 5),
      ('Guitar Tuners', 'Китарни тунери', 'guitar-tuners', v_parent_id, 6),
      ('Guitar Cases', 'Калъфи за китари', 'guitar-cases', v_parent_id, 7),
      ('Music Stands', 'Пюпитри', 'music-stands', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- More Pet Categories
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'reptile-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Terrariums', 'Терариуми', 'terrariums', v_parent_id, 1),
      ('Reptile Food', 'Храна за влечуги', 'reptile-food', v_parent_id, 2),
      ('Reptile Heating', 'Отопление за влечуги', 'reptile-heating', v_parent_id, 3),
      ('Reptile Lighting', 'Осветление за влечуги', 'reptile-lighting', v_parent_id, 4),
      ('Reptile Decor', 'Декорации за терариум', 'reptile-decor', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'small-animal-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hamster Cages', 'Клетки за хамстери', 'hamster-cages', v_parent_id, 1),
      ('Rabbit Supplies', 'Аксесоари за зайци', 'rabbit-supplies', v_parent_id, 2),
      ('Guinea Pig Supplies', 'Аксесоари за морски свинчета', 'guinea-pig-supplies', v_parent_id, 3),
      ('Small Animal Food', 'Храна за малки животни', 'small-animal-food', v_parent_id, 4),
      ('Small Animal Bedding', 'Постелка за малки животни', 'small-animal-bedding', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- More Home & Garden
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bbq-grilling';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gas Grills', 'Газови грилове', 'gas-grills', v_parent_id, 1),
      ('Charcoal Grills', 'Грилове на въглища', 'charcoal-grills', v_parent_id, 2),
      ('Electric Grills', 'Електрически грилове', 'electric-grills', v_parent_id, 3),
      ('Smokers', 'Уреди за опушване', 'smokers', v_parent_id, 4),
      ('Grill Accessories', 'Аксесоари за грил', 'grill-accessories', v_parent_id, 5),
      ('Outdoor Cooking', 'Готвене на открито', 'outdoor-cooking', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pool-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pool Chemicals', 'Химия за басейни', 'pool-chemicals', v_parent_id, 1),
      ('Pool Filters', 'Филтри за басейни', 'pool-filters', v_parent_id, 2),
      ('Pool Cleaners', 'Почистващи за басейни', 'pool-cleaners', v_parent_id, 3),
      ('Pool Toys', 'Играчки за басейн', 'pool-toys', v_parent_id, 4),
      ('Pool Floats', 'Надуваеми за басейн', 'pool-floats', v_parent_id, 5),
      ('Pool Covers', 'Покривала за басейни', 'pool-covers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'irrigation';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sprinklers', 'Пръскачки', 'sprinklers', v_parent_id, 1),
      ('Drip Irrigation', 'Капково напояване', 'drip-irrigation', v_parent_id, 2),
      ('Hose Reels', 'Макари за маркучи', 'hose-reels', v_parent_id, 3),
      ('Timers', 'Таймери за напояване', 'irrigation-timers', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bedding L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bedding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sheets', 'Чаршафи', 'sheets', v_parent_id, 1),
      ('Comforters', 'Завивки', 'comforters', v_parent_id, 2),
      ('Duvet Covers', 'Калъфки за завивки', 'duvet-covers', v_parent_id, 3),
      ('Pillows', 'Възглавници', 'pillows', v_parent_id, 4),
      ('Pillow Cases', 'Калъфки за възглавници', 'pillow-cases', v_parent_id, 5),
      ('Blankets', 'Одеяла', 'blankets', v_parent_id, 6),
      ('Mattress Toppers', 'Подложки за матраци', 'mattress-toppers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Towels L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'towels';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bath Towels', 'Хавлии за баня', 'bath-towels', v_parent_id, 1),
      ('Hand Towels', 'Хавлии за ръце', 'hand-towels', v_parent_id, 2),
      ('Beach Towels', 'Плажни хавлии', 'beach-towels', v_parent_id, 3),
      ('Kitchen Towels', 'Кухненски кърпи', 'kitchen-towels', v_parent_id, 4),
      ('Towel Sets', 'Комплекти хавлии', 'towel-sets', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- More Fashion
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'swimwear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Womens Bikinis', 'Дамски бикини', 'womens-bikinis', v_parent_id, 1),
      ('Womens One-Piece', 'Дамски цели бански', 'womens-one-piece', v_parent_id, 2),
      ('Mens Swim Trunks', 'Мъжки бански', 'mens-swim-trunks', v_parent_id, 3),
      ('Kids Swimwear', 'Детски бански', 'kids-swimwear', v_parent_id, 4),
      ('Cover-Ups', 'Плажни прикрития', 'cover-ups', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'activewear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Athletic Tops', 'Спортни горнища', 'athletic-tops', v_parent_id, 1),
      ('Athletic Pants', 'Спортни панталони', 'athletic-pants', v_parent_id, 2),
      ('Sports Bras', 'Спортни сутиени', 'sports-bras', v_parent_id, 3),
      ('Athletic Shorts', 'Спортни шорти', 'athletic-shorts', v_parent_id, 4),
      ('Athletic Sets', 'Спортни комплекти', 'athletic-sets', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sleepwear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pajama Sets', 'Пижами комплекти', 'pajama-sets', v_parent_id, 1),
      ('Nightgowns', 'Нощници', 'nightgowns', v_parent_id, 2),
      ('Robes', 'Халати', 'robes', v_parent_id, 3),
      ('Sleep Shirts', 'Нощни ризи', 'sleep-shirts', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'underwear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Mens Underwear', 'Мъжко бельо', 'mens-underwear', v_parent_id, 1),
      ('Womens Underwear', 'Дамско бельо', 'womens-underwear', v_parent_id, 2),
      ('Bras', 'Сутиени', 'bras', v_parent_id, 3),
      ('Shapewear', 'Оформящо бельо', 'shapewear', v_parent_id, 4),
      ('Socks', 'Чорапи', 'socks', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- More Travel
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'travel-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Travel Pillows', 'Пътни възглавници', 'travel-pillows', v_parent_id, 1),
      ('Passport Holders', 'Калъфи за паспорти', 'passport-holders', v_parent_id, 2),
      ('Packing Cubes', 'Органайзери за багаж', 'packing-cubes', v_parent_id, 3),
      ('Travel Adapters', 'Пътни адаптери', 'travel-adapters', v_parent_id, 4),
      ('Luggage Tags', 'Етикети за багаж', 'luggage-tags', v_parent_id, 5),
      ('Toiletry Bags', 'Несесери', 'toiletry-bags', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- More Appliances
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'major-appliances';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Refrigerators', 'Хладилници', 'refrigerators', v_parent_id, 1),
      ('Washing Machines', 'Перални', 'washing-machines', v_parent_id, 2),
      ('Dryers', 'Сушилни', 'dryers', v_parent_id, 3),
      ('Dishwashers', 'Съдомиялни', 'dishwashers', v_parent_id, 4),
      ('Ovens', 'Фурни', 'ovens', v_parent_id, 5),
      ('Microwaves', 'Микровълнови', 'microwaves', v_parent_id, 6),
      ('Freezers', 'Фризери', 'freezers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vacuum-cleaners';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Upright Vacuums', 'Вертикални прахосмукачки', 'upright-vacuums', v_parent_id, 1),
      ('Canister Vacuums', 'Прахосмукачки с контейнер', 'canister-vacuums', v_parent_id, 2),
      ('Robot Vacuums', 'Робот прахосмукачки', 'robot-vacuums', v_parent_id, 3),
      ('Stick Vacuums', 'Прахосмукачки пръчка', 'stick-vacuums', v_parent_id, 4),
      ('Handheld Vacuums', 'Ръчни прахосмукачки', 'handheld-vacuums', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'air-purifiers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('HEPA Air Purifiers', 'HEPA пречистватели', 'hepa-air-purifiers', v_parent_id, 1),
      ('Ionic Air Purifiers', 'Йонни пречистватели', 'ionic-air-purifiers', v_parent_id, 2),
      ('UV Air Purifiers', 'UV пречистватели', 'uv-air-purifiers', v_parent_id, 3),
      ('Air Purifier Filters', 'Филтри за пречистватели', 'air-purifier-filters', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
