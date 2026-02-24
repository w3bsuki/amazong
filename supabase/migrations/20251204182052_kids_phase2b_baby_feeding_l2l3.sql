
-- KIDS CATEGORY IMPROVEMENT - PHASE 2B: Baby Feeding L2/L3 Categories
-- ================================================================

-- Parent: baby-feeding (eaf2abb5-5395-486b-9b1a-abafeea044f4)

-- Add L2 categories for Baby Feeding
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order) VALUES
('Bottles & Nipples', 'Шишета и биберони', 'feed-bottles', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', '🍼', 1),
('Breastfeeding', 'Кърмене', 'feed-breastfeeding', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', '🤱', 2),
('Highchairs & Boosters', 'Столчета за хранене', 'feed-highchairs', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', '🪑', 3),
('Baby Food', 'Бебешка храна', 'feed-babyfood', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', '🥣', 4),
('Feeding Accessories', 'Аксесоари за хранене', 'feed-accessories', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', '🥄', 5),
('Formula', 'Адаптирано мляко', 'feed-formula', 'eaf2abb5-5395-486b-9b1a-abafeea044f4', '🥛', 6);
;
