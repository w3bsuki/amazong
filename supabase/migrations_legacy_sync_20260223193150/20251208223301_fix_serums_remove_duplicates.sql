-- Remove duplicate serum categories (keep the serum-* ones, delete skincare-serums-* ones)
DELETE FROM categories WHERE slug IN (
  'skincare-serums-hyaluronic',
  'skincare-serums-retinol', 
  'skincare-serums-vitamin-c'
);;
