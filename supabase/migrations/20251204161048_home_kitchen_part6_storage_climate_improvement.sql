
-- =====================================================
-- HOME & KITCHEN PART 6: Storage, Climate, Improvement
-- =====================================================

DO $$
DECLARE
  storage_id UUID;
  climate_id UUID;
  improve_id UUID;
BEGIN
  SELECT id INTO storage_id FROM categories WHERE slug = 'home-storage';
  SELECT id INTO climate_id FROM categories WHERE slug = 'home-climate';
  SELECT id INTO improve_id FROM categories WHERE slug = 'home-improvement';

  -- ========== STORAGE & ORGANIZATION L2/L3 ==========

  -- Closet Organization
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Closet Organization', 'Организация на гардероб', 'store-closet', storage_id, '👔', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Closet Systems', 'Гардеробни системи', 'closet-systems', (SELECT id FROM categories WHERE slug = 'store-closet'), '🗄️', 1),
  ('Hanging Organizers', 'Висящи органайзери', 'closet-hanging', (SELECT id FROM categories WHERE slug = 'store-closet'), '👔', 2),
  ('Drawer Dividers', 'Разделители за чекмеджета', 'closet-dividers', (SELECT id FROM categories WHERE slug = 'store-closet'), '📦', 3),
  ('Shelf Organizers', 'Органайзери за рафтове', 'closet-shelf', (SELECT id FROM categories WHERE slug = 'store-closet'), '📦', 4),
  ('Jewelry Organizers', 'Органайзери за бижута', 'closet-jewelry', (SELECT id FROM categories WHERE slug = 'store-closet'), '💍', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Storage Bins & Boxes
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Storage Bins & Boxes', 'Кутии и контейнери', 'store-bins', storage_id, '📦', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Plastic Bins', 'Пластмасови кутии', 'bin-plastic', (SELECT id FROM categories WHERE slug = 'store-bins'), '📦', 1),
  ('Fabric Bins', 'Текстилни кутии', 'bin-fabric', (SELECT id FROM categories WHERE slug = 'store-bins'), '📦', 2),
  ('Wicker Baskets', 'Ратанови кошници', 'bin-wicker', (SELECT id FROM categories WHERE slug = 'store-bins'), '🧺', 3),
  ('Clear Containers', 'Прозрачни контейнери', 'bin-clear', (SELECT id FROM categories WHERE slug = 'store-bins'), '📦', 4),
  ('Decorative Boxes', 'Декоративни кутии', 'bin-decorative', (SELECT id FROM categories WHERE slug = 'store-bins'), '🎁', 5),
  ('Under-bed Storage', 'Под леглото', 'bin-underbed', (SELECT id FROM categories WHERE slug = 'store-bins'), '🛏️', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Garage & Workshop
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Garage & Workshop', 'Гараж и работилница', 'store-garage', storage_id, '🔧', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Tool Chests', 'Кутии за инструменти', 'garage-toolchest', (SELECT id FROM categories WHERE slug = 'store-garage'), '🧰', 1),
  ('Wall Organizers', 'Стенни органайзери', 'garage-wall', (SELECT id FROM categories WHERE slug = 'store-garage'), '🔧', 2),
  ('Shelving Units', 'Стелажи', 'garage-shelving', (SELECT id FROM categories WHERE slug = 'store-garage'), '📦', 3),
  ('Pegboards', 'Перфорирани дъски', 'garage-pegboard', (SELECT id FROM categories WHERE slug = 'store-garage'), '🔩', 4),
  ('Sports Equipment Storage', 'Съхранение на спортни стоки', 'garage-sports', (SELECT id FROM categories WHERE slug = 'store-garage'), '⚽', 5),
  ('Bike Storage', 'Съхранение на велосипеди', 'garage-bike', (SELECT id FROM categories WHERE slug = 'store-garage'), '🚴', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- ========== CLIMATE CONTROL L2/L3 ==========

  -- Air Conditioning
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Air Conditioning', 'Климатици', 'climate-ac', climate_id, '❄️', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Split AC Units', 'Сплит системи', 'ac-split', (SELECT id FROM categories WHERE slug = 'climate-ac'), '❄️', 1),
  ('Portable AC', 'Преносими климатици', 'ac-portable', (SELECT id FROM categories WHERE slug = 'climate-ac'), '❄️', 2),
  ('Window AC', 'Прозоречни климатици', 'ac-window', (SELECT id FROM categories WHERE slug = 'climate-ac'), '❄️', 3),
  ('AC Parts', 'Части за климатици', 'ac-parts', (SELECT id FROM categories WHERE slug = 'climate-ac'), '🔧', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Heating
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Heating', 'Отопление', 'climate-heating', climate_id, '🔥', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Space Heaters', 'Електрически радиатори', 'heat-space', (SELECT id FROM categories WHERE slug = 'climate-heating'), '🔥', 1),
  ('Radiators', 'Радиатори', 'heat-radiator', (SELECT id FROM categories WHERE slug = 'climate-heating'), '🔥', 2),
  ('Fireplaces', 'Камини', 'heat-fireplace', (SELECT id FROM categories WHERE slug = 'climate-heating'), '🔥', 3),
  ('Heated Blankets', 'Електрически одеяла', 'heat-blanket', (SELECT id FROM categories WHERE slug = 'climate-heating'), '🛏️', 4),
  ('Underfloor Heating', 'Подово отопление', 'heat-underfloor', (SELECT id FROM categories WHERE slug = 'climate-heating'), '🔥', 5),
  ('Boilers', 'Бойлери', 'heat-boiler', (SELECT id FROM categories WHERE slug = 'climate-heating'), '🔥', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Fans
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Fans', 'Вентилатори', 'climate-fans', climate_id, '🌀', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Tower Fans', 'Колонни вентилатори', 'fan-tower', (SELECT id FROM categories WHERE slug = 'climate-fans'), '🌀', 1),
  ('Pedestal Fans', 'Подови вентилатори', 'fan-pedestal', (SELECT id FROM categories WHERE slug = 'climate-fans'), '🌀', 2),
  ('Desk Fans', 'Настолни вентилатори', 'fan-desk', (SELECT id FROM categories WHERE slug = 'climate-fans'), '🌀', 3),
  ('Box Fans', 'Кутиени вентилатори', 'fan-box', (SELECT id FROM categories WHERE slug = 'climate-fans'), '🌀', 4),
  ('Bladeless Fans', 'Безлопаткови вентилатори', 'fan-bladeless', (SELECT id FROM categories WHERE slug = 'climate-fans'), '🌀', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Air Quality
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Air Quality', 'Качество на въздуха', 'climate-air', climate_id, '💨', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Air Purifiers', 'Пречистватели на въздух', 'air-purifier', (SELECT id FROM categories WHERE slug = 'climate-air'), '💨', 1),
  ('Humidifiers', 'Овлажнители', 'air-humidifier', (SELECT id FROM categories WHERE slug = 'climate-air'), '💧', 2),
  ('Dehumidifiers', 'Обезвлажнители', 'air-dehumidifier', (SELECT id FROM categories WHERE slug = 'climate-air'), '💧', 3),
  ('Air Filters', 'Филтри за въздух', 'air-filters', (SELECT id FROM categories WHERE slug = 'climate-air'), '🔬', 4),
  ('CO2 Detectors', 'Детектори за CO2', 'air-co2', (SELECT id FROM categories WHERE slug = 'climate-air'), '⚠️', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- ========== HOME IMPROVEMENT L2/L3 ==========

  -- Painting & Wallpaper
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Painting & Wallpaper', 'Боядисване и тапети', 'improve-paint', improve_id, '🎨', 1)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Interior Paint', 'Интериорни бои', 'paint-interior', (SELECT id FROM categories WHERE slug = 'improve-paint'), '🎨', 1),
  ('Exterior Paint', 'Екстериорни бои', 'paint-exterior', (SELECT id FROM categories WHERE slug = 'improve-paint'), '🏠', 2),
  ('Spray Paint', 'Спрей бои', 'paint-spray', (SELECT id FROM categories WHERE slug = 'improve-paint'), '🎨', 3),
  ('Wallpaper', 'Тапети', 'paint-wallpaper', (SELECT id FROM categories WHERE slug = 'improve-paint'), '🖼️', 4),
  ('Paint Brushes & Rollers', 'Четки и валяци', 'paint-tools', (SELECT id FROM categories WHERE slug = 'improve-paint'), '🖌️', 5),
  ('Primers & Sealers', 'Грундове', 'paint-primer', (SELECT id FROM categories WHERE slug = 'improve-paint'), '🎨', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Flooring
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Flooring', 'Подови настилки', 'improve-flooring', improve_id, '🏠', 2)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Laminate Flooring', 'Ламинат', 'floor-laminate', (SELECT id FROM categories WHERE slug = 'improve-flooring'), '🏠', 1),
  ('Hardwood Flooring', 'Дървен паркет', 'floor-hardwood', (SELECT id FROM categories WHERE slug = 'improve-flooring'), '🌳', 2),
  ('Vinyl Flooring', 'Винил', 'floor-vinyl', (SELECT id FROM categories WHERE slug = 'improve-flooring'), '🏠', 3),
  ('Tile Flooring', 'Плочки', 'floor-tile', (SELECT id FROM categories WHERE slug = 'improve-flooring'), '🏠', 4),
  ('Carpet Tiles', 'Мокет', 'floor-carpet', (SELECT id FROM categories WHERE slug = 'improve-flooring'), '🏠', 5),
  ('Underlayment', 'Подложки', 'floor-underlay', (SELECT id FROM categories WHERE slug = 'improve-flooring'), '🏠', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Hardware
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Hardware', 'Обков', 'improve-hardware', improve_id, '🔩', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Door Hardware', 'Обков за врати', 'hardware-door', (SELECT id FROM categories WHERE slug = 'improve-hardware'), '🚪', 1),
  ('Cabinet Hardware', 'Обков за шкафове', 'hardware-cabinet', (SELECT id FROM categories WHERE slug = 'improve-hardware'), '🗄️', 2),
  ('Locks & Keys', 'Брави и ключове', 'hardware-locks', (SELECT id FROM categories WHERE slug = 'improve-hardware'), '🔐', 3),
  ('Hinges', 'Панти', 'hardware-hinges', (SELECT id FROM categories WHERE slug = 'improve-hardware'), '🔩', 4),
  ('Hooks & Hangers', 'Куки и закачалки', 'hardware-hooks', (SELECT id FROM categories WHERE slug = 'improve-hardware'), '🪝', 5),
  ('Screws & Nails', 'Винтове и пирони', 'hardware-screws', (SELECT id FROM categories WHERE slug = 'improve-hardware'), '🔩', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Plumbing
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Plumbing', 'ВиК', 'improve-plumbing', improve_id, '🚰', 4)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Faucets', 'Смесители', 'plumb-faucets', (SELECT id FROM categories WHERE slug = 'improve-plumbing'), '🚰', 1),
  ('Sinks', 'Мивки', 'plumb-sinks', (SELECT id FROM categories WHERE slug = 'improve-plumbing'), '🚰', 2),
  ('Toilets', 'Тоалетни', 'plumb-toilets', (SELECT id FROM categories WHERE slug = 'improve-plumbing'), '🚽', 3),
  ('Showerheads', 'Душове', 'plumb-shower', (SELECT id FROM categories WHERE slug = 'improve-plumbing'), '🚿', 4),
  ('Pipes & Fittings', 'Тръби и фитинги', 'plumb-pipes', (SELECT id FROM categories WHERE slug = 'improve-plumbing'), '🔧', 5),
  ('Water Heaters', 'Бойлери', 'plumb-heater', (SELECT id FROM categories WHERE slug = 'improve-plumbing'), '🔥', 6)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  -- Electrical
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES ('Electrical', 'Електрика', 'improve-electrical', improve_id, '⚡', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
  ('Outlets & Switches', 'Контакти и ключове', 'elec-outlets', (SELECT id FROM categories WHERE slug = 'improve-electrical'), '🔌', 1),
  ('Cables & Wires', 'Кабели и жици', 'elec-cables', (SELECT id FROM categories WHERE slug = 'improve-electrical'), '⚡', 2),
  ('Circuit Breakers', 'Предпазители', 'elec-breakers', (SELECT id FROM categories WHERE slug = 'improve-electrical'), '⚡', 3),
  ('Extension Cords', 'Удължители', 'elec-extension', (SELECT id FROM categories WHERE slug = 'improve-electrical'), '🔌', 4),
  ('Light Switches', 'Ключове за осветление', 'elec-switches', (SELECT id FROM categories WHERE slug = 'improve-electrical'), '💡', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

END $$;
;
