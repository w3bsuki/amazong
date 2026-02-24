
-- =====================================================
-- HOME & KITCHEN PART 4: Bedding & Bath + Lighting
-- =====================================================

DO $$
DECLARE
  bedding_id UUID;
  lighting_id UUID;
BEGIN
  SELECT id INTO bedding_id FROM categories WHERE slug = 'bedding-bath';
  SELECT id INTO lighting_id FROM categories WHERE slug = 'lighting';

  -- ========== BEDDING & BATH L2/L3 ==========
  
  -- Bedding
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Bedding', 'Спално бельо', 'bedding-bedding', bedding_id, '🛏️', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Bed Sheets', 'Чаршафи', 'bed-sheets', (SELECT id FROM categories WHERE slug = 'bedding-bedding'), '🛏️', 1),
  ('Duvet Covers', 'Спални комплекти', 'bed-duvet', (SELECT id FROM categories WHERE slug = 'bedding-bedding'), '🛏️', 2),
  ('Comforters', 'Завивки', 'bed-comforter', (SELECT id FROM categories WHERE slug = 'bedding-bedding'), '🛏️', 3),
  ('Blankets & Throws', 'Одеяла', 'bed-blankets', (SELECT id FROM categories WHERE slug = 'bedding-bedding'), '🛏️', 4),
  ('Pillows', 'Възглавници', 'bed-pillows', (SELECT id FROM categories WHERE slug = 'bedding-bedding'), '🛏️', 5),
  ('Pillowcases', 'Калъфки за възглавници', 'bed-pillowcases', (SELECT id FROM categories WHERE slug = 'bedding-bedding'), '🛏️', 6),
  ('Quilts', 'Кувертюри', 'bed-quilts', (SELECT id FROM categories WHERE slug = 'bedding-bedding'), '🛏️', 7),
  ('Bed Skirts', 'Поли за легло', 'bed-skirts', (SELECT id FROM categories WHERE slug = 'bedding-bedding'), '🛏️', 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Towels
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Towels', 'Кърпи', 'bath-towels', bedding_id, '🛁', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Bath Towels', 'Хавлиени кърпи', 'towel-bath', (SELECT id FROM categories WHERE slug = 'bath-towels'), '🛁', 1),
  ('Hand Towels', 'Кърпи за ръце', 'towel-hand', (SELECT id FROM categories WHERE slug = 'bath-towels'), '🧴', 2),
  ('Beach Towels', 'Плажни кърпи', 'towel-beach', (SELECT id FROM categories WHERE slug = 'bath-towels'), '🏖️', 3),
  ('Washcloths', 'Гъби и кърпи', 'towel-wash', (SELECT id FROM categories WHERE slug = 'bath-towels'), '🧽', 4),
  ('Towel Sets', 'Комплекти кърпи', 'towel-sets', (SELECT id FROM categories WHERE slug = 'bath-towels'), '🛁', 5),
  ('Kitchen Towels', 'Кухненски кърпи', 'towel-kitchen', (SELECT id FROM categories WHERE slug = 'bath-towels'), '🍳', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Bathroom Accessories
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Bathroom Accessories', 'Аксесоари за баня', 'bath-accessories', bedding_id, '🚿', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Shower Curtains', 'Завеси за душ', 'bath-curtains', (SELECT id FROM categories WHERE slug = 'bath-accessories'), '🚿', 1),
  ('Bath Mats', 'Постелки за баня', 'bath-mats', (SELECT id FROM categories WHERE slug = 'bath-accessories'), '🛁', 2),
  ('Soap Dispensers', 'Дозатори за сапун', 'bath-dispenser', (SELECT id FROM categories WHERE slug = 'bath-accessories'), '🧴', 3),
  ('Toothbrush Holders', 'Поставки за четка', 'bath-toothbrush', (SELECT id FROM categories WHERE slug = 'bath-accessories'), '🪥', 4),
  ('Bathroom Mirrors', 'Огледала за баня', 'bath-mirror', (SELECT id FROM categories WHERE slug = 'bath-accessories'), '🪞', 5),
  ('Toilet Accessories', 'Тоалетни аксесоари', 'bath-toilet', (SELECT id FROM categories WHERE slug = 'bath-accessories'), '🚽', 6),
  ('Storage & Organizers', 'Организатори', 'bath-storage', (SELECT id FROM categories WHERE slug = 'bath-accessories'), '📦', 7),
  ('Bathroom Scales', 'Кантари', 'bath-scales', (SELECT id FROM categories WHERE slug = 'bath-accessories'), '⚖️', 8)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Bathroom Furniture
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Bathroom Furniture', 'Мебели за баня', 'bath-furniture', bedding_id, '🚿', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Vanities', 'Шкафове с мивка', 'bath-vanity', (SELECT id FROM categories WHERE slug = 'bath-furniture'), '🚰', 1),
  ('Bathroom Cabinets', 'Шкафове за баня', 'bath-cabinets', (SELECT id FROM categories WHERE slug = 'bath-furniture'), '🗄️', 2),
  ('Medicine Cabinets', 'Аптечки', 'bath-medicine', (SELECT id FROM categories WHERE slug = 'bath-furniture'), '💊', 3),
  ('Towel Racks', 'Закачалки за кърпи', 'bath-racks', (SELECT id FROM categories WHERE slug = 'bath-furniture'), '🧺', 4),
  ('Bathroom Shelves', 'Рафтове за баня', 'bath-shelves', (SELECT id FROM categories WHERE slug = 'bath-furniture'), '📦', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- ========== LIGHTING L2/L3 ==========

  -- Ceiling Lights
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Ceiling Lights', 'Таванни лампи', 'light-ceiling', lighting_id, '💡', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Chandeliers', 'Полилеи', 'light-chandelier', (SELECT id FROM categories WHERE slug = 'light-ceiling'), '✨', 1),
  ('Pendant Lights', 'Висящи лампи', 'light-pendant', (SELECT id FROM categories WHERE slug = 'light-ceiling'), '💡', 2),
  ('Flush Mounts', 'Плафони', 'light-flush', (SELECT id FROM categories WHERE slug = 'light-ceiling'), '💡', 3),
  ('Semi-Flush Mounts', 'Полу-плафони', 'light-semiflush', (SELECT id FROM categories WHERE slug = 'light-ceiling'), '💡', 4),
  ('Track Lighting', 'Релсово осветление', 'light-track', (SELECT id FROM categories WHERE slug = 'light-ceiling'), '💡', 5),
  ('Recessed Lighting', 'Вградено осветление', 'light-recessed', (SELECT id FROM categories WHERE slug = 'light-ceiling'), '💡', 6),
  ('Ceiling Fans', 'Тавански вентилатори', 'light-fan', (SELECT id FROM categories WHERE slug = 'light-ceiling'), '🌀', 7)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Wall Lights
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Wall Lights', 'Стенни лампи', 'light-wall', lighting_id, '💡', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Sconces', 'Аплици', 'light-sconce', (SELECT id FROM categories WHERE slug = 'light-wall'), '💡', 1),
  ('Picture Lights', 'Лампи за картини', 'light-picture', (SELECT id FROM categories WHERE slug = 'light-wall'), '🖼️', 2),
  ('Vanity Lights', 'Лампи за баня', 'light-vanity', (SELECT id FROM categories WHERE slug = 'light-wall'), '🚿', 3),
  ('Swing Arm Lamps', 'Подвижни аплици', 'light-swing', (SELECT id FROM categories WHERE slug = 'light-wall'), '💡', 4),
  ('Wall Spotlights', 'Стенни прожектори', 'light-wallspot', (SELECT id FROM categories WHERE slug = 'light-wall'), '🔦', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Table & Floor Lamps
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Table & Floor Lamps', 'Настолни и подови лампи', 'light-table-floor', lighting_id, '🪔', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Table Lamps', 'Настолни лампи', 'light-table', (SELECT id FROM categories WHERE slug = 'light-table-floor'), '🪔', 1),
  ('Desk Lamps', 'Офис лампи', 'light-desk', (SELECT id FROM categories WHERE slug = 'light-table-floor'), '💡', 2),
  ('Floor Lamps', 'Подови лампи', 'light-floor', (SELECT id FROM categories WHERE slug = 'light-table-floor'), '🪔', 3),
  ('Reading Lamps', 'Лампи за четене', 'light-reading', (SELECT id FROM categories WHERE slug = 'light-table-floor'), '📖', 4),
  ('Nightstand Lamps', 'Нощни лампи', 'light-nightstand', (SELECT id FROM categories WHERE slug = 'light-table-floor'), '🛏️', 5),
  ('Touch Lamps', 'Сензорни лампи', 'light-touch', (SELECT id FROM categories WHERE slug = 'light-table-floor'), '👆', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Outdoor Lighting
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Outdoor Lighting', 'Външно осветление', 'light-outdoor', lighting_id, '🌙', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Path Lights', 'Градински лампи', 'light-path', (SELECT id FROM categories WHERE slug = 'light-outdoor'), '🌿', 1),
  ('Porch Lights', 'Лампи за веранда', 'light-porch', (SELECT id FROM categories WHERE slug = 'light-outdoor'), '🏠', 2),
  ('Flood Lights', 'Прожектори', 'light-flood', (SELECT id FROM categories WHERE slug = 'light-outdoor'), '🔦', 3),
  ('Solar Lights', 'Соларни лампи', 'light-solar', (SELECT id FROM categories WHERE slug = 'light-outdoor'), '☀️', 4),
  ('String Lights', 'Декоративни гирлянди', 'light-string', (SELECT id FROM categories WHERE slug = 'light-outdoor'), '✨', 5),
  ('Security Lights', 'Сигурностно осветление', 'light-security', (SELECT id FROM categories WHERE slug = 'light-outdoor'), '🔒', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Smart Lighting
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Smart Lighting', 'Смарт осветление', 'light-smart', lighting_id, '📱', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Smart Bulbs', 'Смарт крушки', 'light-smartbulb', (SELECT id FROM categories WHERE slug = 'light-smart'), '💡', 1),
  ('LED Strips', 'LED ленти', 'light-ledstrip', (SELECT id FROM categories WHERE slug = 'light-smart'), '🌈', 2),
  ('Smart Switches', 'Смарт ключове', 'light-smartswitch', (SELECT id FROM categories WHERE slug = 'light-smart'), '🔌', 3),
  ('Smart Dimmers', 'Димери', 'light-dimmer', (SELECT id FROM categories WHERE slug = 'light-smart'), '💡', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Light Bulbs
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Light Bulbs', 'Крушки', 'light-bulbs', lighting_id, '💡', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('LED Bulbs', 'LED крушки', 'bulb-led', (SELECT id FROM categories WHERE slug = 'light-bulbs'), '💡', 1),
  ('Incandescent', 'Волфрамови', 'bulb-incandescent', (SELECT id FROM categories WHERE slug = 'light-bulbs'), '💡', 2),
  ('CFL Bulbs', 'Енергоспестяващи', 'bulb-cfl', (SELECT id FROM categories WHERE slug = 'light-bulbs'), '💡', 3),
  ('Halogen', 'Халогенни', 'bulb-halogen', (SELECT id FROM categories WHERE slug = 'light-bulbs'), '💡', 4),
  ('Specialty Bulbs', 'Специални крушки', 'bulb-specialty', (SELECT id FROM categories WHERE slug = 'light-bulbs'), '💡', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

END $$;
;
