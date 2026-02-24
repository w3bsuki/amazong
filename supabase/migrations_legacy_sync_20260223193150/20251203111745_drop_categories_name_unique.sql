
-- Drop the unique constraint on name
-- Categories can have same name in different parent contexts
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_key;

-- Add a unique constraint on (slug) only - slug should be globally unique
-- name uniqueness should be within same parent
-- This is already enforced by categories_slug_key
;
