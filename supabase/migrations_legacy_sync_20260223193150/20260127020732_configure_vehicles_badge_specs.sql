-- ============================================================================
-- MIGRATION: Configure badge specs for Vehicles subcategory
-- ============================================================================
-- For cars/vehicles, mileage and year are MORE important than "condition"
-- because almost all cars are "used" - the mileage tells the real story
-- ============================================================================

-- VEHICLES: Mileage (primary) + Year (secondary)
-- NO condition badge - it's redundant for vehicles
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id = '7acf2e95-428a-40fd-a841-d4933b666f02' -- Vehicles
  AND attribute_key = 'mileage';

UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 2
WHERE category_id = '7acf2e95-428a-40fd-a841-d4933b666f02' -- Vehicles
  AND attribute_key = 'year';

-- Electric Vehicles: Range + Mileage
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id IN (SELECT id FROM categories WHERE slug = 'electric-vehicles')
  AND attribute_key = 'range';

UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 2
WHERE category_id IN (SELECT id FROM categories WHERE slug = 'electric-vehicles')
  AND attribute_key = 'mileage';

-- E-Bikes: Range + Motor Power
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id IN (SELECT id FROM categories WHERE slug = 'e-bikes-cat')
  AND attribute_key = 'range';

UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 2
WHERE category_id IN (SELECT id FROM categories WHERE slug = 'e-bikes-cat')
  AND attribute_key = 'motor_power';

-- E-Scooters: Max Speed + Range
UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 1
WHERE category_id IN (SELECT id FROM categories WHERE slug = 'e-scooters')
  AND attribute_key = 'max_speed';

UPDATE category_attributes 
SET is_badge_spec = true, badge_priority = 2
WHERE category_id IN (SELECT id FROM categories WHERE slug = 'e-scooters')
  AND attribute_key = 'range';;
