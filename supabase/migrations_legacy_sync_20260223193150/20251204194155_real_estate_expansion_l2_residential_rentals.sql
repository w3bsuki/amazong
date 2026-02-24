
-- ============================================================================
-- REAL ESTATE EXPANSION - PHASE 2C: L2 CATEGORIES FOR RESIDENTIAL RENTALS
-- ============================================================================

INSERT INTO categories (id, name, name_bg, slug, parent_id, description, description_bg, display_order)
SELECT * FROM (VALUES
    -- Studios already exists: studios-rent (2d1bcad9-6830-4af6-ab7f-02c64fd2edb1)
    -- Box Studios exists: box-studios-rent
    -- 2-Room exists: apartments-2room-rent
    -- 3-Room exists: apartments-3room-rent
    
    (gen_random_uuid(), '1-Bedroom Apartments Rent', 'Едностайни под наем', 'apartments-1room-rent',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'One bedroom apartments for rent', 'Едностайни апартаменти под наем', 2),
    
    (gen_random_uuid(), '4-Room Apartments Rent', 'Четиристайни под наем', 'apartments-4room-rent',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Four room apartments for rent', 'Четиристайни апартаменти под наем', 5),
    
    (gen_random_uuid(), '5+ Room Apartments Rent', 'Многостайни под наем', 'apartments-5room-rent',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Large apartments with 5+ rooms for rent', 'Многостайни апартаменти 5+ под наем', 6),
    
    (gen_random_uuid(), 'Maisonettes Rent', 'Мезонети под наем', 'maisonettes-rent',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Maisonette apartments for rent', 'Мезонети под наем', 7),
    
    (gen_random_uuid(), 'Penthouses Rent', 'Пентхауси под наем', 'penthouses-rent',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Penthouse apartments for rent', 'Пентхауси под наем', 8),
    
    (gen_random_uuid(), 'Loft Apartments Rent', 'Лофт под наем', 'lofts-rent',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Loft style apartments for rent', 'Лофт апартаменти под наем', 9),
    
    -- House Rentals
    (gen_random_uuid(), 'Houses for Rent', 'Къщи под наем', 'houses-rent',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Houses for rent', 'Къщи под наем', 10),
    
    (gen_random_uuid(), 'Villas for Rent', 'Вили под наем', 'villas-rent',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Villas for rent', 'Вили под наем', 11),
    
    (gen_random_uuid(), 'Furnished Rentals', 'Обзаведени под наем', 'furnished-rentals',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Fully furnished properties for rent', 'Напълно обзаведени имоти под наем', 12),
    
    (gen_random_uuid(), 'Unfurnished Rentals', 'Необзаведени под наем', 'unfurnished-rentals',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Unfurnished properties for rent', 'Необзаведени имоти под наем', 13),
    
    -- Short-term Rentals
    (gen_random_uuid(), 'Short-Term Rentals', 'Краткосрочен наем', 'short-term-rentals',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Short-term and monthly rentals', 'Краткосрочен и месечен наем', 14),
    
    (gen_random_uuid(), 'Student Housing', 'Студентски квартири', 'student-housing',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Student accommodation and housing', 'Студентски квартири и жилища', 15),
    
    (gen_random_uuid(), 'Rooms for Rent', 'Стаи под наем', 'rooms-rent',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Single rooms for rent', 'Единични стаи под наем', 16),
    
    (gen_random_uuid(), 'Shared Apartments', 'Споделени жилища', 'shared-apartments',
     '87565762-319d-4cfa-85cd-cabb157f75ef'::uuid,
     'Shared accommodation and co-living', 'Споделени жилища и съквартиранти', 17)
) AS new_cats(id, name, name_bg, slug, parent_id, description, description_bg, display_order)
WHERE NOT EXISTS (
    SELECT 1 FROM categories c WHERE c.slug = new_cats.slug
);
;
