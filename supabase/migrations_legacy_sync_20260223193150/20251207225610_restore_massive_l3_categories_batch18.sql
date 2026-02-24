
-- Batch 18: Deep L3 categories from various sections
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Musical Instruments - Guitars L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'acoustic-guitars';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Classical Guitars', 'Класически китари', 'classical-guitars', v_parent_id, 1),
      ('Steel String Guitars', 'Китари със стоманени струни', 'steel-string-guitars', v_parent_id, 2),
      ('12-String Guitars', '12-струнни китари', '12-string-guitars', v_parent_id, 3),
      ('Travel Guitars', 'Пътни китари', 'travel-acoustic-guitars', v_parent_id, 4),
      ('Parlor Guitars', 'Салонни китари', 'parlor-guitars', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'electric-guitars';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Solid Body Guitars', 'Китари със солидно тяло', 'solid-body-guitars', v_parent_id, 1),
      ('Semi-Hollow Body', 'Полу-кухо тяло', 'semi-hollow-body', v_parent_id, 2),
      ('Hollow Body Guitars', 'Китари с кухо тяло', 'hollow-body-guitars', v_parent_id, 3),
      ('Left-Handed Guitars', 'Леворъки китари', 'left-handed-guitars', v_parent_id, 4),
      ('7 & 8 String Guitars', '7 и 8 струнни китари', '7-8-string-guitars', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'bass-guitars';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('4-String Bass', '4-струнен бас', '4-string-bass', v_parent_id, 1),
      ('5-String Bass', '5-струнен бас', '5-string-bass', v_parent_id, 2),
      ('6-String Bass', '6-струнен бас', '6-string-bass', v_parent_id, 3),
      ('Acoustic Bass', 'Акустичен бас', 'acoustic-bass', v_parent_id, 4),
      ('Fretless Bass', 'Безпрагов бас', 'fretless-bass', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Musical Instruments - Drums L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'acoustic-drum-kits';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Shell Packs', 'Комплекти барабани', 'shell-packs', v_parent_id, 1),
      ('Snare Drums', 'Соло барабани', 'snare-drums', v_parent_id, 2),
      ('Bass Drums', 'Бас барабани', 'bass-drums', v_parent_id, 3),
      ('Tom Toms', 'Том томове', 'tom-toms', v_parent_id, 4),
      ('Floor Toms', 'Подови томове', 'floor-toms', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'electronic-drum-kits';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Entry Level Kits', 'Начални комплекти', 'entry-level-drum-kits', v_parent_id, 1),
      ('Professional Kits', 'Професионални комплекти', 'professional-drum-kits', v_parent_id, 2),
      ('Drum Modules', 'Барабанни модули', 'drum-modules', v_parent_id, 3),
      ('Expansion Pads', 'Допълнителни падове', 'expansion-pads', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'cymbals';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Hi-Hat Cymbals', 'Чинели хай-хат', 'hi-hat-cymbals', v_parent_id, 1),
      ('Crash Cymbals', 'Чинели краш', 'crash-cymbals', v_parent_id, 2),
      ('Ride Cymbals', 'Чинели райд', 'ride-cymbals', v_parent_id, 3),
      ('Splash Cymbals', 'Чинели сплаш', 'splash-cymbals', v_parent_id, 4),
      ('China Cymbals', 'Китайски чинели', 'china-cymbals', v_parent_id, 5),
      ('Cymbal Sets', 'Комплекти чинели', 'cymbal-sets', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Musical Instruments - Keyboards L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'digital-pianos';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Stage Pianos', 'Сценични пиана', 'stage-pianos', v_parent_id, 1),
      ('Console Pianos', 'Конзолни пиана', 'console-pianos', v_parent_id, 2),
      ('Portable Pianos', 'Преносими пиана', 'portable-pianos', v_parent_id, 3),
      ('Grand Pianos', 'Рояли', 'digital-grand-pianos', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'synthesizers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Analog Synthesizers', 'Аналогови синтезатори', 'analog-synthesizers', v_parent_id, 1),
      ('Digital Synthesizers', 'Цифрови синтезатори', 'digital-synthesizers', v_parent_id, 2),
      ('Modular Synthesizers', 'Модулни синтезатори', 'modular-synthesizers', v_parent_id, 3),
      ('Workstation Synthesizers', 'Синтезатор работни станции', 'workstation-synthesizers', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Musical Instruments - String Instruments L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'violins';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Student Violins', 'Ученически цигулки', 'student-violins', v_parent_id, 1),
      ('Intermediate Violins', 'Средно ниво цигулки', 'intermediate-violins', v_parent_id, 2),
      ('Professional Violins', 'Професионални цигулки', 'professional-violins', v_parent_id, 3),
      ('Electric Violins', 'Електрически цигулки', 'electric-violins', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Musical Instruments - Wind Instruments L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'flutes';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Concert Flutes', 'Концертни флейти', 'concert-flutes', v_parent_id, 1),
      ('Piccolo', 'Пиколо', 'piccolo', v_parent_id, 2),
      ('Alto Flutes', 'Алтови флейти', 'alto-flutes', v_parent_id, 3),
      ('Bass Flutes', 'Басови флейти', 'bass-flutes', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'clarinets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bb Clarinets', 'Bb кларинети', 'bb-clarinets', v_parent_id, 1),
      ('A Clarinets', 'A кларинети', 'a-clarinets', v_parent_id, 2),
      ('Bass Clarinets', 'Бас кларинети', 'bass-clarinets', v_parent_id, 3),
      ('Eb Clarinets', 'Eb кларинети', 'eb-clarinets', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'saxophones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Alto Saxophones', 'Алт саксофони', 'alto-saxophones', v_parent_id, 1),
      ('Tenor Saxophones', 'Тенор саксофони', 'tenor-saxophones', v_parent_id, 2),
      ('Soprano Saxophones', 'Сопран саксофони', 'soprano-saxophones', v_parent_id, 3),
      ('Baritone Saxophones', 'Баритон саксофони', 'baritone-saxophones', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'trumpets';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Bb Trumpets', 'Bb тромпети', 'bb-trumpets', v_parent_id, 1),
      ('C Trumpets', 'C тромпети', 'c-trumpets', v_parent_id, 2),
      ('Pocket Trumpets', 'Джобни тромпети', 'pocket-trumpets', v_parent_id, 3),
      ('Flugelhorns', 'Флюгелхорни', 'flugelhorns', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Audio Equipment - Microphones L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'microphones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Condenser Microphones', 'Кондензаторни микрофони', 'condenser-microphones', v_parent_id, 1),
      ('Dynamic Microphones', 'Динамични микрофони', 'dynamic-microphones', v_parent_id, 2),
      ('Ribbon Microphones', 'Лентови микрофони', 'ribbon-microphones', v_parent_id, 3),
      ('USB Microphones', 'USB микрофони', 'usb-microphones', v_parent_id, 4),
      ('Wireless Microphones', 'Безжични микрофони', 'wireless-microphones', v_parent_id, 5),
      ('Lavalier Microphones', 'Брошки микрофони', 'lavalier-microphones', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Audio Equipment - Speakers L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'speakers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('PA Speakers', 'PA озвучителни тела', 'pa-speakers', v_parent_id, 1),
      ('Studio Monitors', 'Студийни монитори', 'studio-monitors', v_parent_id, 2),
      ('Subwoofers', 'Субуфери', 'audio-subwoofers', v_parent_id, 3),
      ('Portable Speakers', 'Преносими тонколони', 'portable-audio-speakers', v_parent_id, 4),
      ('Line Array Speakers', 'Линейни масиви', 'line-array-speakers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Audio Equipment - Amplifiers L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'amplifiers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Guitar Amplifiers', 'Китарни усилватели', 'guitar-amplifiers', v_parent_id, 1),
      ('Bass Amplifiers', 'Бас усилватели', 'bass-amplifiers', v_parent_id, 2),
      ('Keyboard Amplifiers', 'Клавирни усилватели', 'keyboard-amplifiers', v_parent_id, 3),
      ('Power Amplifiers', 'Усилватели на мощност', 'power-amplifiers', v_parent_id, 4),
      ('Acoustic Amplifiers', 'Акустични усилватели', 'acoustic-amplifiers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- DJ Equipment L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'turntables';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Direct Drive Turntables', 'Грамофони с директно задвижване', 'direct-drive-turntables', v_parent_id, 1),
      ('Belt Drive Turntables', 'Грамофони с ремъчно задвижване', 'belt-drive-turntables', v_parent_id, 2),
      ('DJ Turntables', 'DJ грамофони', 'dj-turntables', v_parent_id, 3),
      ('USB Turntables', 'USB грамофони', 'usb-turntables', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'mixers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('DJ Mixers', 'DJ миксери', 'dj-mixers', v_parent_id, 1),
      ('Audio Mixers', 'Аудио миксери', 'audio-mixers', v_parent_id, 2),
      ('Digital Mixers', 'Цифрови миксери', 'digital-mixers', v_parent_id, 3),
      ('Analog Mixers', 'Аналогови миксери', 'analog-mixers', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Recording Equipment L3
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'audio-interfaces';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('USB Audio Interfaces', 'USB аудио интерфейси', 'usb-audio-interfaces', v_parent_id, 1),
      ('Thunderbolt Interfaces', 'Thunderbolt интерфейси', 'thunderbolt-interfaces', v_parent_id, 2),
      ('Firewire Interfaces', 'Firewire интерфейси', 'firewire-interfaces', v_parent_id, 3),
      ('Professional Interfaces', 'Професионални интерфейси', 'professional-audio-interfaces', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'midi-controllers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Keyboard Controllers', 'Клавиатурни контролери', 'keyboard-controllers', v_parent_id, 1),
      ('Pad Controllers', 'Пад контролери', 'pad-controllers', v_parent_id, 2),
      ('DJ Controllers', 'DJ контролери', 'dj-controllers', v_parent_id, 3),
      ('Wind Controllers', 'Духови контролери', 'wind-controllers', v_parent_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
