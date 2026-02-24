
-- L3 for Rings
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Engagement Rings', 'Годежни пръстени', 'rings-engagement', id, 1 FROM categories WHERE slug = 'rings'
UNION ALL
SELECT 'Wedding Bands', 'Сватбени халки', 'rings-wedding', id, 2 FROM categories WHERE slug = 'rings'
UNION ALL
SELECT 'Fashion Rings', 'Модни пръстени', 'rings-fashion', id, 3 FROM categories WHERE slug = 'rings'
UNION ALL
SELECT 'Signet Rings', 'Печатни пръстени', 'rings-signet', id, 4 FROM categories WHERE slug = 'rings';

-- L3 for Necklaces
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Pendants', 'Медальони', 'necklaces-pendants', id, 1 FROM categories WHERE slug = 'necklaces'
UNION ALL
SELECT 'Chains', 'Синджири', 'necklaces-chains', id, 2 FROM categories WHERE slug = 'necklaces'
UNION ALL
SELECT 'Chokers', 'Чокъри', 'necklaces-chokers', id, 3 FROM categories WHERE slug = 'necklaces'
UNION ALL
SELECT 'Pearl Necklaces', 'Перлени колиета', 'necklaces-pearl', id, 4 FROM categories WHERE slug = 'necklaces';

-- L3 for Earrings
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Stud Earrings', 'Обеци тип кабошон', 'earrings-stud', id, 1 FROM categories WHERE slug = 'earrings'
UNION ALL
SELECT 'Hoop Earrings', 'Обеци халки', 'earrings-hoop', id, 2 FROM categories WHERE slug = 'earrings'
UNION ALL
SELECT 'Drop Earrings', 'Висящи обеци', 'earrings-drop', id, 3 FROM categories WHERE slug = 'earrings'
UNION ALL
SELECT 'Clip-On Earrings', 'Обеци с щипка', 'earrings-clipon', id, 4 FROM categories WHERE slug = 'earrings';

-- L3 for Bracelets
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Chain Bracelets', 'Гривни верижки', 'bracelets-chain', id, 1 FROM categories WHERE slug = 'bracelets'
UNION ALL
SELECT 'Bangles', 'Твърди гривни', 'bracelets-bangles', id, 2 FROM categories WHERE slug = 'bracelets'
UNION ALL
SELECT 'Charm Bracelets', 'Гривни с шармове', 'bracelets-charm', id, 3 FROM categories WHERE slug = 'bracelets'
UNION ALL
SELECT 'Leather Bracelets', 'Кожени гривни', 'bracelets-leather', id, 4 FROM categories WHERE slug = 'bracelets';

-- L3 for Watches
INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
SELECT 'Luxury Watches', 'Луксозни часовници', 'watches-luxury', id, 1 FROM categories WHERE slug = 'watches'
UNION ALL
SELECT 'Sport Watches', 'Спортни часовници', 'watches-sport', id, 2 FROM categories WHERE slug = 'watches'
UNION ALL
SELECT 'Dress Watches', 'Елегантни часовници', 'watches-dress', id, 3 FROM categories WHERE slug = 'watches'
UNION ALL
SELECT 'Pocket Watches', 'Джобни часовници', 'watches-pocket', id, 4 FROM categories WHERE slug = 'watches';
;
