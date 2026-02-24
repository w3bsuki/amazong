
-- =====================================================
-- HOBBIES PART 8: Add Creative Arts L1 Category
-- =====================================================

-- First add the Creative Arts L1 category
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order)
SELECT 'Creative Arts', 'Творчески изкуства', 'hobby-creative-arts', 
  (SELECT id FROM categories WHERE slug = 'hobbies'), '🎨', 11
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bg = EXCLUDED.name_bg;

-- Ensure parent_id is set correctly for Creative Arts L2 categories
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'hobby-creative-arts')
WHERE slug IN ('creative-painting', 'creative-photography', 'creative-calligraphy', 'creative-sculpting', 'creative-digital', 'creative-journaling');
;
