-- Fix orphaned swimming L3 categories - assign to proper L2 parent
-- Parent: swimming (id: 9b290948-a248-4251-a8ae-38de9b38af53)

UPDATE categories
SET parent_id = '9b290948-a248-4251-a8ae-38de9b38af53',
    display_order = 100
WHERE slug IN (
  'swim-bags',
  'swim-bikinis', 
  'swim-briefs',
  'swim-competition',
  'swim-coverups',
  'swim-ear',
  'swim-jammers',
  'swim-kickboards',
  'swim-kids',
  'swim-nose',
  'swim-pullbuoy',
  'swim-rashguards',
  'swim-snorkels',
  'swim-towels'
)
AND parent_id IS NULL;;
