
-- =====================================================
-- 📚 PROMOTE BOOKS TO L0 CATEGORY
-- Date: December 4, 2025
-- Action: Move Books from Hobbies L1 to standalone L0
-- =====================================================

-- Step 1: Update Books & Reading to be L0 (remove parent, update display_order)
UPDATE categories
SET 
    parent_id = NULL,
    name = 'Books',
    name_bg = 'Книги',
    display_order = 22,
    description = 'Books, textbooks, magazines, comics, and reading materials in all formats',
    description_bg = 'Книги, учебници, списания, комикси и материали за четене във всички формати'
WHERE id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';

-- Step 2: Update existing L2 categories' display order under Books
UPDATE categories SET display_order = 1 WHERE slug = 'books-fiction' AND parent_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
UPDATE categories SET display_order = 2 WHERE slug = 'books-nonfiction' AND parent_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
UPDATE categories SET display_order = 3 WHERE slug = 'textbooks' AND parent_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
UPDATE categories SET display_order = 4 WHERE slug = 'childrens-books' AND parent_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
UPDATE categories SET display_order = 5 WHERE slug = 'lifestyle-books' AND parent_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
UPDATE categories SET display_order = 6 WHERE slug = 'books-comics' AND parent_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
UPDATE categories SET display_order = 7 WHERE slug = 'ebooks-audiobooks' AND parent_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
UPDATE categories SET display_order = 8 WHERE slug = 'books-rare' AND parent_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
UPDATE categories SET display_order = 9 WHERE slug = 'books-zines' AND parent_id = 'e4ef706b-e8a0-499e-a1de-da52dec2ceac';
;
