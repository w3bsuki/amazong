-- =====================================================
-- ORDER ITEM STATUS & AUTO-NOTIFICATION SYSTEM
-- Date: 2024-12-13
-- Purpose: Enable order tracking with auto-chat notifications
-- =====================================================

-- Step 1: Add status and tracking columns to order_items
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'received', 'processing', 'shipped', 'delivered', 'cancelled'));

ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS seller_received_at TIMESTAMPTZ;

ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;

ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS tracking_number TEXT;

ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS shipping_carrier TEXT;

-- Step 2: Add comments for documentation
COMMENT ON COLUMN public.order_items.status IS 'Order item status: pending (new), received (seller acknowledged), processing (preparing), shipped (sent to courier), delivered (confirmed), cancelled';
COMMENT ON COLUMN public.order_items.tracking_number IS 'Shipping tracking number provided by seller';
COMMENT ON COLUMN public.order_items.shipping_carrier IS 'Shipping carrier name (e.g., Speedy, Econt, DHL)';

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_order_items_status ON public.order_items(status);
CREATE INDEX IF NOT EXISTS idx_order_items_seller_status ON public.order_items(seller_id, status);

-- Step 4: RLS policy for sellers to update their own order items
DROP POLICY IF EXISTS "sellers_update_own_order_items" ON public.order_items;
CREATE POLICY "sellers_update_own_order_items"
  ON public.order_items FOR UPDATE
  USING (seller_id = (SELECT auth.uid()))
  WITH CHECK (seller_id = (SELECT auth.uid()));

-- Step 5: Trigger function to create conversation and send system message on new order
CREATE OR REPLACE FUNCTION public.handle_new_order_item()
RETURNS TRIGGER AS $$
DECLARE
  conv_id UUID;
  product_title TEXT;
  buyer_id UUID;
  existing_conv UUID;
BEGIN
  -- Get order details
  SELECT o.user_id INTO buyer_id
  FROM public.orders o WHERE o.id = NEW.order_id;

  -- Skip if no buyer (shouldn't happen but safety check)
  IF buyer_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get product details
  SELECT p.title INTO product_title
  FROM public.products p WHERE p.id = NEW.product_id;

  -- Check if conversation already exists for this order+seller combo
  SELECT id INTO existing_conv
  FROM public.conversations
  WHERE order_id = NEW.order_id 
    AND buyer_id = buyer_id 
    AND seller_id = NEW.seller_id
  LIMIT 1;

  -- If conversation exists, just add a message for this item
  IF existing_conv IS NOT NULL THEN
    conv_id := existing_conv;
  ELSE
    -- Create new conversation
    INSERT INTO public.conversations (buyer_id, seller_id, product_id, order_id, subject, status)
    VALUES (buyer_id, NEW.seller_id, NEW.product_id, NEW.order_id, 
            'Order: ' || COALESCE(LEFT(product_title, 50), 'New Order'), 'open')
    RETURNING id INTO conv_id;
  END IF;

  -- Insert system message about the purchase (use buyer as sender since they initiated)
  INSERT INTO public.messages (conversation_id, sender_id, content, message_type)
  VALUES (
    conv_id,
    buyer_id,
    '🛒 **New Order Placed!**' || E'\n\n' ||
    '📦 Product: ' || COALESCE(product_title, 'Item') || E'\n' ||
    '💰 Price: $' || NEW.price_at_purchase::TEXT || E'\n' ||
    '🔢 Quantity: ' || NEW.quantity::TEXT || E'\n' ||
    '📅 Date: ' || TO_CHAR(NOW(), 'Mon DD, YYYY at HH24:MI') || E'\n\n' ||
    '_Waiting for seller confirmation..._',
    'system'
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the order creation
  RAISE WARNING 'Error in handle_new_order_item: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 6: Create trigger for new order items
DROP TRIGGER IF EXISTS on_order_item_created ON public.order_items;
CREATE TRIGGER on_order_item_created
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_order_item();

-- Step 7: Trigger function to send system message on order item status change
CREATE OR REPLACE FUNCTION public.handle_order_item_status_change()
RETURNS TRIGGER AS $$
DECLARE
  conv_id UUID;
  buyer_id UUID;
  status_message TEXT;
BEGIN
  -- Only trigger on actual status changes
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get buyer_id from order
  SELECT o.user_id INTO buyer_id
  FROM public.orders o WHERE o.id = NEW.order_id;

  -- Find the conversation
  SELECT id INTO conv_id
  FROM public.conversations
  WHERE order_id = NEW.order_id 
    AND buyer_id = buyer_id 
    AND seller_id = NEW.seller_id
  LIMIT 1;

  -- Set timestamps and message based on status
  CASE NEW.status
    WHEN 'received' THEN
      NEW.seller_received_at := NOW();
      status_message := '✅ **Order Confirmed!**' || E'\n\n' ||
        'The seller has confirmed your order and will prepare it for shipping.';
    WHEN 'processing' THEN
      status_message := '📦 **Order Processing**' || E'\n\n' ||
        'Your order is being prepared for shipping.';
    WHEN 'shipped' THEN
      NEW.shipped_at := NOW();
      status_message := '🚚 **Order Shipped!**' || E'\n\n' ||
        'Your order is on its way!' ||
        CASE WHEN NEW.tracking_number IS NOT NULL 
          THEN E'\n\n📍 Tracking Number: ' || NEW.tracking_number ||
               CASE WHEN NEW.shipping_carrier IS NOT NULL 
                 THEN E'\n🏢 Carrier: ' || NEW.shipping_carrier 
                 ELSE '' 
               END
          ELSE E'\n\n_No tracking number provided_'
        END;
    WHEN 'delivered' THEN
      NEW.delivered_at := NOW();
      status_message := '🎉 **Order Delivered!**' || E'\n\n' ||
        'Your order has been marked as delivered. Enjoy your purchase!' || E'\n\n' ||
        '_If you have any issues, please contact the seller._';
    WHEN 'cancelled' THEN
      status_message := '❌ **Order Cancelled**' || E'\n\n' ||
        'This order has been cancelled. If you have questions, please message the seller.';
    ELSE
      status_message := '📋 **Status Update**' || E'\n\n' ||
        'Order status changed to: ' || NEW.status;
  END CASE;

  -- Insert system message if conversation exists
  IF conv_id IS NOT NULL AND status_message IS NOT NULL THEN
    INSERT INTO public.messages (conversation_id, sender_id, content, message_type)
    VALUES (
      conv_id,
      NEW.seller_id,
      status_message,
      'system'
    );
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the status update
  RAISE WARNING 'Error in handle_order_item_status_change: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 8: Create trigger for status changes
DROP TRIGGER IF EXISTS on_order_item_status_change ON public.order_items;
CREATE TRIGGER on_order_item_status_change
  BEFORE UPDATE OF status ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_item_status_change();

-- Step 9: Add order_items to realtime publication for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;;
