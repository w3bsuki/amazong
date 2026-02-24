
-- Remove redundant L3 categories that duplicate their L2 parent name
-- These add no value - users should browse directly at L2

DELETE FROM categories WHERE id IN (
  'a69f2021-020a-4696-b0f4-8219aaa1b390', -- Artificial Plants under Artificial Plants
  'beab684d-f3cb-41bf-b61f-36a29967a34f', -- Bakeware under Bakeware
  '0b660b9d-a74f-4cd5-aef5-1b497abc6208', -- Bedroom Furniture under Bedroom Furniture
  'e9e5f607-a88c-441c-adc0-7d5885da52c5', -- Beds & Mattresses under Beds & Mattresses
  'da4f44e6-b1e9-4439-ba0d-d8a49d05c261', -- Candles & Holders under Candles
  'e3480248-c442-4922-89c0-0e41b20553bd', -- Chairs & Recliners under Chairs
  '7116daf6-bad8-4214-8c44-753f1c0047bd', -- Clocks under Clocks
  '7753966f-edbf-4f7d-a7c8-083fec4a4605', -- Cookware & Bakeware under Cookware
  '0564e870-5fe6-4bd5-b8ce-919f29a1638d', -- Curtains under Curtains
  '6af781ee-92da-4787-be32-a3e9c2c6017c', -- Cutlery under Cutlery
  '85a978d9-12ef-43ba-95dd-dfa756c6ad15', -- Dining Room Furniture under Dining Room
  '26106a7d-6827-4e52-b210-8a3f0767c419', -- Dinnerware under Dinnerware
  '4dffbde3-685d-437f-9207-41ea1883c5e3', -- Food Storage under Food Storage
  'd3246f61-279a-4e1d-9e0a-7fb24ac3dddd', -- Glassware under Glassware
  '6194303c-b7f8-4172-b7bf-6369701efde0', -- Kids Furniture under Kids Furniture
  '9bf58e07-d5e0-4d63-8683-946374f1e82e', -- Living Room Furniture under Living Room Furniture
  '39d109b8-4541-424d-b51f-b0f3bfe08df7', -- Mattresses under Mattresses
  '8b8ad418-f054-4a28-ac51-6b29aff4a853', -- Mirrors under Mirrors
  'cf1909d5-1e16-4401-b965-c4250a5f8e7c', -- Picture Frames under Picture Frames
  '48d9ad74-1a39-4763-9bbc-a8264f930706', -- Sofas & Couches under Sofas & Couches
  '6851ab28-e107-49e6-ac8f-450e09db4f21', -- Tables under Tables
  'fd921a6f-b172-46fa-8e70-747f89067410', -- Vases & Bowls under Vases
  '49932da9-e8a6-4cc8-81db-66f2d9faafc0'  -- Wall Art under Wall Art
);

-- Also remove Cookware Sets (generic) - keep individual types
DELETE FROM categories WHERE id = 'fb7891c4-f67f-443d-8d8a-0e1fd85368d6';
DELETE FROM categories WHERE id = '056f73b3-22a7-4f0b-a367-256a36c68691'; -- Dinnerware Sets
;
