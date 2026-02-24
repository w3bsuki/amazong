-- Phase 2.2: Gaming L3 Categories - Batch 1: PC Gaming, Keyboards, Mice, Headsets
-- Target: Add L3 children to Gaming L2 categories

-- =====================================================
-- PC GAMING L3 CATEGORIES
-- =====================================================

-- Gaming Keyboards (pc-gaming-keyboards already has some, add to gaming-keyboards)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Mechanical Keyboards', 'Membrane Keyboards', '60% Keyboards', '65% Keyboards', 'TKL Keyboards', 'Full-Size Keyboards', 'Wireless Gaming Keyboards', 'RGB Keyboards']),
  unnest(ARRAY['gaming-kb-mechanical', 'gaming-kb-membrane', 'gaming-kb-60percent', 'gaming-kb-65percent', 'gaming-kb-tkl', 'gaming-kb-fullsize', 'gaming-kb-wireless', 'gaming-kb-rgb']),
  (SELECT id FROM categories WHERE slug = 'gaming-keyboards'),
  unnest(ARRAY['Механични клавиатури', 'Мембранни клавиатури', '60% клавиатури', '65% клавиатури', 'TKL клавиатури', 'Пълноразмерни клавиатури', 'Безжични гейминг клавиатури', 'RGB клавиатури']),
  '⌨️'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Headsets (pc-gaming-headsets)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Wired Gaming Headsets', 'Wireless Gaming Headsets', '7.1 Surround Headsets', 'Open-Back Headsets', 'Closed-Back Headsets', 'RGB Gaming Headsets', 'Budget Gaming Headsets', 'Premium Gaming Headsets']),
  unnest(ARRAY['gaming-headset-wired', 'gaming-headset-wireless', 'gaming-headset-71', 'gaming-headset-openback', 'gaming-headset-closedback', 'gaming-headset-rgb', 'gaming-headset-budget', 'gaming-headset-premium']),
  (SELECT id FROM categories WHERE slug = 'pc-gaming-headsets'),
  unnest(ARRAY['Кабелни гейминг слушалки', 'Безжични гейминг слушалки', '7.1 съраунд слушалки', 'Отворени слушалки', 'Затворени слушалки', 'RGB гейминг слушалки', 'Бюджетни гейминг слушалки', 'Премиум гейминг слушалки']),
  '🎧'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Mousepads (pc-gaming-mousepads)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Large Mousepads', 'Extended Mousepads', 'Hard Surface Pads', 'Soft Surface Pads', 'RGB Mousepads', 'Speed Pads', 'Control Pads', 'Desk Mats']),
  unnest(ARRAY['gaming-mousepad-large', 'gaming-mousepad-extended', 'gaming-mousepad-hard', 'gaming-mousepad-soft', 'gaming-mousepad-rgb', 'gaming-mousepad-speed', 'gaming-mousepad-control', 'gaming-mousepad-deskmat']),
  (SELECT id FROM categories WHERE slug = 'pc-gaming-mousepads'),
  unnest(ARRAY['Големи подложки', 'Разширени подложки', 'Твърди подложки', 'Меки подложки', 'RGB подложки', 'Бързи подложки', 'Контролни подложки', 'Подложки за бюро']),
  '🖱️'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Desktops (pc-gaming-desktops)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pre-Built Gaming PCs', 'High-End Gaming PCs', 'Budget Gaming PCs', 'Streaming PCs', 'Compact Gaming PCs', 'RTX Gaming PCs', 'AMD Gaming PCs', 'Intel Gaming PCs']),
  unnest(ARRAY['gaming-pc-prebuilt', 'gaming-pc-highend', 'gaming-pc-budget', 'gaming-pc-streaming', 'gaming-pc-compact', 'gaming-pc-rtx', 'gaming-pc-amd', 'gaming-pc-intel']),
  (SELECT id FROM categories WHERE slug = 'pc-gaming-desktops'),
  unnest(ARRAY['Готови гейминг компютри', 'Висококлас гейминг компютри', 'Бюджетни гейминг компютри', 'Стрийминг компютри', 'Компактни гейминг компютри', 'RTX гейминг компютри', 'AMD гейминг компютри', 'Intel гейминг компютри']),
  '🖥️'
ON CONFLICT (slug) DO NOTHING;

-- Gaming Laptops (pc-gaming-laptops)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['ASUS ROG Laptops', 'MSI Gaming Laptops', 'Alienware Laptops', 'Razer Blade Laptops', 'Lenovo Legion', 'Acer Predator', 'HP Omen', 'Budget Gaming Laptops']),
  unnest(ARRAY['gaming-laptop-asus-rog', 'gaming-laptop-msi', 'gaming-laptop-alienware', 'gaming-laptop-razer', 'gaming-laptop-legion', 'gaming-laptop-predator', 'gaming-laptop-omen', 'gaming-laptop-budget']),
  (SELECT id FROM categories WHERE slug = 'pc-gaming-laptops'),
  unnest(ARRAY['ASUS ROG лаптопи', 'MSI гейминг лаптопи', 'Alienware лаптопи', 'Razer Blade лаптопи', 'Lenovo Legion', 'Acer Predator', 'HP Omen', 'Бюджетни гейминг лаптопи']),
  '💻'
