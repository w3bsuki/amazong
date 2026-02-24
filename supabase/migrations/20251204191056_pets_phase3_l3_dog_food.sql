-- PETS PHASE 3: Add L3 categories for Dog Food
-- Dog Food ID: 1947fe9e-b972-4f31-ae18-2aa62e2d3a07

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  ('Dry Dog Food', 'Суха храна за кучета', 'dog-food-dry', '1947fe9e-b972-4f31-ae18-2aa62e2d3a07', NULL, 1, 'Kibble and dry dog food', 'Гранули и суха храна за кучета'),
  ('Wet Dog Food', 'Мокра храна за кучета', 'dog-food-wet', '1947fe9e-b972-4f31-ae18-2aa62e2d3a07', NULL, 2, 'Canned and wet dog food', 'Консервирана и мокра храна за кучета'),
  ('Puppy Food', 'Храна за кученца', 'dog-food-puppy', '1947fe9e-b972-4f31-ae18-2aa62e2d3a07', NULL, 3, 'Food formulated for puppies', 'Храна за кученца'),
  ('Senior Dog Food', 'Храна за възрастни кучета', 'dog-food-senior', '1947fe9e-b972-4f31-ae18-2aa62e2d3a07', NULL, 4, 'Food for older dogs', 'Храна за възрастни кучета'),
  ('Grain-Free Dog Food', 'Безглутенова храна', 'dog-food-grain-free', '1947fe9e-b972-4f31-ae18-2aa62e2d3a07', NULL, 5, 'Grain-free formulas', 'Храна без зърнени храни'),
  ('Limited Ingredient Dog Food', 'Храна с ограничени съставки', 'dog-food-limited', '1947fe9e-b972-4f31-ae18-2aa62e2d3a07', NULL, 6, 'Limited ingredient diets for sensitivities', 'Храна с ограничени съставки за чувствителни кучета'),
  ('Prescription Dog Food', 'Ветеринарна храна', 'dog-food-prescription', '1947fe9e-b972-4f31-ae18-2aa62e2d3a07', NULL, 7, 'Veterinary diet and prescription food', 'Ветеринарни диети и храна по рецепта'),
  ('Raw & Freeze-Dried Dog Food', 'Сурова и замразена храна', 'dog-food-raw', '1947fe9e-b972-4f31-ae18-2aa62e2d3a07', NULL, 8, 'Raw, freeze-dried, and dehydrated foods', 'Сурова, лиофилизирана и дехидратирана храна')
ON CONFLICT (slug) DO NOTHING;;
