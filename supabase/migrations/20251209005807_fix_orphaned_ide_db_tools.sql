
-- Fix orphaned IDE tools - assign to 'ides' parent
UPDATE categories SET parent_id = '45ac0552-f979-4d17-92a1-4f432c410dc7'
WHERE slug IN ('ide-android', 'ide-vscode', 'ide-jetbrains', 'ide-eclipse', 'ide-xcode', 'ide-vstudio')
AND parent_id IS NULL;

-- Fix orphaned DB tools - assign to 'database-tools' parent  
UPDATE categories SET parent_id = '9bba3603-b3e5-46cd-ac94-bead07e6ff74'
WHERE slug IN ('db-nosql', 'db-performance', 'db-backup', 'db-migration', 'db-design', 'db-sql-clients')
AND parent_id IS NULL;
;
