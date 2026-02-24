
-- Step 7: Update Clothing Size to include Plus Size options
UPDATE category_attributes 
SET options = '["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "One Size"]'::jsonb,
    options_bg = '["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "Универсален"]'::jsonb
WHERE category_id = (SELECT id FROM categories WHERE slug = 'fashion')
  AND name = 'Clothing Size';

-- Update Gender to include all options
UPDATE category_attributes 
SET options = '["Men", "Women", "Boys", "Girls", "Unisex"]'::jsonb,
    options_bg = '["Мъже", "Жени", "Момчета", "Момичета", "Унисекс"]'::jsonb
WHERE category_id = (SELECT id FROM categories WHERE slug = 'fashion')
  AND name = 'Gender';
;
