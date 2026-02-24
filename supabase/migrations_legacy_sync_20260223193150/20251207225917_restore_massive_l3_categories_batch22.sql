
-- Batch 22: Home & Garden deep categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Furniture L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'living-room-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sofas', 'Дивани', 'sofas', v_parent_id, 1),
      ('Sectionals', 'Ъглови дивани', 'sectionals', v_parent_id, 2),
      ('Loveseats', 'Двуместни дивани', 'loveseats', v_parent_id, 3),
      ('Coffee Tables', 'Холни маси', 'coffee-tables', v_parent_id, 4),
      ('End Tables', 'Помощни масички', 'end-tables', v_parent_id, 5),
      ('TV Stands', 'Шкафове за телевизор', 'tv-stands', v_parent_id, 6),
      ('Entertainment Centers', 'Секции за развлечения', 'entertainment-centers', v_parent_id, 7),
      ('Recliners', 'Реклайнери', 'recliners', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bedroom-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Beds', 'Легла', 'beds', v_parent_id, 1),
      ('Mattresses', 'Матраци', 'mattresses', v_parent_id, 2),
      ('Dressers', 'Скринове', 'dressers', v_parent_id, 3),
      ('Nightstands', 'Нощни шкафчета', 'nightstands', v_parent_id, 4),
      ('Wardrobes', 'Гардероби', 'wardrobes', v_parent_id, 5),
      ('Bedroom Sets', 'Спални комплекти', 'bedroom-sets', v_parent_id, 6),
      ('Headboards', 'Табли', 'headboards', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dining-room-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dining Tables', 'Трапезни маси', 'dining-tables', v_parent_id, 1),
      ('Dining Chairs', 'Трапезни столове', 'dining-chairs', v_parent_id, 2),
      ('Dining Sets', 'Трапезни комплекти', 'dining-sets', v_parent_id, 3),
      ('Buffets & Sideboards', 'Бюфети и сервизни шкафове', 'buffets-sideboards', v_parent_id, 4),
      ('China Cabinets', 'Витрини', 'china-cabinets', v_parent_id, 5),
      ('Bar Furniture', 'Бар мебели', 'bar-furniture', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'office-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Office Desks', 'Офис бюра', 'office-desks', v_parent_id, 1),
      ('Office Chairs', 'Офис столове', 'office-chairs', v_parent_id, 2),
      ('Bookcases', 'Библиотеки', 'bookcases', v_parent_id, 3),
      ('Filing Cabinets', 'Шкафове за документи', 'filing-cabinets', v_parent_id, 4),
      ('Standing Desks', 'Бюра за работа прав', 'standing-desks', v_parent_id, 5),
      ('Desk Accessories', 'Аксесоари за бюро', 'desk-accessories-furniture', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kids-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Kids Beds', 'Детски легла', 'kids-beds', v_parent_id, 1),
      ('Bunk Beds', 'Двуетажни легла', 'bunk-beds', v_parent_id, 2),
      ('Kids Desks', 'Детски бюра', 'kids-desks', v_parent_id, 3),
      ('Kids Chairs', 'Детски столове', 'kids-chairs', v_parent_id, 4),
      ('Toy Storage', 'Съхранение за играчки', 'toy-storage', v_parent_id, 5),
      ('Kids Dressers', 'Детски скринове', 'kids-dressers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Kitchen L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cookware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pots & Pans', 'Тенджери и тигани', 'pots-pans', v_parent_id, 1),
      ('Skillets', 'Тигани', 'skillets', v_parent_id, 2),
      ('Dutch Ovens', 'Чугунени тенджери', 'dutch-ovens', v_parent_id, 3),
      ('Woks', 'Уокове', 'woks', v_parent_id, 4),
      ('Bakeware', 'Съдове за печене', 'bakeware', v_parent_id, 5),
      ('Cookware Sets', 'Комплекти за готвене', 'cookware-sets', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'small-appliances';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Blenders', 'Блендери', 'blenders', v_parent_id, 1),
      ('Food Processors', 'Кухненски роботи', 'food-processors', v_parent_id, 2),
      ('Mixers', 'Миксери', 'mixers', v_parent_id, 3),
      ('Coffee Makers', 'Кафемашини', 'coffee-makers', v_parent_id, 4),
      ('Toasters', 'Тостери', 'toasters', v_parent_id, 5),
      ('Air Fryers', 'Еър фрайъри', 'air-fryers', v_parent_id, 6),
      ('Slow Cookers', 'Уреди за бавно готвене', 'slow-cookers', v_parent_id, 7),
      ('Juicers', 'Сокоизстисквачки', 'juicers', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cutlery-knives';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Chef Knives', 'Готварски ножове', 'chef-knives', v_parent_id, 1),
      ('Knife Sets', 'Комплекти ножове', 'knife-sets', v_parent_id, 2),
      ('Bread Knives', 'Ножове за хляб', 'bread-knives', v_parent_id, 3),
      ('Paring Knives', 'Ножове за белене', 'paring-knives', v_parent_id, 4),
      ('Knife Sharpeners', 'Точила за ножове', 'knife-sharpeners', v_parent_id, 5),
      ('Knife Blocks', 'Поставки за ножове', 'knife-blocks', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kitchen-storage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Food Storage Containers', 'Контейнери за храна', 'food-storage-containers', v_parent_id, 1),
      ('Pantry Organization', 'Организация на килер', 'pantry-organization', v_parent_id, 2),
      ('Spice Racks', 'Стойки за подправки', 'spice-racks', v_parent_id, 3),
      ('Drawer Organizers', 'Организатори за чекмеджета', 'drawer-organizers', v_parent_id, 4),
      ('Kitchen Canisters', 'Кухненски бурканчета', 'kitchen-canisters', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bathroom L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bathroom-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bathroom Vanities', 'Мебели за баня', 'bathroom-vanities', v_parent_id, 1),
      ('Medicine Cabinets', 'Шкафове с огледало', 'medicine-cabinets', v_parent_id, 2),
      ('Bathroom Shelves', 'Рафтове за баня', 'bathroom-shelves', v_parent_id, 3),
      ('Bathroom Cabinets', 'Шкафове за баня', 'bathroom-cabinets', v_parent_id, 4),
      ('Bathroom Mirrors', 'Огледала за баня', 'bathroom-mirrors', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bathroom-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Towel Bars', 'Закачалки за кърпи', 'towel-bars', v_parent_id, 1),
      ('Shower Curtains', 'Завеси за душ', 'shower-curtains', v_parent_id, 2),
      ('Bath Mats', 'Килимчета за баня', 'bath-mats', v_parent_id, 3),
      ('Soap Dispensers', 'Дозатори за сапун', 'soap-dispensers', v_parent_id, 4),
      ('Toilet Paper Holders', 'Поставки за тоалетна хартия', 'toilet-paper-holders', v_parent_id, 5),
      ('Bathroom Sets', 'Комплекти за баня', 'bathroom-sets', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Home Decor L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wall-decor';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wall Art', 'Стенно изкуство', 'wall-art', v_parent_id, 1),
      ('Mirrors', 'Огледала', 'decorative-mirrors', v_parent_id, 2),
      ('Wall Clocks', 'Стенни часовници', 'wall-clocks', v_parent_id, 3),
      ('Wall Shelves', 'Стенни рафтове', 'wall-shelves', v_parent_id, 4),
      ('Tapestries', 'Гоблени', 'tapestries', v_parent_id, 5),
      ('Photo Frames', 'Рамки за снимки', 'photo-frames', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'lighting';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Ceiling Lights', 'Таванни лампи', 'ceiling-lights', v_parent_id, 1),
      ('Floor Lamps', 'Подови лампи', 'floor-lamps', v_parent_id, 2),
      ('Table Lamps', 'Настолни лампи', 'table-lamps', v_parent_id, 3),
      ('Chandeliers', 'Полилеи', 'chandeliers', v_parent_id, 4),
      ('Wall Sconces', 'Аплици', 'wall-sconces', v_parent_id, 5),
      ('Outdoor Lighting', 'Външно осветление', 'outdoor-lighting', v_parent_id, 6),
      ('Smart Lighting', 'Смарт осветление', 'smart-lighting', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'rugs-carpets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Area Rugs', 'Килими', 'area-rugs', v_parent_id, 1),
      ('Runner Rugs', 'Пътеки', 'runner-rugs', v_parent_id, 2),
      ('Outdoor Rugs', 'Външни килими', 'outdoor-rugs', v_parent_id, 3),
      ('Rug Pads', 'Подложки за килими', 'rug-pads', v_parent_id, 4),
      ('Carpet Tiles', 'Килимени плочки', 'carpet-tiles', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'curtains-blinds';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Curtains', 'Пердета', 'curtains', v_parent_id, 1),
      ('Blinds', 'Щори', 'blinds', v_parent_id, 2),
      ('Shades', 'Сенници', 'shades', v_parent_id, 3),
      ('Curtain Rods', 'Корнизи за пердета', 'curtain-rods', v_parent_id, 4),
      ('Valances', 'Корнизни завеси', 'valances', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
