
-- Restore L3 categories for Health, Jewelry, and Hobbies

-- Supplements & Vitamins L3 (parent: d1cdc34b-0001-4000-8000-000000000001)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Multivitamins', 'suppl-multivitamins', 'd1cdc34b-0001-4000-8000-000000000001', 'Мултивитамини', 1),
  ('Vitamin D', 'suppl-vitamin-d', 'd1cdc34b-0001-4000-8000-000000000001', 'Витамин D', 2),
  ('Vitamin C', 'suppl-vitamin-c', 'd1cdc34b-0001-4000-8000-000000000001', 'Витамин C', 3),
  ('Vitamin B Complex', 'suppl-vitamin-b', 'd1cdc34b-0001-4000-8000-000000000001', 'Витамин B комплекс', 4),
  ('Omega 3 & Fish Oils', 'suppl-omega', 'd1cdc34b-0001-4000-8000-000000000001', 'Омега 3 и рибено масло', 5),
  ('Probiotics', 'suppl-probiotics', 'd1cdc34b-0001-4000-8000-000000000001', 'Пробиотици', 6),
  ('Minerals', 'suppl-minerals', 'd1cdc34b-0001-4000-8000-000000000001', 'Минерали', 7),
  ('Herbal Supplements', 'suppl-herbal', 'd1cdc34b-0001-4000-8000-000000000001', 'Билкови добавки', 8),
  ('Collagen', 'suppl-collagen', 'd1cdc34b-0001-4000-8000-000000000001', 'Колаген', 9),
  ('Immune Support', 'suppl-immune', 'd1cdc34b-0001-4000-8000-000000000001', 'Имунна подкрепа', 10)
ON CONFLICT (slug) DO NOTHING;

-- Medical & Personal Care L3 (parent: d1cdc34b-0004-4000-8000-000000000004)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('First Aid', 'medical-first-aid', 'd1cdc34b-0004-4000-8000-000000000004', 'Първа помощ', 1),
  ('Blood Pressure Monitors', 'medical-bp', 'd1cdc34b-0004-4000-8000-000000000004', 'Апарати за кръвно', 2),
  ('Thermometers', 'medical-thermometers', 'd1cdc34b-0004-4000-8000-000000000004', 'Термометри', 3),
  ('Mobility Aids', 'medical-mobility', 'd1cdc34b-0004-4000-8000-000000000004', 'Помощни средства', 4),
  ('Pain Relief', 'medical-pain', 'd1cdc34b-0004-4000-8000-000000000004', 'Облекчаване на болка', 5),
  ('Diabetes Care', 'medical-diabetes', 'd1cdc34b-0004-4000-8000-000000000004', 'Диабетна грижа', 6),
  ('Eye Care', 'medical-eye', 'd1cdc34b-0004-4000-8000-000000000004', 'Грижа за очите', 7),
  ('Sleep Aids', 'medical-sleep', 'd1cdc34b-0004-4000-8000-000000000004', 'Помощ за сън', 8)
ON CONFLICT (slug) DO NOTHING;

-- Natural & Alternative Wellness L3 (parent: d1cdc34b-0005-4000-8000-000000000005)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Essential Oils', 'natural-oils', 'd1cdc34b-0005-4000-8000-000000000005', 'Етерични масла', 1),
  ('Aromatherapy', 'natural-aroma', 'd1cdc34b-0005-4000-8000-000000000005', 'Ароматерапия', 2),
  ('Homeopathy', 'natural-homeopathy', 'd1cdc34b-0005-4000-8000-000000000005', 'Хомеопатия', 3),
  ('Herbal Remedies', 'natural-herbal', 'd1cdc34b-0005-4000-8000-000000000005', 'Билкови средства', 4),
  ('Ayurveda', 'natural-ayurveda', 'd1cdc34b-0005-4000-8000-000000000005', 'Аюрведа', 5),
  ('CBD Products', 'natural-cbd', 'd1cdc34b-0005-4000-8000-000000000005', 'CBD продукти', 6)
ON CONFLICT (slug) DO NOTHING;

-- Watches L3 (parent: cd19f627-c51c-4728-be1c-110c515eee9d)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Luxury Watches', 'watch-luxury', 'cd19f627-c51c-4728-be1c-110c515eee9d', 'Луксозни часовници', 1),
  ('Smart Watches', 'watch-smart', 'cd19f627-c51c-4728-be1c-110c515eee9d', 'Смарт часовници', 2),
  ('Sports Watches', 'watch-sports', 'cd19f627-c51c-4728-be1c-110c515eee9d', 'Спортни часовници', 3),
  ('Casual Watches', 'watch-casual', 'cd19f627-c51c-4728-be1c-110c515eee9d', 'Ежедневни часовници', 4),
  ('Vintage Watches', 'watch-vintage', 'cd19f627-c51c-4728-be1c-110c515eee9d', 'Винтидж часовници', 5),
  ('Watch Accessories', 'watch-accessories', 'cd19f627-c51c-4728-be1c-110c515eee9d', 'Аксесоари', 6),
  ('Watch Bands', 'watch-bands', 'cd19f627-c51c-4728-be1c-110c515eee9d', 'Каишки', 7)
