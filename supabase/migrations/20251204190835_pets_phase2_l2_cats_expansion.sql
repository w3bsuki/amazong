-- PETS PHASE 2: Expand Cats (L1) with additional L2 categories
-- Cats ID: b1fc399c-f9cb-4437-ad97-5a36467fcdd8

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  -- Additional Cat L2 categories (existing: cat-food, cat-treats, cat-toys, cat-furniture, cat-litter, cat-grooming)
  ('Cat Health & Wellness', 'Здраве и wellness за котки', 'cat-health', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', '💊', 7, 'Cat supplements, vitamins, and health products', 'Добавки, витамини и здравни продукти за котки'),
  ('Cat Collars & ID Tags', 'Нашийници и медальони за котки', 'cat-collars', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', '🏷️', 8, 'Cat collars, ID tags, and breakaway collars', 'Нашийници, медальони и предпазни нашийници'),
  ('Cat Bowls & Feeders', 'Купи и хранилки за котки', 'cat-bowls', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', '🥣', 9, 'Cat food bowls, water fountains, and automatic feeders', 'Купи за храна, фонтани за вода и автоматични хранилки'),
  ('Cat Carriers & Travel', 'Транспортни кутии и пътуване за котки', 'cat-carriers', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', '🧳', 10, 'Cat carriers, backpacks, and travel accessories', 'Транспортни кутии, раници и аксесоари за пътуване'),
  ('Cat Beds & Hideaways', 'Легла и скривалища за котки', 'cat-beds', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', '🛏️', 11, 'Cat beds, caves, heated beds, and hideaways', 'Легла, пещери, отопляеми легла и скривалища'),
  ('Cat Doors & Enclosures', 'Врати и заграждения за котки', 'cat-doors', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', '🚪', 12, 'Cat doors, flaps, and outdoor enclosures', 'Котешки врати, капаци и външни заграждения'),
  ('Cat Clothing', 'Облекло за котки', 'cat-clothing', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', '🎀', 13, 'Cat costumes, recovery suits, and clothing', 'Костюми, възстановителни костюми и облекло'),
  ('Cat Tech & GPS', 'Технологии и GPS за котки', 'cat-tech', 'b1fc399c-f9cb-4437-ad97-5a36467fcdd8', '📡', 14, 'GPS trackers, cameras, and smart cat technology', 'GPS тракери, камери и умни технологии')
ON CONFLICT (slug) DO NOTHING;;
