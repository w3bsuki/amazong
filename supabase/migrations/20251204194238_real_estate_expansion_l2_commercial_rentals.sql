
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 2E: L2 FOR COMMERCIAL RENTALS
-- Need to first get the new L1 ID
-- ============================================================================

-- Get the commercial-rentals ID and add L2 subcategories
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(),
    v.name,
    v.name_bg,
    v.slug,
    (SELECT id FROM categories WHERE slug = 'commercial-rentals'),
    v.description,
    v.description_bg,
    v.display_order
FROM (VALUES
    ('Offices for Rent', 'Офиси под наем', 'offices-rent', 'Office spaces for rent', 'Офис площи под наем', 1),
    ('Retail Shops Rent', 'Магазини под наем', 'retail-shops-rent', 'Retail shops for rent', 'Магазини под наем', 2),
    ('Warehouses Rent', 'Складове под наем', 'warehouses-rent', 'Warehouse spaces for rent', 'Складове под наем', 3),
    ('Industrial Rent', 'Промишлени под наем', 'industrial-rent', 'Industrial spaces for rent', 'Промишлени площи под наем', 4),
    ('Restaurant Spaces Rent', 'Заведения под наем', 'restaurants-rent', 'Restaurant and cafe spaces for rent', 'Ресторантски площи под наем', 5),
    ('Showrooms Rent', 'Шоуруми под наем', 'showrooms-rent', 'Showroom spaces for rent', 'Шоуруми под наем', 6),
    ('Medical Spaces Rent', 'Медицински площи под наем', 'medical-rent', 'Medical and clinic spaces for rent', 'Медицински и клинични площи под наем', 7),
    ('Coworking Rent', 'Коуъркинг под наем', 'coworking-rent', 'Coworking and shared office rent', 'Коуъркинг и споделени офиси под наем', 8),
    ('Event Spaces Rent', 'Зали под наем', 'event-spaces-rent', 'Event and conference spaces', 'Зали за събития и конференции', 9),
    ('Production Spaces Rent', 'Производствени площи', 'production-rent', 'Production and workshop spaces', 'Производствени и работилнически площи', 10)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'commercial-rentals');
;
