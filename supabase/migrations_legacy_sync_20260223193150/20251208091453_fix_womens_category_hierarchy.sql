
-- =====================================================
-- FIX WOMEN'S CATEGORY HIERARCHY
-- =====================================================
-- Women's Clothing ID: b1000000-0000-0000-0002-000000000001
-- Women's Shoes ID: b1000000-0000-0000-0002-000000000002

-- Move L3 clothing items under women-clothing
UPDATE categories 
SET parent_id = 'b1000000-0000-0000-0002-000000000001'  -- women-clothing
WHERE parent_id = 'a1000000-0000-0000-0000-000000000002'  -- fashion-womens
AND slug IN (
  'womens-dresses',
  'womens-tops',
  'womens-blouses',
  'womens-pants',
  'womens-skirts',
  'womens-jeans',
  'womens-jackets',
  'womens-coats',
  'womens-sweaters',
  'womens-activewear',
  'womens-lingerie',
  'womens-swimwear'
);

-- Move L3 shoes items under women-shoes
UPDATE categories 
SET parent_id = 'b1000000-0000-0000-0002-000000000002'  -- women-shoes
WHERE slug = 'womens-shoes'
AND parent_id = 'a1000000-0000-0000-0000-000000000002';

-- =====================================================
-- FIX KIDS CATEGORY HIERARCHY
-- =====================================================
-- Get kids L1 and L2 IDs first
-- fashion-kids: a1000000-0000-0000-0000-000000000003

-- Check if same issue exists for kids
-- Kids Clothing: b1000000-0000-0000-0003-000000000001
-- Kids Shoes: b1000000-0000-0000-0003-000000000002
;
