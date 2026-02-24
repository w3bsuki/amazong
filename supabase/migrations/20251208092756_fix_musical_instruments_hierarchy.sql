
-- Fix musical-instruments hierarchy: Move L3-type categories under their proper L2 parents
-- L2s with children: wind-instruments (9), music-accessories (8), string-instruments (8),
-- drums-percussion (6), keyboards-pianos (5), dj-equipment (4)

-- 1. Move wind instruments under 'wind-instruments' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'wind-instruments')
WHERE slug IN (
  'brass-instruments', 'music-brass', 'music-wind', 'musical-wind',
  'woodwind-instruments', 'musical-flutes', 'musical-saxophones', 'musical-trumpets'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'musical-instruments');

-- 2. Move string instruments under 'string-instruments' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'string-instruments')
WHERE slug IN (
  'guitars', 'guitars-basses', 'music-guitars', 'music-strings',
  'musical-guitars', 'musical-guitars-acoustic', 'musical-guitars-bass',
  'musical-guitars-classical', 'musical-guitars-electric', 'musical-string',
  'musical-violins', 'musical-cellos'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'musical-instruments');

-- 3. Move drums/percussion under 'drums-percussion' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'drums-percussion')
WHERE slug IN (
  'drums', 'music-drums', 'musical-drums', 'musical-drums-acoustic',
  'musical-drums-electronic', 'musical-drumsticks'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'musical-instruments');

-- 4. Move keyboards/pianos under 'keyboards-pianos' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'keyboards-pianos')
WHERE slug IN (
  'keyboards-music', 'music-pianos', 'musical-keyboards',
  'musical-digital-pianos', 'musical-synthesizers'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'musical-instruments');

-- 5. Move DJ equipment under 'dj-equipment' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'dj-equipment')
WHERE slug IN (
  'music-dj', 'musical-dj', 'musical-dj-controllers', 'musical-turntables'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'musical-instruments');

-- 6. Move accessories under 'music-accessories' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'music-accessories')
WHERE slug IN (
  'instrument-accessories', 'musical-guitar-amps', 'musical-guitar-effects',
  'musical-guitar-strings'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'musical-instruments');

-- 7. Move recording equipment together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'recording-equipment')
WHERE slug IN (
  'music-recording', 'musical-recording', 'musical-audio-interfaces',
  'musical-microphones', 'musical-mics-condenser', 'musical-midi-controllers'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'musical-instruments');
;
