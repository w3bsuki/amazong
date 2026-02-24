
-- KIDS CATEGORY IMPROVEMENT - PHASE 2B: Baby Feeding L3 Categories
-- ================================================================

-- L3 for Bottles & Nipples (4067dc1b-542c-46f4-97d3-bd6702026ce2)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Standard Bottles', 'Стандартни шишета', 'bottle-standard', '4067dc1b-542c-46f4-97d3-bd6702026ce2', 1),
('Anti-Colic Bottles', 'Антиколик шишета', 'bottle-anticolic', '4067dc1b-542c-46f4-97d3-bd6702026ce2', 2),
('Glass Bottles', 'Стъклени шишета', 'bottle-glass', '4067dc1b-542c-46f4-97d3-bd6702026ce2', 3),
('Silicone Bottles', 'Силиконови шишета', 'bottle-silicone', '4067dc1b-542c-46f4-97d3-bd6702026ce2', 4),
('Nipples & Teats', 'Биберони', 'bottle-nipples', '4067dc1b-542c-46f4-97d3-bd6702026ce2', 5),
('Bottle Accessories', 'Аксесоари за шишета', 'bottle-accessories', '4067dc1b-542c-46f4-97d3-bd6702026ce2', 6);

-- L3 for Breastfeeding (982fddda-c495-4001-81db-47a33d5f56d6)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Electric Breast Pumps', 'Електрически помпи', 'breastfeed-electric-pump', '982fddda-c495-4001-81db-47a33d5f56d6', 1),
('Manual Breast Pumps', 'Ръчни помпи', 'breastfeed-manual-pump', '982fddda-c495-4001-81db-47a33d5f56d6', 2),
('Milk Storage Bags', 'Торбички за мляко', 'breastfeed-storage', '982fddda-c495-4001-81db-47a33d5f56d6', 3),
('Nursing Pads', 'Подплънки за кърмене', 'breastfeed-pads', '982fddda-c495-4001-81db-47a33d5f56d6', 4),
('Nursing Covers', 'Покривала за кърмене', 'breastfeed-covers', '982fddda-c495-4001-81db-47a33d5f56d6', 5),
('Nipple Care', 'Грижа за зърна', 'breastfeed-nipple-care', '982fddda-c495-4001-81db-47a33d5f56d6', 6);

-- L3 for Highchairs & Boosters (b743b655-22cb-4f9b-9365-33b815a1431f)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Standard Highchairs', 'Стандартни столчета', 'highchair-standard', 'b743b655-22cb-4f9b-9365-33b815a1431f', 1),
('Portable Highchairs', 'Преносими столчета', 'highchair-portable', 'b743b655-22cb-4f9b-9365-33b815a1431f', 2),
('Booster Seats', 'Бустер седалки', 'highchair-booster', 'b743b655-22cb-4f9b-9365-33b815a1431f', 3),
('Hook-On Chairs', 'Столчета с кука', 'highchair-hookons', 'b743b655-22cb-4f9b-9365-33b815a1431f', 4);

-- L3 for Baby Food (8daf9cc8-8826-4733-9e26-1f575b6a9c9b)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Baby Purees', 'Пюрета', 'babyfood-purees', '8daf9cc8-8826-4733-9e26-1f575b6a9c9b', 1),
('Baby Cereals', 'Каши', 'babyfood-cereals', '8daf9cc8-8826-4733-9e26-1f575b6a9c9b', 2),
('Baby Snacks', 'Снаксове', 'babyfood-snacks', '8daf9cc8-8826-4733-9e26-1f575b6a9c9b', 3),
('Toddler Food', 'Храна за малки деца', 'babyfood-toddler', '8daf9cc8-8826-4733-9e26-1f575b6a9c9b', 4),
('Organic Baby Food', 'Био бебешка храна', 'babyfood-organic', '8daf9cc8-8826-4733-9e26-1f575b6a9c9b', 5);

-- L3 for Feeding Accessories (9e8a6d45-5ee5-47e8-97d2-38dabe3a9cfa)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Bibs', 'Лигавници', 'feedacc-bibs', '9e8a6d45-5ee5-47e8-97d2-38dabe3a9cfa', 1),
('Sippy Cups', 'Чаши с дръжки', 'feedacc-sippy', '9e8a6d45-5ee5-47e8-97d2-38dabe3a9cfa', 2),
('Plates & Bowls', 'Чинии и купи', 'feedacc-plates', '9e8a6d45-5ee5-47e8-97d2-38dabe3a9cfa', 3),
('Baby Utensils', 'Прибори', 'feedacc-utensils', '9e8a6d45-5ee5-47e8-97d2-38dabe3a9cfa', 4),
('Food Makers', 'Уреди за храна', 'feedacc-makers', '9e8a6d45-5ee5-47e8-97d2-38dabe3a9cfa', 5),
('Bottle Warmers', 'Уреди за затопляне', 'feedacc-warmers', '9e8a6d45-5ee5-47e8-97d2-38dabe3a9cfa', 6),
('Sterilizers', 'Стерилизатори', 'feedacc-sterilizers', '9e8a6d45-5ee5-47e8-97d2-38dabe3a9cfa', 7);

-- L3 for Formula (2eee57a5-52fc-4922-b09c-feeb58a8610e)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
('Infant Formula', 'Адаптирано мляко 0-6М', 'formula-infant', '2eee57a5-52fc-4922-b09c-feeb58a8610e', 1),
('Follow-On Formula', 'Преходно мляко 6-12М', 'formula-followon', '2eee57a5-52fc-4922-b09c-feeb58a8610e', 2),
('Toddler Formula', 'Мляко за малки деца', 'formula-toddler', '2eee57a5-52fc-4922-b09c-feeb58a8610e', 3),
('Special Needs Formula', 'Специални формули', 'formula-special', '2eee57a5-52fc-4922-b09c-feeb58a8610e', 4);
;
