
-- Batch 79: More toy and hobby categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Puzzles deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'puzzles';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Jigsaw Puzzles', 'Пъзели', 'jigsaw-puzzles', v_parent_id, 1),
      ('3D Puzzles', '3D пъзели', '3d-puzzles', v_parent_id, 2),
      ('Brain Teasers', 'Главоблъсканици', 'brain-teasers', v_parent_id, 3),
      ('Wooden Puzzles', 'Дървени пъзели', 'wooden-puzzles', v_parent_id, 4),
      ('Kids Puzzles', 'Детски пъзели', 'kids-puzzles', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Board Games deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'board-games';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Strategy Board Games', 'Стратегически игри', 'strategy-board-games', v_parent_id, 1),
      ('Family Board Games', 'Семейни игри', 'family-board-games', v_parent_id, 2),
      ('Party Board Games', 'Игри за партита', 'party-board-games', v_parent_id, 3),
      ('Card Games', 'Карти игри', 'card-games', v_parent_id, 4),
      ('Trivia Games', 'Тривия игри', 'trivia-games', v_parent_id, 5),
      ('Kids Board Games', 'Детски настолни игри', 'kids-board-games', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Outdoor Play deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'outdoor-play';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Swing Sets', 'Люлки комплекти', 'swing-sets', v_parent_id, 1),
      ('Slides', 'Пързалки', 'slides', v_parent_id, 2),
      ('Trampolines', 'Батути', 'trampolines', v_parent_id, 3),
      ('Playhouses', 'Детски къщички', 'playhouses', v_parent_id, 4),
      ('Sandboxes', 'Пясъчници', 'sandboxes', v_parent_id, 5),
      ('Climbing Equipment', 'Катерушки', 'climbing-equipment', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Ride-On Toys deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'ride-on-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Electric Ride-Ons', 'Електрически коли', 'electric-ride-ons', v_parent_id, 1),
      ('Push Ride-Ons', 'Бутащи се коли', 'push-ride-ons', v_parent_id, 2),
      ('Tricycles', 'Триколки', 'tricycles', v_parent_id, 3),
      ('Balance Bikes', 'Балансни колела', 'balance-bikes', v_parent_id, 4),
      ('Scooters', 'Тротинетки', 'scooters', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pretend Play deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pretend-play';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Play Kitchens', 'Детски кухни', 'play-kitchens', v_parent_id, 1),
      ('Play Food', 'Играчки храна', 'play-food', v_parent_id, 2),
      ('Dress Up Costumes', 'Костюми', 'dress-up-costumes', v_parent_id, 3),
      ('Play Tools', 'Играчки инструменти', 'play-tools', v_parent_id, 4),
      ('Doctor Kits', 'Докторски комплекти', 'doctor-kits', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baby Toys deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baby-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Rattles', 'Дрънкалки', 'rattles', v_parent_id, 1),
      ('Teethers', 'Гризалки', 'teethers', v_parent_id, 2),
      ('Activity Centers', 'Активни центрове', 'activity-centers', v_parent_id, 3),
      ('Play Mats', 'Детски килимчета', 'play-mats', v_parent_id, 4),
      ('Stacking Toys', 'Кули за редене', 'stacking-toys', v_parent_id, 5),
      ('Mobiles', 'Мобили', 'mobiles', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Remote Control deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'remote-control';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('RC Dinosaurs', 'RC динозаври', 'rc-dinosaurs', v_parent_id, 1),
      ('RC Robots', 'RC роботи', 'rc-robots', v_parent_id, 2),
      ('RC Animals', 'RC животни', 'rc-animals', v_parent_id, 3),
      ('RC Construction', 'RC строителна техника', 'rc-construction', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Music Toys deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'music-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Toy Pianos', 'Детски пиана', 'toy-pianos', v_parent_id, 1),
      ('Toy Guitars', 'Детски китари', 'toy-guitars', v_parent_id, 2),
      ('Toy Drums', 'Детски барабани', 'toy-drums', v_parent_id, 3),
      ('Karaoke Machines', 'Караоке машини', 'karaoke-machines', v_parent_id, 4),
      ('Musical Instruments Toys', 'Музикални играчки', 'musical-instruments-toys', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sports Toys deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sports-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Kids Basketball', 'Детски баскетбол', 'kids-basketball', v_parent_id, 1),
      ('Kids Soccer', 'Детски футбол', 'kids-soccer', v_parent_id, 2),
      ('Kids Baseball', 'Детски бейзбол', 'kids-baseball', v_parent_id, 3),
      ('Kids Golf', 'Детски голф', 'kids-golf', v_parent_id, 4),
      ('Kids Tennis', 'Детски тенис', 'kids-tennis', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Electronic Toys deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'electronic-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Handheld Games', 'Ръчни игри', 'handheld-games', v_parent_id, 1),
      ('Electronic Pets', 'Електронни любимци', 'electronic-pets', v_parent_id, 2),
      ('Interactive Toys', 'Интерактивни играчки', 'interactive-toys', v_parent_id, 3),
      ('Walkie Talkies', 'Уоки-токи', 'walkie-talkies', v_parent_id, 4),
      ('Kids Cameras', 'Детски камери', 'kids-cameras', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
