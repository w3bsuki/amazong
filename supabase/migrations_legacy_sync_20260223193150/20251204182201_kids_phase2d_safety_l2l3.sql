
-- KIDS CATEGORY IMPROVEMENT - PHASE 2D: Baby Safety & Health L2/L3 Categories
-- ================================================================

-- Parent: baby-safety (72b7e068-0259-4037-8aa8-8d8f733ec83e)

-- Add L2 categories for Baby Safety
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Baby Monitors', 'Бебефони', 'safety-monitors', '72b7e068-0259-4037-8aa8-8d8f733ec83e', '📹', 1),
('Childproofing', 'Обезопасяване', 'safety-childproof', '72b7e068-0259-4037-8aa8-8d8f733ec83e', '🔒', 2),
('Health & Wellness', 'Здраве и грижа', 'safety-health', '72b7e068-0259-4037-8aa8-8d8f733ec83e', '🩺', 3),
('Baby Grooming', 'Бебешка грижа', 'safety-grooming', '72b7e068-0259-4037-8aa8-8d8f733ec83e', '🛁', 4),
('Sun & Insect Protection', 'Слънце и насекоми', 'safety-sun', '72b7e068-0259-4037-8aa8-8d8f733ec83e', '☀️', 5);
;
