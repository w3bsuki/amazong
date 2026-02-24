-- Restore skincare-serums as a child of serums
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
VALUES (
  'Serums', 
  'skincare-serums', 
  '4cc76fa4-a450-44de-ac13-c56eab12d164',  -- serums parent
  'Серуми',
  '✨'
);

-- Move the serum-* categories back under skincare-serums
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'skincare-serums')
WHERE slug IN ('serum-acne', 'serum-antiaging', 'serum-brightening', 'serum-hyaluronic', 'serum-niacinamide', 'serum-retinol', 'serum-vitaminc');;
