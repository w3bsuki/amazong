
-- Batch 49: More deep categories - Musical equipment, Audio, Lighting
DO $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- DJ Equipment deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'dj-equipment';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('DJ Controllers', 'DJ контролери', 'dj-controllers', v_parent_id, 1),
      ('Turntables', 'Грамофони', 'turntables', v_parent_id, 2),
      ('DJ Mixers', 'DJ миксери', 'dj-mixers', v_parent_id, 3),
      ('DJ Headphones', 'DJ слушалки', 'dj-headphones', v_parent_id, 4),
      ('DJ Software', 'DJ софтуер', 'dj-software', v_parent_id, 5),
      ('DJ Speakers', 'DJ тонколони', 'dj-speakers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pro Audio deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pro-audio';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Audio Interfaces', 'Аудио интерфейси', 'audio-interfaces', v_parent_id, 1),
      ('Studio Monitors', 'Студийни монитори', 'studio-monitors', v_parent_id, 2),
      ('Microphones', 'Микрофони', 'microphones', v_parent_id, 3),
      ('Preamps', 'Предусилватели', 'preamps', v_parent_id, 4),
      ('Mixing Consoles', 'Миксерни пултове', 'mixing-consoles', v_parent_id, 5),
      ('Audio Cables', 'Аудио кабели', 'audio-cables', v_parent_id, 6),
      ('Rack Equipment', 'Рак оборудване', 'rack-equipment', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  SELECT id INTO v_parent_id FROM categories WHERE slug = 'microphones';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Condenser Microphones', 'Кондензаторни микрофони', 'condenser-microphones', v_parent_id, 1),
      ('Dynamic Microphones', 'Динамични микрофони', 'dynamic-microphones', v_parent_id, 2),
      ('USB Microphones', 'USB микрофони', 'usb-microphones', v_parent_id, 3),
      ('Wireless Microphones', 'Безжични микрофони', 'wireless-microphones', v_parent_id, 4),
      ('Lavalier Microphones', 'Лавалиер микрофони', 'lavalier-microphones', v_parent_id, 5),
      ('Shotgun Microphones', 'Насочени микрофони', 'shotgun-microphones', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- PA Systems deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'pa-systems';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('PA Speakers', 'PA тонколони', 'pa-speakers', v_parent_id, 1),
      ('PA Amplifiers', 'PA усилватели', 'pa-amplifiers', v_parent_id, 2),
      ('Subwoofers', 'Субуфери', 'subwoofers', v_parent_id, 3),
      ('PA Mixers', 'PA миксери', 'pa-mixers', v_parent_id, 4),
      ('Powered Speakers', 'Активни тонколони', 'powered-speakers', v_parent_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Guitar Amplifiers deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'guitar-amplifiers';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Tube Amplifiers', 'Лампови усилватели', 'tube-amplifiers', v_parent_id, 1),
      ('Solid State Amps', 'Транзисторни усилватели', 'solid-state-amps', v_parent_id, 2),
      ('Modeling Amps', 'Моделиращи усилватели', 'modeling-amps', v_parent_id, 3),
      ('Combo Amps', 'Комбо усилватели', 'combo-amps', v_parent_id, 4),
      ('Amp Heads', 'Усилвателни глави', 'amp-heads', v_parent_id, 5),
      ('Guitar Cabinets', 'Китарни кабинети', 'guitar-cabinets', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Effects Pedals deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'effects-pedals';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Distortion Pedals', 'Дисторшън педали', 'distortion-pedals', v_parent_id, 1),
      ('Overdrive Pedals', 'Овърдрайв педали', 'overdrive-pedals', v_parent_id, 2),
      ('Delay Pedals', 'Дилей педали', 'delay-pedals', v_parent_id, 3),
      ('Reverb Pedals', 'Реверб педали', 'reverb-pedals', v_parent_id, 4),
      ('Wah Pedals', 'Уа педали', 'wah-pedals', v_parent_id, 5),
      ('Multi-Effects', 'Мулти ефекти', 'multi-effects', v_parent_id, 6),
      ('Pedalboards', 'Педалборди', 'pedalboards', v_parent_id, 7)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Stage Lighting deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'stage-lighting';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('LED Stage Lights', 'LED сценично осветление', 'led-stage-lights', v_parent_id, 1),
      ('Moving Head Lights', 'Движещи се глави', 'moving-head-lights', v_parent_id, 2),
      ('Par Lights', 'Пар осветление', 'par-lights', v_parent_id, 3),
      ('Laser Lights', 'Лазери', 'laser-lights', v_parent_id, 4),
      ('Fog Machines', 'Димни машини', 'fog-machines', v_parent_id, 5),
      ('Lighting Controllers', 'Контролери за осветление', 'lighting-controllers', v_parent_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Wind Instruments deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'wind-instruments';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Saxophones', 'Саксофони', 'saxophones', v_parent_id, 1),
      ('Trumpets', 'Тромпети', 'trumpets', v_parent_id, 2),
      ('Clarinets', 'Кларинети', 'clarinets', v_parent_id, 3),
      ('Flutes', 'Флейти', 'flutes', v_parent_id, 4),
      ('Trombones', 'Тромбони', 'trombones', v_parent_id, 5),
      ('French Horns', 'Валдхорни', 'french-horns', v_parent_id, 6),
      ('Tubas', 'Туби', 'tubas', v_parent_id, 7),
      ('Harmonicas', 'Хармоники', 'harmonicas', v_parent_id, 8),
      ('Recorders', 'Блокфлейти', 'recorders', v_parent_id, 9)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- String Instruments deeper
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'string-instruments';
  IF v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
      ('Violins', 'Цигулки', 'violins', v_parent_id, 1),
      ('Violas', 'Виоли', 'violas', v_parent_id, 2),
      ('Cellos', 'Чела', 'cellos', v_parent_id, 3),
      ('Double Basses', 'Контрабаси', 'double-basses', v_parent_id, 4),
      ('Ukuleles', 'Укулели', 'ukuleles', v_parent_id, 5),
      ('Banjos', 'Банджо', 'banjos', v_parent_id, 6),
      ('Mandolins', 'Мандолини', 'mandolins', v_parent_id, 7),
      ('Harps', 'Арфи', 'harps', v_parent_id, 8)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
;
