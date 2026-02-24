-- Fix orphaned yoga L3 categories - assign to proper L2 parent
-- Parent: yoga-pilates (id: 72020741-6371-45df-8b0f-86836e007db0)

UPDATE categories
SET parent_id = '72020741-6371-45df-8b0f-86836e007db0',
    display_order = 100
WHERE slug IN (
  'yoga-blankets',
  'yoga-bolsters',
  'yoga-bowls',
  'yoga-bras',
  'yoga-cushions',
  'yoga-eye',
  'yoga-jackets',
  'yoga-leggings',
  'yoga-men',
  'yoga-pants',
  'yoga-shorts',
  'yoga-tops',
  'yoga-wheels'
)
AND parent_id IS NULL;;
