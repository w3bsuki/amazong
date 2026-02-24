
-- Fix books L0 hierarchy: Consolidate duplicate L1s

-- 1. Consolidate fiction duplicates - move all to books-fiction
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'books-fiction')
WHERE parent_id IN (
  SELECT id FROM categories WHERE slug IN ('fiction', 'fiction-books')
);
DELETE FROM categories WHERE slug IN ('fiction', 'fiction-books') 
AND parent_id = (SELECT id FROM categories WHERE slug = 'books');

-- 2. Consolidate non-fiction duplicates - move all to books-nonfiction
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'books-nonfiction')
WHERE parent_id IN (
  SELECT id FROM categories WHERE slug IN ('non-fiction', 'non-fiction-books')
);
DELETE FROM categories WHERE slug IN ('non-fiction', 'non-fiction-books')
AND parent_id = (SELECT id FROM categories WHERE slug = 'books');

-- 3. Move fiction sub-genres under books-fiction
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'books-fiction')
WHERE slug IN ('books-mystery-thriller', 'mystery-books', 'books-sci-fi', 'sci-fi-fantasy')
AND parent_id = (SELECT id FROM categories WHERE slug = 'books');

-- 4. Move non-fiction sub-genres under books-nonfiction
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'books-nonfiction')
WHERE slug IN ('biography-books', 'self-help-books', 'lifestyle-books', 'books-cookbooks', 'cookbooks', 'arts-photography', 'books-art')
AND parent_id = (SELECT id FROM categories WHERE slug = 'books');

-- 5. Consolidate children's books - move all to childrens-books
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'childrens-books')
WHERE slug IN ('books-children', 'children-books', 'books-picture', 'books-young-adult')
AND parent_id = (SELECT id FROM categories WHERE slug = 'books');

-- 6. Consolidate comics - move all to books-comics
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'books-comics')
WHERE slug IN ('books-comics-manga', 'comics-manga')
AND parent_id = (SELECT id FROM categories WHERE slug = 'books');

-- 7. Move textbooks duplicate under textbooks
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'textbooks')
WHERE slug = 'books-textbooks'
AND parent_id = (SELECT id FROM categories WHERE slug = 'books');

-- 8. Consolidate Bulgarian books - move to books-bulgarian
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'books-bulgarian')
WHERE slug = 'bulgarian-books'
AND parent_id = (SELECT id FROM categories WHERE slug = 'books');

-- 9. Consolidate magazines - move to books-magazines
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'books-magazines')
WHERE slug = 'magazines'
AND parent_id = (SELECT id FROM categories WHERE slug = 'books');

-- 10. Move ebooks under books-ebooks or create proper category
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'books-ebooks')
WHERE slug = 'ebooks-audiobooks'
AND parent_id = (SELECT id FROM categories WHERE slug = 'books');

-- Final L1s should be: books-fiction, books-nonfiction, textbooks, childrens-books,
-- books-magazines, books-foreign, books-accessories, books-bulgarian, books-comics,
-- books-rare, books-zines, books-ebooks
;
