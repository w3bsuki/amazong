
-- Clean duplicate L3 categories under Furniture
-- Strategy: Keep one with the cleanest slug, delete duplicates

-- 1. Accent Chairs - keep accent-chairs under Living Room, delete chairs-accent
DELETE FROM categories WHERE id = '6765f3e8-b0be-45dc-95b9-089e07dce02a';

-- 2. Bar Stools - keep bar-stools under Dining Room, delete chairs-barstools
DELETE FROM categories WHERE id = '30fdc265-55d1-4d0a-a15f-26cc4ed155a3';

-- 3. Bookcases - keep bookcases under Living Room, delete furniture-bookcases
DELETE FROM categories WHERE id = 'bf66f815-648f-459d-8f0b-d35772057dad';

-- 4. Bunk Beds - keep bunk-beds under Kids Furniture, delete beds-bunk
DELETE FROM categories WHERE id = '49076715-2e89-4518-8518-baef09b48530';

-- 5. Coffee Tables - keep coffee-tables, delete duplicates
DELETE FROM categories WHERE id IN (
  'dd1fa389-618e-4f99-aeaa-c7db196b06a3', -- furniture-coffee-tables
  'ba706ecf-99d0-4de1-8a35-ed4a6d9136b5'  -- tables-coffee
);

-- 6. Dining Chairs - keep dining-chairs under Dining Room, delete chairs-dining
DELETE FROM categories WHERE id = '53404429-fbf8-42ba-943e-2fc142c1590f';

-- 7. Dining Tables - keep dining-tables under Dining Room, delete tables-dining
DELETE FROM categories WHERE id = '181ea044-4714-4e61-9b19-8a4d81d2515d';

-- 8. End Tables - keep end-tables, delete duplicates
DELETE FROM categories WHERE id IN (
  'd5a5d650-2b7d-492c-9160-5a1515455091', -- furniture-end-tables
  '32687f17-bd3b-43b8-9a3e-40c94a998e4f'  -- tables-end
);

-- 9. Entertainment Centers - keep entertainment-centers, delete furniture-entertainment-centers
DELETE FROM categories WHERE id = 'c8fcbdd2-078f-4819-b947-ca152ab38035';

-- 10. Headboards - keep headboards under Bedroom Furniture, delete beds-headboards
DELETE FROM categories WHERE id = 'eb5e3f9a-0f53-46d3-8f3c-5ba5b9880213';

-- 11. Kids Beds - keep kids-beds under Kids Furniture, delete beds-kids
DELETE FROM categories WHERE id = '4f6af485-83c2-49e8-b473-cac321c3f6df';

-- 12. Loveseats - keep loveseats under Living Room, delete furniture-loveseats
DELETE FROM categories WHERE id = '4452bbc0-f04b-4d05-a36b-bf2397c7eeba';

-- 13. Recliners - keep recliners under Living Room, delete duplicates
DELETE FROM categories WHERE id IN (
  '0658c3c5-81aa-471b-814b-dad1f7b4bef5', -- furniture-recliners under Chairs
  'eebff9ec-7e57-4101-8172-fe1c6306e7cf'  -- sofas-recliners under Sofas & Couches
);
;
