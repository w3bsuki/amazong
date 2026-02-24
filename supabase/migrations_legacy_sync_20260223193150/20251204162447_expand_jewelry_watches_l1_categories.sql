
-- ==============================================
-- JEWELRY & WATCHES EXPANSION - PART 1: L1 Categories
-- Date: December 4, 2025
-- Target: Add/Update 10 L1 categories
-- ==============================================

-- Get the parent_id for jewelry-watches
DO $$
DECLARE
    jw_parent_id UUID;
BEGIN
    SELECT id INTO jw_parent_id FROM categories WHERE slug = 'jewelry-watches';
    
    -- Delete existing L1 categories that will be replaced (keeping watches as it has good L2/L3 structure)
    -- First, let's keep existing structure but ensure we have all L1 categories
    
    -- Insert/Update L1 Categories
    INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
    VALUES 
        -- 1. Rings
        (gen_random_uuid(), 'Rings', 'Пръстени', 'jw-rings', jw_parent_id, '💍', 1),
        -- 2. Necklaces & Pendants  
        (gen_random_uuid(), 'Necklaces & Pendants', 'Колиета и медальони', 'jw-necklaces', jw_parent_id, '📿', 2),
        -- 3. Earrings
        (gen_random_uuid(), 'Earrings', 'Обеци', 'jw-earrings', jw_parent_id, '✨', 3),
        -- 4. Bracelets & Bangles
        (gen_random_uuid(), 'Bracelets & Bangles', 'Гривни', 'jw-bracelets', jw_parent_id, '💫', 4),
        -- 5. Men's Jewelry (NEW)
        (gen_random_uuid(), 'Men''s Jewelry', 'Мъжки бижута', 'jw-mens', jw_parent_id, '🧔', 8),
        -- 6. Vintage & Estate (NEW)
        (gen_random_uuid(), 'Vintage & Estate Jewelry', 'Винтидж и наследствени бижута', 'jw-vintage-estate', jw_parent_id, '🏺', 9),
        -- 7. Jewelry Supplies & Care
        (gen_random_uuid(), 'Jewelry Supplies & Care', 'Материали и грижа за бижута', 'jw-supplies', jw_parent_id, '🛠️', 10)
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        name_bg = EXCLUDED.name_bg,
        icon = EXCLUDED.icon,
        display_order = EXCLUDED.display_order;
        
END $$;

-- Update existing L1 categories with better icons/order
UPDATE categories SET display_order = 5, icon = '⌚' WHERE slug = 'watches';
UPDATE categories SET display_order = 6, icon = '👑', name = 'Fine Jewelry', name_bg = 'Скъпоценни бижута' WHERE slug = 'fine-jewelry';
UPDATE categories SET display_order = 7, icon = '🎭', name = 'Fashion Jewelry', name_bg = 'Модни бижута' WHERE slug = 'costume-jewelry';

-- Remove old L1 categories that are being consolidated
UPDATE categories SET display_order = 9999, name = '[DEPRECATED] ' || name WHERE slug IN ('engagement-wedding', 'loose-gems', 'jewelry-care') AND slug != 'jw-supplies';
;
