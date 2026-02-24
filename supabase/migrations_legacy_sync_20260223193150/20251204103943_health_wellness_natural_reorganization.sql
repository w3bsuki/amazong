
-- ============================================================================
-- REORGANIZE NATURAL & ALTERNATIVE WELLNESS
-- Split "CBD & Mushrooms" into separate L2 categories
-- Move "Sleep & Relaxation" to Supplements & Vitamins where it belongs
-- ============================================================================

-- Parent IDs:
-- Natural & Alternative Wellness: d1cdc34b-0005-4000-8000-000000000005
-- Supplements & Vitamins: d1cdc34b-0001-4000-8000-000000000001
-- Old "CBD & Mushrooms" parent: f5231b56-37ef-49dd-9632-5f807e859a35

-- STEP 1: Create NEW L2 categories under Natural & Alternative Wellness
INSERT INTO categories (id, name, name_bg, slug, description, description_bg, parent_id, image_url) VALUES
-- CBD Products - dedicated category
('d1cdc34b-0005-4000-8000-000000000010', 'CBD Products', 'CBD продукти', 'cbd-products',
 'High-quality CBD oils, edibles, topicals, and more',
 'Висококачествени CBD масла, храни, локални продукти и още',
 'd1cdc34b-0005-4000-8000-000000000005', '/categories/cbd-products.webp'),

-- Herbal Remedies - NEW
('d1cdc34b-0005-4000-8000-000000000011', 'Herbal Remedies', 'Билкови средства', 'herbal-remedies',
 'Natural herbal supplements and remedies',
 'Натурални билкови добавки и средства',
 'd1cdc34b-0005-4000-8000-000000000005', '/categories/herbal-remedies.webp'),

-- Traditional Medicine - NEW
('d1cdc34b-0005-4000-8000-000000000012', 'Traditional Medicine', 'Традиционна медицина', 'traditional-medicine',
 'Ayurveda, Traditional Chinese Medicine, and homeopathy',
 'Аюрведа, Традиционна китайска медицина и хомеопатия',
 'd1cdc34b-0005-4000-8000-000000000005', '/categories/traditional-medicine.webp'),

-- Essential Oils & Aromatherapy - NEW (take aromatherapy from Sleep)
('d1cdc34b-0005-4000-8000-000000000013', 'Essential Oils & Aromatherapy', 'Етерични масла и ароматерапия', 'essential-oils-aromatherapy',
 'Pure essential oils and aromatherapy products',
 'Чисти етерични масла и ароматерапевтични продукти',
 'd1cdc34b-0005-4000-8000-000000000005', '/categories/essential-oils.webp');

-- STEP 2: Move CBD-related items from old "CBD & Mushrooms" to new "CBD Products"
UPDATE categories SET parent_id = 'd1cdc34b-0005-4000-8000-000000000010'
WHERE parent_id = 'f5231b56-37ef-49dd-9632-5f807e859a35'
AND slug IN ('cbd-oils', 'cbd-capsules', 'cbd-edibles', 'cbd-topicals', 'cbd-vape', 
             'cbd-flowers', 'cbd-beauty', 'cbd-concentrates', 'cbd-pets', 'cbd-accessories');

-- STEP 3: Move Functional Mushrooms to be direct L2 under Natural & Alternative
UPDATE categories SET parent_id = 'd1cdc34b-0005-4000-8000-000000000005'
WHERE id = 'fd6e7523-3f1a-4d76-99d1-7e98ec19e163'; -- Functional Mushrooms

-- STEP 4: Move Adaptogens to be direct L2 under Natural & Alternative
UPDATE categories SET parent_id = 'd1cdc34b-0005-4000-8000-000000000005'
WHERE id = '8818005c-e105-48f9-8e6c-211c662424d4'; -- Adaptogens

-- STEP 5: Move Hemp Products to be direct L2 under Natural & Alternative
UPDATE categories SET parent_id = 'd1cdc34b-0005-4000-8000-000000000005'
WHERE id = 'b7b44a4e-b552-4c59-9eca-d8e4dd23ef2b'; -- Hemp Products

-- STEP 6: Move Aromatherapy to new Essential Oils & Aromatherapy category
UPDATE categories SET parent_id = 'd1cdc34b-0005-4000-8000-000000000013'
WHERE id = '8ae5b66d-2dad-4904-bbec-76e786e23eaa'; -- Aromatherapy

-- STEP 7: Move Sleep & Relaxation to Supplements & Vitamins (where it belongs!)
UPDATE categories SET parent_id = 'd1cdc34b-0001-4000-8000-000000000001'
WHERE id = 'c21b1b3f-0329-45b4-ab24-d718ebaacba2'; -- Sleep & Relaxation

-- STEP 8: Delete the old "CBD & Mushrooms" parent (now empty)
DELETE FROM categories WHERE id = 'f5231b56-37ef-49dd-9632-5f807e859a35';
;
