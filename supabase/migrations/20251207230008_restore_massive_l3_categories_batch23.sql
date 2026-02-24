
-- Batch 23: Garden, Tools, Pet, Jewelry deep categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Garden L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'outdoor-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Patio Furniture Sets', 'Комплекти за тераса', 'patio-furniture-sets', v_parent_id, 1),
      ('Outdoor Chairs', 'Външни столове', 'outdoor-chairs', v_parent_id, 2),
      ('Outdoor Tables', 'Външни маси', 'outdoor-tables', v_parent_id, 3),
      ('Outdoor Loungers', 'Външни шезлонги', 'outdoor-loungers', v_parent_id, 4),
      ('Hammocks', 'Хамаци', 'hammocks', v_parent_id, 5),
      ('Patio Umbrellas', 'Чадъри за тераса', 'patio-umbrellas', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'garden-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Shovels', 'Лопати', 'shovels', v_parent_id, 1),
      ('Rakes', 'Гребла', 'rakes', v_parent_id, 2),
      ('Pruning Tools', 'Градински ножици', 'pruning-tools', v_parent_id, 3),
      ('Wheelbarrows', 'Ръчни колички', 'wheelbarrows', v_parent_id, 4),
      ('Garden Hoses', 'Градински маркучи', 'garden-hoses', v_parent_id, 5),
      ('Watering Cans', 'Лейки', 'watering-cans', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'lawn-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Lawn Mowers', 'Косачки', 'lawn-mowers', v_parent_id, 1),
      ('String Trimmers', 'Тримери', 'string-trimmers', v_parent_id, 2),
      ('Leaf Blowers', 'Духалки за листа', 'leaf-blowers', v_parent_id, 3),
      ('Lawn Fertilizers', 'Торове за трева', 'lawn-fertilizers', v_parent_id, 4),
      ('Lawn Seeds', 'Семена за трева', 'lawn-seeds', v_parent_id, 5),
      ('Lawn Aerators', 'Аератори', 'lawn-aerators', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'planters-pots';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Indoor Planters', 'Саксии за вътре', 'indoor-planters', v_parent_id, 1),
      ('Outdoor Planters', 'Саксии за навън', 'outdoor-planters', v_parent_id, 2),
      ('Hanging Planters', 'Висящи саксии', 'hanging-planters', v_parent_id, 3),
      ('Plant Stands', 'Поставки за растения', 'plant-stands', v_parent_id, 4),
      ('Window Boxes', 'Прозоречни кутии', 'window-boxes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tools L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'power-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Drills', 'Бормашини', 'drills', v_parent_id, 1),
      ('Saws', 'Циркуляри', 'saws', v_parent_id, 2),
      ('Sanders', 'Шлайфмашини', 'sanders', v_parent_id, 3),
      ('Grinders', 'Ъглошлайфи', 'grinders', v_parent_id, 4),
      ('Routers', 'Оберфрези', 'routers', v_parent_id, 5),
      ('Nail Guns', 'Пневматични пистолети за пирони', 'nail-guns', v_parent_id, 6),
      ('Heat Guns', 'Пистолети за горещ въздух', 'heat-guns', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hand-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Screwdrivers', 'Отвертки', 'screwdrivers', v_parent_id, 1),
      ('Wrenches', 'Гаечни ключове', 'wrenches', v_parent_id, 2),
      ('Pliers', 'Клещи', 'pliers', v_parent_id, 3),
      ('Hammers', 'Чукове', 'hammers', v_parent_id, 4),
      ('Measuring Tools', 'Измервателни инструменти', 'measuring-tools', v_parent_id, 5),
      ('Clamps', 'Скоби', 'clamps', v_parent_id, 6),
      ('Hand Saws', 'Ръчни триони', 'hand-saws', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tool-storage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tool Boxes', 'Кутии за инструменти', 'tool-boxes', v_parent_id, 1),
      ('Tool Bags', 'Чанти за инструменти', 'tool-bags', v_parent_id, 2),
      ('Tool Chests', 'Сандъци за инструменти', 'tool-chests', v_parent_id, 3),
      ('Tool Belts', 'Колани за инструменти', 'tool-belts', v_parent_id, 4),
      ('Tool Cabinets', 'Шкафове за инструменти', 'tool-cabinets', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'electrical';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wire & Cable', 'Кабели', 'wire-cable', v_parent_id, 1),
      ('Outlets & Switches', 'Контакти и ключове', 'outlets-switches', v_parent_id, 2),
      ('Circuit Breakers', 'Предпазители', 'circuit-breakers', v_parent_id, 3),
      ('Electrical Testers', 'Електрически тестери', 'electrical-testers', v_parent_id, 4),
      ('Junction Boxes', 'Разклонителни кутии', 'junction-boxes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'plumbing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Faucets', 'Кранове', 'faucets', v_parent_id, 1),
      ('Pipe Fittings', 'Фитинги за тръби', 'pipe-fittings', v_parent_id, 2),
      ('Valves', 'Вентили', 'valves', v_parent_id, 3),
      ('Toilets', 'Тоалетни', 'toilets', v_parent_id, 4),
      ('Sinks', 'Мивки', 'sinks', v_parent_id, 5),
      ('Shower Heads', 'Душове', 'shower-heads', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pet Supplies L3
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
      ('Dog Clothing', 'Дрехи за кучета', 'dog-clothing', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cat-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cat Food', 'Храна за котки', 'cat-food', v_parent_id, 1),
      ('Cat Treats', 'Лакомства за котки', 'cat-treats', v_parent_id, 2),
      ('Cat Toys', 'Играчки за котки', 'cat-toys', v_parent_id, 3),
      ('Cat Beds', 'Легла за котки', 'cat-beds', v_parent_id, 4),
      ('Cat Trees', 'Катерушки за котки', 'cat-trees', v_parent_id, 5),
      ('Cat Litter', 'Котешка тоалетна', 'cat-litter', v_parent_id, 6),
      ('Cat Carriers', 'Транспортни кутии за котки', 'cat-carriers', v_parent_id, 7),
      ('Cat Grooming', 'Грижа за котки', 'cat-grooming', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fish-aquarium';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Aquariums', 'Аквариуми', 'aquariums', v_parent_id, 1),
      ('Fish Food', 'Храна за риби', 'fish-food', v_parent_id, 2),
      ('Aquarium Filters', 'Филтри за аквариуми', 'aquarium-filters', v_parent_id, 3),
      ('Aquarium Heaters', 'Нагреватели за аквариуми', 'aquarium-heaters', v_parent_id, 4),
      ('Aquarium Decorations', 'Декорации за аквариуми', 'aquarium-decorations', v_parent_id, 5),
      ('Aquarium Lighting', 'Осветление за аквариуми', 'aquarium-lighting', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bird-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bird Cages', 'Клетки за птици', 'bird-cages', v_parent_id, 1),
      ('Bird Food', 'Храна за птици', 'bird-food', v_parent_id, 2),
      ('Bird Toys', 'Играчки за птици', 'bird-toys', v_parent_id, 3),
      ('Bird Perches', 'Кацалки за птици', 'bird-perches', v_parent_id, 4),
      ('Bird Feeders', 'Хранилки за птици', 'bird-feeders', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Jewelry L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'necklaces';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pendant Necklaces', 'Колиета с висулки', 'pendant-necklaces', v_parent_id, 1),
      ('Chain Necklaces', 'Верижки', 'chain-necklaces', v_parent_id, 2),
      ('Chokers', 'Чокъри', 'chokers', v_parent_id, 3),
      ('Statement Necklaces', 'Акцентни колиета', 'statement-necklaces', v_parent_id, 4),
      ('Pearl Necklaces', 'Перлени колиета', 'pearl-necklaces', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'rings';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Engagement Rings', 'Годежни пръстени', 'engagement-rings', v_parent_id, 1),
      ('Wedding Bands', 'Брачни халки', 'wedding-bands', v_parent_id, 2),
      ('Fashion Rings', 'Модни пръстени', 'fashion-rings', v_parent_id, 3),
      ('Signet Rings', 'Печатни пръстени', 'signet-rings', v_parent_id, 4),
      ('Stackable Rings', 'Пръстени за комбиниране', 'stackable-rings', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'earrings';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Stud Earrings', 'Обици на щифт', 'stud-earrings', v_parent_id, 1),
      ('Hoop Earrings', 'Халки обици', 'hoop-earrings', v_parent_id, 2),
      ('Drop Earrings', 'Висящи обици', 'drop-earrings', v_parent_id, 3),
      ('Chandelier Earrings', 'Полилейни обици', 'chandelier-earrings', v_parent_id, 4),
      ('Clip-On Earrings', 'Обици щипка', 'clip-on-earrings', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bracelets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tennis Bracelets', 'Тенис гривни', 'tennis-bracelets', v_parent_id, 1),
      ('Charm Bracelets', 'Гривни с чармове', 'charm-bracelets', v_parent_id, 2),
      ('Bangle Bracelets', 'Гривни тип гривна', 'bangle-bracelets', v_parent_id, 3),
      ('Cuff Bracelets', 'Гривни маншет', 'cuff-bracelets', v_parent_id, 4),
      ('Beaded Bracelets', 'Гривни с мъниста', 'beaded-bracelets', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
