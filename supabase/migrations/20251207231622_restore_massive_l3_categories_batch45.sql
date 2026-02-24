
-- Batch 45: Final batch - Food, Travel, Luggage, misc categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Food & Grocery deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'groceries';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fresh Produce', 'Пресни плодове и зеленчуци', 'fresh-produce', v_parent_id, 1),
      ('Dairy Products', 'Млечни продукти', 'dairy-products', v_parent_id, 2),
      ('Meat & Seafood', 'Месо и морски дарове', 'meat-seafood', v_parent_id, 3),
      ('Bakery', 'Хлебни изделия', 'bakery', v_parent_id, 4),
      ('Canned Goods', 'Консерви', 'canned-goods', v_parent_id, 5),
      ('Frozen Foods', 'Замразени храни', 'frozen-foods', v_parent_id, 6),
      ('Snacks', 'Снакси', 'snacks', v_parent_id, 7),
      ('Beverages', 'Напитки', 'beverages', v_parent_id, 8),
      ('Condiments', 'Подправки', 'condiments', v_parent_id, 9),
      ('Organic Foods', 'Био продукти', 'organic-foods', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'gourmet-foods';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Specialty Cheeses', 'Специални сирена', 'specialty-cheeses', v_parent_id, 1),
      ('Gourmet Chocolate', 'Гурме шоколад', 'gourmet-chocolate', v_parent_id, 2),
      ('Olive Oil', 'Зехтин', 'olive-oil', v_parent_id, 3),
      ('Specialty Coffee', 'Специално кафе', 'specialty-coffee', v_parent_id, 4),
      ('Specialty Tea', 'Специален чай', 'specialty-tea', v_parent_id, 5),
      ('Truffle Products', 'Продукти с трюфели', 'truffle-products', v_parent_id, 6),
      ('Imported Foods', 'Вносни храни', 'imported-foods', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Travel & Luggage deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'luggage';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Carry-On Luggage', 'Ръчен багаж', 'carry-on-luggage', v_parent_id, 1),
      ('Checked Luggage', 'Регистриран багаж', 'checked-luggage', v_parent_id, 2),
      ('Luggage Sets', 'Комплекти куфари', 'luggage-sets', v_parent_id, 3),
      ('Hardside Luggage', 'Твърди куфари', 'hardside-luggage', v_parent_id, 4),
      ('Softside Luggage', 'Меки куфари', 'softside-luggage', v_parent_id, 5),
      ('Spinner Luggage', 'Куфари с колелца', 'spinner-luggage', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'travel-bags';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Duffel Bags', 'Дъфел чанти', 'duffel-bags', v_parent_id, 1),
      ('Garment Bags', 'Калъфи за дрехи', 'garment-bags', v_parent_id, 2),
      ('Weekender Bags', 'Уикенд чанти', 'weekender-bags', v_parent_id, 3),
      ('Rolling Bags', 'Чанти с колелца', 'rolling-bags', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'travel-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Travel Pillows', 'Пътнически възглавници', 'travel-pillows', v_parent_id, 1),
      ('Packing Cubes', 'Органайзери за багаж', 'packing-cubes', v_parent_id, 2),
      ('Travel Adapters', 'Пътнически адаптери', 'travel-adapters', v_parent_id, 3),
      ('Luggage Tags', 'Етикети за багаж', 'luggage-tags', v_parent_id, 4),
      ('Passport Holders', 'Калъфи за паспорти', 'passport-holders', v_parent_id, 5),
      ('TSA Locks', 'TSA катинари', 'tsa-locks', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Camping & Outdoor deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'camping-gear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tents', 'Палатки', 'tents', v_parent_id, 1),
      ('Sleeping Bags', 'Спални чували', 'sleeping-bags', v_parent_id, 2),
      ('Camping Chairs', 'Къмпинг столове', 'camping-chairs', v_parent_id, 3),
      ('Camping Stoves', 'Къмпинг печки', 'camping-stoves', v_parent_id, 4),
      ('Coolers', 'Хладилни чанти', 'coolers', v_parent_id, 5),
      ('Camping Lanterns', 'Къмпинг фенери', 'camping-lanterns', v_parent_id, 6),
      ('Camping Cookware', 'Съдове за къмпинг', 'camping-cookware', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hiking-gear';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hiking Backpacks', 'Раници за туризъм', 'hiking-backpacks', v_parent_id, 1),
      ('Hiking Shoes', 'Туристически обувки', 'hiking-shoes', v_parent_id, 2),
      ('Hiking Poles', 'Туристически щеки', 'hiking-poles', v_parent_id, 3),
      ('Hydration Packs', 'Хидратационни раници', 'hydration-packs', v_parent_id, 4),
      ('Navigation Tools', 'Навигационни инструменти', 'navigation-tools', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Security & Surveillance deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'home-security';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Security Systems', 'Охранителни системи', 'security-systems', v_parent_id, 1),
      ('Alarm Systems', 'Алармени системи', 'alarm-systems', v_parent_id, 2),
      ('Security Safes', 'Сейфове', 'security-safes', v_parent_id, 3),
      ('Motion Sensors', 'Датчици за движение', 'motion-sensors', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cleaning & Organization deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cleaning-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Vacuum Cleaners', 'Прахосмукачки', 'vacuum-cleaners', v_parent_id, 1),
      ('Mops & Brooms', 'Моп и метли', 'mops-brooms', v_parent_id, 2),
      ('Cleaning Solutions', 'Почистващи препарати', 'cleaning-solutions', v_parent_id, 3),
      ('Trash Cans', 'Кофи за смет', 'trash-cans', v_parent_id, 4),
      ('Cleaning Tools', 'Почистващи инструменти', 'cleaning-tools', v_parent_id, 5),
      ('Steam Cleaners', 'Парочистачки', 'steam-cleaners', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Laundry deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'laundry';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Washing Machines', 'Перални машини', 'washing-machines', v_parent_id, 1),
      ('Dryers', 'Сушилни', 'dryers', v_parent_id, 2),
      ('Irons & Steamers', 'Ютии и парогенератори', 'irons-steamers', v_parent_id, 3),
      ('Laundry Detergent', 'Перилни препарати', 'laundry-detergent', v_parent_id, 4),
      ('Fabric Softeners', 'Омекотители', 'fabric-softeners', v_parent_id, 5),
      ('Drying Racks', 'Сушилници', 'drying-racks', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Seasonal deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'holiday-seasonal';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Christmas Decorations', 'Коледна декорация', 'christmas-decorations', v_parent_id, 1),
      ('Easter Decorations', 'Великденска декорация', 'easter-decorations', v_parent_id, 2),
      ('Halloween Decorations', 'Хелоуин декорация', 'halloween-decorations', v_parent_id, 3),
      ('Birthday Supplies', 'Консумативи за рожден ден', 'birthday-supplies', v_parent_id, 4),
      ('Party Supplies', 'Парти консумативи', 'party-supplies', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
