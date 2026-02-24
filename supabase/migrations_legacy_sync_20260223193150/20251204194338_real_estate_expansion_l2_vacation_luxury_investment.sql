
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 2G: L2 FOR VACATION, LUXURY & INVESTMENT
-- ============================================================================

-- VACATION RENTALS (0e8c1882-8d46-4e23-8add-97e450fd702b)
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT * FROM (VALUES
    (gen_random_uuid(), 'Beach Properties', 'Морски имоти', 'beach-properties',
     '0e8c1882-8d46-4e23-8add-97e450fd702b'::uuid,
     'Beach houses and seaside apartments', 'Морски къщи и апартаменти', 1),
    
    (gen_random_uuid(), 'Mountain Chalets', 'Планински вили', 'mountain-chalets',
     '0e8c1882-8d46-4e23-8add-97e450fd702b'::uuid,
     'Mountain chalets and ski properties', 'Планински вили и ски имоти', 2),
    
    (gen_random_uuid(), 'Spa Properties', 'СПА имоти', 'spa-properties',
     '0e8c1882-8d46-4e23-8add-97e450fd702b'::uuid,
     'Properties near spa resorts', 'Имоти близо до СПА курорти', 3),
    
    (gen_random_uuid(), 'Holiday Apartments', 'Ваканционни апартаменти', 'holiday-apartments',
     '0e8c1882-8d46-4e23-8add-97e450fd702b'::uuid,
     'Apartments for vacation use', 'Апартаменти за ваканционно ползване', 4),
    
    (gen_random_uuid(), 'Holiday Houses', 'Ваканционни къщи', 'holiday-houses',
     '0e8c1882-8d46-4e23-8add-97e450fd702b'::uuid,
     'Vacation houses and cottages', 'Ваканционни къщи и вили', 5),
    
    (gen_random_uuid(), 'Timeshares', 'Споделена собственост', 'timeshares',
     '0e8c1882-8d46-4e23-8add-97e450fd702b'::uuid,
     'Timeshare and fractional ownership', 'Споделена собственост и таймшеър', 6),
    
    (gen_random_uuid(), 'Camping & Glamping', 'Къмпинги и глемпинг', 'camping-glamping',
     '0e8c1882-8d46-4e23-8add-97e450fd702b'::uuid,
     'Camping sites and glamping facilities', 'Къмпинг места и глемпинг съоръжения', 7),
    
    (gen_random_uuid(), 'Rural Retreats', 'Селски имоти за почивка', 'rural-retreats',
     '0e8c1882-8d46-4e23-8add-97e450fd702b'::uuid,
     'Rural vacation properties', 'Селски ваканционни имоти', 8)
) AS new_cats(id, name, name_bg, slug, parent_id, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = new_cats.slug);

-- LUXURY PROPERTIES (get ID dynamically)
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'luxury-properties'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Luxury Apartments', 'Луксозни апартаменти', 'luxury-apartments', 'Premium apartments in top locations', 'Премиум апартаменти на топ локации', 1),
    ('Luxury Villas', 'Луксозни вили', 'luxury-villas', 'High-end villas and estates', 'Луксозни вили и имения', 2),
    ('Mansions', 'Имения', 'mansions-sale', 'Mansions and grand estates', 'Имения и резиденции', 3),
    ('Waterfront Properties', 'Имоти на водата', 'waterfront-luxury', 'Waterfront and marina properties', 'Имоти на морето, река или езеро', 4),
    ('Historic Properties', 'Исторически имоти', 'historic-properties', 'Historic and heritage buildings', 'Исторически и архитектурни паметници', 5),
    ('Gated Communities', 'Затворени комплекси', 'gated-communities', 'Properties in gated communities', 'Имоти в затворени комплекси', 6),
    ('Smart Homes', 'Смарт домове', 'smart-homes', 'Modern smart home properties', 'Модерни смарт домове', 7),
    ('Designer Properties', 'Дизайнерски имоти', 'designer-properties', 'Architect-designed properties', 'Имоти от известни архитекти', 8)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'luxury-properties');

-- INVESTMENT PROPERTIES
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'investment-properties'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Multi-Family Buildings', 'Жилищни сгради', 'multi-family-sale', 'Apartment buildings for investment', 'Жилищни сгради за инвестиция', 1),
    ('Rental Properties', 'Имоти под наем', 'rental-investment', 'Properties with existing tenants', 'Имоти с наематели', 2),
    ('Commercial Investment', 'Търговски инвестиции', 'commercial-investment', 'Income-generating commercial', 'Търговски имоти с доходност', 3),
    ('Development Opportunities', 'Възможности за развитие', 'development-opportunities', 'Land and buildings for development', 'Терени и сгради за развитие', 4),
    ('REITs & Funds', 'Фондове за недвижими имоти', 'reits-funds', 'Real estate investment trusts', 'Инвестиционни тръстове', 5),
    ('Distressed Properties', 'Имоти с проблеми', 'distressed-properties', 'Below market value opportunities', 'Имоти под пазарна стойност', 6),
    ('Portfolio Sales', 'Портфолио продажби', 'portfolio-sales', 'Multiple property portfolios', 'Портфолио от имоти', 7),
    ('Off-Market Deals', 'Частни сделки', 'off-market-deals', 'Off-market investment opportunities', 'Частни инвестиционни възможности', 8)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'investment-properties');
;
