
-- ============================================
-- AUTO-SET GENDER ATTRIBUTE FROM CATEGORY
-- ============================================
-- When a product is inserted or updated with a category_id in Fashion,
-- automatically set the gender attribute based on the L1 category.

CREATE OR REPLACE FUNCTION auto_set_fashion_gender()
RETURNS TRIGGER AS $$
DECLARE
    category_path_slugs text[];
    gender_value text;
BEGIN
    -- Only process if category_id is set
    IF NEW.category_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Get the category hierarchy path (slugs) using recursive CTE
    WITH RECURSIVE category_path AS (
        SELECT id, slug, parent_id, 1 as level
        FROM categories
        WHERE id = NEW.category_id
        
        UNION ALL
        
        SELECT c.id, c.slug, c.parent_id, cp.level + 1
        FROM categories c
        JOIN category_path cp ON c.id = cp.parent_id
    )
    SELECT array_agg(slug ORDER BY level DESC) INTO category_path_slugs
    FROM category_path;
    
    -- Check if this is a Fashion category (has 'fashion' in path)
    IF 'fashion' = ANY(category_path_slugs) THEN
        -- Determine gender from L1 category
        IF 'fashion-mens' = ANY(category_path_slugs) THEN
            gender_value := 'Men';
        ELSIF 'fashion-womens' = ANY(category_path_slugs) THEN
            gender_value := 'Women';
        ELSIF 'fashion-kids' = ANY(category_path_slugs) THEN
            gender_value := 'Kids';
        ELSIF 'fashion-unisex' = ANY(category_path_slugs) THEN
            gender_value := 'Unisex';
        ELSE
            -- Direct fashion category or hidden categories - don't set gender
            RETURN NEW;
        END IF;
        
        -- Set the gender attribute in JSONB (merge with existing attributes)
        IF NEW.attributes IS NULL THEN
            NEW.attributes := jsonb_build_object('gender', gender_value);
        ELSE
            NEW.attributes := NEW.attributes || jsonb_build_object('gender', gender_value);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS auto_set_fashion_gender_trigger ON products;

-- Create trigger for INSERT and UPDATE
CREATE TRIGGER auto_set_fashion_gender_trigger
    BEFORE INSERT OR UPDATE OF category_id ON products
    FOR EACH ROW
    EXECUTE FUNCTION auto_set_fashion_gender();

-- Also update existing products that are in fashion categories but missing gender
-- (This handles any products that were created before the trigger)
UPDATE products p
SET attributes = COALESCE(attributes, '{}'::jsonb) || '{"gender": "Men"}'::jsonb
WHERE category_id IN (
    WITH RECURSIVE mens_tree AS (
        SELECT id FROM categories WHERE slug = 'fashion-mens'
        UNION ALL
        SELECT c.id FROM categories c JOIN mens_tree mt ON c.parent_id = mt.id
    )
    SELECT id FROM mens_tree
)
AND (attributes IS NULL OR NOT attributes ? 'gender');

UPDATE products p
SET attributes = COALESCE(attributes, '{}'::jsonb) || '{"gender": "Women"}'::jsonb
WHERE category_id IN (
    WITH RECURSIVE womens_tree AS (
        SELECT id FROM categories WHERE slug = 'fashion-womens'
        UNION ALL
        SELECT c.id FROM categories c JOIN womens_tree wt ON c.parent_id = wt.id
    )
    SELECT id FROM womens_tree
)
AND (attributes IS NULL OR NOT attributes ? 'gender');

UPDATE products p
SET attributes = COALESCE(attributes, '{}'::jsonb) || '{"gender": "Kids"}'::jsonb
WHERE category_id IN (
    WITH RECURSIVE kids_tree AS (
        SELECT id FROM categories WHERE slug = 'fashion-kids'
        UNION ALL
        SELECT c.id FROM categories c JOIN kids_tree kt ON c.parent_id = kt.id
    )
    SELECT id FROM kids_tree
)
AND (attributes IS NULL OR NOT attributes ? 'gender');

UPDATE products p
SET attributes = COALESCE(attributes, '{}'::jsonb) || '{"gender": "Unisex"}'::jsonb
WHERE category_id IN (
    WITH RECURSIVE unisex_tree AS (
        SELECT id FROM categories WHERE slug = 'fashion-unisex'
        UNION ALL
        SELECT c.id FROM categories c JOIN unisex_tree ut ON c.parent_id = ut.id
    )
    SELECT id FROM unisex_tree
)
AND (attributes IS NULL OR NOT attributes ? 'gender');
;