ON CONFLICT (slug) DO NOTHING;

-- Graphics Cards (pc-gaming-gpu)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['NVIDIA RTX 40 Series', 'NVIDIA RTX 30 Series', 'AMD RX 7000 Series', 'AMD RX 6000 Series', 'Intel Arc', 'Entry-Level GPUs', 'Mid-Range GPUs', 'High-End GPUs']),
  unnest(ARRAY['gaming-gpu-rtx40', 'gaming-gpu-rtx30', 'gaming-gpu-rx7000', 'gaming-gpu-rx6000', 'gaming-gpu-intel-arc', 'gaming-gpu-entry', 'gaming-gpu-midrange', 'gaming-gpu-highend']),
  (SELECT id FROM categories WHERE slug = 'pc-gaming-gpu'),
  unnest(ARRAY['NVIDIA RTX 40 серия', 'NVIDIA RTX 30 серия', 'AMD RX 7000 серия', 'AMD RX 6000 серия', 'Intel Arc', 'Начални GPU', 'Средни GPU', 'Висококлас GPU']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- PC Components (pc-gaming-components)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Gaming CPUs', 'Gaming RAM', 'Gaming SSDs', 'Gaming Cases', 'Gaming PSUs', 'Gaming Motherboards', 'Gaming Coolers', 'RGB Components']),
  unnest(ARRAY['gaming-comp-cpu', 'gaming-comp-ram', 'gaming-comp-ssd', 'gaming-comp-case', 'gaming-comp-psu', 'gaming-comp-motherboard', 'gaming-comp-cooler', 'gaming-comp-rgb']),
  (SELECT id FROM categories WHERE slug = 'pc-gaming-components'),
  unnest(ARRAY['Гейминг процесори', 'Гейминг RAM', 'Гейминг SSD', 'Гейминг кутии', 'Гейминг захранвания', 'Гейминг дънни платки', 'Гейминг охладители', 'RGB компоненти']),
  '🔧'
ON CONFLICT (slug) DO NOTHING;

-- PC Controllers (pc-gaming-controllers)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Xbox Controllers for PC', 'PlayStation Controllers for PC', 'Third-Party Controllers', 'Wireless Controllers', 'Wired Controllers', 'Fight Pads', 'Retro Controllers']),
  unnest(ARRAY['pc-controller-xbox', 'pc-controller-playstation', 'pc-controller-thirdparty', 'pc-controller-wireless', 'pc-controller-wired', 'pc-controller-fightpad', 'pc-controller-retro']),
  (SELECT id FROM categories WHERE slug = 'pc-gaming-controllers'),
  unnest(ARRAY['Xbox контролери за PC', 'PlayStation контролери за PC', 'Други контролери', 'Безжични контролери', 'Кабелни контролери', 'Файт падове', 'Ретро контролери']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- PC Games (gaming-pc-games)
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Action Games', 'RPG Games', 'FPS Games', 'Strategy Games', 'Sports Games', 'Racing Games', 'Simulation Games', 'Indie Games', 'MMO Games']),
  unnest(ARRAY['pc-game-action', 'pc-game-rpg', 'pc-game-fps', 'pc-game-strategy', 'pc-game-sports', 'pc-game-racing', 'pc-game-simulation', 'pc-game-indie', 'pc-game-mmo']),
  (SELECT id FROM categories WHERE slug = 'gaming-pc-games'),
  unnest(ARRAY['Екшън игри', 'RPG игри', 'FPS игри', 'Стратегии', 'Спортни игри', 'Състезателни игри', 'Симулатори', 'Инди игри', 'MMO игри']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- Also add to pc-games-cat
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Action Games', 'RPG Games', 'FPS Games', 'Strategy Games', 'Sports Games', 'Racing Games', 'Simulation Games', 'Indie Games']),
  unnest(ARRAY['pcgames-action', 'pcgames-rpg', 'pcgames-fps', 'pcgames-strategy', 'pcgames-sports', 'pcgames-racing', 'pcgames-simulation', 'pcgames-indie']),
  (SELECT id FROM categories WHERE slug = 'pc-games-cat'),
  unnest(ARRAY['Екшън игри', 'RPG игри', 'FPS игри', 'Стратегии', 'Спортни игри', 'Състезателни игри', 'Симулатори', 'Инди игри']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;

-- PC Gaming (gaming-pc) - main category
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Gaming PCs', 'Gaming Peripherals', 'PC Components', 'PC Games', 'Streaming Gear', 'Gaming Furniture']),
  unnest(ARRAY['gamingpc-pcs', 'gamingpc-peripherals', 'gamingpc-components', 'gamingpc-games', 'gamingpc-streaming', 'gamingpc-furniture']),
  (SELECT id FROM categories WHERE slug = 'gaming-pc'),
  unnest(ARRAY['Гейминг компютри', 'Гейминг периферия', 'PC компоненти', 'PC игри', 'Стрийминг оборудване', 'Гейминг мебели']),
  '🎮'
ON CONFLICT (slug) DO NOTHING;;
