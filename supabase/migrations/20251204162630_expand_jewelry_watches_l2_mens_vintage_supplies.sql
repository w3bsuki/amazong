
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 2G: L2 Categories for MEN'S, VINTAGE & SUPPLIES
-- Date: December 4, 2025
-- ==============================================

-- Insert L2 Categories under Men's Jewelry (jw-mens)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT 
    gen_random_uuid(),
    v.name,
    v.name_bg,
    v.slug,
    (SELECT id FROM categories WHERE slug = 'jw-mens'),
    v.icon,
    v.display_order
FROM (VALUES
    ('Men''s Rings', 'Мъжки пръстени', 'mens-rings', '💍', 1),
    ('Men''s Necklaces & Chains', 'Мъжки колиета', 'mens-necklaces', '⛓️', 2),
    ('Men''s Bracelets', 'Мъжки гривни', 'mens-bracelets', '💪', 3),
    ('Men''s Earrings', 'Мъжки обеци', 'mens-earrings', '👂', 4),
    ('Cufflinks', 'Копчета за ръкавели', 'mens-cufflinks', '🔗', 5),
    ('Tie Accessories', 'Аксесоари за вратовръзка', 'mens-tie', '👔', 6),
    ('Money Clips', 'Щипки за пари', 'mens-moneyclips', '💵', 7),
    ('Lapel Pins & Badges', 'Значки и пинове', 'mens-lapels', '📌', 8),
    ('Men''s Pendants', 'Мъжки медальони', 'mens-pendants', '🔱', 9)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;

-- Insert L2 Categories under Vintage & Estate (jw-vintage-estate)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT 
    gen_random_uuid(),
    v.name,
    v.name_bg,
    v.slug,
    (SELECT id FROM categories WHERE slug = 'jw-vintage-estate'),
    v.icon,
    v.display_order
FROM (VALUES
    ('Victorian Jewelry (1837-1901)', 'Викториански бижута', 'vintage-victorian', '👑', 1),
    ('Art Deco Jewelry (1920-1935)', 'Арт деко бижута', 'vintage-artdeco', '🔷', 2),
    ('Art Nouveau Jewelry (1890-1910)', 'Арт нуво бижута', 'vintage-artnouveau', '🌿', 3),
    ('Retro Jewelry (1935-1950)', 'Ретро бижута', 'vintage-retro', '📻', 4),
    ('Mid-Century Modern (1950-1970)', 'Средата на века', 'vintage-midcentury', '🪑', 5),
    ('Estate Jewelry', 'Наследствени бижута', 'vintage-estate', '🏰', 6),
    ('Antique Jewelry', 'Антични бижута', 'vintage-antique', '🏛️', 7),
    ('Antique Watches', 'Антични часовници', 'vintage-antique-watches', '🕰️', 8),
    ('Vintage Signed Pieces', 'Подписани винтидж бижута', 'vintage-signed', '✍️', 9),
    ('Edwardian Jewelry (1901-1910)', 'Едуардиански бижута', 'vintage-edwardian', '🎩', 10)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;

-- Insert L2 Categories under Jewelry Supplies & Care (jw-supplies)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT 
    gen_random_uuid(),
    v.name,
    v.name_bg,
    v.slug,
    (SELECT id FROM categories WHERE slug = 'jw-supplies'),
    v.icon,
    v.display_order
FROM (VALUES
    ('Beads & Findings', 'Мъниста и фурнитура', 'supplies-beads', '📿', 1),
    ('Chains & Wire', 'Вериги и тел', 'supplies-chains', '⛓️', 2),
    ('Settings & Mounts', 'Каси и монтажи', 'supplies-settings', '💎', 3),
    ('Jewelry Making Tools', 'Инструменти за бижута', 'supplies-tools', '🔧', 4),
    ('Jewelry Cleaning', 'Почистване на бижута', 'supplies-cleaning', '🧹', 5),
    ('Storage & Display', 'Съхранение и дисплеи', 'supplies-storage', '📦', 6),
    ('Repair Supplies', 'Материали за ремонт', 'supplies-repair', '🔨', 7),
    ('Packaging Materials', 'Опаковъчни материали', 'supplies-packaging', '🎁', 8),
    ('Jewelry Boxes', 'Кутии за бижута', 'supplies-boxes', '🗃️', 9)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
;
