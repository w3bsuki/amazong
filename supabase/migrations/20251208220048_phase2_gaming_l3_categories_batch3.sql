-- Phase 2.2: Gaming L3 Categories - Batch 3: Gaming Furniture, VR, Board Games, TCG, Streaming
-- Target: Add L3 children to remaining Gaming L2 categories

-- =====================================================
-- GAMING FURNITURE L3 CATEGORIES
-- =====================================================

-- Gaming Chairs (gaming-chairs)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Racing Style Chairs', 'Ergonomic Chairs', 'Rocker Chairs', 'Bean Bag Chairs', 'Floor Chairs', 'Secretlab Chairs', 'Budget Gaming Chairs', 'Premium Gaming Chairs']),
  unnest(ARRAY['gchair-racing', 'gchair-ergonomic', 'gchair-rocker', 'gchair-beanbag', 'gchair-floor', 'gchair-secretlab', 'gchair-budget', 'gchair-premium']),
  (SELECT id FROM categories WHERE slug = 'gaming-chairs'),
  unnest(ARRAY['Състезателни столове', 'Ергономични столове', 'Люлеещи столове', 'Пуф столове', 'Подови столове', 'Secretlab столове', 'Бюджетни гейминг столове', 'Премиум гейминг столове']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Desks (gaming-desks)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Standard Gaming Desks', 'L-Shaped Desks', 'Standing Desks', 'Corner Desks', 'Small Gaming Desks', 'RGB Gaming Desks', 'Racing Style Desks']),
  unnest(ARRAY['gdesk-standard', 'gdesk-lshaped', 'gdesk-standing', 'gdesk-corner', 'gdesk-small', 'gdesk-rgb', 'gdesk-racing']),
  (SELECT id FROM categories WHERE slug = 'gaming-desks'),
  unnest(ARRAY['Стандартни гейминг бюра', 'L-образни бюра', 'Стоящи бюра', 'Ъглови бюра', 'Малки гейминг бюра', 'RGB гейминг бюра', 'Състезателни бюра']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Desk sub-categories
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Electric Standing Desks', 'Manual Standing Desks', 'Desk Converters']),
  unnest(ARRAY['gdesk-standing-electric', 'gdesk-standing-manual', 'gdesk-standing-converter']),
  (SELECT id FROM categories WHERE slug = 'gaming-desk-standing'),
  unnest(ARRAY['Електрически стоящи бюра', 'Ръчни стоящи бюра', 'Конвертори за бюро']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Small L-Shaped', 'Large L-Shaped', 'Reversible L-Shaped']),
  unnest(ARRAY['gdesk-l-small', 'gdesk-l-large', 'gdesk-l-reversible']),
  (SELECT id FROM categories WHERE slug = 'gaming-desk-l-shaped'),
  unnest(ARRAY['Малки L-образни', 'Големи L-образни', 'Обръщаеми L-образни']),
  '🪑'
ON CONFLICT (slug) DO NOTHING;

-- Monitor Stands (gaming-monitor-stands)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Single Monitor Arms', 'Dual Monitor Arms', 'Triple Monitor Arms', 'Monitor Risers', 'Wall Mounts', 'Desk Clamp Mounts']),
  unnest(ARRAY['monstand-single', 'monstand-dual', 'monstand-triple', 'monstand-riser', 'monstand-wall', 'monstand-clamp']),
  (SELECT id FROM categories WHERE slug = 'gaming-monitor-stands'),
  unnest(ARRAY['Единични рамена', 'Двойни рамена', 'Тройни рамена', 'Стойки за монитор', 'Стенни стойки', 'Стойки с щипка']),
  '🖥️'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Room Setup (gaming-room-setup)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['RGB Lighting', 'Cable Management', 'Acoustic Panels', 'Posters & Wall Art', 'Shelving', 'Storage Solutions']),
  unnest(ARRAY['groom-rgb', 'groom-cables', 'groom-acoustic', 'groom-posters', 'groom-shelving', 'groom-storage']),
  (SELECT id FROM categories WHERE slug = 'gaming-room-setup'),
  unnest(ARRAY['RGB осветление', 'Управление на кабели', 'Акустични панели', 'Постери и стенно изкуство', 'Рафтове', 'Решения за съхранение']),
  '🏠'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- VR GAMING L3 CATEGORIES
-- =====================================================

-- VR Headsets (gaming-vr-headsets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Meta Quest 3', 'Meta Quest 2', 'PlayStation VR2', 'Valve Index', 'HTC Vive', 'HP Reverb', 'Standalone VR', 'PC VR']),
  unnest(ARRAY['vr-quest3', 'vr-quest2', 'vr-psvr2', 'vr-valveindex', 'vr-htcvive', 'vr-hpreverb', 'vr-standalone', 'vr-pcvr']),
  (SELECT id FROM categories WHERE slug = 'gaming-vr-headsets'),
  unnest(ARRAY['Meta Quest 3', 'Meta Quest 2', 'PlayStation VR2', 'Valve Index', 'HTC Vive', 'HP Reverb', 'Самостоятелни VR', 'PC VR']),
  '🥽'
ON CONFLICT (slug) DO NOTHING;

-- Meta Quest (vr-meta-quest)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Quest 3 Headsets', 'Quest 2 Headsets', 'Quest Pro', 'Quest Accessories', 'Quest Games']),
  unnest(ARRAY['quest-3', 'quest-2', 'quest-pro', 'quest-accessories', 'quest-games']),
  (SELECT id FROM categories WHERE slug = 'vr-meta-quest'),
  unnest(ARRAY['Quest 3 шлемове', 'Quest 2 шлемове', 'Quest Pro', 'Quest аксесоари', 'Quest игри']),
  '🥽'
ON CONFLICT (slug) DO NOTHING;

-- VR Accessories (vr-accessories)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['VR Controllers', 'Head Straps', 'Face Covers', 'Lens Protectors', 'VR Cables', 'VR Stands', 'Battery Packs', 'VR Mats']),
  unnest(ARRAY['vracc-controllers', 'vracc-headstraps', 'vracc-facecovers', 'vracc-lensprotectors', 'vracc-cables', 'vracc-stands', 'vracc-batteries', 'vracc-mats']),
  (SELECT id FROM categories WHERE slug = 'vr-accessories'),
  unnest(ARRAY['VR контролери', 'Каишки за глава', 'Покривала за лице', 'Протектори за лещи', 'VR кабели', 'VR стойки', 'Батерии', 'VR постелки']),
  '🥽'
ON CONFLICT (slug) DO NOTHING;

-- VR Games (vr-games)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Action VR Games', 'Adventure VR Games', 'Simulation VR', 'Fitness VR', 'Social VR', 'Horror VR', 'Racing VR', 'Rhythm VR']),
  unnest(ARRAY['vrgame-action', 'vrgame-adventure', 'vrgame-simulation', 'vrgame-fitness', 'vrgame-social', 'vrgame-horror', 'vrgame-racing', 'vrgame-rhythm']),
  (SELECT id FROM categories WHERE slug = 'vr-games'),
  unnest(ARRAY['Екшън VR игри', 'Приключенски VR игри', 'VR симулатори', 'Фитнес VR', 'Социален VR', 'Хорър VR', 'Състезателни VR', 'Ритъм VR']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- VR Gaming (gaming-vr)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['VR Headsets', 'VR Games', 'VR Accessories', 'VR Ready PCs', 'VR Controllers']),
  unnest(ARRAY['gamingvr-headsets', 'gamingvr-games', 'gamingvr-accessories', 'gamingvr-pcs', 'gamingvr-controllers']),
  (SELECT id FROM categories WHERE slug = 'gaming-vr'),
  unnest(ARRAY['VR шлемове', 'VR игри', 'VR аксесоари', 'VR Ready компютри', 'VR контролери']),
  '🥽'
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- STREAMING EQUIPMENT L3 CATEGORIES
-- =====================================================

-- Streaming Microphones (streaming-microphones)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['USB Microphones', 'XLR Microphones', 'Dynamic Microphones', 'Condenser Microphones', 'Wireless Microphones', 'Lapel Microphones']),
  unnest(ARRAY['stream-mic-usb', 'stream-mic-xlr', 'stream-mic-dynamic', 'stream-mic-condenser', 'stream-mic-wireless', 'stream-mic-lapel']),
  (SELECT id FROM categories WHERE slug = 'streaming-microphones'),
  unnest(ARRAY['USB микрофони', 'XLR микрофони', 'Динамични микрофони', 'Кондензаторни микрофони', 'Безжични микрофони', 'Ревелни микрофони']),
  '🎙️'
ON CONFLICT (slug) DO NOTHING;

-- Webcams (streaming-webcams and webcams)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['1080p Webcams', '4K Webcams', 'Wide Angle Webcams', 'Webcams with Microphone', 'Streaming Webcams', 'Budget Webcams']),
  unnest(ARRAY['webcam-1080p', 'webcam-4k', 'webcam-wideangle', 'webcam-with-mic', 'webcam-streaming', 'webcam-budget']),
  (SELECT id FROM categories WHERE slug = 'webcams'),
  unnest(ARRAY['1080p уеб камери', '4K уеб камери', 'Широкоъгълни уеб камери', 'Уеб камери с микрофон', 'Стрийминг уеб камери', 'Бюджетни уеб камери']),
  '📷'
