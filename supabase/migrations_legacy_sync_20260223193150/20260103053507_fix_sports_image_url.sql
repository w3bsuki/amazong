
-- Fix broken sports image URL with a verified working Unsplash photo
-- Using a popular gym/sports photo that is definitely available
UPDATE categories 
SET image_url = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=500&auto=format&fit=crop'
WHERE slug = 'sports';
;
