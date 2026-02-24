
-- WHOLESALE EXPANSION - L1 Categories Part 1 (1-10)
-- Root ID: 405303e7-dbab-4a7a-8654-4e1e1ff3074f

-- Update existing L1 categories with better structure
UPDATE categories SET display_order = 1, name = 'Wholesale Electronics & Tech', name_bg = 'Електроника на едро'
WHERE id = '60341efb-90c4-4e6c-9e89-84c002ac8688';

UPDATE categories SET display_order = 2, name = 'Wholesale Fashion & Apparel', name_bg = 'Мода и облекло на едро'
WHERE id = 'a52bae42-d0ed-4719-8422-c29b30cd3d12';

UPDATE categories SET display_order = 4, name = 'Wholesale Home & Garden', name_bg = 'Дом и градина на едро'
WHERE id = '6f6187e0-f3a8-492b-942c-4850522fd450';

UPDATE categories SET display_order = 5, name = 'Wholesale Food & Beverages', name_bg = 'Храни и напитки на едро'
WHERE id = 'ac05d1ed-4602-4cf6-8087-f33908959660';

UPDATE categories SET display_order = 10, name = 'Wholesale Office & School', name_bg = 'Офис и училищни консумативи на едро'
WHERE id = 'e3ab88d1-4f8f-4ea7-8165-09bbaf537a97';

-- Insert new L1 categories (3, 6-20)
INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order) VALUES
-- 3. Wholesale Beauty & Personal Care
('b3e8f1a2-c4d5-4e6f-8a9b-0c1d2e3f4a5b', 'Wholesale Beauty & Personal Care', 'Красота и грижа за тялото на едро', 'wholesale-beauty', '405303e7-dbab-4a7a-8654-4e1e1ff3074f', '💄', 3),

-- 6. Wholesale Toys & Games
('c4f9a2b3-d5e6-4f7a-9b0c-1d2e3f4a5b6c', 'Wholesale Toys & Games', 'Играчки и игри на едро', 'wholesale-toys', '405303e7-dbab-4a7a-8654-4e1e1ff3074f', '🧸', 6),

-- 7. Wholesale Sports & Outdoor
('d5a0b3c4-e6f7-4a8b-0c1d-2e3f4a5b6c7d', 'Wholesale Sports & Outdoor', 'Спорт и отдих на едро', 'wholesale-sports', '405303e7-dbab-4a7a-8654-4e1e1ff3074f', '⚽', 7),

-- 8. Wholesale Automotive & Parts
('e6b1c4d5-f7a8-4b9c-1d2e-3f4a5b6c7d8e', 'Wholesale Automotive & Parts', 'Авточасти и аксесоари на едро', 'wholesale-automotive', '405303e7-dbab-4a7a-8654-4e1e1ff3074f', '🚗', 8),

-- 9. Wholesale Health & Medical
('f7c2d5e6-a8b9-4c0d-2e3f-4a5b6c7d8e9f', 'Wholesale Health & Medical', 'Здраве и медицина на едро', 'wholesale-health', '405303e7-dbab-4a7a-8654-4e1e1ff3074f', '🏥', 9);
;
