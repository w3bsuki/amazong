
-- KIDS CATEGORY IMPROVEMENT - PHASE 2E: Nursery & Furniture L2/L3 Categories
-- ================================================================

-- Parent: nursery (ff55aca1-5110-429a-9f15-42eba84da9d7)

-- Add L2 categories for Nursery
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Cribs & Bassinets', 'Креватчета и кошчета', 'nursery-cribs', 'ff55aca1-5110-429a-9f15-42eba84da9d7', '🛏️', 1),
('Mattresses & Bedding', 'Матраци и спално бельо', 'nursery-bedding', 'ff55aca1-5110-429a-9f15-42eba84da9d7', '🛌', 2),
('Nursery Furniture', 'Мебели за детска стая', 'nursery-furniture', 'ff55aca1-5110-429a-9f15-42eba84da9d7', '🪑', 3),
('Nursery Décor', 'Декорация', 'nursery-decor', 'ff55aca1-5110-429a-9f15-42eba84da9d7', '🎨', 4),
('Kids Bedroom', 'Детска спалня', 'nursery-kids-bedroom', 'ff55aca1-5110-429a-9f15-42eba84da9d7', '🏠', 5);
;
