
-- =====================================================
-- FIX CATEGORY HIERARCHY
-- =====================================================
-- Problem: Categories are at wrong levels. Let's fix them.

-- Get the fashion category ID
-- Fashion ID: 9a04f634-c3e5-4b02-9448-7b99584d82e0
-- Men's ID: a1000000-0000-0000-0000-000000000001
-- Men's Clothing ID: b1000000-0000-0000-0001-000000000001

-- =====================================================
-- STEP 1: Move misplaced L2 categories (like mens-shirts) under men-clothing (L3)
-- These should be CHILDREN of men-clothing, not siblings
-- =====================================================

-- Move mens-shirts, mens-tshirts, mens-pants, mens-jeans, mens-jackets, etc.
-- from parent fashion-mens to parent men-clothing
UPDATE categories 
SET parent_id = 'b1000000-0000-0000-0001-000000000001'  -- men-clothing
WHERE parent_id = 'a1000000-0000-0000-0000-000000000001'  -- fashion-mens
AND slug IN (
  'mens-shirts',
  'mens-tshirts', 
  'mens-pants',
  'mens-jeans',
  'mens-jackets',
  'mens-suits',
  'mens-sweaters',
  'mens-activewear',
  'mens-underwear',
  'mens-sleepwear'
);

-- Move mens-shoes under men-shoes (the L2 category)
UPDATE categories 
SET parent_id = 'b1000000-0000-0000-0001-000000000002'  -- men-shoes
WHERE slug = 'mens-shoes'
AND parent_id = 'a1000000-0000-0000-0000-000000000001';

-- =====================================================
-- STEP 2: Fix categories incorrectly at L0 (parent_id NULL)
-- Plus Size and Vintage should be UNDER Fashion, not at root
-- =====================================================

-- Move Plus Size Women under Fashion as L1
UPDATE categories 
SET parent_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0',  -- fashion
    display_order = 10
WHERE slug = 'fashion-plus-size-women'
AND parent_id IS NULL;

-- Move Vintage Clothing under Fashion as L1
UPDATE categories 
SET parent_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0',  -- fashion
    display_order = 11
WHERE slug = 'fashion-vintage-clothing'
AND parent_id IS NULL;

-- Move Plus Size Men under Fashion as L1
UPDATE categories 
SET parent_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0',  -- fashion
    display_order = 12
WHERE slug = 'fashion-plus-size-men'
AND parent_id IS NULL;

-- Now move the sub-categories of Plus Size under their parents
-- Get Plus Size Women ID first
-- Plus Size Dresses -> should be under Plus Size Women
UPDATE categories 
SET parent_id = '26041315-3e2d-41f2-8a05-2c737586df9a'  -- plus-size-women
WHERE slug = 'fashion-plus-size-dresses'
AND parent_id IS NULL;

-- Plus Size Tops -> under Plus Size Women
UPDATE categories 
SET parent_id = '26041315-3e2d-41f2-8a05-2c737586df9a'
WHERE slug = 'fashion-plus-size-tops'
AND parent_id IS NULL;

-- Plus Size Shirts -> under Plus Size Men
UPDATE categories 
SET parent_id = 'c4ae5a57-3fbe-4e98-a5c9-2020ded7c5ce'  -- plus-size-men
WHERE slug = 'fashion-plus-size-shirts'
AND parent_id IS NULL;

-- Move Vintage sub-categories under Vintage Clothing
UPDATE categories 
SET parent_id = 'a81d455c-8f25-4ff9-9f09-f095473f5d84'  -- vintage-clothing
WHERE slug IN ('fashion-vintage-dresses', 'fashion-vintage-jackets', 'fashion-vintage-accessories')
AND parent_id IS NULL;

-- =====================================================
-- STEP 3: Do the same for Women's categories
-- =====================================================

-- Get Women's Clothing ID: b1000000-0000-0000-0002-000000000001
-- Women's Shoes ID: b1000000-0000-0000-0002-000000000002

-- First check what L2s exist under fashion-womens that should be L3
-- (Will handle in next migration if needed)
;
