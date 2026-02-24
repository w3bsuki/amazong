-- Remove useless index on attributes->>'condition' since condition lives in dedicated column
DROP INDEX IF EXISTS idx_products_attributes_condition;;
