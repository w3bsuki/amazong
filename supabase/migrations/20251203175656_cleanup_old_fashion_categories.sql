
-- STEP 8: Delete OLD L1/L2 categories (the messy ones)
-- First delete L2 (children), then L1 (parents)

-- Delete old L2 categories under Women's Clothing
DELETE FROM categories WHERE parent_id = 'fb0b0a4b-ef7f-4756-b320-4c2e7591b283';

-- Delete old L2 categories under Men's Clothing  
DELETE FROM categories WHERE parent_id = 'cbb4101e-13e1-43e9-9a2c-087fa459706f';

-- Delete old L2 categories under Shoes
DELETE FROM categories WHERE parent_id = '6b87b9f2-4e38-4e18-ae42-86e2239b1d62';

-- Delete old L2 categories under Bags & Accessories
DELETE FROM categories WHERE parent_id = 'ee129e49-ff94-4438-b34a-c00266d12f42';

-- Delete old L2 categories under Fashion Jewelry
DELETE FROM categories WHERE parent_id = '8c7ad0c5-a579-4ccc-8d9d-698b129c71c2';

-- Delete old L2 categories under Kids & Baby Fashion
DELETE FROM categories WHERE parent_id = '7178bcd3-3546-4c31-94ce-e7456c79e52d';

-- Now delete the old L1 categories
DELETE FROM categories WHERE id = 'fb0b0a4b-ef7f-4756-b320-4c2e7591b283'; -- Women's Clothing
DELETE FROM categories WHERE id = 'cbb4101e-13e1-43e9-9a2c-087fa459706f'; -- Men's Clothing
DELETE FROM categories WHERE id = '6b87b9f2-4e38-4e18-ae42-86e2239b1d62'; -- Shoes
DELETE FROM categories WHERE id = 'ee129e49-ff94-4438-b34a-c00266d12f42'; -- Bags & Accessories
DELETE FROM categories WHERE id = '8c7ad0c5-a579-4ccc-8d9d-698b129c71c2'; -- Fashion Jewelry
DELETE FROM categories WHERE id = '7178bcd3-3546-4c31-94ce-e7456c79e52d'; -- Kids & Baby Fashion
;
