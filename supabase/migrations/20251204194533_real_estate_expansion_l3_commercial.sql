
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 3C: L3 CATEGORIES FOR COMMERCIAL
-- Deep subcategorization for office, retail, industrial properties
-- ============================================================================

-- L3 under Offices for Sale
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'offices-commercial-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Small Offices', 'Малки офиси', 'small-offices-sale', 'Office spaces under 50 sqm', 'Офиси под 50 кв.м', 1),
    ('Medium Offices', 'Средни офиси', 'medium-offices-sale', 'Office spaces 50-200 sqm', 'Офиси 50-200 кв.м', 2),
    ('Large Offices', 'Големи офиси', 'large-offices-sale', 'Office spaces over 200 sqm', 'Офиси над 200 кв.м', 3),
    ('Open Plan Offices', 'Офиси отворен план', 'open-plan-offices', 'Open plan office spaces', 'Офиси с отворен план', 4),
    ('Executive Offices', 'Директорски офиси', 'executive-offices', 'Executive and corner offices', 'Директорски и ъглови офиси', 5),
    ('Ground Floor Offices', 'Партерни офиси', 'ground-floor-offices', 'Street level office spaces', 'Офиси на партерен етаж', 6),
    ('Serviced Offices', 'Сервизирани офиси', 'serviced-offices-sale', 'Move-in ready serviced offices', 'Готови сервизирани офиси', 7)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'offices-commercial-sale');

-- L3 under Retail Shops
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'retail-shops-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Street Retail', 'Улични магазини', 'street-retail', 'High street retail shops', 'Улични търговски обекти', 1),
    ('Mall Units', 'Молови единици', 'mall-units-sale', 'Shopping mall retail units', 'Търговски единици в молове', 2),
    ('Corner Shops', 'Ъглови магазини', 'corner-shops', 'Corner location retail', 'Търговски обекти на ъгъл', 3),
    ('Food Retail', 'Хранителни магазини', 'food-retail-sale', 'Grocery and food retail', 'Хранителни магазини', 4),
    ('Fashion Retail', 'Магазини за мода', 'fashion-retail-sale', 'Clothing and fashion retail', 'Магазини за дрехи и мода', 5),
    ('Electronics Retail', 'Магазини за техника', 'electronics-retail-sale', 'Electronics retail spaces', 'Магазини за електроника', 6),
    ('Pharmacy Locations', 'Аптеки локации', 'pharmacy-locations', 'Pharmacy suitable locations', 'Локации за аптеки', 7),
    ('Pop-Up Spaces', 'Поп-ъп пространства', 'popup-spaces', 'Short-term retail spaces', 'Краткосрочни търговски площи', 8)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'retail-shops-sale');

-- L3 under Warehouses
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'warehouses-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Distribution Warehouses', 'Дистрибуторски складове', 'distribution-warehouses', 'Large distribution centers', 'Големи дистрибуторски центрове', 1),
    ('Storage Warehouses', 'Складови бази', 'storage-warehouses', 'General storage facilities', 'Общи складови съоръжения', 2),
    ('Cold Storage', 'Хладилни складове', 'cold-storage-sale', 'Temperature controlled storage', 'Хладилни складове', 3),
    ('Fulfillment Centers', 'Фулфилмънт центрове', 'fulfillment-centers', 'E-commerce fulfillment', 'Центрове за електронна търговия', 4),
    ('Cross-Dock Facilities', 'Крос-док съоръжения', 'cross-dock-facilities', 'Cross-docking warehouses', 'Крос-докинг складове', 5),
    ('Self-Storage', 'Селф-сторидж', 'self-storage-sale', 'Self-storage facilities', 'Съоръжения за самообслужващо се съхранение', 6),
    ('Bonded Warehouses', 'Митнически складове', 'bonded-warehouses', 'Customs bonded warehouses', 'Митнически складове', 7)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'warehouses-sale');

-- L3 under Restaurants & Cafes
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'restaurants-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Fast Food Locations', 'Фаст фууд локации', 'fast-food-locations', 'Fast food suitable locations', 'Локации за бързо хранене', 1),
    ('Fine Dining Spaces', 'Ресторанти висок клас', 'fine-dining-spaces', 'Upscale restaurant spaces', 'Пространства за ресторанти висок клас', 2),
    ('Cafe Spaces', 'Кафе локации', 'cafe-spaces-sale', 'Cafe and coffee shop spaces', 'Локации за кафенета', 3),
    ('Bar Locations', 'Бар локации', 'bar-locations', 'Bar and nightclub spaces', 'Локации за барове и клубове', 4),
    ('Bakery Locations', 'Пекарни локации', 'bakery-locations', 'Bakery suitable spaces', 'Локации за пекарни', 5),
    ('Food Court Units', 'Фууд корт единици', 'food-court-units', 'Food court spaces', 'Единици във фуд кортове', 6),
    ('Ghost Kitchen Spaces', 'Призрачни кухни', 'ghost-kitchen-spaces', 'Delivery-only kitchen spaces', 'Кухни само за доставки', 7)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'restaurants-sale');

-- L3 under Hotels
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT 
    gen_random_uuid(), v.name, v.name_bg, v.slug,
    (SELECT id FROM categories WHERE slug = 'hotels-sale'),
    v.description, v.description_bg, v.display_order
FROM (VALUES
    ('Boutique Hotels', 'Бутикови хотели', 'boutique-hotels', 'Small luxury boutique hotels', 'Малки луксозни бутикови хотели', 1),
    ('Budget Hotels', 'Бюджетни хотели', 'budget-hotels', 'Economy hotels', 'Икономични хотели', 2),
    ('Resort Hotels', 'Курортни хотели', 'resort-hotels', 'Beach and mountain resorts', 'Морски и планински курорти', 3),
    ('Business Hotels', 'Бизнес хотели', 'business-hotels', 'Business traveler hotels', 'Хотели за бизнес пътници', 4),
    ('Spa Hotels', 'СПА хотели', 'spa-hotels-sale', 'Hotels with spa facilities', 'Хотели със СПА съоръжения', 5),
    ('Historic Hotels', 'Исторически хотели', 'historic-hotels', 'Hotels in historic buildings', 'Хотели в исторически сгради', 6),
    ('Apart-Hotels', 'Апарт хотели', 'apart-hotels', 'Apartment hotels', 'Апартаментни хотели', 7)
) AS v(name, name_bg, slug, description, description_bg, display_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug)
  AND EXISTS (SELECT 1 FROM categories WHERE slug = 'hotels-sale');
;
