-- Update the condition check constraint to match sell form options
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_condition_check;

ALTER TABLE products ADD CONSTRAINT products_condition_check 
CHECK (condition = ANY (ARRAY[
  -- New/unused items
  'new',              -- Keep for backwards compatibility
  'new-with-tags',
  'new-without-tags',
  -- Used items
  'used',             -- Keep for backwards compatibility
  'used-like-new',
  'used-excellent',
  'used-good',
  'used-fair',
  -- Legacy values for backwards compatibility
  'refurbished',
  'like_new',
  'good',
  'fair'
]));

-- Also update the default to be more explicit
ALTER TABLE products ALTER COLUMN condition SET DEFAULT 'new';;
