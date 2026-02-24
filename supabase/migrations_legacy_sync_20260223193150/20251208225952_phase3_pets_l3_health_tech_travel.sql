
-- Phase 3.3.5: Pets L3 Categories - Health, Tech, Travel

-- Flea & Tick Prevention L3 (parent: flea-tick-prevention)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Topical Treatments', 'Oral Treatments', 'Collars', 'Sprays', 'Shampoos', 'Home Sprays']),
  unnest(ARRAY['flea-topical', 'flea-oral', 'flea-collars', 'flea-sprays', 'flea-shampoo', 'flea-home']),
  (SELECT id FROM categories WHERE slug = 'flea-tick-prevention'),
  unnest(ARRAY['Капки', 'Таблетки', 'Нашийници', 'Спрейове', 'Шампоани', 'За дома']),
  '🐜'
ON CONFLICT (slug) DO NOTHING;

-- Heartworm Prevention L3 (parent: heartworm-prevention)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Monthly Tablets', 'Chewables', 'Injectable', 'Topical']),
  unnest(ARRAY['heart-tablet', 'heart-chew', 'heart-inject', 'heart-topical']),
  (SELECT id FROM categories WHERE slug = 'heartworm-prevention'),
  unnest(ARRAY['Месечни таблетки', 'За дъвчене', 'Инжекции', 'Капки']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- OTC Medications L3 (parent: otc-medications)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pain Relief', 'Allergy Relief', 'Digestive Aid', 'Eye Care', 'Ear Care', 'Skin Care']),
  unnest(ARRAY['otc-pain', 'otc-allergy', 'otc-digest', 'otc-eye', 'otc-ear', 'otc-skin']),
  (SELECT id FROM categories WHERE slug = 'otc-medications'),
  unnest(ARRAY['Обезболяващи', 'Антиалергични', 'За храносмилане', 'За очи', 'За уши', 'За кожа']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- Pet First Aid L3 (parent: pet-first-aid-supplies)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['First Aid Kits', 'Bandages', 'Antiseptics', 'Wound Spray', 'Styptic Powder', 'Emergency Blankets']),
  unnest(ARRAY['aid-kits', 'aid-bandage', 'aid-antisep', 'aid-spray', 'aid-styptic', 'aid-blanket']),
  (SELECT id FROM categories WHERE slug = 'pet-first-aid-supplies'),
  unnest(ARRAY['Комплекти', 'Превръзки', 'Антисептици', 'Спрей за рани', 'Кръвоспиращ прах', 'Одеяла']),
  '🩹'
ON CONFLICT (slug) DO NOTHING;

-- Prescription Medications L3 (parent: prescription-meds)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Antibiotics', 'Anti-Inflammatory', 'Anxiety Medications', 'Thyroid Medications', 'Heart Medications']),
  unnest(ARRAY['rx-antibio', 'rx-inflam', 'rx-anxiety', 'rx-thyroid', 'rx-heart']),
  (SELECT id FROM categories WHERE slug = 'prescription-meds'),
  unnest(ARRAY['Антибиотици', 'Противовъзпалителни', 'За тревожност', 'За щитовидна', 'За сърце']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- Supplements & Vitamins L3 (parent: pet-supplements-vitamins)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Joint Supplements', 'Skin & Coat', 'Probiotics', 'Multivitamins', 'Calming Supplements', 'Senior Supplements']),
  unnest(ARRAY['supp-joint', 'supp-skin', 'supp-probio', 'supp-multi', 'supp-calm', 'supp-senior']),
  (SELECT id FROM categories WHERE slug = 'pet-supplements-vitamins'),
  unnest(ARRAY['За стави', 'За кожа и козина', 'Пробиотици', 'Мултивитамини', 'Успокояващи', 'За възрастни']),
  '💊'
ON CONFLICT (slug) DO NOTHING;

-- Memorial Frames & Art L3 (parent: memorial-frames)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Photo Frames', 'Canvas Prints', 'Digital Portraits', 'Shadow Boxes']),
  unnest(ARRAY['mem-frames', 'mem-canvas', 'mem-digital', 'mem-shadow']),
  (SELECT id FROM categories WHERE slug = 'memorial-frames'),
  unnest(ARRAY['Рамки', 'Канава', 'Дигитални портрети', 'Shadow Boxes']),
  '🖼️'
ON CONFLICT (slug) DO NOTHING;

-- Memorial Jewelry L3 (parent: pet-memorial-jewelry)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Necklaces', 'Bracelets', 'Rings', 'Keychains', 'Ash Holders']),
  unnest(ARRAY['memj-necklace', 'memj-bracelet', 'memj-ring', 'memj-keychain', 'memj-ash']),
  (SELECT id FROM categories WHERE slug = 'pet-memorial-jewelry'),
  unnest(ARRAY['Колиета', 'Гривни', 'Пръстени', 'Ключодържатели', 'За пепел']),
  '💎'
ON CONFLICT (slug) DO NOTHING;

-- Memorial Stones & Markers L3 (parent: memorial-stones)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Garden Stones', 'Grave Markers', 'Engraved Stones', 'Solar Stones']),
  unnest(ARRAY['stone-garden', 'stone-grave', 'stone-engrave', 'stone-solar']),
  (SELECT id FROM categories WHERE slug = 'memorial-stones'),
  unnest(ARRAY['Градински', 'Надгробни', 'Гравирани', 'Соларни']),
  '🪦'
ON CONFLICT (slug) DO NOTHING;

-- Paw Print Kits L3 (parent: paw-print-kits)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Ink Paw Prints', 'Clay Paw Prints', 'Framed Paw Prints', 'Ornament Kits']),
  unnest(ARRAY['paw-ink', 'paw-clay', 'paw-framed', 'paw-ornament']),
  (SELECT id FROM categories WHERE slug = 'paw-print-kits'),
  unnest(ARRAY['С мастило', 'От глина', 'В рамка', 'Орнаменти']),
  '🐾'
ON CONFLICT (slug) DO NOTHING;

-- Pet Caskets L3 (parent: pet-caskets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Small Caskets', 'Medium Caskets', 'Large Caskets', 'Biodegradable']),
  unnest(ARRAY['casket-small', 'casket-medium', 'casket-large', 'casket-bio']),
  (SELECT id FROM categories WHERE slug = 'pet-caskets'),
  unnest(ARRAY['Малки', 'Средни', 'Големи', 'Биоразградими']),
  '⚰️'
ON CONFLICT (slug) DO NOTHING;

-- Pet Urns L3 (parent: pet-urns)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Ceramic Urns', 'Wood Urns', 'Metal Urns', 'Photo Urns', 'Biodegradable Urns']),
  unnest(ARRAY['urn-ceramic', 'urn-wood', 'urn-metal', 'urn-photo', 'urn-bio']),
  (SELECT id FROM categories WHERE slug = 'pet-urns'),
  unnest(ARRAY['Керамични', 'Дървени', 'Метални', 'С снимка', 'Биоразградими']),
  '⚱️'
ON CONFLICT (slug) DO NOTHING;

-- GPS Trackers & Location L3 (parent: pet-gps-trackers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['GPS Collars', 'GPS Tags', 'Activity Trackers', 'Fence Trackers']),
  unnest(ARRAY['gps-collars', 'gps-tags', 'gps-activity', 'gps-fence']),
  (SELECT id FROM categories WHERE slug = 'pet-gps-trackers'),
  unnest(ARRAY['GPS нашийници', 'GPS медальони', 'За активност', 'За ограда']),
  '📍'
ON CONFLICT (slug) DO NOTHING;

-- Health Monitors & Wearables L3 (parent: pet-health-monitors)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Heart Rate Monitors', 'Sleep Trackers', 'Calorie Trackers', 'Temperature Monitors']),
  unnest(ARRAY['monitor-heart', 'monitor-sleep', 'monitor-calorie', 'monitor-temp']),
  (SELECT id FROM categories WHERE slug = 'pet-health-monitors'),
  unnest(ARRAY['Пулс', 'Сън', 'Калории', 'Температура']),
  '⌚'
ON CONFLICT (slug) DO NOTHING;

-- Pet Apps & Software L3 (parent: pet-apps)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Health Apps', 'Training Apps', 'Lost Pet Apps', 'Pet Social Apps']),
  unnest(ARRAY['app-health', 'app-training', 'app-lost', 'app-social']),
  (SELECT id FROM categories WHERE slug = 'pet-apps'),
  unnest(ARRAY['За здраве', 'За обучение', 'За загубени', 'Социални']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Pet Cameras L3 (parent: pet-cameras)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Indoor Cameras', 'Outdoor Cameras', 'Treat Cameras', 'Two-Way Audio', 'Night Vision']),
  unnest(ARRAY['cam-indoor', 'cam-outdoor', 'cam-treat', 'cam-audio', 'cam-night']),
  (SELECT id FROM categories WHERE slug = 'pet-cameras'),
  unnest(ARRAY['За вътре', 'За навън', 'С лакомства', 'Двупосочен звук', 'Нощно виждане']),
  '📹'
ON CONFLICT (slug) DO NOTHING;

-- Smart Feeders & Waterers L3 (parent: smart-feeders)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Automatic Feeders', 'Portion Control', 'Camera Feeders', 'Pet Fountains']),
  unnest(ARRAY['smart-auto', 'smart-portion', 'smart-camera', 'smart-fountain']),
  (SELECT id FROM categories WHERE slug = 'smart-feeders'),
  unnest(ARRAY['Автоматични', 'С порции', 'С камера', 'Фонтани']),
  '🍽️'
ON CONFLICT (slug) DO NOTHING;

-- Smart Pet Doors L3 (parent: smart-pet-doors)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Microchip Doors', 'RFID Doors', 'App Controlled', 'Curfew Doors']),
  unnest(ARRAY['door-chip', 'door-rfid', 'door-app', 'door-curfew']),
  (SELECT id FROM categories WHERE slug = 'smart-pet-doors'),
  unnest(ARRAY['С микрочип', 'RFID', 'С апликация', 'С часовник']),
  '🚪'
ON CONFLICT (slug) DO NOTHING;
;
