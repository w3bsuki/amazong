
-- Fix electronics-accessories hierarchy: Consolidate L3-type items under proper L2 parents

-- 1. Move phone case items under 'phone-cases' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'phone-cases')
WHERE slug IN (
  'acc-phone-cases', 'phone-cases-new', 'iphone-cases', 'samsung-cases',
  'popsockets-grips', 'magsafe-accessories'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-accessories');

-- 2. Move charger/cable items under 'chargers-cables' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'chargers-cables')
WHERE slug IN (
  'acc-chargers', 'phone-chargers', 'laptop-chargers-new', 'wireless-chargers',
  'lightning-cables', 'usb-c-cables', 'hdmi-cables-acc-new', 'displayport-cables-new'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-accessories');

-- 3. Move phone accessories under 'phone-accessories' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'phone-accessories')
WHERE slug IN (
  'phone-holders-mounts', 'car-phone-mounts', 'phone-parts', 'selfie-sticks'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-accessories');

-- 4. Move screen protector items under 'screen-protectors' L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'screen-protectors')
WHERE slug IN ('acc-screen-protectors', 'screen-protectors-new', 'privacy-screens-new')
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-accessories');

-- 5. Create/use tablet-accessories as L2 for tablet items
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'tablet-accessories')
WHERE slug IN (
  'ipad-cases', 'samsung-tab-cases', 'tablet-keyboards-new', 
  'tablet-stands-new', 'stylus-pens-new'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-accessories');

-- 6. Create/use laptop-bags-sleeves as L2 for laptop accessory items
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'laptop-bags-sleeves')
WHERE slug IN (
  'acc-laptop-bags', 'laptop-stands-new', 'laptop-cooling-pads', 'docking-stations-new'
)
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-accessories');

-- 7. Move power bank items - create power-banks L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'acc-power-banks')
WHERE slug = 'power-banks-new'
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-accessories');

-- 8. Move adapter/hub items under acc-adapters L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'acc-adapters')
WHERE slug IN ('adapters-converters-new', 'usb-hubs-new')
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-accessories');

-- 9. Move mount items under acc-mounts L2
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'acc-mounts')
WHERE slug IN ('car-phone-mounts')
AND parent_id = (SELECT id FROM categories WHERE slug = 'electronics-accessories');

-- Keep as L2: acc-memory-cards
;
