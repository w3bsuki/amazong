
-- Move Rise attribute from Clothing level to specific pants/bottoms categories
-- This prevents Rise from appearing on T-Shirts and other tops

-- First, delete Rise from men-clothing and women-clothing
DELETE FROM category_attributes 
WHERE name = 'Rise' 
  AND category_id IN (
    'b1000000-0000-0000-0001-000000000001',  -- men-clothing
    'b1000000-0000-0000-0002-000000000001'   -- women-clothing
  );

-- Add Rise attribute to specific pants/bottoms categories

-- Men's Pants & Jeans
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order, created_at)
VALUES (
  gen_random_uuid(),
  'b46831a6-b62e-4a12-9778-fd124f4145e9',  -- men-pants
  'Rise',
  'Талия',
  'select',
  false,
  true,
  '["Low Rise", "Mid Rise", "High Rise"]',
  '["Ниска талия", "Средна талия", "Висока талия"]',
  3,
  NOW()
);

-- Men's Shorts
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order, created_at)
VALUES (
  gen_random_uuid(),
  '205edd39-e516-4f76-813e-6c6c1ed07d3c',  -- men-shorts
  'Rise',
  'Талия',
  'select',
  false,
  true,
  '["Low Rise", "Mid Rise", "High Rise"]',
  '["Ниска талия", "Средна талия", "Висока талия"]',
  3,
  NOW()
);

-- Women's Pants & Jeans
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order, created_at)
VALUES (
  gen_random_uuid(),
  '1fc1b4de-af21-48a2-94fd-3c1d2964eb46',  -- women-pants
  'Rise',
  'Талия',
  'select',
  false,
  true,
  '["Low Rise", "Mid Rise", "High Rise"]',
  '["Ниска талия", "Средна талия", "Висока талия"]',
  3,
  NOW()
);

-- Women's Skirts
INSERT INTO category_attributes (id, category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order, created_at)
VALUES (
  gen_random_uuid(),
  '40e10b2c-b331-4c15-a796-d3f4912b0fa5',  -- women-skirts
  'Rise',
  'Талия',
  'select',
  false,
  true,
  '["Low Rise", "Mid Rise", "High Rise"]',
  '["Ниска талия", "Средна талия", "Висока талия"]',
  3,
  NOW()
);
;
