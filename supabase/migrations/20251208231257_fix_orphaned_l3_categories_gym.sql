-- Fix orphaned gym/strength equipment L3 categories
-- Parent: strength-equipment (id: 0f694e85-d613-400b-a1f5-f017114bc03e)

UPDATE categories
SET parent_id = '0f694e85-d613-400b-a1f5-f017114bc03e', display_order = 100
WHERE slug IN (
  'gym-abs', 'gym-barbells', 'gym-benches', 'gym-cables',
  'gym-dumbbells', 'gym-kettlebells', 'gym-legs', 
  'gym-plates', 'gym-racks', 'gym-smith'
)
AND parent_id IS NULL;;
