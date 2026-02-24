
-- Delete orphaned attributes (pointing to deleted categories)
DELETE FROM category_attributes ca
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.id = ca.category_id);
;
