-- Fix orphaned running L3 categories
-- Parent: running (id: 0f7da028-a4c3-4f98-8e8f-9d17d9147435)

UPDATE categories
SET parent_id = '0f7da028-a4c3-4f98-8e8f-9d17d9147435', display_order = 100
WHERE slug IN (
  'run-belts', 'run-headlamps', 'run-hydration', 'run-jackets',
  'run-shoes', 'run-shorts', 'run-socks', 'run-tights',
  'run-tops', 'run-vests'
)
AND parent_id IS NULL;;
