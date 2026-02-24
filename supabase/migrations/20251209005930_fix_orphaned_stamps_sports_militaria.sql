
-- Fix orphaned stamps - assign to 'stamps'
UPDATE categories SET parent_id = 'e022a505-10b2-4c4b-aa72-5f3e3bf0e578'
WHERE slug LIKE 'stamps-country-%' OR slug LIKE 'stamps-era-%' OR slug LIKE 'stamps-topic-%'
AND parent_id IS NULL;

-- Fix orphaned sports autographs/game-used/game-worn/programs - assign to 'sports-memorabilia'
UPDATE categories SET parent_id = '50eb08ae-84aa-4297-9c7f-538286ad5c72'
WHERE (slug LIKE 'sports-auto-%' OR slug LIKE 'sports-gu-%' OR slug LIKE 'sports-gw-%' OR slug LIKE 'sports-prog-%' OR slug LIKE 'sports-display-%')
AND parent_id IS NULL;

-- Fix orphaned military equipment - assign to militaria
UPDATE categories SET parent_id = 'efc0c595-d08b-4a77-926e-9ec2e848c335'
WHERE slug LIKE 'milit-equip-%'
AND parent_id IS NULL;
;
