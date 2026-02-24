-- Restore Electronics > Smartphones L3 categories
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('iPhone 16 Series', 'smartphones-iphone-16', 'iPhone 16 серия', 1),
  ('iPhone 15 Series', 'smartphones-iphone-15', 'iPhone 15 серия', 2),
  ('iPhone 14 Series', 'smartphones-iphone-14', 'iPhone 14 серия', 3),
  ('iPhone 13 Series', 'smartphones-iphone-13', 'iPhone 13 серия', 4),
  ('iPhone 12 Series', 'smartphones-iphone-12', 'iPhone 12 серия', 5),
  ('iPhone SE', 'smartphones-iphone-se', 'iPhone SE', 6),
  ('Older iPhones', 'smartphones-iphone-older', 'Стари iPhone', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'smartphones-iphone'
ON CONFLICT (slug) DO NOTHING;

-- Samsung Galaxy L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Galaxy S24 Series', 'samsung-galaxy-s24', 'Galaxy S24 серия', 1),
  ('Galaxy S23 Series', 'samsung-galaxy-s23', 'Galaxy S23 серия', 2),
  ('Galaxy S22 Series', 'samsung-galaxy-s22', 'Galaxy S22 серия', 3),
  ('Galaxy Z Fold', 'samsung-galaxy-z-fold', 'Galaxy Z Fold', 4),
  ('Galaxy Z Flip', 'samsung-galaxy-z-flip', 'Galaxy Z Flip', 5),
  ('Galaxy A Series', 'samsung-galaxy-a', 'Galaxy A серия', 6),
  ('Galaxy M Series', 'samsung-galaxy-m', 'Galaxy M серия', 7)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'smartphones-samsung'
ON CONFLICT (slug) DO NOTHING;

-- Tablets L3
INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('iPad Pro', 'tablets-ipad-pro', 'iPad Pro', 1),
  ('iPad Air', 'tablets-ipad-air', 'iPad Air', 2),
  ('iPad Mini', 'tablets-ipad-mini', 'iPad Mini', 3),
  ('iPad Standard', 'tablets-ipad-standard', 'iPad', 4)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'tablets-ipad'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, name_bg, parent_id, display_order)
SELECT v.name, v.slug, v.name_bg, p.id, v.display_order
FROM (VALUES
  ('Galaxy Tab S Series', 'tablets-samsung-tab-s', 'Galaxy Tab S', 1),
  ('Galaxy Tab A Series', 'tablets-samsung-tab-a', 'Galaxy Tab A', 2)
) AS v(name, slug, name_bg, display_order)
CROSS JOIN categories p WHERE p.slug = 'tablets-samsung'
ON CONFLICT (slug) DO NOTHING;;
