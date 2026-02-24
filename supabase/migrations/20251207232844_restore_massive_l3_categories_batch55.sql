
-- Batch 55: More categories - Medical, Safety, Industrial supplies
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Medical Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'medical-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('First Aid Kits', 'Комплекти за първа помощ', 'first-aid-kits', v_parent_id, 1),
      ('Mobility Aids', 'Помощни средства за мобилност', 'mobility-aids', v_parent_id, 2),
      ('Blood Pressure Monitors', 'Апарати за кръвно', 'blood-pressure-monitors', v_parent_id, 3),
      ('Thermometers', 'Термометри', 'thermometers', v_parent_id, 4),
      ('Pulse Oximeters', 'Пулсоксиметри', 'pulse-oximeters', v_parent_id, 5),
      ('Braces & Supports', 'Ортези и опори', 'braces-supports', v_parent_id, 6),
      ('Wound Care', 'Грижа за рани', 'wound-care', v_parent_id, 7),
      ('Medical Gloves', 'Медицински ръкавици', 'medical-gloves', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mobility-aids';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wheelchairs', 'Инвалидни колички', 'wheelchairs', v_parent_id, 1),
      ('Walkers', 'Проходилки', 'walkers', v_parent_id, 2),
      ('Crutches', 'Патерици', 'crutches', v_parent_id, 3),
      ('Canes', 'Бастуни', 'canes', v_parent_id, 4),
      ('Scooters Medical', 'Медицински скутери', 'scooters-medical', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Safety Equipment deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'safety-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Safety Glasses', 'Предпазни очила', 'safety-glasses', v_parent_id, 1),
      ('Safety Gloves', 'Работни ръкавици', 'safety-gloves', v_parent_id, 2),
      ('Hard Hats', 'Каски', 'hard-hats', v_parent_id, 3),
      ('Ear Protection', 'Защита за уши', 'ear-protection', v_parent_id, 4),
      ('Respirators', 'Респиратори', 'respirators', v_parent_id, 5),
      ('Safety Vests', 'Светлоотразителни жилетки', 'safety-vests', v_parent_id, 6),
      ('Fall Protection', 'Защита от падане', 'fall-protection', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Janitorial deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'janitorial-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Commercial Cleaners', 'Професионални почистващи', 'commercial-cleaners', v_parent_id, 1),
      ('Trash Bags', 'Торби за боклук', 'trash-bags', v_parent_id, 2),
      ('Paper Towels', 'Хартиени кърпи', 'paper-towels', v_parent_id, 3),
      ('Toilet Paper Commercial', 'Тоалетна хартия търговска', 'toilet-paper-commercial', v_parent_id, 4),
      ('Hand Soap', 'Сапун за ръце', 'hand-soap', v_parent_id, 5),
      ('Floor Care', 'Грижа за подове', 'floor-care', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Lab Equipment deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'lab-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Microscopes', 'Микроскопи', 'microscopes', v_parent_id, 1),
      ('Lab Glassware', 'Лабораторна стъклария', 'lab-glassware', v_parent_id, 2),
      ('Centrifuges', 'Центрофуги', 'centrifuges', v_parent_id, 3),
      ('Lab Scales', 'Лабораторни везни', 'lab-scales', v_parent_id, 4),
      ('Test Tubes', 'Епруветки', 'test-tubes', v_parent_id, 5),
      ('Beakers', 'Чаши', 'beakers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Scientific Instruments deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'scientific-instruments';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Telescopes', 'Телескопи', 'telescopes', v_parent_id, 1),
      ('Binoculars', 'Бинокли', 'binoculars', v_parent_id, 2),
      ('Magnifying Glasses', 'Лупи', 'magnifying-glasses', v_parent_id, 3),
      ('Weather Stations', 'Метеорологични станции', 'weather-stations', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Electrical Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'electrical-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Wire & Cable', 'Проводници и кабели', 'wire-cable', v_parent_id, 1),
      ('Electrical Outlets', 'Електрически контакти', 'electrical-outlets', v_parent_id, 2),
      ('Light Switches', 'Ключове за осветление', 'light-switches', v_parent_id, 3),
      ('Circuit Breakers', 'Автоматични прекъсвачи', 'circuit-breakers', v_parent_id, 4),
      ('Electrical Boxes', 'Електрически кутии', 'electrical-boxes', v_parent_id, 5),
      ('Conduit & Fittings', 'Тръби и фитинги', 'conduit-fittings', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Plumbing Supplies deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'plumbing-supplies';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Pipes', 'Тръби', 'pipes', v_parent_id, 1),
      ('Fittings', 'Фитинги', 'fittings', v_parent_id, 2),
      ('Valves', 'Вентили', 'valves', v_parent_id, 3),
      ('Water Heaters', 'Бойлери', 'water-heaters', v_parent_id, 4),
      ('Pumps', 'Помпи', 'pumps', v_parent_id, 5),
      ('Drain Cleaning', 'Почистване на канали', 'drain-cleaning', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Building Materials deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'building-materials';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Lumber', 'Дървен материал', 'lumber', v_parent_id, 1),
      ('Drywall', 'Гипсокартон', 'drywall', v_parent_id, 2),
      ('Insulation', 'Изолация', 'insulation', v_parent_id, 3),
      ('Roofing', 'Покривни материали', 'roofing', v_parent_id, 4),
      ('Siding', 'Облицовки', 'siding', v_parent_id, 5),
      ('Concrete', 'Бетон', 'concrete', v_parent_id, 6),
      ('Adhesives & Sealants', 'Лепила и уплътнители', 'adhesives-sealants', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Flooring deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'flooring';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hardwood Flooring', 'Паркет', 'hardwood-flooring', v_parent_id, 1),
      ('Laminate Flooring', 'Ламинат', 'laminate-flooring', v_parent_id, 2),
      ('Vinyl Flooring', 'Винилови подове', 'vinyl-flooring', v_parent_id, 3),
      ('Tile Flooring', 'Плочки за под', 'tile-flooring', v_parent_id, 4),
      ('Carpet', 'Мокет', 'carpet', v_parent_id, 5),
      ('Underlayment', 'Подложка', 'underlayment', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
