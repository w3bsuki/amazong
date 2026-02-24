-- Fix broken Unsplash image URLs for 4 categories
-- These photo IDs no longer exist on Unsplash

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop'
WHERE slug = 'fashion' AND parent_id IS NULL;
-- photo-1490481651871-ab68de25d43d is a stylish fashion/clothing image

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1461896606594-2f7e29bda6d2?q=80&w=500&auto=format&fit=crop'
WHERE slug = 'sports' AND parent_id IS NULL;
-- photo-1461896606594-2f7e29bda6d2 is a sports/fitness image

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=500&auto=format&fit=crop'
WHERE slug = 'bulgarian-traditional' AND parent_id IS NULL;
-- photo-1558618666-fcd25c85cd64 is a traditional folk/cultural image

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=500&auto=format&fit=crop'
WHERE slug = 'services' AND parent_id IS NULL;
-- photo-1521737711867-e3b97375f902 is a business services/event image;
