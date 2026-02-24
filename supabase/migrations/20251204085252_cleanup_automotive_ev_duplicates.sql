
-- Remove duplicate e-mobility items from Automotive since they now have their proper home in E-Mobility
-- Keep Electric Vehicles (actual electric cars) in Automotive since those are cars

-- Mark the old E-Scooters, E-Bikes, EV Chargers, EV Parts as deprecated
-- These were placeholders and are now properly categorized under E-Mobility

UPDATE categories
SET 
  name = '[MOVED] ' || name,
  display_order = 9990
WHERE slug IN ('e-scooters', 'e-bikes-cat', 'ev-chargers', 'ev-parts')
  AND parent_id = (SELECT id FROM categories WHERE slug = 'automotive');

-- Update description to note the move
UPDATE categories
SET description = 'MOVED: This category has been moved to E-Mobility main category. Please use the new E-Mobility section.',
    description_bg = 'ПРЕМЕСТЕНО: Тази категория е преместена в основната категория Електромобилност. Моля, използвайте новата секция Електромобилност.'
WHERE slug IN ('e-scooters', 'e-bikes-cat', 'ev-chargers', 'ev-parts')
  AND parent_id = (SELECT id FROM categories WHERE slug = 'automotive');
;
