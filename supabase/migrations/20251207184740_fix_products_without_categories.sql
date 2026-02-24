
-- Assign categories to orphan products based on their titles

-- Food products -> Grocery & Food
UPDATE products 
SET category_id = '0325b1a5-4e95-40d8-9eb9-6220f20710b5'
WHERE category_id IS NULL 
  AND (title ILIKE '%coffee%' OR title ILIKE '%olive oil%' OR title ILIKE '%ramen%');

-- Gaming products -> Gaming
UPDATE products 
SET category_id = '54c304d0-4eba-4075-9ef3-8cbcf426d9b0'
WHERE category_id IS NULL 
  AND (title ILIKE '%gaming%' OR title ILIKE '%console%' OR title ILIKE '%game%');

-- Camera -> Electronics
UPDATE products 
SET category_id = '8fb2b390-6dc4-42b3-b386-7d5357ece5bc'
WHERE category_id IS NULL 
  AND (title ILIKE '%camera%');
;
