-- CATEGORY REDESIGN v2
-- Step 2: Insert new category tree (alongside old tree).
-- Draft only. Do not run in production without approval.

begin;

-- IMPORTANT:
-- Existing categories.slug is UNIQUE.
-- New tree uses "v2-" slugs to avoid collisions while old tree is still present.

create temporary table tmp_v2_categories (
  parent_slug text,
  name text not null,
  slug text not null,
  name_bg text,
  display_order int not null,
  is_browseable boolean not null default true
) on commit drop;

insert into tmp_v2_categories (parent_slug, name, slug, name_bg, display_order, is_browseable) values
  -- Roots
  (null, 'Electronics', 'v2-electronics', 'Електроника', 10, true),
  (null, 'Fashion', 'v2-fashion', 'Мода', 20, true),
  (null, 'Home & Kitchen', 'v2-home-kitchen', 'Дом и кухня', 30, true),
  (null, 'Beauty & Health', 'v2-beauty-health', 'Красота и здраве', 40, true),
  (null, 'Kids & Baby', 'v2-kids', 'Деца и бебе', 50, true),
  (null, 'Sports & Outdoors', 'v2-sports-outdoors', 'Спорт и на открито', 60, true),
  (null, 'Automotive', 'v2-automotive', 'Автомобили', 70, true),
  (null, 'Gaming', 'v2-gaming', 'Гейминг', 80, true),
  (null, 'Hobbies & Crafts', 'v2-hobbies', 'Хобита и занаяти', 90, true),
  (null, 'Collectibles & Art', 'v2-collectibles', 'Колекционерство и изкуство', 100, true),
  (null, 'Books & Media', 'v2-books-media', 'Книги и медии', 110, true),
  (null, 'Pets', 'v2-pets', 'Домашни любимци', 120, true),
  (null, 'Jewelry & Watches', 'v2-jewelry-watches', 'Бижута и часовници', 130, true),
  (null, 'Tools & Industrial', 'v2-tools-industrial', 'Инструменти и индустрия', 140, true),

  -- Electronics (launch 11 + support leaves used in mapping)
  ('v2-electronics', 'Smartphones', 'v2-electronics-smartphones', 'Смартфони', 10, true),
  ('v2-electronics', 'Laptops', 'v2-electronics-laptops', 'Лаптопи', 20, true),
  ('v2-electronics', 'Desktop PCs', 'v2-electronics-computers', 'Настолни компютри', 30, true),
  ('v2-electronics', 'Tablets', 'v2-electronics-tablets', 'Таблети', 40, true),
  ('v2-electronics', 'Televisions', 'v2-electronics-tvs', 'Телевизори', 50, true),
  ('v2-electronics', 'Monitors', 'v2-electronics-monitors', 'Монитори', 60, true),
  ('v2-electronics', 'Audio', 'v2-electronics-audio', 'Аудио', 70, true),
  ('v2-electronics', 'Cameras', 'v2-electronics-cameras', 'Камери', 80, true),
  ('v2-electronics', 'Wearables', 'v2-electronics-wearables', 'Носими устройства', 90, true),
  ('v2-electronics', 'Smart Home', 'v2-electronics-smart-home', 'Умен дом', 100, true),
  ('v2-electronics', 'Computer Components', 'v2-electronics-computer-components', 'Компютърни компоненти', 110, true),
  ('v2-electronics', 'Computer Accessories', 'v2-electronics-computer-accessories', 'Компютърни аксесоари', 120, true),

  -- Fashion (10 launch leaves)
  ('v2-fashion', 'Women Clothing', 'v2-fashion-women-clothing', 'Дамско облекло', 10, true),
  ('v2-fashion', 'Men Clothing', 'v2-fashion-men-clothing', 'Мъжко облекло', 20, true),
  ('v2-fashion', 'Women Shoes', 'v2-fashion-women-shoes', 'Дамски обувки', 30, true),
  ('v2-fashion', 'Men Shoes', 'v2-fashion-men-shoes', 'Мъжки обувки', 40, true),
  ('v2-fashion', 'Bags & Accessories', 'v2-fashion-bags-accessories', 'Чанти и аксесоари', 50, true),
  ('v2-fashion', 'Fashion Jewelry', 'v2-fashion-jewelry', 'Модни бижута', 60, true),
  ('v2-fashion', 'Watches', 'v2-fashion-watches', 'Часовници', 70, true),
  ('v2-fashion', 'Sportswear', 'v2-fashion-sportswear', 'Спортно облекло', 80, true),
  ('v2-fashion', 'Kids Fashion', 'v2-fashion-kids-fashion', 'Детска мода', 90, true),
  ('v2-fashion', 'Luxury Preowned', 'v2-fashion-luxury-preowned', 'Луксозни втора употреба', 100, true),

  -- Home & Kitchen (10 launch leaves)
  ('v2-home-kitchen', 'Furniture', 'v2-home-furniture', 'Мебели', 10, true),
  ('v2-home-kitchen', 'Home Decor', 'v2-home-decor', 'Декор за дома', 20, true),
  ('v2-home-kitchen', 'Kitchen Appliances', 'v2-home-kitchen-appliances', 'Кухненски уреди', 30, true),
  ('v2-home-kitchen', 'Cookware & Dining', 'v2-home-cookware-dining', 'Готварство и сервиране', 40, true),
  ('v2-home-kitchen', 'Bedding & Bath', 'v2-home-bedding-bath', 'Спално и баня', 50, true),
  ('v2-home-kitchen', 'Garden & Outdoor', 'v2-home-garden-outdoor', 'Градина и външно', 60, true),
  ('v2-home-kitchen', 'Office & School', 'v2-home-office-school', 'Офис и училище', 70, true),
  ('v2-home-kitchen', 'Storage & Organization', 'v2-home-storage-organization', 'Съхранение и организация', 80, true),
  ('v2-home-kitchen', 'Cleaning & Laundry', 'v2-home-cleaning-laundry', 'Почистване и пране', 90, true),
  ('v2-home-kitchen', 'Tools for Home', 'v2-home-tools-improvement', 'Инструменти за дома', 100, true),

  -- Beauty & Health (launch + mapped health leaves)
  ('v2-beauty-health', 'Makeup', 'v2-beauty-makeup', 'Грим', 10, true),
  ('v2-beauty-health', 'Skincare', 'v2-beauty-skincare', 'Грижа за кожата', 20, true),
  ('v2-beauty-health', 'Fragrance', 'v2-beauty-fragrance', 'Парфюми', 30, true),
  ('v2-beauty-health', 'Supplements', 'v2-beauty-health-supplements', 'Хранителни добавки', 40, true),
  ('v2-beauty-health', 'Medical Supplies', 'v2-beauty-health-medical', 'Медицински консумативи', 50, true),

  -- Kids (8 launch leaves)
  ('v2-kids', 'Strollers', 'v2-kids-strollers', 'Колички', 10, true),
  ('v2-kids', 'Car Seats', 'v2-kids-car-seats', 'Столчета за кола', 20, true),
  ('v2-kids', 'Nursery Furniture', 'v2-kids-nursery-furniture', 'Детска стая', 30, true),
  ('v2-kids', 'Feeding', 'v2-kids-feeding', 'Хранене', 40, true),
  ('v2-kids', 'Clothing & Shoes', 'v2-kids-clothing-shoes', 'Дрехи и обувки', 50, true),
  ('v2-kids', 'Toys & Games', 'v2-kids-toys-games', 'Играчки и игри', 60, true),
  ('v2-kids', 'Learning Books', 'v2-kids-learning-books', 'Образователни книги', 70, true),
  ('v2-kids', 'Baby Care', 'v2-kids-baby-care', 'Грижа за бебето', 80, true),

  -- Automotive (8 launch leaves)
  ('v2-automotive', 'Vehicles', 'v2-automotive-vehicles', 'Превозни средства', 10, true),
  ('v2-automotive', 'Electric Vehicles', 'v2-automotive-ev', 'Електромобили', 20, true),
  ('v2-automotive', 'Parts', 'v2-automotive-parts', 'Части', 30, true),
  ('v2-automotive', 'Accessories', 'v2-automotive-accessories', 'Аксесоари', 40, true),
  ('v2-automotive', 'Electronics', 'v2-automotive-electronics', 'Авто електроника', 50, true),
  ('v2-automotive', 'Tools & Equipment', 'v2-automotive-tools-equipment', 'Инструменти и оборудване', 60, true),
  ('v2-automotive', 'Tires & Wheels', 'v2-automotive-tires-wheels', 'Гуми и джанти', 70, true),
  ('v2-automotive', 'Oils & Fluids', 'v2-automotive-oils-fluids', 'Масла и течности', 80, true),

  -- Other active mapped leaves
  ('v2-sports-outdoors', 'Fitness Equipment', 'v2-sports-fitness-equipment', 'Фитнес уреди', 10, true),
  ('v2-sports-outdoors', 'Cycling', 'v2-sports-cycling', 'Колоездене', 20, true),

  ('v2-gaming', 'Board Games', 'v2-gaming-board-games', 'Настолни игри', 10, true),
  ('v2-gaming', 'Trading Cards', 'v2-gaming-trading-cards', 'Колекционерски карти', 20, true),

  ('v2-hobbies', 'Crafts', 'v2-hobbies-crafts', 'Занаяти', 10, true),
  ('v2-hobbies', 'Musical Instruments', 'v2-hobbies-musical-instruments', 'Музикални инструменти', 20, true),

  ('v2-collectibles', 'Art', 'v2-collectibles-art', 'Изкуство', 10, true),
  ('v2-collectibles', 'Coins', 'v2-collectibles-coins', 'Монети', 20, true),
  ('v2-collectibles', 'Sports Memorabilia', 'v2-collectibles-sports-memorabilia', 'Спортни сувенири', 30, true),
  ('v2-collectibles', 'Stamps', 'v2-collectibles-stamps', 'Марки', 40, true),

  ('v2-books-media', 'Fiction', 'v2-books-fiction', 'Художествена литература', 10, true),
  ('v2-books-media', 'Music & Vinyl', 'v2-books-media-music', 'Музика и винил', 20, true),

  ('v2-pets', 'Food & Supplies', 'v2-pets-food-supplies', 'Храна и консумативи', 10, true),
  ('v2-pets', 'Grooming', 'v2-pets-grooming', 'Грижа и хигиена', 20, true),

  ('v2-jewelry-watches', 'Rings', 'v2-jewelry-rings', 'Пръстени', 10, true),
  ('v2-jewelry-watches', 'Necklaces', 'v2-jewelry-necklaces', 'Колиета', 20, true),

  ('v2-tools-industrial', 'Hand Tools', 'v2-tools-hand-tools', 'Ръчни инструменти', 10, true),
  ('v2-tools-industrial', 'Power Tools', 'v2-tools-power-tools', 'Електроинструменти', 20, true),
  ('v2-tools-industrial', 'Safety Equipment', 'v2-tools-safety', 'Средства за защита', 30, true),
  ('v2-tools-industrial', 'Industrial & Scientific', 'v2-tools-industrial-scientific', 'Индустриално и научно', 40, true);

insert into public.categories (name, slug, parent_id, name_bg, display_order, is_browseable)
select
  c.name,
  c.slug,
  p.id,
  c.name_bg,
  c.display_order,
  c.is_browseable
from tmp_v2_categories c
left join public.categories p on p.slug = c.parent_slug
on conflict (slug) do nothing;

-- Set non-default mode allowances where needed.
update public.categories
set
  allowed_transaction_modes = array['checkout','contact']::text[],
  allowed_fulfillment_modes = array['shipping','pickup']::text[]
where slug in (
  'v2-automotive-vehicles',
  'v2-automotive-ev',
  'v2-automotive-parts',
  'v2-automotive-accessories',
  'v2-automotive-electronics',
  'v2-automotive-tools-equipment',
  'v2-automotive-tires-wheels',
  'v2-automotive-oils-fluids'
);

commit;

-- Rollback (manual):
-- begin;
-- delete from public.categories where slug like 'v2-%';
-- commit;
