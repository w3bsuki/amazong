-- Seed Categories
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
