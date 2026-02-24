
-- Batch 74: Food & Grocery, Tools, and remaining categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Grocery deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'grocery';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Snacks', 'Снаксове', 'snacks', v_parent_id, 1),
      ('Beverages', 'Напитки', 'beverages', v_parent_id, 2),
      ('Canned Goods', 'Консерви', 'canned-goods', v_parent_id, 3),
      ('Condiments', 'Подправки и сосове', 'condiments', v_parent_id, 4),
      ('Breakfast Foods', 'Храни за закуска', 'breakfast-foods', v_parent_id, 5),
      ('Pasta Rice', 'Паста и ориз', 'pasta-rice', v_parent_id, 6),
      ('Baking Supplies', 'Продукти за печене', 'baking-supplies', v_parent_id, 7),
      ('Organic Foods', 'Органични храни', 'organic-foods', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Power Tools deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'power-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Drills', 'Бормашини', 'drills', v_parent_id, 1),
      ('Saws', 'Триони', 'saws', v_parent_id, 2),
      ('Sanders', 'Шлайфмашини', 'sanders', v_parent_id, 3),
      ('Grinders', 'Ъглошлайфи', 'grinders', v_parent_id, 4),
      ('Rotary Tools', 'Ротационни инструменти', 'rotary-tools', v_parent_id, 5),
      ('Impact Drivers', 'Ударни гайковерти', 'impact-drivers', v_parent_id, 6),
      ('Air Compressors', 'Въздушни компресори', 'air-compressors', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hand Tools deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hand-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hammers', 'Чукове', 'hammers', v_parent_id, 1),
      ('Screwdrivers', 'Отвертки', 'screwdrivers', v_parent_id, 2),
      ('Pliers', 'Клещи', 'pliers', v_parent_id, 3),
      ('Wrenches', 'Гаечни ключове', 'wrenches', v_parent_id, 4),
      ('Measuring Tools', 'Измервателни инструменти', 'measuring-tools', v_parent_id, 5),
      ('Levels', 'Нивелири', 'levels', v_parent_id, 6),
      ('Utility Knives', 'Макетни ножове', 'utility-knives', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tool Storage deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tool-storage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tool Boxes', 'Кутии за инструменти', 'tool-boxes', v_parent_id, 1),
      ('Tool Bags', 'Чанти за инструменти', 'tool-bags', v_parent_id, 2),
      ('Tool Chests', 'Сандъци за инструменти', 'tool-chests', v_parent_id, 3),
      ('Workbenches', 'Работни маси', 'workbenches', v_parent_id, 4),
      ('Pegboard Systems', 'Перфорирани табла', 'pegboard-systems', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Safety Equipment deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'safety-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Safety Glasses', 'Предпазни очила', 'safety-glasses', v_parent_id, 1),
      ('Work Gloves', 'Работни ръкавици', 'work-gloves', v_parent_id, 2),
      ('Hard Hats', 'Каски', 'hard-hats', v_parent_id, 3),
      ('Ear Protection', 'Защита за уши', 'ear-protection', v_parent_id, 4),
      ('Respirators', 'Респиратори', 'respirators', v_parent_id, 5),
      ('High Visibility', 'Светлоотразителни облекла', 'high-visibility', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Electrical deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'electrical';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Electrical Wire', 'Електрически кабел', 'electrical-wire', v_parent_id, 1),
      ('Outlets Switches', 'Контакти и ключове', 'outlets-switches', v_parent_id, 2),
      ('Circuit Breakers', 'Предпазители', 'circuit-breakers', v_parent_id, 3),
      ('Electrical Boxes', 'Електрически кутии', 'electrical-boxes', v_parent_id, 4),
      ('Electrical Tape', 'Изолирбанд', 'electrical-tape', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Plumbing deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'plumbing';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Faucets', 'Кранове', 'faucets', v_parent_id, 1),
      ('Pipes Fittings', 'Тръби и фитинги', 'pipes-fittings', v_parent_id, 2),
      ('Toilet Parts', 'Резервни части за тоалетна', 'toilet-parts', v_parent_id, 3),
      ('Sinks', 'Мивки', 'sinks', v_parent_id, 4),
      ('Water Heaters', 'Бойлери', 'water-heaters', v_parent_id, 5),
      ('Plumbing Tools', 'Водопроводни инструменти', 'plumbing-tools', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Building Materials deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'building-materials';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Lumber', 'Дървен материал', 'lumber', v_parent_id, 1),
      ('Drywall', 'Гипсокартон', 'drywall', v_parent_id, 2),
      ('Insulation', 'Изолация', 'insulation', v_parent_id, 3),
      ('Roofing', 'Покривни материали', 'roofing', v_parent_id, 4),
      ('Concrete', 'Бетон', 'concrete', v_parent_id, 5),
      ('Fasteners', 'Крепежни елементи', 'fasteners', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
