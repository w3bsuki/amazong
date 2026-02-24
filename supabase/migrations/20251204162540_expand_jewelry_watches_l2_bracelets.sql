
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 2D: L2 Categories for BRACELETS
-- Date: December 4, 2025
-- ==============================================

-- Insert L2 Categories under Bracelets & Bangles (jw-bracelets)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT 
    gen_random_uuid(),
    v.name,
    v.name_bg,
    v.slug,
    (SELECT id FROM categories WHERE slug = 'jw-bracelets'),
    v.icon,
    v.display_order
FROM (VALUES
    ('Tennis Bracelets', 'Тенис гривни', 'bracelets-tennis', '💎', 1),
    ('Bangles', 'Твърди гривни', 'bracelets-bangles', '🔵', 2),
    ('Chain Bracelets', 'Верижни гривни', 'bracelets-chain', '⛓️', 3),
    ('Charm Bracelets', 'Гривни с висулки', 'bracelets-charm', '🎀', 4),
    ('Cuff Bracelets', 'Широки гривни', 'bracelets-cuff', '⚡', 5),
    ('Link Bracelets', 'Гривни с звена', 'bracelets-link', '🔗', 6),
    ('Pearl Bracelets', 'Перлени гривни', 'bracelets-pearls', '🦪', 7),
    ('Leather Bracelets', 'Кожени гривни', 'bracelets-leather', '🪶', 8),
    ('Beaded Bracelets', 'Гривни с мъниста', 'bracelets-beaded', '🔮', 9),
    ('Friendship Bracelets', 'Приятелски гривни', 'bracelets-friendship', '🤝', 10),
    ('ID Bracelets', 'ID гривни', 'bracelets-id', '🏷️', 11),
    ('Medical ID Bracelets', 'Медицински гривни', 'bracelets-medical', '⚕️', 12),
    ('Men''s Bracelets', 'Мъжки гривни', 'bracelets-mens', '🧔', 13),
    ('Anklets', 'Гривни за глезен', 'bracelets-anklets', '🦶', 14)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
;
