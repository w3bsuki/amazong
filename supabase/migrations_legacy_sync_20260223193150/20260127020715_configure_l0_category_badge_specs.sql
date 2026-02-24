-- ============================================================================
-- MIGRATION: Configure badge specs for L0 categories
-- ============================================================================
-- 
-- Category-aware badge strategy:
-- - Fashion: condition (important for C2C), brand
-- - Electronics: condition, storage_capacity  
-- - Automotive: NO condition (cars are used), use from subcategory
-- - Gaming: platform, condition
-- - Real Estate: NO condition (not applicable)
-- - Sports: brand, condition
-- - Beauty: brand (condition less relevant for cosmetics)
-- - Home: brand, material
-- - Jewelry & Watches: brand, material
-- - Books: condition (important for collectors)
-- - Collectibles: condition (critical for value)
-- ============================================================================

-- FASHION: Condition + Brand (C2C clothing needs condition visibility)
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0' -- Fashion
  AND attribute_key = 'condition';

UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 2
WHERE category_id = '9a04f634-c3e5-4b02-9448-7b99584d82e0' -- Fashion
  AND attribute_key = 'brand';

-- ELECTRONICS: Condition + Storage (phones/laptops need both)
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id = '8fb2b390-6dc4-42b3-b386-7d5357ece5bc' -- Electronics
  AND attribute_key = 'condition';

UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 2
WHERE category_id = '8fb2b390-6dc4-42b3-b386-7d5357ece5bc' -- Electronics
  AND attribute_key = 'storage_capacity';

-- AUTOMOTIVE (L0): NO badge specs at L0 level
-- Cars/Vehicles will inherit from subcategory or use dedicated attributes
-- Explicitly set condition to NOT be a badge spec
UPDATE category_attributes 
SET is_badge_spec = false, badge_priority = NULL
WHERE category_id = 'ae1c527f-1293-4032-a108-ec2a0252f2e0' -- Automotive
  AND attribute_key = 'condition';

-- GAMING: Platform + Condition
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id = '54c304d0-4eba-4075-9ef3-8cbcf426d9b0' -- Gaming
  AND attribute_key = 'platform';

UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 2
WHERE category_id = '54c304d0-4eba-4075-9ef3-8cbcf426d9b0' -- Gaming
  AND attribute_key = 'condition';

-- HOME & KITCHEN: Brand + Material
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id = 'e1a9ee96-632b-4939-babe-6923034fde2e' -- Home
  AND attribute_key = 'brand';

UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 2
WHERE category_id = 'e1a9ee96-632b-4939-babe-6923034fde2e' -- Home
  AND attribute_key = 'material';

-- BEAUTY: Brand only (condition not relevant for cosmetics)
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id = '69a1114f-6e23-4f73-8883-0ef5eebdb916' -- Beauty
  AND attribute_key = 'brand';

-- SPORTS: Brand + Condition
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id = '7b423774-3be8-43de-989d-7a4253eda995' -- Sports
  AND attribute_key = 'brand';

UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 2
WHERE category_id = '7b423774-3be8-43de-989d-7a4253eda995' -- Sports
  AND attribute_key = 'condition';

-- JEWELRY & WATCHES: Brand + Material
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id = 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf' -- Jewelry
  AND attribute_key = 'brand';

UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 2
WHERE category_id = 'f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf' -- Jewelry
  AND attribute_key = 'material';

-- BOOKS: Condition (important for collectors/resale)
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac' -- Books
  AND attribute_key = 'condition';

-- COLLECTIBLES: Condition (critical for value)
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id = 'e30a518e-ad9e-45be-84d3-0cec45cc239c' -- Collectibles
  AND attribute_key = 'condition';;
