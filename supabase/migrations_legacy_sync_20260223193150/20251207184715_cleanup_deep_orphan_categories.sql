
-- Delete L4 orphan categories first (deepest level)
WITH RECURSIVE category_depth AS (
  SELECT id, parent_id, 0 as depth
  FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.parent_id, cd.depth + 1
  FROM categories c
  JOIN category_depth cd ON c.parent_id = cd.id
)
DELETE FROM categories
WHERE id IN (
  SELECT cd.id 
  FROM category_depth cd
  WHERE cd.depth >= 4
    AND cd.id NOT IN (SELECT DISTINCT parent_id FROM categories WHERE parent_id IS NOT NULL)
    AND cd.id NOT IN (SELECT DISTINCT category_id FROM products WHERE category_id IS NOT NULL)
);

-- Delete L3 orphan categories  
WITH RECURSIVE category_depth AS (
  SELECT id, parent_id, 0 as depth
  FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.parent_id, cd.depth + 1
  FROM categories c
  JOIN category_depth cd ON c.parent_id = cd.id
)
DELETE FROM categories
WHERE id IN (
  SELECT cd.id 
  FROM category_depth cd
  WHERE cd.depth = 3
    AND cd.id NOT IN (SELECT DISTINCT parent_id FROM categories WHERE parent_id IS NOT NULL)
    AND cd.id NOT IN (SELECT DISTINCT category_id FROM products WHERE category_id IS NOT NULL)
);

-- Delete unused category_attributes that don't have any product using them
-- AND their category has no products
DELETE FROM category_attributes
WHERE id NOT IN (SELECT DISTINCT attribute_id FROM product_attributes WHERE attribute_id IS NOT NULL)
  AND (
    category_id IS NULL 
    OR category_id NOT IN (
      SELECT DISTINCT category_id FROM products WHERE category_id IS NOT NULL
    )
  );
;
