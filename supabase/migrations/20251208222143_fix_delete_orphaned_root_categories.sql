-- DELETE all incorrectly created categories that have parent_id = NULL but shouldn't be root
-- These were created because the parent slug lookup returned NULL

DELETE FROM categories 
WHERE parent_id IS NULL 
AND display_order = 0
AND slug NOT IN (
  -- Real L0 categories
  'electronics', 'fashion', 'home-kitchen', 'beauty', 'sports', 'automotive',
  'toys-games', 'books', 'health', 'grocery', 'pets', 'baby', 'office',
  'tools', 'garden', 'jewelry', 'movies', 'music', 'software', 'services',
  'real-estate', 'jobs', 'wholesale', 'gaming', 'collectibles', 'hobbies',
  'kids', 'e-mobility', 'bulgarian-traditional', 'health-wellness', 
  'tools-industrial', 'grocery-food', 'jewelry-watches', 'movies-music',
  'home-garden', 'toys', 'clothing', 'shoes', 'accessories'
);;
