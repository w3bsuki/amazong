
-- Batch 21: Winter Sports, Combat Sports, Running, Outdoor Recreation
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Winter Sports L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'skiing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Skis', 'Ски', 'skis', v_parent_id, 1),
      ('Ski Boots', 'Ски обувки', 'ski-boots', v_parent_id, 2),
      ('Ski Bindings', 'Ски автомати', 'ski-bindings', v_parent_id, 3),
      ('Ski Poles', 'Ски щеки', 'ski-poles', v_parent_id, 4),
      ('Ski Helmets', 'Ски каски', 'ski-helmets', v_parent_id, 5),
      ('Ski Goggles', 'Ски очила', 'ski-goggles', v_parent_id, 6)
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
      ('Figure Skates', 'Кънки за фигурно пързаляне', 'figure-skates', v_parent_id, 1),
      ('Hockey Skates', 'Хокейни кънки', 'hockey-skates', v_parent_id, 2),
      ('Speed Skates', 'Кънки за бързо пързаляне', 'speed-skates', v_parent_id, 3),
      ('Recreational Skates', 'Рекреационни кънки', 'recreational-skates', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sledding-tubing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sleds', 'Шейни', 'sleds', v_parent_id, 1),
      ('Snow Tubes', 'Снежни тръби', 'snow-tubes', v_parent_id, 2),
      ('Toboggans', 'Тобогани', 'toboggans', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Combat Sports L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'boxing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Boxing Gloves', 'Боксови ръкавици', 'boxing-gloves', v_parent_id, 1),
      ('Punching Bags', 'Боксови круши', 'punching-bags', v_parent_id, 2),
      ('Hand Wraps', 'Бинтове за ръце', 'hand-wraps', v_parent_id, 3),
      ('Headgear', 'Предпазни каски', 'boxing-headgear', v_parent_id, 4),
      ('Focus Mitts', 'Боксови лапи', 'focus-mitts', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mma';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('MMA Gloves', 'MMA ръкавици', 'mma-gloves', v_parent_id, 1),
      ('MMA Shorts', 'MMA шорти', 'mma-shorts', v_parent_id, 2),
      ('Grappling Dummies', 'Манекени за борба', 'grappling-dummies', v_parent_id, 3),
      ('Shin Guards', 'Кори за пищял', 'mma-shin-guards', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'martial-arts';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Karate Uniforms', 'Карате кимона', 'karate-uniforms', v_parent_id, 1),
      ('Judo Uniforms', 'Джудо кимона', 'judo-uniforms', v_parent_id, 2),
      ('Taekwondo Equipment', 'Таекуондо екипировка', 'taekwondo-equipment', v_parent_id, 3),
      ('Training Weapons', 'Тренировъчни оръжия', 'training-weapons', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wrestling';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wrestling Shoes', 'Борцовски обувки', 'wrestling-shoes', v_parent_id, 1),
      ('Wrestling Singlets', 'Борцовски екипи', 'wrestling-singlets', v_parent_id, 2),
      ('Wrestling Mats', 'Борцовски постелки', 'wrestling-mats', v_parent_id, 3),
      ('Ear Guards', 'Предпазители за уши', 'ear-guards', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Running L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'running-shoes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Road Running Shoes', 'Обувки за бягане по път', 'road-running-shoes', v_parent_id, 1),
      ('Trail Running Shoes', 'Обувки за бягане по пътеки', 'trail-running-shoes-2', v_parent_id, 2),
      ('Racing Flats', 'Състезателни маратонки', 'racing-flats', v_parent_id, 3),
      ('Track Spikes', 'Шипове за писта', 'track-spikes', v_parent_id, 4),
      ('Minimalist Shoes', 'Минималистични обувки', 'minimalist-shoes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'running-clothing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Running Shorts', 'Шорти за бягане', 'running-shorts', v_parent_id, 1),
      ('Running Tights', 'Клинове за бягане', 'running-tights', v_parent_id, 2),
      ('Running Tops', 'Горнища за бягане', 'running-tops', v_parent_id, 3),
      ('Running Jackets', 'Якета за бягане', 'running-jackets', v_parent_id, 4),
      ('Running Socks', 'Чорапи за бягане', 'running-socks', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'running-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Running Watches', 'Часовници за бягане', 'running-watches', v_parent_id, 1),
      ('Heart Rate Monitors', 'Монитори на сърдечен ритъм', 'heart-rate-monitors', v_parent_id, 2),
      ('Running Belts', 'Колани за бягане', 'running-belts', v_parent_id, 3),
      ('Running Armbands', 'Лентички за ръка', 'running-armbands', v_parent_id, 4),
      ('Hydration Vests', 'Хидратационни жилетки', 'hydration-vests', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Outdoor Recreation L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'climbing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Climbing Shoes', 'Катерачни обувки', 'climbing-shoes', v_parent_id, 1),
      ('Climbing Harnesses', 'Катерачни седалки', 'climbing-harnesses', v_parent_id, 2),
      ('Climbing Ropes', 'Катерачни въжета', 'climbing-ropes', v_parent_id, 3),
      ('Carabiners', 'Карабинери', 'carabiners', v_parent_id, 4),
      ('Chalk & Chalk Bags', 'Магнезий и торбички', 'chalk-chalk-bags', v_parent_id, 5),
      ('Climbing Protection', 'Катерачна защита', 'climbing-protection', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'skateboarding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Skateboards', 'Скейтборди', 'skateboards', v_parent_id, 1),
      ('Skateboard Decks', 'Скейтборд дъски', 'skateboard-decks', v_parent_id, 2),
      ('Skateboard Trucks', 'Скейтборд осовини', 'skateboard-trucks', v_parent_id, 3),
      ('Skateboard Wheels', 'Скейтборд колела', 'skateboard-wheels', v_parent_id, 4),
      ('Skateboard Helmets', 'Скейтборд каски', 'skateboard-helmets', v_parent_id, 5),
      ('Skateboard Pads', 'Скейтборд протектори', 'skateboard-pads', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'scooters';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Kick Scooters', 'Тротинетки', 'kick-scooters', v_parent_id, 1),
      ('Pro Scooters', 'Професионални тротинетки', 'pro-scooters', v_parent_id, 2),
      ('Scooter Parts', 'Части за тротинетки', 'scooter-parts', v_parent_id, 3),
      ('Scooter Accessories', 'Аксесоари за тротинетки', 'scooter-accessories', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'roller-skating';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Inline Skates', 'Ролкови кънки', 'inline-skates', v_parent_id, 1),
      ('Quad Skates', 'Квад кънки', 'quad-skates', v_parent_id, 2),
      ('Roller Skate Accessories', 'Аксесоари за ролкови кънки', 'roller-skate-accessories', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Archery L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'archery';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Compound Bows', 'Съставни лъкове', 'compound-bows', v_parent_id, 1),
      ('Recurve Bows', 'Рекурсивни лъкове', 'recurve-bows', v_parent_id, 2),
      ('Crossbows', 'Арбалети', 'crossbows', v_parent_id, 3),
      ('Arrows', 'Стрели', 'arrows', v_parent_id, 4),
      ('Targets', 'Мишени', 'archery-targets', v_parent_id, 5),
      ('Archery Accessories', 'Аксесоари за стрелба с лък', 'archery-accessories', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Equestrian L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'equestrian';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Saddles', 'Седла', 'saddles', v_parent_id, 1),
      ('Bridles', 'Юзди', 'bridles', v_parent_id, 2),
      ('Riding Boots', 'Ботуши за езда', 'riding-boots', v_parent_id, 3),
      ('Riding Helmets', 'Каски за езда', 'riding-helmets', v_parent_id, 4),
      ('Horse Blankets', 'Одеяла за коне', 'horse-blankets', v_parent_id, 5),
      ('Horse Grooming', 'Грижа за коне', 'horse-grooming', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
