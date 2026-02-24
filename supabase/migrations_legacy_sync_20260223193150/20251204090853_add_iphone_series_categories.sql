-- Add iPhone Series L3 categories under smartphones-iphone (5151e58c-5c54-4e03-adb0-414f29195a6c)
INSERT INTO categories (name, name_bg, slug, parent_id, display_order) VALUES
-- iPhone 16 Series
('iPhone 16 Pro Max', 'iPhone 16 Pro Max', 'iphone-16-pro-max', '5151e58c-5c54-4e03-adb0-414f29195a6c', 1),
('iPhone 16 Pro', 'iPhone 16 Pro', 'iphone-16-pro', '5151e58c-5c54-4e03-adb0-414f29195a6c', 2),
('iPhone 16 Plus', 'iPhone 16 Plus', 'iphone-16-plus', '5151e58c-5c54-4e03-adb0-414f29195a6c', 3),
('iPhone 16', 'iPhone 16', 'iphone-16', '5151e58c-5c54-4e03-adb0-414f29195a6c', 4),
-- iPhone 15 Series
('iPhone 15 Pro Max', 'iPhone 15 Pro Max', 'iphone-15-pro-max', '5151e58c-5c54-4e03-adb0-414f29195a6c', 5),
('iPhone 15 Pro', 'iPhone 15 Pro', 'iphone-15-pro', '5151e58c-5c54-4e03-adb0-414f29195a6c', 6),
('iPhone 15 Plus', 'iPhone 15 Plus', 'iphone-15-plus', '5151e58c-5c54-4e03-adb0-414f29195a6c', 7),
('iPhone 15', 'iPhone 15', 'iphone-15', '5151e58c-5c54-4e03-adb0-414f29195a6c', 8),
-- iPhone 14 Series
('iPhone 14 Pro Max', 'iPhone 14 Pro Max', 'iphone-14-pro-max', '5151e58c-5c54-4e03-adb0-414f29195a6c', 9),
('iPhone 14 Pro', 'iPhone 14 Pro', 'iphone-14-pro', '5151e58c-5c54-4e03-adb0-414f29195a6c', 10),
('iPhone 14 Plus', 'iPhone 14 Plus', 'iphone-14-plus', '5151e58c-5c54-4e03-adb0-414f29195a6c', 11),
('iPhone 14', 'iPhone 14', 'iphone-14', '5151e58c-5c54-4e03-adb0-414f29195a6c', 12),
-- iPhone 13 Series
('iPhone 13 Pro Max', 'iPhone 13 Pro Max', 'iphone-13-pro-max', '5151e58c-5c54-4e03-adb0-414f29195a6c', 13),
('iPhone 13 Pro', 'iPhone 13 Pro', 'iphone-13-pro', '5151e58c-5c54-4e03-adb0-414f29195a6c', 14),
('iPhone 13', 'iPhone 13', 'iphone-13', '5151e58c-5c54-4e03-adb0-414f29195a6c', 15),
('iPhone 13 Mini', 'iPhone 13 Mini', 'iphone-13-mini', '5151e58c-5c54-4e03-adb0-414f29195a6c', 16),
-- iPhone 12 Series
('iPhone 12 Pro Max', 'iPhone 12 Pro Max', 'iphone-12-pro-max', '5151e58c-5c54-4e03-adb0-414f29195a6c', 17),
('iPhone 12 Pro', 'iPhone 12 Pro', 'iphone-12-pro', '5151e58c-5c54-4e03-adb0-414f29195a6c', 18),
('iPhone 12', 'iPhone 12', 'iphone-12', '5151e58c-5c54-4e03-adb0-414f29195a6c', 19),
('iPhone 12 Mini', 'iPhone 12 Mini', 'iphone-12-mini', '5151e58c-5c54-4e03-adb0-414f29195a6c', 20),
-- iPhone SE & Legacy
('iPhone SE (3rd Gen)', 'iPhone SE (3-то поколение)', 'iphone-se-3', '5151e58c-5c54-4e03-adb0-414f29195a6c', 21),
('iPhone SE (2nd Gen)', 'iPhone SE (2-ро поколение)', 'iphone-se-2', '5151e58c-5c54-4e03-adb0-414f29195a6c', 22),
('iPhone 11 Series', 'iPhone 11 серия', 'iphone-11-series', '5151e58c-5c54-4e03-adb0-414f29195a6c', 23),
('iPhone X/XS/XR', 'iPhone X/XS/XR', 'iphone-x-series', '5151e58c-5c54-4e03-adb0-414f29195a6c', 24),
('iPhone 8/8 Plus', 'iPhone 8/8 Plus', 'iphone-8-series', '5151e58c-5c54-4e03-adb0-414f29195a6c', 25),
('iPhone 7/7 Plus', 'iPhone 7/7 Plus', 'iphone-7-series', '5151e58c-5c54-4e03-adb0-414f29195a6c', 26),
('iPhone 6/6S', 'iPhone 6/6S', 'iphone-6-series', '5151e58c-5c54-4e03-adb0-414f29195a6c', 27)
ON CONFLICT (slug) DO NOTHING;;
