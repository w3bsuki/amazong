
-- Batch 56: More categories - Paint, Hardware, HVAC, Plumbing fixtures
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Paint deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'paint';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Interior Paint', 'Интериорна боя', 'interior-paint', v_parent_id, 1),
      ('Exterior Paint', 'Екстериорна боя', 'exterior-paint', v_parent_id, 2),
      ('Primer', 'Грунд', 'primer', v_parent_id, 3),
      ('Spray Paint', 'Спрей боя', 'spray-paint', v_parent_id, 4),
      ('Stains', 'Лакобейци', 'stains', v_parent_id, 5),
      ('Paint Supplies', 'Консумативи за боядисване', 'paint-supplies', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'paint-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Paint Brushes', 'Четки за боя', 'paint-brushes-home', v_parent_id, 1),
      ('Paint Rollers', 'Валяци за боя', 'paint-rollers', v_parent_id, 2),
      ('Paint Trays', 'Тави за боя', 'paint-trays', v_parent_id, 3),
      ('Painters Tape', 'Тиксо за боядисване', 'painters-tape', v_parent_id, 4),
      ('Drop Cloths', 'Покривала', 'drop-cloths', v_parent_id, 5),
      ('Sandpaper', 'Шкурка', 'sandpaper', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hardware deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hardware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Screws', 'Винтове', 'screws', v_parent_id, 1),
      ('Nails', 'Пирони', 'nails', v_parent_id, 2),
      ('Bolts & Nuts', 'Болтове и гайки', 'bolts-nuts', v_parent_id, 3),
      ('Anchors', 'Дюбели', 'anchors-hardware', v_parent_id, 4),
      ('Hooks', 'Куки', 'hooks', v_parent_id, 5),
      ('Hinges', 'Панти', 'hinges', v_parent_id, 6),
      ('Drawer Slides', 'Водачи за чекмеджета', 'drawer-slides', v_parent_id, 7),
      ('Cabinet Hardware', 'Обков за шкафове', 'cabinet-hardware', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Doors deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'doors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Interior Doors', 'Интериорни врати', 'interior-doors', v_parent_id, 1),
      ('Exterior Doors', 'Входни врати', 'exterior-doors', v_parent_id, 2),
      ('Storm Doors', 'Защитни врати', 'storm-doors', v_parent_id, 3),
      ('Patio Doors', 'Тераси врати', 'patio-doors', v_parent_id, 4),
      ('Garage Doors', 'Гаражни врати', 'garage-doors', v_parent_id, 5),
      ('Door Hardware', 'Обков за врати', 'door-hardware', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Windows deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'windows';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Vinyl Windows', 'PVC прозорци', 'vinyl-windows', v_parent_id, 1),
      ('Wood Windows', 'Дървени прозорци', 'wood-windows', v_parent_id, 2),
      ('Skylights', 'Покривни прозорци', 'skylights', v_parent_id, 3),
      ('Window Hardware', 'Обков за прозорци', 'window-hardware', v_parent_id, 4),
      ('Window Film', 'Фолио за прозорци', 'window-film', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- HVAC deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hvac';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Air Conditioners', 'Климатици', 'air-conditioners', v_parent_id, 1),
      ('Furnaces', 'Пещи', 'furnaces', v_parent_id, 2),
      ('Heat Pumps', 'Термопомпи', 'heat-pumps', v_parent_id, 3),
      ('Air Filters', 'Въздушни филтри', 'air-filters', v_parent_id, 4),
      ('Ductwork', 'Въздуховоди', 'ductwork', v_parent_id, 5),
      ('Thermostats HVAC', 'Термостати', 'thermostats-hvac', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kitchen Fixtures deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kitchen-fixtures';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Kitchen Sinks', 'Кухненски мивки', 'kitchen-sinks', v_parent_id, 1),
      ('Kitchen Faucets', 'Кухненски смесители', 'kitchen-faucets', v_parent_id, 2),
      ('Garbage Disposals', 'Измелчители', 'garbage-disposals', v_parent_id, 3),
      ('Range Hoods', 'Аспиратори', 'range-hoods', v_parent_id, 4),
      ('Water Filtration', 'Филтри за вода', 'water-filtration', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Appliances deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'major-appliances';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Refrigerators', 'Хладилници', 'refrigerators', v_parent_id, 1),
      ('Ovens & Ranges', 'Печки и фурни', 'ovens-ranges', v_parent_id, 2),
      ('Dishwashers', 'Съдомиялни', 'dishwashers', v_parent_id, 3),
      ('Freezers', 'Фризери', 'freezers', v_parent_id, 4),
      ('Washers', 'Перални', 'washers', v_parent_id, 5),
      ('Dryers', 'Сушилни машини', 'dryers-appliances', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Small Kitchen Appliances deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'small-kitchen-appliances';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bread Makers', 'Хлебопекарни', 'bread-makers', v_parent_id, 1),
      ('Rice Cookers', 'Уреди за ориз', 'rice-cookers', v_parent_id, 2),
      ('Pressure Cookers', 'Тенджери под налягане', 'pressure-cookers', v_parent_id, 3),
      ('Waffle Makers', 'Гофретници', 'waffle-makers', v_parent_id, 4),
      ('Ice Cream Makers', 'Машини за сладолед', 'ice-cream-makers', v_parent_id, 5),
      ('Food Dehydrators', 'Дехидратори', 'food-dehydrators', v_parent_id, 6),
      ('Electric Grills', 'Електрически скари', 'electric-grills-appliance', v_parent_id, 7),
      ('Meat Grinders', 'Месомелачки', 'meat-grinders', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Vacuum Types deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vacuum-cleaners';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Upright Vacuums', 'Вертикални прахосмукачки', 'upright-vacuums', v_parent_id, 1),
      ('Canister Vacuums', 'Цилиндрични прахосмукачки', 'canister-vacuums', v_parent_id, 2),
      ('Robot Vacuums', 'Роботи прахосмукачки', 'robot-vacuums', v_parent_id, 3),
      ('Stick Vacuums', 'Вертикални безжични', 'stick-vacuums', v_parent_id, 4),
      ('Handheld Vacuums', 'Ръчни прахосмукачки', 'handheld-vacuums', v_parent_id, 5),
      ('Wet/Dry Vacuums', 'Мокро/сухо', 'wet-dry-vacuums', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
