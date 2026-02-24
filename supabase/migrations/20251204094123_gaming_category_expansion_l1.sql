
-- =====================================================
-- GAMING CATEGORY EXPANSION - Phase 1: L1 Categories
-- =====================================================
-- Gaming L0 ID: 54c304d0-4eba-4075-9ef3-8cbcf426d9b0

-- First, update existing L1 display orders and add new L1 categories
UPDATE categories SET display_order = 1, icon = '🖥️' WHERE slug = 'pc-gaming-main';
UPDATE categories SET display_order = 2, icon = '🎮' WHERE slug = 'console-gaming';

-- Add new L1: Gaming Furniture
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES (
  'Gaming Furniture', 
  'Гейминг мебели',
  'gaming-furniture',
  '54c304d0-4eba-4075-9ef3-8cbcf426d9b0',
  '🪑',
  3,
  'Gaming chairs, desks, and room setup accessories',
  'Гейминг столове, бюра и аксесоари за стая'
);

-- Add new L1: Gaming Accessories (general)
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES (
  'Gaming Accessories', 
  'Гейминг аксесоари',
  'gaming-accessories-main',
  '54c304d0-4eba-4075-9ef3-8cbcf426d9b0',
  '🎧',
  4,
  'Gaming glasses, bags, storage and miscellaneous accessories',
  'Гейминг очила, чанти, съхранение и различни аксесоари'
);

-- Add new L1: VR & AR Gaming
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES (
  'VR & AR Gaming', 
  'VR и AR гейминг',
  'vr-ar-gaming',
  '54c304d0-4eba-4075-9ef3-8cbcf426d9b0',
  '🥽',
  5,
  'Virtual reality and augmented reality gaming equipment',
  'Виртуална реалност и добавена реалност гейминг оборудване'
);

-- Add new L1: Streaming & Content Creation
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES (
  'Streaming & Content Creation', 
  'Стрийминг и съдържание',
  'streaming-equipment',
  '54c304d0-4eba-4075-9ef3-8cbcf426d9b0',
  '📹',
  6,
  'Equipment for game streaming and content creation',
  'Оборудване за стрийминг и създаване на съдържание'
);

-- Add new L1: Retro Gaming
INSERT INTO categories (name, name_bg, slug, parent_id, icon, display_order, description, description_bg)
VALUES (
  'Retro Gaming', 
  'Ретро гейминг',
  'retro-gaming',
  '54c304d0-4eba-4075-9ef3-8cbcf426d9b0',
  '👾',
  7,
  'Classic and vintage gaming consoles, games, and accessories',
  'Класически и винтидж конзоли, игри и аксесоари'
);

-- Update existing Trading Cards & Board Games display order
UPDATE categories SET display_order = 8 WHERE slug = 'trading-cards';
UPDATE categories SET display_order = 9 WHERE slug = 'board-games';

-- Remove Gaming Merchandise (merging into Gaming Accessories)
UPDATE categories SET display_order = 9999, name = '[DEPRECATED] Gaming Merchandise' WHERE slug = 'gaming-merch';
;
