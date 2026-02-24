
-- STEP 1: Migrate products from deprecated categories to proper ones

-- Move products from [DEPRECATED] Computers to Electronics
UPDATE products 
SET category_id = '8fb2b390-6dc4-42b3-b386-7d5357ece5bc'
WHERE category_id = '12fa95c3-1b3f-4bf5-bbe5-36bd69d8bc77';

-- Move products from [DEPRECATED] Toys to Kids  
UPDATE products 
SET category_id = 'a6583270-7d99-4414-b522-c5cbee4d1f04'
WHERE category_id = '5de3e3bc-a538-4f9a-b6f5-b6d076220061';

-- Move products from [DEPRECATED] Smart Home to Electronics
UPDATE products 
SET category_id = '8fb2b390-6dc4-42b3-b386-7d5357ece5bc'
WHERE category_id = '7c967ea1-1639-4ec4-afb7-c75b8b7313b3';

-- Move products from [DEPRECATED] Office to Home & Kitchen
UPDATE products 
SET category_id = 'e1a9ee96-632b-4939-babe-6923034fde2e'
WHERE category_id = '3cb4f8af-dc3e-4e30-8c4f-299a067cff36';

-- Move products from [DEPRECATED] Engagement & Wedding to Jewelry & Watches
UPDATE products 
SET category_id = 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf'
WHERE category_id = '99bb0e3c-a127-4d11-97e6-254a62f5c8da';

-- STEP 2: Un-deprecate valid subcategories (iPhone, Samsung models) - they were incorrectly marked
-- Move them back to active by reducing display_order
UPDATE categories 
SET display_order = 10
WHERE id = '5151e58c-5c54-4e03-adb0-414f29195a6c'; -- iPhone

UPDATE categories 
SET display_order = 11
WHERE id = 'ded04255-f46e-4590-8a5a-bb8d6fd8fc48'; -- Samsung

-- STEP 3: Delete children of deprecated categories first (cascading)
-- Delete children of truly deprecated root categories
DELETE FROM categories 
WHERE parent_id IN (
  SELECT id FROM categories 
  WHERE display_order >= 9000 
    AND name LIKE '[DEPRECATED]%' 
    AND parent_id IS NULL
);

-- STEP 4: Delete truly deprecated root-level categories  
DELETE FROM categories 
WHERE display_order >= 9000 
  AND name LIKE '[DEPRECATED]%' 
  AND parent_id IS NULL
  AND id NOT IN (SELECT DISTINCT category_id FROM products WHERE category_id IS NOT NULL);

-- STEP 5: For [MOVED] categories, reparent their children to appropriate parents
-- First, find the Electromobility category for EV stuff
-- Then delete the [MOVED] parent once children are moved
;
