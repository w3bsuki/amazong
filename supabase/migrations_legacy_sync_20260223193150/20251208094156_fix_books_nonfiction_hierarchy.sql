
-- Fix books-nonfiction hierarchy: delete duplicates, keep only one per genre
DO $$
DECLARE
  v_books_nonfiction UUID;
BEGIN
  SELECT id INTO v_books_nonfiction FROM categories WHERE slug = 'books-nonfiction';
  
  -- Keep only the best-named variant for each genre, delete duplicates
  -- Biography: keep nonfiction-biography, delete 5 duplicates
  DELETE FROM categories WHERE slug IN (
    'biographies', 'biography', 'biography-books', 'biography-memoir', 
    'books-biography', 'nonfic-biography'
  ) AND parent_id = v_books_nonfiction;
  
  -- Business: keep nonfiction-business, delete 4 duplicates
  DELETE FROM categories WHERE slug IN (
    'books-business', 'business-books', 'business-economics-books', 
    'business-finance-books', 'nonfic-business'
  ) AND parent_id = v_books_nonfiction;
  
  -- Cooking: keep nonfiction-cooking, delete 3 duplicates
  DELETE FROM categories WHERE slug IN (
    'books-cookbooks', 'books-cooking', 'cookbooks', 'nonfic-cookbooks'
  ) AND parent_id = v_books_nonfiction;
  
  -- History: keep nonfiction-history, delete 3 duplicates
  DELETE FROM categories WHERE slug IN (
    'books-history', 'history-books', 'nonfic-history'
  ) AND parent_id = v_books_nonfiction;
  
  -- Science: keep nonfiction-science, delete 3 duplicates
  DELETE FROM categories WHERE slug IN (
    'books-science', 'nonfic-science', 'science-books', 'science-nature-books'
  ) AND parent_id = v_books_nonfiction;
  
  -- Self-help: keep nonfiction-self-help, delete 3 duplicates
  DELETE FROM categories WHERE slug IN (
    'books-self-help', 'nonfic-selfhelp', 'self-help', 'self-help-books'
  ) AND parent_id = v_books_nonfiction;
  
  -- Travel: keep nonfiction-travel, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('books-travel', 'travel-books') 
    AND parent_id = v_books_nonfiction;
  
  -- Art: keep nonfiction-art, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('arts-photography', 'books-art') 
    AND parent_id = v_books_nonfiction;
  
  -- Health: keep nonfiction-health, delete 2 duplicates
  DELETE FROM categories WHERE slug IN ('health-wellness-books', 'lifestyle-books') 
    AND parent_id = v_books_nonfiction;
  
  -- True crime: keep nonfiction-true-crime, delete duplicate
  DELETE FROM categories WHERE slug = 'true-crime' AND parent_id = v_books_nonfiction;
  
  -- Philosophy: keep nonfiction-philosophy, delete duplicate
  DELETE FROM categories WHERE slug = 'philosophy-books' AND parent_id = v_books_nonfiction;
  
  -- Psychology: keep nonfiction-psychology, delete duplicate
  DELETE FROM categories WHERE slug = 'psychology-books' AND parent_id = v_books_nonfiction;
  
  RAISE NOTICE 'Books-nonfiction hierarchy fixed';
END $$;
;