ON CONFLICT (slug) DO NOTHING;

-- Capture Cards (capture-cards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Internal Capture Cards', 'External Capture Cards', '4K Capture Cards', '1080p Capture Cards', 'USB Capture Cards', 'PCIe Capture Cards']),
  unnest(ARRAY['capture-internal', 'capture-external', 'capture-4k', 'capture-1080p', 'capture-usb', 'capture-pcie']),
  (SELECT id FROM categories WHERE slug = 'capture-cards'),
  unnest(ARRAY['Вътрешни кепчър карти', 'Външни кепчър карти', '4K кепчър карти', '1080p кепчър карти', 'USB кепчър карти', 'PCIe кепчър карти']),
  '📹'
ON CONFLICT (slug) DO NOTHING;

-- Stream Decks (stream-decks)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Stream Deck Mini', 'Stream Deck MK.2', 'Stream Deck XL', 'Stream Deck Mobile', 'Stream Deck Accessories', 'Stream Deck Alternatives']),
  unnest(ARRAY['streamdeck-mini', 'streamdeck-mk2', 'streamdeck-xl', 'streamdeck-mobile', 'streamdeck-accessories', 'streamdeck-alternatives']),
  (SELECT id FROM categories WHERE slug = 'stream-decks'),
  unnest(ARRAY['Stream Deck Mini', 'Stream Deck MK.2', 'Stream Deck XL', 'Stream Deck Mobile', 'Аксесоари', 'Алтернативи']),
  '🎛️'
ON CONFLICT (slug) DO NOTHING;

-- Ring Lights (ring-lights)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Desktop Ring Lights', 'Floor Ring Lights', 'Clip-On Ring Lights', 'RGB Ring Lights', 'Professional Ring Lights']),
  unnest(ARRAY['ringlight-desktop', 'ringlight-floor', 'ringlight-clipon', 'ringlight-rgb', 'ringlight-professional']),
  (SELECT id FROM categories WHERE slug = 'ring-lights'),
  unnest(ARRAY['Настолни ринг светлини', 'Подови ринг светлини', 'Ринг светлини с щипка', 'RGB ринг светлини', 'Професионални ринг светлини']),
  '💡'
ON CONFLICT (slug) DO NOTHING;

-- Green Screens (green-screens)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Collapsible Green Screens', 'Wall-Mounted Green Screens', 'Pop-Up Green Screens', 'Green Screen Kits', 'Chair Green Screens']),
  unnest(ARRAY['greenscreen-collapsible', 'greenscreen-wall', 'greenscreen-popup', 'greenscreen-kits', 'greenscreen-chair']),
  (SELECT id FROM categories WHERE slug = 'green-screens'),
  unnest(ARRAY['Сгъваеми зелени екрани', 'Стенни зелени екрани', 'Поп-ъп зелени екрани', 'Комплекти зелени екрани', 'Зелени екрани за стол']),
  '🟩'
ON CONFLICT (slug) DO NOTHING;

-- Microphone Arms (microphone-arms)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Boom Arms', 'Low Profile Arms', 'Heavy Duty Arms', 'RGB Mic Arms', 'Desk Clamp Arms']),
  unnest(ARRAY['micarm-boom', 'micarm-lowprofile', 'micarm-heavyduty', 'micarm-rgb', 'micarm-clamp']),
  (SELECT id FROM categories WHERE slug = 'microphone-arms'),
  unnest(ARRAY['Бум рамена', 'Нископрофилни рамена', 'Тежкотоварни рамена', 'RGB рамена', 'Рамена с щипка']),
  '🎙️'
ON CONFLICT (slug) DO NOTHING;;
