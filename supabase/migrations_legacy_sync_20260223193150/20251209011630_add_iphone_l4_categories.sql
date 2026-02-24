
-- Add L4 categories for iPhone models (specific variants)
-- iPhone 15 Series L4
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('iPhone 15', 'iPhone 15', 'iphone-15', '9dfd4635-bb13-482f-99cb-ae354bd906a4', 1),
('iPhone 15 Plus', 'iPhone 15 Plus', 'iphone-15-plus', '9dfd4635-bb13-482f-99cb-ae354bd906a4', 2),
('iPhone 15 Pro', 'iPhone 15 Pro', 'iphone-15-pro', '9dfd4635-bb13-482f-99cb-ae354bd906a4', 3),
('iPhone 15 Pro Max', 'iPhone 15 Pro Max', 'iphone-15-pro-max', '9dfd4635-bb13-482f-99cb-ae354bd906a4', 4)
ON CONFLICT (slug) DO NOTHING;

-- Get iPhone 16 Series parent ID and add L4
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) 
SELECT 'iPhone 16', 'iPhone 16', 'iphone-16', id, 1 FROM categories WHERE slug = 'iphone-16-series'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order) 
SELECT 'iPhone 16 Plus', 'iPhone 16 Plus', 'iphone-16-plus', id, 2 FROM categories WHERE slug = 'iphone-16-series'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order) 
SELECT 'iPhone 16 Pro', 'iPhone 16 Pro', 'iphone-16-pro', id, 3 FROM categories WHERE slug = 'iphone-16-series'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order) 
SELECT 'iPhone 16 Pro Max', 'iPhone 16 Pro Max', 'iphone-16-pro-max', id, 4 FROM categories WHERE slug = 'iphone-16-series'
ON CONFLICT (slug) DO NOTHING;

-- Add L4 for Samsung Galaxy S24 Series
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) 
SELECT 'Galaxy S24', 'Galaxy S24', 'galaxy-s24', id, 1 FROM categories WHERE slug = 'samsung-galaxy-s24'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order) 
SELECT 'Galaxy S24+', 'Galaxy S24+', 'galaxy-s24-plus', id, 2 FROM categories WHERE slug = 'samsung-galaxy-s24'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order) 
SELECT 'Galaxy S24 Ultra', 'Galaxy S24 Ultra', 'galaxy-s24-ultra', id, 3 FROM categories WHERE slug = 'samsung-galaxy-s24'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, name_bg, slug, parent_id, display_order) 
SELECT 'Galaxy S24 FE', 'Galaxy S24 FE', 'galaxy-s24-fe', id, 4 FROM categories WHERE slug = 'samsung-galaxy-s24'
ON CONFLICT (slug) DO NOTHING;
;
