
-- =====================================================
-- HOME & KITCHEN PART 1: Cleanup & L1 Restructuring
-- =====================================================

-- Get Home L0 ID
DO $$
DECLARE
  home_id UUID;
BEGIN
  SELECT id INTO home_id FROM categories WHERE slug = 'home';

  -- Mark duplicates as deprecated (keep the furn- prefixed ones)
  UPDATE categories SET name = '[DUPLICATE] ' || name, display_order = 9990 
  WHERE slug IN ('sofas', 'tables', 'chairs', 'beds') 
  AND parent_id = (SELECT id FROM categories WHERE slug = 'furniture');

  -- Update L1 display orders and icons
  UPDATE categories SET display_order = 1, icon = '🛋️' WHERE slug = 'furniture';
  UPDATE categories SET display_order = 2, icon = '🍳' WHERE slug = 'kitchen-dining';
  UPDATE categories SET display_order = 3, icon = '🛏️' WHERE slug = 'bedding-bath';
  UPDATE categories SET display_order = 4, icon = '💡' WHERE slug = 'lighting';
  UPDATE categories SET display_order = 5, icon = '🖼️' WHERE slug = 'home-decor';
  UPDATE categories SET display_order = 6, icon = '🧹' WHERE slug = 'household';
  UPDATE categories SET display_order = 7, icon = '📦' WHERE slug = 'home-storage' OR slug = 'furn-storage';
  UPDATE categories SET display_order = 10, icon = '📝' WHERE slug = 'home-office';
  UPDATE categories SET display_order = 11, icon = '🌱' WHERE slug = 'garden-outdoor';

  -- Add missing L1 categories
  INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
  VALUES 
    ('Storage & Organization', 'Съхранение и организация', 'home-storage', home_id, '📦', 7),
    ('Climate Control', 'Климатизация', 'home-climate', home_id, '❄️', 8),
    ('Home Improvement', 'Ремонт и подобрения', 'home-improvement', home_id, '🔨', 9)
  ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name, 
    name_bg = EXCLUDED.name_bg,
    display_order = EXCLUDED.display_order,
    icon = EXCLUDED.icon;

END $$;
;
