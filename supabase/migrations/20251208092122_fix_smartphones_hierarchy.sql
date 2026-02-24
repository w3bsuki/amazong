
-- Fix smartphones hierarchy
-- Move duplicate L3-type categories under their proper L2 parents

DO $$
DECLARE
  v_smartphones_id UUID;
  v_iphone_id UUID;
  v_samsung_id UUID;
  v_pixel_id UUID;
  v_oneplus_id UUID;
  v_xiaomi_id UUID;
BEGIN
  SELECT id INTO v_smartphones_id FROM categories WHERE slug = 'smartphones';
  SELECT id INTO v_iphone_id FROM categories WHERE slug = 'smartphones-iphone' AND parent_id = v_smartphones_id;
  SELECT id INTO v_samsung_id FROM categories WHERE slug = 'smartphones-samsung' AND parent_id = v_smartphones_id;
  SELECT id INTO v_pixel_id FROM categories WHERE slug = 'smartphones-pixel' AND parent_id = v_smartphones_id;
  SELECT id INTO v_oneplus_id FROM categories WHERE slug = 'smartphones-oneplus' AND parent_id = v_smartphones_id;
  SELECT id INTO v_xiaomi_id FROM categories WHERE slug = 'smartphones-xiaomi' AND parent_id = v_smartphones_id;

  -- 1. Move iPhone variants under smartphones-iphone
  UPDATE categories 
  SET parent_id = v_iphone_id
  WHERE parent_id = v_smartphones_id
    AND slug IN (
      'iphone', 'iphones', 'apple-iphone',
      'phones-iphone', 'phones-iphone-14', 'phones-iphone-15', 'phones-iphone-se'
    );

  -- 2. Move Samsung variants under smartphones-samsung
  UPDATE categories 
  SET parent_id = v_samsung_id
  WHERE parent_id = v_smartphones_id
    AND slug LIKE '%samsung%';

  -- 3. Move Pixel variants under smartphones-pixel
  UPDATE categories 
  SET parent_id = v_pixel_id
  WHERE parent_id = v_smartphones_id
    AND slug IN ('google-pixel', 'phones-google-pixel');

  -- 4. Move OnePlus variants under smartphones-oneplus
  UPDATE categories 
  SET parent_id = v_oneplus_id
  WHERE parent_id = v_smartphones_id
    AND slug IN ('oneplus', 'oneplus-phones');

  -- 5. Move Xiaomi variants under smartphones-xiaomi
  UPDATE categories 
  SET parent_id = v_xiaomi_id
  WHERE parent_id = v_smartphones_id
    AND slug LIKE '%xiaomi%' AND slug != 'smartphones-xiaomi';

  -- 6. Create/use a "Other Brands" or move other brand phones to appropriate places
  -- For now, keep other brands (Huawei, Motorola, Nokia, etc.) as L2s since they're valid brands

END $$;

-- Verify
SELECT 'smartphones L2 count:' as info, COUNT(*) as count
FROM categories 
WHERE parent_id = (SELECT id FROM categories WHERE slug = 'smartphones');
;
