
-- Batch 38: More deep categories - Toys, Hobbies, Pet Supplies
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Toys deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'building-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('LEGO Sets', 'LEGO комплекти', 'lego-sets', v_parent_id, 1),
      ('Building Blocks', 'Строителни блокове', 'building-blocks', v_parent_id, 2),
      ('Magnetic Tiles', 'Магнитни плочки', 'magnetic-tiles', v_parent_id, 3),
      ('Construction Sets', 'Конструктори', 'construction-sets', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dolls-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fashion Dolls', 'Модни кукли', 'fashion-dolls', v_parent_id, 1),
      ('Baby Dolls', 'Бебешки кукли', 'baby-dolls', v_parent_id, 2),
      ('Dollhouses', 'Къщи за кукли', 'dollhouses', v_parent_id, 3),
      ('Doll Clothes', 'Дрехи за кукли', 'doll-clothes', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'action-figures';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Superhero Figures', 'Фигури на супергерои', 'superhero-figures', v_parent_id, 1),
      ('Anime Figures', 'Аниме фигури', 'anime-figures', v_parent_id, 2),
      ('Movie Figures', 'Филмови фигури', 'movie-figures', v_parent_id, 3),
      ('Video Game Figures', 'Гейминг фигури', 'video-game-figures', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'board-games';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Strategy Games', 'Стратегически игри', 'strategy-games', v_parent_id, 1),
      ('Family Games', 'Семейни игри', 'family-games', v_parent_id, 2),
      ('Party Games', 'Парти игри', 'party-games', v_parent_id, 3),
      ('Card Games', 'Карти игри', 'card-games', v_parent_id, 4),
      ('Cooperative Games', 'Кооперативни игри', 'cooperative-games', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'puzzles';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Jigsaw Puzzles', 'Пъзели', 'jigsaw-puzzles', v_parent_id, 1),
      ('3D Puzzles', '3D пъзели', '3d-puzzles', v_parent_id, 2),
      ('Brain Teasers', 'Главоблъсканици', 'brain-teasers', v_parent_id, 3),
      ('Wooden Puzzles', 'Дървени пъзели', 'wooden-puzzles', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'outdoor-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Swing Sets', 'Люлки', 'swing-sets', v_parent_id, 1),
      ('Trampolines', 'Батути', 'trampolines', v_parent_id, 2),
      ('Water Toys', 'Водни играчки', 'water-toys', v_parent_id, 3),
      ('Sand Toys', 'Играчки за пясък', 'sand-toys', v_parent_id, 4),
      ('Ride-On Toys', 'Коли за каране', 'ride-on-toys', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- RC & Drones deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'rc-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('RC Cars', 'Радиоуправляеми коли', 'rc-cars', v_parent_id, 1),
      ('RC Trucks', 'Радиоуправляеми камиони', 'rc-trucks', v_parent_id, 2),
      ('RC Boats', 'Радиоуправляеми лодки', 'rc-boats', v_parent_id, 3),
      ('RC Helicopters', 'Радиоуправляеми хеликоптери', 'rc-helicopters', v_parent_id, 4),
      ('RC Planes', 'Радиоуправляеми самолети', 'rc-planes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'drones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Camera Drones', 'Дронове с камера', 'camera-drones', v_parent_id, 1),
      ('Racing Drones', 'Състезателни дронове', 'racing-drones', v_parent_id, 2),
      ('Mini Drones', 'Мини дронове', 'mini-drones', v_parent_id, 3),
      ('Professional Drones', 'Професионални дронове', 'professional-drones', v_parent_id, 4),
      ('Drone Accessories', 'Аксесоари за дронове', 'drone-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pet Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dog-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dog Food', 'Храна за кучета', 'dog-food', v_parent_id, 1),
      ('Dog Treats', 'Лакомства за кучета', 'dog-treats', v_parent_id, 2),
      ('Dog Toys', 'Играчки за кучета', 'dog-toys', v_parent_id, 3),
      ('Dog Beds', 'Легла за кучета', 'dog-beds', v_parent_id, 4),
      ('Dog Collars & Leashes', 'Нашийници и каишки', 'dog-collars-leashes', v_parent_id, 5),
      ('Dog Grooming', 'Грижа за кучета', 'dog-grooming', v_parent_id, 6),
      ('Dog Crates', 'Клетки за кучета', 'dog-crates', v_parent_id, 7),
      ('Dog Clothes', 'Дрехи за кучета', 'dog-clothes', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cat-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cat Food', 'Храна за котки', 'cat-food', v_parent_id, 1),
      ('Cat Treats', 'Лакомства за котки', 'cat-treats', v_parent_id, 2),
      ('Cat Toys', 'Играчки за котки', 'cat-toys', v_parent_id, 3),
      ('Cat Beds', 'Легла за котки', 'cat-beds', v_parent_id, 4),
      ('Cat Litter', 'Котешка тоалетна', 'cat-litter', v_parent_id, 5),
      ('Cat Scratchers', 'Драскалки за котки', 'cat-scratchers', v_parent_id, 6),
      ('Cat Trees', 'Катерушки за котки', 'cat-trees', v_parent_id, 7),
      ('Cat Carriers', 'Транспортни чанти за котки', 'cat-carriers', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fish-aquarium';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fish Tanks', 'Аквариуми', 'fish-tanks', v_parent_id, 1),
      ('Fish Food', 'Храна за риби', 'fish-food', v_parent_id, 2),
      ('Filters', 'Филтри', 'aquarium-filters', v_parent_id, 3),
      ('Heaters', 'Нагреватели', 'aquarium-heaters', v_parent_id, 4),
      ('Decorations', 'Декорации', 'aquarium-decorations', v_parent_id, 5),
      ('Lighting', 'Осветление', 'aquarium-lighting', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bird-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bird Cages', 'Клетки за птици', 'bird-cages', v_parent_id, 1),
      ('Bird Food', 'Храна за птици', 'bird-food', v_parent_id, 2),
      ('Bird Toys', 'Играчки за птици', 'bird-toys', v_parent_id, 3),
      ('Bird Perches', 'Кацалки за птици', 'bird-perches', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'small-animal-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hamster Supplies', 'Консумативи за хамстери', 'hamster-supplies', v_parent_id, 1),
      ('Rabbit Supplies', 'Консумативи за зайци', 'rabbit-supplies', v_parent_id, 2),
      ('Guinea Pig Supplies', 'Консумативи за морски свинчета', 'guinea-pig-supplies', v_parent_id, 3),
      ('Small Animal Cages', 'Клетки за малки животни', 'small-animal-cages', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Art & Craft deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'painting-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Acrylic Paints', 'Акрилни бои', 'acrylic-paints', v_parent_id, 1),
      ('Oil Paints', 'Маслени бои', 'oil-paints', v_parent_id, 2),
      ('Watercolors', 'Акварели', 'watercolors', v_parent_id, 3),
      ('Paint Brushes', 'Четки за рисуване', 'paint-brushes', v_parent_id, 4),
      ('Canvases', 'Платна', 'canvases', v_parent_id, 5),
      ('Easels', 'Статив за рисуване', 'easels', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'drawing-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pencils', 'Моливи', 'drawing-pencils', v_parent_id, 1),
      ('Colored Pencils', 'Цветни моливи', 'colored-pencils', v_parent_id, 2),
      ('Markers', 'Маркери', 'markers', v_parent_id, 3),
      ('Pastels', 'Пастели', 'pastels', v_parent_id, 4),
      ('Charcoal', 'Въглени', 'charcoal', v_parent_id, 5),
      ('Sketchbooks', 'Скицници', 'sketchbooks', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
