
-- Step 2: Ensure Men's has proper L2 categories (Clothing, Shoes, Accessories, Bags, Watches)
-- First check what exists, then add missing ones

-- Add Bags under Men's if missing
INSERT INTO categories (name, name_bg, slug, parent_id, display_order, icon)
SELECT 'Bags', 'Чанти', 'men-bags', id, 5, '👜'
FROM categories WHERE slug = 'fashion-mens'
ON CONFLICT (slug) DO NOTHING;

-- Add Watches under Men's if missing  
INSERT INTO categories (name, name_bg, slug, parent_id, display_order, icon)
SELECT 'Watches', 'Часовници', 'men-watches', id, 6, '⌚'
FROM categories WHERE slug = 'fashion-mens'
ON CONFLICT (slug) DO NOTHING;

-- Ensure existing L2s have correct parent
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'fashion-mens')
WHERE slug IN ('men-clothing', 'men-shoes', 'men-accessories', 'men-jewelry')
AND parent_id IS NULL;
;
