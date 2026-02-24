
-- Fix smart-devices hierarchy: Consolidate L3-type items under proper L2 parents

-- 1. Move smartwatch brand items under 'smartwatches' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smartwatches')
WHERE slug IN (
  'apple-watch', 'galaxy-watch', 'garmin-watches', 'amazfit-watches'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'smart-devices');

-- 2. Move fitness tracker items under 'fitness-trackers' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'fitness-trackers')
WHERE slug IN ('fitbit', 'sleep-trackers')
AND parent_id = (SELECT id FROM categories WHERE slug = 'smart-devices');

-- 3. Move wearables items under 'wearables' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'wearables')
WHERE slug IN ('smart-glasses', 'smart-rings', 'bp-monitors', 'pulse-oximeters', 'smart-scales')
AND parent_id = (SELECT id FROM categories WHERE slug = 'smart-devices');

-- 4. Move robot vacuum brands under 'robot-vacuums' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'robot-vacuums')
WHERE slug IN ('roomba', 'roborock', 'ecovacs', 'dreame')
AND parent_id = (SELECT id FROM categories WHERE slug = 'smart-devices');

-- 5. Move smart speaker items under 'smart-speakers' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smart-speakers')
WHERE slug IN (
  'amazon-echo', 'apple-homepod', 'google-nest', 
  'elec-smart-speakers', 'smart-speakers-displays',
  'smart-displays', 'elec-smart-displays'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'smart-devices');

-- 6. Move smart lighting items under 'smart-lighting' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smart-lighting')
WHERE slug IN ('smart-bulbs', 'smart-light-strips', 'smart-lights')
AND parent_id = (SELECT id FROM categories WHERE slug = 'smart-devices');

-- 7. Move smart security items under 'smart-security' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smart-security')
WHERE slug IN (
  'smart-cameras', 'indoor-security-cameras', 'outdoor-security-cameras',
  'smart-doorbells', 'video-doorbells-new', 'motion-sensors-new'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'smart-devices');

-- 8. Move smart locks under 'smart-locks' L2 (consolidate)
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smart-locks')
WHERE slug = 'smart-locks-new'
AND parent_id = (SELECT id FROM categories WHERE slug = 'smart-devices');

-- 9. Move smart home general items under 'smart-thermostats' or create 'smart-home-general'
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'smart-thermostats')
WHERE slug IN ('smart-plugs', 'smart-plugs-new', 'smart-thermometers')
AND parent_id = (SELECT id FROM categories WHERE slug = 'smart-devices');

-- Keep as L2: smart-home-devices (general category)
;
