
-- Remove duplicate L2 categories (keep ones with L3 children or cleaner slugs)

-- 1. Delete duplicate Ceiling Lights (keep ceiling-lights with 6 L3s)
-- First move any L3s from light-ceiling to ceiling-lights
UPDATE categories 
SET parent_id = '1a5b56db-7453-4abc-88ce-a819d05f2838'
WHERE parent_id = '1d045d41-84cc-4929-8ea9-332d0ad9a9e8';

DELETE FROM categories WHERE id = '1d045d41-84cc-4929-8ea9-332d0ad9a9e8';

-- 2. Delete duplicate Outdoor Décor (keep outdoor-decor with 6 L3s)
DELETE FROM categories WHERE id = '68188dd0-592c-4630-b982-f5a5a0f036b3';

-- 3. Delete duplicate Trash & Recycling (both have 0, keep house-trash)
DELETE FROM categories WHERE id = 'ee709b4a-b9d1-4733-92c1-fbd2eaddc837';

-- 4. Delete duplicate Bathroom Furniture (both have 0, keep bath-furniture in Bedding & Bath)
DELETE FROM categories WHERE id = 'c91ce4e0-6109-45c2-8c85-3aa5ed6420b2';

-- 5. Delete duplicate Office Furniture under Furniture (keep one under Office & School with 18 L3s)
DELETE FROM categories WHERE id = '0d205bc4-be7d-4b9b-be6b-bcfd9185e721';

-- 6. Delete duplicate Outdoor Furniture under Furniture (keep one under Garden & Outdoor with 6 L3s)
DELETE FROM categories WHERE id = '651a8cd3-6f73-44d9-b599-3186cf44284a';
;
