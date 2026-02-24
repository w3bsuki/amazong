
-- Batch 84: Final push for 7100+
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Incontinence deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'incontinence';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Adult Diapers', 'Памперси за възрастни', 'adult-diapers', v_parent_id, 1),
      ('Incontinence Pads', 'Превръзки за инконтиненция', 'incontinence-pads', v_parent_id, 2),
      ('Underpads', 'Подложки', 'underpads', v_parent_id, 3),
      ('Protective Underwear', 'Защитно бельо', 'protective-underwear', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cotton & Bandages deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cotton-bandages';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cotton Balls', 'Памучни топки', 'cotton-balls', v_parent_id, 1),
      ('Cotton Swabs', 'Клечки за уши', 'cotton-swabs', v_parent_id, 2),
      ('Gauze Pads', 'Марлени тампони', 'gauze-pads', v_parent_id, 3),
      ('Elastic Bandages', 'Еластични бинтове', 'elastic-bandages', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pain Management deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pain-management';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pain Relievers', 'Болкоуспокояващи', 'pain-relievers', v_parent_id, 1),
      ('Topical Pain Relief', 'Локални обезболяващи', 'topical-pain-relief', v_parent_id, 2),
      ('Heating Pads', 'Затоплящи подложки', 'heating-pads', v_parent_id, 3),
      ('Ice Packs', 'Студени компреси', 'ice-packs', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Cold & Flu deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cold-flu';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Cough Medicine', 'Лекарства за кашлица', 'cough-medicine', v_parent_id, 1),
      ('Decongestants', 'Деконгестанти', 'decongestants', v_parent_id, 2),
      ('Throat Lozenges', 'Бонбони за гърло', 'throat-lozenges', v_parent_id, 3),
      ('Nasal Sprays', 'Назални спрейове', 'nasal-sprays', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Allergy Relief deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'allergy-relief';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Antihistamines', 'Антихистамини', 'antihistamines', v_parent_id, 1),
      ('Allergy Eye Drops', 'Капки за очи при алергия', 'allergy-eye-drops', v_parent_id, 2),
      ('Sinus Relief', 'Синуси релеф', 'sinus-relief', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Digestive Health deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'digestive-health';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Antacids', 'Антиациди', 'antacids', v_parent_id, 1),
      ('Laxatives', 'Лаксативи', 'laxatives', v_parent_id, 2),
      ('Anti-Diarrhea', 'Против диария', 'anti-diarrhea', v_parent_id, 3),
      ('Fiber Supplements', 'Фибри добавки', 'fiber-supplements', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Heart Health deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'heart-health';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Omega 3', 'Омега 3', 'omega-3', v_parent_id, 1),
      ('CoQ10', 'CoQ10', 'coq10', v_parent_id, 2),
      ('Cholesterol Support', 'Подкрепа за холестерол', 'cholesterol-support', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Joint Health deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'joint-health';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Glucosamine', 'Глюкозамин', 'glucosamine', v_parent_id, 1),
      ('Chondroitin', 'Хондроитин', 'chondroitin', v_parent_id, 2),
      ('Joint Creams', 'Кремове за стави', 'joint-creams', v_parent_id, 3),
      ('Collagen', 'Колаген', 'collagen', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Brain Health deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'brain-health';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Memory Support', 'Подкрепа за паметта', 'memory-support', v_parent_id, 1),
      ('Focus Supplements', 'Добавки за концентрация', 'focus-supplements', v_parent_id, 2),
      ('Ginkgo Biloba', 'Гинко билоба', 'ginkgo-biloba', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sports Nutrition deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sports-nutrition';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Whey Protein', 'Суроватъчен протеин', 'whey-protein', v_parent_id, 1),
      ('Pre-Workout', 'Пред-тренировка', 'pre-workout', v_parent_id, 2),
      ('BCAAs', 'BCAA', 'bcaas', v_parent_id, 3),
      ('Creatine', 'Креатин', 'creatine', v_parent_id, 4),
      ('Energy Bars', 'Енергийни барове', 'energy-bars', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Weight Management deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'weight-management';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Diet Pills', 'Хапчета за диета', 'diet-pills', v_parent_id, 1),
      ('Meal Replacements', 'Заместители на храна', 'meal-replacements', v_parent_id, 2),
      ('Appetite Suppressants', 'Потискащи апетита', 'appetite-suppressants', v_parent_id, 3),
      ('Fat Burners', 'Горелки на мазнини', 'fat-burners', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
