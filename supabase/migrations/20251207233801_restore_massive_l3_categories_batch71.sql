
-- Batch 71: More electronics and tech categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Laptops deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'laptops';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gaming Laptops', 'Гейминг лаптопи', 'gaming-laptops', v_parent_id, 1),
      ('Business Laptops', 'Бизнес лаптопи', 'business-laptops', v_parent_id, 2),
      ('Chromebooks', 'Хромбуци', 'chromebooks', v_parent_id, 3),
      ('2-in-1 Laptops', '2-в-1 лаптопи', '2-in-1-laptops', v_parent_id, 4),
      ('Budget Laptops', 'Бюджетни лаптопи', 'budget-laptops', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Desktop Computers deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'desktop-computers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gaming Desktops', 'Гейминг компютри', 'gaming-desktops', v_parent_id, 1),
      ('All-in-One Computers', 'Всичко в едно компютри', 'all-in-one-computers', v_parent_id, 2),
      ('Mini PCs', 'Мини компютри', 'mini-pcs', v_parent_id, 3),
      ('Workstations', 'Работни станции', 'workstations', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Computer Components deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'computer-components';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Processors', 'Процесори', 'processors', v_parent_id, 1),
      ('Motherboards', 'Дънни платки', 'motherboards', v_parent_id, 2),
      ('Graphics Cards', 'Видео карти', 'graphics-cards', v_parent_id, 3),
      ('RAM Memory', 'RAM памет', 'ram-memory', v_parent_id, 4),
      ('Power Supplies', 'Захранвания', 'power-supplies', v_parent_id, 5),
      ('Computer Cases', 'Компютърни кутии', 'computer-cases', v_parent_id, 6),
      ('CPU Coolers', 'Охладители за процесори', 'cpu-coolers', v_parent_id, 7),
      ('SSDs', 'SSD дискове', 'ssds', v_parent_id, 8),
      ('Hard Drives', 'Твърди дискове', 'hard-drives', v_parent_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Computer Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'computer-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Keyboards', 'Клавиатури', 'keyboards', v_parent_id, 1),
      ('Computer Mice', 'Компютърни мишки', 'computer-mice', v_parent_id, 2),
      ('Webcams', 'Уеб камери', 'webcams', v_parent_id, 3),
      ('USB Hubs', 'USB хъбове', 'usb-hubs', v_parent_id, 4),
      ('Mouse Pads', 'Подложки за мишка', 'mouse-pads', v_parent_id, 5),
      ('Laptop Stands', 'Стойки за лаптопи', 'laptop-stands', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Monitors deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'monitors';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gaming Monitors', 'Гейминг монитори', 'gaming-monitors', v_parent_id, 1),
      ('4K Monitors', '4K монитори', '4k-monitors', v_parent_id, 2),
      ('Curved Monitors', 'Извити монитори', 'curved-monitors', v_parent_id, 3),
      ('Ultrawide Monitors', 'Ултра широки монитори', 'ultrawide-monitors', v_parent_id, 4),
      ('Portable Monitors', 'Преносими монитори', 'portable-monitors', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tablets deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tablets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Android Tablets', 'Андроид таблети', 'android-tablets', v_parent_id, 1),
      ('iPad Tablets', 'iPad таблети', 'ipad-tablets', v_parent_id, 2),
      ('Windows Tablets', 'Windows таблети', 'windows-tablets', v_parent_id, 3),
      ('Kids Tablets', 'Детски таблети', 'kids-tablets', v_parent_id, 4),
      ('Tablet Accessories', 'Аксесоари за таблети', 'tablet-accessories', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Smartphones deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smartphones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Android Phones', 'Андроид телефони', 'android-phones', v_parent_id, 1),
      ('iPhones', 'Айфони', 'iphones', v_parent_id, 2),
      ('Unlocked Phones', 'Отключени телефони', 'unlocked-phones', v_parent_id, 3),
      ('Budget Phones', 'Бюджетни телефони', 'budget-phones', v_parent_id, 4),
      ('Refurbished Phones', 'Рефърбишнати телефони', 'refurbished-phones', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Phone Accessories deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'phone-accessories';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Phone Cases', 'Калъфи за телефони', 'phone-cases', v_parent_id, 1),
      ('Screen Protectors', 'Протектори за екран', 'screen-protectors', v_parent_id, 2),
      ('Phone Chargers', 'Зарядни за телефони', 'phone-chargers', v_parent_id, 3),
      ('Phone Mounts', 'Стойки за телефони', 'phone-mounts', v_parent_id, 4),
      ('Power Banks', 'Външни батерии', 'power-banks', v_parent_id, 5),
      ('Phone Cables', 'Кабели за телефони', 'phone-cables', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
