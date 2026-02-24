
-- L3 for Guitars
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Acoustic Guitars', 'Акустични китари', 'guitars-acoustic', id, 1 FROM categories WHERE slug = 'guitars'
UNION ALL
SELECT 'Electric Guitars', 'Електрически китари', 'guitars-electric', id, 2 FROM categories WHERE slug = 'guitars'
UNION ALL
SELECT 'Bass Guitars', 'Бас китари', 'guitars-bass', id, 3 FROM categories WHERE slug = 'guitars'
UNION ALL
SELECT 'Classical Guitars', 'Класически китари', 'guitars-classical', id, 4 FROM categories WHERE slug = 'guitars'
UNION ALL
SELECT 'Guitar Amplifiers', 'Китарни усилватели', 'guitars-amplifiers', id, 5 FROM categories WHERE slug = 'guitars';

-- L3 for Pianos & Keyboards
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Digital Pianos', 'Дигитални пиана', 'keyboards-digital', id, 1 FROM categories WHERE slug = 'keyboards'
UNION ALL
SELECT 'Synthesizers', 'Синтезатори', 'keyboards-synth', id, 2 FROM categories WHERE slug = 'keyboards'
UNION ALL
SELECT 'MIDI Controllers', 'MIDI контролери', 'keyboards-midi', id, 3 FROM categories WHERE slug = 'keyboards'
UNION ALL
SELECT 'Organ Keyboards', 'Електронни органи', 'keyboards-organ', id, 4 FROM categories WHERE slug = 'keyboards';

-- L3 for Drums & Percussion
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Acoustic Drum Sets', 'Акустични барабани', 'drums-acoustic', id, 1 FROM categories WHERE slug = 'drums'
UNION ALL
SELECT 'Electronic Drums', 'Електронни барабани', 'drums-electronic', id, 2 FROM categories WHERE slug = 'drums'
UNION ALL
SELECT 'Cymbals', 'Чинели', 'drums-cymbals', id, 3 FROM categories WHERE slug = 'drums'
UNION ALL
SELECT 'Drum Sticks & Hardware', 'Палки и хардуер', 'drums-hardware', id, 4 FROM categories WHERE slug = 'drums';

-- L3 for Wind Instruments
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Saxophones', 'Саксофони', 'wind-saxophones', id, 1 FROM categories WHERE slug = 'wind-instruments'
UNION ALL
SELECT 'Trumpets', 'Тромпети', 'wind-trumpets', id, 2 FROM categories WHERE slug = 'wind-instruments'
UNION ALL
SELECT 'Flutes', 'Флейти', 'wind-flutes', id, 3 FROM categories WHERE slug = 'wind-instruments'
UNION ALL
SELECT 'Clarinets', 'Кларинети', 'wind-clarinets', id, 4 FROM categories WHERE slug = 'wind-instruments'
UNION ALL
SELECT 'Harmonicas', 'Хармоники', 'wind-harmonicas', id, 5 FROM categories WHERE slug = 'wind-instruments';

-- L3 for Audio Equipment
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Microphones', 'Микрофони', 'audio-microphones', id, 1 FROM categories WHERE slug = 'audio-equipment'
UNION ALL
SELECT 'Audio Interfaces', 'Аудио интерфейси', 'audio-interfaces', id, 2 FROM categories WHERE slug = 'audio-equipment'
UNION ALL
SELECT 'Studio Monitors', 'Студийни монитори', 'audio-monitors', id, 3 FROM categories WHERE slug = 'audio-equipment'
UNION ALL
SELECT 'Mixers', 'Миксери', 'audio-mixers', id, 4 FROM categories WHERE slug = 'audio-equipment'
UNION ALL
SELECT 'DJ Equipment', 'DJ оборудване', 'audio-dj', id, 5 FROM categories WHERE slug = 'audio-equipment';
;
