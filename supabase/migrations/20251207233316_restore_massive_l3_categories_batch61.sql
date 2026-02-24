
-- Batch 61: Lawn Care, Plants, and More Garden Categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Lawn Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'lawn-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Lawn Mowers', 'Косачки', 'lawn-mowers', v_parent_id, 1),
      ('Trimmers', 'Тримери', 'trimmers', v_parent_id, 2),
      ('Leaf Blowers', 'Листосъбирачи', 'leaf-blowers', v_parent_id, 3),
      ('Lawn Seed', 'Семена за трева', 'lawn-seed', v_parent_id, 4),
      ('Fertilizers', 'Торове', 'fertilizers', v_parent_id, 5),
      ('Weed Control', 'Контрол на плевели', 'weed-control', v_parent_id, 6),
      ('Lawn Spreaders', 'Сеялки за торове', 'lawn-spreaders', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Plants & Seeds deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'plants-seeds';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Flower Seeds', 'Семена за цветя', 'flower-seeds', v_parent_id, 1),
      ('Vegetable Seeds', 'Семена за зеленчуци', 'vegetable-seeds', v_parent_id, 2),
      ('Herb Seeds', 'Семена за билки', 'herb-seeds', v_parent_id, 3),
      ('Bulbs', 'Луковици', 'bulbs', v_parent_id, 4),
      ('Live Plants', 'Живи растения', 'live-plants', v_parent_id, 5),
      ('Indoor Plants', 'Стайни растения', 'indoor-plants', v_parent_id, 6),
      ('Outdoor Plants', 'Градински растения', 'outdoor-plants', v_parent_id, 7),
      ('Succulents', 'Сукуленти', 'succulents', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Planters & Pots
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'planters-pots';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Ceramic Planters', 'Керамични саксии', 'ceramic-planters', v_parent_id, 1),
      ('Plastic Planters', 'Пластмасови саксии', 'plastic-planters', v_parent_id, 2),
      ('Hanging Planters', 'Висящи саксии', 'hanging-planters', v_parent_id, 3),
      ('Window Boxes', 'Цветарници за прозорец', 'window-boxes', v_parent_id, 4),
      ('Plant Stands', 'Стойки за растения', 'plant-stands', v_parent_id, 5),
      ('Raised Garden Beds', 'Повдигнати лехи', 'raised-garden-beds', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pest Control
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pest-control';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Insecticides', 'Инсектициди', 'insecticides', v_parent_id, 1),
      ('Rodent Control', 'Контрол на гризачи', 'rodent-control', v_parent_id, 2),
      ('Bug Zappers', 'Убиватели на насекоми', 'bug-zappers', v_parent_id, 3),
      ('Mosquito Repellents', 'Препарати против комари', 'mosquito-repellents', v_parent_id, 4),
      ('Traps', 'Капани', 'traps', v_parent_id, 5),
      ('Natural Pest Control', 'Естествен контрол на вредители', 'natural-pest-control', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pool Supplies
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pool-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pool Chemicals', 'Химикали за басейни', 'pool-chemicals', v_parent_id, 1),
      ('Pool Filters', 'Филтри за басейни', 'pool-filters', v_parent_id, 2),
      ('Pool Pumps', 'Помпи за басейни', 'pool-pumps', v_parent_id, 3),
      ('Pool Cleaners', 'Почистващи за басейни', 'pool-cleaners', v_parent_id, 4),
      ('Pool Covers', 'Покривала за басейни', 'pool-covers', v_parent_id, 5),
      ('Pool Toys', 'Играчки за басейн', 'pool-toys', v_parent_id, 6),
      ('Pool Floats Toys', 'Надуваеми дюшеци за басейн', 'pool-floats-toys', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Storage & Organization deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'storage-organization';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Storage Bins', 'Кутии за съхранение', 'storage-bins', v_parent_id, 1),
      ('Storage Baskets', 'Кошници за съхранение', 'storage-baskets', v_parent_id, 2),
      ('Shelving Units', 'Стелажи', 'shelving-units', v_parent_id, 3),
      ('Closet Organizers', 'Органайзери за гардероби', 'closet-organizers', v_parent_id, 4),
      ('Drawer Organizers', 'Органайзери за чекмеджета', 'drawer-organizers', v_parent_id, 5),
      ('Shoe Storage', 'Съхранение за обувки', 'shoe-storage', v_parent_id, 6),
      ('Garage Storage', 'Гаражно съхранение', 'garage-storage', v_parent_id, 7),
      ('Cabinet Organizers', 'Органайзери за шкафове', 'cabinet-organizers', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Laundry deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'laundry';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Laundry Baskets', 'Кошове за пране', 'laundry-baskets', v_parent_id, 1),
      ('Ironing Boards', 'Дъски за гладене', 'ironing-boards', v_parent_id, 2),
      ('Clothes Drying Racks', 'Сушилни за дрехи', 'clothes-drying-racks', v_parent_id, 3),
      ('Laundry Detergent', 'Перилен препарат', 'laundry-detergent', v_parent_id, 4),
      ('Fabric Softener', 'Омекотител', 'fabric-softener', v_parent_id, 5),
      ('Stain Removers', 'Препарати за петна', 'stain-removers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cleaning Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cleaning-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('All-Purpose Cleaners', 'Универсални почистващи', 'all-purpose-cleaners', v_parent_id, 1),
      ('Floor Cleaners', 'Препарати за подове', 'floor-cleaners', v_parent_id, 2),
      ('Glass Cleaners', 'Препарати за стъкла', 'glass-cleaners', v_parent_id, 3),
      ('Bathroom Cleaners', 'Препарати за бани', 'bathroom-cleaners', v_parent_id, 4),
      ('Kitchen Cleaners', 'Препарати за кухни', 'kitchen-cleaners', v_parent_id, 5),
      ('Disinfectants', 'Дезинфектанти', 'disinfectants', v_parent_id, 6),
      ('Mops', 'Моп', 'mops', v_parent_id, 7),
      ('Brooms', 'Метли', 'brooms', v_parent_id, 8),
      ('Dustpans', 'Лопатки за боклук', 'dustpans', v_parent_id, 9),
      ('Sponges', 'Гъби', 'sponges', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
