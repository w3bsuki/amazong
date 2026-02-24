
-- Step 1: Hide the orphan L1 categories by setting display_order to 9999
-- These categories will remain for data integrity but won't show in navigation
-- Categories to hide: Bags & Luggage, Accessories, Watches, Plus Size Women/Men, Vintage Clothing

UPDATE categories 
SET display_order = 9999, 
    name = '[HIDDEN] ' || name
WHERE slug IN (
  'bags-luggage',
  'fashion-accessories-main', 
  'fashion-watches-main',
  'fashion-plus-size-women',
  'fashion-plus-size-men',
  'fashion-vintage-clothing'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'fashion');
;
