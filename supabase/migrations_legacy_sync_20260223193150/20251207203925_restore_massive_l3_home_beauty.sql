
-- MASSIVE L3 RESTORATION - HOME & BEAUTY
-- Furniture L3
INSERT INTO categories (id, name, slug, parent_id, icon, display_order) VALUES
(gen_random_uuid(), 'Sofas & Couches', 'furn-sofas', (SELECT id FROM categories WHERE slug = 'furniture'), '🛋️', 1),
(gen_random_uuid(), 'Beds & Mattresses', 'furn-beds', (SELECT id FROM categories WHERE slug = 'furniture'), '🛏️', 2),
(gen_random_uuid(), 'Tables', 'furn-tables', (SELECT id FROM categories WHERE slug = 'furniture'), '🪑', 3),
(gen_random_uuid(), 'Chairs', 'furn-chairs', (SELECT id FROM categories WHERE slug = 'furniture'), '🪑', 4),
(gen_random_uuid(), 'Mattresses', 'mattresses', (SELECT id FROM categories WHERE slug = 'furniture'), '🛏️', 5),
(gen_random_uuid(), 'Storage & Shelving', 'furn-storage', (SELECT id FROM categories WHERE slug = 'furniture'), '📦', 6),
(gen_random_uuid(), 'Wardrobes', 'wardrobes', (SELECT id FROM categories WHERE slug = 'furniture'), '🚪', 7),
(gen_random_uuid(), 'Desks', 'desks', (SELECT id FROM categories WHERE slug = 'furniture'), '🖥️', 8),
(gen_random_uuid(), 'TV Stands', 'tv-stands', (SELECT id FROM categories WHERE slug = 'furniture'), '📺', 9),
-- Kitchen & Dining L3
(gen_random_uuid(), 'Large Appliances', 'kitchen-large-appliances', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '🏠', 1),
(gen_random_uuid(), 'Small Appliances', 'kitchen-small-appliances', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '☕', 2),
(gen_random_uuid(), 'Cookware', 'cookware', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '🍳', 3),
(gen_random_uuid(), 'Bakeware', 'bakeware', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '🍞', 4),
(gen_random_uuid(), 'Dinnerware', 'dinnerware', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '🍽️', 5),
(gen_random_uuid(), 'Glassware', 'glassware', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '🥂', 6),
(gen_random_uuid(), 'Cutlery', 'cutlery', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '🍴', 7),
(gen_random_uuid(), 'Food Storage', 'food-storage', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '📦', 8),
(gen_random_uuid(), 'Kitchen Utensils', 'kitchen-utensils', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), '🥄', 9),
-- Bedding & Bath L3
(gen_random_uuid(), 'Bedding', 'bedding-bedding', (SELECT id FROM categories WHERE slug = 'bedding-bath'), '🛏️', 1),
(gen_random_uuid(), 'Towels', 'bath-towels', (SELECT id FROM categories WHERE slug = 'bedding-bath'), '🛁', 2),
(gen_random_uuid(), 'Bathroom Accessories', 'bath-accessories', (SELECT id FROM categories WHERE slug = 'bedding-bath'), '🚿', 3),
(gen_random_uuid(), 'Bathroom Furniture', 'bath-furniture', (SELECT id FROM categories WHERE slug = 'bedding-bath'), '🚿', 4),
-- Lighting L3
(gen_random_uuid(), 'Ceiling Lights', 'light-ceiling', (SELECT id FROM categories WHERE slug = 'lighting'), '💡', 1),
(gen_random_uuid(), 'Wall Lights', 'light-wall', (SELECT id FROM categories WHERE slug = 'lighting'), '💡', 2),
(gen_random_uuid(), 'Table & Floor Lamps', 'light-table-floor', (SELECT id FROM categories WHERE slug = 'lighting'), '💡', 3),
(gen_random_uuid(), 'Outdoor Lighting', 'light-outdoor', (SELECT id FROM categories WHERE slug = 'lighting'), '💡', 4),
(gen_random_uuid(), 'Smart Lighting', 'light-smart', (SELECT id FROM categories WHERE slug = 'lighting'), '💡', 5),
(gen_random_uuid(), 'Light Bulbs', 'light-bulbs', (SELECT id FROM categories WHERE slug = 'lighting'), '💡', 6),
-- Home Décor L3
(gen_random_uuid(), 'Wall Art', 'decor-wall-art', (SELECT id FROM categories WHERE slug = 'home-decor'), '🖼️', 1),
(gen_random_uuid(), 'Mirrors', 'decor-mirrors', (SELECT id FROM categories WHERE slug = 'home-decor'), '🪞', 2),
(gen_random_uuid(), 'Clocks', 'decor-clocks', (SELECT id FROM categories WHERE slug = 'home-decor'), '🕐', 3),
(gen_random_uuid(), 'Rugs & Carpets', 'decor-rugs', (SELECT id FROM categories WHERE slug = 'home-decor'), '🟫', 4),
(gen_random_uuid(), 'Window Treatments', 'decor-window', (SELECT id FROM categories WHERE slug = 'home-decor'), '🪟', 5),
(gen_random_uuid(), 'Decorative Accents', 'decor-accents', (SELECT id FROM categories WHERE slug = 'home-decor'), '🏺', 6),
(gen_random_uuid(), 'Cushions & Pillows', 'decor-cushions', (SELECT id FROM categories WHERE slug = 'home-decor'), '🛋️', 7),
-- Garden & Outdoor L3
(gen_random_uuid(), 'Plants & Seeds', 'plants-seeds', (SELECT id FROM categories WHERE slug = 'garden-outdoor'), '🌱', 1),
(gen_random_uuid(), 'Garden Tools', 'garden-tools', (SELECT id FROM categories WHERE slug = 'garden-outdoor'), '🔧', 2),
(gen_random_uuid(), 'Outdoor Furniture', 'outdoor-furniture', (SELECT id FROM categories WHERE slug = 'garden-outdoor'), '🪑', 3),
(gen_random_uuid(), 'BBQ & Grilling', 'bbq-grilling', (SELECT id FROM categories WHERE slug = 'garden-outdoor'), '🔥', 4),
(gen_random_uuid(), 'Lawn Care', 'lawn-care', (SELECT id FROM categories WHERE slug = 'garden-outdoor'), '🌿', 5),
(gen_random_uuid(), 'Outdoor Décor', 'outdoor-decor', (SELECT id FROM categories WHERE slug = 'garden-outdoor'), '🏡', 6),
(gen_random_uuid(), 'Pools & Spas', 'pools-spas', (SELECT id FROM categories WHERE slug = 'garden-outdoor'), '🏊', 7),
-- Beauty - Makeup L3
(gen_random_uuid(), 'Face Makeup', 'face-makeup', (SELECT id FROM categories WHERE slug = 'makeup'), '💄', 1),
(gen_random_uuid(), 'Eye Makeup', 'eye-makeup', (SELECT id FROM categories WHERE slug = 'makeup'), '👁️', 2),
(gen_random_uuid(), 'Lip Makeup', 'lip-makeup', (SELECT id FROM categories WHERE slug = 'makeup'), '💋', 3),
(gen_random_uuid(), 'Nail Polish', 'nail-polish', (SELECT id FROM categories WHERE slug = 'makeup'), '💅', 4),
(gen_random_uuid(), 'Makeup Brushes', 'makeup-brushes', (SELECT id FROM categories WHERE slug = 'makeup'), '🖌️', 5),
-- Beauty - Skincare L3
(gen_random_uuid(), 'Cleansers', 'cleansers', (SELECT id FROM categories WHERE slug = 'skincare'), '🧴', 1),
(gen_random_uuid(), 'Moisturizers', 'moisturizers', (SELECT id FROM categories WHERE slug = 'skincare'), '🧴', 2),
(gen_random_uuid(), 'Serums', 'serums', (SELECT id FROM categories WHERE slug = 'skincare'), '🧴', 3),
(gen_random_uuid(), 'Face Masks', 'face-masks', (SELECT id FROM categories WHERE slug = 'skincare'), '🧖', 4),
(gen_random_uuid(), 'Sunscreen', 'sunscreen', (SELECT id FROM categories WHERE slug = 'skincare'), '☀️', 5),
(gen_random_uuid(), 'Eye Cream', 'eye-cream', (SELECT id FROM categories WHERE slug = 'skincare'), '👁️', 6),
-- Beauty - Haircare L3
(gen_random_uuid(), 'Shampoos', 'shampoos', (SELECT id FROM categories WHERE slug = 'haircare'), '🧴', 1),
(gen_random_uuid(), 'Conditioners', 'conditioners', (SELECT id FROM categories WHERE slug = 'haircare'), '🧴', 2),
(gen_random_uuid(), 'Hair Treatments', 'hair-treatments', (SELECT id FROM categories WHERE slug = 'haircare'), '💇', 3),
(gen_random_uuid(), 'Styling Products', 'styling-products', (SELECT id FROM categories WHERE slug = 'haircare'), '💇', 4),
-- Beauty - Fragrance L3
(gen_random_uuid(), 'Women''s Fragrances', 'fragrance-women', (SELECT id FROM categories WHERE slug = 'fragrance'), '👩', 1),
(gen_random_uuid(), 'Men''s Fragrances', 'fragrance-men', (SELECT id FROM categories WHERE slug = 'fragrance'), '👨', 2),
(gen_random_uuid(), 'Unisex Fragrances', 'fragrance-unisex', (SELECT id FROM categories WHERE slug = 'fragrance'), '✨', 3),
(gen_random_uuid(), 'Fragrance Gift Sets', 'fragrance-sets', (SELECT id FROM categories WHERE slug = 'fragrance'), '🎁', 4)
ON CONFLICT (slug) DO NOTHING;
;
