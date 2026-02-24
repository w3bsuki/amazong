
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 2B: L2 CATEGORIES FOR RESIDENTIAL SALES
-- Based on imot.bg, homes.bg, OLX Bulgaria market structure
-- ============================================================================

-- Get parent IDs
DO $$
DECLARE
    v_residential_sales_id UUID := '2b174600-a166-48dd-9404-d824555f3612';
BEGIN
    NULL;
END $$;

-- RESIDENTIAL SALES - L2 Categories (Property Types for Sale)
INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT * FROM (VALUES
    -- Apartments by room count (Bulgarian style)
    (gen_random_uuid(), 'Studios for Sale', 'Гарсониери продава', 'studios-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Studio apartments for sale', 'Гарсониери за продажба', 1),
     
    (gen_random_uuid(), '1-Bedroom Apartments', 'Едностайни апартаменти', 'apartments-1room-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'One bedroom apartments for sale', 'Едностайни апартаменти за продажба', 2),
    
    -- Note: 2-room (7941eb4d-e92e-4151-9192-39cc927cf40b) and 3-room already exist
    
    (gen_random_uuid(), '4-Room Apartments', 'Четиристайни апартаменти', 'apartments-4room-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Four room apartments for sale', 'Четиристайни апартаменти за продажба', 5),
    
    (gen_random_uuid(), '5+ Room Apartments', 'Многостайни апартаменти', 'apartments-5room-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Large apartments with 5+ rooms for sale', 'Многостайни апартаменти 5+ стаи за продажба', 6),
    
    (gen_random_uuid(), 'Maisonettes', 'Мезонети', 'maisonettes-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Duplex maisonette apartments for sale', 'Мезонети за продажба', 7),
    
    (gen_random_uuid(), 'Penthouses', 'Пентхауси', 'penthouses-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Penthouse apartments for sale', 'Пентхауси за продажба', 8),
    
    (gen_random_uuid(), 'Loft Apartments', 'Лофт апартаменти', 'lofts-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Loft style apartments for sale', 'Лофт апартаменти за продажба', 9),
    
    (gen_random_uuid(), 'Attic Apartments', 'Тавански апартаменти', 'attic-apartments-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Converted attic apartments for sale', 'Тавански апартаменти за продажба', 10),
    
    -- House Types
    (gen_random_uuid(), 'Detached Houses', 'Самостоятелни къщи', 'detached-houses-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Detached single-family houses for sale', 'Самостоятелни къщи за продажба', 11),
    
    (gen_random_uuid(), 'Semi-Detached Houses', 'Близнаци', 'semi-detached-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Semi-detached houses for sale', 'Къщи близнаци за продажба', 12),
    
    (gen_random_uuid(), 'Townhouses', 'Редови къщи', 'townhouses-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Townhouse properties for sale', 'Редови къщи за продажба', 13),
    
    (gen_random_uuid(), 'Villas', 'Вили', 'villas-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Villas for sale', 'Вили за продажба', 14),
    
    (gen_random_uuid(), 'Country Houses', 'Селски къщи', 'country-houses-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Country and rural houses for sale', 'Селски къщи за продажба', 15),
    
    (gen_random_uuid(), 'Bungalows', 'Бунгала', 'bungalows-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Single-story bungalows for sale', 'Едноетажни бунгала за продажба', 16),
    
    (gen_random_uuid(), 'Farmhouses', 'Селскостопански къщи', 'farmhouses-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Farmhouses and rural estates for sale', 'Селскостопански къщи за продажба', 17),
    
    -- Special Property Types
    (gen_random_uuid(), 'Whole Buildings', 'Цели сгради', 'whole-buildings-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Entire residential buildings for sale', 'Цели жилищни сгради за продажба', 18),
    
    (gen_random_uuid(), 'New Build Apartments', 'Новострой апартаменти', 'newbuild-apartments-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Newly constructed apartments Act 16', 'Новопостроени апартаменти с Акт 16', 19),
    
    (gen_random_uuid(), 'Off-Plan Properties', 'На зелено', 'offplan-sale',
     '2b174600-a166-48dd-9404-d824555f3612'::uuid,
     'Properties available for purchase before completion', 'Имоти на зелено преди завършване', 20)
) AS new_cats(id, name, name_bg, slug, parent_id, description, description_bg, display_order)
WHERE NOT EXISTS (
    SELECT 1 FROM categories c WHERE c.slug = new_cats.slug
);
;
