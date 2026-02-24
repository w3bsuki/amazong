-- PETS PHASE 2: Add L2 categories for Horses
-- Horses ID: 5a237224-9bc0-42f7-bf2d-4747cbe1bc1b

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  ('Horse Feed & Supplements', 'Храна и добавки за коне', 'horse-feed', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '🌾', 1, 'Horse feed, grains, and nutritional supplements', 'Храна за коне, зърнени храни и хранителни добавки'),
  ('Horse Treats', 'Лакомства за коне', 'horse-treats', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '🍎', 2, 'Horse treats and reward snacks', 'Лакомства и награди за коне'),
  ('Horse Tack & Saddles', 'Сбруя и седла', 'horse-tack', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '🐴', 3, 'Saddles, bridles, halters, and tack', 'Седла, юзди, оглавници и сбруя'),
  ('Horse Blankets & Sheets', 'Одеяла и покривала за коне', 'horse-blankets', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '🛡️', 4, 'Turnout blankets, stable blankets, and sheets', 'Външни одеяла, одеяла за обора и покривала'),
  ('Horse Grooming', 'Грижа за коне', 'horse-grooming', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '✨', 5, 'Brushes, shampoos, and grooming supplies', 'Четки, шампоани и продукти за грижа'),
  ('Horse Health & First Aid', 'Здраве и първа помощ за коне', 'horse-health', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '💊', 6, 'Medications, wound care, and supplements', 'Медикаменти, грижа за рани и добавки'),
  ('Horse Boots & Wraps', 'Ботуши и бандажи за коне', 'horse-boots', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '👢', 7, 'Leg boots, polo wraps, and hoof boots', 'Ботуши за крака, поло бандажи и ботуши за копита'),
  ('Horse Farrier & Hoof Care', 'Ковачество и грижа за копита', 'horse-hoof', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '🔨', 8, 'Hoof picks, rasps, and farrier supplies', 'Инструменти за копита, пили и ковашки продукти'),
  ('Horse Riding Apparel', 'Облекло за езда', 'horse-apparel', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '🎩', 9, 'Helmets, boots, breeches, and riding wear', 'Каски, ботуши, брич панталони и облекло за езда'),
  ('Horse Stable & Barn', 'Обор и плевня', 'horse-stable', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '🏠', 10, 'Stall mats, buckets, and barn supplies', 'Подложки за бокс, кофи и продукти за обора'),
  ('Horse Trailers & Transport', 'Ремаркета и транспорт', 'horse-transport', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '🚛', 11, 'Trailer accessories and transport equipment', 'Аксесоари за ремаркета и транспортно оборудване'),
  ('Horse Toys & Enrichment', 'Играчки и забавления', 'horse-toys', '5a237224-9bc0-42f7-bf2d-4747cbe1bc1b', '⚽', 12, 'Horse toys, lick mats, and enrichment', 'Играчки за коне, лижещи подложки и забавления')
ON CONFLICT (slug) DO NOTHING;;
