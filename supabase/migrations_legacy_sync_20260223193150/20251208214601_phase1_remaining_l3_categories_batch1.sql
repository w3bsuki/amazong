
-- Phase 1: Add remaining L3 categories - Batch 1
-- Accessories, Audio, and Cameras remaining L2s

-- Memory Cards L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['SD Cards', 'MicroSD Cards', 'CF Cards', 'CFexpress Cards', 'XQD Cards', 'Memory Stick']),
  unnest(ARRAY['SD карти', 'MicroSD карти', 'CF карти', 'CFexpress карти', 'XQD карти', 'Memory Stick']),
  unnest(ARRAY['acc-sd-cards', 'acc-microsd-cards', 'acc-cf-cards', 'acc-cfexpress-cards', 'acc-xqd-cards', 'acc-memory-stick']),
  (SELECT id FROM categories WHERE slug = 'acc-memory-cards'),
  'Layers'
ON CONFLICT (slug) DO NOTHING;

-- Mounts & Stands L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Phone Mounts', 'Tablet Stands', 'Monitor Arms', 'Laptop Stands', 'TV Mounts', 'Camera Mounts']),
  unnest(ARRAY['Стойки за телефон', 'Стойки за таблет', 'Рамена за монитор', 'Стойки за лаптоп', 'Стойки за ТВ', 'Стойки за камера']),
  unnest(ARRAY['acc-phone-mounts', 'acc-tablet-stands', 'acc-monitor-arms', 'acc-laptop-stands-new', 'acc-tv-mounts', 'acc-camera-mounts']),
  (SELECT id FROM categories WHERE slug = 'acc-mounts'),
  'Maximize'
ON CONFLICT (slug) DO NOTHING;

-- Power Banks L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['10000mAh & Under', '10000-20000mAh', '20000mAh & Above', 'Solar Power Banks', 'MagSafe Power Banks', 'Laptop Power Banks']),
  unnest(ARRAY['10000mAh и под', '10000-20000mAh', '20000mAh и над', 'Соларни', 'MagSafe', 'За лаптоп']),
  unnest(ARRAY['acc-pb-10k-under', 'acc-pb-10k-20k', 'acc-pb-20k-plus', 'acc-pb-solar', 'acc-pb-magsafe', 'acc-pb-laptop']),
  (SELECT id FROM categories WHERE slug = 'acc-power-banks'),
  'BatteryCharging'
ON CONFLICT (slug) DO NOTHING;

-- Audio Accessories L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Ear Tips', 'Headphone Pads', 'Audio Cables', 'DACs & Amps', 'Headphone Stands', 'Cases & Pouches']),
  unnest(ARRAY['Тапи за уши', 'Възглавнички', 'Аудио кабели', 'DAC и усилватели', 'Стойки за слушалки', 'Калъфи и торбички']),
  unnest(ARRAY['audio-ear-tips', 'audio-headphone-pads', 'audio-cables-new', 'audio-dacs-amps', 'audio-headphone-stands', 'audio-cases-pouches']),
  (SELECT id FROM categories WHERE slug = 'audio-accessories-new'),
  'Headphones'
ON CONFLICT (slug) DO NOTHING;

-- Home Speakers L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Bookshelf Speakers', 'Floor Standing', 'Subwoofers', 'Center Channel', 'In-Wall Speakers', 'In-Ceiling Speakers']),
  unnest(ARRAY['Рафтови тонколони', 'Подови тонколони', 'Субуфери', 'Централен канал', 'Вградени в стена', 'Вградени в таван']),
  unnest(ARRAY['audio-bookshelf-speakers', 'audio-floor-standing', 'audio-subwoofers', 'audio-center-channel', 'audio-in-wall', 'audio-in-ceiling']),
  (SELECT id FROM categories WHERE slug = 'audio-home-speakers'),
  'Speaker'
ON CONFLICT (slug) DO NOTHING;

-- Home Theater L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['5.1 Systems', '7.1 Systems', 'Atmos Systems', 'AV Receivers', 'Projectors', 'Projection Screens']),
  unnest(ARRAY['5.1 системи', '7.1 системи', 'Atmos системи', 'AV ресивъри', 'Проектори', 'Екрани за проектор']),
  unnest(ARRAY['audio-51-systems', 'audio-71-systems', 'audio-atmos-systems', 'audio-av-receivers', 'audio-projectors-new', 'audio-projection-screens']),
  (SELECT id FROM categories WHERE slug = 'home-theater-audio'),
  'Tv'
ON CONFLICT (slug) DO NOTHING;

