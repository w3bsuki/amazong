
-- Step 4: Ensure Kids has proper L2 categories

-- Add Bags under Kids if missing
INSERT INTO categories (name, name_bg, slug, parent_id, display_order, icon)
SELECT 'Bags', 'Чанти', 'kids-bags', id, 5, '🎒'
FROM categories WHERE slug = 'fashion-kids'
ON CONFLICT (slug) DO NOTHING;

-- Add Watches under Kids if missing  
INSERT INTO categories (name, name_bg, slug, parent_id, display_order, icon)
SELECT 'Watches', 'Часовници', 'kids-watches', id, 6, '⌚'
FROM categories WHERE slug = 'fashion-kids'
ON CONFLICT (slug) DO NOTHING;

-- Ensure existing L2s have correct parent
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'fashion-kids')
WHERE slug IN ('child-clothing', 'child-shoes', 'child-accessories')
AND parent_id IS NULL;
;
