-- Restore Musical Instruments L3 categories

-- Guitars L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Acoustic Guitars', 'guitars-acoustic', 'Акустични китари', 1),
  ('Electric Guitars', 'guitars-electric', 'Електрически китари', 2),
  ('Classical Guitars', 'guitars-classical', 'Класически китари', 3),
  ('Bass Guitars', 'guitars-bass', 'Бас китари', 4),
  ('12-String Guitars', 'guitars-12string', '12-струнни китари', 5),
  ('Travel Guitars', 'guitars-travel', 'Пътуващи китари', 6),
  ('Left-Handed Guitars', 'guitars-left-handed', 'Леви китари', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'instruments-guitars'
ON CONFLICT (slug) DO NOTHING;

-- Keyboards L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Digital Pianos', 'keyboards-digital-pianos', 'Цифрови пиана', 1),
  ('Synthesizers', 'keyboards-synths', 'Синтезатори', 2),
  ('MIDI Controllers', 'keyboards-midi', 'MIDI контролери', 3),
  ('Organ Keyboards', 'keyboards-organs', 'Органи', 4),
  ('Arranger Keyboards', 'keyboards-arranger', 'Аранжори', 5),
  ('Stage Pianos', 'keyboards-stage', 'Сценични пиана', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'instruments-keyboards'
ON CONFLICT (slug) DO NOTHING;

-- Drums L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Acoustic Drum Kits', 'drums-acoustic', 'Акустични барабани', 1),
  ('Electronic Drum Kits', 'drums-electronic', 'Електронни барабани', 2),
  ('Snare Drums', 'drums-snare', 'Малки барабани', 3),
  ('Bass Drums', 'drums-bass', 'Бас барабани', 4),
  ('Cymbals', 'drums-cymbals', 'Чинели', 5),
  ('Drum Hardware', 'drums-hardware', 'Хардуер за барабани', 6),
  ('Drum Heads', 'drums-heads', 'Кожи за барабани', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'instruments-drums'
ON CONFLICT (slug) DO NOTHING;

-- Wind Instruments L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Saxophones', 'wind-saxophones', 'Саксофони', 1),
  ('Trumpets', 'wind-trumpets', 'Тромпети', 2),
  ('Trombones', 'wind-trombones', 'Тромбони', 3),
  ('Flutes', 'wind-flutes', 'Флейти', 4),
  ('Clarinets', 'wind-clarinets', 'Кларинети', 5),
  ('French Horns', 'wind-french-horns', 'Валдхорни', 6),
  ('Tubas', 'wind-tubas', 'Туби', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'instruments-wind'
ON CONFLICT (slug) DO NOTHING;

-- String Instruments L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Violins', 'strings-violins', 'Цигулки', 1),
  ('Violas', 'strings-violas', 'Виоли', 2),
  ('Cellos', 'strings-cellos', 'Виолончела', 3),
  ('Double Basses', 'strings-basses', 'Контрабаси', 4),
  ('Ukuleles', 'strings-ukuleles', 'Укулели', 5),
  ('Mandolins', 'strings-mandolins', 'Мандолини', 6),
  ('Banjos', 'strings-banjos', 'Банджа', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'instruments-strings'
ON CONFLICT (slug) DO NOTHING;

-- DJ Equipment L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Turntables', 'dj-turntables', 'Грамофони', 1),
  ('DJ Controllers', 'dj-controllers', 'DJ контролери', 2),
  ('DJ Mixers', 'dj-mixers', 'DJ миксери', 3),
  ('DJ Software', 'dj-software', 'DJ софтуер', 4),
  ('DJ Headphones', 'dj-headphones', 'DJ слушалки', 5),
  ('DJ Lighting', 'dj-lighting', 'DJ осветление', 6)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'instruments-dj'
ON CONFLICT (slug) DO NOTHING;

-- Recording Equipment L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Audio Interfaces', 'recording-interfaces', 'Аудио интерфейси', 1),
  ('Microphones', 'recording-microphones', 'Микрофони', 2),
  ('Studio Monitors', 'recording-monitors', 'Студийни монитори', 3),
  ('Preamps', 'recording-preamps', 'Предусилватели', 4),
  ('DAW Software', 'recording-daw', 'DAW софтуер', 5),
  ('Headphones', 'recording-headphones', 'Студийни слушалки', 6),
  ('Microphone Stands', 'recording-stands', 'Стойки за микрофони', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'instruments-recording'
ON CONFLICT (slug) DO NOTHING;

-- Guitar Accessories L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Guitar Strings', 'guitar-acc-strings', 'Струни за китара', 1),
  ('Guitar Picks', 'guitar-acc-picks', 'Перца', 2),
  ('Guitar Cases', 'guitar-acc-cases', 'Калъфи за китара', 3),
  ('Guitar Stands', 'guitar-acc-stands', 'Стойки за китара', 4),
  ('Guitar Capos', 'guitar-acc-capos', 'Капо', 5),
  ('Guitar Tuners', 'guitar-acc-tuners', 'Тунери', 6),
  ('Guitar Straps', 'guitar-acc-straps', 'Каиши', 7),
  ('Guitar Pedals', 'guitar-acc-pedals', 'Китарни педали', 8),
  ('Guitar Amplifiers', 'guitar-acc-amps', 'Китарни усилватели', 9)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'instruments-accessories'
ON CONFLICT (slug) DO NOTHING;;