ON CONFLICT (slug) DO NOTHING;

-- Fine Jewelry L3 (parent: 4e320b03-947a-4dda-a6a9-0befe6072ddc)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Diamond Jewelry', 'fine-diamond', '4e320b03-947a-4dda-a6a9-0befe6072ddc', 'Диамантени бижута', 1),
  ('Gold Jewelry', 'fine-gold', '4e320b03-947a-4dda-a6a9-0befe6072ddc', 'Златни бижута', 2),
  ('Silver Jewelry', 'fine-silver', '4e320b03-947a-4dda-a6a9-0befe6072ddc', 'Сребърни бижута', 3),
  ('Pearl Jewelry', 'fine-pearl', '4e320b03-947a-4dda-a6a9-0befe6072ddc', 'Бижута с перли', 4),
  ('Gemstone Jewelry', 'fine-gemstone', '4e320b03-947a-4dda-a6a9-0befe6072ddc', 'Бижута със скъпоценни камъни', 5),
  ('Platinum Jewelry', 'fine-platinum', '4e320b03-947a-4dda-a6a9-0befe6072ddc', 'Платинени бижута', 6)
ON CONFLICT (slug) DO NOTHING;

-- Rings L3 (parent: d1dc5719-8c33-4dbf-8d75-bafa944c3797)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Engagement Rings', 'rings-engagement', 'd1dc5719-8c33-4dbf-8d75-bafa944c3797', 'Годежни пръстени', 1),
  ('Wedding Bands', 'rings-wedding', 'd1dc5719-8c33-4dbf-8d75-bafa944c3797', 'Сватбени халки', 2),
  ('Fashion Rings', 'rings-fashion', 'd1dc5719-8c33-4dbf-8d75-bafa944c3797', 'Модни пръстени', 3),
  ('Promise Rings', 'rings-promise', 'd1dc5719-8c33-4dbf-8d75-bafa944c3797', 'Обещални пръстени', 4),
  ('Eternity Rings', 'rings-eternity', 'd1dc5719-8c33-4dbf-8d75-bafa944c3797', 'Вечни пръстени', 5)
ON CONFLICT (slug) DO NOTHING;

-- Earrings L3 (parent: 38864358-b6b6-4c4c-8450-0ccae3c8483e)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Stud Earrings', 'earrings-stud', '38864358-b6b6-4c4c-8450-0ccae3c8483e', 'Обеци с камъни', 1),
  ('Hoop Earrings', 'earrings-hoop', '38864358-b6b6-4c4c-8450-0ccae3c8483e', 'Халки', 2),
  ('Drop Earrings', 'earrings-drop', '38864358-b6b6-4c4c-8450-0ccae3c8483e', 'Висящи обеци', 3),
  ('Huggie Earrings', 'earrings-huggie', '38864358-b6b6-4c4c-8450-0ccae3c8483e', 'Къси халки', 4),
  ('Chandelier Earrings', 'earrings-chandelier', '38864358-b6b6-4c4c-8450-0ccae3c8483e', 'Полилеи', 5)
ON CONFLICT (slug) DO NOTHING;

-- Musical Instruments L3 (parent: 78d2796b-c563-46d4-8e55-3b1cd281b607)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Guitars', 'music-guitars', '78d2796b-c563-46d4-8e55-3b1cd281b607', 'Китари', 1),
  ('Pianos & Keyboards', 'music-pianos', '78d2796b-c563-46d4-8e55-3b1cd281b607', 'Пиана и клавиатури', 2),
  ('Drums & Percussion', 'music-drums', '78d2796b-c563-46d4-8e55-3b1cd281b607', 'Барабани', 3),
  ('Violins & Strings', 'music-strings', '78d2796b-c563-46d4-8e55-3b1cd281b607', 'Цигулки', 4),
  ('Wind Instruments', 'music-wind', '78d2796b-c563-46d4-8e55-3b1cd281b607', 'Духови инструменти', 5),
  ('Brass Instruments', 'music-brass', '78d2796b-c563-46d4-8e55-3b1cd281b607', 'Духови инструменти', 6),
  ('DJ Equipment', 'music-dj', '78d2796b-c563-46d4-8e55-3b1cd281b607', 'DJ оборудване', 7),
  ('Recording Equipment', 'music-recording', '78d2796b-c563-46d4-8e55-3b1cd281b607', 'Записващо оборудване', 8),
  ('Music Accessories', 'music-accessories', '78d2796b-c563-46d4-8e55-3b1cd281b607', 'Аксесоари', 9)
ON CONFLICT (slug) DO NOTHING;

