
-- Batch 37: More deep categories - Home, Kitchen, Furniture
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Kitchen deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cookware';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pots & Pans', 'Тенджери и тигани', 'pots-and-pans', v_parent_id, 1),
      ('Cast Iron Cookware', 'Чугунени съдове', 'cast-iron-cookware', v_parent_id, 2),
      ('Non-Stick Cookware', 'Незалепващи съдове', 'non-stick-cookware', v_parent_id, 3),
      ('Stainless Steel Cookware', 'Неръждаеми съдове', 'stainless-steel-cookware', v_parent_id, 4),
      ('Baking Sheets', 'Тави за печене', 'baking-sheets', v_parent_id, 5),
      ('Roasting Pans', 'Тави за печене', 'roasting-pans', v_parent_id, 6),
      ('Dutch Ovens', 'Холандски фурни', 'dutch-ovens', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'kitchen-appliances';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Coffee Makers', 'Кафемашини', 'coffee-makers', v_parent_id, 1),
      ('Toasters', 'Тостери', 'toasters', v_parent_id, 2),
      ('Blenders', 'Блендери', 'blenders', v_parent_id, 3),
      ('Food Processors', 'Кухненски роботи', 'food-processors', v_parent_id, 4),
      ('Microwaves', 'Микровълнови', 'microwaves', v_parent_id, 5),
      ('Air Fryers', 'Еър фрайъри', 'air-fryers', v_parent_id, 6),
      ('Slow Cookers', 'Слоу кукъри', 'slow-cookers', v_parent_id, 7),
      ('Electric Kettles', 'Електрически кани', 'electric-kettles', v_parent_id, 8),
      ('Stand Mixers', 'Миксери', 'stand-mixers', v_parent_id, 9),
      ('Juicers', 'Сокоизстисквачки', 'juicers', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cutlery';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Chef Knives', 'Готварски ножове', 'chef-knives', v_parent_id, 1),
      ('Knife Sets', 'Комплекти ножове', 'knife-sets', v_parent_id, 2),
      ('Steak Knives', 'Ножове за стек', 'steak-knives', v_parent_id, 3),
      ('Paring Knives', 'Ножове за белене', 'paring-knives', v_parent_id, 4),
      ('Bread Knives', 'Ножове за хляб', 'bread-knives', v_parent_id, 5),
      ('Knife Sharpeners', 'Точила за ножове', 'knife-sharpeners', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Furniture deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sofas-couches';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sectional Sofas', 'Секционни дивани', 'sectional-sofas', v_parent_id, 1),
      ('Sleeper Sofas', 'Разтегателни дивани', 'sleeper-sofas', v_parent_id, 2),
      ('Leather Sofas', 'Кожени дивани', 'leather-sofas', v_parent_id, 3),
      ('Loveseats', 'Двуместни дивани', 'loveseats', v_parent_id, 4),
      ('Reclining Sofas', 'Релакс дивани', 'reclining-sofas', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'chairs';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Accent Chairs', 'Акцентни столове', 'accent-chairs', v_parent_id, 1),
      ('Recliners', 'Релакс кресла', 'recliners', v_parent_id, 2),
      ('Rocking Chairs', 'Люлеещи столове', 'rocking-chairs', v_parent_id, 3),
      ('Office Chairs', 'Офис столове', 'office-chairs-furniture', v_parent_id, 4),
      ('Gaming Chairs', 'Гейминг столове', 'gaming-chairs', v_parent_id, 5),
      ('Dining Chairs', 'Трапезни столове', 'dining-chairs', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tables';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dining Tables', 'Трапезни маси', 'dining-tables', v_parent_id, 1),
      ('Coffee Tables', 'Холни маси', 'coffee-tables', v_parent_id, 2),
      ('End Tables', 'Странични масички', 'end-tables', v_parent_id, 3),
      ('Console Tables', 'Конзолни маси', 'console-tables', v_parent_id, 4),
      ('Desks', 'Бюра', 'desks', v_parent_id, 5),
      ('Standing Desks', 'Стоящи бюра', 'standing-desks', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bedroom deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'beds';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Platform Beds', 'Платформени легла', 'platform-beds', v_parent_id, 1),
      ('Storage Beds', 'Легла с място за съхранение', 'storage-beds', v_parent_id, 2),
      ('Canopy Beds', 'Легла с балдахин', 'canopy-beds', v_parent_id, 3),
      ('Bunk Beds', 'Двуетажни легла', 'bunk-beds', v_parent_id, 4),
      ('Daybeds', 'Дневни легла', 'daybeds', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mattresses';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Memory Foam Mattresses', 'Мемори матраци', 'memory-foam-mattresses', v_parent_id, 1),
      ('Spring Mattresses', 'Пружинни матраци', 'spring-mattresses', v_parent_id, 2),
      ('Hybrid Mattresses', 'Хибридни матраци', 'hybrid-mattresses', v_parent_id, 3),
      ('Latex Mattresses', 'Латексови матраци', 'latex-mattresses', v_parent_id, 4),
      ('Mattress Toppers', 'Топери за матраци', 'mattress-toppers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bathroom deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bathroom-fixtures';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Toilets', 'Тоалетни', 'toilets', v_parent_id, 1),
      ('Bathroom Sinks', 'Мивки за баня', 'bathroom-sinks', v_parent_id, 2),
      ('Bathtubs', 'Вани', 'bathtubs', v_parent_id, 3),
      ('Shower Doors', 'Душ врати', 'shower-doors', v_parent_id, 4),
      ('Faucets', 'Смесители', 'faucets', v_parent_id, 5),
      ('Showerheads', 'Душове', 'showerheads', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Outdoor deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'patio-furniture';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Outdoor Dining Sets', 'Градински маси за хранене', 'outdoor-dining-sets', v_parent_id, 1),
      ('Outdoor Sofas', 'Градински дивани', 'outdoor-sofas', v_parent_id, 2),
      ('Outdoor Chairs', 'Градински столове', 'outdoor-chairs', v_parent_id, 3),
      ('Hammocks', 'Хамаци', 'hammocks', v_parent_id, 4),
      ('Outdoor Benches', 'Градински пейки', 'outdoor-benches', v_parent_id, 5),
      ('Patio Umbrellas', 'Градински чадъри', 'patio-umbrellas', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'grills-outdoor-cooking';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gas Grills', 'Газови скари', 'gas-grills', v_parent_id, 1),
      ('Charcoal Grills', 'Въглищни скари', 'charcoal-grills', v_parent_id, 2),
      ('Electric Grills', 'Електрически скари', 'electric-grills', v_parent_id, 3),
      ('Smokers', 'Пушилни', 'smokers', v_parent_id, 4),
      ('Pizza Ovens', 'Пещи за пица', 'pizza-ovens', v_parent_id, 5),
      ('Grill Accessories', 'Аксесоари за скара', 'grill-accessories', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Storage deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'closet-organizers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hanging Organizers', 'Висящи органайзери', 'hanging-organizers', v_parent_id, 1),
      ('Shoe Racks', 'Стойки за обувки', 'shoe-racks', v_parent_id, 2),
      ('Closet Systems', 'Гардеробни системи', 'closet-systems', v_parent_id, 3),
      ('Storage Boxes', 'Кутии за съхранение', 'storage-boxes', v_parent_id, 4),
      ('Drawer Organizers', 'Органайзери за чекмеджета', 'drawer-organizers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'garage-storage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tool Cabinets', 'Шкафове за инструменти', 'tool-cabinets', v_parent_id, 1),
      ('Wall Organizers', 'Стенни органайзери', 'wall-organizers', v_parent_id, 2),
      ('Garage Shelving', 'Гаражни рафтове', 'garage-shelving', v_parent_id, 3),
      ('Bike Storage', 'Съхранение на велосипеди', 'bike-storage', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
