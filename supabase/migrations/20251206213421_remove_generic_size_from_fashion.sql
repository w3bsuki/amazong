
-- Remove the generic "Size" attribute from Fashion category
-- This attribute causes duplicates when combined with more specific 
-- size attributes (Clothing Size, Shoe Size, etc.) in subcategories

-- First, let's check what other size-related attributes exist at the Fashion level
-- These are the ones we're removing:
-- Size (id: 70157792-079e-4006-95ca-f8eb7a91946f) at Fashion level

DELETE FROM category_attributes 
WHERE id = '70157792-079e-4006-95ca-f8eb7a91946f';

-- Verification comment:
-- The Fashion category children will still have appropriate size attributes:
-- - Clothing subcategories have "Clothing Size"
-- - Shoes subcategories have "Shoe Size EU"
-- - Kids subcategories have "Kids Size"
-- - Accessories have specific size attributes
;
