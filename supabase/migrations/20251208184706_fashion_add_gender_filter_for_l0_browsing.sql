
-- ============================================
-- ADD GENDER FILTER FOR L0 FASHION BROWSING
-- ============================================
-- Rationale: When a user browses /categories/fashion (L0), they need 
-- to filter by gender without clicking into subcategories.
-- This enables "shop for myself AND my husband" use case.

-- Add Gender attribute back to Fashion L0, but as OPTIONAL
-- (It will be auto-filled based on L1 category selection during listing)
INSERT INTO category_attributes (
    category_id, 
    name, 
    name_bg, 
    attribute_type, 
    is_required, 
    is_filterable, 
    options, 
    options_bg, 
    sort_order,
    placeholder,
    placeholder_bg
)
VALUES (
    '9a04f634-c3e5-4b02-9448-7b99584d82e0', -- Fashion L0
    'Gender',
    'Пол',
    'select',
    false,  -- NOT required - will be auto-populated from L1 category
    true,   -- IS filterable - main purpose
    '["Men", "Women", "Kids", "Unisex"]'::jsonb,
    '["Мъже", "Жени", "Деца", "Унисекс"]'::jsonb,
    0,  -- First filter (before Condition)
    'Auto-filled from category',
    'Автоматично от категорията'
);

-- Now update ALL existing Fashion products to have gender attribute
-- based on their category hierarchy

-- Update products in Men's categories
UPDATE products p
SET attributes = 
    CASE 
        WHEN p.attributes IS NULL THEN '{"gender": "Men"}'::jsonb
        ELSE p.attributes || '{"gender": "Men"}'::jsonb
    END
WHERE p.category_id IN (
    WITH RECURSIVE mens_tree AS (
        SELECT id FROM categories WHERE slug = 'fashion-mens'
        UNION ALL
        SELECT c.id FROM categories c JOIN mens_tree mt ON c.parent_id = mt.id
    )
    SELECT id FROM mens_tree
);

-- Update products in Women's categories
UPDATE products p
SET attributes = 
    CASE 
        WHEN p.attributes IS NULL THEN '{"gender": "Women"}'::jsonb
        ELSE p.attributes || '{"gender": "Women"}'::jsonb
    END
WHERE p.category_id IN (
    WITH RECURSIVE womens_tree AS (
        SELECT id FROM categories WHERE slug = 'fashion-womens'
        UNION ALL
        SELECT c.id FROM categories c JOIN womens_tree wt ON c.parent_id = wt.id
    )
    SELECT id FROM womens_tree
);

-- Update products in Kids categories
UPDATE products p
SET attributes = 
    CASE 
        WHEN p.attributes IS NULL THEN '{"gender": "Kids"}'::jsonb
        ELSE p.attributes || '{"gender": "Kids"}'::jsonb
    END
WHERE p.category_id IN (
    WITH RECURSIVE kids_tree AS (
        SELECT id FROM categories WHERE slug = 'fashion-kids'
        UNION ALL
        SELECT c.id FROM categories c JOIN kids_tree kt ON c.parent_id = kt.id
    )
    SELECT id FROM kids_tree
);

-- Update products in Unisex categories
UPDATE products p
SET attributes = 
    CASE 
        WHEN p.attributes IS NULL THEN '{"gender": "Unisex"}'::jsonb
        ELSE p.attributes || '{"gender": "Unisex"}'::jsonb
    END
WHERE p.category_id IN (
    WITH RECURSIVE unisex_tree AS (
        SELECT id FROM categories WHERE slug = 'fashion-unisex'
        UNION ALL
        SELECT c.id FROM categories c JOIN unisex_tree ut ON c.parent_id = ut.id
    )
    SELECT id FROM unisex_tree
);
;
