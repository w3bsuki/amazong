-- Fix: handle_order_item_status_change() conversation lookup
--
-- Bug was caused by a variable name shadowing a column name:
--   AND buyer_id = buyer_id
-- which is a tautology and may select the wrong conversation.

CREATE OR REPLACE FUNCTION public.handle_order_item_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  conv_id UUID;
  v_buyer_id UUID;
  status_message TEXT;
BEGIN
  -- Only trigger on actual status changes
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get buyer_id from order
  SELECT o.user_id INTO v_buyer_id
  FROM public.orders o WHERE o.id = NEW.order_id;

  -- Find the conversation
  SELECT c.id INTO conv_id
  FROM public.conversations c
  WHERE c.order_id = NEW.order_id
    AND c.buyer_id = v_buyer_id
    AND c.seller_id = NEW.seller_id
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
  RAISE WARNING 'Error in handle_order_item_status_change: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$function$;
