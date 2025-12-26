-- Create a test user in auth.users
-- We use a fixed UUID for reproducibility
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'seller@example.com',
    '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF', -- Dummy hash, won't work for login but good for FKs. For real login, use a known hash or create via API.
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test Seller"}',
    now(),
    now(),
    'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- Create a profile for the test user
INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'seller@example.com',
    'Test Seller',
    'seller',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
)
ON CONFLICT (id) DO NOTHING;

-- Create a seller profile
INSERT INTO public.sellers (id, store_name, description, verified)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Tech Haven',
    'Your one-stop shop for the latest gadgets and electronics.',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Seed Categories (from seed_categories.sql)
INSERT INTO public.categories (name, slug, image_url)
VALUES
  ('Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=500&q=80'),
  ('Computers', 'computers', 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&q=80'),
  ('Smart Home', 'smart-home', 'https://images.unsplash.com/photo-1558002038-1091a166111c?w=500&q=80'),
  ('Home & Kitchen', 'home', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80'),
  ('Fashion', 'fashion', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80'),
  ('Beauty', 'beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=500&q=80'),
  ('Toys & Games', 'toys', 'https://images.unsplash.com/photo-1566576912902-48f5d9307bb1?w=500&q=80'),
  ('Sports & Outdoors', 'sports', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80'),
  ('Automotive', 'automotive', 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=500&q=80'),
  ('Books', 'books', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80'),
  ('Gaming', 'gaming', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80')
ON CONFLICT (name) DO NOTHING;

-- Seed Products
-- We need to fetch category IDs to insert products correctly. 
-- Since we can't easily do variables in pure SQL seeds without PL/pgSQL blocks or subqueries, we'll use subqueries.

INSERT INTO public.products (seller_id, category_id, title, description, price, list_price, stock, images, rating, review_count)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    (SELECT id FROM public.categories WHERE slug = 'electronics' LIMIT 1),
    'Wireless Noise Cancelling Headphones',
    'Experience premium sound quality with these wireless noise-cancelling headphones. Perfect for travel, work, or relaxing at home.',
    299.99,
    349.99,
    50,
    ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
    4.5,
    120
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    (SELECT id FROM public.categories WHERE slug = 'computers' LIMIT 1),
    'Ultra-Slim Laptop 15"',
    'Powerful performance in a sleek, lightweight design. Features a high-resolution display and long battery life.',
    1299.00,
    1499.00,
    25,
    ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'],
    4.8,
    85
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    (SELECT id FROM public.categories WHERE slug = 'smart-home' LIMIT 1),
    'Smart Voice Assistant Speaker',
    'Control your smart home devices, play music, and get answers with this compact voice assistant speaker.',
    49.99,
    null,
    100,
    ARRAY['https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&q=80'],
    4.2,
    200
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    (SELECT id FROM public.categories WHERE slug = 'gaming' LIMIT 1),
    'Next-Gen Gaming Console',
    'Immerse yourself in 4K gaming with the latest console. Includes one controller and a game bundle.',
    499.00,
    null,
    10,
    ARRAY['https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&q=80'],
    4.9,
    500
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    (SELECT id FROM public.categories WHERE slug = 'fashion' LIMIT 1),
    'Classic Leather Jacket',
    'Timeless style with this genuine leather jacket. Durable, comfortable, and perfect for any occasion.',
    199.50,
    250.00,
    30,
    ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80'],
    4.6,
    45
  )
ON CONFLICT DO NOTHING; -- Products don't have a unique constraint on title, but this prevents errors if run multiple times if we had IDs. Since we don't specify IDs, it will just insert new ones if we run it again. 
-- To make it idempotent without IDs, we'd need a unique constraint or check existence. 
-- For now, we'll assume a fresh seed or just accept duplicates for testing if run multiple times without reset.

-- Seed Reviews
INSERT INTO public.reviews (product_id, user_id, rating, comment)
SELECT 
    id as product_id,
    '00000000-0000-0000-0000-000000000000' as user_id,
    5 as rating,
    'Amazing product! Highly recommended.' as comment
FROM public.products
WHERE title = 'Wireless Noise Cancelling Headphones'
LIMIT 1;

INSERT INTO public.reviews (product_id, user_id, rating, comment)
SELECT 
    id as product_id,
    '00000000-0000-0000-0000-000000000000' as user_id,
    4 as rating,
    'Great value for the price.' as comment
FROM public.products
WHERE title = 'Ultra-Slim Laptop 15"'
LIMIT 1;
