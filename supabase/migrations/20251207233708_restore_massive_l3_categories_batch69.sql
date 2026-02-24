
-- Batch 69: Sports, Fitness, and Outdoor Recreation deeper
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Exercise Equipment deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'exercise-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Treadmills', 'Бягащи пътеки', 'treadmills', v_parent_id, 1),
      ('Exercise Bikes', 'Велоергометри', 'exercise-bikes', v_parent_id, 2),
      ('Ellipticals', 'Елиптични тренажори', 'ellipticals', v_parent_id, 3),
      ('Rowing Machines', 'Гребни тренажори', 'rowing-machines', v_parent_id, 4),
      ('Weight Benches', 'Лежанки за тежести', 'weight-benches', v_parent_id, 5),
      ('Dumbbells', 'Дъмбели', 'dumbbells', v_parent_id, 6),
      ('Kettlebells', 'Гири', 'kettlebells', v_parent_id, 7),
      ('Resistance Bands', 'Ластици за упражнения', 'resistance-bands', v_parent_id, 8),
      ('Yoga Mats', 'Постелки за йога', 'yoga-mats', v_parent_id, 9),
      ('Pull-Up Bars', 'Лостове за набиране', 'pull-up-bars', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Camping deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'camping';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tents', 'Палатки', 'tents', v_parent_id, 1),
      ('Sleeping Bags', 'Спални чували', 'sleeping-bags', v_parent_id, 2),
      ('Camping Chairs', 'Къмпинг столове', 'camping-chairs', v_parent_id, 3),
      ('Camping Tables', 'Къмпинг маси', 'camping-tables', v_parent_id, 4),
      ('Coolers', 'Хладилни чанти', 'coolers', v_parent_id, 5),
      ('Camping Stoves', 'Къмпинг печки', 'camping-stoves', v_parent_id, 6),
      ('Lanterns', 'Фенери', 'lanterns', v_parent_id, 7),
      ('Camping Cookware', 'Къмпинг съдове', 'camping-cookware', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hiking deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hiking';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hiking Backpacks', 'Раници за туризъм', 'hiking-backpacks', v_parent_id, 1),
      ('Hiking Boots', 'Туристически обувки', 'hiking-boots', v_parent_id, 2),
      ('Trekking Poles', 'Трекинг щеки', 'trekking-poles', v_parent_id, 3),
      ('Hydration Packs', 'Хидратационни раници', 'hydration-packs', v_parent_id, 4),
      ('Compasses', 'Компаси', 'compasses', v_parent_id, 5),
      ('GPS Devices', 'GPS устройства', 'gps-devices', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fishing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fishing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fishing Rods', 'Въдици', 'fishing-rods', v_parent_id, 1),
      ('Fishing Reels', 'Макари', 'fishing-reels', v_parent_id, 2),
      ('Fishing Line', 'Влакно за риболов', 'fishing-line', v_parent_id, 3),
      ('Fishing Lures', 'Примамки', 'fishing-lures', v_parent_id, 4),
      ('Tackle Boxes', 'Кутии за риболов', 'tackle-boxes', v_parent_id, 5),
      ('Fishing Nets', 'Кепове', 'fishing-nets', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cycling deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cycling';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bicycles', 'Велосипеди', 'bicycles', v_parent_id, 1),
      ('Bike Helmets', 'Велосипедни каски', 'bike-helmets', v_parent_id, 2),
      ('Bike Lights', 'Велосипедни светлини', 'bike-lights', v_parent_id, 3),
      ('Bike Locks', 'Велосипедни катинари', 'bike-locks', v_parent_id, 4),
      ('Bike Pumps', 'Велосипедни помпи', 'bike-pumps', v_parent_id, 5),
      ('Bike Racks', 'Багажници за велосипеди', 'bike-racks', v_parent_id, 6),
      ('Cycling Apparel', 'Колоездачно облекло', 'cycling-apparel', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Golf deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'golf';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Golf Clubs', 'Голф стикове', 'golf-clubs', v_parent_id, 1),
      ('Golf Bags', 'Голф чанти', 'golf-bags', v_parent_id, 2),
      ('Golf Balls', 'Голф топки', 'golf-balls', v_parent_id, 3),
      ('Golf Shoes', 'Голф обувки', 'golf-shoes', v_parent_id, 4),
      ('Golf Gloves', 'Голф ръкавици', 'golf-gloves', v_parent_id, 5),
      ('Golf Carts', 'Голф колички', 'golf-carts', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tennis deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tennis';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tennis Rackets', 'Тенис ракети', 'tennis-rackets', v_parent_id, 1),
      ('Tennis Balls', 'Тенис топки', 'tennis-balls', v_parent_id, 2),
      ('Tennis Bags', 'Тенис чанти', 'tennis-bags', v_parent_id, 3),
      ('Tennis Shoes', 'Тенис обувки', 'tennis-shoes', v_parent_id, 4),
      ('Tennis Strings', 'Тенис струни', 'tennis-strings', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Basketball deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'basketball';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Basketballs', 'Баскетболни топки', 'basketballs', v_parent_id, 1),
      ('Basketball Hoops', 'Баскетболни кошове', 'basketball-hoops', v_parent_id, 2),
      ('Basketball Shoes', 'Баскетболни обувки', 'basketball-shoes', v_parent_id, 3),
      ('Basketball Apparel', 'Баскетболно облекло', 'basketball-apparel', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
