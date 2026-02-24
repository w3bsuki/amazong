-- Create a function to check if user is buying their own product
CREATE OR REPLACE FUNCTION check_not_own_product()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the buyer (from the order) is the same as the product seller
  IF EXISTS (
    SELECT 1 
    FROM orders o
    JOIN products p ON p.id = NEW.product_id
    WHERE o.id = NEW.order_id 
    AND o.user_id = p.seller_id
  ) THEN
    RAISE EXCEPTION 'You cannot purchase your own products';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent self-purchase
DROP TRIGGER IF EXISTS prevent_self_purchase_trigger ON order_items;
CREATE TRIGGER prevent_self_purchase_trigger
  BEFORE INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION check_not_own_product();;
