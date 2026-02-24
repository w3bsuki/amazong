-- Fix orphaned cardio L3 categories
-- Treadmills parent: cardio-treadmills (id: fdc30981-c88a-44f3-a626-9cec01ce9313)
-- Ellipticals parent: cardio-ellipticals (id: a0200635-83e3-403d-89a3-63e0197ee975)
-- Rowing parent: cardio-rowing (id: c005ccec-2b92-4399-a4da-4e8f62ac457a)

-- Treadmills
UPDATE categories
SET parent_id = 'fdc30981-c88a-44f3-a626-9cec01ce9313', display_order = 100
WHERE slug IN ('tread-commercial', 'tread-desk', 'tread-folding', 'tread-manual', 'tread-walking')
AND parent_id IS NULL;

-- Ellipticals
UPDATE categories
SET parent_id = 'a0200635-83e3-403d-89a3-63e0197ee975', display_order = 100
WHERE slug IN ('ellip-center', 'ellip-compact', 'ellip-front', 'ellip-rear')
AND parent_id IS NULL;

-- Rowing machines
UPDATE categories
SET parent_id = 'c005ccec-2b92-4399-a4da-4e8f62ac457a', display_order = 100
WHERE slug IN ('row-air', 'row-hydraulic', 'row-magnetic', 'row-smart', 'row-water')
AND parent_id IS NULL;;
