
-- STEP 1: Create new L1 categories (Gender-based: Men's, Women's, Kids, Unisex)
-- Fashion L0 ID: 9a04f634-c3e5-4b02-9448-7b99584d82e0

-- Delete OLD L1 categories first (they'll be replaced)
-- But first, we need to save the L2 items to reassign them

-- Create new L1: Men's Fashion
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order, icon)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Men''s',
  'Мъже',
  'fashion-mens',
  '9a04f634-c3e5-4b02-9448-7b99584d82e0',
  1,
  'user'
);

-- Create new L1: Women's Fashion  
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order, icon)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'Women''s',
  'Жени',
  'fashion-womens',
  '9a04f634-c3e5-4b02-9448-7b99584d82e0',
  2,
  'user'
);

-- Create new L1: Kids Fashion
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order, icon)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'Kids',
  'Деца',
  'fashion-kids',
  '9a04f634-c3e5-4b02-9448-7b99584d82e0',
  3,
  'baby'
);

-- Create new L1: Unisex Fashion
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order, icon)
VALUES (
  'a1000000-0000-0000-0000-000000000004',
  'Unisex',
  'Унисекс',
  'fashion-unisex',
  '9a04f634-c3e5-4b02-9448-7b99584d82e0',
  4,
  'users'
);
;
