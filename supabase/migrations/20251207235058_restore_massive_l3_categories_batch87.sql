-- Batch 87: Final push to 7,100+

-- Heating Pads deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'heating-pads';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Electric Heating Pads', 'Електрически термофори', 'electric-heating-pads', parent_id_var, 1),
      ('Microwaveable Heating Pads', 'Термофори за микровълнова', 'microwaveable-heating-pads', parent_id_var, 2),
      ('Infrared Heating Pads', 'Инфрачервени термофори', 'infrared-heating-pads', parent_id_var, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Pill Organizers deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'pill-organizers';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Daily Pill Organizers', 'Дневни органайзери за хапчета', 'daily-pill-organizers', parent_id_var, 1),
      ('Weekly Pill Organizers', 'Седмични органайзери за хапчета', 'weekly-pill-organizers', parent_id_var, 2),
      ('Travel Pill Cases', 'Калъфи за хапчета за пътуване', 'travel-pill-cases', parent_id_var, 3),
      ('Pill Cutters', 'Резачки за хапчета', 'pill-cutters', parent_id_var, 4),
      ('Pill Crushers', 'Трошачки за хапчета', 'pill-crushers', parent_id_var, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Supplements deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'supplements';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Multivitamins', 'Мултивитамини', 'multivitamins', parent_id_var, 1),
      ('Omega-3 Fish Oil', 'Омега-3 рибено масло', 'omega-3-fish-oil', parent_id_var, 2),
      ('Probiotics', 'Пробиотици', 'probiotics', parent_id_var, 3),
      ('Vitamin D', 'Витамин D', 'vitamin-d', parent_id_var, 4),
      ('Vitamin C', 'Витамин C', 'vitamin-c', parent_id_var, 5),
      ('Calcium', 'Калций', 'calcium-supplements', parent_id_var, 6),
      ('Iron', 'Желязо', 'iron-supplements', parent_id_var, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;;
