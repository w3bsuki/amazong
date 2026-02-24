
-- STEP 7: Migrate existing products to new category structure
-- Products in "Fashion" (L0) -> move to appropriate L1/L2/L3 based on attributes or keep at L0
-- Products in "Fashion Jewelry" -> move to Women's Jewelry

-- Move Fashion Jewelry product to Women's > Jewelry > Necklaces (as default)
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'women-necklaces' LIMIT 1)
WHERE category_id = '8c7ad0c5-a579-4ccc-8d9d-698b129c71c2';

-- Products directly in Fashion L0 can stay there for now (they need manual categorization)
-- Or we can move them to Unisex > Clothing as a catch-all
-- UPDATE products 
-- SET category_id = 'b1000000-0000-0000-0004-000000000001'
-- WHERE category_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0';
;