-- MP3 Players L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['iPod Classic', 'iPod Touch', 'iPod Nano', 'Hi-Fi Players', 'Sport MP3 Players']),
  unnest(ARRAY['iPod Classic', 'iPod Touch', 'iPod Nano', 'Hi-Fi плейъри', 'Спортни MP3 плейъри']),
  unnest(ARRAY['audio-ipod-classic', 'audio-ipod-touch', 'audio-ipod-nano', 'audio-hifi-players', 'audio-sport-mp3']),
  (SELECT id FROM categories WHERE slug = 'audio-mp3'),
  'Music'
ON CONFLICT (slug) DO NOTHING;

-- Portable Speakers L3 subcategories (for audio-portable-speakers)
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Mini Speakers', 'Party Speakers', 'Outdoor Speakers', 'Waterproof Speakers', 'Smart Portable Speakers']),
  unnest(ARRAY['Мини тонколони', 'Парти тонколони', 'Външни тонколони', 'Водоустойчиви тонколони', 'Смарт портативни тонколони']),
  unnest(ARRAY['audio-mini-speakers', 'audio-party-speakers', 'audio-outdoor-speakers', 'audio-waterproof-speakers', 'audio-smart-portable']),
  (SELECT id FROM categories WHERE slug = 'audio-portable-speakers'),
  'Speaker'
ON CONFLICT (slug) DO NOTHING;

-- Digital Cameras L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Entry Level DSLR', 'Advanced DSLR', 'Professional DSLR', 'Full Frame Mirrorless', 'APS-C Mirrorless', 'MFT Mirrorless']),
  unnest(ARRAY['Начално ниво DSLR', 'Напреднали DSLR', 'Професионални DSLR', 'Full Frame Mirrorless', 'APS-C Mirrorless', 'MFT Mirrorless']),
  unnest(ARRAY['cam-entry-dslr', 'cam-advanced-dslr', 'cam-pro-dslr', 'cam-ff-mirrorless', 'cam-apsc-mirrorless', 'cam-mft-mirrorless']),
  (SELECT id FROM categories WHERE slug = 'elec-digital-cameras'),
  'Camera'
ON CONFLICT (slug) DO NOTHING;

-- Film Photography L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['35mm Film Cameras', 'Medium Format Film', 'Large Format Film', '35mm Film Rolls', '120 Film Rolls', 'Film Developing']),
  unnest(ARRAY['35mm филмови камери', 'Среден формат филмови', 'Голям формат филмови', '35mm филми', '120 филми', 'Проявяване']),
  unnest(ARRAY['cam-35mm-film', 'cam-medium-format-film', 'cam-large-format-film', 'cam-35mm-film-rolls', 'cam-120-film-rolls', 'cam-film-developing']),
  (SELECT id FROM categories WHERE slug = 'film-photography'),
  'Film'
ON CONFLICT (slug) DO NOTHING;

-- Instant Cameras L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Instax Mini', 'Instax Wide', 'Instax Square', 'Polaroid Now', 'Polaroid Go', 'Instant Film Packs']),
  unnest(ARRAY['Instax Mini', 'Instax Wide', 'Instax Square', 'Polaroid Now', 'Polaroid Go', 'Моментални филми']),
  unnest(ARRAY['cam-instax-mini', 'cam-instax-wide', 'cam-instax-square', 'cam-polaroid-now', 'cam-polaroid-go', 'cam-instant-film-packs']),
  (SELECT id FROM categories WHERE slug = 'cameras-instant'),
  'Camera'
ON CONFLICT (slug) DO NOTHING;

-- Point & Shoot L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Premium Compact', 'Travel Zoom', 'Rugged Compact', 'Vlogging Cameras', 'Budget Compact']),
  unnest(ARRAY['Премиум компактни', 'Пътнически зум', 'Здрави компактни', 'Влогинг камери', 'Бюджетни компактни']),
  unnest(ARRAY['cam-premium-compact', 'cam-travel-zoom', 'cam-rugged-compact', 'cam-vlogging', 'cam-budget-compact']),
  (SELECT id FROM categories WHERE slug = 'cameras-compact'),
  'Camera'
ON CONFLICT (slug) DO NOTHING;

-- Studio Equipment L3 subcategories
INSERT INTO categories (name, name_bg, slug, parent_id, icon)
SELECT 
  unnest(ARRAY['Studio Strobes', 'Continuous Lighting', 'Light Modifiers', 'Backdrops', 'Studio Stands', 'Studio Accessories']),
  unnest(ARRAY['Студийни светкавици', 'Постоянно осветление', 'Модификатори', 'Фонове', 'Студийни стойки', 'Студийни аксесоари']),
  unnest(ARRAY['cam-studio-strobes', 'cam-continuous-lighting', 'cam-light-modifiers', 'cam-backdrops', 'cam-studio-stands', 'cam-studio-accessories']),
  (SELECT id FROM categories WHERE slug = 'studio-equip'),
  'Lightbulb'
ON CONFLICT (slug) DO NOTHING;
;
