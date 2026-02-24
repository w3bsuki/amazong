
-- Batch 83: More unique categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Nail Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'nail-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Nail Polish', 'Лак за нокти', 'nail-polish', v_parent_id, 1),
      ('Nail Tools', 'Инструменти за нокти', 'nail-tools', v_parent_id, 2),
      ('Nail Art', 'Декорации за нокти', 'nail-art', v_parent_id, 3),
      ('Gel Nails', 'Гел за нокти', 'gel-nails', v_parent_id, 4),
      ('Nail Removers', 'Лакочистители', 'nail-removers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Foot Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'foot-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Foot Creams', 'Кремове за крака', 'foot-creams', v_parent_id, 1),
      ('Callus Removers', 'Инструменти за мазоли', 'callus-removers', v_parent_id, 2),
      ('Foot Soaks', 'Соли за крака', 'foot-soaks', v_parent_id, 3),
      ('Insoles', 'Стелки', 'insoles', v_parent_id, 4),
      ('Toe Separators', 'Разделители за пръсти', 'toe-separators', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hand Sanitizers deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hand-sanitizers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Gel Sanitizers', 'Гел дезинфектанти', 'gel-sanitizers', v_parent_id, 1),
      ('Spray Sanitizers', 'Спрей дезинфектанти', 'spray-sanitizers', v_parent_id, 2),
      ('Sanitizer Wipes', 'Дезинфекциращи кърпички', 'sanitizer-wipes', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sun Protection deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sun-protection';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sunscreen Lotion', 'Слънцезащитен лосион', 'sunscreen-lotion', v_parent_id, 1),
      ('Sunscreen Spray', 'Слънцезащитен спрей', 'sunscreen-spray', v_parent_id, 2),
      ('After Sun Care', 'Грижа след слънце', 'after-sun-care', v_parent_id, 3),
      ('Lip Balm SPF', 'Балсам за устни SPF', 'lip-balm-spf', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Tanning deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'tanning';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Self Tanners', 'Автобронзанти', 'self-tanners', v_parent_id, 1),
      ('Tanning Lotions', 'Лосиони за тен', 'tanning-lotions', v_parent_id, 2),
      ('Tanning Oils', 'Масла за тен', 'tanning-oils', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hair Removal deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hair-removal';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Waxing Supplies', 'Продукти за кола маска', 'waxing-supplies', v_parent_id, 1),
      ('Epilators', 'Епилатори', 'epilators', v_parent_id, 2),
      ('IPL Devices', 'IPL уреди', 'ipl-devices', v_parent_id, 3),
      ('Hair Removal Creams', 'Депилиращи кремове', 'hair-removal-creams', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Men Grooming deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'men-grooming';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Beard Oil', 'Масло за брада', 'beard-oil', v_parent_id, 1),
      ('Beard Balm', 'Балсам за брада', 'beard-balm', v_parent_id, 2),
      ('Beard Brush', 'Четка за брада', 'beard-brush', v_parent_id, 3),
      ('Beard Trimmer', 'Тример за брада', 'beard-trimmer', v_parent_id, 4),
      ('Mustache Wax', 'Восък за мустаци', 'mustache-wax', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Essential Oils deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'essential-oils';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Lavender Oil', 'Лавандулово масло', 'lavender-oil', v_parent_id, 1),
      ('Peppermint Oil', 'Масло от мента', 'peppermint-oil', v_parent_id, 2),
      ('Tea Tree Oil', 'Масло от чаено дърво', 'tea-tree-oil', v_parent_id, 3),
      ('Eucalyptus Oil', 'Евкалиптово масло', 'eucalyptus-oil', v_parent_id, 4),
      ('Oil Diffusers', 'Дифузери за масла', 'oil-diffusers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bath Bombs deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bath-bombs';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fizzy Bath Bombs', 'Бомби за вана', 'fizzy-bath-bombs', v_parent_id, 1),
      ('Bath Salts', 'Соли за вана', 'bath-salts', v_parent_id, 2),
      ('Bubble Bath', 'Пяна за вана', 'bubble-bath', v_parent_id, 3),
      ('Bath Oils', 'Масла за вана', 'bath-oils', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Feminine Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'feminine-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Menstrual Pads', 'Дамски превръзки', 'menstrual-pads', v_parent_id, 1),
      ('Tampons', 'Тампони', 'tampons', v_parent_id, 2),
      ('Menstrual Cups', 'Менструални чаши', 'menstrual-cups', v_parent_id, 3),
      ('Feminine Wash', 'Интимна хигиена', 'feminine-wash', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
