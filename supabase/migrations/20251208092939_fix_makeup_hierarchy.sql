
-- Fix makeup hierarchy: Move L3-type categories under their proper L2 parents
-- L2s with children: lip-makeup (11), eye-makeup (9), face-makeup (8), foundation (7)

-- 1. Move lip items under 'lip-makeup' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'lip-makeup')
WHERE slug IN (
  'lip-gloss', 'lipstick', 'makeup-lip-gloss', 'makeup-lip-liner', 'makeup-lipstick'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'makeup');

-- 2. Move eye items under 'eye-makeup' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'eye-makeup')
WHERE slug IN (
  'eye-shadow', 'eyeshadow', 'eyeliner', 'mascara', 'brow-products',
  'makeup-eyebrow', 'makeup-eyeliner', 'makeup-eyeshadow', 
  'makeup-false-lashes', 'makeup-mascara'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'makeup');

-- 3. Move face items under 'face-makeup' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'face-makeup')
WHERE slug IN (
  'blush', 'bronzer', 'bronzer-highlighter', 'concealer', 'highlighter',
  'powder', 'makeup-blush', 'makeup-bronzer', 'makeup-concealer',
  'makeup-highlighter', 'makeup-powder', 'makeup-primer', 
  'makeup-setting-spray', 'setting-sprays'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'makeup');

-- 4. Move foundation items under 'foundation' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'foundation')
WHERE slug = 'makeup-foundation'
AND parent_id = (SELECT id FROM categories WHERE slug = 'makeup');

-- Keep as L2: makeup-brushes, makeup-palettes, makeup-sets, makeup-removers, nail-polish
;
