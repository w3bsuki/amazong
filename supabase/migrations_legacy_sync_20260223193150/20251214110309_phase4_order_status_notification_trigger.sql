-- ============================================================================
-- TRIGGER: Auto-create notification on order status change
-- ============================================================================
CREATE OR REPLACE FUNCTION public.notify_on_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  buyer_id UUID;
  product_title TEXT;
  status_title TEXT;
  status_body TEXT;
BEGIN
  -- Only trigger on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get buyer_id from order
  SELECT o.user_id INTO buyer_id
  FROM orders o WHERE o.id = NEW.order_id;
  
  -- Get product title
  SELECT p.title INTO product_title
  FROM products p WHERE p.id = NEW.product_id;
  
  -- Set notification content based on status
  CASE NEW.status
    WHEN 'received' THEN
      status_title := 'Order Confirmed';
      status_body := 'Seller has received your order for ' || COALESCE(product_title, 'your item');
    WHEN 'processing' THEN
      status_title := 'Order Processing';
      status_body := 'Your order for ' || COALESCE(product_title, 'your item') || ' is being prepared';
    WHEN 'shipped' THEN
      status_title := 'Order Shipped! 📦';
      status_body := 'Your order for ' || COALESCE(product_title, 'your item') || ' is on its way';
    WHEN 'delivered' THEN
      status_title := 'Order Delivered ✓';
      status_body := 'Your order for ' || COALESCE(product_title, 'your item') || ' has been delivered';
    WHEN 'cancelled' THEN
      status_title := 'Order Cancelled';
      status_body := 'Your order for ' || COALESCE(product_title, 'your item') || ' has been cancelled';
    ELSE
      RETURN NEW; -- Don't notify for other statuses
  END CASE;
  
  -- Create notification for buyer
  INSERT INTO notifications (user_id, type, title, body, order_id, product_id, data)
  VALUES (
    buyer_id,
    'order_status',
    status_title,
    status_body,
    NEW.order_id,
    NEW.product_id,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'tracking_number', NEW.tracking_number,
      'shipping_carrier', NEW.shipping_carrier
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_order_item_status_change_notify ON public.order_items;
CREATE TRIGGER on_order_item_status_change_notify
  AFTER UPDATE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_order_status_change();;
