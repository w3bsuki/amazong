
-- Batch 70: More sports and final miscellaneous categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Soccer deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'soccer';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Soccer Balls', 'Футболни топки', 'soccer-balls', v_parent_id, 1),
      ('Soccer Goals', 'Футболни врати', 'soccer-goals', v_parent_id, 2),
      ('Soccer Cleats', 'Футболни обувки', 'soccer-cleats', v_parent_id, 3),
      ('Shin Guards', 'Кори', 'shin-guards', v_parent_id, 4),
      ('Soccer Apparel', 'Футболно облекло', 'soccer-apparel', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Baseball deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'baseball';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Baseball Bats', 'Бейзболни бухалки', 'baseball-bats', v_parent_id, 1),
      ('Baseball Gloves', 'Бейзболни ръкавици', 'baseball-gloves', v_parent_id, 2),
      ('Baseballs', 'Бейзболни топки', 'baseballs', v_parent_id, 3),
      ('Baseball Helmets', 'Бейзболни каски', 'baseball-helmets', v_parent_id, 4),
      ('Baseball Cleats', 'Бейзболни обувки', 'baseball-cleats', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hockey deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hockey';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hockey Sticks', 'Хокейни стикове', 'hockey-sticks', v_parent_id, 1),
      ('Hockey Pucks', 'Хокейни шайби', 'hockey-pucks', v_parent_id, 2),
      ('Hockey Skates', 'Хокейни кънки', 'hockey-skates', v_parent_id, 3),
      ('Hockey Helmets', 'Хокейни каски', 'hockey-helmets', v_parent_id, 4),
      ('Hockey Pads', 'Хокейни протектори', 'hockey-pads', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Skiing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'skiing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Skis', 'Ски', 'skis', v_parent_id, 1),
      ('Ski Boots', 'Ски обувки', 'ski-boots', v_parent_id, 2),
      ('Ski Poles', 'Ски щеки', 'ski-poles', v_parent_id, 3),
      ('Ski Helmets', 'Ски каски', 'ski-helmets', v_parent_id, 4),
      ('Ski Goggles', 'Ски очила', 'ski-goggles', v_parent_id, 5),
      ('Ski Apparel', 'Ски облекло', 'ski-apparel', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Snowboarding deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'snowboarding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Snowboards', 'Сноуборди', 'snowboards', v_parent_id, 1),
      ('Snowboard Boots', 'Сноуборд обувки', 'snowboard-boots', v_parent_id, 2),
      ('Snowboard Bindings', 'Сноуборд автомати', 'snowboard-bindings', v_parent_id, 3),
      ('Snowboard Helmets', 'Сноуборд каски', 'snowboard-helmets', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Swimming deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'swimming';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Swim Goggles', 'Плувни очила', 'swim-goggles', v_parent_id, 1),
      ('Swim Caps', 'Плувни шапки', 'swim-caps', v_parent_id, 2),
      ('Swimsuits Sport', 'Спортни бански', 'swimsuits-sport', v_parent_id, 3),
      ('Swim Fins', 'Плавници', 'swim-fins', v_parent_id, 4),
      ('Swim Training', 'Тренировъчни принадлежности', 'swim-training', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hunting deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hunting';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hunting Apparel', 'Ловно облекло', 'hunting-apparel', v_parent_id, 1),
      ('Hunting Boots', 'Ловни обувки', 'hunting-boots', v_parent_id, 2),
      ('Game Calls', 'Примамки за лов', 'game-calls', v_parent_id, 3),
      ('Trail Cameras', 'Ловни камери', 'trail-cameras', v_parent_id, 4),
      ('Blinds Stands', 'Скривалища', 'blinds-stands', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Yoga & Pilates deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'yoga-pilates';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Yoga Blocks', 'Йога блокчета', 'yoga-blocks', v_parent_id, 1),
      ('Yoga Straps', 'Йога каишки', 'yoga-straps', v_parent_id, 2),
      ('Yoga Towels', 'Йога кърпи', 'yoga-towels', v_parent_id, 3),
      ('Pilates Rings', 'Пилатес пръстени', 'pilates-rings', v_parent_id, 4),
      ('Meditation Cushions', 'Възглавници за медитация', 'meditation-cushions', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Boxing & MMA deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'boxing-mma';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Boxing Gloves', 'Боксови ръкавици', 'boxing-gloves', v_parent_id, 1),
      ('Punching Bags', 'Боксови круши', 'punching-bags', v_parent_id, 2),
      ('Hand Wraps', 'Бинтове за ръце', 'hand-wraps', v_parent_id, 3),
      ('MMA Gloves', 'MMA ръкавици', 'mma-gloves', v_parent_id, 4),
      ('Boxing Shoes', 'Боксови обувки', 'boxing-shoes', v_parent_id, 5),
      ('Headgear Boxing', 'Каски за бокс', 'headgear-boxing', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
