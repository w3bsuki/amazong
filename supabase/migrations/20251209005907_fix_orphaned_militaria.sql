
-- Fix orphaned militaria optics - assign to militaria parent
UPDATE categories SET parent_id = 'efc0c595-d08b-4a77-926e-9ec2e848c335'
WHERE slug = 'milit-equip-optics'
AND parent_id IS NULL;
;
