
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 2E: L2 Categories for WATCHES
-- Date: December 4, 2025
-- Note: Watches already has some L2 structure, we'll add missing ones
-- ==============================================

-- Get the watches parent_id
DO $$
DECLARE
    watches_id UUID;
BEGIN
    SELECT id INTO watches_id FROM categories WHERE slug = 'watches';
    
    -- Insert additional L2 categories for Watches
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES 
        (gen_random_uuid(), 'Women''s Watches', 'Дамски часовници', 'watches-womens', watches_id, '👩', 6),
        (gen_random_uuid(), 'Men''s Watches', 'Мъжки часовници', 'watches-mens', watches_id, '👨', 7),
        (gen_random_uuid(), 'Fashion Watches', 'Модни часовници', 'watches-fashion', watches_id, '👗', 8),
        (gen_random_uuid(), 'Vintage Watches', 'Винтидж часовници', 'watches-vintage-cat', watches_id, '📜', 9),
        (gen_random_uuid(), 'Smart Watches', 'Смарт часовници', 'watches-smart-cat', watches_id, '📱', 10),
        (gen_random_uuid(), 'Dive Watches', 'Водолазни часовници', 'watches-dive', watches_id, '🤿', 11),
        (gen_random_uuid(), 'Chronograph Watches', 'Хронографи', 'watches-chronograph', watches_id, '⏱️', 12),
        (gen_random_uuid(), 'Watch Straps & Bands', 'Каишки за часовници', 'watches-straps-cat', watches_id, '⌚', 13),
        (gen_random_uuid(), 'Watch Accessories', 'Аксесоари за часовници', 'watches-accessories-cat', watches_id, '🔧', 14),
        (gen_random_uuid(), 'Watch by Brand', 'Часовници по марка', 'watches-brands', watches_id, '🏷️', 15)
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        name_bg = EXCLUDED.name_bg,
        icon = EXCLUDED.icon,
        display_order = EXCLUDED.display_order;
END $$;
;
