
-- Batch 78: Final push to exceed 7100
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- RC Vehicles deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'rc-vehicles';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('RC Cars', 'RC коли', 'rc-cars', v_parent_id, 1),
      ('RC Trucks', 'RC камиони', 'rc-trucks', v_parent_id, 2),
      ('RC Planes', 'RC самолети', 'rc-planes', v_parent_id, 3),
      ('RC Helicopters', 'RC хеликоптери', 'rc-helicopters', v_parent_id, 4),
      ('RC Boats', 'RC лодки', 'rc-boats', v_parent_id, 5),
      ('RC Parts', 'RC части', 'rc-parts', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Slot Cars deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'slot-cars';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Slot Car Sets', 'Комплекти пистови колички', 'slot-car-sets', v_parent_id, 1),
      ('Slot Car Tracks', 'Писти за колички', 'slot-car-tracks', v_parent_id, 2),
      ('Slot Cars Vehicles', 'Пистови колички', 'slot-cars-vehicles', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Train Sets deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'train-sets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Model Trains', 'Моделни влакове', 'model-trains', v_parent_id, 1),
      ('Train Tracks', 'Релси за влакове', 'train-tracks', v_parent_id, 2),
      ('Train Accessories', 'Аксесоари за влакове', 'train-accessories', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Science Kits deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'science-kits';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Chemistry Sets', 'Комплекти по химия', 'chemistry-sets', v_parent_id, 1),
      ('Biology Kits', 'Комплекти по биология', 'biology-kits', v_parent_id, 2),
      ('Physics Kits', 'Комплекти по физика', 'physics-kits', v_parent_id, 3),
      ('Astronomy Kits', 'Комплекти по астрономия', 'astronomy-kits', v_parent_id, 4),
      ('Microscopes', 'Микроскопи', 'microscopes', v_parent_id, 5),
      ('Telescopes Kids', 'Телескопи за деца', 'telescopes-kids', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Craft Kits deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'craft-kits';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Painting Kits', 'Комплекти за рисуване', 'painting-kits', v_parent_id, 1),
      ('Jewelry Kits', 'Комплекти за бижута', 'jewelry-kits', v_parent_id, 2),
      ('Sewing Kits', 'Комплекти за шиене', 'sewing-kits', v_parent_id, 3),
      ('Pottery Kits', 'Комплекти за грънчарство', 'pottery-kits', v_parent_id, 4),
      ('Origami Kits', 'Комплекти за оригами', 'origami-kits', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Dolls deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dolls';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fashion Dolls', 'Модни кукли', 'fashion-dolls', v_parent_id, 1),
      ('Baby Dolls', 'Бебешки кукли', 'baby-dolls', v_parent_id, 2),
      ('Collector Dolls', 'Колекционерски кукли', 'collector-dolls', v_parent_id, 3),
      ('Doll Houses', 'Куклени къщи', 'doll-houses', v_parent_id, 4),
      ('Doll Accessories', 'Аксесоари за кукли', 'doll-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Stuffed Animals deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'stuffed-animals';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Teddy Bears', 'Мечета', 'teddy-bears', v_parent_id, 1),
      ('Plush Dogs', 'Плюшени кучета', 'plush-dogs', v_parent_id, 2),
      ('Plush Cats', 'Плюшени котки', 'plush-cats', v_parent_id, 3),
      ('Zoo Animals', 'Зоологически животни', 'zoo-animals', v_parent_id, 4),
      ('Giant Stuffed Animals', 'Гигантски плюшени', 'giant-stuffed-animals', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Action Figures deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'action-figures';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Superhero Figures', 'Фигурки супергерои', 'superhero-figures', v_parent_id, 1),
      ('Movie Figures', 'Фигурки от филми', 'movie-figures', v_parent_id, 2),
      ('Anime Figures', 'Аниме фигурки', 'anime-figures', v_parent_id, 3),
      ('Video Game Figures', 'Фигурки от игри', 'video-game-figures', v_parent_id, 4),
      ('Military Figures', 'Военни фигурки', 'military-figures', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Building Blocks deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'building-blocks';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('LEGO Sets', 'ЛЕГО комплекти', 'lego-sets', v_parent_id, 1),
      ('Building Bricks', 'Строителни тухлички', 'building-bricks', v_parent_id, 2),
      ('Magnetic Tiles', 'Магнитни плочки', 'magnetic-tiles', v_parent_id, 3),
      ('Wooden Blocks', 'Дървени блокчета', 'wooden-blocks', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Educational Toys deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'educational-toys';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Learning Tablets', 'Образователни таблети', 'learning-tablets', v_parent_id, 1),
      ('Math Toys', 'Математически играчки', 'math-toys', v_parent_id, 2),
      ('Reading Toys', 'Играчки за четене', 'reading-toys', v_parent_id, 3),
      ('STEM Toys', 'STEM играчки', 'stem-toys', v_parent_id, 4),
      ('Coding Toys', 'Играчки за програмиране', 'coding-toys', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
