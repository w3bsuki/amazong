
-- Add L4 categories for specific console models

-- PlayStation 5 variants
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('PS5 Console (Disc)', 'PS5 Конзола (Диск)', 'ps5-disc-edition', '857da200-fc37-44a8-b7bb-2ebff26f8f3c', 1),
('PS5 Console (Digital)', 'PS5 Конзола (Дигитална)', 'ps5-digital-edition', '857da200-fc37-44a8-b7bb-2ebff26f8f3c', 2),
('PS5 Slim (Disc)', 'PS5 Slim (Диск)', 'ps5-slim-disc', '857da200-fc37-44a8-b7bb-2ebff26f8f3c', 3),
('PS5 Slim (Digital)', 'PS5 Slim (Дигитална)', 'ps5-slim-digital', '857da200-fc37-44a8-b7bb-2ebff26f8f3c', 4),
('PS5 Pro', 'PS5 Pro', 'ps5-pro', '857da200-fc37-44a8-b7bb-2ebff26f8f3c', 5)
ON CONFLICT (slug) DO NOTHING;

-- Xbox Series variants
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Xbox Series X', 'Xbox Series X', 'xbox-series-x', '2c1c78e0-4c85-43e5-b10b-cee1a9cd30be', 1),
('Xbox Series S', 'Xbox Series S', 'xbox-series-s', '2c1c78e0-4c85-43e5-b10b-cee1a9cd30be', 2),
('Xbox Series X (1TB)', 'Xbox Series X (1TB)', 'xbox-series-x-1tb', '2c1c78e0-4c85-43e5-b10b-cee1a9cd30be', 3),
('Xbox Series S (1TB)', 'Xbox Series S (1TB)', 'xbox-series-s-1tb', '2c1c78e0-4c85-43e5-b10b-cee1a9cd30be', 4)
ON CONFLICT (slug) DO NOTHING;

-- Nintendo Switch variants
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Switch OLED', 'Switch OLED', 'switch-oled', 'fba8d31a-a54c-4d8f-aa84-94b5380cf425', 1),
('Switch Standard', 'Switch Standard', 'switch-standard', 'fba8d31a-a54c-4d8f-aa84-94b5380cf425', 2),
('Switch Lite', 'Switch Lite', 'switch-lite', 'fba8d31a-a54c-4d8f-aa84-94b5380cf425', 3)
ON CONFLICT (slug) DO NOTHING;
;
