
-- Remove duplicate/inconsistent attributes from E-Mobility L0
-- Keep the proper-cased versions with options, remove the lowercase text versions

DELETE FROM category_attributes 
WHERE id IN (
  -- Remove lowercase 'brand' (text, no options) - keep 'Brand' (select, 16 options)
  'edfdbf77-1a18-4a14-ae32-d69c7a50ab2a',
  -- Remove lowercase 'condition' (no options) - keep 'Condition' (6 options)
  '953095bb-7ebe-40cd-8f87-d414d9912a47',
  -- Remove lowercase 'max_speed' (number) - keep 'Max Speed' (select, 6 options)
  '7632a869-1cc4-4a8c-bdab-53a5b0b4c42f',
  -- Remove lowercase 'range' (number) - keep 'Range' (select, 6 options)
  'cb7f99a5-c97a-46cd-8ebd-bb3d575f2306',
  -- Remove lowercase 'motor_power' (number) - keep 'Motor Power' (select, 9 options)
  '4209b166-ef5d-48b9-97b9-fd46f13c9ce9',
  -- Remove lowercase 'battery_capacity' (number) - covered by Battery Voltage
  '1f84589b-bdeb-4081-a5d4-1add3e8216c9',
  -- Keep 'model' as text is fine for free-form input
  -- Keep 'weight' as number is fine
  -- Remove lowercase 'model' - users can use Brand select instead
  '9b19a527-8f6a-4685-85f0-de2eda37331e'
);

-- Reorder remaining E-Mobility attributes for better UX
UPDATE category_attributes SET sort_order = 1 WHERE id = '0487d524-cd06-4154-bb3d-b735ef8484ba'; -- Condition
UPDATE category_attributes SET sort_order = 2 WHERE id = 'a64cdf96-f9d0-424d-956f-3f35d822c1b6'; -- Brand
UPDATE category_attributes SET sort_order = 3 WHERE id = '285d3652-a343-495c-aef7-81a38a4520f7'; -- Max Speed
UPDATE category_attributes SET sort_order = 4 WHERE id = 'ee690d9c-24c2-4999-a576-ea59de996047'; -- Range
UPDATE category_attributes SET sort_order = 5 WHERE id = 'f9b6729a-5736-4d00-a178-cf7e76778151'; -- Battery Voltage
UPDATE category_attributes SET sort_order = 6 WHERE id = '6f649899-2080-4420-9f8f-c9ae65c43ec9'; -- Motor Power
UPDATE category_attributes SET sort_order = 7 WHERE id = 'b76627aa-0e15-4bb9-b853-0d5ee489512b'; -- Weight
;
