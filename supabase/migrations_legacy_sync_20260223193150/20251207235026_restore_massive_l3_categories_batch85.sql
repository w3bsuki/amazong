-- Batch 85: Urinals deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'urinals';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Male Urinals', 'Мъжки уринари', 'male-urinals', parent_id_var, 1),
      ('Female Urinals', 'Женски уринари', 'female-urinals', parent_id_var, 2),
      ('Portable Urinals', 'Преносими уринари', 'portable-urinals', parent_id_var, 3),
      ('Bedside Urinals', 'Уринари за легло', 'bedside-urinals', parent_id_var, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Bathroom Safety deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'bathroom-safety';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Grab Bars', 'Дръжки за захващане', 'grab-bars', parent_id_var, 1),
      ('Bath Mats', 'Постелки за баня', 'safety-bath-mats', parent_id_var, 2),
      ('Raised Toilet Seats', 'Повдигнати тоалетни седалки', 'raised-toilet-seats', parent_id_var, 3),
      ('Shower Chairs', 'Столове за душ', 'shower-chairs', parent_id_var, 4),
      ('Bathtub Rails', 'Перила за вана', 'bathtub-rails', parent_id_var, 5),
      ('Toilet Safety Frames', 'Рамки за тоалетна безопасност', 'toilet-safety-frames', parent_id_var, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Mobility Aids deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'mobility-aids';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Walking Canes', 'Бастуни', 'walking-canes', parent_id_var, 1),
      ('Walkers', 'Проходилки', 'walkers', parent_id_var, 2),
      ('Rollators', 'Ролатори', 'rollators', parent_id_var, 3),
      ('Wheelchairs', 'Инвалидни колички', 'wheelchairs', parent_id_var, 4),
      ('Knee Scooters', 'Коленни скутери', 'knee-scooters', parent_id_var, 5),
      ('Crutches', 'Патерици', 'crutches', parent_id_var, 6),
      ('Transport Chairs', 'Транспортни столове', 'transport-chairs', parent_id_var, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Braces & Supports deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'braces-supports';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Knee Braces', 'Наколенки', 'knee-braces', parent_id_var, 1),
      ('Ankle Braces', 'Стабилизатори за глезен', 'ankle-braces', parent_id_var, 2),
      ('Back Braces', 'Колани за гръб', 'back-braces', parent_id_var, 3),
      ('Wrist Braces', 'Стабилизатори за китка', 'wrist-braces', parent_id_var, 4),
      ('Elbow Braces', 'Налакътници', 'elbow-braces', parent_id_var, 5),
      ('Shoulder Braces', 'Стабилизатори за рамо', 'shoulder-braces', parent_id_var, 6),
      ('Compression Sleeves', 'Компресионни ръкави', 'compression-sleeves', parent_id_var, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;;
