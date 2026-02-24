-- Move ALL children of skincare-serums directly under serums
UPDATE categories 
SET parent_id = '4cc76fa4-a450-44de-ac13-c56eab12d164'
WHERE parent_id = (SELECT id FROM categories WHERE slug = 'skincare-serums');

-- Now delete skincare-serums (the redundant middle layer)
DELETE FROM categories WHERE slug = 'skincare-serums';

-- Also delete face-serums since it's redundant (serums already means face serums)
DELETE FROM categories WHERE slug = 'face-serums';;
