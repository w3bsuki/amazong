
-- Step 5: Ensure Unisex has proper L2 categories

-- Add Bags under Unisex if missing
INSERT INTO categories (name, name_bg, slug, parent_id, display_order, icon)
SELECT 'Bags', 'Чанти', 'unisex-bags', id, 5, '🎒'
FROM categories WHERE slug = 'fashion-unisex'
ON CONFLICT (slug) DO NOTHING;

-- Add Watches under Unisex if missing  
INSERT INTO categories (name, name_bg, slug, parent_id, display_order, icon)
SELECT 'Watches', 'Часовници', 'unisex-watches', id, 6, '⌚'
FROM categories WHERE slug = 'fashion-unisex'
ON CONFLICT (slug) DO NOTHING;

-- Ensure existing L2s have correct parent
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'fashion-unisex')
WHERE slug IN ('uni-clothing', 'uni-shoes', 'uni-accessories')
AND parent_id IS NULL;
;
