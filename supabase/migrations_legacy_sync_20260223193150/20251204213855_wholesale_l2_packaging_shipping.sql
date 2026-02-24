
-- L2 Categories for: Wholesale Packaging & Shipping (c0f5a8b9-d1e2-4f3a-5b6c-7d8e9f0a1b2c)
-- Note: Move existing Packaging Materials under this parent

UPDATE categories 
SET parent_id = 'c0f5a8b9-d1e2-4f3a-5b6c-7d8e9f0a1b2c', 
    display_order = 1,
    name = 'Boxes & Cartons',
    name_bg = 'Кутии и кашони'
WHERE id = 'd0ca2ec4-c2f3-43d0-be86-f31fded84f5a';

INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Bags & Pouches', 'Торби и пликове', 'wholesale-bags-pouches', 'c0f5a8b9-d1e2-4f3a-5b6c-7d8e9f0a1b2c', 2),
('Tape & Adhesives', 'Лепенки и лепила', 'wholesale-tape-adhesives', 'c0f5a8b9-d1e2-4f3a-5b6c-7d8e9f0a1b2c', 3),
('Protective Packaging', 'Защитни опаковки', 'wholesale-protective-packaging', 'c0f5a8b9-d1e2-4f3a-5b6c-7d8e9f0a1b2c', 4),
('Shipping Supplies', 'Транспортни консумативи', 'wholesale-shipping-supplies', 'c0f5a8b9-d1e2-4f3a-5b6c-7d8e9f0a1b2c', 5),
('Labels & Tags', 'Етикети и маркери', 'wholesale-labels-tags', 'c0f5a8b9-d1e2-4f3a-5b6c-7d8e9f0a1b2c', 6),
('Food Packaging', 'Хранителни опаковки', 'wholesale-food-packaging', 'c0f5a8b9-d1e2-4f3a-5b6c-7d8e9f0a1b2c', 7),
('Gift Packaging', 'Подаръчни опаковки', 'wholesale-gift-packaging', 'c0f5a8b9-d1e2-4f3a-5b6c-7d8e9f0a1b2c', 8);
;
