
-- Batch 75: Final batch - Flooring, Paint, and miscellaneous
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Flooring deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'flooring';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hardwood Flooring', 'Паркет', 'hardwood-flooring', v_parent_id, 1),
      ('Laminate Flooring', 'Ламинат', 'laminate-flooring', v_parent_id, 2),
      ('Tile Flooring', 'Плочки за под', 'tile-flooring', v_parent_id, 3),
      ('Vinyl Flooring', 'Винил за под', 'vinyl-flooring', v_parent_id, 4),
      ('Carpet Flooring', 'Мокет', 'carpet-flooring', v_parent_id, 5),
      ('Floor Underlayment', 'Подложки за под', 'floor-underlayment', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Paint deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'paint';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Interior Paint', 'Боя за интериор', 'interior-paint', v_parent_id, 1),
      ('Exterior Paint', 'Боя за екстериор', 'exterior-paint', v_parent_id, 2),
      ('Primers', 'Грундове', 'primers', v_parent_id, 3),
      ('Spray Paint', 'Спрей боя', 'spray-paint', v_parent_id, 4),
      ('Stains', 'Лакобайцове', 'stains', v_parent_id, 5),
      ('Paint Brushes', 'Четки за боядисване', 'paint-brushes', v_parent_id, 6),
      ('Paint Rollers', 'Валяци за боядисване', 'paint-rollers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Doors Windows deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'doors-windows';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Interior Doors', 'Интериорни врати', 'interior-doors', v_parent_id, 1),
      ('Exterior Doors', 'Входни врати', 'exterior-doors', v_parent_id, 2),
      ('Storm Doors', 'Врати за буря', 'storm-doors', v_parent_id, 3),
      ('Windows', 'Прозорци', 'windows', v_parent_id, 4),
      ('Door Hardware', 'Обков за врати', 'door-hardware', v_parent_id, 5),
      ('Window Hardware', 'Обков за прозорци', 'window-hardware', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Lighting Home deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'lighting-home';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Ceiling Lights', 'Таванни лампи', 'ceiling-lights', v_parent_id, 1),
      ('Chandeliers', 'Полилеи', 'chandeliers', v_parent_id, 2),
      ('Pendant Lights', 'Висящи лампи', 'pendant-lights', v_parent_id, 3),
      ('Recessed Lighting', 'Вградено осветление', 'recessed-lighting', v_parent_id, 4),
      ('Floor Lamps', 'Лампиони', 'floor-lamps', v_parent_id, 5),
      ('Table Lamps', 'Настолни лампи', 'table-lamps', v_parent_id, 6),
      ('Light Bulbs', 'Крушки', 'light-bulbs', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Appliances deeper (major appliances)
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'appliances';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Refrigerators Appliance', 'Хладилници', 'refrigerators-appliance', v_parent_id, 1),
      ('Washers', 'Перални машини', 'washers', v_parent_id, 2),
      ('Dryers', 'Сушилни', 'dryers', v_parent_id, 3),
      ('Dishwashers', 'Съдомиялни', 'dishwashers', v_parent_id, 4),
      ('Ranges', 'Готварски печки', 'ranges', v_parent_id, 5),
      ('Ovens', 'Фурни', 'ovens', v_parent_id, 6),
      ('Freezers', 'Фризери', 'freezers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Heating Cooling deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'heating-cooling';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Air Conditioners', 'Климатици', 'air-conditioners', v_parent_id, 1),
      ('Space Heaters', 'Електрически печки', 'space-heaters', v_parent_id, 2),
      ('Ceiling Fans', 'Тавани вентилатори', 'ceiling-fans', v_parent_id, 3),
      ('Portable Fans', 'Преносими вентилатори', 'portable-fans', v_parent_id, 4),
      ('Air Purifiers', 'Пречистватели на въздух', 'air-purifiers', v_parent_id, 5),
      ('Humidifiers', 'Овлажнители', 'humidifiers', v_parent_id, 6),
      ('Dehumidifiers', 'Обезвлажнители', 'dehumidifiers', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Vacuum Cleaners deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vacuum-cleaners';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Upright Vacuums', 'Вертикални прахосмукачки', 'upright-vacuums', v_parent_id, 1),
      ('Canister Vacuums', 'Цилиндрични прахосмукачки', 'canister-vacuums', v_parent_id, 2),
      ('Robot Vacuums', 'Роботизирани прахосмукачки', 'robot-vacuums', v_parent_id, 3),
      ('Stick Vacuums', 'Безкабелни прахосмукачки', 'stick-vacuums', v_parent_id, 4),
      ('Handheld Vacuums', 'Ръчни прахосмукачки', 'handheld-vacuums', v_parent_id, 5),
      ('Wet Dry Vacuums', 'Прахо и водосмукачки', 'wet-dry-vacuums', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