-- Creative Arts L3 (parent: bac93917-514e-49e4-9e49-7900df81727f)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Painting Supplies', 'arts-painting', 'bac93917-514e-49e4-9e49-7900df81727f', 'Рисуване', 1),
  ('Drawing Supplies', 'arts-drawing', 'bac93917-514e-49e4-9e49-7900df81727f', 'Чертане', 2),
  ('Sculpting', 'arts-sculpting', 'bac93917-514e-49e4-9e49-7900df81727f', 'Скулптуриране', 3),
  ('Photography', 'arts-photography', 'bac93917-514e-49e4-9e49-7900df81727f', 'Фотография', 4),
  ('Calligraphy', 'arts-calligraphy', 'bac93917-514e-49e4-9e49-7900df81727f', 'Калиграфия', 5),
  ('Canvases & Surfaces', 'arts-canvases', 'bac93917-514e-49e4-9e49-7900df81727f', 'Платна', 6)
ON CONFLICT (slug) DO NOTHING;

-- Model Building & RC L3 (parent: cdc7fe70-ce72-496d-ad5b-c7b27bb67361)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('RC Cars', 'model-rc-cars', 'cdc7fe70-ce72-496d-ad5b-c7b27bb67361', 'RC коли', 1),
  ('RC Drones', 'model-rc-drones', 'cdc7fe70-ce72-496d-ad5b-c7b27bb67361', 'RC дронове', 2),
  ('RC Planes', 'model-rc-planes', 'cdc7fe70-ce72-496d-ad5b-c7b27bb67361', 'RC самолети', 3),
  ('RC Helicopters', 'model-rc-helicopters', 'cdc7fe70-ce72-496d-ad5b-c7b27bb67361', 'RC хеликоптери', 4),
  ('RC Boats', 'model-rc-boats', 'cdc7fe70-ce72-496d-ad5b-c7b27bb67361', 'RC лодки', 5),
  ('Model Kits', 'model-kits', 'cdc7fe70-ce72-496d-ad5b-c7b27bb67361', 'Модели за сглобяване', 6),
  ('Model Trains', 'model-trains', 'cdc7fe70-ce72-496d-ad5b-c7b27bb67361', 'Модели влакове', 7)
ON CONFLICT (slug) DO NOTHING;

-- Board Games & Puzzles L3 (parent: a1ed8e40-b68d-4845-86ed-d844ca7030ad)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Strategy Games', 'tabletop-strategy', 'a1ed8e40-b68d-4845-86ed-d844ca7030ad', 'Стратегически игри', 1),
  ('Family Games', 'tabletop-family', 'a1ed8e40-b68d-4845-86ed-d844ca7030ad', 'Семейни игри', 2),
  ('Party Games', 'tabletop-party', 'a1ed8e40-b68d-4845-86ed-d844ca7030ad', 'Парти игри', 3),
  ('Card Games', 'tabletop-cards', 'a1ed8e40-b68d-4845-86ed-d844ca7030ad', 'Карти игри', 4),
  ('Jigsaw Puzzles', 'tabletop-puzzles', 'a1ed8e40-b68d-4845-86ed-d844ca7030ad', 'Пъзели', 5),
  ('Chess & Classic Games', 'tabletop-classic', 'a1ed8e40-b68d-4845-86ed-d844ca7030ad', 'Шах и класически игри', 6)
ON CONFLICT (slug) DO NOTHING;

-- Handmade & Crafts L3 (parent: eadd0397-3c7c-47a1-9dae-fcaa91ed853f)
INSERT INTO categories (name, slug, parent_id, name_bg, display_order) VALUES
  ('Knitting & Crochet', 'craft-knitting', 'eadd0397-3c7c-47a1-9dae-fcaa91ed853f', 'Плетене', 1),
  ('Sewing', 'craft-sewing', 'eadd0397-3c7c-47a1-9dae-fcaa91ed853f', 'Шиене', 2),
  ('Jewelry Making', 'craft-jewelry', 'eadd0397-3c7c-47a1-9dae-fcaa91ed853f', 'Изработка на бижута', 3),
  ('Scrapbooking', 'craft-scrapbook', 'eadd0397-3c7c-47a1-9dae-fcaa91ed853f', 'Скрапбукинг', 4),
  ('Pottery & Ceramics', 'craft-pottery', 'eadd0397-3c7c-47a1-9dae-fcaa91ed853f', 'Керамика', 5),
  ('Candle Making', 'craft-candles', 'eadd0397-3c7c-47a1-9dae-fcaa91ed853f', 'Изработка на свещи', 6),
  ('Soap Making', 'craft-soap', 'eadd0397-3c7c-47a1-9dae-fcaa91ed853f', 'Изработка на сапуни', 7),
  ('Embroidery', 'craft-embroidery', 'eadd0397-3c7c-47a1-9dae-fcaa91ed853f', 'Бродерия', 8)
ON CONFLICT (slug) DO NOTHING;
;
