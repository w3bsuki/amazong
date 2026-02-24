
-- Migration: Restructure Electronics category - Option B (Split)
-- Move Desktop PCs, Laptops, Monitors, PC Components, and Peripherals 
-- to be direct children of Electronics (instead of under PC & Laptops)

-- Step 1: Update the 5 main categories to be direct children of Electronics
UPDATE categories 
SET parent_id = '8fb2b390-6dc4-42b3-b386-7d5357ece5bc' -- Electronics ID
WHERE id IN (
  '485e10c5-0a5e-4091-9571-6607d98ccdd2',  -- Laptops
  '0828a9c4-ae8f-422e-9279-af9aec69b2ac',  -- Desktop PCs
  '60665111-9123-4398-9f26-ba4415979752',  -- Monitors
  '54b001a0-59ba-46a8-943c-8d4097e31210',  -- PC Components
  'a0b6a85e-01ce-418f-85b8-2d9e02533339'   -- Peripherals
);

-- Step 2: Update display_order for the new L1 categories under Electronics
-- This ensures proper ordering in the mega-menu
UPDATE categories SET display_order = 1 WHERE id = '0828a9c4-ae8f-422e-9279-af9aec69b2ac'; -- Desktop PCs
UPDATE categories SET display_order = 2 WHERE id = '485e10c5-0a5e-4091-9571-6607d98ccdd2'; -- Laptops
UPDATE categories SET display_order = 3 WHERE id = '60665111-9123-4398-9f26-ba4415979752'; -- Monitors
UPDATE categories SET display_order = 4 WHERE id = '54b001a0-59ba-46a8-943c-8d4097e31210'; -- PC Components
UPDATE categories SET display_order = 5 WHERE id = 'a0b6a85e-01ce-418f-85b8-2d9e02533339'; -- Peripherals

-- Step 3: Move remaining orphaned categories under PC & Laptops to appropriate new parents
-- Computer Accessories -> Under Peripherals (makes more sense)
UPDATE categories 
SET parent_id = 'a0b6a85e-01ce-418f-85b8-2d9e02533339'  -- Peripherals
WHERE id = '3da58372-474e-4d34-8847-4b08a48574ff';  -- Computer Accessories

-- All-in-One Computers -> Under Desktop PCs
UPDATE categories 
SET parent_id = '0828a9c4-ae8f-422e-9279-af9aec69b2ac'  -- Desktop PCs
WHERE id = '0bfd5fc0-2520-4d11-a576-cac5f322ae32';  -- All-in-One

-- Printers -> Under Peripherals
UPDATE categories 
SET parent_id = 'a0b6a85e-01ce-418f-85b8-2d9e02533339'  -- Peripherals
WHERE id = 'c723acd0-aaca-4732-be5c-b4d40e87b6fc';  -- Printers

-- Webcams -> Under Peripherals
UPDATE categories 
SET parent_id = 'a0b6a85e-01ce-418f-85b8-2d9e02533339'  -- Peripherals
WHERE id = 'd7d1acb0-fa0a-4405-b98e-58821b1e0399';  -- Webcams

-- Storage Drives -> Under PC Components
UPDATE categories 
SET parent_id = '54b001a0-59ba-46a8-943c-8d4097e31210'  -- PC Components
WHERE id = '0ae9112b-22bf-4f5e-a679-d606280303b8';  -- Storage Drives

-- Networking -> Make it a direct child of Electronics (important category)
UPDATE categories 
SET parent_id = '8fb2b390-6dc4-42b3-b386-7d5357ece5bc',  -- Electronics
    display_order = 6
WHERE id = '1fe94dbb-17e5-45c1-a9fb-87301fc7edeb';  -- Networking

-- Step 4: Delete the old PC & Laptops category (no longer needed)
-- First check if there are any products directly assigned to it
-- If so, we'll just mark it as deprecated instead of deleting
DELETE FROM categories 
WHERE id = '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8'  -- PC & Laptops
AND NOT EXISTS (
  SELECT 1 FROM products WHERE category_id = '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8'
)
AND NOT EXISTS (
  SELECT 1 FROM categories WHERE parent_id = '5c4a4eba-4ee9-44b9-95e2-7955ec4912d8'
);
;
