
-- Fix haircare hierarchy: Move L3-type categories under their proper L2 parents
-- L2s with children: shampoo (8), hair-styling (6), hair-tools (6)

-- 1. Move shampoo items under 'shampoo' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'shampoo')
WHERE slug IN (
  'shampoos', 'haircare-shampoo', 'haircare-shampoo-dandruff', 'haircare-shampoo-dry'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'haircare');

-- 2. Move conditioner items together under 'conditioner' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'conditioner')
WHERE slug IN (
  'conditioners', 'haircare-conditioner', 'haircare-conditioner-leave-in', 'haircare-leave-in'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'haircare');

-- 3. Move styling items under 'hair-styling' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hair-styling')
WHERE slug IN (
  'haircare-styling', 'styling-products', 'haircare-gel', 
  'haircare-mousse', 'haircare-spray', 'haircare-wax'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'haircare');

-- 4. Move tools items under 'hair-tools' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hair-tools')
WHERE slug IN (
  'haircare-tools', 'haircare-brushes', 'haircare-combs',
  'haircare-curling-irons', 'haircare-dryers', 'haircare-flat-irons'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'haircare');

-- 5. Move color items under 'hair-color' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hair-color')
WHERE slug IN (
  'haircare-color', 'haircare-color-permanent', 'haircare-color-semi-permanent'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'haircare');

-- 6. Move treatment items under 'hair-treatments' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hair-treatments')
WHERE slug IN (
  'haircare-treatments', 'haircare-mask', 'haircare-masks', 'hair-masks', 'haircare-scalp'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'haircare');

-- 7. Move oil items under 'hair-oil' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hair-oil')
WHERE slug IN (
  'haircare-oil', 'haircare-oil-argan', 'haircare-oils', 'haircare-serum'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'haircare');

-- 8. Move extension items under 'hair-extensions' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hair-extensions')
WHERE slug = 'haircare-extensions'
AND parent_id = (SELECT id FROM categories WHERE slug = 'haircare');

-- 9. Move hair loss items under 'hair-loss' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hair-loss')
WHERE slug = 'haircare-hair-loss'
AND parent_id = (SELECT id FROM categories WHERE slug = 'haircare');

-- 10. Move accessories under 'hair-accessories' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hair-accessories')
WHERE slug = 'haircare-accessories'
AND parent_id = (SELECT id FROM categories WHERE slug = 'haircare');
;
