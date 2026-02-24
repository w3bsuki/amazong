
-- Fix orphaned entertainment autograph categories - assign to 'celebrity-autographs'
UPDATE categories SET parent_id = '72e7d234-6ce8-4eec-9b25-555d06913017'
WHERE slug IN ('ent-auto-actors', 'ent-auto-authors', 'ent-auto-directors', 'ent-auto-historical', 'ent-auto-musicians', 'ent-auto-politicians')
AND parent_id IS NULL;

-- Fix orphaned music memorabilia - assign to 'ent-mem-music'
UPDATE categories SET parent_id = 'aa5ffe86-79d5-4207-85a3-20391b4e6c14'
WHERE slug IN ('ent-music-auto', 'ent-music-gold', 'ent-music-instruments', 'ent-music-passes', 'ent-music-posters', 'ent-music-setlists', 'ent-music-tour')
AND parent_id IS NULL;

-- Fix orphaned movie posters - assign to 'posters-collectible'
UPDATE categories SET parent_id = '32fa4b85-063d-4d57-a06a-fe256261b45d'
WHERE slug IN ('ent-posters-2050', 'ent-posters-6070', 'ent-posters-8090', 'ent-posters-advertising', 'ent-posters-concert', 'ent-posters-theater')
AND parent_id IS NULL;

-- Fix orphaned movie props - assign to 'mem-movie-props'
UPDATE categories SET parent_id = '2e5db571-2c6a-4ccb-a9ce-e1271b493f00'
WHERE slug IN ('ent-props-costumes', 'ent-props-replica', 'ent-props-screen', 'ent-props-sets', 'ent-props-vehicles', 'ent-props-weapons')
AND parent_id IS NULL;

-- Fix orphaned TV memorabilia - assign to 'ent-mem-tv'
UPDATE categories SET parent_id = 'c4f5d242-0553-49ad-8769-3c06e4440bae'
WHERE slug IN ('ent-tv-awards', 'ent-tv-callsheets', 'ent-tv-costumes', 'ent-tv-photos', 'ent-tv-promo', 'ent-tv-props', 'ent-tv-scripts')
AND parent_id IS NULL;
;
