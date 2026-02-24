
-- Batch 48: More deep categories - Team Sports, Winter Sports, Water Sports
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Team Sports deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'basketball';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Basketballs', 'Баскетболни топки', 'basketballs', v_parent_id, 1),
      ('Basketball Hoops', 'Баскетболни кошове', 'basketball-hoops', v_parent_id, 2),
      ('Basketball Shoes', 'Баскетболни обувки', 'basketball-shoes', v_parent_id, 3),
      ('Basketball Apparel', 'Баскетболно облекло', 'basketball-apparel', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'soccer';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Soccer Balls', 'Футболни топки', 'soccer-balls', v_parent_id, 1),
      ('Soccer Cleats', 'Футболни бутонки', 'soccer-cleats', v_parent_id, 2),
      ('Soccer Goals', 'Футболни врати', 'soccer-goals', v_parent_id, 3),
      ('Soccer Jerseys', 'Футболни фланелки', 'soccer-jerseys', v_parent_id, 4),
      ('Shin Guards', 'Кори', 'shin-guards', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tennis';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tennis Rackets', 'Тенис ракети', 'tennis-rackets', v_parent_id, 1),
      ('Tennis Balls', 'Тенис топки', 'tennis-balls', v_parent_id, 2),
      ('Tennis Shoes', 'Тенис обувки', 'tennis-shoes', v_parent_id, 3),
      ('Tennis Bags', 'Тенис чанти', 'tennis-bags', v_parent_id, 4),
      ('Tennis Strings', 'Тенис струни', 'tennis-strings', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'golf';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Golf Clubs', 'Голф стикове', 'golf-clubs', v_parent_id, 1),
      ('Golf Balls', 'Голф топки', 'golf-balls', v_parent_id, 2),
      ('Golf Bags', 'Голф чанти', 'golf-bags', v_parent_id, 3),
      ('Golf Shoes', 'Голф обувки', 'golf-shoes', v_parent_id, 4),
      ('Golf Gloves', 'Голф ръкавици', 'golf-gloves', v_parent_id, 5),
      ('Golf Apparel', 'Голф облекло', 'golf-apparel', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baseball-softball';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baseball Bats', 'Бейзболни бухалки', 'baseball-bats', v_parent_id, 1),
      ('Baseball Gloves', 'Бейзболни ръкавици', 'baseball-gloves', v_parent_id, 2),
      ('Baseballs', 'Бейзболни топки', 'baseballs', v_parent_id, 3),
      ('Baseball Helmets', 'Бейзболни каски', 'baseball-helmets', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Winter Sports deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'skiing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Skis', 'Ски', 'skis', v_parent_id, 1),
      ('Ski Boots', 'Ски обувки', 'ski-boots', v_parent_id, 2),
      ('Ski Bindings', 'Ски автомати', 'ski-bindings', v_parent_id, 3),
      ('Ski Poles', 'Ски щеки', 'ski-poles', v_parent_id, 4),
      ('Ski Helmets', 'Ски каски', 'ski-helmets', v_parent_id, 5),
      ('Ski Goggles', 'Ски очила', 'ski-goggles', v_parent_id, 6),
      ('Ski Apparel', 'Ски облекло', 'ski-apparel', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'snowboarding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Snowboards', 'Сноуборди', 'snowboards', v_parent_id, 1),
      ('Snowboard Boots', 'Сноуборд обувки', 'snowboard-boots', v_parent_id, 2),
      ('Snowboard Bindings', 'Сноуборд автомати', 'snowboard-bindings', v_parent_id, 3),
      ('Snowboard Helmets', 'Сноуборд каски', 'snowboard-helmets', v_parent_id, 4),
      ('Snowboard Goggles', 'Сноуборд очила', 'snowboard-goggles', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'ice-skating';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Ice Skates', 'Кънки', 'ice-skates', v_parent_id, 1),
      ('Figure Skates', 'Кънки за фигурно пързаляне', 'figure-skates', v_parent_id, 2),
      ('Hockey Skates', 'Хокейни кънки', 'hockey-skates', v_parent_id, 3),
      ('Skating Accessories', 'Аксесоари за кънки', 'skating-accessories', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Water Sports deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'surfing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Surfboards', 'Сърф дъски', 'surfboards', v_parent_id, 1),
      ('Wetsuits', 'Неопренови костюми', 'wetsuits', v_parent_id, 2),
      ('Surf Accessories', 'Сърф аксесоари', 'surf-accessories', v_parent_id, 3),
      ('Bodyboards', 'Бодиборд', 'bodyboards', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kayaking';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Kayaks', 'Каяци', 'kayaks', v_parent_id, 1),
      ('Kayak Paddles', 'Гребла за каяк', 'kayak-paddles', v_parent_id, 2),
      ('Life Jackets', 'Спасителни жилетки', 'life-jackets', v_parent_id, 3),
      ('Kayak Accessories', 'Аксесоари за каяк', 'kayak-accessories', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'paddleboarding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Stand Up Paddleboards', 'SUP дъски', 'sup-boards', v_parent_id, 1),
      ('SUP Paddles', 'SUP гребла', 'sup-paddles', v_parent_id, 2),
      ('SUP Accessories', 'SUP аксесоари', 'sup-accessories', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'diving';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dive Masks', 'Маски за гмуркане', 'dive-masks', v_parent_id, 1),
      ('Snorkels', 'Шнорхели', 'snorkels', v_parent_id, 2),
      ('Fins', 'Плавници', 'fins', v_parent_id, 3),
      ('Dive Computers', 'Водолазни компютри', 'dive-computers', v_parent_id, 4),
      ('Dive Suits', 'Водолазни костюми', 'dive-suits', v_parent_id, 5),
      ('Regulators', 'Регулатори', 'regulators', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fishing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fishing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fishing Rods', 'Въдици', 'fishing-rods', v_parent_id, 1),
      ('Fishing Reels', 'Макари', 'fishing-reels', v_parent_id, 2),
      ('Fishing Line', 'Риболовни влакна', 'fishing-line', v_parent_id, 3),
      ('Lures & Baits', 'Примамки и стръв', 'lures-baits', v_parent_id, 4),
      ('Tackle Boxes', 'Кутии за риболов', 'tackle-boxes', v_parent_id, 5),
      ('Fishing Accessories', 'Риболовни аксесоари', 'fishing-accessories', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
