
-- Batch 20: More Sports, Outdoor, Camping, Fishing, Golf
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Camping & Hiking L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tents';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Backpacking Tents', 'Палатки за туризъм', 'backpacking-tents', v_parent_id, 1),
      ('Camping Tents', 'Къмпинг палатки', 'camping-tents', v_parent_id, 2),
      ('Family Tents', 'Семейни палатки', 'family-tents', v_parent_id, 3),
      ('Instant Tents', 'Палатки с бързо сглобяване', 'instant-tents', v_parent_id, 4),
      ('4-Season Tents', '4-сезонни палатки', '4-season-tents', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sleeping-bags';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Summer Sleeping Bags', 'Летни спални чували', 'summer-sleeping-bags', v_parent_id, 1),
      ('3-Season Sleeping Bags', '3-сезонни спални чували', '3-season-sleeping-bags', v_parent_id, 2),
      ('Winter Sleeping Bags', 'Зимни спални чували', 'winter-sleeping-bags', v_parent_id, 3),
      ('Down Sleeping Bags', 'Пухени спални чували', 'down-sleeping-bags', v_parent_id, 4),
      ('Synthetic Sleeping Bags', 'Синтетични спални чували', 'synthetic-sleeping-bags', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'backpacks';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Daypacks', 'Дневни раници', 'daypacks', v_parent_id, 1),
      ('Hiking Backpacks', 'Туристически раници', 'hiking-backpacks', v_parent_id, 2),
      ('Trekking Backpacks', 'Трекинг раници', 'trekking-backpacks', v_parent_id, 3),
      ('Hydration Packs', 'Хидратационни раници', 'hydration-packs', v_parent_id, 4),
      ('Ultralight Backpacks', 'Ултралеки раници', 'ultralight-backpacks', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hiking-boots-shoes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hiking Boots', 'Туристически обувки', 'hiking-boots', v_parent_id, 1),
      ('Trail Running Shoes', 'Обувки за трейл бягане', 'trail-running-shoes', v_parent_id, 2),
      ('Approach Shoes', 'Обувки за подход', 'approach-shoes', v_parent_id, 3),
      ('Sandals', 'Сандали', 'hiking-sandals', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fishing L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fishing-rods';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Spinning Rods', 'Спининг въдици', 'spinning-rods', v_parent_id, 1),
      ('Casting Rods', 'Кастинг въдици', 'casting-rods', v_parent_id, 2),
      ('Fly Rods', 'Мухарски въдици', 'fly-rods', v_parent_id, 3),
      ('Surf Rods', 'Сърф въдици', 'surf-rods', v_parent_id, 4),
      ('Trolling Rods', 'Тролинг въдици', 'trolling-rods', v_parent_id, 5),
      ('Ice Fishing Rods', 'Въдици за лед', 'ice-fishing-rods', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fishing-reels';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Spinning Reels', 'Спининг макари', 'spinning-reels', v_parent_id, 1),
      ('Baitcasting Reels', 'Мултипликаторни макари', 'baitcasting-reels', v_parent_id, 2),
      ('Fly Reels', 'Мухарски макари', 'fly-reels', v_parent_id, 3),
      ('Trolling Reels', 'Тролинг макари', 'trolling-reels', v_parent_id, 4),
      ('Spincast Reels', 'Спинкаст макари', 'spincast-reels', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fishing-lures-baits';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Soft Plastic Lures', 'Меки силиконови примамки', 'soft-plastic-lures', v_parent_id, 1),
      ('Hard Baits', 'Твърди примамки', 'hard-baits', v_parent_id, 2),
      ('Spinners', 'Въртящи се примамки', 'spinners', v_parent_id, 3),
      ('Jigs', 'Джигове', 'jigs', v_parent_id, 4),
      ('Flies', 'Мухи', 'flies', v_parent_id, 5),
      ('Live Bait', 'Жива стръв', 'live-bait', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fishing-tackle-boxes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tackle Bags', 'Риболовни чанти', 'tackle-bags', v_parent_id, 1),
      ('Tackle Boxes', 'Кутии за принадлежности', 'tackle-boxes', v_parent_id, 2),
      ('Tackle Storage', 'Съхранение на принадлежности', 'tackle-storage', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Golf L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'golf-clubs';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Drivers', 'Драйвъри', 'drivers', v_parent_id, 1),
      ('Fairway Woods', 'Феъруей уудове', 'fairway-woods', v_parent_id, 2),
      ('Hybrids', 'Хибриди', 'hybrids', v_parent_id, 3),
      ('Irons', 'Айрони', 'irons', v_parent_id, 4),
      ('Wedges', 'Уеджове', 'wedges', v_parent_id, 5),
      ('Putters', 'Путери', 'putters', v_parent_id, 6),
      ('Complete Sets', 'Пълни комплекти', 'complete-golf-sets', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'golf-balls';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tour Balls', 'Турнирни топки', 'tour-balls', v_parent_id, 1),
      ('Distance Balls', 'Топки за дистанция', 'distance-balls', v_parent_id, 2),
      ('Practice Balls', 'Тренировъчни топки', 'practice-balls', v_parent_id, 3),
      ('Colored Balls', 'Цветни топки', 'colored-balls', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'golf-bags';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cart Bags', 'Чанти за количка', 'cart-bags', v_parent_id, 1),
      ('Stand Bags', 'Стоящи чанти', 'stand-bags', v_parent_id, 2),
      ('Tour Bags', 'Турнирни чанти', 'tour-bags', v_parent_id, 3),
      ('Travel Bags', 'Пътни чанти', 'golf-travel-bags', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Team Sports L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'soccer';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Soccer Balls', 'Футболни топки', 'soccer-balls', v_parent_id, 1),
      ('Soccer Cleats', 'Футболни бутонки', 'soccer-cleats', v_parent_id, 2),
      ('Soccer Goals', 'Футболни врати', 'soccer-goals', v_parent_id, 3),
      ('Shin Guards', 'Кори', 'shin-guards', v_parent_id, 4),
      ('Soccer Jerseys', 'Футболни фланелки', 'soccer-jerseys', v_parent_id, 5),
      ('Goalkeeper Gloves', 'Вратарски ръкавици', 'goalkeeper-gloves', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'basketball';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Basketballs', 'Баскетболни топки', 'basketballs', v_parent_id, 1),
      ('Basketball Hoops', 'Баскетболни кошове', 'basketball-hoops', v_parent_id, 2),
      ('Basketball Shoes', 'Баскетболни обувки', 'basketball-shoes', v_parent_id, 3),
      ('Basketball Jerseys', 'Баскетболни фланелки', 'basketball-jerseys', v_parent_id, 4)
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

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'volleyball';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Volleyballs', 'Волейболни топки', 'volleyballs', v_parent_id, 1),
      ('Volleyball Nets', 'Волейболни мрежи', 'volleyball-nets', v_parent_id, 2),
      ('Volleyball Shoes', 'Волейболни обувки', 'volleyball-shoes', v_parent_id, 3),
      ('Knee Pads', 'Наколенки', 'volleyball-knee-pads', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Water Sports L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'swimming';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Swimsuits', 'Бански костюми', 'competitive-swimsuits', v_parent_id, 1),
      ('Swim Goggles', 'Плувни очила', 'swim-goggles', v_parent_id, 2),
      ('Swim Caps', 'Плувни шапки', 'swim-caps', v_parent_id, 3),
      ('Swim Fins', 'Плавници', 'swim-fins', v_parent_id, 4),
      ('Training Equipment', 'Тренировъчно оборудване', 'swim-training-equipment', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kayaking-canoeing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Kayaks', 'Каяци', 'kayaks', v_parent_id, 1),
      ('Canoes', 'Канута', 'canoes', v_parent_id, 2),
      ('Paddles', 'Гребла', 'paddles', v_parent_id, 3),
      ('Life Vests', 'Спасителни жилетки', 'life-vests', v_parent_id, 4),
      ('Dry Bags', 'Водоустойчиви торби', 'dry-bags', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'surfing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Surfboards', 'Сърф дъски', 'surfboards', v_parent_id, 1),
      ('Wetsuits', 'Неопренови костюми', 'wetsuits', v_parent_id, 2),
      ('Surf Accessories', 'Сърф аксесоари', 'surf-accessories', v_parent_id, 3),
      ('Bodyboards', 'Бодиборди', 'bodyboards', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'stand-up-paddleboarding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('SUP Boards', 'SUP дъски', 'sup-boards', v_parent_id, 1),
      ('SUP Paddles', 'SUP гребла', 'sup-paddles', v_parent_id, 2),
      ('SUP Accessories', 'SUP аксесоари', 'sup-accessories', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
