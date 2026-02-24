
-- ============================================
-- PHASE 9: CONSOLIDATE HOBBIES CATEGORY
-- ============================================
-- Hobbies L0 ID: 1f8594aa-0530-4a5a-b3ca-31cbe83bc055
-- Collectibles L0 ID: e30a518e-ad9e-45be-84d3-0cec45cc239c
-- Musical Instruments L0 ID: 78d2796b-c563-46d4-8e55-3b1cd281b607
-- Movies & Music L0 ID: 07e94dbe-f6de-4231-bdde-77a13aa0babc

-- Rename Hobbies to be more comprehensive
UPDATE categories 
SET name = 'Hobbies & Collectibles',
    name_bg = 'Хоби и колекции'
WHERE id = '1f8594aa-0530-4a5a-b3ca-31cbe83bc055';

-- Move Collectibles as L1 under Hobbies
UPDATE categories 
SET parent_id = '1f8594aa-0530-4a5a-b3ca-31cbe83bc055',
    display_order = 1
WHERE id = 'e30a518e-ad9e-45be-84d3-0cec45cc239c';

-- Move Musical Instruments as L1 under Hobbies
UPDATE categories 
SET parent_id = '1f8594aa-0530-4a5a-b3ca-31cbe83bc055',
    display_order = 2
WHERE id = '78d2796b-c563-46d4-8e55-3b1cd281b607';

-- Move Movies & Music as L1 under Hobbies
UPDATE categories 
SET parent_id = '1f8594aa-0530-4a5a-b3ca-31cbe83bc055',
    display_order = 3
WHERE id = '07e94dbe-f6de-4231-bdde-77a13aa0babc';

-- ============================================
-- PHASE 10: CONSOLIDATE SERVICES
-- ============================================
-- Services L0 ID: 4aa24e30-4596-4d22-85e5-7558936163b3
-- Tickets L0 ID: 3a1ffadf-d097-4fb3-86f8-6e02f3693d32

-- Rename Services
UPDATE categories 
SET name = 'Services & Events',
    name_bg = 'Услуги и събития'
WHERE id = '4aa24e30-4596-4d22-85e5-7558936163b3';

-- Move Tickets as L1 under Services
UPDATE categories 
SET parent_id = '4aa24e30-4596-4d22-85e5-7558936163b3',
    display_order = 1
WHERE id = '3a1ffadf-d097-4fb3-86f8-6e02f3693d32';

-- ============================================
-- PHASE 11: MERGE WHOLESALE INTO SERVICES OR DEPRECATE
-- ============================================
-- Wholesale L0 ID: 405303e7-dbab-4a7a-8654-4e1e1ff3074f

-- Mark Wholesale as deprecated (it's a business feature, not a product category)
UPDATE categories 
SET name = '[DEPRECATED] Wholesale',
    name_bg = '[СКРИТО] Търговия на едро',
    display_order = 9992
WHERE id = '405303e7-dbab-4a7a-8654-4e1e1ff3074f';

-- ============================================
-- PHASE 12: MERGE INDUSTRIAL INTO TOOLS
-- ============================================
-- Tools L0 ID: e6f6ece0-ec00-4c0f-8b57-c52ae40a7399
-- Industrial L0 ID: be6fd810-03db-44a8-bdb9-04bb667c3b4f

-- Rename Tools
UPDATE categories 
SET name = 'Tools & Industrial',
    name_bg = 'Инструменти и индустриално'
WHERE id = 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399';

-- Move Industrial as L1 under Tools
UPDATE categories 
SET parent_id = 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399',
    display_order = 1
WHERE id = 'be6fd810-03db-44a8-bdb9-04bb667c3b4f';

-- ============================================
-- PHASE 13: MERGE HANDMADE INTO HOBBIES
-- ============================================
-- Handmade L0 ID: eadd0397-3c7c-47a1-9dae-fcaa91ed853f

-- Move Handmade as L1 under Hobbies
UPDATE categories 
SET parent_id = '1f8594aa-0530-4a5a-b3ca-31cbe83bc055',
    display_order = 4
WHERE id = 'eadd0397-3c7c-47a1-9dae-fcaa91ed853f';

-- ============================================
-- PHASE 14: MERGE BOOKS INTO HOBBIES
-- ============================================
-- Books L0 ID: e4ef706b-e8a0-499e-a1de-da52dec2ceac

-- Move Books as L1 under Hobbies
UPDATE categories 
SET parent_id = '1f8594aa-0530-4a5a-b3ca-31cbe83bc055',
    display_order = 5
WHERE id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';

-- ============================================
-- PHASE 15: HANDLE GIFT CARDS - Move to Services
-- ============================================
-- Gift Cards L0 ID: f90e22dd-bc8b-42b5-babb-3c985a9de633

-- Move Gift Cards under Services
UPDATE categories 
SET parent_id = '4aa24e30-4596-4d22-85e5-7558936163b3',
    display_order = 2
WHERE id = 'f90e22dd-bc8b-42b5-babb-3c985a9de633';

-- ============================================
-- PHASE 16: HANDLE AGRICULTURE - Keep or merge into Industrial
-- ============================================
-- Agriculture L0 ID: d8539881-7635-4262-a994-1203d6eae5b4

-- Move Agriculture under Tools & Industrial
UPDATE categories 
SET parent_id = 'e6f6ece0-ec00-4c0f-8b57-c52ae40a7399',
    display_order = 2
WHERE id = 'd8539881-7635-4262-a994-1203d6eae5b4';
;
