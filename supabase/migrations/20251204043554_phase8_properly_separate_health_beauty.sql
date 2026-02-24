
-- ============================================
-- PROPERLY SEPARATE HEALTH FROM BEAUTY
-- ============================================

-- 1. Restore the Health L0 category
UPDATE categories 
SET name = 'Health & Wellness',
    name_bg = 'Здраве и уелнес',
    display_order = 5,
    parent_id = NULL
WHERE slug = 'health-wellness';

-- 2. Move Health subcategory content to the L0 Health
-- The health-wellness-sub has all the good health stuff (supplements, vitamins, etc)
-- Move its children to the restored Health L0
UPDATE categories 
SET parent_id = 'd1cdc34b-dc6d-42fc-bab4-47e3cbd3a673' -- health-wellness L0
WHERE parent_id = 'a0000000-0000-0000-0000-000000000011'; -- health-wellness-sub

-- 3. Deprecate the health-wellness-sub (it was a subcategory under beauty)
UPDATE categories 
SET name = '[MOVED] Health & Wellness Sub',
    name_bg = '[ПРЕМЕСТЕНО] Здраве подкатегория',
    display_order = 9998
WHERE id = 'a0000000-0000-0000-0000-000000000011';

-- 4. Rename Beauty to be just Beauty/Cosmetics
UPDATE categories 
SET name = 'Beauty & Cosmetics',
    name_bg = 'Красота и козметика',
    slug = 'beauty',
    display_order = 6
WHERE slug = 'beauty-health';
;
