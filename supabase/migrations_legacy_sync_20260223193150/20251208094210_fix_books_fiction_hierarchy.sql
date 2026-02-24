
-- Fix books-fiction hierarchy: delete duplicates, keep only one per genre
DO $$
DECLARE
  v_books_fiction UUID;
BEGIN
  SELECT id INTO v_books_fiction FROM categories WHERE slug = 'books-fiction';
  
  -- Fantasy: keep fiction-fantasy, delete 4 duplicates
  DELETE FROM categories WHERE slug IN (
    'books-fantasy', 'fantasy', 'fantasy-books', 'sci-fi-fantasy'
  ) AND parent_id = v_books_fiction;
  
  -- Horror: keep fiction-horror, delete 4 duplicates
  DELETE FROM categories WHERE slug IN (
    'books-horror', 'horror', 'horror-books', 'horror-fiction'
  ) AND parent_id = v_books_fiction;
  
  -- Sci-fi: keep fiction-sci-fi, delete 5 duplicates
  DELETE FROM categories WHERE slug IN (
    'books-sci-fi', 'books-scifi', 'fiction-scifi', 'science-fiction', 'science-fiction-books'
  ) AND parent_id = v_books_fiction;
  
  -- Mystery/thriller: keep fiction-mystery-thriller, delete 4 duplicates
  DELETE FROM categories WHERE slug IN (
    'books-mystery', 'books-mystery-thriller', 'fiction-thriller', 'mystery-books', 'mystery-thriller'
  ) AND parent_id = v_books_fiction;
  
  -- Romance: keep fiction-romance, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('books-romance', 'romance', 'romance-books') 
    AND parent_id = v_books_fiction;
  
  -- Historical: keep fiction-historical, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('books-historical', 'historical-fiction') 
    AND parent_id = v_books_fiction;
  
  -- Short stories: keep fiction-short-stories, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('fiction-short', 'short-stories') 
    AND parent_id = v_books_fiction;
  
  -- Literary: keep fiction-literary, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('books-literary', 'literary-fiction') 
    AND parent_id = v_books_fiction;
  
  RAISE NOTICE 'Books-fiction hierarchy fixed';
END $$;
;
