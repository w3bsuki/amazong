
-- Batch 81: More unique categories to reach 7100
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Greenhouses deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'greenhouses';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Walk-In Greenhouses', 'Големи оранжерии', 'walk-in-greenhouses', v_parent_id, 1),
      ('Mini Greenhouses', 'Мини оранжерии', 'mini-greenhouses', v_parent_id, 2),
      ('Greenhouse Covers', 'Покривала за оранжерии', 'greenhouse-covers', v_parent_id, 3),
      ('Greenhouse Accessories', 'Аксесоари за оранжерии', 'greenhouse-accessories', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Soil Amendments deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'soil-amendments';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Potting Soil', 'Почва за саксии', 'potting-soil', v_parent_id, 1),
      ('Mulch', 'Мулч', 'mulch', v_parent_id, 2),
      ('Perlite', 'Перлит', 'perlite', v_parent_id, 3),
      ('Peat Moss', 'Торф', 'peat-moss', v_parent_id, 4),
      ('Vermiculite', 'Вермикулит', 'vermiculite', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Outdoor Structures deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'outdoor-structures';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Garden Sheds', 'Градински барачки', 'garden-sheds', v_parent_id, 1),
      ('Pergolas', 'Перголи', 'pergolas', v_parent_id, 2),
      ('Arbors', 'Арки', 'arbors', v_parent_id, 3),
      ('Garden Arches', 'Градински арки', 'garden-arches', v_parent_id, 4),
      ('Outdoor Storage', 'Външно съхранение', 'outdoor-storage', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fencing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fencing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wood Fencing', 'Дървена ограда', 'wood-fencing', v_parent_id, 1),
      ('Vinyl Fencing', 'Винилова ограда', 'vinyl-fencing', v_parent_id, 2),
      ('Metal Fencing', 'Метална ограда', 'metal-fencing', v_parent_id, 3),
      ('Garden Edging', 'Градински бордюри', 'garden-edging', v_parent_id, 4),
      ('Fence Posts', 'Стълбове за ограда', 'fence-posts', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Paving deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'paving';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pavers', 'Павета', 'pavers', v_parent_id, 1),
      ('Stepping Stones', 'Стъпала', 'stepping-stones', v_parent_id, 2),
      ('Gravel', 'Чакъл', 'gravel', v_parent_id, 3),
      ('Patio Tiles', 'Плочки за тераса', 'patio-tiles', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Snow Removal deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'snow-removal';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Snow Shovels', 'Лопати за сняг', 'snow-shovels', v_parent_id, 1),
      ('Snow Blowers', 'Снегорини', 'snow-blowers', v_parent_id, 2),
      ('Ice Melt', 'Сол за лед', 'ice-melt', v_parent_id, 3),
      ('Snow Brushes', 'Четки за сняг', 'snow-brushes', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Generators deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'generators';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Portable Generators', 'Преносими генератори', 'portable-generators', v_parent_id, 1),
      ('Inverter Generators', 'Инверторни генератори', 'inverter-generators', v_parent_id, 2),
      ('Standby Generators', 'Резервни генератори', 'standby-generators', v_parent_id, 3),
      ('Generator Accessories', 'Аксесоари за генератори', 'generator-accessories', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pressure Washers deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pressure-washers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Electric Pressure Washers', 'Електрически водоструйки', 'electric-pressure-washers', v_parent_id, 1),
      ('Gas Pressure Washers', 'Бензинови водоструйки', 'gas-pressure-washers', v_parent_id, 2),
      ('Pressure Washer Accessories', 'Аксесоари за водоструйки', 'pressure-washer-accessories', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Welding deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'welding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Welding Machines', 'Заваръчни апарати', 'welding-machines', v_parent_id, 1),
      ('Welding Helmets', 'Заваръчни маски', 'welding-helmets', v_parent_id, 2),
      ('Welding Gloves', 'Заваръчни ръкавици', 'welding-gloves', v_parent_id, 3),
      ('Welding Wire', 'Заваръчна тел', 'welding-wire', v_parent_id, 4),
      ('Welding Electrodes', 'Заваръчни електроди', 'welding-electrodes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Woodworking deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'woodworking';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wood Lathes', 'Дърводелски стругове', 'wood-lathes', v_parent_id, 1),
      ('Router Tables', 'Фрезови маси', 'router-tables', v_parent_id, 2),
      ('Planers', 'Рендета', 'planers', v_parent_id, 3),
      ('Jointers', 'Фугмашини', 'jointers', v_parent_id, 4),
      ('Scroll Saws', 'Банциги', 'scroll-saws', v_parent_id, 5),
      ('Clamps', 'Стяги', 'clamps', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Metalworking deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'metalworking';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Metal Lathes', 'Метални стругове', 'metal-lathes', v_parent_id, 1),
      ('Milling Machines', 'Фрезови машини', 'milling-machines', v_parent_id, 2),
      ('Band Saws Metal', 'Лентови триони', 'band-saws-metal', v_parent_id, 3),
      ('Metal Files', 'Метални пили', 'metal-files', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
