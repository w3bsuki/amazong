-- Step 2: Delete L5 violations and convert to attributes
-- These are yarn types (Cotton, Wool, Acrylic, Blend) under L4 "Yarn"
-- They should be a "Material" attribute on the L4 "Yarn" category

-- First, add the Material attribute to Yarn (L4) category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_filterable, is_required, options, options_bg, sort_order)
VALUES (
  '0c65f4ba-fb8f-4577-bef5-7aaa7b26fd37', -- Yarn category ID
  'Yarn Material',
  'Материал на прежда',
  'select',
  true,
  true,
  '["Cotton", "Wool", "Acrylic", "Blend", "Silk", "Bamboo", "Cashmere", "Mohair", "Alpaca", "Merino", "Polyester", "Nylon"]'::jsonb,
  '["Памук", "Вълна", "Акрил", "Смес", "Коприна", "Бамбук", "Кашмир", "Мохер", "Алпака", "Мерино", "Полиестер", "Найлон"]'::jsonb,
  1
)
ON CONFLICT DO NOTHING;

-- Now delete the L5 categories (they're now covered by the attribute)
DELETE FROM categories 
WHERE id IN (
  '394db266-d069-4197-9da3-9a7bb8ee8157', -- Cotton Yarn
  '8525e640-a31f-44bb-b8d8-634b606a485e', -- Wool Yarn
  '401d860f-3cd3-47f8-9ee5-5880b09b5468', -- Acrylic Yarn
  '8190f7e7-b873-4b84-bc76-3fc2d6e761d3'  -- Blend Yarn
);;
