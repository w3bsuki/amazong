
-- ============================================
-- MIGRATION: Consolidate Duplicate L0 Categories
-- ============================================
-- Problem: Cell Phones and Cameras & Photo exist as L0 categories
--          but Electronics already has Phones & Tablets and Cameras as L1
-- Solution: Move unique L2 children, then delete duplicate L0s

-- STEP 1: Move unique children from Cell Phones to Electronics → Phones & Tablets
-- (Only items that don't already exist there)

-- Move Chargers & Cables (doesn't exist under Phones & Tablets)
UPDATE categories 
SET parent_id = 'd8c1b2ca-3c07-48c4-95c4-9e122d82b902' -- Electronics → Phones & Tablets
WHERE id = '0c57071d-72b3-421d-a430-fa8fdf50f7cb' -- chargers-cables
AND NOT EXISTS (SELECT 1 FROM categories WHERE parent_id = 'd8c1b2ca-3c07-48c4-95c4-9e122d82b902' AND slug = 'chargers-cables');

-- Move Phone Cases
UPDATE categories 
SET parent_id = 'd8c1b2ca-3c07-48c4-95c4-9e122d82b902'
WHERE id = 'e1814f1f-8536-44e5-bd2a-bf11f7cf3da1' -- phone-cases
AND NOT EXISTS (SELECT 1 FROM categories WHERE parent_id = 'd8c1b2ca-3c07-48c4-95c4-9e122d82b902' AND slug = 'phone-cases');

-- Move Phone Parts
UPDATE categories 
SET parent_id = 'd8c1b2ca-3c07-48c4-95c4-9e122d82b902'
WHERE id = '55762748-5fc5-4e26-9cf6-a0e3e8811905' -- phone-parts
AND NOT EXISTS (SELECT 1 FROM categories WHERE parent_id = 'd8c1b2ca-3c07-48c4-95c4-9e122d82b902' AND slug = 'phone-parts');

-- Move Screen Protectors
UPDATE categories 
SET parent_id = 'd8c1b2ca-3c07-48c4-95c4-9e122d82b902'
WHERE id = 'f9ef86f8-76aa-4613-9013-6f7f5a271b68' -- screen-protectors
AND NOT EXISTS (SELECT 1 FROM categories WHERE parent_id = 'd8c1b2ca-3c07-48c4-95c4-9e122d82b902' AND slug = 'screen-protectors');

-- STEP 2: Move unique children from Cameras & Photo to Electronics → Cameras

-- Move Film Photography (unique)
UPDATE categories 
SET parent_id = 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd' -- Electronics → Cameras
WHERE id = '42114c4d-6c23-414d-84cb-82d734879c93' -- film-photography
AND NOT EXISTS (SELECT 1 FROM categories WHERE parent_id = 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd' AND slug = 'film-photography');

-- Move Studio Equipment (unique)
UPDATE categories 
SET parent_id = 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd'
WHERE id = '7da594f5-dfa7-4d3b-bbf5-d7a96e85246e' -- studio-equip
AND NOT EXISTS (SELECT 1 FROM categories WHERE parent_id = 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd' AND slug = 'studio-equip');

-- Move Video Cameras (unique)
UPDATE categories 
SET parent_id = 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd'
WHERE id = '21eeb008-1077-4524-8687-2aff7d63d3a5' -- video-cameras
AND NOT EXISTS (SELECT 1 FROM categories WHERE parent_id = 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd' AND slug = 'video-cameras');

-- Move Photo Accessories (might be same as camera-accessories but different name)
UPDATE categories 
SET parent_id = 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd'
WHERE id = 'e4de23c3-a73b-429d-8d89-a33f5a90f869' -- photo-accessories
AND NOT EXISTS (SELECT 1 FROM categories WHERE parent_id = 'a7c14d7c-a6d6-457a-9333-2fa6755ccccd' AND slug = 'photo-accessories');

-- STEP 3: Delete duplicate categories that have equivalents in Electronics
-- Delete duplicate Smartphones (cell-smartphones) - keep smartphones under Phones & Tablets
DELETE FROM categories WHERE id = 'c8dc5428-31f0-4baa-9525-17f395c4cb1b'; -- cell-smartphones

-- Delete duplicate Mobile Accessories - keep phone-accessories
DELETE FROM categories WHERE id = 'd164f617-425a-4868-99e0-23d0cdb7d92c'; -- mobile-accessories

-- Delete duplicate Camera Lenses, Digital Cameras, Drones from Cameras & Photo
DELETE FROM categories WHERE id = '6da7325c-1fc0-48ea-a907-265f8a0bd141'; -- camera-lenses (dup)
DELETE FROM categories WHERE id = '09fd0c82-0dd5-4551-af6f-1fb8c34a1d0a'; -- digital-cameras (dup)
DELETE FROM categories WHERE id = 'e459e42f-3127-4b0e-aba2-c60d77b1676a'; -- drones-aerial (dup)

-- STEP 4: Now delete the empty L0 categories
DELETE FROM categories WHERE id = 'ad7527d9-48e8-4dcd-849e-fd40d855cae8'; -- Cell Phones L0
DELETE FROM categories WHERE id = '89d91c4c-fafb-44a0-bfef-723629c7715f'; -- Cameras & Photo L0
;
