
-- Batch 57: Additional subcategories for completeness
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Refrigerators deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'refrigerators';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('French Door Refrigerators', 'Хладилници с френски врати', 'french-door-refrigerators', v_parent_id, 1),
      ('Side-by-Side Refrigerators', 'Хладилници side-by-side', 'side-by-side-refrigerators', v_parent_id, 2),
      ('Top Freezer Refrigerators', 'Хладилници с горен фризер', 'top-freezer-refrigerators', v_parent_id, 3),
      ('Bottom Freezer Refrigerators', 'Хладилници с долен фризер', 'bottom-freezer-refrigerators', v_parent_id, 4),
      ('Mini Fridges', 'Мини хладилници', 'mini-fridges', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Ovens deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'ovens-ranges';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gas Ranges', 'Газови печки', 'gas-ranges', v_parent_id, 1),
      ('Electric Ranges', 'Електрически печки', 'electric-ranges', v_parent_id, 2),
      ('Induction Ranges', 'Индукционни печки', 'induction-ranges', v_parent_id, 3),
      ('Wall Ovens', 'Вградени фурни', 'wall-ovens', v_parent_id, 4),
      ('Cooktops', 'Котлони', 'cooktops', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Robot Vacuums deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'robot-vacuums';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Robot Vacuum Mops', 'Роботи прахосмукачки с моп', 'robot-vacuum-mops', v_parent_id, 1),
      ('Self-Emptying Robot Vacuums', 'Самоизпразващи се роботи', 'self-emptying-robot-vacuums', v_parent_id, 2),
      ('Budget Robot Vacuums', 'Бюджетни роботи', 'budget-robot-vacuums', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- More Home Organization deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'home-organization';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baskets & Bins', 'Кошници', 'baskets-bins', v_parent_id, 1),
      ('Shelving Units', 'Рафтови системи', 'shelving-units', v_parent_id, 2),
      ('Storage Containers', 'Контейнери за съхранение', 'storage-containers', v_parent_id, 3),
      ('Label Makers', 'Етикетни принтери', 'label-makers', v_parent_id, 4),
      ('Hooks & Racks', 'Куки и закачалки', 'hooks-racks', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pest Control deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pest-control';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Insect Repellents', 'Репеленти за насекоми', 'insect-repellents', v_parent_id, 1),
      ('Mouse Traps', 'Капани за мишки', 'mouse-traps', v_parent_id, 2),
      ('Bug Zappers', 'Електрически уреди за насекоми', 'bug-zappers', v_parent_id, 3),
      ('Pest Control Sprays', 'Спрейове за вредители', 'pest-control-sprays', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gift Wrapping deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gift-wrapping';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wrapping Paper', 'Опаковъчна хартия', 'wrapping-paper', v_parent_id, 1),
      ('Gift Bags', 'Подаръчни торби', 'gift-bags', v_parent_id, 2),
      ('Gift Boxes', 'Подаръчни кутии', 'gift-boxes', v_parent_id, 3),
      ('Ribbons & Bows', 'Панделки и панделки', 'ribbons-bows', v_parent_id, 4),
      ('Tissue Paper', 'Копринена хартия', 'tissue-paper', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Educational Toys deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'educational-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('STEM Toys', 'STEM играчки', 'stem-toys', v_parent_id, 1),
      ('Learning Games', 'Образователни игри', 'learning-games', v_parent_id, 2),
      ('Science Kits', 'Научни комплекти', 'science-kits', v_parent_id, 3),
      ('Coding Toys', 'Играчки за програмиране', 'coding-toys', v_parent_id, 4),
      ('Math Toys', 'Математически играчки', 'math-toys', v_parent_id, 5),
      ('Reading Toys', 'Играчки за четене', 'reading-toys', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Stuffed Animals deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'stuffed-animals';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Teddy Bears', 'Плюшени мечета', 'teddy-bears', v_parent_id, 1),
      ('Character Plush', 'Плюшени герои', 'character-plush', v_parent_id, 2),
      ('Giant Stuffed Animals', 'Големи плюшени играчки', 'giant-stuffed-animals', v_parent_id, 3),
      ('Interactive Plush', 'Интерактивни плюшени', 'interactive-plush', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Toy Vehicles deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'toy-vehicles';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Die-Cast Vehicles', 'Метални превозни средства', 'die-cast-vehicles', v_parent_id, 1),
      ('Toy Trains', 'Играчки влакчета', 'toy-trains', v_parent_id, 2),
      ('Toy Trucks', 'Играчки камиони', 'toy-trucks', v_parent_id, 3),
      ('Toy Cars', 'Играчки коли', 'toy-cars', v_parent_id, 4),
      ('Play Sets Vehicles', 'Комплекти с превозни средства', 'play-sets-vehicles', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pretend Play deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pretend-play';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Play Kitchens', 'Детски кухни', 'play-kitchens', v_parent_id, 1),
      ('Dress Up', 'Костюми', 'dress-up', v_parent_id, 2),
      ('Play Food', 'Играчки храна', 'play-food', v_parent_id, 3),
      ('Tool Sets Play', 'Комплекти инструменти', 'tool-sets-play', v_parent_id, 4),
      ('Doctor Kits', 'Докторски комплекти', 'doctor-kits', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Party Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'party-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Balloons', 'Балони', 'balloons', v_parent_id, 1),
      ('Party Decorations', 'Парти декорация', 'party-decorations', v_parent_id, 2),
      ('Party Tableware', 'Парти посуда', 'party-tableware', v_parent_id, 3),
      ('Party Favors', 'Парти подаръци', 'party-favors', v_parent_id, 4),
      ('Banners', 'Банери', 'banners', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
