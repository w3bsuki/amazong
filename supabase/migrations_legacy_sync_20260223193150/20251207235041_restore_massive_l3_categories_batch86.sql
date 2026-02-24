-- Batch 86: First Aid deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'first-aid';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bandages', 'Бинтове', 'bandages', parent_id_var, 1),
      ('Adhesive Tapes', 'Лепенки', 'adhesive-tapes', parent_id_var, 2),
      ('Antiseptics', 'Антисептици', 'antiseptics', parent_id_var, 3),
      ('First Aid Kits', 'Аптечки', 'first-aid-kits', parent_id_var, 4),
      ('Gauze Pads', 'Марлени тампони', 'gauze-pads', parent_id_var, 5),
      ('Medical Gloves', 'Медицински ръкавици', 'medical-gloves', parent_id_var, 6),
      ('Ice Packs', 'Ледени компреси', 'ice-packs', parent_id_var, 7),
      ('Eye Wash', 'Разтвор за очи', 'eye-wash', parent_id_var, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Health Monitors deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'health-monitors';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Blood Pressure Monitors', 'Апарати за кръвно налягане', 'blood-pressure-monitors', parent_id_var, 1),
      ('Blood Glucose Monitors', 'Глюкомери', 'blood-glucose-monitors', parent_id_var, 2),
      ('Pulse Oximeters', 'Пулсоксиметри', 'pulse-oximeters', parent_id_var, 3),
      ('Thermometers', 'Термометри', 'thermometers', parent_id_var, 4),
      ('Heart Rate Monitors', 'Монитори за сърдечен ритъм', 'heart-rate-monitors', parent_id_var, 5),
      ('Pedometers', 'Педометри', 'pedometers', parent_id_var, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Sleep Aids deeper categories
DO $$
DECLARE
  parent_id_var UUID;
BEGIN
  SELECT id INTO parent_id_var FROM categories WHERE slug = 'sleep-aids';
  IF parent_id_var IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('CPAP Machines', 'CPAP апарати', 'cpap-machines', parent_id_var, 1),
      ('CPAP Masks', 'CPAP маски', 'cpap-masks', parent_id_var, 2),
      ('Sleep Masks', 'Маски за сън', 'sleep-masks', parent_id_var, 3),
      ('Earplugs for Sleep', 'Тапи за уши за сън', 'earplugs-sleep', parent_id_var, 4),
      ('White Noise Machines', 'Машини за бял шум', 'white-noise-machines', parent_id_var, 5),
      ('Anti-Snoring Devices', 'Устройства против хъркане', 'anti-snoring-devices', parent_id_var, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;;
