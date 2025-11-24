-- Add subcategories for comprehensive Bulgarian marketplace
-- This migration adds hierarchical categories with Bulgarian support

-- Insert Automotive subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Car Parts', 'Авточасти', 'auto-parts', id FROM public.categories WHERE slug = 'automotive'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Car Accessories', 'Аксесоари за автомобили', 'auto-accessories', id FROM public.categories WHERE slug = 'automotive'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Motorcycle', 'Мотоциклети', 'motorcycle', id FROM public.categories WHERE slug = 'automotive'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Tires & Wheels', 'Гуми и джанти', 'tires-wheels', id FROM public.categories WHERE slug = 'automotive'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Car Electronics', 'Автомобилна електроника', 'car-electronics', id FROM public.categories WHERE slug = 'automotive'
ON CONFLICT (slug) DO NOTHING;

-- Insert Electronics subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Phones & Tablets', 'Телефони и таблети', 'phones-tablets', id FROM public.categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Audio', 'Аудио', 'audio', id FROM public.categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Cameras', 'Камери', 'cameras', id FROM public.categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'TV & Home Cinema', 'ТВ и домашно кино', 'tv-home-cinema', id FROM public.categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Wearables', 'Носими устройства', 'wearables', id FROM public.categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

-- Insert Computers subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Laptops', 'Лаптопи', 'laptops', id FROM public.categories WHERE slug = 'computers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Desktops', 'Настолни компютри', 'desktops', id FROM public.categories WHERE slug = 'computers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Components', 'Компоненти', 'components', id FROM public.categories WHERE slug = 'computers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Monitors', 'Монитори', 'monitors', id FROM public.categories WHERE slug = 'computers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Accessories', 'Аксесоари', 'computer-accessories', id FROM public.categories WHERE slug = 'computers'
ON CONFLICT (slug) DO NOTHING;

-- Insert Home & Kitchen subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Furniture', 'Мебели', 'furniture', id FROM public.categories WHERE slug = 'home'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Kitchen Appliances', 'Кухненски уреди', 'kitchen-appliances', id FROM public.categories WHERE slug = 'home'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Bedding', 'Спално бельо', 'bedding', id FROM public.categories WHERE slug = 'home'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Home Decor', 'Декорация за дома', 'home-decor', id FROM public.categories WHERE slug = 'home'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Storage & Organization', 'Съхранение и организация', 'storage', id FROM public.categories WHERE slug = 'home'
ON CONFLICT (slug) DO NOTHING;

-- Insert Fashion subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Women', 'Дамско', 'womens-fashion', id FROM public.categories WHERE slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Men', 'Мъжко', 'mens-fashion', id FROM public.categories WHERE slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Kids', 'Детско', 'kids-fashion', id FROM public.categories WHERE slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Shoes', 'Обувки', 'shoes', id FROM public.categories WHERE slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Bags & Luggage', 'Чанти и куфари', 'bags-luggage', id FROM public.categories WHERE slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

-- Insert Sports & Outdoors subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Exercise & Fitness', 'Упражнения и фитнес', 'exercise-fitness', id FROM public.categories WHERE slug = 'sports'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Outdoor Recreation', 'Дейности на открито', 'outdoor-recreation', id FROM public.categories WHERE slug = 'sports'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Sports Equipment', 'Спортно оборудване', 'sports-equipment', id FROM public.categories WHERE slug = 'sports'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Cycling', 'Колоездене', 'cycling', id FROM public.categories WHERE slug = 'sports'
ON CONFLICT (slug) DO NOTHING;

-- Insert Toys & Games subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Action Figures', 'Фигурки', 'action-figures', id FROM public.categories WHERE slug = 'toys'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Board Games', 'Настолни игри', 'board-games', id FROM public.categories WHERE slug = 'toys'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Educational Toys', 'Образователни играчки', 'educational-toys', id FROM public.categories WHERE slug = 'toys'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Dolls & Stuffed Animals', 'Кукли и плюшени играчки', 'dolls-stuffed', id FROM public.categories WHERE slug = 'toys'
ON CONFLICT (slug) DO NOTHING;

-- Insert Gaming subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Consoles', 'Конзоли', 'consoles', id FROM public.categories WHERE slug = 'gaming'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Video Games', 'Видео игри', 'video-games', id FROM public.categories WHERE slug = 'gaming'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Gaming Accessories', 'Геймърски аксесоари', 'gaming-accessories', id FROM public.categories WHERE slug = 'gaming'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'PC Gaming', 'PC геймърство', 'pc-gaming', id FROM public.categories WHERE slug = 'gaming'
ON CONFLICT (slug) DO NOTHING;

-- Insert Beauty subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Skincare', 'Грижа за кожата', 'skincare', id FROM public.categories WHERE slug = 'beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Makeup', 'Грим', 'makeup', id FROM public.categories WHERE slug = 'beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Hair Care', 'Грижа за косата', 'hair-care', id FROM public.categories WHERE slug = 'beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Fragrances', 'Парфюми', 'fragrances', id FROM public.categories WHERE slug = 'beauty'
ON CONFLICT (slug) DO NOTHING;

-- Insert Books subcategories
INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Fiction', 'Художествена литература', 'fiction', id FROM public.categories WHERE slug = 'books'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Non-Fiction', 'Нехудожествена литература', 'non-fiction', id FROM public.categories WHERE slug = 'books'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Educational', 'Образователни', 'educational-books', id FROM public.categories WHERE slug = 'books'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, name_bg, slug, parent_id)
SELECT 'Children Books', 'Детски книги', 'children-books', id FROM public.categories WHERE slug = 'books'
ON CONFLICT (slug) DO NOTHING;
