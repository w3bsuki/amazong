-- Fix the duplicate serums structure
-- Move children of skincare-serums to be children of serums directly
UPDATE categories 
SET parent_id = '4cc76fa4-a450-44de-ac13-c56eab12d164'  -- serums id
WHERE parent_id = '79950347-bb11-4e58-8692-0fc77bd85532'; -- skincare-serums id

-- Delete the redundant skincare-serums category
DELETE FROM categories WHERE slug = 'skincare-serums';;
