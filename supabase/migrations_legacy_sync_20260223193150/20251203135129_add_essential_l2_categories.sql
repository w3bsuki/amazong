
-- ============================================
-- Add essential L2 categories where navigation makes sense
-- For other categories, we'll use attributes for filtering
-- ============================================

-- Get parent IDs for categories that need L2
-- Smart Home → Smart Security
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Security Cameras', 'Охранителни камери', 'security-cameras', id, 1
FROM categories WHERE slug = 'smart-security' 
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Smart Locks', 'Умни брави', 'smart-locks', id, 2
FROM categories WHERE slug = 'smart-security'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Motion Sensors', 'Сензори за движение', 'motion-sensors', id, 3
FROM categories WHERE slug = 'smart-security'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Video Doorbells', 'Видео звънци', 'video-doorbells', id, 4
FROM categories WHERE slug = 'smart-security'
ON CONFLICT (slug) DO NOTHING;

-- Jewelry & Watches → Watches L2
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Luxury Watches', 'Луксозни часовници', 'luxury-watches', id, 1
FROM categories WHERE slug = 'watches' AND parent_id = (SELECT id FROM categories WHERE slug = 'jewelry-watches')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Sport Watches', 'Спортни часовници', 'sport-watches', id, 2
FROM categories WHERE slug = 'watches' AND parent_id = (SELECT id FROM categories WHERE slug = 'jewelry-watches')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Pocket Watches', 'Джобни часовници', 'pocket-watches', id, 3
FROM categories WHERE slug = 'watches' AND parent_id = (SELECT id FROM categories WHERE slug = 'jewelry-watches')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Watch Accessories', 'Аксесоари за часовници', 'watch-accessories', id, 4
FROM categories WHERE slug = 'watches' AND parent_id = (SELECT id FROM categories WHERE slug = 'jewelry-watches')
ON CONFLICT (slug) DO NOTHING;

-- Health & Wellness → Vitamins & Supplements L2
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Vitamins', 'Витамини', 'vitamins', id, 1
FROM categories WHERE slug = 'vitamins-supplements'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Protein & Fitness', 'Протеини и фитнес', 'protein-fitness', id, 2
FROM categories WHERE slug = 'vitamins-supplements'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Herbal Supplements', 'Билкови добавки', 'herbal-supplements', id, 3
FROM categories WHERE slug = 'vitamins-supplements'
ON CONFLICT (slug) DO NOTHING;

-- Baby & Kids → Kids Toys L2
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Educational Toys', 'Образователни играчки', 'baby-educational-toys', id, 1
FROM categories WHERE slug = 'kids-toys'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Outdoor Toys', 'Играчки за навън', 'baby-outdoor-toys', id, 2
FROM categories WHERE slug = 'kids-toys'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Ride-On Toys', 'Играчки за каране', 'ride-on-toys', id, 3
FROM categories WHERE slug = 'kids-toys'
ON CONFLICT (slug) DO NOTHING;

-- Garden & Outdoor → Outdoor Furniture L2
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Patio Furniture', 'Мебели за тераса', 'patio-furniture', id, 1
FROM categories WHERE slug = 'outdoor-furniture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Outdoor Seating', 'Външни седалки', 'outdoor-seating', id, 2
FROM categories WHERE slug = 'outdoor-furniture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Hammocks & Swings', 'Хамаци и люлки', 'hammocks-swings', id, 3
FROM categories WHERE slug = 'outdoor-furniture'
ON CONFLICT (slug) DO NOTHING;
;
