
-- Batch 41: More deep categories - Jewelry, Watches, Health
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Jewelry deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'necklaces';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pendant Necklaces', 'Медальони', 'pendant-necklaces', v_parent_id, 1),
      ('Chain Necklaces', 'Верижки', 'chain-necklaces', v_parent_id, 2),
      ('Chokers', 'Чокъри', 'chokers', v_parent_id, 3),
      ('Pearl Necklaces', 'Перлени колиета', 'pearl-necklaces', v_parent_id, 4),
      ('Layered Necklaces', 'Слоести колиета', 'layered-necklaces', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'earrings';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Stud Earrings', 'Обеци с винт', 'stud-earrings', v_parent_id, 1),
      ('Hoop Earrings', 'Халки', 'hoop-earrings', v_parent_id, 2),
      ('Drop Earrings', 'Висящи обеци', 'drop-earrings', v_parent_id, 3),
      ('Clip-On Earrings', 'Клипси', 'clip-on-earrings', v_parent_id, 4),
      ('Huggie Earrings', 'Хъги обеци', 'huggie-earrings', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bracelets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Chain Bracelets', 'Верижки за ръка', 'chain-bracelets', v_parent_id, 1),
      ('Bangle Bracelets', 'Твърди гривни', 'bangle-bracelets', v_parent_id, 2),
      ('Charm Bracelets', 'Гривни с талисмани', 'charm-bracelets', v_parent_id, 3),
      ('Beaded Bracelets', 'Мъниста гривни', 'beaded-bracelets', v_parent_id, 4),
      ('Tennis Bracelets', 'Тенис гривни', 'tennis-bracelets', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'rings';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Engagement Rings', 'Годежни пръстени', 'engagement-rings', v_parent_id, 1),
      ('Wedding Bands', 'Брачни халки', 'wedding-bands', v_parent_id, 2),
      ('Cocktail Rings', 'Коктейлни пръстени', 'cocktail-rings', v_parent_id, 3),
      ('Statement Rings', 'Масивни пръстени', 'statement-rings', v_parent_id, 4),
      ('Stackable Rings', 'Редящи се пръстени', 'stackable-rings', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Watches deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mens-watches';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dress Watches', 'Официални часовници', 'mens-dress-watches', v_parent_id, 1),
      ('Sport Watches', 'Спортни часовници', 'mens-sport-watches', v_parent_id, 2),
      ('Dive Watches', 'Водолазни часовници', 'mens-dive-watches', v_parent_id, 3),
      ('Chronograph Watches', 'Хронографи', 'mens-chronograph-watches', v_parent_id, 4),
      ('Automatic Watches', 'Автоматични часовници', 'mens-automatic-watches', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'womens-watches';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Fashion Watches', 'Модни часовници', 'womens-fashion-watches', v_parent_id, 1),
      ('Bracelet Watches', 'Часовници гривни', 'womens-bracelet-watches', v_parent_id, 2),
      ('Diamond Watches', 'Диамантени часовници', 'womens-diamond-watches', v_parent_id, 3),
      ('Casual Watches', 'Ежедневни часовници', 'womens-casual-watches', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'smartwatches';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Apple Watch', 'Apple Watch', 'apple-watch', v_parent_id, 1),
      ('Samsung Galaxy Watch', 'Samsung Galaxy Watch', 'samsung-galaxy-watch', v_parent_id, 2),
      ('Garmin Watches', 'Garmin часовници', 'garmin-watches', v_parent_id, 3),
      ('Fitbit Watches', 'Fitbit часовници', 'fitbit-watches', v_parent_id, 4),
      ('Budget Smartwatches', 'Бюджетни смарт часовници', 'budget-smartwatches', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Health & Personal Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'vitamins-supplements';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Multivitamins', 'Мултивитамини', 'multivitamins', v_parent_id, 1),
      ('Vitamin D', 'Витамин D', 'vitamin-d', v_parent_id, 2),
      ('Vitamin C', 'Витамин C', 'vitamin-c', v_parent_id, 3),
      ('B Vitamins', 'Витамини B', 'b-vitamins', v_parent_id, 4),
      ('Fish Oil', 'Рибено масло', 'fish-oil', v_parent_id, 5),
      ('Probiotics', 'Пробиотици', 'probiotics', v_parent_id, 6),
      ('Protein Supplements', 'Протеини', 'protein-supplements', v_parent_id, 7),
      ('Herbal Supplements', 'Билкови добавки', 'herbal-supplements', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'skincare';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cleansers', 'Почистващи продукти', 'cleansers', v_parent_id, 1),
      ('Moisturizers', 'Хидратиращи кремове', 'moisturizers', v_parent_id, 2),
      ('Serums', 'Серуми', 'serums', v_parent_id, 3),
      ('Sunscreens', 'Слънцезащитни кремове', 'sunscreens', v_parent_id, 4),
      ('Eye Creams', 'Кремове за очи', 'eye-creams', v_parent_id, 5),
      ('Face Masks', 'Маски за лице', 'face-masks', v_parent_id, 6),
      ('Anti-Aging', 'Анти-ейджинг', 'anti-aging', v_parent_id, 7),
      ('Acne Treatment', 'Лечение на акне', 'acne-treatment', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'hair-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Shampoos', 'Шампоани', 'shampoos', v_parent_id, 1),
      ('Conditioners', 'Балсами', 'conditioners', v_parent_id, 2),
      ('Hair Treatments', 'Терапии за коса', 'hair-treatments', v_parent_id, 3),
      ('Hair Styling', 'Стилизиране на коса', 'hair-styling', v_parent_id, 4),
      ('Hair Color', 'Боя за коса', 'hair-color', v_parent_id, 5),
      ('Hair Dryers', 'Сешоари', 'hair-dryers', v_parent_id, 6),
      ('Flat Irons', 'Преси за коса', 'flat-irons', v_parent_id, 7),
      ('Curling Irons', 'Маши за коса', 'curling-irons', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'oral-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Toothbrushes', 'Четки за зъби', 'toothbrushes', v_parent_id, 1),
      ('Electric Toothbrushes', 'Електрически четки', 'electric-toothbrushes', v_parent_id, 2),
      ('Toothpaste', 'Паста за зъби', 'toothpaste', v_parent_id, 3),
      ('Mouthwash', 'Вода за уста', 'mouthwash', v_parent_id, 4),
      ('Dental Floss', 'Конец за зъби', 'dental-floss', v_parent_id, 5),
      ('Teeth Whitening', 'Избелване на зъби', 'teeth-whitening', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'shaving-grooming';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Razors', 'Самобръсначки', 'razors', v_parent_id, 1),
      ('Electric Shavers', 'Електрически самобръсначки', 'electric-shavers', v_parent_id, 2),
      ('Shaving Cream', 'Крем за бръснене', 'shaving-cream', v_parent_id, 3),
      ('Beard Trimmers', 'Тримери за брада', 'beard-trimmers', v_parent_id, 4),
      ('Beard Oil', 'Масло за брада', 'beard-oil', v_parent_id, 5),
      ('Aftershave', 'Афтършейв', 'aftershave', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
