
-- Batch 50: Final detailed categories - Home decor, Bedding, Lighting, more
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Home Decor deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wall-decor';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wall Art', 'Стенно изкуство', 'wall-art', v_parent_id, 1),
      ('Mirrors', 'Огледала', 'mirrors', v_parent_id, 2),
      ('Wall Clocks', 'Стенни часовници', 'wall-clocks', v_parent_id, 3),
      ('Tapestries', 'Гоблени', 'tapestries', v_parent_id, 4),
      ('Wall Shelves', 'Стенни рафтове', 'wall-shelves', v_parent_id, 5),
      ('Photo Frames', 'Рамки за снимки', 'photo-frames', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'decorative-accents';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Vases', 'Вази', 'vases', v_parent_id, 1),
      ('Candles', 'Свещи', 'candles', v_parent_id, 2),
      ('Candle Holders', 'Свещници', 'candle-holders', v_parent_id, 3),
      ('Sculptures', 'Скулптури', 'sculptures', v_parent_id, 4),
      ('Figurines', 'Фигурки', 'figurines', v_parent_id, 5),
      ('Decorative Bowls', 'Декоративни купи', 'decorative-bowls', v_parent_id, 6),
      ('Artificial Plants', 'Изкуствени растения', 'artificial-plants', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bedding deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bedding';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sheets', 'Чаршафи', 'sheets', v_parent_id, 1),
      ('Duvet Covers', 'Калъфки за завивки', 'duvet-covers', v_parent_id, 2),
      ('Comforters', 'Юргани', 'comforters', v_parent_id, 3),
      ('Blankets', 'Одеяла', 'blankets', v_parent_id, 4),
      ('Pillows', 'Възглавници', 'pillows', v_parent_id, 5),
      ('Pillowcases', 'Калъфки за възглавници', 'pillowcases', v_parent_id, 6),
      ('Bed Skirts', 'Поли за легло', 'bed-skirts', v_parent_id, 7),
      ('Quilts', 'Шалтета', 'quilts', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bath deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bath-towels';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bath Towels', 'Хавлии за баня', 'bath-towels-main', v_parent_id, 1),
      ('Hand Towels', 'Хавлии за ръце', 'hand-towels', v_parent_id, 2),
      ('Washcloths', 'Гъби за баня', 'washcloths', v_parent_id, 3),
      ('Bath Sheets', 'Хавлиени чаршафи', 'bath-sheets', v_parent_id, 4),
      ('Beach Towels', 'Плажни кърпи', 'beach-towels', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bathroom-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Shower Curtains', 'Завеси за душ', 'shower-curtains', v_parent_id, 1),
      ('Bath Mats', 'Килимчета за баня', 'bath-mats', v_parent_id, 2),
      ('Soap Dispensers', 'Дозатори за сапун', 'soap-dispensers', v_parent_id, 3),
      ('Toothbrush Holders', 'Поставки за четки', 'toothbrush-holders', v_parent_id, 4),
      ('Bathroom Shelves', 'Рафтове за баня', 'bathroom-shelves', v_parent_id, 5),
      ('Towel Racks', 'Закачалки за хавлии', 'towel-racks', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Lighting deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'ceiling-lights';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Chandeliers', 'Полилеи', 'chandeliers', v_parent_id, 1),
      ('Pendant Lights', 'Висящи лампи', 'pendant-lights', v_parent_id, 2),
      ('Flush Mount Lights', 'Плафони', 'flush-mount-lights', v_parent_id, 3),
      ('Track Lighting', 'Релсово осветление', 'track-lighting', v_parent_id, 4),
      ('Recessed Lighting', 'Вградено осветление', 'recessed-lighting', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'lamps';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Table Lamps', 'Настолни лампи', 'table-lamps', v_parent_id, 1),
      ('Floor Lamps', 'Подови лампи', 'floor-lamps', v_parent_id, 2),
      ('Desk Lamps', 'Лампи за бюро', 'desk-lamps', v_parent_id, 3),
      ('Bedside Lamps', 'Нощни лампи', 'bedside-lamps', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'outdoor-lighting';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Path Lights', 'Алейни лампи', 'path-lights', v_parent_id, 1),
      ('Wall Sconces', 'Стенни аплици', 'wall-sconces', v_parent_id, 2),
      ('String Lights', 'Гирлянди', 'string-lights', v_parent_id, 3),
      ('Solar Lights', 'Соларни лампи', 'solar-lights', v_parent_id, 4),
      ('Security Lights', 'Охранително осветление', 'security-lights', v_parent_id, 5),
      ('Post Lights', 'Стълбови лампи', 'post-lights', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Window Treatments deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'window-treatments';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Curtains', 'Завеси', 'curtains', v_parent_id, 1),
      ('Blinds', 'Щори', 'blinds', v_parent_id, 2),
      ('Shades', 'Сенници', 'shades', v_parent_id, 3),
      ('Curtain Rods', 'Корнизи', 'curtain-rods', v_parent_id, 4),
      ('Valances', 'Валанси', 'valances', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Rugs deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'rugs';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Area Rugs', 'Килими', 'area-rugs', v_parent_id, 1),
      ('Runner Rugs', 'Пътеки', 'runner-rugs', v_parent_id, 2),
      ('Round Rugs', 'Кръгли килими', 'round-rugs', v_parent_id, 3),
      ('Outdoor Rugs', 'Външни килими', 'outdoor-rugs', v_parent_id, 4),
      ('Shag Rugs', 'Рошави килими', 'shag-rugs', v_parent_id, 5),
      ('Oriental Rugs', 'Ориенталски килими', 'oriental-rugs', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kitchen Textiles deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kitchen-textiles';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dish Towels', 'Кухненски кърпи', 'dish-towels', v_parent_id, 1),
      ('Oven Mitts', 'Ръкавици за фурна', 'oven-mitts', v_parent_id, 2),
      ('Aprons', 'Престилки', 'aprons', v_parent_id, 3),
      ('Pot Holders', 'Подложки за горещи', 'pot-holders', v_parent_id, 4),
      ('Table Linens', 'Покривки за маса', 'table-linens', v_parent_id, 5),
      ('Placemats', 'Подложки за хранене', 'placemats', v_parent_id, 6),
      ('Napkins', 'Салфетки', 'napkins', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
