-- PETS PHASE 3: Add L3 categories for remaining Cat L2 categories
-- Cat Health ID: 23b04b2c-da09-41c2-a85c-3e64fd38e5a1
-- Cat Collars ID: 67a316a3-00cb-495f-8a7c-e6421c395a4c
-- Cat Bowls ID: b448503b-b937-4908-a8bc-40267b94bdbb
-- Cat Carriers ID: 78d3d530-1519-404c-bf0b-d3c55698da95
-- Cat Beds ID: 19b28051-5cc0-4d18-90bf-673f62c34a9c
-- Cat Doors ID: 3b06055d-d23c-4cf6-b800-af22a456900d
-- Cat Clothing ID: bbe584ba-4f13-460a-81e8-5a61c2dfe212
-- Cat Tech ID: 33ab6530-6efd-4f45-8d22-b70efbe6e46e

INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES
  -- Cat Health L3
  ('Cat Vitamins & Supplements', 'Витамини и добавки', 'cat-health-vitamins', '23b04b2c-da09-41c2-a85c-3e64fd38e5a1', NULL, 1, 'Multivitamins and supplements', 'Мултивитамини и добавки'),
  ('Cat Flea & Tick', 'Противопаразитни', 'cat-health-flea-tick', '23b04b2c-da09-41c2-a85c-3e64fd38e5a1', NULL, 2, 'Flea and tick prevention', 'Защита от бълхи и кърлежи'),
  ('Cat Calming & Anxiety', 'Успокояващи продукти', 'cat-health-calming', '23b04b2c-da09-41c2-a85c-3e64fd38e5a1', NULL, 3, 'Calming aids and anxiety relief', 'Успокояващи средства'),
  ('Cat Digestive Health', 'Храносмилателно здраве', 'cat-health-digestive', '23b04b2c-da09-41c2-a85c-3e64fd38e5a1', NULL, 4, 'Probiotics and digestive support', 'Пробиотици и храносмилателна подкрепа'),
  ('Cat Urinary Health', 'Уринарно здраве', 'cat-health-urinary', '23b04b2c-da09-41c2-a85c-3e64fd38e5a1', NULL, 5, 'Urinary tract health support', 'Подкрепа за уринарен тракт'),
  ('Cat First Aid', 'Първа помощ', 'cat-health-first-aid', '23b04b2c-da09-41c2-a85c-3e64fd38e5a1', NULL, 6, 'First aid supplies', 'Продукти за първа помощ'),
  
  -- Cat Collars L3
  ('Breakaway Cat Collars', 'Предпазни нашийници', 'cat-collars-breakaway', '67a316a3-00cb-495f-8a7c-e6421c395a4c', NULL, 1, 'Safety breakaway collars', 'Предпазни нашийници с откачване'),
  ('Cat ID Tags', 'Медальони', 'cat-collars-tags', '67a316a3-00cb-495f-8a7c-e6421c395a4c', NULL, 2, 'ID tags and charms', 'Медальони и украшения'),
  ('Reflective Cat Collars', 'Светлоотразителни нашийници', 'cat-collars-reflective', '67a316a3-00cb-495f-8a7c-e6421c395a4c', NULL, 3, 'Reflective and LED collars', 'Светлоотразителни и LED нашийници'),
  ('Cat Harnesses', 'Нагръдници за котки', 'cat-collars-harnesses', '67a316a3-00cb-495f-8a7c-e6421c395a4c', NULL, 4, 'Walking harnesses and leashes', 'Нагръдници и каишки за разходка'),
  ('Flea Collars for Cats', 'Противопаразитни нашийници', 'cat-collars-flea', '67a316a3-00cb-495f-8a7c-e6421c395a4c', NULL, 5, 'Flea prevention collars', 'Нашийници против бълхи'),
  
  -- Cat Bowls L3
  ('Elevated Cat Bowls', 'Повдигнати купи', 'cat-bowls-elevated', 'b448503b-b937-4908-a8bc-40267b94bdbb', NULL, 1, 'Raised feeding stations', 'Повдигнати станции за хранене'),
  ('Slow Feeder Cat Bowls', 'Бавни хранилки', 'cat-bowls-slow', 'b448503b-b937-4908-a8bc-40267b94bdbb', NULL, 2, 'Slow feed bowls', 'Бавни купи за хранене'),
  ('Automatic Cat Feeders', 'Автоматични хранилки', 'cat-bowls-automatic', 'b448503b-b937-4908-a8bc-40267b94bdbb', NULL, 3, 'Automatic and timed feeders', 'Автоматични и програмируеми хранилки'),
  ('Cat Water Fountains', 'Фонтани за вода', 'cat-bowls-fountains', 'b448503b-b937-4908-a8bc-40267b94bdbb', NULL, 4, 'Pet water fountains', 'Фонтани за вода'),
  ('Ceramic Cat Bowls', 'Керамични купи', 'cat-bowls-ceramic', 'b448503b-b937-4908-a8bc-40267b94bdbb', NULL, 5, 'Ceramic and porcelain bowls', 'Керамични и порцеланови купи'),
  
  -- Cat Carriers L3
  ('Hard-Sided Cat Carriers', 'Твърди транспортни кутии', 'cat-carriers-hard', '78d3d530-1519-404c-bf0b-d3c55698da95', NULL, 1, 'Plastic and hard-sided carriers', 'Пластмасови твърди транспортни кутии'),
  ('Soft-Sided Cat Carriers', 'Меки транспортни чанти', 'cat-carriers-soft', '78d3d530-1519-404c-bf0b-d3c55698da95', NULL, 2, 'Soft fabric carriers', 'Меки текстилни транспортни чанти'),
  ('Cat Backpack Carriers', 'Раници за котки', 'cat-carriers-backpack', '78d3d530-1519-404c-bf0b-d3c55698da95', NULL, 3, 'Bubble and backpack carriers', 'Раници за носене на котки'),
  ('Cat Strollers', 'Количка за котки', 'cat-carriers-strollers', '78d3d530-1519-404c-bf0b-d3c55698da95', NULL, 4, 'Pet strollers for cats', 'Колички за котки'),
  ('Airline Approved Cat Carriers', 'Одобрени за самолет', 'cat-carriers-airline', '78d3d530-1519-404c-bf0b-d3c55698da95', NULL, 5, 'Airline compliant carriers', 'Транспортни кутии одобрени за самолет'),
  
  -- Cat Beds L3
  ('Cat Caves & Hideaways', 'Пещери и скривалища', 'cat-beds-caves', '19b28051-5cc0-4d18-90bf-673f62c34a9c', NULL, 1, 'Enclosed beds and caves', 'Затворени легла и пещери'),
  ('Heated Cat Beds', 'Отопляеми легла', 'cat-beds-heated', '19b28051-5cc0-4d18-90bf-673f62c34a9c', NULL, 2, 'Heated and self-warming beds', 'Отопляеми и самозатоплящи се легла'),
  ('Window Cat Beds', 'Легла за прозорец', 'cat-beds-window', '19b28051-5cc0-4d18-90bf-673f62c34a9c', NULL, 3, 'Window perch beds', 'Легла за прозоречна кацалка'),
  ('Cat Mats & Blankets', 'Подложки и одеяла', 'cat-beds-mats', '19b28051-5cc0-4d18-90bf-673f62c34a9c', NULL, 4, 'Mats, blankets, and pads', 'Подложки, одеяла и дюшеци'),
  ('Orthopedic Cat Beds', 'Ортопедични легла', 'cat-beds-orthopedic', '19b28051-5cc0-4d18-90bf-673f62c34a9c', NULL, 5, 'Memory foam and orthopedic beds', 'Легла с мемори пяна'),
  
  -- Cat Doors L3
  ('Cat Door Flaps', 'Капаци за врати', 'cat-doors-flaps', '3b06055d-d23c-4cf6-b800-af22a456900d', NULL, 1, 'Pet door flaps', 'Капаци за врати'),
  ('Microchip Cat Doors', 'Врати с микрочип', 'cat-doors-microchip', '3b06055d-d23c-4cf6-b800-af22a456900d', NULL, 2, 'Microchip-activated doors', 'Врати с микрочип активиране'),
  ('Cat Outdoor Enclosures', 'Външни заграждения', 'cat-doors-enclosures', '3b06055d-d23c-4cf6-b800-af22a456900d', NULL, 3, 'Catios and outdoor enclosures', 'Котешки тераси и външни заграждения'),
  ('Cat Window Screens', 'Комарници за котки', 'cat-doors-screens', '3b06055d-d23c-4cf6-b800-af22a456900d', NULL, 4, 'Cat-proof window screens', 'Комарници безопасни за котки'),
  
  -- Cat Clothing L3
  ('Cat Recovery Suits', 'Възстановителни костюми', 'cat-clothing-recovery', 'bbe584ba-4f13-460a-81e8-5a61c2dfe212', NULL, 1, 'Post-surgery recovery suits', 'Следоперативни възстановителни костюми'),
  ('Cat Costumes', 'Костюми за котки', 'cat-clothing-costumes', 'bbe584ba-4f13-460a-81e8-5a61c2dfe212', NULL, 2, 'Holiday and Halloween costumes', 'Празнични и Хелоуин костюми'),
  ('Cat Bow Ties & Accessories', 'Папийонки и аксесоари', 'cat-clothing-bowtie', 'bbe584ba-4f13-460a-81e8-5a61c2dfe212', NULL, 3, 'Bow ties and fashion accessories', 'Папийонки и модни аксесоари'),
  
  -- Cat Tech L3
  ('Cat GPS Trackers', 'GPS тракери', 'cat-tech-gps', '33ab6530-6efd-4f45-8d22-b70efbe6e46e', NULL, 1, 'GPS collars and trackers', 'GPS нашийници и тракери'),
  ('Cat Cameras', 'Камери за котки', 'cat-tech-cameras', '33ab6530-6efd-4f45-8d22-b70efbe6e46e', NULL, 2, 'Pet cameras and monitors', 'Камери и монитори за домашни любимци'),
  ('Smart Cat Feeders', 'Умни хранилки', 'cat-tech-feeders', '33ab6530-6efd-4f45-8d22-b70efbe6e46e', NULL, 3, 'WiFi-enabled feeders', 'Хранилки с WiFi'),
  ('Smart Cat Litter Boxes', 'Умни тоалетни кутии', 'cat-tech-litter', '33ab6530-6efd-4f45-8d22-b70efbe6e46e', NULL, 4, 'Self-cleaning and smart litter boxes', 'Самопочистващи се и умни тоалетни кутии')
ON CONFLICT (slug) DO NOTHING;;
