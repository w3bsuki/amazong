
-- Remove 100% duplicate category attributes (same category_id, same name_bg, same attribute_type)
-- These duplicates cause fields to appear twice in the sell form
-- Only deleting attributes with 0 usage in product_attributes

-- Delete the duplicate attributes (keeping the one with better name casing or lower sort_order)
DELETE FROM category_attributes 
WHERE id IN (
  -- Bulgarian Traditional - authenticity duplicate (lowercase version)
  'eb1ffe59-361e-46a2-aec9-0b34c64145f4',
  -- Bulgarian Traditional - region duplicate (lowercase version)
  'ee2475b8-29db-474f-bd45-1117c112e47b',
  -- Antiques - Provenance duplicate (keeping Origin)
  'd0da83d0-29f1-483c-b5fd-6c1f5d9e49b8',
  -- Books - Condition duplicate (keeping Book Condition which is more specific)
  'c1fcca99-1e7d-4336-9489-0117526a8338',
  -- Cars - Drive duplicate (keeping Drive Type which has better options)
  '03d57e0c-97fa-4ef0-a658-0b6c68f1164c',
  -- Coins & Currency - Metal duplicate (keeping Coin Metal which is more specific)
  'b605af73-684b-4abd-a812-ef1a07546b10',
  -- Coins & Currency - Country duplicate (keeping Country with better name)
  '91cb2a6a-19c4-4a7f-b916-0aa36eda8296',
  -- Coins & Currency - Year duplicate (keeping Coin Year which is more specific)
  'bf600b85-d1d1-408f-8a8c-993ac488f0cf',
  -- Fragrance - Scent Family duplicate (keeping Fragrance Family)
  'e11c280d-9f70-4b8a-9702-59fbd007cd38',
  -- Furniture - Material duplicate (keeping Furniture Material)
  'd1947719-00e8-4619-95b9-03aecbcd1b8f',
  -- Home Improvement - Coverage duplicate (keeping Finish)
  'c56124c1-67fe-434c-bd59-2874a548a9a1',
  -- Jobs - Experience Level duplicate (keeping experience_level which is required)
  '65339564-2080-4d82-9a26-9ab63f087118',
  -- Kids Clothing - Kids Size duplicate (keeping Size which is required)
  '69d68ce5-cb71-413b-befa-fc8b3b6c67a7',
  -- Laptops - Display Resolution duplicate (keeping Screen Resolution)
  '7b87ad44-8848-4c21-ac56-1f38b20fa14e',
  -- Movies & Music - Item Condition duplicate (keeping Condition which is required)
  '7cd1d628-dfb9-4954-8250-bb5ecd87e8a8',
  -- Stamps - Stamp Condition duplicate (keeping Condition)
  'ca58f559-d5e4-42e9-ac9a-b9c79d2af7c9',
  -- Tablets - Storage Capacity duplicate (keeping Storage which has lower sort_order)
  '96108778-ca0e-4a45-8a74-92f70132c808',
  -- Toys & Games - Age Range duplicate (keeping Age Group which is required)
  'f1b47532-c7f2-48fd-9cf5-13f9720d9b98',
  -- Wholesale Electronics - Condition duplicate (keeping Condition Mix which is required)
  '4b6673db-f031-419b-a695-3a16c36a891e'
);
;
