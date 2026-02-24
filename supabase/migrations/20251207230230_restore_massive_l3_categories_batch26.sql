
-- Batch 26: Health & Beauty, Personal Care deep categories  
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Skincare L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'facial-skincare';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cleansers', 'Почистващи продукти', 'cleansers', v_parent_id, 1),
      ('Moisturizers', 'Хидратанти', 'moisturizers', v_parent_id, 2),
      ('Serums', 'Серуми', 'serums', v_parent_id, 3),
      ('Eye Creams', 'Кремове за очи', 'eye-creams', v_parent_id, 4),
      ('Face Masks', 'Маски за лице', 'face-masks', v_parent_id, 5),
      ('Toners', 'Тоници', 'toners', v_parent_id, 6),
      ('Exfoliators', 'Ексфолианти', 'exfoliators', v_parent_id, 7),
      ('Sunscreen', 'Слънцезащитни кремове', 'sunscreen', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'body-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Body Lotions', 'Лосиони за тяло', 'body-lotions', v_parent_id, 1),
      ('Body Wash', 'Душ гелове', 'body-wash', v_parent_id, 2),
      ('Body Scrubs', 'Скрабове за тяло', 'body-scrubs', v_parent_id, 3),
      ('Hand Creams', 'Кремове за ръце', 'hand-creams', v_parent_id, 4),
      ('Body Oils', 'Масла за тяло', 'body-oils', v_parent_id, 5),
      ('Foot Care', 'Грижа за крака', 'foot-care', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Makeup L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'face-makeup';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Foundation', 'Фон дьо тен', 'foundation', v_parent_id, 1),
      ('Concealer', 'Коректор', 'concealer', v_parent_id, 2),
      ('Powder', 'Пудра', 'face-powder', v_parent_id, 3),
      ('Blush', 'Руж', 'blush', v_parent_id, 4),
      ('Bronzer', 'Бронзант', 'bronzer', v_parent_id, 5),
      ('Highlighter', 'Хайлайтър', 'highlighter', v_parent_id, 6),
      ('Primer', 'Праймър', 'primer', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'eye-makeup';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Eyeshadow', 'Сенки за очи', 'eyeshadow', v_parent_id, 1),
      ('Eyeliner', 'Очна линия', 'eyeliner', v_parent_id, 2),
      ('Mascara', 'Спирала', 'mascara', v_parent_id, 3),
      ('Eyebrow Products', 'Продукти за вежди', 'eyebrow-products', v_parent_id, 4),
      ('False Lashes', 'Изкуствени мигли', 'false-lashes', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'lip-makeup';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Lipstick', 'Червило', 'lipstick', v_parent_id, 1),
      ('Lip Gloss', 'Гланц за устни', 'lip-gloss', v_parent_id, 2),
      ('Lip Liner', 'Молив за устни', 'lip-liner', v_parent_id, 3),
      ('Lip Balm', 'Балсам за устни', 'lip-balm', v_parent_id, 4),
      ('Lip Stain', 'Тинт за устни', 'lip-stain', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hair Care L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'shampoo-conditioner';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Shampoo', 'Шампоан', 'shampoo', v_parent_id, 1),
      ('Conditioner', 'Балсам', 'conditioner', v_parent_id, 2),
      ('2-in-1 Products', 'Продукти 2-в-1', '2-in-1-products', v_parent_id, 3),
      ('Dry Shampoo', 'Сух шампоан', 'dry-shampoo', v_parent_id, 4),
      ('Deep Conditioner', 'Дълбоко хидратиращ балсам', 'deep-conditioner', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hair-styling';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hair Gel', 'Гел за коса', 'hair-gel', v_parent_id, 1),
      ('Hair Spray', 'Лак за коса', 'hair-spray', v_parent_id, 2),
      ('Mousse', 'Мус за коса', 'mousse', v_parent_id, 3),
      ('Hair Wax', 'Вакса за коса', 'hair-wax', v_parent_id, 4),
      ('Pomade', 'Помада за коса', 'pomade', v_parent_id, 5),
      ('Heat Protectant', 'Термозащита', 'heat-protectant', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hair-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hair Dryers', 'Сешоари', 'hair-dryers', v_parent_id, 1),
      ('Flat Irons', 'Преси за коса', 'flat-irons', v_parent_id, 2),
      ('Curling Irons', 'Маши за коса', 'curling-irons', v_parent_id, 3),
      ('Hot Rollers', 'Горещи ролки', 'hot-rollers', v_parent_id, 4),
      ('Hair Brushes', 'Четки за коса', 'hair-brushes', v_parent_id, 5),
      ('Combs', 'Гребени', 'combs', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fragrance L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-fragrance';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Eau de Parfum', 'Парфюмна вода', 'womens-eau-de-parfum', v_parent_id, 1),
      ('Eau de Toilette', 'Тоалетна вода', 'womens-eau-de-toilette', v_parent_id, 2),
      ('Body Mist', 'Спрей за тяло', 'womens-body-mist', v_parent_id, 3),
      ('Perfume Sets', 'Парфюмни комплекти', 'womens-perfume-sets', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-fragrance';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cologne', 'Одеколон', 'cologne', v_parent_id, 1),
      ('Eau de Parfum', 'Парфюмна вода', 'mens-eau-de-parfum', v_parent_id, 2),
      ('Eau de Toilette', 'Тоалетна вода', 'mens-eau-de-toilette', v_parent_id, 3),
      ('Aftershave', 'Афтършейв', 'aftershave', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Personal Care L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'oral-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Toothbrushes', 'Четки за зъби', 'toothbrushes', v_parent_id, 1),
      ('Toothpaste', 'Паста за зъби', 'toothpaste', v_parent_id, 2),
      ('Mouthwash', 'Вода за уста', 'mouthwash', v_parent_id, 3),
      ('Dental Floss', 'Конец за зъби', 'dental-floss', v_parent_id, 4),
      ('Teeth Whitening', 'Избелване на зъби', 'teeth-whitening', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'shaving-grooming';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Razors', 'Самобръсначки', 'razors', v_parent_id, 1),
      ('Shaving Cream', 'Крем за бръснене', 'shaving-cream', v_parent_id, 2),
      ('Electric Shavers', 'Електрически самобръсначки', 'electric-shavers', v_parent_id, 3),
      ('Trimmers', 'Тримери', 'beard-trimmers', v_parent_id, 4),
      ('Aftershave Products', 'Продукти след бръснене', 'aftershave-products', v_parent_id, 5),
      ('Beard Care', 'Грижа за брада', 'beard-care', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'deodorants-antiperspirants';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Stick Deodorants', 'Стик дезодоранти', 'stick-deodorants', v_parent_id, 1),
      ('Spray Deodorants', 'Спрей дезодоранти', 'spray-deodorants', v_parent_id, 2),
      ('Roll-On Deodorants', 'Рол-он дезодоранти', 'roll-on-deodorants', v_parent_id, 3),
      ('Natural Deodorants', 'Натурални дезодоранти', 'natural-deodorants', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Vitamins & Supplements L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vitamins';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Multivitamins', 'Мултивитамини', 'multivitamins', v_parent_id, 1),
      ('Vitamin C', 'Витамин C', 'vitamin-c', v_parent_id, 2),
      ('Vitamin D', 'Витамин D', 'vitamin-d', v_parent_id, 3),
      ('B Vitamins', 'Витамини от група B', 'b-vitamins', v_parent_id, 4),
      ('Vitamin E', 'Витамин E', 'vitamin-e', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'supplements';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Omega-3 Fish Oil', 'Омега-3 рибено масло', 'omega-3-fish-oil', v_parent_id, 1),
      ('Probiotics', 'Пробиотици', 'probiotics', v_parent_id, 2),
      ('Protein Supplements', 'Протеинови добавки', 'protein-supplements', v_parent_id, 3),
      ('Collagen', 'Колаген', 'collagen', v_parent_id, 4),
      ('Herbal Supplements', 'Билкови добавки', 'herbal-supplements', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
