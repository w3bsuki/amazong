
-- =====================================================
-- 🔄 SWAP: Books ↔ Wholesale display order
-- Books becomes position 14 (visible in subheader)
-- Wholesale becomes position 22 (hidden in "More")
-- =====================================================

-- Temporarily set Books to 999 to avoid constraint conflicts
UPDATE categories SET display_order = 999 WHERE slug = 'books';

-- Move Wholesale from 14 to 22
UPDATE categories SET display_order = 22 WHERE slug = 'wholesale';

-- Move Books from 999 to 14
UPDATE categories SET display_order = 14 WHERE slug = 'books';

-- Verify the swap
SELECT name, name_bg, slug, display_order 
FROM categories 
WHERE slug IN ('books', 'wholesale')
ORDER BY display_order;
;
