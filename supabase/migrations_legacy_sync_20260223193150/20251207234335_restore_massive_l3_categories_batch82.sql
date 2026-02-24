
-- Batch 82: Fresh unique categories
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Dental Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dental-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Dental Flossers', 'Конци за зъби с дръжка', 'dental-flossers', v_parent_id, 1),
      ('Interdental Brushes', 'Интердентални четки', 'interdental-brushes', v_parent_id, 2),
      ('Water Flossers', 'Водни флосъри', 'water-flossers', v_parent_id, 3),
      ('Denture Care', 'Грижа за зъбни протези', 'denture-care', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Eye Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'eye-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Eye Drops', 'Капки за очи', 'eye-drops', v_parent_id, 1),
      ('Contact Lens Care', 'Грижа за контактни лещи', 'contact-lens-care', v_parent_id, 2),
      ('Reading Glasses', 'Очила за четене', 'reading-glasses', v_parent_id, 3),
      ('Eye Masks', 'Маски за очи', 'eye-masks', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Massage Tools deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'massage-tools';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Massage Guns', 'Масажни пистолети', 'massage-guns', v_parent_id, 1),
      ('Foam Rollers', 'Фоум ролери', 'foam-rollers', v_parent_id, 2),
      ('Massage Balls', 'Масажни топки', 'massage-balls', v_parent_id, 3),
      ('Back Massagers', 'Масажори за гръб', 'back-massagers', v_parent_id, 4),
      ('Foot Massagers', 'Масажори за крака', 'foot-massagers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Sleep Aids deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'sleep-aids';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Sleep Masks', 'Маски за сън', 'sleep-masks', v_parent_id, 1),
      ('White Noise Machines', 'Машини за бял шум', 'white-noise-machines', v_parent_id, 2),
      ('Melatonin', 'Мелатонин', 'melatonin', v_parent_id, 3),
      ('Sleep Trackers', 'Тракери за сън', 'sleep-trackers', v_parent_id, 4),
      ('Weighted Blankets', 'Тежки одеала', 'weighted-blankets', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Mobility Aids deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mobility-aids';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Canes', 'Бастуни', 'canes', v_parent_id, 1),
      ('Walkers', 'Проходилки', 'walkers', v_parent_id, 2),
      ('Wheelchairs', 'Инвалидни колички', 'wheelchairs', v_parent_id, 3),
      ('Knee Scooters', 'Скутери за колене', 'knee-scooters', v_parent_id, 4),
      ('Crutches', 'Патерици', 'crutches', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Bathroom Safety deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bathroom-safety';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Grab Bars', 'Дръжки за баня', 'grab-bars', v_parent_id, 1),
      ('Shower Chairs', 'Столове за душ', 'shower-chairs', v_parent_id, 2),
      ('Raised Toilet Seats', 'Повдигнати тоалетни седалки', 'raised-toilet-seats', v_parent_id, 3),
      ('Bath Lifts', 'Подемници за вана', 'bath-lifts', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Blood Pressure deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'blood-pressure';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('BP Monitors Upper Arm', 'Апарати за кръвно горна ръка', 'bp-monitors-upper-arm', v_parent_id, 1),
      ('BP Monitors Wrist', 'Апарати за кръвно китка', 'bp-monitors-wrist', v_parent_id, 2),
      ('Stethoscopes', 'Стетоскопи', 'stethoscopes', v_parent_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Diabetes Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'diabetes-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Blood Glucose Monitors', 'Глюкомери', 'blood-glucose-monitors', v_parent_id, 1),
      ('Test Strips', 'Тест ленти', 'test-strips', v_parent_id, 2),
      ('Lancets', 'Ланцети', 'lancets', v_parent_id, 3),
      ('Insulin Supplies', 'Инсулинови консумативи', 'insulin-supplies', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Respiratory Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'respiratory-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Nebulizers', 'Инхалатори', 'nebulizers', v_parent_id, 1),
      ('Pulse Oximeters', 'Пулсоксиметри', 'pulse-oximeters', v_parent_id, 2),
      ('CPAP Machines', 'CPAP машини', 'cpap-machines', v_parent_id, 3),
      ('Humidifier Filters', 'Филтри за овлажнители', 'humidifier-filters', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Physical Therapy deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'physical-therapy';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Exercise Bands', 'Ластици за упражнения', 'exercise-bands', v_parent_id, 1),
      ('Balance Boards', 'Баланс дъски', 'balance-boards', v_parent_id, 2),
      ('Therapy Putty', 'Терапевтичен гел', 'therapy-putty', v_parent_id, 3),
      ('Hot Cold Packs', 'Топло студени компреси', 'hot-cold-packs', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Body Care deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'body-care';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Body Lotion', 'Лосион за тяло', 'body-lotion', v_parent_id, 1),
      ('Body Wash', 'Душ гел', 'body-wash', v_parent_id, 2),
      ('Body Scrubs', 'Скрабове за тяло', 'body-scrubs', v_parent_id, 3),
      ('Deodorants', 'Дезодоранти', 'deodorants', v_parent_id, 4),
      ('Hand Cream', 'Крем за ръце', 'hand-cream', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
