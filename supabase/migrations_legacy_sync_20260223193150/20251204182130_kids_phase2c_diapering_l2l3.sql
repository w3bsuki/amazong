
-- KIDS CATEGORY IMPROVEMENT - PHASE 2C: Diapering & Potty L2/L3 Categories
-- ================================================================

-- Parent: diapering (4e466f5b-7948-4939-87a1-e5febc83c389)

-- Add L2 categories for Diapering
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Disposable Diapers', 'Еднократни пелени', 'diaper-disposable', '4e466f5b-7948-4939-87a1-e5febc83c389', '🩲', 1),
('Cloth Diapers', 'Памучни пелени', 'diaper-cloth', '4e466f5b-7948-4939-87a1-e5febc83c389', '👶', 2),
('Wipes & Creams', 'Мокри кърпи и кремове', 'diaper-wipes', '4e466f5b-7948-4939-87a1-e5febc83c389', '🧴', 3),
('Changing Supplies', 'Аксесоари за повиване', 'diaper-changing', '4e466f5b-7948-4939-87a1-e5febc83c389', '🛏️', 4),
('Potty Training', 'Гърне и обучение', 'diaper-potty', '4e466f5b-7948-4939-87a1-e5febc83c389', '🚽', 5);
;
