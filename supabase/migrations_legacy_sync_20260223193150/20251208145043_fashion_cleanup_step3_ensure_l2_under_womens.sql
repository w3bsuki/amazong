
-- Step 3: Ensure Women's has proper L2 categories

-- Add Bags under Women's if missing
INSERT INTO categories (name, name_bg, slug, parent_id, display_order, icon)
SELECT 'Bags', 'Чанти', 'women-bags', id, 5, '👜'
FROM categories WHERE slug = 'fashion-womens'
ON CONFLICT (slug) DO NOTHING;

-- Add Watches under Women's if missing  
INSERT INTO categories (name, name_bg, slug, parent_id, display_order, icon)
SELECT 'Watches', 'Часовници', 'women-watches', id, 6, '⌚'
FROM categories WHERE slug = 'fashion-womens'
ON CONFLICT (slug) DO NOTHING;

-- Ensure existing L2s have correct parent
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'fashion-womens')
WHERE slug IN ('women-clothing', 'women-shoes', 'women-accessories', 'women-jewelry')
AND parent_id IS NULL;
;
