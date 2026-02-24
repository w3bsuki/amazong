
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 2B: L2 Categories for NECKLACES
-- Date: December 4, 2025
-- ==============================================

-- Insert L2 Categories under Necklaces & Pendants (jw-necklaces)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
SELECT 
    gen_random_uuid(),
    v.name,
    v.name_bg,
    v.slug,
    (SELECT id FROM categories WHERE slug = 'jw-necklaces'),
    v.icon,
    v.display_order
FROM (VALUES
    ('Chains', 'Вериги', 'necklaces-chains', '⛓️', 1),
    ('Pendants', 'Медальони', 'necklaces-pendants', '💎', 2),
    ('Statement Necklaces', 'Изявени колиета', 'necklaces-statement', '✨', 3),
    ('Chokers', 'Чокъри', 'necklaces-chokers', '📿', 4),
    ('Pearl Necklaces', 'Перлени колиета', 'necklaces-pearls', '🦪', 5),
    ('Layering Necklaces', 'Многопластови колиета', 'necklaces-layering', '🔗', 6),
    ('Religious Necklaces', 'Религиозни колиета', 'necklaces-religious', '✝️', 7),
    ('Name & Initial Necklaces', 'Персонализирани колиета', 'necklaces-personalized', '🔤', 8),
    ('Lockets', 'Медальони с отваряне', 'necklaces-lockets', '🤍', 9),
    ('Men''s Necklaces', 'Мъжки колиета', 'necklaces-mens', '🧔', 10)
) AS v(name, name_bg, slug, icon, display_order)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_bg = EXCLUDED.name_bg,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order;
;
