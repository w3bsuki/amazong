
-- Gaming category cleanup migration
-- Goal: Reorganize gaming categories by product type (not PC/Console separation)

-- Store Gaming root ID
DO $$
DECLARE
  gaming_root_id UUID := '54c304d0-4eba-4075-9ef3-8cbcf426d9b0';
  peripherals_id UUID;
  furniture_id UUID;
  accessories_id UUID;
  pc_gaming_id UUID := 'e685481c-138a-43c7-bd4a-4c8665e6f00c';
  gaming_acc_id UUID := '235685ba-7c21-436e-8319-cb84dc95bcab';
  consoles_id UUID := '8a363062-b7ff-4597-b383-dc5fbda839ff';
  video_games_id UUID := '49a0173a-6fcb-4b86-9e94-dc1caf69bfd4';
BEGIN

  -- ========================================
  -- STEP 1: Create new L1 categories
  -- ========================================
  
  -- Create "Gaming Peripherals" (for mice, keyboards, headsets, controllers)
  INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
  VALUES (
    gen_random_uuid(),
    'Gaming Peripherals',
    'Гейминг периферия',
    'gaming-peripherals',
    gaming_root_id,
    '🖱️',
    1
  )
  RETURNING id INTO peripherals_id;
  
  -- Create "Gaming Furniture" (for chairs and desks)
  INSERT INTO categories (id, name, name_bg, slug, parent_id, icon, display_order)
  VALUES (
    gen_random_uuid(),
    'Gaming Furniture',
    'Геймърска мебел',
    'gaming-furniture',
    gaming_root_id,
    '🪑',
    2
  )
  RETURNING id INTO furniture_id;
  
  -- ========================================
  -- STEP 2: Move peripherals to new parent
  -- ========================================
  
  -- Move Gaming Mice to Peripherals
  UPDATE categories 
  SET parent_id = peripherals_id, display_order = 1
  WHERE slug = 'gaming-mice';
  
  -- Move Gaming Keyboards to Peripherals
  UPDATE categories 
  SET parent_id = peripherals_id, display_order = 2
  WHERE slug = 'gaming-keyboards';
  
  -- Move Gaming Headsets from PC Gaming to Peripherals (keep one, delete duplicate)
  UPDATE categories 
  SET parent_id = peripherals_id, display_order = 3
  WHERE slug = 'gaming-headsets';
  
  -- Move Controllers (keep one with better slug)
  UPDATE categories 
  SET parent_id = peripherals_id, display_order = 4
  WHERE slug = 'controllers';
  
  -- Move Racing Wheels to Peripherals
  UPDATE categories 
  SET parent_id = peripherals_id, display_order = 5
  WHERE slug = 'racing-wheels';
  
  -- Move VR Headsets to Peripherals
  UPDATE categories 
  SET parent_id = peripherals_id, display_order = 6
  WHERE slug = 'vr-headsets';
  
  -- ========================================
  -- STEP 3: Move furniture to new parent
  -- ========================================
  
  -- Move Gaming Chairs from PC Gaming to Furniture (keep one)
  UPDATE categories 
  SET parent_id = furniture_id, display_order = 1
  WHERE slug = 'gaming-chairs';
  
  -- Move Gaming Desks to Furniture
  UPDATE categories 
  SET parent_id = furniture_id, display_order = 2
  WHERE slug = 'acc-gaming-desks';
  
  -- ========================================
  -- STEP 4: Rename PC Gaming to PC Components
  -- ========================================
  
  UPDATE categories 
  SET name = 'PC Components', 
      name_bg = 'PC компоненти', 
      icon = '🖥️',
      display_order = 4
  WHERE id = pc_gaming_id;
  
  -- ========================================
  -- STEP 5: Update display order for L1s
  -- ========================================
  
  -- Peripherals = 1 (already set above)
  -- Furniture = 2 (already set above)
  UPDATE categories SET display_order = 3 WHERE id = consoles_id;
  -- PC Components = 4 (set above)
  UPDATE categories SET display_order = 5 WHERE id = video_games_id;
  UPDATE categories SET display_order = 6 WHERE id = gaming_acc_id;
  UPDATE categories SET display_order = 7 WHERE slug = 'trading-cards' AND parent_id = gaming_root_id;
  UPDATE categories SET display_order = 8 WHERE slug = 'board-games' AND parent_id = gaming_root_id;
  UPDATE categories SET display_order = 9 WHERE slug = 'gaming-merch' AND parent_id = gaming_root_id;
  
  -- ========================================
  -- STEP 6: Delete duplicates
  -- ========================================
  
  -- Delete duplicate Controllers (acc-controllers)
  DELETE FROM categories WHERE slug = 'acc-controllers';
  
  -- Delete duplicate Gaming Headsets (gaming-headsets-acc)
  DELETE FROM categories WHERE slug = 'gaming-headsets-acc';
  
  -- Delete duplicate Gaming Chairs (acc-gaming-chairs)
  DELETE FROM categories WHERE slug = 'acc-gaming-chairs';
  
  -- Delete duplicate Xbox Games (xbox-games, keep videogames-xbox)
  DELETE FROM categories WHERE slug = 'xbox-games';
  
  -- Delete duplicate PC Games (pc-games, keep videogames-pc)
  DELETE FROM categories WHERE slug = 'pc-games';
  
  -- Delete duplicate Retro Consoles (retro-consoles, keep console-retro)
  DELETE FROM categories WHERE slug = 'retro-consoles';
  
  -- Delete duplicate PlayStation (keep console-ps5)
  DELETE FROM categories WHERE slug = 'playstation';
  
  -- Delete duplicate Xbox (keep console-xbox-series)
  DELETE FROM categories WHERE slug = 'xbox';
  
  -- Delete duplicate Nintendo (keep console-switch)
  DELETE FROM categories WHERE slug = 'nintendo';
  
  -- Delete duplicate PS Games (ps-games, keep videogames-ps5)
  DELETE FROM categories WHERE slug = 'ps-games';
  
  -- Delete duplicate Nintendo Games (keep videogames-switch)
  DELETE FROM categories WHERE slug = 'nintendo-games';
  
  -- Delete Mobile Gaming (can be combined with handhelds)
  DELETE FROM categories WHERE slug = 'mobile-gaming';
  
  -- Delete Gaming Electronics (vague category)
  DELETE FROM categories WHERE slug = 'electronics-gaming';
  
  -- ========================================
  -- STEP 7: Rename some L2s for clarity
  -- ========================================
  
  -- Rename videogames-xbox to just xbox-games with better name
  UPDATE categories 
  SET name = 'Xbox Games', name_bg = 'Xbox игри'
  WHERE slug = 'videogames-xbox';
  
  -- Rename videogames-pc
  UPDATE categories 
  SET name = 'PC Games', name_bg = 'PC игри'
  WHERE slug = 'videogames-pc';
  
  -- Rename console-retro
  UPDATE categories 
  SET name = 'Retro Consoles', name_bg = 'Ретро конзоли'
  WHERE slug = 'console-retro';
  
  -- ========================================
  -- STEP 8: Clean up Gaming Accessories (keep only TRUE accessories)
  -- ========================================
  
  -- Update Gaming Accessories description
  UPDATE categories 
  SET name = 'Gaming Accessories',
      name_bg = 'Гейминг аксесоари',
      display_order = 6
  WHERE id = gaming_acc_id;
  
  -- Add Cable Management category for wrist bands, cable holders etc
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES (
    'Cable Management',
    'Кабелни аксесоари',
    'gaming-cable-mgmt',
    gaming_acc_id,
    6
  );
  
  -- Add Gaming Glasses category
  INSERT INTO categories (name, name_bg, slug, parent_id, display_order)
  VALUES (
    'Gaming Glasses',
    'Гейминг очила',
    'gaming-glasses',
    gaming_acc_id,
    7
  );

END $$;
;
