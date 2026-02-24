
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 3A: L3 CATEGORIES FOR APARTMENT SALES
-- Adding L3 depth for apartment types by construction, style, and features
-- ============================================================================

-- L3 under Studios for Sale
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'studios-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Box Studios', 'Боксониери', 'box-studios-sale', 'Small box studio apartments', 'Малки боксониери', 1),
    ('Open Plan Studios', 'Студия отворен план', 'open-studios-sale', 'Open plan studio apartments', 'Студия с отворен план', 2),
    ('Furnished Studios', 'Обзаведени студия', 'furnished-studios-sale', 'Fully furnished studios', 'Напълно обзаведени студия', 3),
    ('New Build Studios', 'Новострой студия', 'newbuild-studios-sale', 'Newly constructed studios', 'Новопостроени студия', 4),
    ('Investment Studios', 'Инвестиционни студия', 'investment-studios-sale', 'Studios for investment', 'Студия за инвестиция', 5)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'studios-sale');

-- L3 under Maisonettes
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'maisonettes-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('2-Level Maisonettes', 'Двуетажни мезонети', '2level-maisonettes', 'Two level maisonettes', 'Двуетажни мезонети', 1),
    ('3-Level Maisonettes', 'Триетажни мезонети', '3level-maisonettes', 'Three level maisonettes', 'Триетажни мезонети', 2),
    ('Roof Maisonettes', 'Покривни мезонети', 'roof-maisonettes', 'Maisonettes with roof terrace', 'Мезонети с покривна тераса', 3),
    ('Garden Maisonettes', 'Мезонети с градина', 'garden-maisonettes', 'Maisonettes with private garden', 'Мезонети с частна градина', 4),
    ('Luxury Maisonettes', 'Луксозни мезонети', 'luxury-maisonettes', 'High-end luxury maisonettes', 'Луксозни мезонети', 5)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'maisonettes-sale');

-- L3 under Penthouses
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'penthouses-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Classic Penthouses', 'Класически пентхауси', 'classic-penthouses', 'Traditional penthouse apartments', 'Класически пентхаус апартаменти', 1),
    ('Duplex Penthouses', 'Дуплекс пентхауси', 'duplex-penthouses', 'Two-story penthouse units', 'Двуетажни пентхауси', 2),
    ('Triplex Penthouses', 'Триплекс пентхауси', 'triplex-penthouses', 'Three-story penthouse units', 'Триетажни пентхауси', 3),
    ('Sky Villas', 'Скай вили', 'sky-villas', 'Ultra-luxury sky villa penthouses', 'Ултра луксозни скай вили', 4),
    ('Pool Penthouses', 'Пентхауси с басейн', 'pool-penthouses', 'Penthouses with private pool', 'Пентхауси с частен басейн', 5),
    ('Terrace Penthouses', 'Пентхауси с тераса', 'terrace-penthouses', 'Penthouses with large terraces', 'Пентхауси с големи тераси', 6)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'penthouses-sale');

-- L3 under Loft Apartments
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'lofts-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Industrial Lofts', 'Индустриални лофтове', 'industrial-lofts', 'Converted industrial lofts', 'Преустроени индустриални лофтове', 1),
    ('Artist Lofts', 'Художествени лофтове', 'artist-lofts', 'Lofts suitable for artists', 'Лофтове подходящи за художници', 2),
    ('Modern Lofts', 'Модерни лофтове', 'modern-lofts', 'Contemporary design lofts', 'Съвременен дизайн лофтове', 3),
    ('Live-Work Lofts', 'Лофт офиси', 'live-work-lofts', 'Combined living and working spaces', 'Комбинирани жилищни и работни пространства', 4),
    ('Hard Lofts', 'Хард лофтове', 'hard-lofts', 'Authentic converted building lofts', 'Автентични преустроени лофтове', 5)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'lofts-sale');
;
