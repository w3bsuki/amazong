
-- Fix security warning: Function search_path mutable
-- Add SET search_path to the function to prevent mutable search_path vulnerability

CREATE OR REPLACE FUNCTION public.auto_set_fashion_gender()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;
;
