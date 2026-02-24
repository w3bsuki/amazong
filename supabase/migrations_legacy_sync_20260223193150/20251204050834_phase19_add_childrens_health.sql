
-- Add Children's Health subcategory under Health & Wellness
INSERT INTO categories (id, name, name_bg, slug, parent_id, display_order)
VALUES (
  'ca000000-0000-0000-0000-000000000100',
  'Children''s Health',
  'Детско здраве',
  'childrens-health',
  'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673', -- Health & Wellness
  17 -- After Men's Health
);

-- Update CBD name to include Mushrooms for clarity
UPDATE categories 
SET name = 'CBD & Mushrooms',
    name_bg = 'CBD и гъби'
WHERE slug = 'cbd-wellness';
;
