
-- Fix garden-outdoor and cats hierarchies (only delete those with no children)
DO $$
DECLARE
  v_garden_outdoor UUID;
  v_cats UUID;
BEGIN
  SELECT id INTO v_garden_outdoor FROM categories WHERE slug = 'garden-outdoor';
  SELECT id INTO v_cats FROM categories WHERE slug = 'cats';
  
  -- === FIX GARDEN-OUTDOOR ===
  DELETE FROM categories WHERE slug IN (
    'bbq-grills', 'garden-grills',
    'outdoor-furniture', 'patio-furniture',
    'outdoor-decor',
    'outdoor-lighting',
    'pool-spa', 'pools-spas',
    'garden-planters-ceramic', 'garden-planters-hanging',
    'garden-seeds-flower', 'garden-seeds-vegetable', 'plants-seeds',
    'garden-mowers-electric', 'garden-mowers-gas', 'garden-mowers-robotic',
    'garden-tools-cat', 'garden-pruning-shears', 'garden-rakes', 'garden-shovels', 'garden-watering-cans',
    'garden-potting-soil', 'garden-compost',
    'garden-drip-irrigation', 'garden-sprinklers',
    'lawn-care',
    'garden-greenhouses', 'garden-plants'
  ) AND parent_id = v_garden_outdoor
  AND NOT EXISTS (SELECT 1 FROM categories c2 WHERE c2.parent_id = categories.id);
  
  -- === FIX CATS ===
  DELETE FROM categories WHERE slug IN (
    'cats-food', 'cats-food-dry', 'cats-food-wet', 'cats-food-kitten', 'cats-food-senior',
    'cats-beds',
    'cats-bowls',
    'cats-carriers',
    'cats-collars',
    'cats-grooming',
    'cats-health',
    'cats-litter', 'cats-litter-boxes', 'cats-litter-boxes-covered', 'cats-litter-clumping', 'cats-litter-crystal',
    'cats-toys', 'cats-toys-feather', 'cats-toys-interactive', 'cats-toys-laser',
    'cats-treats',
    'cats-scratching-posts',
    'cat-furniture', 'cat-doors', 'cat-clothing', 'cat-tech'
  ) AND parent_id = v_cats
  AND NOT EXISTS (SELECT 1 FROM categories c2 WHERE c2.parent_id = categories.id);
  
  RAISE NOTICE 'Garden-outdoor and cats hierarchies fixed';
END $$;
;
