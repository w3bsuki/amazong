
-- Batch 67: Health, Personal Care, and Beauty categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Vitamins & Supplements deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vitamins-supplements';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Multivitamins', 'Мултивитамини', 'multivitamins', v_parent_id, 1),
      ('Vitamin C', 'Витамин C', 'vitamin-c', v_parent_id, 2),
      ('Vitamin D', 'Витамин D', 'vitamin-d', v_parent_id, 3),
      ('Fish Oil', 'Рибено масло', 'fish-oil', v_parent_id, 4),
      ('Probiotics', 'Пробиотици', 'probiotics', v_parent_id, 5),
      ('Protein Supplements', 'Протеинови добавки', 'protein-supplements', v_parent_id, 6),
      ('Herbal Supplements', 'Билкови добавки', 'herbal-supplements', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- First Aid deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'first-aid';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bandages', 'Превръзки', 'bandages', v_parent_id, 1),
      ('First Aid Kits', 'Аптечки', 'first-aid-kits', v_parent_id, 2),
      ('Antiseptics', 'Антисептици', 'antiseptics', v_parent_id, 3),
      ('Pain Relief', 'Болкоуспокояващи', 'pain-relief', v_parent_id, 4),
      ('Thermometers', 'Термометри', 'thermometers', v_parent_id, 5),
      ('Medical Tape', 'Медицинско тиксо', 'medical-tape', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Oral Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'oral-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Toothpaste', 'Паста за зъби', 'toothpaste', v_parent_id, 1),
      ('Toothbrushes', 'Четки за зъби', 'toothbrushes', v_parent_id, 2),
      ('Electric Toothbrushes', 'Електрически четки', 'electric-toothbrushes', v_parent_id, 3),
      ('Mouthwash', 'Вода за уста', 'mouthwash', v_parent_id, 4),
      ('Dental Floss', 'Конец за зъби', 'dental-floss', v_parent_id, 5),
      ('Teeth Whitening', 'Избелване на зъби', 'teeth-whitening', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hair Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hair-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Shampoo', 'Шампоан', 'shampoo', v_parent_id, 1),
      ('Conditioner', 'Балсам', 'conditioner', v_parent_id, 2),
      ('Hair Styling', 'Стайлинг продукти', 'hair-styling', v_parent_id, 3),
      ('Hair Color', 'Боя за коса', 'hair-color', v_parent_id, 4),
      ('Hair Dryers', 'Сешоари', 'hair-dryers', v_parent_id, 5),
      ('Hair Straighteners', 'Преси за коса', 'hair-straighteners', v_parent_id, 6),
      ('Curling Irons', 'Маши за къдрене', 'curling-irons', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Skin Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'skin-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Face Cleansers', 'Почистващи за лице', 'face-cleansers', v_parent_id, 1),
      ('Moisturizers', 'Хидратанти', 'moisturizers', v_parent_id, 2),
      ('Serums', 'Серуми', 'serums', v_parent_id, 3),
      ('Face Masks', 'Маски за лице', 'face-masks', v_parent_id, 4),
      ('Sunscreen', 'Слънцезащитни', 'sunscreen', v_parent_id, 5),
      ('Anti-Aging', 'Антистареене', 'anti-aging', v_parent_id, 6),
      ('Acne Treatment', 'Лечение на акне', 'acne-treatment', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Makeup deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'makeup';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Foundation', 'Фон дьо тен', 'foundation', v_parent_id, 1),
      ('Concealer', 'Коректор', 'concealer', v_parent_id, 2),
      ('Powder', 'Пудра', 'powder', v_parent_id, 3),
      ('Blush', 'Руж', 'blush', v_parent_id, 4),
      ('Bronzer', 'Бронзант', 'bronzer', v_parent_id, 5),
      ('Eye Shadow', 'Сенки за очи', 'eye-shadow', v_parent_id, 6),
      ('Mascara', 'Спирала', 'mascara', v_parent_id, 7),
      ('Lipstick', 'Червило', 'lipstick', v_parent_id, 8),
      ('Lip Gloss', 'Гланц за устни', 'lip-gloss', v_parent_id, 9),
      ('Makeup Brushes', 'Четки за грим', 'makeup-brushes', v_parent_id, 10)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fragrances deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'fragrances';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Womens Perfume', 'Дамски парфюми', 'womens-perfume', v_parent_id, 1),
      ('Mens Cologne', 'Мъжки одеколони', 'mens-cologne', v_parent_id, 2),
      ('Body Sprays', 'Спрейове за тяло', 'body-sprays', v_parent_id, 3),
      ('Gift Sets Fragrance', 'Подаръчни комплекти', 'gift-sets-fragrance', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Shaving & Grooming deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'shaving-grooming';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Razors', 'Самобръсначки', 'razors', v_parent_id, 1),
      ('Electric Shavers', 'Електрически самобръсначки', 'electric-shavers', v_parent_id, 2),
      ('Shaving Cream', 'Крем за бръснене', 'shaving-cream', v_parent_id, 3),
      ('Aftershave', 'Афтършейв', 'aftershave', v_parent_id, 4),
      ('Beard Care', 'Грижа за брада', 'beard-care', v_parent_id, 5),
      ('Trimmers', 'Тримери', 'trimmers-grooming', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
