
-- Fix skincare hierarchy: Move L3-type categories under their proper L2 parents
-- L2s with children: face-moisturizers (6), cleansers (4), eye-care (4), moisturizers (4)

-- 1. Move cleanser related items under 'cleansers' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'cleansers')
WHERE slug IN (
  'face-cleansers', 'facial-cleansers', 'skincare-cleansers',
  'skincare-cleansers-foam', 'skincare-cleansers-gel', 'skincare-cleansers-oil'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'skincare');

-- 2. Move eye care related items under 'eye-care' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'eye-care')
WHERE slug IN (
  'eye-cream', 'eye-creams', 'skincare-eye-creams'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'skincare');

-- 3. Move moisturizer related items under 'moisturizers' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'moisturizers')
WHERE slug IN (
  'skincare-moisturizers', 'skincare-moisturizers-day', 'skincare-moisturizers-night',
  'body-lotions', 'skincare-body-lotions', 'skincare-body-butters'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'skincare');

-- 4. Move face moisturizer items under 'face-moisturizers' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'face-moisturizers')
WHERE slug IN (
  'anti-aging', 'skincare-anti-aging', 'skincare-face-oils'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'skincare');

-- 5. Create serums L2 grouping
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'serums')
WHERE slug IN (
  'face-serums', 'skincare-serums', 'skincare-serums-hyaluronic',
  'skincare-serums-retinol', 'skincare-serums-vitamin-c'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'skincare');

-- 6. Create masks L2 grouping
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'face-masks')
WHERE slug IN (
  'skincare-face-masks', 'skincare-masks', 'skincare-masks-clay', 'skincare-masks-sheet'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'skincare');

-- 7. Move acne treatments together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'acne-care')
WHERE slug IN (
  'acne-treatment', 'skincare-acne', 'skincare-acne-treatment'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'skincare');

-- 8. Move sunscreen together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'sunscreen')
WHERE slug IN (
  'skincare-sunscreen', 'skincare-sunscreen-spf30', 'skincare-sunscreen-spf50', 'sunscreens'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'skincare');

-- 9. Move toners together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'toners')
WHERE slug = 'skincare-toners'
AND parent_id = (SELECT id FROM categories WHERE slug = 'skincare');

-- 10. Move lip care together
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'lip-care')
WHERE slug = 'skincare-lip-care'
AND parent_id = (SELECT id FROM categories WHERE slug = 'skincare');

-- Keep as L2: exfoliators, skincare-exfoliators
;
