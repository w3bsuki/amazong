-- Add missing foreign key constraint from products to categories
ALTER TABLE products
ADD CONSTRAINT products_category_id_fkey 
FOREIGN KEY (category_id) 
REFERENCES categories(id)
ON DELETE SET NULL;;
