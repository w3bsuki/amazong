-- Add other smartphone brands L2 under smartphones (d20450a8-53ce-4d20-9919-439a39e73cda)
-- First check existing and add missing brand subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
-- Google Pixel (new L2 if missing)
('Google Pixel', 'Google Pixel', 'smartphones-google', 'd20450a8-53ce-4d20-9919-439a39e73cda', 10),
-- Motorola
('Motorola', 'Motorola', 'smartphones-motorola', 'd20450a8-53ce-4d20-9919-439a39e73cda', 11),
-- Sony Xperia
('Sony Xperia', 'Sony Xperia', 'smartphones-sony', 'd20450a8-53ce-4d20-9919-439a39e73cda', 12),
-- Nokia
('Nokia', 'Nokia', 'smartphones-nokia', 'd20450a8-53ce-4d20-9919-439a39e73cda', 13),
-- Oppo
('Oppo', 'Oppo', 'smartphones-oppo', 'd20450a8-53ce-4d20-9919-439a39e73cda', 14),
-- Vivo
('Vivo', 'Vivo', 'smartphones-vivo', 'd20450a8-53ce-4d20-9919-439a39e73cda', 15),
-- Realme
('Realme', 'Realme', 'smartphones-realme', 'd20450a8-53ce-4d20-9919-439a39e73cda', 16),
-- Honor
('Honor', 'Honor', 'smartphones-honor', 'd20450a8-53ce-4d20-9919-439a39e73cda', 17),
-- Asus ROG Phone
('Asus ROG Phone', 'Asus ROG Phone', 'smartphones-asus-rog', 'd20450a8-53ce-4d20-9919-439a39e73cda', 18),
-- Nothing Phone
('Nothing Phone', 'Nothing Phone', 'smartphones-nothing', 'd20450a8-53ce-4d20-9919-439a39e73cda', 19)
ON CONFLICT (slug) DO NOTHING;;
