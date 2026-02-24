
-- Remove more duplicate categories and consolidate similar ones

-- 1. Outdoor Lighting duplicate - keep outdoor-lighting under Garden, delete light-outdoor under Lighting
DELETE FROM categories WHERE id = '0ee7eb3a-8ea6-4165-a4c3-011dc9f768c2';

-- 2. Closet duplicates - merge Closet Organization and Closet Organizers (keep storage-closet)
DELETE FROM categories WHERE id = '5a44b7f7-e580-40ab-8131-e33a8f7817aa';

-- 3. Storage Bins duplicates - merge Storage Bins and Storage Bins & Boxes (keep storage-bins)
DELETE FROM categories WHERE id = '96ac1579-bf5f-46e9-878b-29f9f46c3d13';

-- 4. Laundry duplicates - merge Laundry and Laundry Supplies (keep household-laundry)
DELETE FROM categories WHERE id = '6ec01979-1085-467e-b390-7416bc21cefb';

-- 5. Remove redundant empty Office categories under Furniture (Office & School has them)
DELETE FROM categories WHERE id IN (
  'dc03b5e5-1e4d-4d18-a0ec-8a2fd463f5d0', -- Office Chairs under Furniture
  '7364e0be-ef19-4917-b1cc-a51a998b7924', -- Office Desks under Furniture
  '78cb5a56-4bfb-40ef-852e-90f6ada0d57c'  -- Office Furniture Home under Furniture
);

-- 6. Remove duplicate Sculptures (keep decor-figurines as Figurines & Sculptures)
DELETE FROM categories WHERE id = '1f37d9d8-3e9e-4b7b-91a7-4e02eb193fa3';

-- 7. Seeds is duplicate of Plants & Seeds content (keep under plants-seeds)
DELETE FROM categories WHERE id = '297a2c2b-1626-4fe3-abd7-b80244213e08';

-- 8. Hangers duplicate of Hooks & Hangers (keep storage-hooks)
DELETE FROM categories WHERE id = '224bbb12-8f24-4e4a-a721-eea26301a38b';
;
