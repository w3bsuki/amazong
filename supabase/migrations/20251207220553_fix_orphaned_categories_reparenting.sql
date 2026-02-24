
-- Fix orphaned categories that lost their parent_id references
-- These categories appear in subheader incorrectly because they have parent_id = NULL

-- iPhone series → smartphones-iphone
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-iphone')
WHERE slug IN ('iphone-16-series', 'iphone-15-series', 'iphone-12-series', 'iphone-legacy') AND parent_id IS NULL;

-- Samsung Galaxy series → smartphones-samsung
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'smartphones-samsung')
WHERE slug IN ('galaxy-s-series', 'galaxy-z-fold', 'galaxy-z-flip') AND parent_id IS NULL;

-- iPad series → tablets (need to find proper iPad category)
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'tablets')
WHERE slug IN ('ipad-pro', 'ipad-air', 'ipad-mini', 'ipad-10th-gen') AND parent_id IS NULL;

-- TV types → televisions-category
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'televisions-category')
WHERE slug IN ('smart-tvs', 'led-tvs', 'budget-tvs') AND parent_id IS NULL;

-- Camera accessories → electronics-cameras
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'electronics-cameras')
WHERE slug IN ('camera-lenses', 'camera-accessories', 'tripods-stabilizers') AND parent_id IS NULL;

-- Movies & Music subcategories
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'movies-music')
WHERE slug IN ('dvds', 'blu-rays', '4k-movies', 'tv-series', 'sheet-music') AND parent_id IS NULL;

-- Fragrance subcategories → fragrance (under beauty)
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'fragrance')
WHERE slug IN ('womens-fragrances', 'mens-fragrances', 'unisex-fragrances', 'body-sprays', 'perfume-sets') AND parent_id IS NULL;

-- Hair care subcategories → haircare (under beauty)
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'haircare')
WHERE slug IN ('shampoo', 'conditioner', 'hair-masks', 'hair-styling', 'hair-color', 'hair-extensions', 'hair-tools') AND parent_id IS NULL;

-- Real Estate subcategories
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'real-estate')
WHERE slug IN ('apartments-rent', 'apartments-sale', 'land-sale', 'commercial-sale', 'commercial-rent', 'garages-rent') AND parent_id IS NULL;

-- Coins & Banknotes → collectibles (need to find proper sub)
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'collectibles')
WHERE slug IN ('bulgarian-coins', 'world-coins', 'ancient-coins', 'gold-coins', 'silver-coins', 'banknotes') AND parent_id IS NULL;

-- Comics → collectibles
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'collectibles')
WHERE slug IN ('marvel-comics', 'dc-comics', 'manga-comics', 'indie-comics', 'vintage-comics') AND parent_id IS NULL;

-- E-Mobility subcategories
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'e-mobility')
WHERE slug IN ('commuter-scooters', 'offroad-scooters', 'kids-electric-scooters', 'seated-scooters', 
               'city-ebikes', 'mountain-ebikes', 'folding-ebikes', 'cargo-ebikes', 'road-ebikes',
               'ebike-parts', 'emobility-batteries', 'emobility-chargers', 'emobility-motors', 'emobility-accessories') AND parent_id IS NULL;

-- Sports outdoor gear → hiking-camping or sports
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'hiking-camping')
WHERE slug IN ('hiking-gear', 'camping-gear-cat', 'climbing-gear', 'backpacks-outdoor', 'hunting-gear') AND parent_id IS NULL;

-- Fitness equipment → fitness
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'fitness')
WHERE slug IN ('exercise-bikes', 'treadmills', 'ellipticals', 'resistance-bands') AND parent_id IS NULL;

-- Services subcategories
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'services')
WHERE slug IN ('dj-services', 'catering-services', 'event-photography', 'event-planning', 
               'decoration-services', 'live-music-services', 'mc-host-services') AND parent_id IS NULL;

-- Smart devices → smart-devices (under electronics)
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'smart-devices')
WHERE slug IN ('smart-lights') AND parent_id IS NULL;

-- Job categories need a parent - check if we have Jobs L1
-- First check and create Jobs L1 if needed
INSERT INTO categories (name, slug, name_bg, icon, description, parent_id, display_order)
SELECT 'Jobs', 'jobs', 'Работа', '💼', 'Job listings and employment', NULL, 24
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'jobs');

-- Now reparent all job categories to Jobs
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'jobs')
WHERE slug IN (
  'software-dev-jobs', 'web-dev-jobs', 'mobile-dev-jobs', 'devops-jobs', 'data-science-jobs', 
  'qa-engineer-jobs', 'it-support-jobs', 'ui-ux-jobs',
  'nursing-jobs', 'doctor-jobs', 'pharmacy-jobs', 'dental-jobs', 'caregiver-jobs', 'medical-lab-jobs',
  'sales-jobs', 'marketing-jobs', 'finance-jobs', 'accounting-jobs', 'hr-jobs', 'management-jobs', 'admin-jobs'
) AND parent_id IS NULL;

-- Fashion - sleepwear should be under fashion-mens
UPDATE categories SET parent_id = (SELECT id FROM categories WHERE slug = 'fashion-mens')
WHERE slug = 'mens-sleepwear' AND parent_id IS NULL;
;
